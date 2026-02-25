"use client";

import { useFavorites } from "@/context/favorites-context";
import { Heart, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTMDBImageUrl } from "@/lib/tmdb";
import type { MediaDetail } from "@/types/movie";

export function WatchActions({ detail }: { detail: MediaDetail }) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const favorite = isFavorite(detail.id);

  const toggleFavorite = () => {
    if (favorite) {
      removeFromFavorites(detail.id);
    } else {
      addToFavorites(detail);
    }
  };

  const share = () => {
    const mediaLabel = detail.mediaType === "tv" ? "TV Series" : "Movie";
    const shareTitle = `Watch ${detail.title} (${mediaLabel}) on MovieHub`;
    const shareText =
      detail.overview?.slice(0, 140) || `Stream ${detail.title} on MovieHub.`;
    const posterUrl = detail.posterPath
      ? getTMDBImageUrl(detail.posterPath, "w500")
      : detail.backdropPath
        ? getTMDBImageUrl(detail.backdropPath, "w780")
        : "";

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: shareTitle,
          text: shareText,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      // Fallback copy to clipboard
      const payload = `${shareTitle}\n${shareText}\n${window.location.href}${
        posterUrl ? `\n${posterUrl}` : ""
      }`;
      navigator.clipboard.writeText(payload);
      alert("Share text copied to clipboard!");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleFavorite}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 transition-all hover:bg-[#ffa31a]/12 hover:border-[#ffa31a]/60 active:scale-95",
          favorite
            ? "text-red-500 border-red-500/20 bg-red-500/10"
            : "text-white",
        )}
      >
        <Heart size={18} fill={favorite ? "currentColor" : "none"} />
        <span className="text-sm font-medium">
          {favorite ? "Favorited" : "Add to List"}
        </span>
      </button>

      <button
        onClick={share}
        className="p-2 rounded-full border border-white/10 bg-white/5 text-gray-400 transition-colors hover:bg-[#ffa31a]/12 hover:text-[#ffd38a]"
        title="Share"
      >
        <Share2 size={18} />
      </button>
    </div>
  );
}
