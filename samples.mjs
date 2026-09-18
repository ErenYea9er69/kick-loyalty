// Pre-populated sample data representing the exact Kick platform schema
// Allows users to test the application immediately even before obtaining Kick Developer API credentials

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

  amouranth: {
    id: 520,
    user_id: 525,
    slug: "amouranth",
    is_banned: false,
    playback_url: "https://stream.kick.com/amouranth/index.m3u8",
    name_updated_at: "2023-06-18T00:00:00Z",
    vod_enabled: true,
    subscription_enabled: true,
    followers_count: 220000,
    active_subscribers_count: 8900,
    active_gifted_subscribers_count: 5300,
    canceled_subscribers_count: 210,
    channel_description: "Content creator, gamer, entrepreneur, animal rescuer.",
    stream_title: "LIVESTREAMING WITH ANIMALS & CHATTING! 🐴🐱",
    verified: true,
    can_host: true,
    muted: false,
    banner_image: {
      url: "https://files.kick.com/images/channel/520/banner_image/conversion/banner-fullsize.webp"
    },
    offline_banner_image: null,
    user: {
      id: 525,
      username: "Amouranth",
      agreed_to_terms: true,
      email_verified_at: "2023-06-18T00:00:00Z",
      bio: "Kaitlyn Siragusa / Amouranth. Cosplayer, streamer, horse lover and entrepreneur.",
      country: "United States",
      state: "Texas",
      city: "Houston",
      instagram: "amouranth",
      twitter: "Amouranth",
      youtube: "Amouranth",
      discord: "https://discord.gg/amouranth",
      tiktok: "amouranth",
      facebook: null,
      profile_pic: "https://files.kick.com/images/user/525/profile_image/conversion/am-fullsize.webp"
    },
    subscriber_badges: [
      { id: 31, channel_id: 520, months: 1, badge_image: { src: "", srcset: "" } },
      { id: 32, channel_id: 520, months: 3, badge_image: { src: "", srcset: "" } },
      { id: 33, channel_id: 520, months: 6, badge_image: { src: "", srcset: "" } }
    ],
    previous_usernames: [],
    recent_categories: [
      { id: 30, category_id: 1, name: "Just Chatting", slug: "just-chatting", tags: ["IRL"], viewers: 9500, category: { id: 1, name: "Just Chatting", slug: "just-chatting", icon: "" } },
      { id: 31, category_id: 50, name: "ASMR", slug: "asmr", tags: ["Audio", "Relaxing"], viewers: 8200, category: { id: 50, name: "ASMR", slug: "asmr", icon: "" } },
      { id: 32, category_id: 60, name: "Pools, Bikinis & Beaches", slug: "pools-bikinis-beaches", tags: ["IRL"], viewers: 11000, category: { id: 60, name: "Pools, Bikinis & Beaches", slug: "pools-bikinis-beaches", icon: "" } }
    ],
    ascending_links: [],
    chatroom: {
      id: 520,
      chatable_type: "App\\Models\\Channel",
      channel_id: 520,
      created_at: "2023-06-18T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      chat_mode_old: "default",
      chat_mode: "default",
      slow_mode: false,
      chatable_id: 520,
      followers_mode: true,
      subscribers_mode: false,
      emotes_mode: false,
      message_interval: 0,
      following_min_duration: 10
    },
    livestream: null,
    _sources: {
      official: false,
      v2: false,
      sample: true
    }
  }
}
