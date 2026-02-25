import { MovieCard } from "@/components/cards/movie-card";
import {
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
} from "@/lib/tmdb";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

type MovieRowKey = "trending" | "now-playing" | "popular" | "top-rated";

const categoryConfig: Record<
  MovieRowKey,
  {
    title: string;
    subtitle?: string;
    query: () => Promise<Awaited<ReturnType<typeof getTrendingMovies>>>;
    link?: string;
  }
> = {
  trending: {
    title: "Trending Now",
    subtitle: "Most watched movies this week",
    query: getTrendingMovies,
    link: "/movies",
  },
  "now-playing": {
    title: "In Theaters",
    subtitle: "Watch the latest releases",
    query: getNowPlayingMovies,
    link: "/movies",
  },
  popular: {
    title: "Popular on MovieHub",
    subtitle: "Everyone is talking about these",
    query: getPopularMovies,
    link: "/movies",
  },
  "top-rated": {
    title: "Critically Acclaimed",
    subtitle: "All time favorites",
    query: getTopRatedMovies,
    link: "/movies",
  },
};

type MovieRowProps = {
  id: MovieRowKey;
};

export async function MovieRow({ id }: MovieRowProps) {
  const config = categoryConfig[id];
  const movies = await config.query();

  return (
    <section id={id} className="relative py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            {config.title}
          </h2>
          {config.subtitle && (
            <p className="mt-1 text-sm text-gray-400 font-medium">
              {config.subtitle}
            </p>
          )}
        </div>

        {config.link && (
          <Link
            href={config.link}
            className="group flex items-center gap-1 text-sm font-semibold text-[#ffa31a] transition-colors hover:text-[#ffd38a]"
          >
            View All{" "}
            <ChevronRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        )}
      </div>

      <div className="relative">
        <div className="-mx-4 flex gap-4 overflow-x-hidden px-4 pb-8 snap-x sm:-mx-6 sm:px-6 lg:-mx-8 lg:overflow-x-auto lg:px-8 scrollbar-hide">
          {movies.slice(0, 15).map((movie, index) => (
            <div key={movie.id} className="snap-start">
              <MovieCard movie={movie} priority={index < 4} index={index} />
            </div>
          ))}
        </div>

        {/* Fog gradients for scroll edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-linear-to-r from-[#050505] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-linear-to-l from-[#050505] to-transparent" />
      </div>
    </section>
  );
}
