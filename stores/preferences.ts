/**
 * Preferences Store - User preferences (theme, layout, etc.)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants/config";

interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  quality: "auto" | "480p" | "720p" | "1080p";
  enableNotifications: boolean;
  enableAnalytics: boolean;
  itemsPerPage: number;
  enableAutoplay: boolean;
}

interface PreferencesStore {
  preferences: UserPreferences;
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K],
  ) => void;
  getPreference: <K extends keyof UserPreferences>(
    key: K,
  ) => UserPreferences[K];
  resetPreferences: () => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "dark",
  language: "en",
  quality: "auto",
  enableNotifications: true,
  enableAnalytics: true,
  itemsPerPage: 20,
  enableAutoplay: true,
};

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set, get) => ({
      preferences: DEFAULT_PREFERENCES,

      updatePreference: (key, value) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            [key]: value,
          },
        })),

      getPreference: (key) => {
        return get().preferences[key];
      },

      resetPreferences: () => set({ preferences: DEFAULT_PREFERENCES }),
    }),
    {
      name: STORAGE_KEYS.USER_PREFERENCES,
      version: 1,
    },
  ),
);
