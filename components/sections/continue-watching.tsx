"use client";

import { useWatchHistoryStore } from "@/stores/watch-history";
import { MediaCard } from "@/components/cards/media-card";
import { History } from "lucide-react";
import { useEffect, useState } from "react";

export function ContinueWatching() {
  const [mounted, setMounted] = useState(false);
  const { history } = useWatchHistoryStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || history.length === 0) return null;

  return (
    <section className="relative z-20 py-8 px-4 md:px-12 mx-auto max-w-[1800px]">
      <div className="flex items-center gap-3 mb-8">
        <History className="h-6 w-6 text-[#D4FF3E]" />
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Continue Watching
        </h2>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
        {history.slice(0, 10).map((media) => (
          <div key={`cw-${media.id}`} className="min-w-[200px] md:min-w-[250px] shrink-0 snap-start">
            <MediaCard media={media} variant="default" showActionButtons={false} />
          </div>
        ))}
      </div>
    </section>
  );
}
