import express from 'express'
import cors from 'cors'
import https from 'https'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { SAMPLE_CHANNELS } from './samples.mjs'

const app = express()
const PORT = process.env.PORT || 3001
const CONFIG_FILE = process.env.VERCEL ? path.join('/tmp', 'config.json') : path.resolve('config.json')

app.use(cors())
app.use(express.json())

// ============================
// State & Configuration
// ============================

let oauthConfig = {
  clientId: process.env.KICK_CLIENT_ID || '',
  clientSecret: process.env.KICK_CLIENT_SECRET || '',
  redirectUri: process.env.KICK_REDIRECT_URI || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/callback` : 'http://localhost:5173/callback'),
}

let appToken = null        // { access_token, expires_at }
let userToken = null       // { access_token, refresh_token, expires_at, scope }
let pkceVerifier = null    // PKCE code verifier for user auth flow

// Load config from disk if present
function loadSavedConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'))
      if (data.clientId) oauthConfig.clientId = data.clientId
      if (data.clientSecret) oauthConfig.clientSecret = data.clientSecret
      if (data.redirectUri) oauthConfig.redirectUri = data.redirectUri
      console.log('[KickView] 📂 Loaded credentials from config.json')
    }
  } catch (err) {
    console.warn('[KickView] Notice: could not load config.json:', err.message)
  }
}

function saveConfigToDisk() {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({
      clientId: oauthConfig.clientId,
      clientSecret: oauthConfig.clientSecret,
      redirectUri: oauthConfig.redirectUri,
    }, null, 2), 'utf-8')
    console.log('[KickView] 💾 Saved credentials to config.json')
  } catch (err) {
    console.warn('[KickView] Failed to write config.json:', err.message)
  }
}

loadSavedConfig()

// ============================
// HTTPS Request Helper
// ============================

function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url)
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'KickView/1.0',
        ...(options.headers || {}),
      }
    }

    const req = https.request(reqOptions, (res) => {
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body: data })
      })
    })

    req.on('error', reject)
    req.setTimeout(12000, () => req.destroy(new Error('Request timeout')))

    if (options.body) {
      req.write(options.body)
    }
    req.end()
  })
}

function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url')
}

function generateCodeChallenge(verifier) {
  return crypto.createHash('sha256').update(verifier).digest('base64url')
}

function isTokenValid(token) {
  return token && token.access_token && token.expires_at > Date.now()
}

// ============================
// Token Management
// ============================

async function getAppAccessToken() {
  if (isTokenValid(appToken)) return appToken.access_token
  if (!oauthConfig.clientId || !oauthConfig.clientSecret) return null

  console.log('[KickView] 🔑 Requesting app access token via Client Credentials...')

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: oauthConfig.clientId,
    client_secret: oauthConfig.clientSecret,
  }).toString()

  try {
    const response = await httpsRequest('https://id.kick.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })

    if (response.status === 200) {
      const data = JSON.parse(response.body)
      appToken = {
        access_token: data.access_token,
        expires_at: Date.now() + (data.expires_in - 60) * 1000,
      }
      console.log('[KickView] ✅ App access token acquired successfully')
      return appToken.access_token
    } else {
      console.error('[KickView] ❌ Token error status:', response.status, response.body)
      return null
    }
  } catch (err) {
    console.error('[KickView] ❌ Token request error:', err.message)
    return null
  }
}

function getActiveToken() {
  if (isTokenValid(userToken)) return userToken.access_token
  if (isTokenValid(appToken)) return appToken.access_token
  return null
}

// ============================
// Kick API Calls
// ============================

// v2 Internal API
async function fetchV2Channel(slug) {
  const url = `https://kick.com/api/v2/channels/${encodeURIComponent(slug)}`
  try {
    const response = await httpsRequest(url, {
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Referer': 'https://kick.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
      }
    })
    if (response.status === 200) {
      return JSON.parse(response.body)
    }
    return null
  } catch {
    return null
  }
}

// Official Kick Public API
async function fetchOfficialChannel(slug, token) {
  const url = `https://api.kick.com/public/v1/channels?slug=${encodeURIComponent(slug)}`
  try {
    const response = await httpsRequest(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (response.status === 200) {
      const parsed = JSON.parse(response.body)
      return parsed.data || parsed
    }
    return null
  } catch (err) {
    console.log(`[KickView] Official channel API error: ${err.message}`)
    return null
  }
}

async function fetchOfficialLivestreams(broadcasterUserId, token) {
  const url = `https://api.kick.com/public/v1/livestreams?broadcaster_user_id=${broadcasterUserId}`
  try {
    const response = await httpsRequest(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (response.status === 200) {
      const parsed = JSON.parse(response.body)
      return parsed.data || parsed
    }
    return null
  } catch { return null }
}

async function fetchOfficialUsers(token) {
  const url = `https://api.kick.com/public/v1/users`
  try {
    const response = await httpsRequest(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (response.status === 200) {
      const parsed = JSON.parse(response.body)
      return parsed.data || parsed
    }
    return null
  } catch { return null }
}

async function fetchOfficialRewards(token) {
  const url = `https://api.kick.com/public/v1/channels/rewards`
  try {
    const response = await httpsRequest(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (response.status === 200) {
      const parsed = JSON.parse(response.body)
      return parsed.data || parsed
    }
    return null
  } catch { return null }
}

async function fetchOfficialLeaderboard(token) {
  const url = `https://api.kick.com/public/v1/kicks/leaderboard`
  try {
    const response = await httpsRequest(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (response.status === 200) {
      const parsed = JSON.parse(response.body)
      return parsed.data || parsed
    }
    return null
  } catch { return null }
}

// ============================
// Routes
// ============================

// Status check
app.get('/api/status', (req, res) => {
  res.json({
    configured: !!(oauthConfig.clientId && oauthConfig.clientSecret),
    hasAppToken: isTokenValid(appToken),
    hasUserToken: isTokenValid(userToken),
    userScope: userToken?.scope || null,
    clientId: oauthConfig.clientId ? oauthConfig.clientId.substring(0, 8) + '...' : null,
    redirectUri: oauthConfig.redirectUri,
  })
})

// Configure OAuth credentials
app.post('/api/setup', async (req, res) => {
  const { clientId, clientSecret, redirectUri } = req.body

  if (!clientId || !clientSecret) {
    return res.status(400).json({ error: 'client_id and client_secret are required' })
  }

  oauthConfig.clientId = clientId.trim()
  oauthConfig.clientSecret = clientSecret.trim()
  if (redirectUri) oauthConfig.redirectUri = redirectUri.trim()

  saveConfigToDisk()

  // Clear existing tokens and request a fresh app token
  appToken = null
  userToken = null

  const token = await getAppAccessToken()

  if (token) {
    return res.json({
      success: true,
      message: 'Connected to Kick API successfully! App token acquired.',
      hasAppToken: true,
      hasUserToken: false,
    })
  } else {
    return res.json({
      success: false,
      message: 'Credentials saved, but Kick rejected the Client Credentials token request. Please double-check Client ID and Secret in your Kick Developer settings.',
      hasAppToken: false,
      hasUserToken: false,
    })
  }
})

// Start OAuth 2.1 PKCE User Login
app.get('/api/auth/login', (req, res) => {
  if (!oauthConfig.clientId) {
    return res.status(400).json({ error: 'Kick Client ID not configured. Please click "Configure API" first.' })
  }

  pkceVerifier = generateCodeVerifier()
  const challenge = generateCodeChallenge(pkceVerifier)
  const state = crypto.randomBytes(16).toString('hex')

  const scopes = [
    'user:read',
    'channel:read',
    'chat:write',
    'channel:rewards:read',
    'kicks:read',
    'events:subscribe',
  ].join(' ')

  const authUrl = new URL('https://id.kick.com/oauth/authorize')
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('client_id', oauthConfig.clientId)
  authUrl.searchParams.set('redirect_uri', oauthConfig.redirectUri)
  authUrl.searchParams.set('scope', scopes)
  authUrl.searchParams.set('state', state)
  authUrl.searchParams.set('code_challenge', challenge)
  authUrl.searchParams.set('code_challenge_method', 'S256')

  res.json({ authUrl: authUrl.toString(), state })
})

// Exchange OAuth Code for Tokens
app.post('/api/auth/callback', async (req, res) => {
  const { code } = req.body

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code.' })
  }
  if (!pkceVerifier) {
    return res.status(400).json({ error: 'PKCE session expired. Please try logging in again.' })
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: oauthConfig.clientId,
    client_secret: oauthConfig.clientSecret,
    code: code,
    redirect_uri: oauthConfig.redirectUri,
    code_verifier: pkceVerifier,
  }).toString()

  try {
    const response = await httpsRequest('https://id.kick.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })

    if (response.status === 200) {
      const data = JSON.parse(response.body)
      userToken = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: Date.now() + (data.expires_in - 60) * 1000,
        scope: data.scope || '',
      }
      pkceVerifier = null
      console.log('[KickView] ✅ User successfully authenticated with Kick!')

      return res.json({
        success: true,
        message: 'Authenticated with Kick successfully!',
        scope: userToken.scope,
      })
    } else {
      console.error('[KickView] Token exchange failed:', response.status, response.body)
      return res.status(400).json({ error: 'Failed to exchange authorization code. The code may be expired or invalid.' })
    }
  } catch (err) {
    console.error('[KickView] Token exchange error:', err.message)
    return res.status(500).json({ error: 'Internal error during authentication exchange.' })
  }
})

// User logout
app.post('/api/auth/logout', (req, res) => {
  userToken = null
  res.json({ success: true, message: 'Logged out successfully.' })
})

// Authenticated User Details (when logged in)
app.get('/api/user/me', async (req, res) => {
  if (!isTokenValid(userToken)) {
    return res.status(401).json({ error: 'User is not logged in with Kick.' })
  }

  try {
    const userData = await fetchOfficialUsers(userToken.access_token)
    const rewards = await fetchOfficialRewards(userToken.access_token)
    res.json({
      user: userData,
      rewards: rewards,
      scope: userToken.scope,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Sample profiles list
app.get('/api/samples', (req, res) => {
  const list = Object.keys(SAMPLE_CHANNELS).map(slug => ({
    slug,
    name: SAMPLE_CHANNELS[slug].user.username,
    followers: SAMPLE_CHANNELS[slug].followers_count,
    isLive: SAMPLE_CHANNELS[slug].livestream?.is_live || false,
  }))
  res.json(list)
})

// ============================
// Main Channel Lookup Endpoint
// ============================

app.get('/api/channel/:slug', async (req, res) => {
  const { slug } = req.params
  const cleanSlug = slug.trim().toLowerCase().replace(/^@/, '')

  if (!cleanSlug || cleanSlug.length > 50) {
    return res.status(400).json({ error: 'Invalid username.' })
  }

  console.log(`\n[KickView] ======= Looking up: ${cleanSlug} =======`)

  let officialData = null
  let v2Data = null
  let livestreamData = null

  // 1) Try Official Public API if token is available
  const token = getActiveToken() || await getAppAccessToken()

  if (token) {
    console.log('[KickView] Calling official Kick API...')
    officialData = await fetchOfficialChannel(cleanSlug, token)

    if (officialData && Array.isArray(officialData) && officialData.length > 0) {
      const channel = officialData[0]
      console.log(`[KickView] ✅ Official API found channel: ${channel.slug}`)

      if (channel.broadcaster_user_id) {
        livestreamData = await fetchOfficialLivestreams(channel.broadcaster_user_id, token)
      }
    } else if (officialData && !Array.isArray(officialData)) {
      console.log(`[KickView] ✅ Official API returned channel data`)
    } else {
      console.log('[KickView] Official API returned empty for slug')
      officialData = null
    }
  }

  // 2) Try v2 internal API for rich data (badges, previous usernames, chatroom config)
  console.log('[KickView] Trying v2 internal API...')
  v2Data = await fetchV2Channel(cleanSlug)
  if (v2Data) {
    console.log(`[KickView] ✅ v2 API returned data for: ${cleanSlug}`)
  } else {
    console.log('[KickView] ℹ️ v2 API returned nothing (Cloudflare protection)')
  }

  // 3) Check Sample / Fallback if neither API returned live data
  if (!officialData && !v2Data) {
    if (SAMPLE_CHANNELS[cleanSlug]) {
      console.log(`[KickView] ⚡ Returning rich sample profile for: ${cleanSlug}`)
      return res.json(SAMPLE_CHANNELS[cleanSlug])
    }

    return res.status(404).json({
      error: `Could not load live data for "${cleanSlug}". Kick requires API credentials or Cloudflare blocked scraping. You can configure your free Kick API keys in "Configure API", or test one of the instant sample profiles (xQc, Trainwreckstv, AdinRoss, Amouranth).`
    })
  }

  // 4) Merge available data
  const channel = v2Data || {}
  const official = Array.isArray(officialData) ? officialData[0] : (officialData || {})
  const livestream = Array.isArray(livestreamData) ? livestreamData[0] : livestreamData

  const merged = {
    id: channel.id || official.broadcaster_user_id,
    user_id: channel.user_id || official.broadcaster_user_id,
    slug: channel.slug || official.slug || cleanSlug,

    // Official API Subscriber metrics
    active_subscribers_count: official.active_subscribers_count ?? null,
    active_gifted_subscribers_count: official.active_gifted_subscribers_count ?? null,
    canceled_subscribers_count: official.canceled_subscribers_count ?? null,
    channel_description: official.channel_description || null,
    stream_title: official.stream_title || channel.livestream?.session_title || null,

    // Flags & Metrics
    is_banned: channel.is_banned ?? false,
    verified: channel.verified ?? null,
    vod_enabled: channel.vod_enabled ?? null,
    subscription_enabled: channel.subscription_enabled ?? null,
    can_host: channel.can_host ?? null,
    muted: channel.muted ?? false,
    playback_url: channel.playback_url || null,
    followers_count: channel.followers_count ?? null,

    // Images
    banner_image: channel.banner_image || (official.banner_picture ? { url: official.banner_picture } : null),
    offline_banner_image: channel.offline_banner_image || null,

    // User details
    user: channel.user || {
      id: official.broadcaster_user_id,
      username: official.slug || cleanSlug,
      profile_pic: null,
      bio: official.channel_description || null,
      instagram: null, twitter: null, youtube: null,
      discord: null, tiktok: null, facebook: null,
      country: null, state: null, city: null,
    },

    // Rich v2 platform data
    subscriber_badges: channel.subscriber_badges || [],
    previous_usernames: channel.previous_usernames || [],
    recent_categories: channel.recent_categories || [],
    ascending_links: channel.ascending_links || [],
    follower_badges: channel.follower_badges || [],
    media: channel.media || [],

    // Chatroom settings
    chatroom: channel.chatroom || null,

    // Livestream
    livestream: channel.livestream || (livestream ? {
      id: livestream.id,
      session_title: livestream.title,
      is_live: true,
      viewer_count: livestream.viewer_count,
      language: livestream.language_code,
      is_mature: livestream.has_mature_content,
      created_at: livestream.started_at,
      thumbnail: livestream.thumbnail ? { src: livestream.thumbnail } : null,
      categories: livestream.category ? [livestream.category] : [],
      tags: livestream.tags || [],
    } : null),

    official_stream: official.stream || null,
    category: official.category || null,

    _sources: {
      official: !!officialData,
      v2: !!v2Data,
      sample: false,
    }
  }

  return res.json(merged)
})

// Start server locally if not in Vercel serverless environment
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🟢 KickView Backend Server active on http://localhost:${PORT}`)
    console.log(`   Configured: ${!!(oauthConfig.clientId && oauthConfig.clientSecret) ? 'YES' : 'NO (Configure in UI)'}`)
    console.log(`   Redirect URI: ${oauthConfig.redirectUri}`)
    console.log(`   Sample Profiles: xqc, trainwreckstv, adinross, amouranth\n`)
  })
}

export default app
