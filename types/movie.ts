// ============ Core Types ============
export type MediaType = "movie" | "tv";

export type SortOption =
  | "popularity.desc"
  | "revenue.desc"
  | "primary_release_date.desc"
  | "vote_average.desc"
  | "vote_count.desc";

// ============ Movie/TV Types ============
export type MovieSummary = {
  id: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  overview: string;
  voteAverage: number;
  releaseDate: string | null;
  mediaType: MediaType;
  genreIds?: number[];
};

export type CastMember = {
  id: number;
  name: string;
  character: string;
  profilePath: string | null | undefined;
};

export type CrewMember = {
  id: number;
  name: string;
  job: string;
  department: string;
  profilePath: string | null | undefined;
};

export type VideoResult = {
  key: string;
  site: string;
  type: string;
  name: string;
};

export type Season = {
  id: number;
  name: string;
  seasonNumber: number;
  episodeCount: number;
  airDate: string | null | undefined;
  posterPath: string | null | undefined;
  overview: string | null | undefined;
};

export type Episode = {
  id: number;
  name: string;
  overview: string;
  voteAverage: number;
  stillPath: string | null;
  airDate: string | null;
  episodeNumber: number;
  runtime: number;
};

export type MediaDetail = MovieSummary & {
  tagline: string | null;
  status: string;
  runtime: number | null;
  genres: { id: number; name: string }[];
  cast: CastMember[];
  crew: CrewMember[];
  similar: MovieSummary[];
  videos: VideoResult[];
  seasons?: Season[];
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
};

// ============ Filter & Search Types ============
export type FilterOptions = {
  genres?: number[];
  sort?: SortOption;
  year?: number;
  minRating?: number;
  maxRating?: number;
  page?: number;
};

export type SearchParams = {
  query: string;
  type?: MediaType | "all";
  page?: number;
};

// ============ API Response Types ============
export type APIResponse<T> = {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
};

// ============ Error Types ============
export type APIError = {
  code: string;
  message: string;
  statusCode: number;
};

// ============ User Interaction Types ============
export type UserAction =
  | "favorite"
  | "watch"
  | "share"
  | "search"
  | "view"
  | "collection";

export type UserInteraction = {
  action: UserAction;
  mediaId: number;
  mediaType: MediaType;
  timestamp: number;
};
