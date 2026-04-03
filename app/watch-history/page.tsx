"use client";

import { useWatchHistoryStore } from "@/stores/watch-history";
import { MediaCard } from "@/components/cards/media-card";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Clock, Trash2, Play } from "lucide-react";

export default function WatchHistoryPage() {
  const { getHistory, clearHistory } = useWatchHistoryStore();
  const history = getHistory();

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <PageHeader
          title="Watch History"
          subtitle={`${history.length} item${history.length !== 1 ? "s" : ""} in your recently watched timeline.`}
          icon={<Clock className="h-8 w-8" />}
          action={
            history.length > 0 ? (
              <button
                onClick={() => {
                  if (confirm("Clear all watch history?")) {
                    clearHistory();
                  }
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/20"
              >
                <Trash2 className="h-4 w-4" />
                Clear History
              </button>
            ) : null
          }
        />

        {/* Content */}
        {history.length === 0 ? (
          <EmptyState
            icon={<Play className="h-8 w-8" />}
            title="No watch history yet"
            description="Start a title and your personal playback timeline will appear here automatically."
            ctaHref="/movies"
            ctaLabel="Start Watching"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {history.map((media) => (
              <MediaCard key={`${media.mediaType}-${media.id}`} media={media} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
