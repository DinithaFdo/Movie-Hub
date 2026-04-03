/**
 * Watch History Store - Tracks watched movies/shows with timestamps
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MovieSummary } from "@/types/movie";
import { STORAGE_KEYS } from "@/constants/config";

interface WatchHistoryItem extends MovieSummary {
  watchedAt: number; // timestamp
  progress?: number; // percentage watched (0-100)
}

interface WatchHistoryStore {
  history: WatchHistoryItem[];
  addToHistory: (movie: MovieSummary, progress?: number) => void;
  updateProgress: (id: number, progress: number) => void;
  removeFromHistory: (id: number) => void;
  getHistory: (limit?: number) => WatchHistoryItem[];
  clearHistory: () => void;
  isWatched: (id: number) => boolean;
  getWatchProgress: (id: number) => number;
}

export const useWatchHistoryStore = create<WatchHistoryStore>()(
  persist(
    (set, get) => ({
      history: [],

      addToHistory: (movie: MovieSummary, progress = 0) =>
        set((state) => {
          const existing = state.history.findIndex((h) => h.id === movie.id);

          if (existing >= 0) {
            const updated = [...state.history];
            const existingItem = updated[existing];
            if (!existingItem) {
              return { history: state.history };
            }

            updated[existing] = {
              ...existingItem,
              watchedAt: Date.now(),
              progress,
            };
            // Move to top
            return {
              history: [
                updated[existing] as WatchHistoryItem,
                ...updated.filter((_, i) => i !== existing),
              ],
            };
          }

          return {
            history: [
              {
                ...movie,
                watchedAt: Date.now(),
                progress,
              },
              ...state.history,
            ].slice(0, 100), // Keep only last 100
          };
        }),

      updateProgress: (id: number, progress: number) =>
        set((state) => ({
          history: state.history.map((item) =>
            item.id === id
              ? { ...item, progress: Math.min(100, Math.max(0, progress)) }
              : item,
          ),
        })),

      removeFromHistory: (id: number) =>
        set((state) => ({
          history: state.history.filter((h) => h.id !== id),
        })),

      getHistory: (limit = 20) => {
        const history = get().history;
        return limit ? history.slice(0, limit) : history;
      },

      clearHistory: () => set({ history: [] }),

      isWatched: (id: number) => {
        return get().history.some((h) => h.id === id);
      },

      getWatchProgress: (id: number) => {
        const item = get().history.find((h) => h.id === id);
        return item?.progress || 0;
      },
    }),
    {
      name: STORAGE_KEYS.WATCH_HISTORY,
      version: 1,
    },
  ),
);
