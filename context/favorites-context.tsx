"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import type { MovieSummary } from "@/types/movie";
import { useFavoritesStore } from "@/stores/favorites";

interface FavoritesContextType {
  favorites: MovieSummary[];
  addToFavorites: (movie: MovieSummary) => void;
  removeFromFavorites: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

const LEGACY_FAVORITES_KEY = "moviehub-favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const favorites = useFavoritesStore((state) => state.favorites);
  const addToFavorites = useFavoritesStore((state) => state.addToFavorites);
  const removeFromFavorites = useFavoritesStore(
    (state) => state.removeFromFavorites,
  );
  const isFavorite = useFavoritesStore((state) => state.isFavorite);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem(LEGACY_FAVORITES_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as MovieSummary[];
      if (Array.isArray(parsed)) {
        parsed.forEach((item) => addToFavorites(item));
      }
      localStorage.removeItem(LEGACY_FAVORITES_KEY);
    } catch (e) {
      console.error("Failed to migrate legacy favorites", e);
    }
  }, [addToFavorites]);

  const value = useMemo(
    () => ({ favorites, addToFavorites, removeFromFavorites, isFavorite }),
    [favorites, addToFavorites, removeFromFavorites, isFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
