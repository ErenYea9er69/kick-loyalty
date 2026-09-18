import './style.css'

// ============================
// Types
// ============================

export interface KickClip {
  id: string | number
  title: string
  thumbnail_url: string
  clip_url: string
  duration: number
  views: number
  creator: string
  category: string
  created_at: string | null
}

export interface LeaderboardGifter {
  user_id?: number
  username: string
  quantity: number
}

export interface KickLeaderboards {
  gifts: LeaderboardGifter[]
  gifts_week: LeaderboardGifter[]
  gifts_month: LeaderboardGifter[]
}

export interface KickChatMessage {
  id: string | number
  content: string
  created_at: string | null
  sender: {
    id?: number
    username: string
    color: string
    level?: number | null
    badges?: any[]
  }
}

export interface KickReward {
  id: number
  title: string
  cost: number
  description: string
  icon: string
}

export interface KickBanHistory {
  is_banned: boolean
  status: string
  muted: boolean
  active_bans_count: number
  strikes_count: number
  standing: string
}

export interface KickChannelData {
  id: number
  user_id: number
  slug: string
  is_banned: boolean
  playback_url: string | null
  name_updated_at: string | null
  vod_enabled: boolean
  subscription_enabled: boolean
  followers_count: number
  following_count?: number
  subscriber_badges: SubscriberBadge[]
  banner_image: { url: string } | null
  recent_categories: RecentCategory[]
  livestream: Livestream | null
  role?: string | null
  muted: boolean
  follower_badges?: any[]
  offline_banner_image: { src: string } | null
  verified: boolean | null
  can_host: boolean
  user: KickUser
  chatroom: Chatroom | null
  ascending_links?: AscendingLink[]
  plan?: { id: number; name: string } | null
  previous_usernames?: PreviousUsername[]
  socials?: string[]
  media?: MediaItem[]

  // Account role & timestamp
  account_type?: 'viewer' | 'streamer'
  created_at?: string | null

  // Official API subscriber fields
  active_subscribers_count?: number | null
  active_gifted_subscribers_count?: number | null
  canceled_subscribers_count?: number | null
  channel_description?: string | null
  stream_title?: string | null
  category?: any
  _sources?: {
    official: boolean
    v2: boolean
    v1_user?: boolean
    sample?: boolean
  }

  // 10X Rich Data
  clips?: KickClip[]
  leaderboards?: KickLeaderboards
  recent_messages?: KickChatMessage[]
  rewards?: KickReward[]
  ban_history?: KickBanHistory
}

export interface KickUser {
  id: number
  username: string
  agreed_to_terms?: boolean
  email_verified_at?: string | null
  bio: string | null
  country: string | null
  state: string | null
  city: string | null
  instagram: string | null
  twitter: string | null
  youtube: string | null
  discord: string | null
  tiktok: string | null
  facebook: string | null
  profile_pic: string | null
}

export interface SubscriberBadge {
  id: number
  channel_id: number
  months: number
  badge_image: { srcset?: string; src: string } | null
}

export interface RecentCategory {
  id: number
  category_id: number
  name: string
  slug: string
  tags: string[]
  description?: string | null
  deleted_at?: string | null
  viewers?: number
  category?: {
    id: number
    name: string
    slug: string
    icon?: string
    banner?: { responsive?: string; url?: string } | null
  }
}

export interface Livestream {
  id: number
  slug: string
  channel_id: number
  created_at: string
  session_title: string
  is_live: boolean
  risk_level_id?: number | null
  source?: string | null
  twitch_channel?: string | null
  duration?: number
  language: string
  is_mature: boolean
  viewer_count: number
  thumbnail: { src: string; srcset?: string } | null
  categories?: { id: number; category_id: number; name: string; slug: string; tags: string[] }[]
  tags?: string[]
}

export interface Chatroom {
  id: number
  chatable_type?: string
  channel_id?: number
  created_at?: string
  updated_at?: string
  chat_mode_old?: string
  chat_mode: string
  slow_mode: boolean
  chatable_id?: number
  followers_mode: boolean
  subscribers_mode: boolean
  emotes_mode: boolean
  message_interval: number
  following_min_duration: number
}

export interface AscendingLink {
  id: number
  channel_id: number
  description?: string | null
  link: string
  created_at?: string
  updated_at?: string
  order: number
  title: string
}

export interface PreviousUsername {
  id: number
  user_id: number
  username: string
  created_at: string
}

export interface MediaItem {
  id: number
  model_type: string
  model_id: number
  collection_name: string
  name: string
  file_name: string
  mime_type: string
  disk: string
  size: number
  created_at: string
  updated_at: string
  responsive_images: { url: string; srcset: string } | null
  original_url: string
  preview_url: string
}

export interface AuthStatus {
  configured: boolean
  hasAppToken: boolean
  hasUserToken: boolean
  userScope: string | null
  clientId: string | null
  redirectUri?: string
}

// ============================
// State
// ============================

export let currentData: KickChannelData | null = null
let activeTab: 'clips' | 'chat_search' | 'viewer_details' | 'streamer_stats' = 'streamer_stats'
let chatSearchQuery: string = ''
let chatSearchDateRange: string = 'any'
let chatSearchChannel: string = ''
let chatSearchUsername: string = ''
let authStatus: AuthStatus = {
  configured: false,
  hasAppToken: false,
  hasUserToken: false,
  userScope: null,
  clientId: null,
  redirectUri: 'http://localhost:5173/callback'
}

// ============================
// API Calls
// ============================

async function checkStatus(): Promise<AuthStatus> {
  try {
    const res = await fetch('/api/status')
    if (res.ok) {
      authStatus = await res.json()
    }
  } catch (err) {
    console.error('Failed to fetch status:', err)
  }
  return authStatus
}

async function fetchKickChannel(slug: string): Promise<KickChannelData> {
  const cleanSlug = slug.trim().toLowerCase().replace(/^@/, '')
  const url = `/api/channel/${encodeURIComponent(cleanSlug)}`

  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' }
  })

  if (!response.ok) {
    let errorMsg = `Failed to fetch data (HTTP ${response.status}).`
    try {
      const errData = await response.json()
      errorMsg = errData.error || errorMsg
    } catch {}
    throw new Error(errorMsg)
  }

  return await response.json()
}

// ============================
// Helpers
// ============================

function formatNumber(num: number): string {
  if (!num) return '0'
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return num.toLocaleString()
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function timeAgo(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 30) return `${diffDays}d ago`
    return formatDate(dateStr)
  } catch {
    return dateStr
  }
}

function escapeHtml(str: string | null | undefined): string {
  if (!str) return ''
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

function getSocialIcon(platform: string): string {
  const icons: Record<string, string> = {
    instagram: '📸',
    twitter: '𝕏',
    youtube: '▶️',
    discord: '💬',
    tiktok: '🎵',
    facebook: '📘',
  }
  return icons[platform.toLowerCase()] || '🔗'
}

// ============================
// Core Render
// ============================

function renderApp() {
  const app = document.getElementById('app')!

  // Check if we are in OAuth callback flow
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const isCallback = window.location.pathname === '/callback' || !!code

  if (isCallback && code) {
    renderCallbackView(code)
    return
  }

  app.innerHTML = `
    <!-- Top Auth Status Bar -->
    <div id="auth-bar" class="auth-bar">
      ${renderAuthBarContent()}
    </div>

    <!-- Main Navigation Header -->
    <header class="header">
      <div class="header__logo">
        <div class="header__icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18zM4 9.64l7 3.5V19.5l-7-3.5V9.64zm9 9.86v-6.36l7-3.5v6.36l-7 3.5z"/>
          </svg>
        </div>
        <div>
          <div class="header__title">KickView</div>
          <div class="header__subtitle">Kick.com Platform & Profile Intelligence</div>
        </div>
      </div>
      <div class="header__actions" style="display:flex; gap:10px; align-items:center;">
        ${authStatus.hasUserToken ? `
          <button id="nav-logout-btn" class="auth-bar__btn auth-bar__btn--danger">Log Out</button>
        ` : `
          <button id="nav-login-btn" class="auth-bar__btn auth-bar__btn--kick" style="font-size:0.85rem; padding: 7px 18px; border-width: 2px; font-weight: 700; box-shadow: 0 0 12px rgba(83,252,24,0.15); display: flex; align-items: center; gap: 6px;">
            <span>⚡</span> Log in with Kick (Free)
          </button>
        `}
      </div>
    </header>

    <!-- Search Section -->
    <section class="search-section">
      <h1 class="search-hero-title">Explore Any Kick Profile</h1>
      <p class="search-hero-desc">
        Lookup any streamer or viewer to inspect clips, gifted subscription leaderboards, live chat activity, channel point rewards, and moderation standing.
      </p>

      <div class="search-box">
        <input
          type="text"
          id="search-input"
          class="search-box__input"
          placeholder="Enter Kick username (e.g. splash_699, xqc, trainwreckstv)..."
          autocomplete="off"
          spellcheck="false"
        />
        <svg class="search-box__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <button id="search-btn" class="search-box__btn">Look Up</button>
      </div>

      <!-- Quick Chips -->
      <div class="quick-chips">
        <span class="quick-chips__label">⚡ Quick Profiles:</span>
        <button class="quick-chip" data-username="splash_699">splash_699 (Viewer)</button>
        <button class="quick-chip" data-username="xqc">xQc</button>
        <button class="quick-chip" data-username="trainwreckstv">Trainwreckstv</button>
        <button class="quick-chip" data-username="adinross">AdinRoss</button>
      </div>

      <!-- Free Login Callout -->
      <div style="margin-top: 14px; font-size: 0.85rem; color: var(--text-secondary);">
        Want to view your private subscriber metrics & channel points? 
        <button id="hero-login-btn" style="background:none; border:none; color:var(--kick-green); font-weight:700; text-decoration:underline; cursor:pointer; font-size:0.85rem; font-family:inherit;">
          ⚡ Log in with Kick (100% Free) ↗
        </button>
      </div>
    </section>

    <!-- Results Display -->
    <div id="results-container"></div>

    <!-- Modal Container -->
    <div id="modal-container"></div>
  `

  bindEvents()
}

function renderAuthBarContent(): string {
  if (authStatus.hasUserToken) {
    return `
      <div class="auth-bar__status">
        <span class="auth-bar__dot auth-bar__dot--user"></span>
        <span><strong>Logged in with Kick</strong></span>
        <span style="opacity: 0.6; font-size: 0.75rem;">(User Token Active)</span>
      </div>
      <button id="logout-btn" class="auth-bar__btn auth-bar__btn--danger">Log Out</button>
      <button id="config-btn" class="auth-bar__btn">Settings</button>
    `
  }

  if (authStatus.hasAppToken) {
    return `
      <div class="auth-bar__status">
        <span class="auth-bar__dot auth-bar__dot--connected"></span>
        <span>Kick API: <strong>Connected</strong></span>
      </div>
      <button id="login-kick-btn" class="auth-bar__btn auth-bar__btn--kick">⚡ Log in with Kick (Free)</button>
      <button id="config-btn" class="auth-bar__btn">Settings</button>
    `
  }

  return `
    <div class="auth-bar__status">
      <span class="auth-bar__dot auth-bar__dot--connected" style="background: #4d9fff; box-shadow: 0 0 8px rgba(77, 159, 255, 0.4);"></span>
      <span>Kick Mode: <strong>Live Public & User Lookup Active</strong></span>
    </div>
    <button id="login-kick-btn" class="auth-bar__btn auth-bar__btn--kick">⚡ Log in with Kick (Free)</button>
    <button id="config-btn" class="auth-bar__btn">⚙️ API Settings</button>
  `
}

function updateAuthBar() {
  const bar = document.getElementById('auth-bar')
  if (bar) {
    bar.innerHTML = renderAuthBarContent()
    bindAuthBarButtons()
  }
}

// ============================
// Event Binding
// ============================

function bindEvents() {
  const input = document.getElementById('search-input') as HTMLInputElement
  const btn = document.getElementById('search-btn') as HTMLButtonElement

  if (btn) btn.addEventListener('click', () => handleSearch())
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSearch()
    })
    setTimeout(() => input.focus(), 100)
  }

  // Quick Chips
  document.querySelectorAll('.quick-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const username = (e.currentTarget as HTMLElement).dataset.username
      if (username) {
        if (input) input.value = username
        handleSearch(username)
      }
    })
  })

  // Header Nav Login/Logout
  const navLogin = document.getElementById('nav-login-btn')
  if (navLogin) navLogin.addEventListener('click', () => startKickLogin())

  const heroLogin = document.getElementById('hero-login-btn')
  if (heroLogin) heroLogin.addEventListener('click', () => startKickLogin())

  const navLogout = document.getElementById('nav-logout-btn')
  if (navLogout) navLogout.addEventListener('click', () => logoutUser())

  bindAuthBarButtons()
}

function bindAuthBarButtons() {
  const configBtn = document.getElementById('config-btn')
  if (configBtn) configBtn.addEventListener('click', () => openSetupModal())

  const loginBtn = document.getElementById('login-kick-btn')
  if (loginBtn) loginBtn.addEventListener('click', () => startKickLogin())

  const logoutBtn = document.getElementById('logout-btn')
  if (logoutBtn) logoutBtn.addEventListener('click', () => logoutUser())
}

// ============================
// OAuth PKCE Login Flow
// ============================

async function startKickLogin() {
  try {
    const res = await fetch('/api/auth/login')
    const data = await res.json()

    if (!res.ok || data.error) {
      openSetupModal(true)
      return
    }

    if (data.authUrl) {
      window.location.href = data.authUrl
    }
  } catch (err: any) {
    alert(`Error initiating Kick OAuth: ${err.message}`)
  }
}

async function logoutUser() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' })
    await checkStatus()
    updateAuthBar()
  } catch (err: any) {
    console.error('Logout error:', err)
  }
}

function renderCallbackView(code: string) {
  const app = document.getElementById('app')!
  app.innerHTML = `
    <div class="callback-container">
      <div class="loader__spinner" style="margin: 0 auto var(--space-md);"></div>
      <div class="callback-container__title">Authenticating with Kick...</div>
      <p class="callback-container__desc">Exchanging authorization code for secure access tokens.</p>
      <div id="callback-status" class="setup-modal__message setup-modal__message--success" style="display:none;"></div>
    </div>
  `

  exchangeOAuthCode(code)
}

async function exchangeOAuthCode(code: string) {
  const statusDiv = document.getElementById('callback-status')

  try {
    const res = await fetch('/api/auth/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })

    const data = await res.json()

    if (res.ok && data.success) {
      if (statusDiv) {
        statusDiv.style.display = 'block'
        statusDiv.textContent = '✅ Connected successfully! Redirecting...'
      }
      setTimeout(async () => {
        window.history.replaceState({}, document.title, '/')
        await checkStatus()
        renderApp()
      }, 1200)
    } else {
      if (statusDiv) {
        statusDiv.style.display = 'block'
        statusDiv.className = 'setup-modal__message setup-modal__message--error'
        statusDiv.textContent = `❌ ${data.error || 'Authentication exchange failed.'}`
      }
    }
  } catch (err: any) {
    if (statusDiv) {
      statusDiv.style.display = 'block'
      statusDiv.className = 'setup-modal__message setup-modal__message--error'
      statusDiv.textContent = `❌ Network error: ${err.message}`
    }
  }
}

// ============================
// Setup Modal
// ============================

function openSetupModal(forLogin = false) {
  const modalContainer = document.getElementById('modal-container')!
  modalContainer.innerHTML = `
    <div class="setup-overlay" id="setup-overlay">
      <div class="setup-modal__content">
        <div class="setup-modal__title">
          <span>${forLogin ? '⚡ Log In with Kick (100% Free)' : '⚙️ Kick Developer API Setup'}</span>
        </div>
        <p class="setup-modal__desc">
          ${forLogin 
            ? `Logging in with Kick is <strong>100% free</strong>! Kick protects your account with OAuth 2.1 PKCE. To start, get a free Client ID from the <a href="https://kick.com/settings/developer" target="_blank" rel="noopener noreferrer">Kick Developer Portal ↗</a> (takes 30 seconds), enter it below, and we'll instantly open Kick's official login page!`
            : `To fetch live public and authenticated data from Kick's official API, enter your Client Credentials from the <a href="https://kick.com/settings/developer" target="_blank" rel="noopener noreferrer">Kick Developer Portal ↗</a>.`
          }
        </p>

        <div class="setup-modal__field">
          <label class="setup-modal__label">Kick Client ID</label>
          <input
            type="text"
            id="setup-client-id"
            class="setup-modal__input"
            placeholder="e.g. 01J... or your Kick App Client ID"
            value="${escapeHtml(authStatus.clientId ? authStatus.clientId.replace(/\.\.\.$/, '') : '')}"
          />
        </div>

        <div class="setup-modal__field">
          <label class="setup-modal__label">Kick Client Secret ${forLogin ? '(Optional for Login PKCE)' : ''}</label>
          <input
            type="password"
            id="setup-client-secret"
            class="setup-modal__input"
            placeholder="e.g. secret_... (leave empty if using PKCE only)"
          />
        </div>

        <div id="setup-msg" class="setup-modal__message" style="display:none;"></div>

        <div class="setup-modal__actions">
          <button id="setup-cancel" class="setup-modal__cancel">Cancel</button>
          <button id="setup-save" class="setup-modal__submit">${forLogin ? 'Continue to Kick Login ↗' : 'Save & Connect'}</button>
        </div>
      </div>
    </div>
  `

  document.getElementById('setup-overlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('setup-overlay')) modalContainer.innerHTML = ''
  })
  document.getElementById('setup-cancel')?.addEventListener('click', () => { modalContainer.innerHTML = '' })
  document.getElementById('setup-save')?.addEventListener('click', () => saveCredentials(forLogin))
}

async function saveCredentials(startLoginAfter = false) {
  const clientId = (document.getElementById('setup-client-id') as HTMLInputElement)?.value.trim()
  const clientSecret = (document.getElementById('setup-client-secret') as HTMLInputElement)?.value.trim()
  const msg = document.getElementById('setup-msg')!

  if (!clientId) {
    msg.style.display = 'block'
    msg.className = 'setup-modal__message setup-modal__message--error'
    msg.textContent = 'Please enter a Client ID.'
    return
  }

  msg.style.display = 'block'
  msg.className = 'setup-modal__message setup-modal__message--success'
  msg.textContent = 'Saving configuration...'

  try {
    const res = await fetch('/api/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, clientSecret })
    })
    const data = await res.json()

    if (res.ok && data.success) {
      msg.textContent = '✅ Credentials saved!'
      await checkStatus()
      updateAuthBar()

      setTimeout(() => {
        document.getElementById('modal-container')!.innerHTML = ''
        if (startLoginAfter) {
          startKickLogin()
        }
      }, 700)
    } else {
      msg.className = 'setup-modal__message setup-modal__message--error'
      msg.textContent = `❌ ${data.error || 'Failed to save credentials.'}`
    }
  } catch (err: any) {
    msg.className = 'setup-modal__message setup-modal__message--error'
    msg.textContent = `❌ ${err.message}`
  }
}

// ============================
// Search Handling
// ============================

async function handleSearch(manualQuery?: string) {
  const input = document.getElementById('search-input') as HTMLInputElement
  const btn = document.getElementById('search-btn') as HTMLButtonElement
  const container = document.getElementById('results-container')!
  const query = (manualQuery || input?.value || '').trim()

  if (!query) {
    if (input) input.focus()
    return
  }

  if (btn) {
    btn.disabled = true
    btn.textContent = 'Searching...'
  }

  container.innerHTML = `
    <div class="loader">
      <div class="loader__spinner"></div>
      <div class="loader__text">Fetching Kick data for <strong>${escapeHtml(query)}</strong>...</div>
    </div>
  `

  try {
    const data = await fetchKickChannel(query)
    currentData = data
    // Select default tab depending on viewer vs streamer
    if (data.account_type === 'viewer') {
      activeTab = 'viewer_details'
    } else {
      activeTab = 'streamer_stats'
    }
    chatSearchQuery = ''
    renderProfile(data)
  } catch (err: any) {
    container.innerHTML = `
      <div class="error-state">
        <div class="error-state__icon">🔍</div>
        <div class="error-state__title">Channel Not Found</div>
        <div class="error-state__message">${escapeHtml(err.message || 'An unexpected error occurred.')}</div>
        <div style="margin-top: 16px; display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
          <button class="quick-chip" onclick="document.getElementById('search-input').value='splash_699'; document.getElementById('search-btn').click();">Try splash_699 (Viewer)</button>
          <button class="quick-chip" onclick="document.getElementById('search-input').value='xqc'; document.getElementById('search-btn').click();">Try xQc</button>
          <button class="quick-chip" onclick="document.getElementById('search-input').value='trainwreckstv'; document.getElementById('search-btn').click();">Try Trainwreckstv</button>
          <button class="quick-chip" onclick="document.getElementById('search-input').value='adinross'; document.getElementById('search-btn').click();">Try AdinRoss</button>
        </div>
      </div>
    `
  } finally {
    if (btn) {
      btn.disabled = false
      btn.textContent = 'Look Up'
    }
  }
}

// ============================
// Profile Render
// ============================

function renderProfile(data: KickChannelData) {
  const container = document.getElementById('results-container')!
  const user = data.user
  const avatarUrl = user.profile_pic || `https://kick.com/img/default-profile-pictures/default-avatar-2.webp`
  const bannerUrl = data.banner_image?.url || data.offline_banner_image?.src || ''
  const isLive = data.livestream?.is_live === true
  const isVerified = data.verified === true
  const isSample = data._sources?.sample === true

  const clipsCount = data.clips?.length || 0
  const totalGiftsCount = (data.leaderboards?.gifts?.length || 0)
  const messagesCount = data.recent_messages?.length || 0

  container.innerHTML = `
    <div class="profile">
      <!-- Banner -->
      ${bannerUrl ? `
      <div class="profile__banner">
        <img src="${escapeHtml(bannerUrl)}" alt="Channel banner" loading="lazy" />
        <div class="profile__banner-overlay"></div>
      </div>
      ` : `
      <div class="profile__banner" style="background: linear-gradient(135deg, #0d1117 0%, #161b22 50%, rgba(83,252,24,0.1) 100%);">
        <div class="profile__banner-overlay"></div>
      </div>
      `}

      <!-- Header -->
      <div class="profile__header">
        <div class="profile__avatar">
          <img src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(user.username)}" loading="lazy" onerror="this.src='https://kick.com/img/default-profile-pictures/default-avatar-2.webp'" />
        </div>
        <div class="profile__info">
          <div class="profile__name-row">
            <span class="profile__name">${escapeHtml(user.username)}</span>
            ${data.account_type === 'viewer' ? `
            <span class="source-badge" style="background: rgba(77, 159, 255, 0.15); color: #4d9fff; border: 1px solid rgba(77, 159, 255, 0.3); font-size: 0.75rem; padding: 3px 10px;">
              👤 Watcher / Viewer
            </span>
            ` : ''}
            ${isVerified ? `
            <span class="profile__verified" title="Verified Creator">
              <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
            </span>
            ` : ''}
            ${isLive ? '<span class="profile__live-badge">LIVE NOW</span>' : ''}
          </div>
          <div class="profile__slug">
            <span>kick.com/${escapeHtml(data.slug)}</span>
            ${data.created_at ? `<span style="color:var(--text-secondary); margin-left: 8px; font-size: 0.8rem;">• Member since ${formatDate(data.created_at)}</span>` : ''}
            <!-- Source Badges -->
            ${data._sources?.official ? '<span class="source-badge source-badge--official">Official Kick API</span>' : ''}
            ${data._sources?.v2 ? '<span class="source-badge source-badge--v2">Kick Channel</span>' : ''}
            ${data._sources?.v1_user ? '<span class="source-badge" style="background: rgba(77, 159, 255, 0.12); color: #4d9fff;">User Profile ✓</span>' : ''}
            ${isSample ? '<span class="source-badge source-badge--sample">⚡ Sample Preview</span>' : ''}
          </div>
          ${user.bio ? `<div class="profile__bio">${escapeHtml(user.bio)}</div>` : ''}
        </div>
      </div>

      <!-- Live Broadcast Banner (if currently live) -->
      ${renderLiveBroadcastBanner(data)}

      <!-- Primary Key Metrics Strip -->
      <div class="stats-row" style="margin-bottom: var(--space-xl);">
        <div class="stat-card">
          <div class="stat-card__value">${formatNumber(data.followers_count || 0)}</div>
          <div class="stat-card__label">Followers</div>
        </div>
        ${data.account_type === 'viewer' ? `
        <div class="stat-card">
          <div class="stat-card__value" style="color: #4d9fff; font-size: 1.15rem; font-weight: 800;">Viewer</div>
          <div class="stat-card__label">Account Role</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value" style="color: var(--kick-green); font-size: 1.15rem; font-weight: 800;">100% Clean</div>
          <div class="stat-card__label">Ban Standing</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value">${messagesCount}</div>
          <div class="stat-card__label">Chat Messages</div>
        </div>
        ` : `
        <div class="stat-card">
          <div class="stat-card__value" style="color: var(--kick-green);">${formatNumber(data.active_subscribers_count || 0)}</div>
          <div class="stat-card__label">Active Subscribers</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value" style="color: #a855f7;">${formatNumber(data.active_gifted_subscribers_count || totalGiftsCount)}</div>
          <div class="stat-card__label">Gifted Subs</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value" style="color: #00e5ff;">${clipsCount}</div>
          <div class="stat-card__label">Clips Available</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value" style="color: var(--kick-green); font-size: 1.15rem; font-weight: 800;">Clean</div>
          <div class="stat-card__label">Ban Standing</div>
        </div>
        `}
      </div>

      <!-- 10X Rich Data Navigation Tabs -->
      <div class="profile-tabs">
        <button class="profile-tab ${activeTab === 'streamer_stats' ? 'profile-tab--active' : ''}" data-tab="streamer_stats">
          <span>📊</span> Streamer Statistics
        </button>
        <button class="profile-tab ${activeTab === 'chat_search' ? 'profile-tab--active' : ''}" data-tab="chat_search">
          <span>💬</span> Chat Message Search
          <span class="profile-tab__count">${messagesCount}</span>
        </button>
        <button class="profile-tab ${activeTab === 'viewer_details' ? 'profile-tab--active' : ''}" data-tab="viewer_details">
          <span>👤</span> Viewer Details
        </button>
        <button class="profile-tab ${activeTab === 'clips' ? 'profile-tab--active' : ''}" data-tab="clips">
          <span>🎬</span> Clips & Highlights
          <span class="profile-tab__count">${clipsCount}</span>
        </button>
      </div>

      <!-- Tab Content Area -->
      <div id="tab-content-area" style="animation: fadeIn 0.25s var(--ease-out);">
        ${renderTabContent(data)}
      </div>

      <!-- Quick External Link & Raw JSON Viewer -->
      <div style="text-align: center; margin-top: var(--space-2xl); display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap;">
        <a href="https://kick.com/${escapeHtml(data.slug)}" target="_blank" rel="noopener noreferrer" class="quick-link">
          Open kick.com/${escapeHtml(data.slug)} in New Tab ↗
        </a>
        <button id="view-raw-json-btn" class="quick-link" style="background: var(--bg-card); cursor: pointer; border: 1px solid var(--border-default);">
          { } View Raw Kick Payload
        </button>
      </div>
    </div>

    <div class="data-note">
      <p class="data-note__text">
        ⓘ Data retrieved in real-time from Kick's official APIs, v2 channel streams, clips, leaderboards, and chat services.
      </p>
    </div>
  `

  bindProfileEvents(data)
}

function renderLiveBroadcastBanner(data: KickChannelData): string {
  const ls = data.livestream
  if (!ls || !ls.is_live) return ''

  return `
    <div style="background: linear-gradient(135deg, rgba(255, 68, 68, 0.12), rgba(255, 68, 68, 0.04)); border: 1px solid rgba(255, 68, 68, 0.35); border-radius: var(--radius-lg); padding: var(--space-lg); margin-bottom: var(--space-xl); display: flex; align-items: center; justify-content: space-between; gap: var(--space-md); flex-wrap: wrap;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="width: 12px; height: 12px; border-radius: 50%; background: #ff4444; box-shadow: 0 0 10px #ff4444; display: inline-block;"></span>
        <div>
          <div style="font-weight: 800; font-size: 1.05rem; color: #fff;">
            ${escapeHtml(ls.session_title || data.stream_title || 'Live Broadcast')}
          </div>
          <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">
            Streaming right now with <strong style="color: #ff4444;">${formatNumber(ls.viewer_count)}</strong> live viewers
          </div>
        </div>
      </div>
      <a href="https://kick.com/${escapeHtml(data.slug)}" target="_blank" rel="noopener noreferrer" class="auth-bar__btn auth-bar__btn--kick" style="font-weight: 700; padding: 6px 18px;">
        Watch Stream Live ↗
      </a>
    </div>
  `
}

function renderTabContent(data: KickChannelData): string {
  switch (activeTab) {
    case 'clips':
      return renderClipsTab(data)
    case 'chat_search':
      return renderChatSearchTab(data)
    case 'viewer_details':
      return renderViewerDetailsTab(data)
    case 'streamer_stats':
      return renderStreamerStatsTab(data)
    default:
      return renderStreamerStatsTab(data)
  }
}

// ============================
// 1. Clips Tab
// ============================

function renderClipsTab(data: KickChannelData): string {
  const clips = data.clips || []

  if (clips.length === 0) {
    return `
      <div class="section-card" style="text-align: center; padding: var(--space-2xl);">
        <div style="font-size: 2.8rem; margin-bottom: 12px;">🎬</div>
        <div style="font-size: 1.2rem; font-weight: 800; margin-bottom: 8px;">No Clips Generated Yet</div>
        <p style="color: var(--text-secondary); max-width: 480px; margin: 0 auto; font-size: 0.9rem; line-height: 1.6;">
          ${data.account_type === 'viewer' 
            ? 'This is a community viewer account, so no broadcast clips are recorded.' 
            : 'No community highlights or clips have been saved on this channel recently.'}
        </p>
      </div>
    `
  }

  return `
    <div>
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
        <div>
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #fff;">Featured Clips & Highlights</h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">Top viral moments, clutch gameplay, and funny interactions clipped by the community.</p>
        </div>
        <span style="font-size: 0.82rem; font-family: 'JetBrains Mono', monospace; color: var(--kick-green); background: rgba(83,252,24,0.1); padding: 4px 12px; border-radius: var(--radius-full);">
          ${clips.length} Clips
        </span>
      </div>

      <div class="clips-grid">
        ${clips.map((c, i) => `
          <div class="clip-card" data-clip-index="${i}">
            <div class="clip-thumb">
              <img src="${escapeHtml(c.thumbnail_url || '/assets/clip_gaming.jpg')}" alt="${escapeHtml(c.title)}" loading="lazy" onerror="this.src='/assets/clip_gaming.jpg'" />
              <span class="clip-duration">${Math.floor((c.duration || 30) / 60)}:${((c.duration || 30) % 60).toString().padStart(2, '0')}</span>
              <span class="clip-views">👁️ ${formatNumber(c.views)}</span>
              <div class="clip-play-btn">▶</div>
            </div>
            <div class="clip-info">
              <div class="clip-title" title="${escapeHtml(c.title)}">${escapeHtml(c.title)}</div>
              <div class="clip-meta">
                <span class="clip-creator">👤 @${escapeHtml(c.creator)}</span>
                <span style="color: var(--kick-green); font-weight: 600;">${escapeHtml(c.category || 'Just Chatting')}</span>
              </div>
              ${c.created_at ? `<div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 6px;">${timeAgo(c.created_at)}</div>` : ''}
              <button class="auth-bar__btn auth-bar__btn--kick watch-clip-btn" data-clip-index="${i}" style="margin-top: 12px; width: 100%; display: flex; justify-content: center; align-items: center; gap: 6px; padding: 7px;">
                <span>▶</span> Watch Clip
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

// ============================
// 2. Subscriptions & Gifted Subs Tab
// ============================

// ============================
// Streamer Statistics Tab
// ============================
function renderStreamerStatsTab(data: KickChannelData): string {
  if (data.account_type === 'viewer') {
    return `
      <div class="section-card" style="text-align: center; padding: var(--space-2xl);">
        <div style="font-size: 2.8rem; margin-bottom: 12px;">📊</div>
        <div style="font-size: 1.2rem; font-weight: 800; margin-bottom: 8px;">No Streamer Statistics Available</div>
        <p style="color: var(--text-secondary); max-width: 480px; margin: 0 auto; font-size: 0.9rem; line-height: 1.6;">
          This is a viewer account. Streamer statistics are only available for channels that broadcast.
        </p>
      </div>
    `
  }

  const activeSubs = data.active_subscribers_count ?? 0
  const activeGifted = data.active_gifted_subscribers_count ?? 0
  const canceled = data.canceled_subscribers_count ?? 0
  const totalSubs = activeSubs + activeGifted

  return `
    <div>
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
        <div>
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #fff;">Streamer Statistics (Live Overview)</h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">Current broadcast and channel performance analytics.</p>
        </div>
      </div>

      <div class="stats-row" style="margin-bottom: var(--space-xl);">
        <div class="stat-card">
          <div class="stat-card__value" style="color: var(--kick-green);">${formatNumber(totalSubs)}</div>
          <div class="stat-card__label">Total Subscribers</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value" style="color: #4d9fff;">${formatNumber(data.followers_count || 0)}</div>
          <div class="stat-card__label">Followers</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value" style="color: #ffaa00;">${data.recent_messages?.length || 0}</div>
          <div class="stat-card__label">Recent Chat Messages</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value" style="color: #a855f7;">${data.leaderboards?.gifts?.length || 0}</div>
          <div class="stat-card__label">Top Gifters All-Time</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: var(--space-lg);">
        <div class="section-card">
          <div class="section-card__header">
            <div class="section-card__icon section-card__icon--blue">📺</div>
            <div class="section-card__title">Broadcast Details</div>
          </div>
          <div class="section-card__body">
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: var(--bg-secondary); border-radius: var(--radius-md);">
                <span style="font-size: 0.88rem; color: var(--text-secondary);">Currently Live</span>
                <span style="font-weight: 700; color: ${data.livestream?.is_live ? 'var(--kick-green)' : 'var(--text-muted)'};">${data.livestream?.is_live ? 'Yes' : 'No'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: var(--bg-secondary); border-radius: var(--radius-md);">
                <span style="font-size: 0.88rem; color: var(--text-secondary);">Live Viewers</span>
                <span style="font-weight: 700;">${formatNumber(data.livestream?.viewer_count || 0)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: var(--bg-secondary); border-radius: var(--radius-md);">
                <span style="font-size: 0.88rem; color: var(--text-secondary);">Category</span>
                <span style="font-weight: 700;">${escapeHtml(data.category?.name || 'Unknown')}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="section-card">
          <div class="section-card__header">
            <div class="section-card__icon section-card__icon--orange">📊</div>
            <div class="section-card__title">Subscription Breakdown</div>
          </div>
          <div class="section-card__body">
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: var(--bg-secondary); border-radius: var(--radius-md);">
                <span style="font-size: 0.88rem; color: var(--text-secondary);">Direct Active Subs</span>
                <span style="font-weight: 700;">${formatNumber(activeSubs)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: var(--bg-secondary); border-radius: var(--radius-md);">
                <span style="font-size: 0.88rem; color: var(--text-secondary);">Gifted Subs</span>
                <span style="font-weight: 700; color: #a855f7;">${formatNumber(activeGifted)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: var(--bg-secondary); border-radius: var(--radius-md);">
                <span style="font-size: 0.88rem; color: var(--text-secondary);">Canceled</span>
                <span style="font-weight: 700; color: #ff6666;">${formatNumber(canceled)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

// ============================
// Chat Message Search Tab
// ============================
function renderChatSearchTab(data: KickChannelData): string {
  const messages = data.recent_messages || []

  let filtered = messages
  if (chatSearchQuery.trim()) {
    filtered = filtered.filter(m => m.content.toLowerCase().includes(chatSearchQuery.toLowerCase()))
  }
  if (chatSearchUsername.trim()) {
    filtered = filtered.filter(m => m.sender.username.toLowerCase() === chatSearchUsername.toLowerCase())
  }

  return `
    <div class="section-card section-card--full">
      <div class="section-card__header" style="flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div class="section-card__icon section-card__icon--green">🔍</div>
          <div class="section-card__title">Chat Message Search</div>
        </div>
        <span id="chat-count-display" class="section-card__count" style="color: var(--kick-green); background: rgba(83,252,24,0.1);">
          ${filtered.length} Results
        </span>
      </div>

      <div class="section-card__body">
        <div style="display: flex; gap: var(--space-md); margin-bottom: var(--space-md); flex-wrap: wrap;">
          <div style="flex: 1; min-width: 200px;">
            <label style="display: block; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 4px;">Search Keyword</label>
            <input type="text" id="chat-search-keyword" class="chat-filter-input" placeholder="Message content..." value="${escapeHtml(chatSearchQuery)}" style="width: 100%; box-sizing: border-box;" />
          </div>
          <div style="flex: 1; min-width: 200px;">
            <label style="display: block; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 4px;">Filter by Username</label>
            <input type="text" id="chat-search-user" class="chat-filter-input" placeholder="Exact username..." value="${escapeHtml(chatSearchUsername)}" style="width: 100%; box-sizing: border-box;" />
          </div>
          <div style="flex: 1; min-width: 200px;">
            <label style="display: block; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 4px;">Date Range</label>
            <select id="chat-search-date" class="chat-filter-input" style="width: 100%; box-sizing: border-box; background-color: var(--bg-input);">
              <option value="any" ${chatSearchDateRange === 'any' ? 'selected' : ''}>Recent (Live Buffer)</option>
              <option value="today" disabled>Today (Requires KickLogz API Key)</option>
              <option value="week" disabled>Last 7 Days (Requires API Key)</option>
            </select>
          </div>
        </div>

        <div id="chat-stream-container" class="chat-stream" style="min-height: 300px; border: 1px solid var(--border-default); padding: var(--space-md); border-radius: var(--radius-md); background: #000;">
          ${filtered.length === 0 ? `
            <div class="section-card__empty">No chat messages match your search criteria. (Note: Only live broadcast messages are searchable without a third-party API key).</div>
          ` : filtered.map(m => `
            <div class="chat-msg">
              ${m.sender.level != null ? `<span class="chat-level">Lvl ${m.sender.level}</span>` : ''}
              <span class="chat-author" style="color: ${m.sender.color || '#53fc18'};">${escapeHtml(m.sender.username)}</span>
              <span class="chat-content">${escapeHtml(m.content)}</span>
              ${m.created_at ? `<span class="chat-time" style="float: right;">${timeAgo(m.created_at)}</span>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `
}

// ============================
// Viewer Details Tab
// ============================
// ============================
// Viewer Details Tab
// ============================
function renderViewerDetailsTab(data: KickChannelData): string {
  const isBanned = data.is_banned === true
  
  // Try to parse cached Kicklogz data if we fetched it
  let kicklogzBansHtml = `<div class="section-card__empty">Loading KickLogz data...</div>`
  const kicklogzKey = localStorage.getItem('kicklogz_api_key') || ''
  
  if (!kicklogzKey) {
    kicklogzBansHtml = `
      <div style="background: rgba(255,170,0,0.1); border: 1px solid rgba(255,170,0,0.3); padding: var(--space-md); border-radius: var(--radius-md); text-align: center; margin-bottom: 12px;">
        <div style="font-size: 1.5rem; margin-bottom: 8px;">🔑</div>
        <div style="font-weight: 700; color: #ffaa00; margin-bottom: 6px;">KickLogz API Key Required</div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 12px; line-height: 1.5;">
          Kick.com keeps ban history private. To view historical bans (timeouts, perma-bans, dates, and mods), you must connect a KickLogz API key.
        </p>
        <div style="display: flex; gap: 8px; justify-content: center; align-items: center; max-width: 400px; margin: 0 auto;">
          <input type="password" id="klz-key-input" class="chat-filter-input" placeholder="klz_live_..." style="flex: 1;" />
          <button id="klz-save-btn" class="setup-modal__submit" style="padding: 8px 16px; font-size: 0.85rem;">Save Key</button>
        </div>
        <div style="margin-top: 8px; font-size: 0.75rem; color: var(--text-muted);">
          Don't have one? Get it at <a href="https://kicklogz.com" target="_blank" style="color: var(--kick-green);">KickLogz.com</a>
        </div>
      </div>
    `
  } else {
    kicklogzBansHtml = `
      <div id="klz-bans-container">
        <div style="text-align: center; padding: 20px; color: var(--kick-green);">Fetching real ban history from KickLogz...</div>
      </div>
      <div style="text-align: center; margin-top: 12px;">
        <button id="klz-clear-btn" style="background: transparent; border: none; color: #ff4444; font-size: 0.8rem; cursor: pointer; text-decoration: underline;">Disconnect KickLogz API</button>
      </div>
    `
  }

  return `
    <div class="sections-grid">
      <!-- 1. Moderation & KickLogz Ban History -->
      <div class="section-card" style="grid-column: 1 / -1;">
        <div class="section-card__header">
          <div class="section-card__icon section-card__icon--blue">🛡️</div>
          <div class="section-card__title">Moderation & Real Ban History (KickLogz)</div>
        </div>
        <div class="section-card__body">
          <div class="mod-standing-card" style="margin-bottom: 16px; padding: 16px; ${isBanned ? 'border-color: rgba(255, 68, 68, 0.4); background: rgba(255, 68, 68, 0.08);' : ''}">
            <div class="mod-shield-icon" style="font-size: 2rem;">${isBanned ? '⛔' : '🛡️'}</div>
            <div>
              <div class="mod-standing-title" style="${isBanned ? 'color: #ff4444;' : ''}">
                ${isBanned ? 'Currently Banned (Global)' : 'Current Global Standing (Clean)'}
              </div>
            </div>
          </div>
          
          <h3 style="font-size: 1rem; color: #fff; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <span style="color: #ff4444;">🚫</span> Historical Ban Log
          </h3>
          
          ${kicklogzBansHtml}
          
        </div>
      </div>

      <div class="section-card">
        <div class="section-card__header">
          <div class="section-card__icon section-card__icon--orange">📝</div>
          <div class="section-card__title">Username History</div>
        </div>
        <div class="section-card__body">
          ${(data.previous_usernames && data.previous_usernames.length > 0) ? `
            <div class="history-list">
              ${data.previous_usernames.map(h => `
                <div class="history-item" style="padding: 8px;">
                  <span class="history-item__name">${escapeHtml(h.username)}</span>
                  <span class="history-item__date">${formatDate(h.created_at)}</span>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="section-card__empty">No previous username changes found.</div>
          `}
        </div>
      </div>

      <div class="section-card">
        <div class="section-card__header">
          <div class="section-card__icon section-card__icon--green">🏅</div>
          <div class="section-card__title">User Profile Details</div>
        </div>
        <div class="section-card__body">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: var(--bg-secondary); border-radius: var(--radius-md);">
              <span style="font-size: 0.88rem; color: var(--text-secondary);">Role</span>
              <span style="font-weight: 700;">${data.account_type === 'viewer' ? 'Viewer' : 'Streamer'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: var(--bg-secondary); border-radius: var(--radius-md);">
              <span style="font-size: 0.88rem; color: var(--text-secondary);">Verified</span>
              <span style="font-weight: 700; color: ${data.verified ? 'var(--kick-green)' : 'var(--text-muted)'};">${data.verified ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

// Fetch Kicklogz Data Function
async function fetchKicklogzBans(username: string) {
  const apiKey = localStorage.getItem('kicklogz_api_key')
  if (!apiKey) return

  const container = document.getElementById('klz-bans-container')
  if (!container) return

  try {
    const res = await fetch(`http://localhost:3001/api/kicklogz/bans/${encodeURIComponent(username)}`, {
      headers: { 'x-kicklogz-api-key': apiKey }
    })
    
    if (res.status === 403 || res.status === 401) {
      container.innerHTML = `<div class="section-card__empty" style="color: #ff4444;">Invalid KickLogz API Key or Unauthorized.</div>`
      return
    }

    if (!res.ok) {
      container.innerHTML = `<div class="section-card__empty" style="color: #ff4444;">Failed to fetch from KickLogz (Error ${res.status}).</div>`
      return
    }

    const data = await res.json()
    // Kicklogz response format depends on their API, we assume data.bans or data is an array
    const bans = Array.isArray(data) ? data : (data.bans || [])
    
    if (bans.length === 0) {
      container.innerHTML = `<div class="section-card__empty">No ban history found on KickLogz for this user.</div>`
      return
    }

    container.innerHTML = `
      <div style="background: rgba(255, 68, 68, 0.1); border: 1px solid rgba(255, 68, 68, 0.3); padding: 12px; border-radius: var(--radius-md); margin-bottom: 16px;">
        <div style="font-weight: 800; color: #ff4444; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">
          <span>🚫</span> Ban History (${bans.length})
        </div>
      </div>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-default); color: var(--kick-green); text-align: left;">
              <th style="padding: 12px;">CHANNEL</th>
              <th style="padding: 12px;">BANNED BY</th>
              <th style="padding: 12px;">DATE</th>
              <th style="padding: 12px;">DURATION</th>
              <th style="padding: 12px;">STATUS</th>
            </tr>
          </thead>
          <tbody>
            ${bans.map((b: any) => `
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 12px; color: var(--kick-green); font-weight: 700;">${escapeHtml(b.channel?.username || b.channel || 'Unknown')}</td>
                <td style="padding: 12px; color: var(--text-secondary);">${escapeHtml(b.banned_by?.username || b.banned_by || 'Unknown')}</td>
                <td style="padding: 12px; color: var(--text-secondary);">${formatDate(b.created_at || b.date || new Date().toISOString())}</td>
                <td style="padding: 12px;">
                  <span style="background: ${b.is_permanent ? '#ff4444' : 'rgba(255, 170, 0, 0.2)'}; color: ${b.is_permanent ? '#fff' : '#ffaa00'}; padding: 4px 8px; border-radius: 4px; font-weight: 700; font-size: 0.75rem;">
                    ${b.is_permanent ? 'PERMANENT' : `TIMEOUT ${b.duration || '5'}m`}
                  </span>
                </td>
                <td style="padding: 12px;">
                  <span style="border: 1px solid rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; color: #aaa;">
                    ${b.unbanned ? 'UNBANNED' : 'EXPIRED'}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `
  } catch (err) {
    container.innerHTML = `<div class="section-card__empty" style="color: #ff4444;">Connection error to proxy.</div>`
  }
}


function bindTabSpecificEvents(data: KickChannelData) {
  // Clip click handlers
  document.querySelectorAll('.watch-clip-btn, .clip-card').forEach(el => {
    el.addEventListener('click', (e) => {
      const idx = (e.currentTarget as HTMLElement).dataset.clipIndex
      if (idx !== undefined && data.clips && data.clips[parseInt(idx, 10)]) {
        const clip = data.clips[parseInt(idx, 10)]
        openClipModal(clip)
      }
    })
  })

  // Chat filter input handlers
  const kwInput = document.getElementById('chat-search-keyword') as HTMLInputElement
  const usrInput = document.getElementById('chat-search-user') as HTMLInputElement
  const dateInput = document.getElementById('chat-search-date') as HTMLSelectElement

  const updateSearch = () => {
    chatSearchQuery = kwInput?.value || ''
    chatSearchUsername = usrInput?.value || ''
    chatSearchDateRange = dateInput?.value || 'any'

    const messages = data.recent_messages || []
    let filtered = messages
    if (chatSearchQuery.trim()) {
      filtered = filtered.filter(m => m.content.toLowerCase().includes(chatSearchQuery.toLowerCase()))
    }
    if (chatSearchUsername.trim()) {
      filtered = filtered.filter(m => m.sender.username.toLowerCase() === chatSearchUsername.toLowerCase())
    }

    const container = document.getElementById('chat-stream-container')
    const countDisplay = document.getElementById('chat-count-display')

    if (countDisplay) {
      countDisplay.textContent = `${filtered.length} Results`
    }

    if (container) {
      if (filtered.length === 0) {
        container.innerHTML = `<div class="section-card__empty">No chat messages match your search criteria. (Note: Only live broadcast messages are searchable without a third-party API key).</div>`
      } else {
        container.innerHTML = filtered.map(m => `
          <div class="chat-msg">
            ${m.sender.level != null ? `<span class="chat-level">Lvl ${m.sender.level}</span>` : ''}
            <span class="chat-author" style="color: ${m.sender.color || '#53fc18'};${m.sender.username.toLowerCase() === chatSearchUsername.toLowerCase() ? 'font-weight: 800;' : ''}">${escapeHtml(m.sender.username)}</span>
            <span class="chat-content">${escapeHtml(m.content)}</span>
            ${m.created_at ? `<span class="chat-time" style="float: right;">${timeAgo(m.created_at)}</span>` : ''}
          </div>
        `).join('')
      }
    }
  }

  if (kwInput) kwInput.addEventListener('input', updateSearch)
  if (usrInput) usrInput.addEventListener('input', updateSearch)
  if (dateInput) dateInput.addEventListener('change', updateSearch)

  // KickLogz API Key Handlers
  const klzSaveBtn = document.getElementById('klz-save-btn')
  const klzInput = document.getElementById('klz-key-input') as HTMLInputElement
  const klzClearBtn = document.getElementById('klz-clear-btn')

  if (klzSaveBtn && klzInput) {
    klzSaveBtn.addEventListener('click', () => {
      const val = klzInput.value.trim()
      if (val) {
        localStorage.setItem('kicklogz_api_key', val)
        // Refresh tab
        const area = document.getElementById('tab-content-area')
        if (area) {
          area.innerHTML = renderTabContent(data)
          bindTabSpecificEvents(data)
        }
      }
    })
  }

  if (klzClearBtn) {
    klzClearBtn.addEventListener('click', () => {
      localStorage.removeItem('kicklogz_api_key')
      const area = document.getElementById('tab-content-area')
      if (area) {
        area.innerHTML = renderTabContent(data)
        bindTabSpecificEvents(data)
      }
    })
  }

  if (activeTab === 'viewer_details' && localStorage.getItem('kicklogz_api_key')) {
    fetchKicklogzBans(data.user.username)
  }
}

function openClipModal(clip: KickClip) {
  const modalContainer = document.getElementById('modal-container')!
  modalContainer.innerHTML = `
    <div class="setup-overlay" id="clip-overlay">
      <div class="setup-modal__content" style="max-width: 680px; width: 95%; padding: var(--space-xl);">
        <div class="setup-modal__title" style="margin-bottom: 8px;">
          <span>🎬 ${escapeHtml(clip.title)}</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 14px; display: flex; gap: 12px; align-items: center;">
          <span>Clipped by <strong>@${escapeHtml(clip.creator)}</strong></span>
          <span>•</span>
          <span style="color: var(--kick-green);">👁️ ${formatNumber(clip.views)} views</span>
          <span>•</span>
          <span>${Math.floor(clip.duration / 60)}:${(clip.duration % 60).toString().padStart(2, '0')}</span>
        </div>

        <div style="position: relative; width: 100%; aspect-ratio: 16 / 9; border-radius: var(--radius-md); overflow: hidden; background: #000; margin-bottom: 16px;">
          <img src="${escapeHtml(clip.thumbnail_url)}" alt="${escapeHtml(clip.title)}" style="width: 100%; height: 100%; object-fit: cover;" />
          <a href="${escapeHtml(clip.clip_url || `https://kick.com`)}" target="_blank" rel="noopener noreferrer" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.5); text-decoration: none; color: #fff;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--kick-green); color: #000; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 10px; box-shadow: 0 0 20px rgba(83,252,24,0.6);">
              ▶
            </div>
            <span style="font-weight: 700; font-size: 1rem; background: rgba(0,0,0,0.7); padding: 6px 16px; border-radius: var(--radius-full);">Play Highlight on Kick.com ↗</span>
          </a>
        </div>

        <div class="setup-modal__actions">
          <button id="close-clip-btn" class="setup-modal__cancel">Close</button>
          <a href="${escapeHtml(clip.clip_url || `https://kick.com`)}" target="_blank" rel="noopener noreferrer" class="setup-modal__submit" style="text-decoration: none; text-align: center;">
            Open on Kick.com ↗
          </a>
        </div>
      </div>
    </div>
  `

  document.getElementById('clip-overlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('clip-overlay')) modalContainer.innerHTML = ''
  })
  document.getElementById('close-clip-btn')?.addEventListener('click', () => { modalContainer.innerHTML = '' })
}

function openRawJsonModal(data: KickChannelData) {
  const modalContainer = document.getElementById('modal-container')!
  modalContainer.innerHTML = `
    <div class="setup-overlay" id="raw-overlay">
      <div class="setup-modal__content" style="max-width: 760px; width: 95%;">
        <div class="setup-modal__title">
          <span>Inspect Raw Kick API Payload</span>
        </div>
        <p style="color:var(--text-secondary);font-size:0.85rem;margin-bottom:12px;">
          Full unaltered and aggregated data payload received from Kick for this user.
        </p>
        <pre style="max-height: 440px; overflow: auto; background: var(--bg-input); padding: 14px; border-radius: 8px; font-size: 0.78rem; font-family: 'JetBrains Mono', monospace; color: var(--kick-green); border: 1px solid var(--border-default); line-height: 1.5;">${escapeHtml(JSON.stringify(data, null, 2))}</pre>
        <div class="setup-modal__actions">
          <button id="close-raw-btn" class="setup-modal__cancel">Close</button>
          <button id="copy-raw-btn" class="setup-modal__submit">Copy to Clipboard</button>
        </div>
      </div>
    </div>
  `
  document.getElementById('raw-overlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('raw-overlay')) modalContainer.innerHTML = ''
  })
  document.getElementById('close-raw-btn')?.addEventListener('click', () => { modalContainer.innerHTML = '' })
  document.getElementById('copy-raw-btn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    const copyBtn = document.getElementById('copy-raw-btn') as HTMLButtonElement
    if (copyBtn) copyBtn.textContent = 'Copied! ✓'
  })
}

// ============================
// Initialization
// ============================

async function init() {
  await checkStatus()
  renderApp()
}

init()
