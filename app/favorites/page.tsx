"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { useFavoritesStore } from "@/stores/favorites";
import { useCollectionsStore } from "@/stores/collections";
import { MediaCard } from "@/components/cards/media-card";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import {
  FolderPlus,
  Heart,
  Library,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

export default function FavoritesPage() {
  const { favorites } = useFavoritesStore();
  const {
    collections,
    createCollection,
    deleteCollection,
    addToCollection,
    removeFromCollection,
  } = useCollectionsStore();
  const [activeTab, setActiveTab] = useState<"favorites" | "collections">(
    "favorites",
  );
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
  const [isAddFavoriteOpen, setIsAddFavoriteOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");

  const handleCreateCollection = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = collectionName.trim();
    if (!trimmedName) return;

    createCollection(trimmedName, collectionDescription.trim());
    setCollectionName("");
    setCollectionDescription("");
    setIsCreateCollectionOpen(false);
  };

  const selectedCollection = selectedCollectionId
    ? collections.find((collection) => collection.id === selectedCollectionId)
    : undefined;

  const openAddFavoritesDialog = (collectionId: string) => {
    setSelectedCollectionId(collectionId);
    setIsAddFavoriteOpen(true);
  };

  const handleAddFavoriteToCollection = (mediaId: number) => {
    if (!selectedCollectionId) return;
    const media = favorites.find((favorite) => favorite.id === mediaId);
    if (!media) return;
    addToCollection(selectedCollectionId, media);
  };

  const isInSelectedCollection = (mediaId: number) => {
    if (!selectedCollection) return false;
    return selectedCollection.items.some((item) => item.id === mediaId);
  };

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <PageHeader
          title="My Library"
          subtitle={
            activeTab === "favorites"
              ? `${favorites.length} saved items.`
              : `${collections.length} custom collections.`
          }
          icon={<Library className="h-8 w-8" />}
        />

        {/* Tab Toggle */}
        <div className="mb-12 flex items-center gap-4 border-b border-white/10 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("favorites")}
            className={`text-lg font-bold transition-colors ${activeTab === "favorites" ? "text-[#D4FF3E]" : "text-white/50 hover:text-white"}`}
          >
            Watchlist
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("collections")}
            className={`text-lg font-bold transition-colors ${activeTab === "collections" ? "text-[#D4FF3E]" : "text-white/50 hover:text-white"}`}
          >
            Collections
          </button>
        </div>

        {/* Content */}
        {activeTab === "favorites" &&
          (favorites.length === 0 ? (
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
                <MediaCard
                  key={`${media.mediaType}-${media.id}`}
                  media={media}
                />
              ))}
            </div>
          ))}

        {/* Collections View */}
        {activeTab === "collections" && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-black">My Collections</h2>
              <button
                type="button"
                onClick={() => setIsCreateCollectionOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D4FF3E] px-4 py-2 text-sm font-bold text-black shadow-md transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(212,255,62,0.35)]"
              >
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
                {collections.map((collection) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    whileHover={{ y: -4 }}
                    className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-[#D4FF3E]/35 hover:shadow-[0_12px_36px_-18px_rgba(212,255,62,0.4)]"
                  >
                    <div className="pointer-events-none absolute right-[-40px] top-[-40px] h-28 w-28 rounded-full bg-[#D4FF3E]/10 blur-2xl" />
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-xl font-bold transition-colors hover:text-[#D4FF3E]">
                          {collection.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm font-medium text-[#8A8A8E]">
                          {collection.description || "No description"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openAddFavoritesDialog(collection.id)}
                          className="rounded-full border border-[#D4FF3E]/30 bg-[#D4FF3E]/15 p-2 text-[#D4FF3E] transition-colors hover:bg-[#D4FF3E] hover:text-black"
                          aria-label={`Add favorites to ${collection.name}`}
                          title="Add favorites"
                        >
                          <FolderPlus size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteCollection(collection.id)}
                          className="rounded-full border border-white/10 bg-black/40 p-2 text-[#8A8A8E] transition-colors hover:border-red-400/30 hover:text-red-300"
                          aria-label={`Delete ${collection.name}`}
                          title="Delete collection"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <p className="mb-4 inline-flex rounded-full bg-black/40 px-3 py-1 text-xs font-bold text-white/80">
                      {collection.items.length}{" "}
                      {collection.items.length === 1 ? "Item" : "Items"}
                    </p>

                    {collection.items.length === 0 ? (
                      <p className="rounded-2xl border border-dashed border-white/10 px-3 py-4 text-center text-xs text-[#8A8A8E]">
                        No titles added yet.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {collection.items.slice(0, 4).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-2 rounded-xl bg-black/30 px-3 py-2"
                          >
                            <p className="truncate text-xs font-semibold text-white">
                              {item.title}
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                removeFromCollection(collection.id, item.id)
                              }
                              className="rounded-md p-1 text-[#8A8A8E] transition-colors hover:bg-white/10 hover:text-white"
                              aria-label={`Remove ${item.title} from ${collection.name}`}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        {collection.items.length > 4 ? (
                          <p className="pt-1 text-xs font-medium text-[#8A8A8E]">
                            +{collection.items.length - 4} more
                          </p>
                        ) : null}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog.Root
        open={isCreateCollectionOpen}
        onOpenChange={setIsCreateCollectionOpen}
      >
        <Dialog.Portal forceMount>
          <AnimatePresence>
            {isCreateCollectionOpen && (
              <>
                <Dialog.Overlay asChild>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm"
                  />
                </Dialog.Overlay>
                <Dialog.Content asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.96 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed left-1/2 top-1/2 z-[100] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-[#1A1A1D] p-5 shadow-2xl md:p-7"
                  >
                    <div className="mb-5 flex items-start justify-between gap-3">
                      <div>
                        <Dialog.Title className="text-xl font-black text-white md:text-2xl">
                          Create Collection
                        </Dialog.Title>
                        <Dialog.Description className="mt-1 text-sm text-[#8A8A8E]">
                          Create folders to organize favorites for later.
                        </Dialog.Description>
                      </div>
                      <Dialog.Close
                        type="button"
                        className="rounded-full border border-white/10 bg-white/5 p-2 text-[#8A8A8E] transition-colors hover:text-white"
                        aria-label="Close create collection dialog"
                      >
                        <X size={16} />
                      </Dialog.Close>
                    </div>

                    <form
                      onSubmit={handleCreateCollection}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="collection-name"
                          className="text-xs font-bold uppercase tracking-wide text-[#8A8A8E]"
                        >
                          Name
                        </label>
                        <input
                          id="collection-name"
                          value={collectionName}
                          onChange={(event) =>
                            setCollectionName(event.target.value)
                          }
                          placeholder="Weekend thrillers"
                          className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-[#8A8A8E] focus:border-[#D4FF3E]/70"
                          maxLength={50}
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="collection-description"
                          className="text-xs font-bold uppercase tracking-wide text-[#8A8A8E]"
                        >
                          Description
                        </label>
                        <textarea
                          id="collection-description"
                          value={collectionDescription}
                          onChange={(event) =>
                            setCollectionDescription(event.target.value)
                          }
                          placeholder="A curated list for my late-night watch sessions."
                          className="min-h-24 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-[#8A8A8E] focus:border-[#D4FF3E]/70"
                          maxLength={160}
                        />
                      </div>

                      <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Dialog.Close
                          type="button"
                          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10"
                        >
                          Cancel
                        </Dialog.Close>
                        <button
                          type="submit"
                          disabled={!collectionName.trim()}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4FF3E] px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-[#e0ff68] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Plus size={14} /> Create
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </Dialog.Content>
              </>
            )}
          </AnimatePresence>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root
        open={isAddFavoriteOpen}
        onOpenChange={(open) => {
          setIsAddFavoriteOpen(open);
          if (!open) setSelectedCollectionId(null);
        }}
      >
        <Dialog.Portal forceMount>
          <AnimatePresence>
            {isAddFavoriteOpen && selectedCollection ? (
              <>
                <Dialog.Overlay asChild>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm"
                  />
                </Dialog.Overlay>
                <Dialog.Content asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 24, scale: 0.96 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed left-1/2 top-1/2 z-[100] flex max-h-[85vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-3xl border border-white/10 bg-[#121216] p-4 shadow-2xl md:p-6"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                      <div>
                        <Dialog.Title className="text-lg font-black text-white md:text-2xl">
                          Add favorites to {selectedCollection.name}
                        </Dialog.Title>
                        <Dialog.Description className="mt-1 flex items-center gap-2 text-xs text-[#8A8A8E] md:text-sm">
                          <Sparkles size={14} className="text-[#D4FF3E]" />
                          Pick titles from your watchlist and drop them into
                          this folder.
                        </Dialog.Description>
                      </div>
                      <Dialog.Close
                        type="button"
                        className="rounded-full border border-white/10 bg-white/5 p-2 text-[#8A8A8E] transition-colors hover:text-white"
                        aria-label="Close add favorites dialog"
                      >
                        <X size={16} />
                      </Dialog.Close>
                    </div>

                    <div className="overflow-y-auto pr-1">
                      {favorites.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-white/15 px-4 py-10 text-center text-sm text-[#8A8A8E]">
                          No favorites available yet. Add movies to your
                          watchlist first.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {favorites.map((media) => {
                            const alreadyInCollection = isInSelectedCollection(
                              media.id,
                            );
                            return (
                              <motion.div
                                key={media.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/35 p-3"
                              >
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-white">
                                    {media.title}
                                  </p>
                                  <p className="text-xs text-[#8A8A8E]">
                                    {media.mediaType === "tv"
                                      ? "Series"
                                      : "Movie"}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleAddFavoriteToCollection(media.id)
                                  }
                                  disabled={alreadyInCollection}
                                  className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#D4FF3E] px-3 py-1.5 text-xs font-bold text-black transition-colors hover:bg-[#e0ff68] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
                                >
                                  {alreadyInCollection ? "Added" : "Add +"}
                                </button>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </Dialog.Content>
              </>
            ) : null}
          </AnimatePresence>
        </Dialog.Portal>
      </Dialog.Root>
    </PageShell>
  );
}
