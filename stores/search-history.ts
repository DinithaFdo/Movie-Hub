/**
 * Search History Store - Tracks search queries
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants/config";

interface SearchHistoryStore {
  searches: string[];
  addSearch: (query: string) => void;
  removeSearch: (query: string) => void;
  getSearchHistory: (limit?: number) => string[];
  clearHistory: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryStore>()(
  persist(
    (set, get) => ({
      searches: [],

      addSearch: (query: string) => {
        const trimmed = query.trim();
        if (trimmed.length < 2) return;

        set((state) => {
          // Remove if exists and add to top
          const filtered = state.searches.filter((s) => s !== trimmed);
          return {
            searches: [trimmed, ...filtered].slice(0, 20), // Keep only last 20
          };
        });
      },

      removeSearch: (query: string) =>
        set((state) => ({
          searches: state.searches.filter((s) => s !== query),
        })),

      getSearchHistory: (limit = 10) => {
        const searches = get().searches;
        return limit ? searches.slice(0, limit) : searches;
      },

      clearHistory: () => set({ searches: [] }),
    }),
    {
      name: STORAGE_KEYS.SEARCH_HISTORY,
      version: 1,
    },
  ),
);
