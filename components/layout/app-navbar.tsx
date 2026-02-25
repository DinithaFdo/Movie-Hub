"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clapperboard, Film, Menu, Home, Star, Search, Tv } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LiveSearch } from "@/components/search/live-search";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const desktopNavItems = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Shows" },
  { href: "/favorites", label: "Watchlist" },
];

const mobileNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/movies", label: "Movies", icon: Film },
  { href: "/tv", label: "Series", icon: Tv },
  { href: "/favorites", label: "My List", icon: Star },
];

export function AppNavbar() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pb-2 pt-3 sm:px-6 lg:px-8">
        <div className="glass-panel flex h-16 items-center justify-between rounded-2xl px-4 sm:px-5">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ffa31a] text-black shadow-[0_0_18px_rgba(255,163,26,0.25)]">
                <Clapperboard size={16} />
              </div>
              <span className="text-lg font-bold tracking-wide text-white">
                MOVIE<span className="text-[#ffa31a]">HUB</span>
              </span>
            </Link>

            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="gap-0">
                {desktopNavItems.map((item) => (
                  <NavigationMenuItem key={item.label}>
                    <Link
                      href={item.href}
                      className={cn(
                        navigationMenuTriggerStyle,
                        pathname === item.href
                          ? "text-[#ffa31a]"
                          : "text-white/90 hover:text-[#ffc766]",
                      )}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden w-full max-w-sm md:block">
            <LiveSearch />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open Search"
              onClick={() => setMobileSearchOpen((prev) => !prev)}
              className="text-white hover:text-[#ffa31a]"
            >
              <Search size={18} />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open Menu"
                  className="text-white hover:text-[#ffa31a]"
                >
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="rounded-t-3xl bg-[#111111]/95 backdrop-blur-xl"
              >
                <SheetHeader>
                  <SheetTitle className="text-[#ffa31a]">Navigate</SheetTitle>
                </SheetHeader>
                <nav className="mt-3 grid gap-3">
                  {mobileNavItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-4 py-4 text-base font-semibold",
                        pathname === item.href
                          ? "border-[#ffa31a] bg-[#ffa31a]/15 text-[#ffa31a]"
                          : "border-[#2a2a2a] bg-[#181818] text-white hover:border-[#ffa31a]/50",
                      )}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-4 mt-2 rounded-2xl border border-[#2a2a2a] bg-black/90 px-4 pb-4 pt-3 shadow-[0_10px_35px_rgba(0,0,0,0.45)] md:hidden"
          >
            <LiveSearch />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
