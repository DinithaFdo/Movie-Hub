"use client";

import { useState, useEffect } from "react";
import { MediaCard } from "@/components/cards/media-card";
import { MediaGridSkeleton } from "@/components/skeletons/skeleton";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import type { MovieSummary } from "@/types/movie";
import { Film, Loader2 } from "lucide-react";

export default function MoviesPage() {
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/movies?page=${page}`, {
          cache: "no-store",
        });
        const data = (await response.json()) as MovieSummary[];
        setMovies(data);
        setHasMore(data.length > 0);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const loadMore = async () => {
    if (!hasMore || isLoading || isLoadingMore) return;

    const nextPage = page + 1;
    setIsLoadingMore(true);

    try {
      const response = await fetch(`/api/movies?page=${nextPage}`, {
        cache: "no-store",
      });
      const data = (await response.json()) as MovieSummary[];

      if (data.length === 0) {
        setHasMore(false);
        return;
      }

      setMovies((current) => {
        const existingIds = new Set(current.map((movie) => movie.id));
        const uniqueNewMovies = data.filter(
          (movie) => !existingIds.has(movie.id),
        );
        return [...current, ...uniqueNewMovies];
      });
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more movies:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <PageHeader
          title="Movies"
          subtitle="Explore blockbuster hits, indie gems, and timeless classics in one cinematic catalog."
          icon={<Film className="h-8 w-8" />}
        />

        {/* Grid */}
        {isLoading ? (
          <MediaGridSkeleton count={12} />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-12">
              {movies.map((movie) => (
                <MediaCard key={movie.id} media={movie} />
              ))}
            </div>

            {hasMore ? (
              <div className="flex justify-center pb-8">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D4FF3E]/25 bg-[#D4FF3E]/10 px-6 py-3 text-sm font-bold text-[#D4FF3E] transition-all duration-300 hover:bg-[#D4FF3E] hover:text-black hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading more
                    </>
                  ) : (
                    "Browse more"
                  )}
                </button>
              </div>
            ) : (
              <div className="pb-8 text-center text-sm text-[var(--text-muted)]">
                You&apos;ve reached the end of the list.
              </div>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}
