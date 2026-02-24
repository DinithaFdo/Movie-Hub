"use client";

import { useFavorites } from "@/context/favorites-context";
import { Heart, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: detail.title,
          // text: detail.overview,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      // Fallback copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleFavorite}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 transition-all hover:bg-white/10 hover:border-[#00f3ff]/50 active:scale-95",
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
        className="p-2 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        title="Share"
      >
        <Share2 size={18} />
      </button>
    </div>
  );
}
