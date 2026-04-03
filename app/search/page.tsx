"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MediaCard } from "@/components/cards/media-card";
import { Pagination } from "@/components/ui/pagination";
import { SearchResultsSkeleton } from "@/components/skeletons/skeleton";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { useDebounce, usePagination } from "@/hooks";
import { useSearchHistoryStore } from "@/stores/search-history";
import type { MovieSummary } from "@/types/movie";
import { Search } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const { page, goToPage } = usePagination(1);

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<MovieSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const { addSearch } = useSearchHistoryStore();

  const debouncedQuery = useDebounce(query, 300);

  const handleSearch = useCallback(
    async (searchQuery: string, pageNum: number) => {
      if (searchQuery.length < 2) {
        setResults([]);
        setTotalPages(1);
        return;
      }

      setIsLoading(true);
      try {
        addSearch(searchQuery);

        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}&page=${pageNum}`,
          { cache: "no-store" },
        );

        const data = (await response.json()) as {
          results: MovieSummary[];
          page: number;
          totalPages: number;
          totalResults: number;
        };

        setResults(data.results || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    },
    [addSearch],
  );

  useEffect(() => {
    handleSearch(debouncedQuery, page);
  }, [debouncedQuery, page, handleSearch]);

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <PageHeader
          title="Search Catalog"
          subtitle="Find any movie or series instantly with blazing-fast search and polished browsing."
          icon={<Search className="h-8 w-8" />}
        />

        {/* Search Input */}
        <div className="mb-12">
          <div className="relative max-w-3xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, shows, actors..."
              className="w-full rounded-2xl border border-(--border-default) bg-(--bg-elevated)/80 px-6 py-4 text-base text-(--text-primary) placeholder-(--text-muted) shadow-elevation-2 transition-all duration-300 focus:border-(--primary)/55 focus:outline-none"
            />
            <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-(--text-muted)" />
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <SearchResultsSkeleton />
        ) : query.length < 2 ? (
          <div className="rounded-3xl border border-(--border-default) bg-(--bg-elevated)/70 py-14 text-center shadow-elevation-2 backdrop-blur-xl">
            <Search className="mx-auto mb-4 h-12 w-12 text-(--text-muted) opacity-60" />
            <p className="text-(--text-tertiary)">
              Type at least 2 characters to begin searching.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-3xl border border-(--border-default) bg-(--bg-elevated)/70 py-14 text-center shadow-elevation-2 backdrop-blur-xl">
            <p className="text-lg text-(--text-tertiary)">
              No results found for &quot;{query}&quot;
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {results.map((result) => (
                <MediaCard
                  key={`${result.mediaType}-${result.id}`}
                  media={result}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={goToPage}
                isLoading={isLoading}
              />
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}
