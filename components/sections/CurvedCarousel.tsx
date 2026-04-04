"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Calendar, Globe } from "lucide-react";
import { getTMDBImageUrl } from "@/services/tmdb";
import type { MovieSummary } from "@/types/movie";

interface CurvedCarouselProps {
  movies: MovieSummary[];
}

export function CurvedCarousel({ movies }: CurvedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!movies || movies.length === 0) return null;

  const paginate = (direction: number) => {
    setCurrentIndex((prev) => (prev + direction + movies.length) % movies.length);
  };

  // Keep a larger window so the chain feels infinite
  const offsets = [-2, -1, 0, 1, 2];

  const springTransition = {
    type: "spring" as const,
    stiffness: 250,
    damping: 30,
    mass: 1,
  };

  /**
   * Generates a precise clip-path to simulate a continuous massive cylinder.
   * - Center: peaks at middle
   * - Left: peaks at right, drops sharply to left
   * - Right: peaks at left, drops sharply to right
   */
  const getClipPath = (offset: number) => {
    if (offset === 0) return "ellipse(150% 100% at 50% 50%)";
    if (offset < 0) return "ellipse(180% 100% at 180% 50%)"; // Slopes downward toward left
    return "ellipse(180% 100% at -80% 50%)"; // Slopes downward toward right
  };

  return (
    <div className="relative w-full overflow-hidden py-8 md:py-16 mt-24 md:mt-32 flex flex-col items-center justify-start min-h-[700px] md:min-h-[850px] z-10">
      
      {/* Restored Hero Title Section Overlaying the Top Edge */}
      <div className="text-center z-30 mb-8 flex flex-col items-center px-4 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] drop-shadow-2xl"
        >
          Discover the Series Streaming Experience with <span className="text-[#D4FF3E]">MOVIEHUB</span>
        </motion.h1>
      </div>
      
      {/* 
        Container wrapping the carousel 
        Width spans very wide to hold the entire chain
      */}
      <div 
        className="relative w-full h-[350px] md:h-[550px] flex items-center justify-center perspective-[2000px] transform-style-3d"
      >
        <AnimatePresence initial={false}>
          {offsets.map((offset) => {
            const index = (currentIndex + offset + movies.length) % movies.length;
            const movie = movies[index]!;
            const isActive = offset === 0;

            // Physical placement as strict chain links (x mapping)
            // 105% width pushes each card exactly next to the previous with a 5% gap
            const xOffset = offset * 105; 
            const opacity = Math.abs(offset) > 2 ? 0 : 1; 

            // Creating the subtle "U-like" chain structure
            const zOffset = Math.abs(offset) * -120; // Pushes adjacent links back slightly
            const yOffset = Math.abs(offset) * -20;  // Physically lifts them slightly producing a U-curve
            const rotateY = offset * -12; // Slight inwards angle

            return (
              <motion.div
                key={`chain-${movie.id}-${index}`}
                layout
                initial={false}
                animate={{ 
                  opacity, 
                  x: `${xOffset}%`,
                  y: yOffset,
                  z: zOffset,
                  rotateY: rotateY,
                  zIndex: 20 - Math.abs(offset),
                  scale: 1 // CRITICAL: ALL cards stay exact same physical size
                }}
                transition={springTransition}
                drag={isActive ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset: dragOffset }) => {
                  if (dragOffset.x < -50) paginate(1);
                  else if (dragOffset.x > 50) paginate(-1);
                }}
                onClick={() => {
                  if (offset !== 0 && opacity > 0) paginate(offset > 0 ? 1 : -1);
                }}
                className="absolute shadow-2xl origin-center overflow-hidden w-[65%] sm:w-[50%] md:w-[45%] lg:w-[40%] h-[100%] rounded-3xl md:rounded-[2.5rem]"
                style={{
                  clipPath: getClipPath(offset),
                  cursor: isActive ? "default" : "pointer"
                }}
              >
                <div className="w-full h-full relative group">
                  <Image 
                    src={getTMDBImageUrl(movie.backdropPath || movie.posterPath, isActive ? 1280 : 780)} 
                    alt={movie.title} 
                    fill 
                    priority={isActive}
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  
                  {/* Dim inactive chain links */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
                  )}

                  {/* Active Card Gradient Overlay */}
                  {isActive && (
                    <div className="absolute inset-x-0 bottom-0 top-[20%] bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
                  )}

                  {/* Title & Metadata logic isolated strictly to center */}
                  {isActive && (
                    <>
                      <Link href={`/watch/${movie.mediaType || 'movie'}/${movie.id}`} className="absolute inset-0 z-10 cursor-pointer" />
                      <motion.div 
                        key={`meta-${movie.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute bottom-6 md:bottom-12 left-6 md:left-10 right-6 md:right-24 text-white z-20 pointer-events-none"
                      >
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 drop-shadow-xl tracking-tight leading-[1.1]">
                          {movie.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm font-bold text-[#8A8A8E] mb-2 pointer-events-auto">
                          <span className="bg-[#D4FF3E] text-black px-3 py-1.5 rounded-full font-black uppercase tracking-wider shadow-lg">
                            {movie.mediaType === "tv" ? "Series Feature" : "Movie Night"}
                          </span>
                          
                          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                            <Clock className="w-4 h-4 text-[#D4FF3E]" />
                            <span>01:45:08</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                            <Calendar className="w-4 h-4 text-[#D4FF3E]" />
                            <span>{movie.releaseDate?.substring(0, 4) || "2024"}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                            <Globe className="w-4 h-4 text-[#D4FF3E]" />
                            <span>English</span>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Isolated Navigation Array exactly on the right gap */}
        <div className="absolute right-[4%] md:right-[26%] z-50 flex items-center bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full shadow-2xl p-1 pointer-events-auto">
          <motion.button 
            onClick={() => paginate(-1)}
            whileHover={{ backgroundColor: "rgba(212, 255, 62, 0.9)", color: "#000", scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full text-white transition-colors cursor-pointer"
          >
             <ChevronLeft className="w-7 h-7 md:w-9 md:h-9" />
          </motion.button>
          
          <div className="w-px h-8 bg-white/20 mx-1" />

          <motion.button 
            onClick={() => paginate(1)}
            whileHover={{ backgroundColor: "rgba(212, 255, 62, 0.9)", color: "#000", scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full text-white transition-colors cursor-pointer"
          >
             <ChevronRight className="w-7 h-7 md:w-9 md:h-9" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
