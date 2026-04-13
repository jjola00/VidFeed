/**
 * Pexels API configuration.
 * Set your API key in .env as EXPO_PUBLIC_PEXELS_API_KEY
 * Get a free key at https://www.pexels.com/api/
 */
export const PEXELS_API_KEY = process.env.EXPO_PUBLIC_PEXELS_API_KEY ?? '';

export const PEXELS_API_BASE = 'https://api.pexels.com/videos/search';
export const PEXELS_QUERY = 'people';
export const PEXELS_PER_PAGE = 80;
export const PEXELS_TOTAL_PAGES = 3;

/** Number of videos to preload ahead/behind the current index */
export const PRELOAD_WINDOW = 1;
