"use client";

import { useTheme } from "@/components/theme/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg text-(--text-primary) backdrop-blur transition hover:scale-105 hover:border-(--brand) hover:bg-white/20"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <span className="theme-icon">{theme === "dark" ? "☀" : "☾"}</span>
    </button>
  );
}
