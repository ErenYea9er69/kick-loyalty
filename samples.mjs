// Pre-populated sample data representing the exact Kick platform schema
// Allows users to test the application immediately even before obtaining Kick Developer API credentials

const DEFAULT_REWARDS = [
  { id: 1, title: 'Hydrate Streamer', cost: 500, description: 'Prompt the streamer to drink water and stay healthy live.', icon: '💧' },
  { id: 2, title: 'Highlight Message', cost: 1200, description: 'Highlight your message in chat with glowing gold border.', icon: '✨' },
  { id: 3, title: 'Timeout a Chatter', cost: 10000, description: 'Timeout any non-moderator chatter for 60 seconds.', icon: '⏳' },
  { id: 4, title: 'VIP Diamond Badge (24h)', cost: 50000, description: 'Wear the diamond VIP badge in chat for 24 hours.', icon: '💎' },
  { id: 5, title: 'TTS Voice Message', cost: 25000, description: 'Text-to-speech message played live on broadcast.', icon: '🔊' },
]

const CLEAN_BAN_HISTORY = {
  is_banned: false,
  status: 'CLEAN',
  muted: false,
  active_bans_count: 0,
  strikes_count: 0,
  standing: 'Good Standing (100% Clean)',
}

export const SAMPLE_CHANNELS = {
  xqc: {
    id: 668,
    user_id: 670,
    slug: "xqc",
    is_banned: false,
    playback_url: "https://stream.kick.com/xqc/index.m3u8",
    name_updated_at: "2023-06-16T12:00:00Z",
    vod_enabled: true,
    subscription_enabled: true,
    followers_count: 842500,
    active_subscribers_count: 24580,
    active_gifted_subscribers_count: 14200,
    canceled_subscribers_count: 980,
    channel_description: "THE LEADER OF THE JUICERS 👑 Daily streams, variety gaming and reacting. Welcome to the jungle.",
    stream_title: "🔴 JUICED UP VARIETY | TIER LISTS | GAMING 👑",
    verified: true,
    can_host: true,
    muted: false,
    banner_image: {
      url: "https://files.kick.com/images/channel/668/banner_image/conversion/banner-fullsize.webp"
    },
    offline_banner_image: {
      src: "https://files.kick.com/images/channel/668/banner_image/conversion/banner-fullsize.webp"
    },
    user: {
      id: 670,
      username: "xQc",
      agreed_to_terms: true,
      email_verified_at: "2023-06-16T12:00:00Z",
      bio: "THE LEADER OF THE JUICERS 👑 Daily variety streams, reacts, and high-energy gaming. Welcome to the jungle.",
      country: "Canada",
      state: "Quebec",
      city: "Laval",
      instagram: "xqcow1",
      twitter: "xQc",
      youtube: "xQcOW",
      discord: "https://discord.gg/xqcow",
      tiktok: "xqcow",
      facebook: null,
      profile_pic: "https://files.kick.com/images/user/670/profile_image/conversion/54aa7a27-0cfd-4d7c-87d3-8f6fc6e28ec0-fullsize.webp"
    },
    clips: [
      { id: 'clip_1', title: 'INSANE 1v5 CLUTCH IN CS2!! 🔥', duration: 42, views: 185200, creator: 'JuicerClipz', category: 'Counter-Strike 2', thumbnail_url: '/assets/clip_gaming.jpg', clip_url: 'https://kick.com/xqc?clip=clip_1', created_at: '2024-03-15T18:30:00Z' },
      { id: 'clip_2', title: 'xQc reacts to the craziest TikTok trend 😂', duration: 59, views: 142000, creator: 'DailyDoseOfX', category: 'Just Chatting', thumbnail_url: '/assets/clip_chatting.jpg', clip_url: 'https://kick.com/xqc?clip=clip_2', created_at: '2024-03-14T20:15:00Z' },
      { id: 'clip_3', title: 'When the speedrun goes terribly wrong 💀', duration: 28, views: 98400, creator: 'SpeedyJuice', category: 'Gaming', thumbnail_url: '/assets/clip_gaming.jpg', clip_url: 'https://kick.com/xqc?clip=clip_3', created_at: '2024-03-12T14:40:00Z' },
      { id: 'clip_4', title: 'CHAT WE DID IT!! WORLD RECORD RUN! 🏆', duration: 60, views: 245000, creator: 'PogChampCentral', category: 'Speedrunning', thumbnail_url: '/assets/clip_celebration.jpg', clip_url: 'https://kick.com/xqc?clip=clip_4', created_at: '2024-03-10T22:10:00Z' },
    ],
    leaderboards: {
      gifts: [
        { user_id: 1001, username: 'OilPrince_99', quantity: 2500 },
        { user_id: 1002, username: 'JuicerWarlord', quantity: 1850 },
        { user_id: 1003, username: 'GigaChad_Sub', quantity: 1200 },
        { user_id: 1004, username: 'ViperSniper', quantity: 850 },
        { user_id: 1005, username: 'NightOwlTV', quantity: 620 },
      ],
      gifts_month: [
        { user_id: 1001, username: 'OilPrince_99', quantity: 450 },
        { user_id: 1003, username: 'GigaChad_Sub', quantity: 320 },
        { user_id: 1006, username: 'SubDropperX', quantity: 210 },
      ],
      gifts_week: [
        { user_id: 1003, username: 'GigaChad_Sub', quantity: 100 },
        { user_id: 1001, username: 'OilPrince_99', quantity: 75 },
      ],
    },
    recent_messages: [
      { id: 'm1', content: 'LMAOOOO CHAT LOOK AT HIS FACE 💀', created_at: new Date(Date.now() - 30000).toISOString(), sender: { id: 201, username: 'JuicerFan_01', color: '#53fc18', level: 64, badges: [] } },
      { id: 'm2', content: 'W STREAM TODAY XQC 🔥🔥', created_at: new Date(Date.now() - 65000).toISOString(), sender: { id: 202, username: 'HyperDrive', color: '#4d9fff', level: 82, badges: [] } },
      { id: 'm3', content: 'can we get CS2 games with chat later???', created_at: new Date(Date.now() - 110000).toISOString(), sender: { id: 203, username: 'PixelMaster', color: '#ffb300', level: 41, badges: [] } },
      { id: 'm4', content: 'squadL in the chat boys!', created_at: new Date(Date.now() - 150000).toISOString(), sender: { id: 204, username: 'CyberGhost', color: '#a855f7', level: 95, badges: [] } },
      { id: 'm5', content: 'that clutch was actually unreal bro no way', created_at: new Date(Date.now() - 200000).toISOString(), sender: { id: 205, username: 'ApexSniper', color: '#00e5ff', level: 27, badges: [] } },
    ],
    rewards: DEFAULT_REWARDS,
    ban_history: CLEAN_BAN_HISTORY,
    subscriber_badges: [
      { id: 1, channel_id: 668, months: 1, badge_image: { src: "https://files.kick.com/subscriber_badges/668/1.webp", srcset: "" } },
      { id: 2, channel_id: 668, months: 2, badge_image: { src: "https://files.kick.com/subscriber_badges/668/2.webp", srcset: "" } },
      { id: 3, channel_id: 668, months: 3, badge_image: { src: "https://files.kick.com/subscriber_badges/668/3.webp", srcset: "" } },
      { id: 4, channel_id: 668, months: 6, badge_image: { src: "https://files.kick.com/subscriber_badges/668/6.webp", srcset: "" } },
      { id: 5, channel_id: 668, months: 9, badge_image: { src: "https://files.kick.com/subscriber_badges/668/9.webp", srcset: "" } },
      { id: 6, channel_id: 668, months: 12, badge_image: { src: "https://files.kick.com/subscriber_badges/668/12.webp", srcset: "" } },
      { id: 7, channel_id: 668, months: 24, badge_image: { src: "https://files.kick.com/subscriber_badges/668/24.webp", srcset: "" } }
    ],
    previous_usernames: [
      { id: 101, user_id: 670, username: "xqcow", created_at: "2023-06-16T12:00:00Z" },
      { id: 102, user_id: 670, username: "xQcOW", created_at: "2023-09-01T15:30:00Z" }
    ],
    recent_categories: [
      { id: 1, category_id: 1, name: "Just Chatting", slug: "just-chatting", tags: ["IRL", "Talk"], viewers: 42000, category: { id: 1, name: "Just Chatting", slug: "just-chatting", icon: "https://files.kick.com/categories/1/icon.png" } },
      { id: 2, category_id: 2, name: "Grand Theft Auto V", slug: "grand-theft-auto-v", tags: ["Roleplay", "Action"], viewers: 35000, category: { id: 2, name: "Grand Theft Auto V", slug: "grand-theft-auto-v", icon: "https://files.kick.com/categories/2/icon.png" } },
      { id: 3, category_id: 3, name: "Counter-Strike 2", slug: "counter-strike-2", tags: ["FPS", "Shooter"], viewers: 28000, category: { id: 3, name: "Counter-Strike 2", slug: "counter-strike-2", icon: "https://files.kick.com/categories/3/icon.png" } },
      { id: 4, category_id: 4, name: "Overwatch 2", slug: "overwatch-2", tags: ["Competitive", "FPS"], viewers: 21000, category: { id: 4, name: "Overwatch 2", slug: "overwatch-2", icon: "https://files.kick.com/categories/4/icon.png" } }
    ],
    ascending_links: [
      { id: 1, channel_id: 668, title: "Official Merch Store", link: "https://xqc.gg", order: 1, created_at: "2023-06-20T00:00:00Z", updated_at: "2023-06-20T00:00:00Z", description: null },
      { id: 2, channel_id: 668, title: "Subreddit r/xqcow", link: "https://reddit.com/r/xqcow", order: 2, created_at: "2023-06-20T00:00:00Z", updated_at: "2023-06-20T00:00:00Z", description: null },
      { id: 3, channel_id: 668, title: "Daily Clips Channel", link: "https://youtube.com/@xQcClips", order: 3, created_at: "2023-06-20T00:00:00Z", updated_at: "2023-06-20T00:00:00Z", description: null }
    ],
    chatroom: {
      id: 668,
      chatable_type: "App\\Models\\Channel",
      channel_id: 668,
      created_at: "2023-06-16T12:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      chat_mode_old: "default",
      chat_mode: "default",
      slow_mode: true,
      chatable_id: 668,
      followers_mode: true,
      subscribers_mode: false,
      emotes_mode: false,
      message_interval: 3,
      following_min_duration: 15
    },
    livestream: {
      id: 987654,
      slug: "xqc",
      channel_id: 668,
      created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
      session_title: "🔴 JUICED UP VARIETY | TIER LISTS | GAMING 👑",
      is_live: true,
      risk_level_id: null,
      source: null,
      twitch_channel: null,
      duration: 10800,
      language: "English",
      is_mature: false,
      viewer_count: 51240,
      thumbnail: { src: "https://files.kick.com/images/subcategories/1/banner/conversion/default-banner.webp", srcset: "" },
      tags: ["English", "Variety", "Juice", "React"],
      categories: [{ id: 1, category_id: 1, name: "Just Chatting", slug: "just-chatting", tags: ["IRL"] }]
    },
    _sources: {
      official: false,
      v2: false,
      sample: true
    }
  },

  trainwreckstv: {
    id: 12,
    user_id: 15,
    slug: "trainwreckstv",
    is_banned: false,
    playback_url: "https://stream.kick.com/trainwreckstv/index.m3u8",
    name_updated_at: "2022-12-01T00:00:00Z",
    vod_enabled: true,
    subscription_enabled: true,
    followers_count: 365200,
    active_subscribers_count: 12400,
    active_gifted_subscribers_count: 9850,
    canceled_subscribers_count: 340,
    channel_description: "Non-stop chill streams, gaming, podcasts, and community giveaways.",
    stream_title: "GAMING & CHILL WITH THE SQUAD",
    verified: true,
    can_host: true,
    muted: false,
    banner_image: {
      url: "https://files.kick.com/images/channel/12/banner_image/conversion/banner-fullsize.webp"
    },
    offline_banner_image: null,
    user: {
      id: 15,
      username: "Trainwreckstv",
      agreed_to_terms: true,
      email_verified_at: "2022-12-01T00:00:00Z",
      bio: "Co-founder & content creator on Kick. Variety gamer, community host. squadL in the chat.",
      country: "United States",
      state: "Nevada",
      city: "Las Vegas",
      instagram: "trainwreckstv",
      twitter: "Trainwreckstv",
      youtube: "Trainwreckstv",
      discord: "https://discord.gg/trainwreckstv",
      tiktok: "trainwreckstv",
      facebook: null,
      profile_pic: "https://files.kick.com/images/user/15/profile_image/conversion/train-fullsize.webp"
    },
    clips: [
      { id: 'clip_t1', title: 'TRAIN ROLLS A MASSIVE 1000X MULTIPLIER! 🚀', duration: 48, views: 320000, creator: 'ScuffedClips', category: 'Slots & Casino', thumbnail_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80', clip_url: 'https://kick.com/trainwreckstv?clip=clip_t1', created_at: '2024-03-01T12:00:00Z' },
      { id: 'clip_t2', title: 'Scuffed Podcast: Legendary Guests Debate', duration: 55, views: 88000, creator: 'PodcastMoments', category: 'Just Chatting', thumbnail_url: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&auto=format&fit=crop&q=80', clip_url: 'https://kick.com/trainwreckstv?clip=clip_t2', created_at: '2024-02-28T16:00:00Z' }
    ],
    leaderboards: {
      gifts: [
        { user_id: 2001, username: 'squadL_Giver', quantity: 3400 },
        { user_id: 2002, username: 'ApeGang_Chad', quantity: 2100 },
        { user_id: 2003, username: 'KickWhale_01', quantity: 1600 }
      ],
      gifts_month: [
        { user_id: 2001, username: 'squadL_Giver', quantity: 500 }
      ],
      gifts_week: [
        { user_id: 2001, username: 'squadL_Giver', quantity: 150 }
      ]
    },
    recent_messages: [
      { id: 'tm1', content: 'squadL in the chat boys!', created_at: new Date(Date.now() - 40000).toISOString(), sender: { id: 301, username: 'ScuffedFan', color: '#53fc18', level: 75, badges: [] } },
      { id: 'tm2', content: 'W community giveaway tonight??', created_at: new Date(Date.now() - 90000).toISOString(), sender: { id: 302, username: 'CryptoChad', color: '#ffd700', level: 52, badges: [] } }
    ],
    rewards: DEFAULT_REWARDS,
    ban_history: CLEAN_BAN_HISTORY,
    subscriber_badges: [
      { id: 11, channel_id: 12, months: 1, badge_image: { src: "https://files.kick.com/subscriber_badges/12/1.webp", srcset: "" } },
      { id: 12, channel_id: 12, months: 2, badge_image: { src: "https://files.kick.com/subscriber_badges/12/2.webp", srcset: "" } },
      { id: 13, channel_id: 12, months: 3, badge_image: { src: "https://files.kick.com/subscriber_badges/12/3.webp", srcset: "" } },
      { id: 14, channel_id: 12, months: 6, badge_image: { src: "https://files.kick.com/subscriber_badges/12/6.webp", srcset: "" } },
      { id: 15, channel_id: 12, months: 12, badge_image: { src: "https://files.kick.com/subscriber_badges/12/12.webp", srcset: "" } }
    ],
    previous_usernames: [
      { id: 201, user_id: 15, username: "TylerNiknam", created_at: "2022-12-01T00:00:00Z" }
    ],
    recent_categories: [
      { id: 10, category_id: 1, name: "Just Chatting", slug: "just-chatting", tags: ["IRL", "Podcast"], viewers: 18000, category: { id: 1, name: "Just Chatting", slug: "just-chatting", icon: "" } },
      { id: 11, category_id: 15, name: "Counter-Strike 2", slug: "counter-strike-2", tags: ["FPS"], viewers: 14000, category: { id: 15, name: "Counter-Strike 2", slug: "counter-strike-2", icon: "" } },
      { id: 12, category_id: 25, name: "Rust", slug: "rust", tags: ["Survival"], viewers: 12000, category: { id: 25, name: "Rust", slug: "rust", icon: "" } }
    ],
    ascending_links: [
      { id: 10, channel_id: 12, title: "Scuffed Podcast", link: "https://youtube.com/@scuffedpodcast", order: 1, created_at: "2023-01-01T00:00:00Z", updated_at: "2023-01-01T00:00:00Z", description: null }
    ],
    chatroom: {
      id: 12,
      chatable_type: "App\\Models\\Channel",
      channel_id: 12,
      created_at: "2022-12-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      chat_mode_old: "default",
      chat_mode: "default",
      slow_mode: false,
      chatable_id: 12,
      followers_mode: false,
      subscribers_mode: false,
      emotes_mode: false,
      message_interval: 0,
      following_min_duration: 0
    },
    livestream: null,
    _sources: {
      official: false,
      v2: false,
      sample: true
    }
  },

  adinross: {
    id: 105,
    user_id: 110,
    slug: "adinross",
    is_banned: false,
    playback_url: "https://stream.kick.com/adinross/index.m3u8",
    name_updated_at: "2023-02-15T00:00:00Z",
    vod_enabled: true,
    subscription_enabled: true,
    followers_count: 1450000,
    active_subscribers_count: 38200,
    active_gifted_subscribers_count: 22100,
    canceled_subscribers_count: 1400,
    channel_description: "Live daily with special guests, variety, music, and community moments.",
    stream_title: "🔥 MASSIVE STREAM WITH CELEBRITY GUEST + GIVEAWAYS 🔥",
    verified: true,
    can_host: true,
    muted: false,
    banner_image: {
      url: "https://files.kick.com/images/channel/105/banner_image/conversion/banner-fullsize.webp"
    },
    offline_banner_image: null,
    user: {
      id: 110,
      username: "AdinRoss",
      agreed_to_terms: true,
      email_verified_at: "2023-02-15T00:00:00Z",
      bio: "Adin Ross on Kick. Special guest streams, gaming, IRL, and high energy content.",
      country: "United States",
      state: "Florida",
      city: "Miami",
      instagram: "adinross",
      twitter: "adinross",
      youtube: "adinlive",
      discord: "https://discord.gg/adinross",
      tiktok: "adinross",
      facebook: null,
      profile_pic: "https://files.kick.com/images/user/110/profile_image/conversion/adin-fullsize.webp"
    },
    clips: [
      { id: 'clip_a1', title: 'Adin Ross introduces surprise special guest live!! 🎤', duration: 45, views: 512000, creator: 'AdinUpdates', category: 'Just Chatting', thumbnail_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80', clip_url: 'https://kick.com/adinross?clip=clip_a1', created_at: '2024-03-08T21:00:00Z' },
      { id: 'clip_a2', title: 'Adin gives away $10,000 to lucky viewer! 💰', duration: 60, views: 420000, creator: 'ViralMoments', category: 'Just Chatting', thumbnail_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=80', clip_url: 'https://kick.com/adinross?clip=clip_a2', created_at: '2024-03-05T19:30:00Z' }
    ],
    leaderboards: {
      gifts: [
        { user_id: 3001, username: 'LoyalRossGiver', quantity: 5000 },
        { user_id: 3002, username: 'MiamiVibes_23', quantity: 3200 },
        { user_id: 3003, username: 'AdinSubVIP', quantity: 2400 }
      ],
      gifts_month: [
        { user_id: 3001, username: 'LoyalRossGiver', quantity: 800 }
      ],
      gifts_week: [
        { user_id: 3001, username: 'LoyalRossGiver', quantity: 250 }
      ]
    },
    recent_messages: [
      { id: 'am1', content: 'ADIN IS THE GOAT 🐐🐐', created_at: new Date(Date.now() - 25000).toISOString(), sender: { id: 401, username: 'AdinLoyal', color: '#53fc18', level: 90, badges: [] } },
      { id: 'am2', content: 'W GUEST TONIGHT 🔥', created_at: new Date(Date.now() - 50000).toISOString(), sender: { id: 402, username: 'FloridaBoy', color: '#ff4444', level: 63, badges: [] } }
    ],
    rewards: DEFAULT_REWARDS,
    ban_history: CLEAN_BAN_HISTORY,
    subscriber_badges: [
      { id: 21, channel_id: 105, months: 1, badge_image: { src: "", srcset: "" } },
      { id: 22, channel_id: 105, months: 3, badge_image: { src: "", srcset: "" } },
      { id: 23, channel_id: 105, months: 6, badge_image: { src: "", srcset: "" } },
      { id: 24, channel_id: 105, months: 12, badge_image: { src: "", srcset: "" } }
    ],
    previous_usernames: [
      { id: 301, user_id: 110, username: "adin", created_at: "2023-02-15T00:00:00Z" }
    ],
    recent_categories: [
      { id: 20, category_id: 1, name: "Just Chatting", slug: "just-chatting", tags: ["IRL", "Guest"], viewers: 65000, category: { id: 1, name: "Just Chatting", slug: "just-chatting", icon: "" } },
      { id: 21, category_id: 40, name: "NBA 2K25", slug: "nba-2k25", tags: ["Sports"], viewers: 42000, category: { id: 40, name: "NBA 2K25", slug: "nba-2k25", icon: "" } }
    ],
    ascending_links: [
      { id: 21, channel_id: 105, title: "YouTube Adin Live", link: "https://youtube.com/@adinlive", order: 1, created_at: "2023-02-20T00:00:00Z", updated_at: "2023-02-20T00:00:00Z", description: null }
    ],
    chatroom: {
      id: 105,
      chatable_type: "App\\Models\\Channel",
      channel_id: 105,
      created_at: "2023-02-15T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      chat_mode_old: "default",
      chat_mode: "default",
      slow_mode: true,
      chatable_id: 105,
      followers_mode: true,
      subscribers_mode: false,
      emotes_mode: false,
      message_interval: 5,
      following_min_duration: 30
    },
    livestream: {
      id: 991234,
      slug: "adinross",
      channel_id: 105,
      created_at: new Date(Date.now() - 1.5 * 3600000).toISOString(),
      session_title: "🔥 MASSIVE STREAM WITH CELEBRITY GUEST + GIVEAWAYS 🔥",
      is_live: true,
      risk_level_id: null,
      source: null,
      twitch_channel: null,
      duration: 5400,
      language: "English",
      is_mature: true,
      viewer_count: 73800,
      thumbnail: { src: "", srcset: "" },
      tags: ["English", "IRL", "Miami", "Music"],
      categories: [{ id: 1, category_id: 1, name: "Just Chatting", slug: "just-chatting", tags: ["IRL"] }]
    },
    _sources: {
      official: false,
      v2: false,
      sample: true
    }
  },

  splash_699: {
    id: 3542056,
    user_id: 3542056,
    slug: "splash_699",
    account_type: 'viewer',
    is_banned: false,
    playback_url: null,
    name_updated_at: null,
    vod_enabled: false,
    subscription_enabled: false,
    followers_count: 0,
    created_at: "2023-04-19T21:26:01Z",
    channel_description: null,
    stream_title: null,
    verified: false,
    can_host: false,
    muted: false,
    banner_image: null,
    offline_banner_image: null,
    user: {
      id: 3542056,
      username: "splash_699",
      agreed_to_terms: true,
      email_verified_at: "2023-04-19T21:26:01Z",
      bio: "Dedicated Kick community viewer and active chatter.",
      country: null,
      state: null,
      city: null,
      instagram: null,
      twitter: null,
      youtube: null,
      discord: null,
      tiktok: null,
      facebook: null,
      profile_pic: "https://files.kick.com/images/user/3542056/profile_image/conversion/cfba6cb4-05a8-444f-b64d-9653a94821c9-fullsize.webp"
    },
    clips: [],
    leaderboards: {
      gifts: [],
      gifts_month: [],
      gifts_week: []
    },
    recent_messages: [
      { id: 'sm1', content: 'Hey guys! Watching the stream 🔥', created_at: new Date(Date.now() - 3600000).toISOString(), sender: { id: 3542056, username: 'splash_699', color: '#53fc18', level: 12, badges: [] } }
    ],
    rewards: DEFAULT_REWARDS,
    ban_history: CLEAN_BAN_HISTORY,
    subscriber_badges: [],
    previous_usernames: [],
    recent_categories: [],
    ascending_links: [],
    chatroom: null,
    livestream: null,
    _sources: {
      official: false,
      v2: false,
      v1_user: true,
      sample: true
    }
  }
}
