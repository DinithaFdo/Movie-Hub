"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Monitor,
  Film,
  Menu,
  X,
  Home,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { LiveSearch } from "@/components/search/live-search";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/movies", label: "Movies", icon: Film },
  { href: "/tv", label: "Series", icon: Monitor },
  { href: "/favorites", label: "My List", icon: Star },
];

export function AppNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled
          ? "bg-black/80 backdrop-blur-md border-white/5 py-3"
          : "bg-linear-to-b from-black/80 to-transparent py-5",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2 relative z-50">
            <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-linear-to-br from-[#00f3ff] to-[#7000ff] shadow-[0_0_15px_rgba(0,243,255,0.3)]">
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                 <div className="w-0 h-0 border-l-[6px] border-l-white border-y-4 border-y-transparent ml-0.5" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-wider text-white drop-shadow-lg">
              MOVIE<span className="text-[#00f3ff]">HUB</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium tracking-wide transition-colors hover:text-[#00f3ff]",
                  pathname === item.href ? "text-[#00f3ff]" : "text-gray-300",
                )}
              >
                {item.label}
                {pathname === item.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-6 left-0 right-0 h-0.5 bg-[#00f3ff] shadow-[0_0_10px_#00f3ff]"
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 relative z-50">
            <div className="hidden md:block w-64">
              <LiveSearch />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 hover:text-[#00f3ff] transition-colors md:hidden backdrop-blur-md"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-15 left-0 right-0 bottom-0 bg-black/95 backdrop-blur-xl border-t border-white/10 md:hidden overflow-y-auto z-40"
          >
            <div className="flex flex-col gap-6 p-6 pt-8">
              <div className="mb-2">
                <LiveSearch />
              </div>
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl text-lg font-medium transition-colors border border-transparent",
                      pathname === item.href
                        ? "bg-[#00f3ff]/10 text-[#00f3ff] border-[#00f3ff]/20"
                        : "text-gray-300 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <item.icon size={22} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
