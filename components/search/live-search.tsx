"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2 } from "lucide-react";

import { getTMDBImageUrl } from "@/lib/tmdb";
import { cn } from "@/utils/helpers";
import type { MovieSummary } from "@/types/movie";
import { useSearchHistoryStore } from "@/stores/search-history";

export function LiveSearch({ className }: { className?: string }) {
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
          page: number;
          totalPages: number;
          totalResults: number;
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
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form className="relative group" onSubmit={handleSubmit}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#00f3ff] transition-colors" />
        </div>
        <input
          value={query}
          onChange={(event) => handleInputChange(event.target.value)}
          onFocus={() => setShowResults(true)}
          placeholder="Search movies, tv shows..."
          className="h-11 w-full rounded-full border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:bg-black/80 focus:border-[#00f3ff]/50 focus:ring-1 focus:ring-[#00f3ff]/30 transition-all duration-300 backdrop-blur-sm"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <Loader2 className="h-4 w-4 animate-spin text-[#00f3ff]" />
          </div>
        )}
      </form>

      {shouldShowPanel && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 ring-1 ring-white/5">
          {results.length > 0 ? (
            results.map((movie) => (
              <Link
                key={movie.id}
                href={`/watch/${movie.mediaType}/${movie.id}`}
                className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-white/10 group border-b border-white/5 last:border-0"
                onClick={() => {
                  addSearch(query.trim());
                  setQuery("");
                  setResults([]);
                  setShowResults(false);
                }}
              >
                <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-md bg-neutral-800 shadow-sm border border-white/10">
                  {movie.posterPath ? (
                    <Image
                      src={getTMDBImageUrl(movie.posterPath, "w92")}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="44px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-white/5 text-[10px] text-gray-500 font-medium">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 py-1">
                  <h4 className="text-sm font-medium text-white truncate group-hover:text-[#00f3ff] transition-colors">
                    {movie.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="inline-flex items-center rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-300">
                      {movie.mediaType === "tv" ? "Series" : "Movie"}
                    </span>
                    {movie.releaseDate && (
                      <span className="text-xs text-gray-500 font-medium">
                        {new Date(movie.releaseDate).getFullYear()}
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-xs font-semibold text-yellow-500 ml-auto">
                      <span>★</span>
                      <span>{movie.voteAverage.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-sm text-gray-400">
              No results found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
