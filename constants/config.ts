// Cache durations (in seconds)
export const CACHE_DURATIONS = {
  TRENDING: 3600, // 1 hour
  POPULAR: 3600,
  NOW_PLAYING: 1800, // 30 minutes
  TOP_RATED: 3600,
  SEARCH: 300, // 5 minutes
  DETAILS: 7200, // 2 hours
  CREDITS: 7200,
  VIDEOS: 7200,
  RECOMMENDATIONS: 3600,
  SIMILAR: 3600,
  GENRES: 86400, // 24 hours
  IMAGES: 604800, // 7 days
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  GRID_PAGE_SIZE: 24,
  SEARCH_PAGE_SIZE: 20,
  TRENDING_PAGE_SIZE: 24,
} as const;

// API Rate Limiting
export const RATE_LIMIT = {
  REQUESTS_PER_SECOND: 25, // TMDB allows ~40, we're conservative
  REQUEST_BATCH_SIZE: 5,
  DEBOUNCE_SEARCH_MS: 300,
  DEBOUNCE_FilterMS: 500,
} as const;

// Image Optimization
export const IMAGE_SIZES = {
  THUMBNAIL: { width: 342, height: 513 }, // w342 - for cards
  POSTER: { width: 500, height: 750 }, // w500 - for details
  BACKDROP_MOBILE: { width: 780, height: 440 }, // w780
  BACKDROP_DESKTOP: { width: 1280, height: 720 }, // w1280
  PROFILE: { width: 185, height: 278 }, // w185 - for actors
} as const;

// UI Constants
export const UI = {
  TOAST_DURATION: 3000,
  ANIMATION_DURATION: 300,
  ANIMATION_DURATION_LONG: 600,
  MODAL_ANIMATION_DURATION: 200,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  FAVORITES: "moviehub:favorites",
  WATCH_HISTORY: "moviehub:watch-history",
  WATCHLIST: "moviehub:watchlist",
  THEME: "moviehub:theme",
  USER_PREFERENCES: "moviehub:preferences",
  SEARCH_HISTORY: "moviehub:search-history",
  COLLECTIONS: "moviehub:collections",
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_WATCH_HISTORY: true,
  ENABLE_COLLECTIONS: true,
  ENABLE_SHARING: true,
  ENABLE_ANALYTICS: true,
  ENABLE_RECOMMENDATIONS: true,
  ENABLE_OFFLINE_MODE: true,
} as const;

// VidSrc Configuration
export const VIDSRC = {
  BASE_URL: "https://vidsrc.xyz/embed",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  BLOCK_ADS: true,
  AD_BLOCKER_KEYWORDS: ["ad", "banner", "popup", "modal", "advertisement"],
} as const;

// Filter Options
export const FILTER_OPTIONS = {
  GENRES: [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
  ],
  SORT_BY: [
    { value: "popularity.desc", label: "Most Popular" },
    { value: "revenue.desc", label: "Highest Grossing" },
    { value: "primary_release_date.desc", label: "Newest" },
    { value: "vote_average.desc", label: "Highest Rated" },
    { value: "vote_count.desc", label: "Most Voted" },
  ],
  YEARS: Array.from({ length: 30 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year, label: year.toString() };
  }),
} as const;

// Social Sharing
export const SHARING = {
  SHARE_URL_BASE:
    typeof window !== "undefined" ? `${window.location.origin}` : "",
  ENABLE_EMAIL: true,
  ENABLE_TWITTER: true,
  ENABLE_FACEBOOK: true,
  ENABLE_WHATSAPP: true,
  ENABLE_COPY_LINK: true,
} as const;
