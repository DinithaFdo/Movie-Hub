import { env } from "@/lib/env";
import type {
  CastMember,
  CrewMember,
  MediaDetail,
  MediaType,
  MovieSummary,
  Season,
  VideoResult,
  Episode,
} from "@/types/movie";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// --- TMDB Raw Types ---
type TMDBResult = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: MediaType;
  genre_ids?: number[];
};

type TMDBCredits = {
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }[];
  crew: {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
  }[];
};

type TMDBDetail = TMDBResult & {
  tagline?: string;
  status?: string;
  runtime?: number;
  episode_run_time?: number[];
  genres?: { id: number; name: string }[];
  credits?: TMDBCredits;
  similar?: {
    results: TMDBResult[];
  };
  recommendations?: {
    results: TMDBResult[];
  };
  videos?: {
    results: {
      key: string;
      site: string;
      type: string;
      name: string;
    }[];
  };
  seasons?: {
    id: number;
    name: string;
    season_number: number;
    episode_count: number;
    air_date: string | null;
    poster_path: string | null;
    overview: string | null;
  }[];
  number_of_seasons?: number;
  number_of_episodes?: number;
};

type TMDBSeasonDetail = {
  id: number;
  air_date: string | null;
  episodes: {
    air_date: string | null;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    runtime: number;
    still_path: string | null;
    vote_average: number;
  }[];
  name: string;
  overview: string;
  season_number: number;
  poster_path: string | null;
  _id: string; // TMDB specific
};

type TMDBPaginatedResult = {
  page: number;
  results: TMDBResult[];
  total_pages: number;
  total_results: number;
};

// --- Mappers ---
function mapTMDBMovie(
  result: TMDBResult,
  fallbackMediaType: MediaType = "movie",
): MovieSummary {
  return {
    id: result.id,
    title: result.title ?? result.name ?? "Untitled",
    posterPath: result.poster_path,
    backdropPath: result.backdrop_path,
    overview: result.overview,
    voteAverage: result.vote_average,
    releaseDate: result.release_date ?? result.first_air_date ?? null,
    mediaType: result.media_type ?? fallbackMediaType,
    genreIds: result.genre_ids,
  };
}

function mapCast(cast: TMDBCredits["cast"][0]): CastMember {
  return {
    id: cast.id,
    name: cast.name,
    character: cast.character,
    profilePath: cast.profile_path,
  };
}

function mapCrew(crew: TMDBCredits["crew"][0]): CrewMember {
  return {
    id: crew.id,
    name: crew.name,
    job: crew.job,
    department: crew.department,
    profilePath: crew.profile_path,
  };
}

function mapVideo(video: {
  key: string;
  site: string;
  type: string;
  name: string;
}): VideoResult {
  return {
    key: video.key,
    site: video.site,
    type: video.type,
    name: video.name,
  };
}

function mapSeason(season: NonNullable<TMDBDetail["seasons"]>[0]): Season {
  return {
    id: season.id,
    name: season.name,
    seasonNumber: season.season_number,
    episodeCount: season.episode_count,
    airDate: season.air_date,
    posterPath: season.poster_path,
    overview: season.overview,
  };
}

function mapToDetail(data: TMDBDetail, type: MediaType): MediaDetail {
  const similarRaw = data.recommendations?.results.length
    ? data.recommendations.results
    : data.similar?.results;

  return {
    ...mapTMDBMovie(data, type),
    tagline: data.tagline ?? null,
    status: data.status ?? "Unknown",
    runtime: data.runtime ?? data.episode_run_time?.[0] ?? null,
    genres: data.genres ?? [],
    cast: (data.credits?.cast ?? []).slice(0, 20).map(mapCast),
    crew: (data.credits?.crew ?? [])
      .filter((c) =>
        ["Director", "Screenplay", "Writer", "Executive Producer"].includes(
          c.job,
        ),
      )
      .slice(0, 5)
      .map(mapCrew),
    similar: (similarRaw ?? [])
      .slice(0, 10)
      .map((item) => mapTMDBMovie(item, type)),
    videos: (data.videos?.results ?? [])
      .filter(
        (v) =>
          v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"),
      )
      .map(mapVideo),
    seasons: data.seasons?.filter((s) => s.season_number > 0).map(mapSeason),
    numberOfSeasons: data.number_of_seasons,
    numberOfEpisodes: data.number_of_episodes,
  };
}

// --- Fetcher ---
async function tmdbFetch<T>(
  path: string,
  options?: {
    query?: Record<string, string | number | undefined>;
    revalidate?: number;
    tags?: string[];
  },
): Promise<T> {
  const apiKey = env.tmdbApiKey;

  if (!apiKey) throw new Error("TMDB_API_KEY is missing");

  const params = new URLSearchParams({
    api_key: apiKey,
    language: "en-US",
  });

  Object.entries(options?.query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const url = `${TMDB_BASE_URL}${path}?${params.toString()}`;

  const response = await fetch(url, {
    next: {
      revalidate: options?.revalidate ?? 3600,
      tags: options?.tags,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Media not found`);
    }
    throw new Error(
      `TMDB request failed: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as T;
}

// --- Public API ---
export async function getTrending(
  type: MediaType = "movie",
): Promise<MovieSummary[]> {
  const payload = await tmdbFetch<TMDBPaginatedResult>(
    `/trending/${type}/day`,
    {
      revalidate: 3600,
      tags: [`trending-${type}`],
    },
  );

  return payload.results.map((item) => mapTMDBMovie(item, type));
}

export async function getDiscovery(
  type: MediaType,
  category:
    | "popular"
    | "top_rated"
    | "now_playing"
    | "upcoming"
    | "airing_today"
    | "on_the_air",
  page = 1,
): Promise<MovieSummary[]> {
  const payload = await tmdbFetch<TMDBPaginatedResult>(`/${type}/${category}`, {
    query: { page },
    revalidate: 1800,
    tags: [`${type}-${category}`],
  });

  return payload.results.map((item) => mapTMDBMovie(item, type));
}

export async function searchMovies(query: string): Promise<MovieSummary[]> {
  if (!query.trim()) return [];

  const payload = await tmdbFetch<TMDBPaginatedResult>("/search/multi", {
    query: {
      query,
      include_adult: "false",
      page: 1,
    },
    revalidate: 300,
  });

  return payload.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map((item) =>
      mapTMDBMovie(item, item.media_type === "tv" ? "tv" : "movie"),
    );
}

export async function getMediaDetailed(
  type: MediaType,
  id: string,
): Promise<MediaDetail> {
  const append = ["credits", "videos", "recommendations", "similar"];
  if (type === "tv") append.push("external_ids");

  const payload = await tmdbFetch<TMDBDetail>(`/${type}/${id}`, {
    query: {
      append_to_response: append.join(","),
    },
    revalidate: 60 * 60 * 6, // 6 hours
    tags: [`${type}-${id}-full`],
  });

  return mapToDetail(payload, type);
}

export async function getSeasonDetails(
  id: string,
  seasonNumber: number,
): Promise<Episode[]> {
  try {
    const payload = await tmdbFetch<TMDBSeasonDetail>(
      `/tv/${id}/season/${seasonNumber}`,
      {
        revalidate: 60 * 60, // 1 hour
      },
    );

    return payload.episodes.map((item) => ({
      id: item.id,
      name: item.name,
      overview: item.overview,
      voteAverage: item.vote_average,
      stillPath: item.still_path,
      airDate: item.air_date,
      episodeNumber: item.episode_number,
      runtime: item.runtime,
    }));
  } catch (error) {
    console.error(`Failed to fetch season ${seasonNumber}`, error);
    return [];
  }
}

// Compatibility exports so existing imports don't break immediately
export const getTrendingMovies = () => getTrending("movie");
export const getNowPlayingMovies = () => getDiscovery("movie", "now_playing");
export const getTopRatedMovies = () => getDiscovery("movie", "top_rated");
export const getPopularMovies = () => getDiscovery("movie", "popular");
export const getMediaDetails = (type: MediaType, id: string) =>
  getMediaDetailed(type, id);

export function getTMDBImageUrl(
  path: string | null,
  size:
    | "w92"
    | "w154"
    | "w185"
    | "w300"
    | "w342"
    | "w500"
    | "w780"
    | "w1280"
    | "original" = "w780",
): string {
  if (!path) return "/poster-fallback.svg";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
