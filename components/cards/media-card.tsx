/**
 * Media Card Component - Modern, interactive, responsive
 * Displays movie/TV show with gradient overlay, rating, favorite state
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Play } from "lucide-react";
import { useState } from "react";
import { formatRating, formatDate, cn } from "@/utils/helpers";
import { getTMDBImageUrl } from "@/services/tmdb";
import { useFavoritesStore } from "@/stores/favorites";
import { useWatchHistoryStore } from "@/stores/watch-history";
import type { MovieSummary } from "@/types/movie";

interface MediaCardProps {
  media: MovieSummary;
  variant?: "default" | "horizontal" | "small";
  onClick?: () => void;
  showActionButtons?: boolean;
}

export function MediaCard({
  media,
  variant = "default",
  onClick,
  showActionButtons = true,
}: MediaCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isFavorite, addToFavorites, removeFromFavorites } =
    useFavoritesStore();
  const { isWatched, getWatchProgress } = useWatchHistoryStore();
  const favorite = isFavorite(media.id);
  const watched = isWatched(media.id);
  const progress = getWatchProgress(media.id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (favorite) {
      removeFromFavorites(media.id);
    } else {
      addToFavorites(media);
    }
  };

  const posterUrl = getTMDBImageUrl(media.posterPath, 500);

  if (variant === "small") {
    return (
      <Link href={`/watch/${media.mediaType || "movie"}/${media.id}`}>
        <div className="group relative overflow-hidden rounded-[2rem] border border-transparent bg-[#1A1A1D] shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-[#D4FF3E]/30 hover:shadow-2xl">
          <div className="relative w-full aspect-2/3">
            <Image
              src={posterUrl}
              alt={media.title || "Media"}
              fill
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="line-clamp-2 text-sm font-bold text-white">
              {media.title}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/watch/${media.mediaType || "movie"}/${media.id}`}>
      <div
        className={cn(
          "group relative overflow-hidden rounded-[2.5rem] border border-transparent bg-[#1A1A1D] shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(212,255,62,0.15)]",
          variant === "horizontal" ? "flex gap-4" : "w-full",
          isHovered && "border-[#D4FF3E]/30",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* Poster Image */}
        <div
          className={cn(
            "relative overflow-hidden",
            variant === "horizontal"
              ? "h-48 w-32 shrink-0"
              : "w-full aspect-2/3",
          )}
        >
          <Image
            src={posterUrl}
            alt={media.title || "Media"}
            fill
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />

          {/* Watch Progress Indicator */}
          {watched && progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/60">
              <div
                className="h-full bg-[#D4FF3E] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
          
          {/* Hover Actions - Floating */}
          {showActionButtons && (
            <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              {/* Play Button */}
              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4FF3E] text-black shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white">
                <Play className="h-5 w-5 fill-current" />
              </button>

              {/* Favorite Button */}
              <button
                onClick={handleFavoriteToggle}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-[#D4FF3E] hover:text-black hover:border-transparent"
              >
                <Heart className={cn("h-5 w-5", favorite && "fill-current")} />
              </button>
            </div>
          )}

          {/* Favorite Badge - Top Right */}
          {favorite && (
            <div className="absolute top-4 right-4 z-10">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4FF3E] text-black shadow-lg">
                <Heart className="h-4 w-4 fill-current" />
              </div>
            </div>
          )}

          {/* Media Type Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-md">
              {media.mediaType === "tv" ? "Series" : "Movie"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        {variant === "horizontal" ? (
          <div className="flex-1 py-3 pr-4 flex flex-col justify-between">
            <div>
              <h3 className="mb-1 line-clamp-2 text-base font-bold text-white">
                {media.title}
              </h3>
              <p className="line-clamp-2 text-xs font-medium text-[#8A8A8E]">
                {media.overview}
              </p>
            </div>
            <div className="flex items-center gap-3 border-t border-white/10 pt-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#D4FF3E]/10 px-2.5 py-1 text-xs font-bold text-[#D4FF3E]">
                ★ {formatRating(media.voteAverage)}
              </span>
              <span className="text-xs font-medium text-[#8A8A8E]">
                {media.releaseDate ? formatDate(media.releaseDate) : "N/A"}
              </span>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500 pointer-events-none">
            <h3 className="line-clamp-2 text-xl font-bold text-white mb-2 drop-shadow-lg">
              {media.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100 pb-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#D4FF3E]/20 px-2.5 py-0.5 text-xs font-bold text-[#D4FF3E] backdrop-blur-md border border-[#D4FF3E]/30">
                ★ {formatRating(media.voteAverage)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold text-white backdrop-blur-md">
                HD
              </span>
              {media.releaseDate && (
                <span className="text-xs font-medium text-[#8A8A8E] bg-black/60 px-2 py-0.5 rounded-full">
                   {media.releaseDate.substring(0, 4)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
