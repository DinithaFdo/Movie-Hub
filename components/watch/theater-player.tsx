"use client";

import { useUIStore } from "@/stores/ui";
import { Lightbulb, LightbulbOff } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/utils/helpers";
import { usePreferencesStore } from "@/stores/preferences";
import { playModernUiSound } from "@/utils/sound-effects";

export function TheaterPlayer({
  streamUrl,
  title,
}: {
  streamUrl: string;
  title: string;
}) {
  const { isTheaterMode, setTheaterMode } = useUIStore();
  const { preferences } = usePreferencesStore();

  useEffect(() => {
    return () => setTheaterMode(false); // Reset when leaving page
  }, [setTheaterMode]);

  return (
    <div
      className={cn(
        "relative mx-auto w-full transition-all duration-700 ease-in-out",
        isTheaterMode
          ? "max-w-[1800px] aspect-[21/9] z-[60]"
          : "max-w-[1400px] aspect-video z-10",
      )}
    >
      {/* Lights out overlay */}
      {isTheaterMode && (
        <div className="fixed inset-0 bg-[#000000] z-[-1] pointer-events-none opacity-95 transition-opacity" />
      )}

      <div className="group relative w-full h-full overflow-hidden rounded-[2.5rem] md:rounded-[4rem] border border-white/5 bg-black shadow-[0_40px_100px_-20px_rgba(212,255,62,0.15)] ring-[2px] ring-white/5 transition-all duration-700">
        <iframe
          src={streamUrl}
          title={`MovieHub Player - ${title}`}
          className="absolute inset-0 h-full w-full bg-black z-10"
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
        />

        {/* Theater Toggle Button */}
        <button
          type="button"
          onClick={() => {
            if (preferences.enableClickSounds) {
              void playModernUiSound("toggle");
            }
            setTheaterMode(!isTheaterMode);
          }}
          aria-pressed={isTheaterMode}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-2 md:px-4 border border-white/10 rounded-full text-white hover:text-[#D4FF3E] hover:border-[#D4FF3E]/50 transition-all duration-300 shadow-xl opacity-100 translate-y-0 md:opacity-0 md:translate-y-[-10px] md:group-hover:opacity-100 md:group-hover:translate-y-0 hover:scale-105"
        >
          {isTheaterMode ? (
            <>
              <Lightbulb size={18} className="text-[#D4FF3E]" />
              <span className="text-sm font-bold">Lights On</span>
            </>
          ) : (
            <>
              <LightbulbOff size={18} />
              <span className="text-sm font-bold">Lights Out</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
