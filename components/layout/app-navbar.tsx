"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/utils/helpers";
import { usePreloader } from "@/components/context/preloader-context";
import { LiveSearch } from "@/components/search/live-search";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "Series" },
  { href: "/favorites", label: "Favorites" },
];

export function AppNavbar() {
  const pathname = usePathname();
  const { hasLoaded } = usePreloader();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.header 
      className="absolute top-0 left-0 right-0 z-50 pt-6 px-4 md:px-12 flex items-center justify-between pointer-events-auto"
    >
      {/* Left: Bold Text Logo with layoutId linking to Preloader */}
      <div className="md:flex-1 flex justify-start basis-0">
        <Link href="/" className="flex items-center gap-2">
          <motion.span 
            layoutId="logo"
            className="text-xl md:text-2xl font-black tracking-tight text-[#D4FF3E]"
          >
            MOVIEHUB
          </motion.span>
        </Link>
      </div>

      {/* Center: Pill-shaped navigation spanning from pill to long nav */}
      <motion.nav 
        initial={{ width: 40, opacity: 0 }}
        animate={hasLoaded ? { width: "auto", opacity: 1 } : { width: 40, opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="hidden md:flex items-center bg-[#1A1A1D]/80 backdrop-blur-xl border border-white/5 rounded-full px-2 py-1.5 shadow-2xl overflow-hidden whitespace-nowrap"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative px-6 py-2 text-sm font-semibold transition-colors rounded-full shrink-0"
            >
              <span className={cn("relative z-10", isActive ? "text-black" : "text-white hover:text-[#8A8A8E]")}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="navbar-active"
                  className="absolute inset-0 bg-[#D4FF3E] rounded-full z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </motion.nav>

      {/* Right: Actions fading in smoothly with Search Exansion */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={hasLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex items-center justify-end gap-3 relative md:flex-1 basis-0"
      >
        <motion.div layout className="flex items-center justify-end mr-2 md:mr-0">
           <LiveSearch 
             isExpanded={isSearchOpen} 
             onFocus={() => setIsSearchOpen(true)}
             onBlur={() => setIsSearchOpen(false)}
           />
        </motion.div>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-white bg-white/5 rounded-full backdrop-blur-md"
        >
           {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-4 mx-4 bg-[#1A1A1D]/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 flex flex-col gap-4 shadow-2xl z-50 pointer-events-auto"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-bold text-white/80 hover:text-[#D4FF3E] transition-colors py-2 border-b border-white/5 last:border-0"
            >
              {item.label}
            </Link>
          ))}
        </motion.div>
      )}
    </motion.header>
  );
}
