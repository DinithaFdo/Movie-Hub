"use client";

import { useState, useEffect } from "react";
import { MediaCard } from "@/components/cards/media-card";
import { Pagination } from "@/components/ui/pagination";
import { MediaGridSkeleton } from "@/components/skeletons/skeleton";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { usePagination } from "@/hooks";
import type { MovieSummary } from "@/types/movie";
import { Film } from "lucide-react";

export default function MoviesPage() {
  const { page, goToPage } = usePagination(1);
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(100);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/movies?page=${page}`);
        const data = (await response.json()) as MovieSummary[];
        setMovies(data);
        setTotalPages(100);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

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

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={goToPage}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </PageShell>
  );
}
