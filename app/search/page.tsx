"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MediaCard } from "@/components/cards/media-card";
import { Pagination } from "@/components/ui/pagination";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { useDebounce, usePagination } from "@/hooks";
import { useSearchHistoryStore } from "@/stores/search-history";
import type { MovieSummary } from "@/types/movie";
import { Search, Clapperboard, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const { page, goToPage } = usePagination(1);

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<MovieSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const { addSearch } = useSearchHistoryStore();
  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const debouncedQuery = useDebounce(query, 500);

  // Update URL purely for sharability, without navigating
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      router.replace("/search?q=" + encodeURIComponent(debouncedQuery.trim()), {
        scroll: false,
      });
    } else if (debouncedQuery.trim().length === 0) {
      router.replace("/search", { scroll: false });
    }
  }, [debouncedQuery, router]);

  useEffect(() => {
    if (debouncedQuery !== initialQuery && page !== 1) {
      goToPage(1);
    }
  }, [debouncedQuery, initialQuery, page, goToPage]);

  const handleSearch = useCallback(
    async (searchQuery: string, pageNum: number) => {
      const normalizedQuery = searchQuery.trim();

      if (normalizedQuery.length < 2) {
        setResults([]);
        setTotalPages(1);
        setTotalResults(0);
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const requestId = ++requestIdRef.current;

      setIsLoading(true);
      try {
        addSearch(normalizedQuery);

        const response = await fetch(
          `/api/search?q=${encodeURIComponent(normalizedQuery)}&page=${pageNum}`,
          { cache: "no-store", signal: controller.signal },
        );

        const data = (await response.json()) as {
          results: MovieSummary[];
          page: number;
          totalPages: number;
          totalResults: number;
        };

        if (requestId !== requestIdRef.current || controller.signal.aborted) {
          return;
        }

        setResults(data.results || []);
        setTotalPages(data.totalPages || 1);
        setTotalResults(data.totalResults || 0);
      } catch (error) {
        if ((error as { name?: string }).name === "AbortError") {
          return;
        }
        if (requestId === requestIdRef.current) {
          setResults([]);
          setTotalPages(1);
          setTotalResults(0);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [addSearch],
  );

  useEffect(() => {
    handleSearch(debouncedQuery, page);
    return () => {
      abortRef.current?.abort();
    };
  }, [debouncedQuery, page, handleSearch]);

  const renderSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-12">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-2xl animate-pulse">
          <div className="aspect-[2/3] w-full rounded-2xl bg-white/5 border border-white/5 shadow-sm" />
          <div className="space-y-2 px-1">
            <div className="h-4 w-3/4 rounded-full bg-white/5" />
            <div className="flex justify-between items-center">
              <div className="h-3 w-12 rounded-full bg-white/5" />
              <div className="h-3 w-8 rounded-full bg-white/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <PageShell>
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        {/* Search Header Section */}
        <div className="relative pt-28 pb-12 overflow-hidden border-b border-white/5">
          {/* subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#D4FF3E] opacity-[0.03] blur-[120px] rounded-[100%] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10 flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-8 text-center"
            >
              Explore <span className="text-[#D4FF3E]">Universe</span>
            </motion.h1>

            {/* Search Input Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-3xl relative group"
            >
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
                <Search
                  className={`h-6 w-6 transition-colors duration-300 ${query.length > 0 ? "text-[#D4FF3E]" : "text-white/40 group-focus-within:text-[#D4FF3E]"}`}
                />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for movies, TV shows, or anything..."
                className="w-full h-16 rounded-[2rem] bg-white/5 border border-white/10 pl-16 pr-16 text-lg text-white font-medium placeholder:text-white/30 backdrop-blur-xl shadow-2xl transition-all duration-300 focus:outline-none focus:bg-white/10 focus:border-[#D4FF3E]/30 focus:shadow-[0_0_40px_rgba(212,255,62,0.1)]"
                autoFocus
              />
              <AnimatePresence>
                {query.length > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setQuery("")}
                    className="absolute inset-y-0 right-0 pr-6 flex items-center z-10"
                  >
                    <div className="h-8 w-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/5">
                      <X className="h-4 w-4 text-white/70" />
                    </div>
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Results Meta Info */}
            <div className="mt-8 h-6 flex items-center justify-center text-sm font-medium">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center text-[#D4FF3E]"
                  >
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Searching across catalog...
                  </motion.span>
                ) : query.length >= 2 ? (
                  <motion.span
                    key="results"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-white/60"
                  >
                    Found{" "}
                    <strong className="text-white">
                      {totalResults.toLocaleString()}
                    </strong>{" "}
                    results for{" "}
                    <span className="text-white">&quot;{query}&quot;</span>
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Results Container */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          {isLoading ? (
            renderSkeleton()
          ) : query.trim().length < 2 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="h-24 w-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white/20">
                <Clapperboard className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Discover Great Content
              </h3>
              <p className="text-white/50 max-w-md">
                Type at least 2 characters to instantly search through thousands
                of movies and TV shows.
              </p>
            </motion.div>
          ) : results.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="h-24 w-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white/20">
                <Search className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                No matches found
              </h3>
              <p className="text-white/50 max-w-md">
                We couldn&apos;t find any results for &quot;{query}&quot;. Try
                checking for typos or using different keywords.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-12">
                <AnimatePresence>
                  {results.map((result, i) => (
                    <motion.div
                      key={`${result.mediaType}-${result.id}`}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: i * 0.05,
                        ease: "easeOut",
                      }}
                    >
                      <MediaCard media={result} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {totalPages > 1 && (
                <div className="pt-8 border-t border-white/5">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
