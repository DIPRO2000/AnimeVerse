/**
 * Anime Service Layer
 * Handles all API calls to Jikan API (MyAnimeList unofficial API)
 * API Documentation: https://docs.api.jikan.moe/
 */

const API_BASE_URL = 'https://api.jikan.moe/v4';

// Simple in-memory cache to avoid unnecessary re-fetching
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches data from the API with caching
 * @param {string} endpoint - API endpoint
 * @param {object} params - Query parameters
 * @returns {Promise<object>} - API response data
 */
async function fetchWithCache(endpoint, params = {}) {
  // Build cache key from endpoint and params
  const cacheKey = `${endpoint}?${new URLSearchParams(params).toString()}`;
  
  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  // Build URL with query params
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value);
    }
  });

  // Fetch from API
  const response = await fetch(url.toString());
  console.log(`Fetching: ${response}`);
  
  if (!response.ok) {
    // Handle rate limiting (Jikan has rate limits)
    if (response.status === 429) {
      throw new Error('Rate limited. Please wait a moment and try again.');
    }
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  // Store in cache
  cache.set(cacheKey, { data, timestamp: Date.now() });
  
  return data;
}

/**
 * Get top/popular anime list
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} filter - Filter type: 'airing', 'upcoming', 'bypopularity', 'favorite'
 * @returns {Promise<{data: Array, pagination: object}>}
 */
export async function getTopAnime(page = 1, limit = 24, filter = 'bypopularity') {
  return fetchWithCache('/top/anime', { page, limit, filter });
}

/**
 * Get currently airing anime (this season)
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<{data: Array, pagination: object}>}
 */
export async function getSeasonalAnime(page = 1, limit = 24) {
  return fetchWithCache('/seasons/now', { page, limit });
}

/**
 * Get anime from a specific season
 * @param {number} year - Year
 * @param {string} season - 'winter', 'spring', 'summer', 'fall'
 * @param {number} page - Page number
 * @returns {Promise<{data: Array, pagination: object}>}
 */
export async function getAnimeBySeason(year, season, page = 1) {
  return fetchWithCache(`/seasons/${year}/${season}`, { page });
}

/**
 * Search anime with filters
 * @param {object} params - Search parameters
 * @returns {Promise<{data: Array, pagination: object}>}
 */
export async function searchAnime({
  query = '',
  page = 1,
  limit = 24,
  genres = '',
  minScore = '',
  orderBy = 'score',
  sort = 'desc',
  status = '',
  type = ''
} = {}) {
  const params = {
    page,
    limit,
    order_by: orderBy,
    sort,
    sfw: true // Safe for work filter
  };

  if (query) params.q = query;
  if (genres) params.genres = genres;
  if (minScore) params.min_score = minScore;
  if (status) params.status = status;
  if (type) params.type = type;

  return fetchWithCache('/anime', params);
}

/**
 * Get single anime details by ID
 * @param {number} id - Anime MAL ID
 * @returns {Promise<{data: object}>}
 */
export async function getAnimeById(id) {
  return fetchWithCache(`/anime/${id}/full`);
}

/**
 * Get anime recommendations for a specific anime
 * @param {number} id - Anime MAL ID
 * @returns {Promise<{data: Array}>}
 */
export async function getAnimeRecommendations(id) {
  return fetchWithCache(`/anime/${id}/recommendations`);
}

/**
 * Get anime characters
 * @param {number} id - Anime MAL ID
 * @returns {Promise<{data: Array}>}
 */
export async function getAnimeCharacters(id) {
  return fetchWithCache(`/anime/${id}/characters`);
}

/**
 * Get upcoming anime
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<{data: Array, pagination: object}>}
 */
export async function getUpcomingAnime(page = 1, limit = 24) {
  return fetchWithCache('/seasons/upcoming', { page, limit });
}

/**
 * Clear the cache (useful for forcing fresh data)
 */
export function clearCache() {
  cache.clear();
}

export default {
  getTopAnime,
  getSeasonalAnime,
  getAnimeBySeason,
  searchAnime,
  getAnimeById,
  getAnimeRecommendations,
  getAnimeCharacters,
  getUpcomingAnime,
  clearCache
};