"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

interface EnhancedThemeProviderProps {
  children: ReactNode;
}

export function EnhancedThemeProvider({
  children,
}: EnhancedThemeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      storageKey="moviehub:theme"
      disableTransitionOnChange={false}
      enableColorScheme={true}
      themes={["light", "dark"]}
    >
      {children}
    </ThemeProvider>
  );
}
