/**
 * Collections Store - User-created watchlists/collections
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MovieSummary } from "@/types/movie";
import { STORAGE_KEYS } from "@/constants/config";

export interface Collection {
  id: string;
  name: string;
  description: string;
  items: MovieSummary[];
  createdAt: number;
  updatedAt: number;
  isPublic: boolean;
}

interface CollectionsStore {
  collections: Collection[];
  createCollection: (name: string, description?: string) => Collection;
  deleteCollection: (id: string) => void;
  addToCollection: (collectionId: string, movie: MovieSummary) => void;
  removeFromCollection: (collectionId: string, movieId: number) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  getCollections: () => Collection[];
  getCollection: (id: string) => Collection | undefined;
}

export const useCollectionsStore = create<CollectionsStore>()(
  persist(
    (set, get) => ({
      collections: [],

      createCollection: (name: string, description = "") => {
        const collection: Collection = {
          id: `col-${Date.now()}`,
          name,
          description,
          items: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          isPublic: false,
        };

        set((state) => ({
          collections: [...state.collections, collection],
        }));

        return collection;
      },

      deleteCollection: (id: string) =>
        set((state) => ({
          collections: state.collections.filter((col) => col.id !== id),
        })),

      addToCollection: (collectionId: string, movie: MovieSummary) =>
        set((state) => ({
          collections: state.collections.map((col) =>
            col.id === collectionId
              ? {
                  ...col,
                  items: col.items.some((m) => m.id === movie.id)
                    ? col.items
                    : [...col.items, movie],
                  updatedAt: Date.now(),
                }
              : col,
          ),
        })),

      removeFromCollection: (collectionId: string, movieId: number) =>
        set((state) => ({
          collections: state.collections.map((col) =>
            col.id === collectionId
              ? {
                  ...col,
                  items: col.items.filter((m) => m.id !== movieId),
                  updatedAt: Date.now(),
                }
              : col,
          ),
        })),

      updateCollection: (id: string, updates: Partial<Collection>) =>
        set((state) => ({
          collections: state.collections.map((col) =>
            col.id === id
              ? {
                  ...col,
                  ...updates,
                  updatedAt: Date.now(),
                }
              : col,
          ),
        })),

      getCollections: () => get().collections,

      getCollection: (id: string) => {
        return get().collections.find((col) => col.id === id);
      },
    }),
    {
      name: STORAGE_KEYS.COLLECTIONS,
      version: 1,
    },
  ),
);
