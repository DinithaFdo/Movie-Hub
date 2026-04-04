"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTMDBImageUrl } from "@/services/tmdb";
import type { MovieSummary } from "@/types/movie";

interface StackedCarouselProps {
  movies: MovieSummary[];
}

export function StackedCarousel({ movies }: StackedCarouselProps) {
  const [index, setIndex] = useState(0);

  if (!movies || movies.length === 0) return null;

  const handleNext = () => setIndex((prev) => (prev + 1) % movies.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + movies.length) % movies.length);

  // Take 5 items starting from current index for the stack
  const visibleCards = Array.from({ length: 5 }).map((_, i) => {
    return { movie: movies[(index + i) % movies.length]!, logicalIndex: i };
  });

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-20 overflow-hidden">
      <div className="text-center mb-16 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
        >
          Your taste
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[var(--text-secondary)] text-lg"
        >
          Here are some things which you maybe love
        </motion.p>
      </div>

      <div className="relative h-[450px] md:h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 flex justify-center items-center">
          <AnimatePresence mode="popLayout">
            {visibleCards.map(({ movie, logicalIndex }) => {
              // Center is logicalIndex = 2
              const offset = logicalIndex - 2;
              const isCenter = offset === 0;
              const absOffset = Math.abs(offset);
              const zIndex = 10 - absOffset;
              const scale = 1 - absOffset * 0.15;
              const xPos = offset * 220; // Distance between cards
              
              return (
                <motion.div
                  key={`${movie.id}-${logicalIndex}`}
                  initial={{ opacity: 0, x: offset * 300, scale: scale * 0.8 }}
                  animate={{ 
                    opacity: absOffset > 2 ? 0 : 1, 
                    x: xPos, 
                    scale, 
                    zIndex,
                    filter: isCenter ? "brightness(1) blur(0px)" : `brightness(${1 - absOffset * 0.3}) blur(${absOffset}px)`
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  drag={isCenter ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, { offset: dragOffset }) => {
                    if (dragOffset.x < -50) handleNext();
                    else if (dragOffset.x > 50) handlePrev();
                  }}
                  className="absolute w-[240px] md:w-[320px] aspect-[2/3] rounded-[2rem] overflow-hidden shadow-2xl cursor-pointer"
                  onClick={() => {
                    if (offset < 0) handlePrev();
                    if (offset > 0) handleNext();
                  }}
                >
                  <Image
                    src={getTMDBImageUrl(movie.posterPath, 500)}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                  {isCenter && (
                    <>
                      <Link href={`/watch/${movie.mediaType || 'movie'}/${movie.id}`} className="absolute inset-0 z-10 cursor-pointer" />
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-20"
                      >
                        <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>
                        <div className="flex items-center gap-2">
                           <span className="text-xs font-bold bg-[#D4FF3E] text-black px-2 py-1 rounded-md">★ {Number(movie.voteAverage).toFixed(1)}</span>
                        </div>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="absolute bottom-0 flex flex-col items-center gap-6 z-20">
          <div className="flex items-center gap-4">
             <button onClick={handlePrev} className="w-12 h-12 rounded-full border border-white/20 bg-black/60 flex items-center justify-center hover:bg-[#D4FF3E] hover:text-black hover:border-transparent transition-all">
                <ChevronLeft size={20} />
             </button>
             <button onClick={handleNext} className="w-12 h-12 rounded-full border border-white/20 bg-black/60 flex items-center justify-center hover:bg-[#D4FF3E] hover:text-black hover:border-transparent transition-all">
                <ChevronRight size={20} />
             </button>
          </div>
        </div>
      </div>
    </section>
  );
}
