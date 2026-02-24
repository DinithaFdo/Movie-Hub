export type MediaType = "movie" | "tv";

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
