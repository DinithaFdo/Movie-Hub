"use client";

import { useState, useEffect } from "react";
import { MediaCard } from "@/components/cards/media-card";
import { MediaGridSkeleton } from "@/components/skeletons/skeleton";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import type { MovieSummary } from "@/types/movie";
import { Loader2, Tv } from "lucide-react";

export default function TVPage() {
  const [shows, setShows] = useState<MovieSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/tv?page=${page}`, {
          cache: "no-store",
        });
        const data = (await response.json()) as MovieSummary[];
        setShows(data);
        setHasMore(data.length > 0);
      } catch (error) {
        console.error("Error fetching TV shows:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShows();
  }, []);

  const loadMore = async () => {
    if (!hasMore || isLoading || isLoadingMore) return;

    const nextPage = page + 1;
    setIsLoadingMore(true);

    try {
      const response = await fetch(`/api/tv?page=${nextPage}`, {
        cache: "no-store",
      });
      const data = (await response.json()) as MovieSummary[];

      if (data.length === 0) {
        setHasMore(false);
        return;
      }

      setShows((current) => {
        const existingIds = new Set(current.map((show) => show.id));
        const uniqueNewShows = data.filter((show) => !existingIds.has(show.id));
        return [...current, ...uniqueNewShows];
      });
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more TV shows:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-12">
              {shows.map((show) => (
                <MediaCard key={show.id} media={show} />
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
