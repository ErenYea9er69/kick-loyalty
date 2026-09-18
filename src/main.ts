import './style.css'

// ============================
// Types
// ============================

interface KickChannelData {
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

  // Viewer vs Streamer fields
  account_type?: 'viewer' | 'streamer'
  created_at?: string | null

  // Official API fields
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
}

interface KickUser {
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

interface SubscriberBadge {
  id: number
  channel_id: number
  months: number
  badge_image: { srcset?: string; src: string } | null
}

interface RecentCategory {
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

interface Livestream {
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

interface Chatroom {
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

interface AscendingLink {
  id: number
  channel_id: number
  description?: string | null
  link: string
  created_at?: string
  updated_at?: string
  order: number
  title: string
}

interface PreviousUsername {
  id: number
  user_id: number
  username: string
  created_at: string
}

interface MediaItem {
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

interface AuthStatus {
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

let currentData: KickChannelData | null = null
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
        Lookup any streamer or viewer to inspect channel data, subscriptions, live stats, subscriber badges, name change history, chatroom rules, and social links.
      </p>

      <div class="search-box">
        <input
          type="text"
          id="search-input"
          class="search-box__input"
          placeholder="Enter Kick username (e.g. splash_699, xqc)..."
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
        Want to view your private subscriber metrics & rewards? 
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
      // If credentials are not yet configured, guide the user to the free setup modal
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
      setTimeout(() => {
        const backBtn = document.createElement('button')
        backBtn.className = 'auth-bar__btn auth-bar__btn--kick'
        backBtn.style.marginTop = '16px'
        backBtn.textContent = 'Back to App'
        backBtn.onclick = () => {
          window.history.replaceState({}, document.title, '/')
          renderApp()
        }
        statusDiv?.parentElement?.appendChild(backBtn)
      }, 500)
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
          <label class="setup-modal__label">Kick Client Secret</label>
          <input
            type="password"
            id="setup-client-secret"
            class="setup-modal__input"
            placeholder="Enter Client Secret"
          />
        </div>

        <div class="setup-modal__field">
          <label class="setup-modal__label">OAuth Redirect URI</label>
          <input
            type="text"
            id="setup-redirect-uri"
            class="setup-modal__input"
            value="${escapeHtml(authStatus.redirectUri || 'http://localhost:5173/callback')}"
          />
          <small style="color:var(--text-muted);font-size:0.75rem;margin-top:4px;display:block;">
            Must match the Redirect URL configured in your Kick Developer settings.
          </small>
        </div>

        <div id="setup-msg" style="display: none;"></div>

        <div class="setup-modal__actions">
          <button id="setup-cancel-btn" class="setup-modal__cancel">Cancel</button>
          <button id="setup-submit-btn" class="setup-modal__submit">${forLogin ? '⚡ Connect & Log in with Kick' : 'Save & Test Connection'}</button>
        </div>
      </div>
    </div>
  `

  // Close handlers
  const overlay = document.getElementById('setup-overlay')
  const cancelBtn = document.getElementById('setup-cancel-btn')
  const submitBtn = document.getElementById('setup-submit-btn') as HTMLButtonElement

  const closeModal = () => { modalContainer.innerHTML = '' }

  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal()
  })
  cancelBtn?.addEventListener('click', closeModal)

  submitBtn?.addEventListener('click', async () => {
    const clientId = (document.getElementById('setup-client-id') as HTMLInputElement).value.trim()
    const clientSecret = (document.getElementById('setup-client-secret') as HTMLInputElement).value.trim()
    const redirectUri = (document.getElementById('setup-redirect-uri') as HTMLInputElement).value.trim()
    const msgBox = document.getElementById('setup-msg')!

    if (!clientId || !clientSecret) {
      msgBox.style.display = 'block'
      msgBox.className = 'setup-modal__message setup-modal__message--error'
      msgBox.textContent = 'Please enter both Client ID and Client Secret.'
      return
    }

    submitBtn.disabled = true
    submitBtn.textContent = 'Connecting...'
    msgBox.style.display = 'none'

    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, clientSecret, redirectUri })
      })

      const data = await res.json()

      if (data.success) {
        msgBox.style.display = 'block'
        msgBox.className = 'setup-modal__message setup-modal__message--success'
        msgBox.textContent = `✅ ${data.message}`
        await checkStatus()
        updateAuthBar()
        setTimeout(() => {
          closeModal()
          if (forLogin) {
            startKickLogin()
          }
        }, 1200)
      } else {
        msgBox.style.display = 'block'
        msgBox.className = 'setup-modal__message setup-modal__message--error'
        msgBox.textContent = `⚠️ ${data.message || 'Verification failed.'}`
        await checkStatus()
        updateAuthBar()
      }
    } catch (err: any) {
      msgBox.style.display = 'block'
      msgBox.className = 'setup-modal__message setup-modal__message--error'
      msgBox.textContent = `Error: ${err.message}`
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = forLogin ? '⚡ Connect & Log in with Kick' : 'Save & Test Connection'
    }
  })
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
    renderProfile(data)
  } catch (err: any) {
    container.innerHTML = `
      <div class="error-state">
        <div class="error-state__icon">🔍</div>
        <div class="error-state__title">Channel Not Found</div>
        <div class="error-state__message">${escapeHtml(err.message || 'An unexpected error occurred.')}</div>
        <div style="margin-top: 16px; display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
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

  // Build social links
  const socials: { platform: string; url: string }[] = []
  if (user.instagram) socials.push({ platform: 'Instagram', url: user.instagram.startsWith('http') ? user.instagram : `https://instagram.com/${user.instagram}` })
  if (user.twitter) socials.push({ platform: 'Twitter / X', url: user.twitter.startsWith('http') ? user.twitter : `https://twitter.com/${user.twitter}` })
  if (user.youtube) socials.push({ platform: 'YouTube', url: user.youtube.startsWith('http') ? user.youtube : `https://youtube.com/${user.youtube}` })
  if (user.discord) socials.push({ platform: 'Discord', url: user.discord.startsWith('http') ? user.discord : user.discord })
  if (user.tiktok) socials.push({ platform: 'TikTok', url: user.tiktok.startsWith('http') ? user.tiktok : `https://tiktok.com/@${user.tiktok}` })
  if (user.facebook) socials.push({ platform: 'Facebook', url: user.facebook.startsWith('http') ? user.facebook : `https://facebook.com/${user.facebook}` })

  const links = data.ascending_links || []

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

      <!-- Stats Row -->
      <div class="stats-row">
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
          <div class="stat-card__value" style="color: var(--kick-green); font-size: 1.15rem; font-weight: 800;">Clean</div>
          <div class="stat-card__label">Account Status</div>
        </div>
        ${data.created_at ? `
        <div class="stat-card">
          <div class="stat-card__value" style="font-size: 0.95rem; font-weight: 700;">${formatDate(data.created_at)}</div>
          <div class="stat-card__label">Member Since</div>
        </div>
        ` : ''}
        <div class="stat-card">
          <div class="stat-card__value">${data.previous_usernames?.length || 0}</div>
          <div class="stat-card__label">Name Changes</div>
        </div>
        ` : `
        ${isLive ? `
        <div class="stat-card">
          <div class="stat-card__value" style="color: var(--status-live);">${formatNumber(data.livestream!.viewer_count)}</div>
          <div class="stat-card__label">Watching Live</div>
        </div>
        ` : ''}
        ${data.active_subscribers_count != null ? `
        <div class="stat-card">
          <div class="stat-card__value" style="color: var(--kick-green);">${formatNumber(data.active_subscribers_count)}</div>
          <div class="stat-card__label">Active Subscribers</div>
        </div>
        ` : ''}
        <div class="stat-card">
          <div class="stat-card__value">${data.subscriber_badges?.length || 0}</div>
          <div class="stat-card__label">Badge Tiers</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value">${data.recent_categories?.length || 0}</div>
          <div class="stat-card__label">Categories</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value">${data.previous_usernames?.length || 0}</div>
          <div class="stat-card__label">Name Changes</div>
        </div>
        `}
      </div>

      <!-- Subscriber Stats Section (if official counts available) -->
      ${renderSubscriberStatsSection(data)}

      <!-- Sections Grid -->
      <div class="sections-grid">
        ${renderLivestreamSection(data)}
        ${renderSubscriberBadgesSection(data)}
        ${renderUsernameHistorySection(data)}
        ${renderRecentCategoriesSection(data)}
        ${renderSocialsSection(socials)}
        ${renderLinksSection(links)}
        ${renderChatroomSection(data)}
        ${renderChannelDetailsSection(data)}
      </div>

      <!-- Quick external link & Raw JSON viewer -->
      <div style="text-align: center; margin-top: var(--space-xl); display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap;">
        <a href="https://kick.com/${escapeHtml(data.slug)}" target="_blank" rel="noopener noreferrer" class="quick-link">
          Open kick.com/${escapeHtml(data.slug)} in New Tab ↗
        </a>
        <button id="view-raw-json-btn" class="quick-link" style="background: var(--bg-card); cursor: pointer;">
          { } View Raw Kick Payload
        </button>
      </div>
    </div>

    <div class="data-note">
      <p class="data-note__text">
        ⓘ Data aggregated from Kick's official developer API, channel endpoints, and live stream status.
      </p>
    </div>
  `

  bindProfileActions()
}

function bindProfileActions() {
  const rawBtn = document.getElementById('view-raw-json-btn')
  if (rawBtn) {
    rawBtn.addEventListener('click', () => {
      if (!currentData) return
      const modalContainer = document.getElementById('modal-container')!
      modalContainer.innerHTML = `
        <div class="setup-overlay" id="raw-overlay">
          <div class="setup-modal__content" style="max-width: 720px; width: 95%;">
            <div class="setup-modal__title">
              <span>Inspect Raw Kick JSON</span>
            </div>
            <p style="color:var(--text-secondary);font-size:0.85rem;margin-bottom:12px;">
              Full unaltered API response received for this user from Kick.
            </p>
            <pre style="max-height: 420px; overflow: auto; background: var(--bg-input); padding: 14px; border-radius: 8px; font-size: 0.78rem; font-family: 'JetBrains Mono', monospace; color: var(--kick-green); border: 1px solid var(--border-default); line-height: 1.5;">${escapeHtml(JSON.stringify(currentData, null, 2))}</pre>
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
        if (currentData) {
          navigator.clipboard.writeText(JSON.stringify(currentData, null, 2))
          const copyBtn = document.getElementById('copy-raw-btn') as HTMLButtonElement
          if (copyBtn) copyBtn.textContent = 'Copied! ✓'
        }
      })
    })
  }
}

function renderSubscriberStatsSection(data: KickChannelData): string {
  if (data.active_subscribers_count == null && data.active_gifted_subscribers_count == null) {
    return ''
  }

  const active = data.active_subscribers_count ?? 0
  const gifted = data.active_gifted_subscribers_count ?? 0
  const canceled = data.canceled_subscribers_count ?? 0

  return `
  <div class="section-card section-card--full" style="margin-bottom: var(--space-lg);">
    <div class="section-card__header">
      <div class="section-card__icon section-card__icon--green">💎</div>
      <div class="section-card__title">Subscriber & Gifting Breakdown</div>
      <span class="section-card__count" style="color:var(--kick-green); background:rgba(83,252,24,0.1);">Official Kick Metrics</span>
    </div>
    <div class="section-card__body">
      <div class="sub-stats">
        <div class="sub-stat">
          <div class="sub-stat__value">${formatNumber(active)}</div>
          <div class="sub-stat__label">Active Subscribers</div>
        </div>
        <div class="sub-stat">
          <div class="sub-stat__value" style="color:#a855f7;">${formatNumber(gifted)}</div>
          <div class="sub-stat__label">Gifted Subs</div>
        </div>
        <div class="sub-stat">
          <div class="sub-stat__value" style="color:#ff6666;">${formatNumber(canceled)}</div>
          <div class="sub-stat__label">Canceled Subs</div>
        </div>
      </div>
    </div>
  </div>
  `
}

function renderLivestreamSection(data: KickChannelData): string {
  if (data.account_type === 'viewer') {
    return `
    <div class="section-card">
      <div class="section-card__header">
        <div class="section-card__icon section-card__icon--blue">👤</div>
        <div class="section-card__title">Watcher Profile</div>
        <span class="section-card__count" style="color:#4d9fff; background:rgba(77,159,255,0.1);">Community Viewer</span>
      </div>
      <div class="section-card__body">
        <div class="section-card__empty" style="text-align: left; padding: 12px 18px;">
          <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">
            ${escapeHtml(data.user.username)}
          </div>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6;">
            This account is registered on Kick as a community viewer. Viewers use their accounts to watch livestreams, participate in chatrooms, and support creators. No broadcast streams have been started on this channel.
          </p>
        </div>
      </div>
    </div>
    `
  }

  const ls = data.livestream
  if (!ls || !ls.is_live) {
    return `
    <div class="section-card">
      <div class="section-card__header">
        <div class="section-card__icon section-card__icon--red">📡</div>
        <div class="section-card__title">Livestream Status</div>
      </div>
      <div class="section-card__body">
        <div class="section-card__empty">
          <div style="font-size: 2rem; margin-bottom: 8px;">😴</div>
          Streamer is currently offline
        </div>
      </div>
    </div>
    `
  }

  const thumbUrl = ls.thumbnail?.src || ''
  const tags = ls.tags || []
  const categories = ls.categories || []

  return `
  <div class="section-card section-card--full">
    <div class="section-card__header">
      <div class="section-card__icon section-card__icon--red">📡</div>
      <div class="section-card__title">Currently Streaming Live</div>
      <span class="section-card__count" style="color: var(--status-live); background: rgba(255,68,68,0.1);">● LIVE</span>
    </div>
    <div class="section-card__body">
      <div class="livestream-info">
        ${thumbUrl ? `
        <div class="livestream-info__thumbnail">
          <img src="${escapeHtml(thumbUrl)}" alt="Stream thumbnail" loading="lazy" />
          <div class="livestream-info__viewers">${formatNumber(ls.viewer_count)} watching</div>
        </div>
        ` : ''}
        <div class="livestream-info__title">${escapeHtml(ls.session_title || data.stream_title || 'Untitled Stream')}</div>
        <div class="livestream-info__meta">
          ${categories.map(c => `<span class="livestream-info__tag">${escapeHtml(c.name)}</span>`).join('')}
          ${tags.map(t => `<span class="livestream-info__tag">#${escapeHtml(t)}</span>`).join('')}
          <span class="livestream-info__tag">🌐 ${escapeHtml(ls.language || 'English')}</span>
          ${ls.is_mature ? '<span class="livestream-info__tag">🔞 Mature 18+</span>' : ''}
          <span class="livestream-info__tag">⏱ Started ${timeAgo(ls.created_at)}</span>
        </div>
      </div>
    </div>
  </div>
  `
}

function renderSubscriberBadgesSection(data: KickChannelData): string {
  if (data.account_type === 'viewer') {
    return `
    <div class="section-card">
      <div class="section-card__header">
        <div class="section-card__icon section-card__icon--purple">🏅</div>
        <div class="section-card__title">Channel Subscriptions</div>
      </div>
      <div class="section-card__body">
        <div class="section-card__empty">
          Viewer account — Custom subscriber badge tiers are only created by affiliate & partnered broadcast streamers.
        </div>
      </div>
    </div>
    `
  }

  const badges = data.subscriber_badges || []

  if (badges.length === 0) {
    return `
    <div class="section-card">
      <div class="section-card__header">
        <div class="section-card__icon section-card__icon--purple">🏅</div>
        <div class="section-card__title">Subscriber Badges</div>
      </div>
      <div class="section-card__body">
        <div class="section-card__empty">No subscriber badges configured</div>
      </div>
    </div>
    `
  }

  return `
  <div class="section-card">
    <div class="section-card__header">
      <div class="section-card__icon section-card__icon--purple">🏅</div>
      <div class="section-card__title">Subscriber Badges</div>
      <span class="section-card__count">${badges.length} tiers</span>
    </div>
    <div class="section-card__body">
      <div class="badge-grid">
        ${badges.map(b => `
          <div class="badge-item">
            ${b.badge_image?.src ? `
              <img src="${escapeHtml(b.badge_image.src)}" alt="${b.months} month badge" loading="lazy" onerror="this.style.display='none'" />
            ` : `
              <div style="width:40px;height:40px;border-radius:8px;background:var(--bg-badge);display:flex;align-items:center;justify-content:center;font-size:1.2rem;">🏅</div>
            `}
            <span class="badge-item__label">${b.months}+ mo</span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
  `
}

function renderUsernameHistorySection(data: KickChannelData): string {
  const history = data.previous_usernames || []

  if (history.length === 0) {
    return `
    <div class="section-card">
      <div class="section-card__header">
        <div class="section-card__icon section-card__icon--orange">📝</div>
        <div class="section-card__title">Username History</div>
      </div>
      <div class="section-card__body">
        <div class="section-card__empty">No previous username changes</div>
      </div>
    </div>
    `
  }

  return `
  <div class="section-card">
    <div class="section-card__header">
      <div class="section-card__icon section-card__icon--orange">📝</div>
      <div class="section-card__title">Username History</div>
      <span class="section-card__count">${history.length} records</span>
    </div>
    <div class="section-card__body">
      <div class="history-list">
        ${history.map(h => `
          <div class="history-item">
            <span class="history-item__name">${escapeHtml(h.username)}</span>
            <span class="history-item__date">${formatDate(h.created_at)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
  `
}

function renderRecentCategoriesSection(data: KickChannelData): string {
  const categories = data.recent_categories || []

  if (categories.length === 0) {
    return `
    <div class="section-card">
      <div class="section-card__header">
        <div class="section-card__icon section-card__icon--blue">🎮</div>
        <div class="section-card__title">Recent Categories</div>
      </div>
      <div class="section-card__body">
        <div class="section-card__empty">No recent categories recorded</div>
      </div>
    </div>
    `
  }

  return `
  <div class="section-card">
    <div class="section-card__header">
      <div class="section-card__icon section-card__icon--blue">🎮</div>
      <div class="section-card__title">Recent Categories</div>
      <span class="section-card__count">${categories.length}</span>
    </div>
    <div class="section-card__body">
      <div class="category-grid">
        ${categories.map(c => {
          const iconUrl = c.category?.icon || ''
          return `
            <div class="category-pill">
              ${iconUrl ? `<img src="${escapeHtml(iconUrl)}" alt="" loading="lazy" onerror="this.style.display='none'" />` : ''}
              ${escapeHtml(c.name)}
            </div>
          `
        }).join('')}
      </div>
    </div>
  </div>
  `
}

function renderSocialsSection(socials: { platform: string; url: string }[]): string {
  if (socials.length === 0) {
    return `
    <div class="section-card">
      <div class="section-card__header">
        <div class="section-card__icon section-card__icon--pink">🌐</div>
        <div class="section-card__title">Social Links</div>
      </div>
      <div class="section-card__body">
        <div class="section-card__empty">No social accounts connected</div>
      </div>
    </div>
    `
  }

  return `
  <div class="section-card">
    <div class="section-card__header">
      <div class="section-card__icon section-card__icon--pink">🌐</div>
      <div class="section-card__title">Social Profiles</div>
      <span class="section-card__count">${socials.length}</span>
    </div>
    <div class="section-card__body">
      <div class="social-links">
        ${socials.map(s => `
          <a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" class="social-link">
            <span>${getSocialIcon(s.platform)}</span>
            <span class="social-link__platform">${escapeHtml(s.platform)}</span>
          </a>
        `).join('')}
      </div>
    </div>
  </div>
  `
}

function renderLinksSection(links: AscendingLink[]): string {
  if (links.length === 0) return ''

  return `
  <div class="section-card">
    <div class="section-card__header">
      <div class="section-card__icon section-card__icon--green">🔗</div>
      <div class="section-card__title">Channel Custom Links</div>
      <span class="section-card__count">${links.length}</span>
    </div>
    <div class="section-card__body">
      <div class="social-links">
        ${links.map(l => `
          <a href="${escapeHtml(l.link)}" target="_blank" rel="noopener noreferrer" class="social-link">
            <span>🔗</span>
            <span class="social-link__platform">${escapeHtml(l.title)}</span>
          </a>
        `).join('')}
      </div>
    </div>
  </div>
  `
}

function renderChatroomSection(data: KickChannelData): string {
  const chat = data.chatroom
  if (!chat) return ''

  return `
  <div class="section-card">
    <div class="section-card__header">
      <div class="section-card__icon section-card__icon--green">💬</div>
      <div class="section-card__title">Chatroom Configuration</div>
    </div>
    <div class="section-card__body">
      <div class="config-grid">
        <div class="config-item">
          <span class="config-item__label">Chat Mode</span>
          <span class="config-item__value">${escapeHtml(chat.chat_mode || 'Default')}</span>
        </div>
        <div class="config-item">
          <span class="config-item__label">Slow Mode</span>
          <span class="config-item__value ${chat.slow_mode ? 'config-item__value--on' : 'config-item__value--off'}">${chat.slow_mode ? `ON (${chat.message_interval}s)` : 'OFF'}</span>
        </div>
        <div class="config-item">
          <span class="config-item__label">Followers Only</span>
          <span class="config-item__value ${chat.followers_mode ? 'config-item__value--on' : 'config-item__value--off'}">${chat.followers_mode ? `ON (${chat.following_min_duration}m)` : 'OFF'}</span>
        </div>
        <div class="config-item">
          <span class="config-item__label">Subscribers Only</span>
          <span class="config-item__value ${chat.subscribers_mode ? 'config-item__value--on' : 'config-item__value--off'}">${chat.subscribers_mode ? 'ON' : 'OFF'}</span>
        </div>
        <div class="config-item">
          <span class="config-item__label">Emotes Only</span>
          <span class="config-item__value ${chat.emotes_mode ? 'config-item__value--on' : 'config-item__value--off'}">${chat.emotes_mode ? 'ON' : 'OFF'}</span>
        </div>
        <div class="config-item">
          <span class="config-item__label">Chatroom ID</span>
          <span class="config-item__value mono">${chat.id}</span>
        </div>
      </div>
    </div>
  </div>
  `
}

function renderChannelDetailsSection(data: KickChannelData): string {
  const user = data.user

  return `
  <div class="section-card">
    <div class="section-card__header">
      <div class="section-card__icon section-card__icon--blue">ℹ️</div>
      <div class="section-card__title">Channel Details</div>
    </div>
    <div class="section-card__body">
      <div class="config-grid">
        <div class="config-item">
          <span class="config-item__label">Channel ID</span>
          <span class="config-item__value mono">${data.id}</span>
        </div>
        <div class="config-item">
          <span class="config-item__label">User ID</span>
          <span class="config-item__value mono">${data.user_id}</span>
        </div>
        <div class="config-item">
          <span class="config-item__label">Verified Creator</span>
          <span class="config-item__value ${data.verified ? 'config-item__value--on' : 'config-item__value--off'}">${data.verified ? '✓ YES' : 'NO'}</span>
        </div>
        <div class="config-item">
          <span class="config-item__label">Subscriptions</span>
          <span class="config-item__value ${data.subscription_enabled ? 'config-item__value--on' : 'config-item__value--off'}">${data.subscription_enabled ? 'Enabled' : 'Disabled'}</span>
        </div>
        <div class="config-item">
          <span class="config-item__label">VOD Archiving</span>
          <span class="config-item__value ${data.vod_enabled ? 'config-item__value--on' : 'config-item__value--off'}">${data.vod_enabled ? 'Enabled' : 'Disabled'}</span>
        </div>
        <div class="config-item">
          <span class="config-item__label">Can Host</span>
          <span class="config-item__value ${data.can_host ? 'config-item__value--on' : 'config-item__value--off'}">${data.can_host ? 'YES' : 'NO'}</span>
        </div>
        <div class="config-item">
          <span class="config-item__label">Account Banned</span>
          <span class="config-item__value ${data.is_banned ? 'config-item__value--off' : 'config-item__value--on'}" style="${data.is_banned ? 'color: #ff4444;' : ''}">${data.is_banned ? '⚠️ BANNED' : 'CLEAN'}</span>
        </div>
        <div class="config-item">
          <span class="config-item__label">Chat Muted</span>
          <span class="config-item__value ${data.muted ? 'config-item__value--off' : 'config-item__value--on'}">${data.muted ? 'YES' : 'NO'}</span>
        </div>
        ${user.country ? `
        <div class="config-item">
          <span class="config-item__label">Country</span>
          <span class="config-item__value">${escapeHtml(user.country)}</span>
        </div>
        ` : ''}
        ${user.state ? `
        <div class="config-item">
          <span class="config-item__label">State / Region</span>
          <span class="config-item__value">${escapeHtml(user.state)}</span>
        </div>
        ` : ''}
        ${user.city ? `
        <div class="config-item">
          <span class="config-item__label">City</span>
          <span class="config-item__value">${escapeHtml(user.city)}</span>
        </div>
        ` : ''}
        ${data.playback_url ? `
        <div class="config-item" style="grid-column: 1 / -1;">
          <span class="config-item__label">HLS Playback URL</span>
          <span class="config-item__value mono" style="font-size:0.75rem;word-break:break-all;">${escapeHtml(data.playback_url)}</span>
        </div>
        ` : ''}
      </div>
    </div>
  </div>
  `
}

// ============================
// Initialization
// ============================

async function init() {
  await checkStatus()
  renderApp()
}

init()
