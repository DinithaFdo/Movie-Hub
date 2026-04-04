"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { usePreferencesStore } from "@/stores/preferences";
import { playModernUiSound } from "@/utils/sound-effects";
import type { MediaType } from "@/types/movie";

export function TrailerAutoplay({ id, type }: { id: number; type: MediaType }) {
  const { preferences } = usePreferencesStore();
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(!preferences.enableClickSounds);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (preferences.enableAutoplay) {
      // Delay fetching and showing by 2 seconds so it doesn't interrupt navigation
      timeout = setTimeout(async () => {
        try {
          const res = await fetch(`/api/trailer?id=${id}&type=${type}`);
          const data = await res.json();
          if (data.key) {
            setVideoKey(data.key);
            setShowVideo(true);
          }
        } catch (error) {
          console.error("Failed to fetch trailer", error);
        }
      }, 2000);
    }

    return () => {
      clearTimeout(timeout);
      setShowVideo(false);
      setVideoKey(null);
    };
  }, [id, type, preferences.enableAutoplay]);

  useEffect(() => {
    setIsMuted(!preferences.enableClickSounds);
  }, [preferences.enableClickSounds, videoKey]);

  if (!showVideo || !videoKey || !preferences.enableAutoplay) return null;

  return (
    <div className="absolute inset-x-0 bottom-0 top-0 z-30 overflow-hidden pointer-events-none rounded-[inherit]">
      <div className="absolute inset-0 bg-black" />
      <iframe
        key={`${videoKey}-${isMuted ? "muted" : "unmuted"}`}
        className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 pointer-events-none object-cover opacity-80"
        src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${videoKey}&playsinline=1`}
        allow="autoplay; encrypted-media"
      />

      {/* Unmute Button Overlay */}
      <button
        type="button"
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        onClick={async (e) => {
          e.stopPropagation();
          e.preventDefault();
          if (preferences.enableClickSounds) {
            void playModernUiSound("toggle");
          }
          setIsMuted(!isMuted);
        }}
        className="absolute top-4 right-4 z-50 pointer-events-auto w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:text-[#D4FF3E] hover:scale-105 transition-all shadow-xl backdrop-blur-md"
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      {/* Heavy gradient to ensure text remains perfectly completely readable */}
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#0D0D0F] via-[#0D0D0F]/80 to-transparent" />
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
    </div>
  );
}
