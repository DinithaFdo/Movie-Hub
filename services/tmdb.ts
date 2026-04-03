/**
 * Optimized TMDB API Service with:
 * - Request batching
 * - Intelligent caching
 * - Retry logic
 * - Rate limiting
 * - Error handling
 */

import { CACHE_DURATIONS, RATE_LIMIT } from "@/constants/config";
import { retryWithBackoff, createTimeoutSignal } from "@/utils/helpers";
import type { MediaDetail, MediaType, MovieSummary } from "@/types/movie";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const TMDB_API_KEY =
  process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_READ_ACCESS_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;

// In-memory cache with TTL
class CacheManager {
  private cache = new Map<string, { data: any; expiresAt: number }>();

  set(key: string, data: any, ttlSeconds: number): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry ? Date.now() <= entry.expiresAt : false;
  }
}

// Request queue for rate limiting
class RequestQueue {
  private queue: (() => Promise<any>)[] = [];
  private isProcessing = false;
  private lastRequestTime = 0;
  private minDelay = 1000 / RATE_LIMIT.REQUESTS_PER_SECOND;

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.isProcessing) {
        this.process();
      }
    });
  }

  private async process(): Promise<void> {
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const fn = this.queue.shift();
      if (!fn) break;

      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      const delayNeeded = Math.max(0, this.minDelay - timeSinceLastRequest);

      if (delayNeeded > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayNeeded));
      }

      await fn();
      this.lastRequestTime = Date.now();
    }

    this.isProcessing = false;
  }
}

const cacheManager = new CacheManager();
const requestQueue = new RequestQueue();

// Core API fetcher with error handling
async function apiCall<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
  if (!TMDB_API_KEY && !TMDB_READ_ACCESS_TOKEN) {
    throw new Error(
      "TMDB credentials are missing. Set TMDB_API_KEY or TMDB_READ_ACCESS_TOKEN in .env",
    );
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);

  // v3 API key auth
  if (TMDB_API_KEY) {
    url.searchParams.set("api_key", TMDB_API_KEY);
  }

  const headers: HeadersInit = {
    Accept: "application/json",
    "Accept-Encoding": "gzip, deflate",
  };

  // v4 read access token auth fallback/alternative
  if (TMDB_READ_ACCESS_TOKEN) {
    headers.Authorization = `Bearer ${TMDB_READ_ACCESS_TOKEN}`;
  }

  try {
    const response = await fetch(url.toString(), {
      signal: signal || createTimeoutSignal(10000),
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `TMDB API Error: ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`API Call Failed (${endpoint}):`, error);
    throw error;
  }
}

// Generic cached API call
async function cachedApiCall<T>(
  cacheKey: string,
  endpoint: string,
  cacheDurationSeconds: number,
): Promise<T> {
  // Check cache first
  const cachedData = cacheManager.get<T>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // Use request queue for rate limiting
  const data = await requestQueue.add(() =>
    retryWithBackoff(
      () => apiCall<T>(endpoint),
      RATE_LIMIT.REQUEST_BATCH_SIZE,
      100,
    ),
  );

  // Store in cache
  cacheManager.set(cacheKey, data, cacheDurationSeconds);
  return data;
}

// Transform TMDB result to MovieSummary
function transformToMovieSummary(
  result: any,
  mediaType?: MediaType,
): MovieSummary {
  return {
    id: result.id,
    title: result.title || result.name || "Unknown",
    posterPath: result.poster_path,
    backdropPath: result.backdrop_path,
    overview: result.overview || "",
    voteAverage: result.vote_average || 0,
    releaseDate: result.release_date || result.first_air_date || null,
    mediaType: mediaType || result.media_type || "movie",
    genreIds: result.genre_ids || [],
  };
}

// Transform TMDB detail to MediaDetail
function transformToMediaDetail(
  result: any,
  mediaType: MediaType,
): MediaDetail {
  return {
    ...transformToMovieSummary(result, mediaType),
    tagline: result.tagline || null,
    status: result.status || "Unknown",
    runtime: result.runtime || result.episode_run_time?.[0] || null,
    genres: result.genres || [],
    cast: (result.credits?.cast || []).slice(0, 10).map((cast: any) => ({
      id: cast.id,
      name: cast.name,
      character: cast.character,
      profilePath: cast.profile_path,
    })),
    crew: (result.credits?.crew || [])
      .filter((crew: any) =>
        ["Director", "Producer", "Screenplay"].includes(crew.job),
      )
      .slice(0, 5)
      .map((crew: any) => ({
        id: crew.id,
        name: crew.name,
        job: crew.job,
        department: crew.department,
        profilePath: crew.profile_path,
      })),
    similar: (result.similar?.results || [])
      .slice(0, 6)
      .map((item: any) => transformToMovieSummary(item)),
    videos: (result.videos?.results || [])
      .filter((v: any) => v.site === "YouTube")
      .slice(0, 3)
      .map((video: any) => ({
        key: video.key,
        site: video.site,
        type: video.type,
        name: video.name,
      })),
    seasons: (result.seasons || []).map((season: any) => ({
      id: season.id,
      name: season.name,
      seasonNumber: season.season_number,
      episodeCount: season.episode_count,
      airDate: season.air_date,
      posterPath: season.poster_path,
      overview: season.overview,
    })),
    numberOfSeasons: result.number_of_seasons,
    numberOfEpisodes: result.number_of_episodes,
  };
}

// ============ PUBLIC API EXPORTS ============

export async function getTrendingMovies(): Promise<MovieSummary[]> {
  const cacheKey = "tmdb:trending:movies:week";
  const data = await cachedApiCall(
    cacheKey,
    "/trending/movie/week",
    CACHE_DURATIONS.TRENDING,
  );

  return (data as any).results
    .slice(0, 24)
    .map((item: any) => transformToMovieSummary(item, "movie"));
}

export async function getPopularMovies(
  page: number = 1,
): Promise<MovieSummary[]> {
  const cacheKey = `tmdb:popular:movies:${page}`;
  const data = await cachedApiCall(
    cacheKey,
    `/movie/popular?page=${page}`,
    CACHE_DURATIONS.POPULAR,
  );

  return (data as any).results.map((item: any) =>
    transformToMovieSummary(item, "movie"),
  );
}

export async function getNowPlayingMovies(
  page: number = 1,
): Promise<MovieSummary[]> {
  const cacheKey = `tmdb:now-playing:movies:${page}`;
  const data = await cachedApiCall(
    cacheKey,
    `/movie/now_playing?page=${page}`,
    CACHE_DURATIONS.NOW_PLAYING,
  );

  return (data as any).results.map((item: any) =>
    transformToMovieSummary(item, "movie"),
  );
}

export async function getTopRatedMovies(
  page: number = 1,
): Promise<MovieSummary[]> {
  const cacheKey = `tmdb:top-rated:movies:${page}`;
  const data = await cachedApiCall(
    cacheKey,
    `/movie/top_rated?page=${page}`,
    CACHE_DURATIONS.TOP_RATED,
  );

  return (data as any).results.map((item: any) =>
    transformToMovieSummary(item, "movie"),
  );
}

export async function getTrendingTV(): Promise<MovieSummary[]> {
  const cacheKey = "tmdb:trending:tv:week";
  const data = await cachedApiCall(
    cacheKey,
    "/trending/tv/week",
    CACHE_DURATIONS.TRENDING,
  );

  return (data as any).results
    .slice(0, 24)
    .map((item: any) => transformToMovieSummary(item, "tv"));
}

export async function getPopularTV(page: number = 1): Promise<MovieSummary[]> {
  const cacheKey = `tmdb:popular:tv:${page}`;
  const data = await cachedApiCall(
    cacheKey,
    `/tv/popular?page=${page}`,
    CACHE_DURATIONS.POPULAR,
  );

  return (data as any).results.map((item: any) =>
    transformToMovieSummary(item, "tv"),
  );
}

export async function getTopRatedTV(page: number = 1): Promise<MovieSummary[]> {
  const cacheKey = `tmdb:top-rated:tv:${page}`;
  const data = await cachedApiCall(
    cacheKey,
    `/tv/top_rated?page=${page}`,
    CACHE_DURATIONS.TOP_RATED,
  );

  return (data as any).results.map((item: any) =>
    transformToMovieSummary(item, "tv"),
  );
}

export async function searchMulti(
  query: string,
  page: number = 1,
): Promise<MovieSummary[]> {
  if (query.length < 2) return [];

  const cacheKey = `tmdb:search:${query.toLowerCase()}:${page}`;
  const data = await cachedApiCall(
    cacheKey,
    `/search/multi?query=${encodeURIComponent(query)}&page=${page}`,
    CACHE_DURATIONS.SEARCH,
  );

  return (data as any).results
    .filter((item: any) => item.media_type !== "person" && item.poster_path)
    .slice(0, 20)
    .map((item: any) => transformToMovieSummary(item));
}

export async function searchMultiPaginated(
  query: string,
  page: number = 1,
): Promise<{
  results: MovieSummary[];
  page: number;
  totalPages: number;
  totalResults: number;
}> {
  if (query.length < 2) {
    return { results: [], page: 1, totalPages: 1, totalResults: 0 };
  }

  const cacheKey = `tmdb:search:multi:${query.toLowerCase()}:${page}`;
  const data = await cachedApiCall(
    cacheKey,
    `/search/multi?query=${encodeURIComponent(query)}&page=${page}`,
    CACHE_DURATIONS.SEARCH,
  );

  const normalizedResults = ((data as any).results || [])
    .filter((item: any) => item.media_type !== "person" && item.poster_path)
    .map((item: any) => transformToMovieSummary(item));

  const totalPages = Math.min(
    Math.max(1, Number((data as any).total_pages) || 1),
    500,
  );
  const totalResults = Math.max(
    0,
    Number((data as any).total_results) || normalizedResults.length,
  );

  return {
    results: normalizedResults,
    page,
    totalPages,
    totalResults,
  };
}

export async function searchMovies(
  query: string,
  page: number = 1,
): Promise<MovieSummary[]> {
  if (query.length < 2) return [];

  const cacheKey = `tmdb:search:movies:${query.toLowerCase()}:${page}`;
  const data = await cachedApiCall(
    cacheKey,
    `/search/movie?query=${encodeURIComponent(query)}&page=${page}`,
    CACHE_DURATIONS.SEARCH,
  );

  return (data as any).results
    .filter((item: any) => item.poster_path)
    .map((item: any) => transformToMovieSummary(item, "movie"));
}

export async function searchTV(
  query: string,
  page: number = 1,
): Promise<MovieSummary[]> {
  if (query.length < 2) return [];

  const cacheKey = `tmdb:search:tv:${query.toLowerCase()}:${page}`;
  const data = await cachedApiCall(
    cacheKey,
    `/search/tv?query=${encodeURIComponent(query)}&page=${page}`,
    CACHE_DURATIONS.SEARCH,
  );

  return (data as any).results
    .filter((item: any) => item.poster_path)
    .map((item: any) => transformToMovieSummary(item, "tv"));
}

export async function getMovieDetails(id: number): Promise<MediaDetail> {
  const cacheKey = `tmdb:movie:${id}`;
  const data = await cachedApiCall(
    cacheKey,
    `/movie/${id}?append_to_response=credits,similar,videos`,
    CACHE_DURATIONS.DETAILS,
  );

  return transformToMediaDetail(data as any, "movie");
}

export async function getTVDetails(id: number): Promise<MediaDetail> {
  const cacheKey = `tmdb:tv:${id}`;
  const data = await cachedApiCall(
    cacheKey,
    `/tv/${id}?append_to_response=credits,similar,videos`,
    CACHE_DURATIONS.DETAILS,
  );

  return transformToMediaDetail(data as any, "tv");
}

export async function getSeasonDetails(
  tvId: number,
  seasonNumber: number,
): Promise<any> {
  const cacheKey = `tmdb:tv:${tvId}:season:${seasonNumber}`;
  return cachedApiCall(
    cacheKey,
    `/tv/${tvId}/season/${seasonNumber}`,
    CACHE_DURATIONS.DETAILS,
  );
}

export async function getGenres(type: MediaType): Promise<any[]> {
  const cacheKey = `tmdb:genres:${type}`;
  const data = await cachedApiCall(
    cacheKey,
    `/genre/${type === "movie" ? "movie" : "tv"}/list`,
    CACHE_DURATIONS.GENRES,
  );

  return (data as any).genres || [];
}

/**
 * Generate TMDB image URL with size optimization
 */
export function getTMDBImageUrl(
  path: string | null,
  width: number | "original" = 342,
): string {
  if (!path) return "/placeholder.svg";

  // Map numeric widths to valid TMDB sizes, handle "original"
  let size: string;
  if (width === "original") {
    size = "original";
  } else if (typeof width === "number") {
    // Map common widths to valid TMDB sizes
    const validSizes: Record<number, string> = {
      45: "w45",
      92: "w92",
      154: "w154",
      185: "w185",
      342: "w342",
      500: "w500",
      780: "w780",
      1280: "w1280",
    };
    size = validSizes[width] || `w${width}`;
  } else {
    size = `w${width}`;
  }

  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

/**
 * Clear all caches (useful for cache invalidation in future)
 */
export function clearCache(): void {
  cacheManager.clear();
}
