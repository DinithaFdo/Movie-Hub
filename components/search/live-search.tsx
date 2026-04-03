"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { getTMDBImageUrl } from "@/services/tmdb";
import { cn } from "@/utils/helpers";
import type { MovieSummary } from "@/types/movie";
import { useSearchHistoryStore } from "@/stores/search-history";

export function LiveSearch({ className, isExpanded, onFocus, onBlur }: { className?: string, isExpanded?: boolean, onFocus?: () => void, onBlur?: () => void }) {
  const { addSearch } = useSearchHistoryStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MovieSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<number | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
      abortRef.current?.abort();
    };
  }, []);

  function handleInputChange(nextValue: string): void {
    setQuery(nextValue);
    setShowResults(true);

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    abortRef.current?.abort();

    const normalizedQuery = nextValue.trim();

    if (normalizedQuery.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    debounceRef.current = window.setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(normalizedQuery)}`,
          {
            signal: controller.signal,
          },
        );
        const payload = (await response.json()) as {
          results: MovieSummary[];
        };
        setResults((payload.results || []).slice(0, 6));
      } catch (error: unknown) {
        if ((error as { name?: string }).name !== "AbortError") {
          setResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }

  const shouldShowPanel = useMemo(
    () => showResults && query.trim().length >= 2,
    [showResults, query],
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const nextQuery = query.trim();
    if (nextQuery.length < 2) return;

    addSearch(nextQuery);
    setShowResults(true);
  }

  return (
    <div ref={containerRef} className={cn("relative w-full transition-all duration-300", className)}>
      <form className="relative group w-full" onSubmit={handleSubmit}>
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
          <Search className={cn("h-[18px] w-[18px] transition-colors", isExpanded ? "text-[#D4FF3E]" : "text-white")} />
        </div>
        <input
          value={query}
          onChange={(event) => handleInputChange(event.target.value)}
          onFocus={() => {
            setShowResults(true);
            onFocus?.();
          }}
          onBlur={() => {
            if (query.trim().length === 0) onBlur?.();
          }}
          placeholder="Search movies, tv shows..."
          className={cn(
            "h-10 rounded-full border bg-[#1A1A1D]/80 pl-10 pr-4 text-sm text-white placeholder:text-[#8A8A8E] focus:outline-none transition-all duration-300 backdrop-blur-xl shrink-0 placeholder:opacity-0 focus:placeholder:opacity-100",
            isExpanded ? "w-[160px] sm:w-[260px] md:w-[320px] focus:bg-[#0D0D0F] focus:border-[#D4FF3E]/50 border-white/10" : "w-10 border-transparent text-transparent placeholder:text-transparent cursor-pointer hover:border-white/20"
          )}
        />
        {isLoading && isExpanded && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <Loader2 className="h-4 w-4 animate-spin text-[#D4FF3E]" />
          </div>
        )}
      </form>

      <AnimatePresence>
        {shouldShowPanel && isExpanded && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute z-50 mt-3 w-[280px] md:w-[320px] right-0 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#1A1A1D]/95 backdrop-blur-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)]"
          >
            {results.length > 0 ? (
              <div className="py-2">
                {results.map((movie) => (
                  <Link
                    key={movie.id}
                    href={`/watch/${movie.mediaType || 'movie'}/${movie.id}`}
                    className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-white/5 group border-b border-white/5 last:border-0"
                    onClick={() => {
                      addSearch(query.trim());
                      setQuery("");
                      setResults([]);
                      setShowResults(false);
                      onBlur?.();
                    }}
                  >
                    <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-xl bg-black border border-white/5">
                      {movie.posterPath ? (
                        <Image
                          src={getTMDBImageUrl(movie.posterPath, 92)}
                          alt={movie.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-white/5 text-[10px] text-[#8A8A8E] font-medium border border-white/10">
                          N/A
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 py-1">
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-[#D4FF3E] transition-colors">
                        {movie.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          {movie.mediaType === "tv" ? "Series" : "Movie"}
                        </span>
                        {movie.releaseDate && (
                          <span className="text-xs text-[#8A8A8E] font-bold">
                            {movie.releaseDate.substring(0, 4)}
                          </span>
                        )}
                        <div className="flex items-center gap-1 text-xs font-bold text-[#D4FF3E] ml-auto">
                          <span>★ {Number(movie.voteAverage).toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-sm font-bold text-[#8A8A8E]">
                No results found for &quot;{query}&quot;
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
