import { create } from "zustand";

interface UIStore {
  isTheaterMode: boolean;
  setTheaterMode: (value: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isTheaterMode: false,
  setTheaterMode: (value) => set({ isTheaterMode: value }),
}));
