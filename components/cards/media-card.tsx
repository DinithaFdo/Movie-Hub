/**
 * Media Card Component - Modern, interactive, responsive
 * Displays movie/TV show with gradient overlay, rating, favorite state
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Play, Clock } from "lucide-react";
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

  const posterUrl = getTMDBImageUrl(media.posterPath, 342);

  if (variant === "small") {
    return (
      <Link href={`/watch/${media.mediaType}/${media.id}`}>
        <div className="group relative overflow-hidden rounded-2xl border border-(--border-default) bg-(--bg-elevated) shadow-elevation-2 transition-all duration-500 hover:-translate-y-1.5 hover:border-(--primary)/35 hover:shadow-elevation-4">
          <div className="relative w-full aspect-2/3">
            <Image
              src={posterUrl}
              alt={media.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 18%, rgba(255,194,71,0.25), transparent 42%)",
              }}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="line-clamp-2 text-xs font-bold text-white md:text-sm">
              {media.title}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/watch/${media.mediaType}/${media.id}`}>
      <div
        className={cn(
          "group relative overflow-hidden rounded-2xl border border-(--border-default) bg-(--bg-elevated) shadow-elevation-2 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-elevation-4",
          variant === "horizontal" ? "flex gap-4" : "",
          isHovered && "border-(--primary)/35",
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
            alt={media.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />

          {/* Watch Progress Indicator */}
          {watched && progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-(--border-default)">
              <div
                className="h-full bg-(--primary) transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              backgroundImage:
                "radial-gradient(circle at 78% 12%, rgba(255,194,71,0.3), transparent 48%)",
            }}
          />

          {/* Hover Actions - Floating */}
          {showActionButtons && (
            <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              {/* Play Button */}
              <Link
                href={`/watch/${media.mediaType}/${media.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-(--primary) text-black shadow-elevation-4 transition-all duration-300 hover:scale-110 hover:bg-(--primary-light)"
              >
                <Play className="h-5 w-5 fill-current" />
              </Link>

              {/* Favorite Button */}
              <button
                onClick={handleFavoriteToggle}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-(--border-default) bg-black/45 text-white shadow-elevation-4 backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-(--primary)/90 hover:text-black"
              >
                <Heart className={cn("h-5 w-5", favorite && "fill-current")} />
              </button>
            </div>
          )}

          {/* Favorite Badge - Top Right */}
          {favorite && (
            <div className="absolute top-2 right-2 z-10">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--primary) text-black shadow-elevation-3">
                <Heart className="h-4 w-4 fill-current" />
              </div>
            </div>
          )}

          {/* Watched Badge - Bottom Left Corner */}
          {watched && (
            <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 rounded-full border border-(--border-default) bg-black/50 px-2 py-1 backdrop-blur">
              <Clock className="h-3 w-3 text-(--text-secondary)" />
              <span className="text-xs font-semibold text-(--text-secondary)">
                {progress}%
              </span>
            </div>
          )}

          {/* Media Type Badge */}
          <div className="absolute top-2 left-2 z-10">
            <span className="rounded-full border border-(--border-default) bg-black/60 px-2 py-1 text-xs font-bold uppercase tracking-wide text-(--text-secondary) backdrop-blur">
              {media.mediaType === "tv" ? "Series" : "Movie"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        {variant === "horizontal" ? (
          <div className="flex-1 py-2 flex flex-col justify-between">
            <div>
              <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-(--text-primary)">
                {media.title}
              </h3>
              <p className="line-clamp-3 text-xs text-(--text-tertiary)">
                {media.overview}
              </p>
            </div>
            <div className="flex items-center gap-2 border-t border-(--border-default) pt-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-(--primary-glow) px-2 py-1 text-xs font-semibold text-(--primary)">
                ★ {formatRating(media.voteAverage)}
              </span>
              <span className="text-xs text-(--text-muted)">
                {media.releaseDate ? formatDate(media.releaseDate) : "N/A"}
              </span>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-0 left-0 right-0 translate-y-6 bg-linear-to-t from-black via-black/70 to-transparent p-4 transition-transform duration-500 group-hover:translate-y-0">
            <div className="space-y-2">
              <h3 className="line-clamp-2 text-base font-black text-(--text-primary)">
                {media.title}
              </h3>
              <p className="line-clamp-2 text-xs text-(--text-secondary)">
                {media.overview}
              </p>
              <div className="flex items-center justify-between pt-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-(--primary-glow) px-2 py-1 text-xs font-semibold text-(--primary)">
                  ★ {formatRating(media.voteAverage)}
                </span>
                <span className="text-xs text-(--text-muted)">
                  {media.releaseDate ? formatDate(media.releaseDate) : "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
