/**
 * Favorites Store - Manages favorite movies/shows with localStorage persistence
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MovieSummary } from "@/types/movie";
import { STORAGE_KEYS } from "@/constants/config";

interface FavoritesStore {
  favorites: MovieSummary[];
  addToFavorites: (movie: MovieSummary) => void;
  removeFromFavorites: (id: number) => void;
  isFavorite: (id: number) => boolean;
  getFavorites: () => MovieSummary[];
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addToFavorites: (movie: MovieSummary) =>
        set((state) => ({
          favorites: state.favorites.some((f) => f.id === movie.id)
            ? state.favorites
            : [...state.favorites, movie],
        })),

      removeFromFavorites: (id: number) =>
        set((state) => ({
          favorites: state.favorites.filter((m) => m.id !== id),
        })),

      isFavorite: (id: number) => {
        return get().favorites.some((m) => m.id === id);
      },

      getFavorites: () => get().favorites,

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: STORAGE_KEYS.FAVORITES,
      version: 1,
    },
  ),
);
