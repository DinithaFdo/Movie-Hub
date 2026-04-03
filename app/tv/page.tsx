"use client";

import { useState, useEffect } from "react";
import { MediaCard } from "@/components/cards/media-card";
import { Pagination } from "@/components/ui/pagination";
import { MediaGridSkeleton } from "@/components/skeletons/skeleton";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { usePagination } from "@/hooks";
import type { MovieSummary } from "@/types/movie";
import { Tv } from "lucide-react";

export default function TVPage() {
  const { page, goToPage } = usePagination(1);
  const [shows, setShows] = useState<MovieSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(100);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/tv?page=${page}`);
        const data = (await response.json()) as MovieSummary[];
        setShows(data);
        setTotalPages(100);
      } catch (error) {
        console.error("Error fetching TV shows:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShows();
  }, [page]);

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <PageHeader
          title="TV Series"
          subtitle="Discover addictive series, prestige dramas, and fan-favorite seasons curated for binge sessions."
          icon={<Tv className="h-8 w-8" />}
        />

        {/* Grid */}
        {isLoading ? (
          <MediaGridSkeleton count={12} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {shows.map((show) => (
                <MediaCard key={show.id} media={show} />
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
