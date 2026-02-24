"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { MovieCard } from "@/components/cards/movie-card";
import { fetchMedia } from "@/app/actions";
import type { MediaType, MovieSummary } from "@/types/movie";

interface MediaGridProps {
  initialMedia: MovieSummary[];
  type: MediaType;
  title: string;
}

export function MediaGrid({ initialMedia, type, title }: MediaGridProps) {
  const [media, setMedia] = useState<MovieSummary[]>(initialMedia);
  const [page, setPage] = useState(2); // Initial data is page 1, so next is 2
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newMedia = await fetchMedia(type, page);
      if (newMedia.length === 0) {
        setHasMore(false);
      } else {
        setMedia((prev) => [...prev, ...newMedia]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to load more media", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-400 mx-auto min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">
        {title}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 gap-y-12">
        {media.map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex justify-center">
            <MovieCard movie={item} index={index % 20} />
          </div>
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        {hasMore ? (
          <button
            onClick={loadMore}
            disabled={loading}
            className="group relative px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95 disabled:opacity-50"
          >
            <span className="flex items-center gap-2 font-medium text-white group-hover:text-[#00f3ff] transition-colors">
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? "Loading..." : "Load More"}
            </span>
            <div className="absolute inset-0 rounded-full bg-linear-to-r from-[#00f3ff]/0 via-[#00f3ff]/10 to-[#7000ff]/0 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
          </button>
        ) : (
          <p className="text-gray-500">You&apos;ve reached the end.</p>
        )}
      </div>
    </div>
  );
}
