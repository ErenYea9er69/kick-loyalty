# KickView 🟢

> **Kick.com Platform & Profile Intelligence Explorer**

KickView is a modern web application built to search, inspect, and analyze any Kick.com username or streamer channel. It pulls all available data exposed by Kick's platform — including official subscriber metrics, livestream status, subscriber badges, username change history, chatroom configurations, social links, and account moderation status — with full support for **OAuth 2.1 PKCE User Authentication** and **Kick Client Credentials API**.

---

## ✨ Features

- 💎 **Subscriber & Gifting Breakdown**: Official active subscriber counts, active gifted subs, and canceled subscriptions.
- 📡 **Real-Time Livestream Data**: Live stream detection, current viewer counts, title, category tags, language, mature content flag, duration, and thumbnail preview.
- 🏅 **Subscriber Badges Gallery**: Visual badge progression across all tiers (1 mo, 2 mo, 3 mo, 6 mo, 12 mo, 24 mo+).
- 📝 **Username Change History**: Chronological timeline of previous username changes.
- 💬 **Chatroom Configuration**: Slow mode intervals, followers-only minimum duration, subscribers-only mode, and emotes-only mode.
- 🛡️ **Account & Moderation Status**: Ban status (`CLEAN` / `BANNED`), chat muted status, verified creator badge.
- 🌐 **Social Links & Custom Links**: Direct links to Twitter/X, Instagram, YouTube, Discord, TikTok, and streamer's custom bio links.
- 🔍 **Raw JSON Inspector**: In-app modal viewer allowing power users to inspect and copy the raw Kick API payload with one click.
- ⚡ **Instant Sample Fallback**: Pre-configured sample profiles for streamers like **xQc**, **Trainwreckstv**, **AdinRoss**, and **Amouranth** for instant testing without needing an immediate Kick API key.
- 🔑 **Login with Kick (OAuth 2.1 PKCE)**: Cryptographic SHA-256 PKCE user authorization flow for authenticated access.

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla TypeScript + Vite
- **Styling**: Vanilla CSS (Kick Dark Theme, JetBrains Mono, Inter, micro-animations, glassmorphism)
- **Backend**: Node.js + Express (OAuth 2.1 PKCE proxy, token lifecycle management, data merger)
- **APIs**: Official Kick Public API (`api.kick.com`) + v2 Channels API fallback

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/ErenYea9er69/kick-loyalty.git
cd kick-loyalty
npm install
```

### 2. Start Backend Server

```bash
node server.mjs
```
*Backend runs at `http://localhost:3001`.*

### 3. Start Frontend Server

In another terminal:

```bash
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 🔑 Setting up Kick Developer Credentials (Optional)

To enable live Kick API queries:

1. Head over to the [Kick Developer Portal](https://kick.com/settings/developer).
2. Create a new application.
3. Set the **Redirect URI** to `http://localhost:5173/callback`.
4. Copy your **Client ID** and **Client Secret**.
5. In KickView, click **"🔑 Configure Kick API"** in the top bar and paste your credentials. They will be saved to `config.json` and persist across restarts.

---

## 📄 License

MIT
