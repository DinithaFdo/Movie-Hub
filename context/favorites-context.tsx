"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { MovieSummary } from "@/types/movie";

interface FavoritesContextType {
  favorites: MovieSummary[];
  addToFavorites: (movie: MovieSummary) => void;
  removeFromFavorites: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<MovieSummary[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("moviehub-favorites");
    if (!saved) return [];
    try {
      return JSON.parse(saved) as MovieSummary[];
    } catch (e) {
      console.error("Failed to parse favorites", e);
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("moviehub-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (movie: MovieSummary) => {
    if (!favorites.some((f) => f.id === movie.id)) {
      setFavorites((prev) => [...prev, movie]);
    }
  };

  const removeFromFavorites = (id: number) => {
    setFavorites((prev) => prev.filter((movie) => movie.id !== id));
  };

  const isFavorite = (id: number) => {
    return favorites.some((movie) => movie.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
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
