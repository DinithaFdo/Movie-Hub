/**
 * Premium Awwwards-style Navbar - Scroll-aware, minimal, refined interactions
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Heart, History, Menu, X, Film } from "lucide-react";
import { useFavoritesStore } from "@/stores/favorites";
import { cn } from "@/utils/helpers";
import { useClickOutside, useMounted } from "@/hooks";
import { LiveSearch } from "@/components/search/live-search";

export function EnhancedAppNavbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const isMounted = useMounted();
  const { favorites } = useFavoritesStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useClickOutside(menuRef, () => setIsMenuOpen(false));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActiveRoute = (route: string) => pathname === route;

  return (
    <>
      {/* Navbar */}
      <nav
        ref={navRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "h-14 border-b border-(--border-default)/60 bg-(--bg-base)/85 backdrop-blur-2xl shadow-lg"
            : "h-16 md:h-20 border-b border-(--border-default)/30 bg-(--bg-base)/50 backdrop-blur-xl",
        )}
      >
        <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center w-full">
          <div className="flex items-center justify-between h-full w-full">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2 md:gap-3 shrink-0"
            >
              <div
                className={cn(
                  "relative flex items-center justify-center rounded-lg border border-(--border-default) bg-(--bg-elevated) transition-all duration-500",
                  isScrolled ? "h-9 w-9" : "h-10 w-10 md:h-11 md:w-11",
                  "group-hover:border-(--primary)/50 group-hover:shadow-lg",
                )}
              >
                <Film
                  className={cn(
                    "text-(--primary) transition-all",
                    isScrolled ? "h-4.5 w-4.5" : "h-5 w-5",
                  )}
                />
              </div>
              <span
                className={cn(
                  "font-extrabold tracking-tight text-(--text-primary) transition-all duration-500 hidden sm:inline",
                  isScrolled ? "text-lg" : "text-xl md:text-2xl",
                )}
              >
                Movie<span className="text-(--primary)">Hub</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 ml-12 flex-1">
              <NavLink href="/" label="Home" active={isActiveRoute("/")} />
              <NavLink
                href="/movies"
                label="Movies"
                active={isActiveRoute("/movies")}
              />
              <NavLink
                href="/tv"
                label="TV Shows"
                active={isActiveRoute("/tv")}
              />
            </div>

            {/* Right Side Actions */}
            <div
              className={cn(
                "flex items-center transition-all duration-300 ml-auto",
                isScrolled ? "gap-1.5" : "gap-2 md:gap-4",
              )}
            >
              {/* Search Bar - Desktop */}
              <div className="hidden lg:block">
                <LiveSearch className="w-56 transition-all" />
              </div>

              {/* Favorites Badge */}
              <Link
                href="/favorites"
                className={cn(
                  "relative group rounded-lg border border-transparent p-2 transition-all duration-300",
                  isActiveRoute("/favorites")
                    ? "bg-(--primary)/12 border-(--primary)/35 text-(--primary)"
                    : "hover:bg-(--bg-slight)",
                )}
                title="Favorites"
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                    isActiveRoute("/favorites") && "text-(--primary)",
                  )}
                />
                {favorites.length > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-(--primary) text-xs font-bold text-black">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {/* Watch History */}
              <Link
                href="/watch-history"
                className={cn(
                  "group rounded-lg border border-transparent p-2 transition-all duration-300",
                  isActiveRoute("/watch-history")
                    ? "bg-(--primary)/12 border-(--primary)/35 text-(--primary)"
                    : "hover:bg-(--bg-slight)",
                )}
                title="Watch History"
              >
                <History
                  className={cn(
                    "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                    isActiveRoute("/watch-history") && "text-(--primary)",
                  )}
                />
              </Link>

              {/* Theme Toggle */}
              {isMounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="group rounded-lg border border-transparent p-2 transition-all duration-300 hover:bg-(--bg-slight)"
                  title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5 text-(--primary) transition-transform duration-300 group-hover:rotate-45" />
                  ) : (
                    <Moon className="h-5 w-5 text-(--primary) transition-transform duration-300 group-hover:rotate-45" />
                  )}
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden rounded-lg border border-transparent p-2 transition-all duration-300 hover:bg-(--bg-slight)"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute top-full left-0 right-0 border-t border-(--border-default)/50 bg-(--bg-base)/95 backdrop-blur-2xl md:hidden animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              <div className="mb-4">
                <LiveSearch className="" />
              </div>
              <MobileNavLink
                href="/"
                label="Home"
                active={isActiveRoute("/")}
              />
              <MobileNavLink
                href="/movies"
                label="Movies"
                active={isActiveRoute("/movies")}
              />
              <MobileNavLink
                href="/tv"
                label="TV Shows"
                active={isActiveRoute("/tv")}
              />
              <div className="border-t border-(--border-default)/30 pt-2 mt-2">
                <MobileNavLink
                  href="/favorites"
                  label="Favorites"
                  active={isActiveRoute("/favorites")}
                />
                <MobileNavLink
                  href="/watch-history"
                  label="Watch History"
                  active={isActiveRoute("/watch-history")}
                />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content overlap */}
      <div
        className={cn(
          "transition-all duration-500",
          isScrolled ? "h-14" : "h-16 md:h-20",
        )}
      />
    </>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center text-sm font-semibold transition-colors duration-300",
        active
          ? "text-(--primary)"
          : "text-(--text-secondary) hover:text-(--text-primary)",
      )}
    >
      {label}
      {active && (
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-(--primary) rounded-full scale-x-100 origin-left transition-transform duration-300" />
      )}
      {!active && (
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-(--primary) rounded-full scale-x-0 origin-left transition-transform duration-300 hover:scale-x-100" />
      )}
    </Link>
  );
}

function MobileNavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "block px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-300",
        active
          ? "bg-(--primary)/15 text-(--primary) border-l-2 border-(--primary)"
          : "text-(--text-secondary) hover:bg-(--bg-slight) hover:text-(--text-primary)",
      )}
    >
      {label}
    </Link>
  );
}
