"use client";

import { useFavoritesStore } from "@/stores/favorites";
import { MediaCard } from "@/components/cards/media-card";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const { favorites } = useFavoritesStore();

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <PageHeader
          title="My Favorites"
          subtitle={`${favorites.length} item${favorites.length !== 1 ? "s" : ""} saved across movies and series.`}
          icon={<Heart className="h-8 w-8" />}
        />

        {/* Content */}
        {favorites.length === 0 ? (
          <EmptyState
            icon={<Heart className="h-8 w-8" />}
            title="No favorites yet"
            description="Save titles you love and build your own personal cinema shelf."
            ctaHref="/movies"
            ctaLabel="Explore Movies"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((media) => (
              <MediaCard key={`${media.mediaType}-${media.id}`} media={media} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
