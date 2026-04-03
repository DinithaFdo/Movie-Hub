"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface PreloaderContextType {
  hasLoaded: boolean;
  setHasLoaded: (value: boolean) => void;
}

const PreloaderContext = createContext<PreloaderContextType>({
  hasLoaded: false,
  setHasLoaded: () => {},
});

export const usePreloader = () => useContext(PreloaderContext);

export function PreloaderProvider({ children }: { children: ReactNode }) {
  const [hasLoaded, setHasLoaded] = useState(false);

  // Fallback to ensure app doesn't hang forever in edge cases
  useEffect(() => {
    const timer = setTimeout(() => setHasLoaded(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PreloaderContext.Provider value={{ hasLoaded, setHasLoaded }}>
      {children}
    </PreloaderContext.Provider>
  );
}
