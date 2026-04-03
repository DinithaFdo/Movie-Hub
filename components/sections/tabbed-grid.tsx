"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getTMDBImageUrl } from "@/services/tmdb";
import { cn } from "@/utils/helpers";
import type { MovieSummary } from "@/types/movie";

interface TabbedGridProps {
  movies: MovieSummary[];
  tvShows: MovieSummary[];
}

export function TabbedGrid({ movies, tvShows }: TabbedGridProps) {
  const [activeTab, setActiveTab] = useState("Movies");
  
  const tabs = ["Movies", "TV Shows", "Animation", "Anime"];
  
  const getActiveMedia = () => {
    if (activeTab === "TV Shows") return tvShows.slice(0, 16);
    if (activeTab === "Animation") return movies.filter(m => m.voteAverage > 7.5).slice(0, 16);
    if (activeTab === "Anime") return tvShows.filter(t => t.voteAverage > 7.5).slice(0, 16);
    return movies.slice(0, 16);
  };

  const activeMedia = getActiveMedia();
  // Safe slices to ensure we have media to show
  const topRowMedia = [...activeMedia.slice(0, 8), ...activeMedia.slice(0, 8)]; 
  const bottomRowMedia = [...activeMedia.slice(8, 16), ...activeMedia.slice(8, 16)];

  // Fallback duplicates to make marquee perfectly infinite if array is small
  const safeTopRow = topRowMedia.length < 8 ? [...movies.slice(0, 8), ...movies.slice(0, 8)] : topRowMedia;
  const safeBottomRow = bottomRowMedia.length < 8 ? [...tvShows.slice(0, 8), ...tvShows.slice(0, 8)] : bottomRowMedia;

  return (
    <section className="w-full overflow-hidden py-8 md:py-20 pb-16 md:pb-32">
      <div className="text-center mb-4 md:mb-12 px-4 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
        >
          Popular shows
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[#D4FF3E] text-lg font-medium"
        >
          Online Streaming
        </motion.p>
      </div>

      <motion.div 
        initial={{ width: 60, opacity: 0 }}
        whileInView={{ width: "auto", opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-center mb-8 md:mb-16 mx-auto overflow-hidden fit-content px-4 relative z-10"
      >
        <div className="bg-[#1A1A1D] p-1.5 rounded-full flex gap-1 border border-white/5 shadow-xl max-w-full overflow-x-auto hide-scrollbar whitespace-nowrap">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "relative px-6 md:px-8 py-3 rounded-full text-sm md:text-base font-bold transition-colors shrink-0",
                  isActive ? "text-black" : "text-[var(--text-secondary)] hover:text-white"
                )}
              >
                <span className="relative z-10">{tab}</span>
                {isActive && (
                  <motion.div
                    layoutId="pill-tab-popular"
                    className="absolute inset-0 bg-[#D4FF3E] rounded-full z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* CSS Auto-Scrolling Marquees (Pause on Hover Native) */}
      <div className="flex flex-col gap-6 relative mask-edges">
        
        {/* Top Row: Left to Right Marquee */}
        <div className="flex w-max overflow-visible">
          <div className="flex gap-6 px-3 animate-marquee-left pause-on-hover">
            {safeTopRow.map((media, idx) => (
              <MediaCard key={`top-${media.id}-${idx}`} media={media} />
            ))}
          </div>
        </div>

        {/* Bottom Row: Right to Left Marquee */}
        <div className="flex w-max overflow-visible -ml-[50%]">
          <div className="flex gap-6 px-3 animate-marquee-right pause-on-hover">
            {safeBottomRow.map((media, idx) => (
              <MediaCard key={`bottom-${media.id}-${idx}`} media={media} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function MediaCard({ media }: { media: MovieSummary }) {
  if (!media) return null;
  
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-[2.5rem] overflow-hidden group cursor-pointer border border-transparent hover:border-[#D4FF3E]/30 shrink-0"
    >
      <Link href={`/watch/${media.mediaType || 'movie'}/${media.id}`}>
        <Image
          src={getTMDBImageUrl(media.backdropPath || media.posterPath, 500)}
          alt={media.title || "Movie"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
        
        <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{media.title}</h3>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
            <span className="text-xs font-bold text-[#D4FF3E]">HD</span>
            <span className="text-xs text-[var(--text-secondary)]">★ {Number(media.voteAverage || 0).toFixed(1)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
