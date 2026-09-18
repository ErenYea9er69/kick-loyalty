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
let activeTab: 'clips' | 'subs' | 'chat' | 'rewards' | 'mod' | 'about' = 'clips'
let chatSearchQuery: string = ''
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
      activeTab = 'mod'
    } else if (data.clips && data.clips.length > 0) {
      activeTab = 'clips'
    } else {
      activeTab = 'subs'
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
        <button class="profile-tab ${activeTab === 'clips' ? 'profile-tab--active' : ''}" data-tab="clips">
          <span>🎬</span> Clips & Highlights
          <span class="profile-tab__count">${clipsCount}</span>
        </button>
        <button class="profile-tab ${activeTab === 'subs' ? 'profile-tab--active' : ''}" data-tab="subs">
          <span>💎</span> Subscriptions & Gifted
          <span class="profile-tab__count">${totalGiftsCount}</span>
        </button>
        <button class="profile-tab ${activeTab === 'chat' ? 'profile-tab--active' : ''}" data-tab="chat">
          <span>💬</span> Live Chat & Activity
          <span class="profile-tab__count">${messagesCount}</span>
        </button>
        <button class="profile-tab ${activeTab === 'rewards' ? 'profile-tab--active' : ''}" data-tab="rewards">
          <span>🪙</span> Channel Point Rewards
        </button>
        <button class="profile-tab ${activeTab === 'mod' ? 'profile-tab--active' : ''}" data-tab="mod">
          <span>🛡️</span> Moderation & Ban Standing
        </button>
        <button class="profile-tab ${activeTab === 'about' ? 'profile-tab--active' : ''}" data-tab="about">
          <span>👤</span> About & Community
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
    case 'subs':
      return renderSubsTab(data)
    case 'chat':
      return renderChatTab(data)
    case 'rewards':
      return renderRewardsTab(data)
    case 'mod':
      return renderModTab(data)
    case 'about':
      return renderAboutTab(data)
    default:
      return renderClipsTab(data)
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

function renderSubsTab(data: KickChannelData): string {
  const activeSubs = data.active_subscribers_count ?? 0
  const activeGifted = data.active_gifted_subscribers_count ?? 0
  const canceled = data.canceled_subscribers_count ?? 0

  const boards = data.leaderboards || { gifts: [], gifts_week: [], gifts_month: [] }
  const allTimeGifts = boards.gifts || []
  const monthGifts = boards.gifts_month || []
  const weekGifts = boards.gifts_week || []

  return `
    <div>
      <!-- Kick 95/5 Revenue Callout -->
      <div style="background: linear-gradient(135deg, rgba(83, 252, 24, 0.12), rgba(83, 252, 24, 0.03)); border: 1px solid rgba(83, 252, 24, 0.3); border-radius: var(--radius-lg); padding: var(--space-lg); margin-bottom: var(--space-xl); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-md);">
        <div>
          <div style="font-weight: 800; font-size: 1.1rem; color: var(--kick-green); margin-bottom: 2px;">
            💎 Kick Creator-First 95/5 Subscription Revenue
          </div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">
            Creators retain 95% of all subscription and gifted sub income, the highest creator split in livestreaming.
          </div>
        </div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.3rem; font-weight: 800; color: var(--kick-green);">
          95% / 5%
        </div>
      </div>

      <!-- Sub Metric Highlights (if official counts available) -->
      ${(activeSubs > 0 || activeGifted > 0 || canceled > 0) ? `
      <div class="sub-stats" style="margin-bottom: var(--space-xl);">
        <div class="sub-stat">
          <div class="sub-stat__value">${formatNumber(activeSubs)}</div>
          <div class="sub-stat__label">Active Direct Subscribers</div>
        </div>
        <div class="sub-stat">
          <div class="sub-stat__value" style="color: #a855f7;">${formatNumber(activeGifted)}</div>
          <div class="sub-stat__label">Active Gifted Subs</div>
        </div>
        <div class="sub-stat">
          <div class="sub-stat__value" style="color: #ff6666;">${formatNumber(canceled)}</div>
          <div class="sub-stat__label">Canceled Subs</div>
        </div>
      </div>
      ` : ''}

      <!-- Top Gifted Subs Leaderboards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-lg);">
        <!-- All-Time Leaderboard -->
        <div class="section-card">
          <div class="section-card__header">
            <div class="section-card__icon section-card__icon--green">🏆</div>
            <div class="section-card__title">All-Time Top Gifters</div>
            <span class="section-card__count">${allTimeGifts.length} Top Contributors</span>
          </div>
          <div class="section-card__body">
            ${renderLeaderboardList(allTimeGifts)}
          </div>
        </div>

        <!-- Monthly Leaderboard -->
        <div class="section-card">
          <div class="section-card__header">
            <div class="section-card__icon section-card__icon--blue">📅</div>
            <div class="section-card__title">This Month's Gifters</div>
            <span class="section-card__count">${monthGifts.length}</span>
          </div>
          <div class="section-card__body">
            ${renderLeaderboardList(monthGifts)}
          </div>
        </div>

        <!-- Weekly Leaderboard -->
        <div class="section-card">
          <div class="section-card__header">
            <div class="section-card__icon section-card__icon--orange">⚡</div>
            <div class="section-card__title">This Week's Gifters</div>
            <span class="section-card__count">${weekGifts.length}</span>
          </div>
          <div class="section-card__body">
            ${renderLeaderboardList(weekGifts)}
          </div>
        </div>
      </div>
    </div>
  `
}

function renderLeaderboardList(items: LeaderboardGifter[]): string {
  if (!items || items.length === 0) {
    return `<div class="section-card__empty">No gifted subscriptions recorded for this period.</div>`
  }

  return `
    <div class="leaderboard-list">
      ${items.map((item, index) => {
        const rank = index + 1
        const rankClass = rank === 1 ? 'leaderboard-rank--1' : rank === 2 ? 'leaderboard-rank--2' : rank === 3 ? 'leaderboard-rank--3' : ''
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`

        return `
          <div class="leaderboard-item">
            <div class="leaderboard-rank ${rankClass}">
              ${medal}
            </div>
            <div class="leaderboard-user">${escapeHtml(item.username)}</div>
            <div class="leaderboard-qty">
              <span>🎁</span> ${formatNumber(item.quantity)} subs
            </div>
          </div>
        `
      }).join('')}
    </div>
  `
}

// ============================
// 3. Live Chat & Activity Tab
// ============================

function renderChatTab(data: KickChannelData): string {
  const messages = data.recent_messages || []

  // Filter messages based on chatSearchQuery if any
  const filtered = chatSearchQuery.trim()
    ? messages.filter(m => 
        m.content.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
        m.sender.username.toLowerCase().includes(chatSearchQuery.toLowerCase())
      )
    : messages

  return `
    <div class="section-card section-card--full">
      <div class="section-card__header" style="flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div class="section-card__icon section-card__icon--green">💬</div>
          <div class="section-card__title">Recent Live Chat Activity</div>
        </div>
        <span id="chat-count-display" class="section-card__count" style="color: var(--kick-green); background: rgba(83,252,24,0.1);">
          ${filtered.length} / ${messages.length} Messages
        </span>
      </div>

      <div class="section-card__body">
        <!-- Interactive Search / Filter Bar -->
        <div class="chat-filter-bar">
          <input
            type="text"
            id="chat-filter-input"
            class="chat-filter-input"
            placeholder="🔍 Search chat messages or filter by username..."
            value="${escapeHtml(chatSearchQuery)}"
          />
        </div>

        <!-- Chat Message Stream -->
        <div id="chat-stream-container" class="chat-stream">
          ${filtered.length === 0 ? `
            <div class="section-card__empty">No chat messages match "${escapeHtml(chatSearchQuery)}".</div>
          ` : filtered.map(m => `
            <div class="chat-msg">
              ${m.sender.level != null ? `<span class="chat-level">Lvl ${m.sender.level}</span>` : ''}
              <span class="chat-author" style="color: ${m.sender.color || '#53fc18'};">${escapeHtml(m.sender.username)}</span>
              <span class="chat-content">${escapeHtml(m.content)}</span>
              ${m.created_at ? `<span class="chat-time">${timeAgo(m.created_at)}</span>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `
}

// ============================
// 4. Channel Point Rewards & Loyalty Tab
// ============================

function renderRewardsTab(data: KickChannelData): string {
  const rewards = data.rewards || [
    { id: 1, title: 'Hydrate Streamer', cost: 500, description: 'Prompt the streamer to drink water and stay healthy live.', icon: '💧' },
    { id: 2, title: 'Highlight Message', cost: 1200, description: 'Highlight your message in chat with glowing gold border.', icon: '✨' },
    { id: 3, title: 'Timeout a Chatter', cost: 10000, description: 'Timeout any non-moderator chatter for 60 seconds.', icon: '⏳' },
    { id: 4, title: 'VIP Diamond Badge (24h)', cost: 50000, description: 'Wear the diamond VIP badge in chat for 24 hours.', icon: '💎' },
    { id: 5, title: 'TTS Voice Message', cost: 25000, description: 'Text-to-speech message played live on broadcast.', icon: '🔊' },
  ]

  return `
    <div>
      <!-- How Rewards Work Box -->
      <div style="background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.02)); border: 1px solid rgba(255, 215, 0, 0.25); border-radius: var(--radius-lg); padding: var(--space-xl); margin-bottom: var(--space-xl);">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
          <span style="font-size: 1.8rem;">🪙</span>
          <div style="font-size: 1.2rem; font-weight: 800; color: #ffd700;">Kick Channel Points & Community Loyalty</div>
        </div>
        <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.6; margin-bottom: var(--space-md);">
          Viewers earn loyalty points simply by tuning in, chatting, and participating in the channel. Points can be redeemed for on-stream actions, TTS voice messages, chat perks, and interactive broadcaster timeouts.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div style="background: rgba(0,0,0,0.3); padding: 10px 14px; border-radius: var(--radius-md); font-size: 0.82rem;">
            📺 <strong>+10 Points</strong> every 5 mins watched
          </div>
          <div style="background: rgba(0,0,0,0.3); padding: 10px 14px; border-radius: var(--radius-md); font-size: 0.82rem;">
            🔔 <strong>+250 Points</strong> for following channel
          </div>
          <div style="background: rgba(0,0,0,0.3); padding: 10px 14px; border-radius: var(--radius-md); font-size: 0.82rem;">
            💎 <strong>2X Multiplier</strong> for active subscribers
          </div>
        </div>
      </div>

      <!-- Rewards Grid -->
      <div class="rewards-grid">
        ${rewards.map(r => `
          <div class="reward-card">
            <div class="reward-header">
              <span class="reward-icon">${r.icon}</span>
              <span class="reward-cost">${formatNumber(r.cost)} PTS</span>
            </div>
            <div class="reward-title">${escapeHtml(r.title)}</div>
            <div class="reward-desc">${escapeHtml(r.description)}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

// ============================
// 5. Moderation & Ban Standing Tab
// ============================

function renderModTab(data: KickChannelData): string {
  const isBanned = data.is_banned === true
  const isMuted = data.muted === true

  return `
    <div>
      <!-- Moderation Standing Hero Card -->
      <div class="mod-standing-card" style="${isBanned ? 'border-color: rgba(255, 68, 68, 0.4); background: rgba(255, 68, 68, 0.08);' : ''}">
        <div class="mod-shield-icon">${isBanned ? '⛔' : '🛡️'}</div>
        <div>
          <div class="mod-standing-title" style="${isBanned ? 'color: #ff4444;' : ''}">
            ${isBanned ? 'Account Action Required (Banned)' : 'Good Standing (100% Clean Record)'}
          </div>
          <div class="mod-standing-desc">
            ${isBanned 
              ? 'This account has been flagged or suspended by Kick Moderation for a terms of service violation.' 
              : 'This account adheres to all Kick Community Guidelines with zero active restrictions, zero channel strikes, and clean standing across the platform.'}
          </div>
        </div>
      </div>

      <!-- 3 Key Safety Metrics -->
      <div class="mod-grid" style="margin-bottom: var(--space-xl);">
        <div class="mod-metric-box">
          <div class="mod-metric-value" style="color: ${isBanned ? '#ff4444' : 'var(--kick-green)'};">
            ${isBanned ? '1 Ban' : '0 Bans'}
          </div>
          <div class="mod-metric-label">Active Channel Bans</div>
        </div>
        <div class="mod-metric-box">
          <div class="mod-metric-value" style="color: ${isMuted ? '#ffaa00' : 'var(--kick-green)'};">
            ${isMuted ? 'MUTED' : 'CLEAN'}
          </div>
          <div class="mod-metric-label">Chat Mute Status</div>
        </div>
        <div class="mod-metric-box">
          <div class="mod-metric-value" style="color: var(--kick-green);">
            0 Strikes
          </div>
          <div class="mod-metric-label">Community Strikes</div>
        </div>
      </div>

      <!-- Verification & Safety Audit -->
      <div class="section-card">
        <div class="section-card__header">
          <div class="section-card__icon section-card__icon--blue">🔒</div>
          <div class="section-card__title">Platform Trust & Verification Audit</div>
        </div>
        <div class="section-card__body">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--bg-secondary); border-radius: var(--radius-md);">
              <span style="font-size: 0.88rem; color: var(--text-secondary);">Account Registration</span>
              <span style="font-weight: 700; font-size: 0.9rem;">${data.created_at ? formatDate(data.created_at) : 'Active User'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--bg-secondary); border-radius: var(--radius-md);">
              <span style="font-size: 0.88rem; color: var(--text-secondary);">Creator Verification Status</span>
              <span style="font-weight: 700; font-size: 0.9rem; color: ${data.verified ? 'var(--kick-green)' : 'var(--text-muted)'};">
                ${data.verified ? '✓ Official Verified Creator' : 'Standard Community Member'}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--bg-secondary); border-radius: var(--radius-md);">
              <span style="font-size: 0.88rem; color: var(--text-secondary);">Safety Compliance</span>
              <span style="font-weight: 700; font-size: 0.9rem; color: var(--kick-green);">100% In Good Standing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

// ============================
// 6. About & Community Tab
// ============================

function renderAboutTab(data: KickChannelData): string {
  const user = data.user
  const socials: { platform: string; url: string }[] = []
  if (user.instagram) socials.push({ platform: 'Instagram', url: user.instagram.startsWith('http') ? user.instagram : `https://instagram.com/${user.instagram}` })
  if (user.twitter) socials.push({ platform: 'Twitter / X', url: user.twitter.startsWith('http') ? user.twitter : `https://twitter.com/${user.twitter}` })
  if (user.youtube) socials.push({ platform: 'YouTube', url: user.youtube.startsWith('http') ? user.youtube : `https://youtube.com/${user.youtube}` })
  if (user.discord) socials.push({ platform: 'Discord', url: user.discord.startsWith('http') ? user.discord : user.discord })
  if (user.tiktok) socials.push({ platform: 'TikTok', url: user.tiktok.startsWith('http') ? user.tiktok : `https://tiktok.com/@${user.tiktok}` })
  if (user.facebook) socials.push({ platform: 'Facebook', url: user.facebook.startsWith('http') ? user.facebook : `https://facebook.com/${user.facebook}` })

  const links = data.ascending_links || []

  return `
    <div class="sections-grid">
      ${renderSubscriberBadgesSection(data)}
      ${renderUsernameHistorySection(data)}
      ${renderRecentCategoriesSection(data)}
      ${renderSocialsSection(socials)}
      ${renderLinksSection(links)}
    </div>
  `
}

function renderSubscriberBadgesSection(data: KickChannelData): string {
  const badges = data.subscriber_badges || []
  if (badges.length === 0) {
    return `
    <div class="section-card">
      <div class="section-card__header">
        <div class="section-card__icon section-card__icon--green">🏅</div>
        <div class="section-card__title">Subscriber Loyalty Badges</div>
      </div>
      <div class="section-card__body">
        <div class="section-card__empty">No custom subscriber badges configured</div>
      </div>
    </div>
    `
  }

  return `
  <div class="section-card">
    <div class="section-card__header">
      <div class="section-card__icon section-card__icon--green">🏅</div>
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

// ============================
// Profile Event Handlers
// ============================

function bindProfileEvents(data: KickChannelData) {
  // Tab Switching
  document.querySelectorAll('.profile-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const target = (e.currentTarget as HTMLElement).dataset.tab as any
      if (target && target !== activeTab) {
        activeTab = target
        // Update active tab class
        document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('profile-tab--active'))
        tab.classList.add('profile-tab--active')

        // Re-render tab content
        const area = document.getElementById('tab-content-area')
        if (area) {
          area.innerHTML = renderTabContent(data)
          bindTabSpecificEvents(data)
        }
      }
    })
  })

  bindTabSpecificEvents(data)

  // Raw JSON viewer
  const rawBtn = document.getElementById('view-raw-json-btn')
  if (rawBtn) {
    rawBtn.addEventListener('click', () => openRawJsonModal(data))
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

  // Chat filter input handler
  const chatInput = document.getElementById('chat-filter-input') as HTMLInputElement
  if (chatInput) {
    chatInput.addEventListener('input', (e) => {
      chatSearchQuery = (e.target as HTMLInputElement).value
      const messages = data.recent_messages || []
      const filtered = chatSearchQuery.trim()
        ? messages.filter(m => 
            m.content.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
            m.sender.username.toLowerCase().includes(chatSearchQuery.toLowerCase())
          )
        : messages

      const container = document.getElementById('chat-stream-container')
      const countDisplay = document.getElementById('chat-count-display')

      if (countDisplay) {
        countDisplay.textContent = `${filtered.length} / ${messages.length} Messages`
      }

      if (container) {
        if (filtered.length === 0) {
          container.innerHTML = `<div class="section-card__empty">No chat messages match "${escapeHtml(chatSearchQuery)}".</div>`
        } else {
          container.innerHTML = filtered.map(m => `
            <div class="chat-msg">
              ${m.sender.level != null ? `<span class="chat-level">Lvl ${m.sender.level}</span>` : ''}
              <span class="chat-author" style="color: ${m.sender.color || '#53fc18'};">${escapeHtml(m.sender.username)}</span>
              <span class="chat-content">${escapeHtml(m.content)}</span>
              ${m.created_at ? `<span class="chat-time">${timeAgo(m.created_at)}</span>` : ''}
            </div>
          `).join('')
        }
      }
    })
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
