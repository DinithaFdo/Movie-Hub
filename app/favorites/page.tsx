"use client"; 

import { useState } from "react";
import { useFavoritesStore } from "@/stores/favorites";
import { useCollectionsStore } from "@/stores/collections";
import { MediaCard } from "@/components/cards/media-card";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Heart, Library, Plus } from "lucide-react";

export default function FavoritesPage() {
  const { favorites } = useFavoritesStore();
  const { collections } = useCollectionsStore();
  const [activeTab, setActiveTab] = useState<"favorites" | "collections">("favorites");

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <PageHeader
          title="My Library"
          subtitle={activeTab === "favorites" ? `${favorites.length} saved items.` : `${collections.length} custom collections.`}
          icon={<Library className="h-8 w-8" />}
        />

        {/* Tab Toggle */}
        <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-4">
          <button 
            onClick={() => setActiveTab("favorites")}
            className={`text-lg font-bold transition-colors ${activeTab === 'favorites' ? 'text-[#D4FF3E]' : 'text-white/50 hover:text-white'}`}
          >
            Watchlist
          </button>
          <button 
            onClick={() => setActiveTab("collections")}
             className={`text-lg font-bold transition-colors ${activeTab === 'collections' ? 'text-[#D4FF3E]' : 'text-white/50 hover:text-white'}`}
          >
            Collections
          </button>
        </div>

        {/* Content */}
        {activeTab === "favorites" && (
          favorites.length === 0 ? (
            <EmptyState
              icon={<Heart className="h-8 w-8" />}
              title="No favorites yet"
              description="Save titles you love and build your own personal cinema shelf."
              ctaHref="/movies"
              ctaLabel="Explore Movies"
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
              {favorites.map((media) => (
                <MediaCard key={`${media.mediaType}-${media.id}`} media={media} />
              ))}
            </div>
          )
        )}

        {/* Collections View */}
        {activeTab === "collections" && (
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-black">My Collections</h2>
               <button className="flex items-center gap-2 bg-[#D4FF3E] text-black px-4 py-2 rounded-full font-bold text-sm shadow-md hover:scale-105 transition-transform">
                  <Plus size={16} /> New Collection
               </button>
            </div>
            
            {collections.length === 0 ? (
              <EmptyState
                icon={<Library className="h-8 w-8" />}
                title="No collections yet"
                description="Easily organize your movies and series into custom folders."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {collections.map(col => (
                    <div key={col.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-white/20 transition-all cursor-pointer group">
                       <h3 className="text-xl font-bold mb-2 group-hover:text-[#D4FF3E] transition-colors">{col.name}</h3>
                       <p className="text-sm font-medium text-[#8A8A8E] mb-4">{col.description || 'No description'}</p>
                       <p className="text-sm font-bold bg-black/40 inline-flex px-3 py-1 rounded-full text-white/80">{col.items.length} Items</p>
                    </div>
                 ))}
              </div>
            )}
          </div>
        )}
      </div>
    </PageShell>
  );
}
