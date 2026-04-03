"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTMDBImageUrl } from "@/services/tmdb";
import { usePreloader } from "@/components/context/preloader-context";
import type { MovieSummary } from "@/types/movie";

interface HeroCarouselProps {
  movies: MovieSummary[];
}

export function HeroCarouselClient({ movies }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const { hasLoaded } = usePreloader();

  if (!movies || movies.length === 0) return null;

  const getIndex = (offset: number) => {
    return (currentIndex + offset + movies.length) % movies.length;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex(getIndex(newDirection));
  };

  const prevMovie = movies[getIndex(-1)]!;
  const activeMovie = movies[currentIndex]!;
  const nextMovie = movies[getIndex(1)]!;

  return (
    <div className="relative w-full overflow-hidden py-10 md:py-24 flex flex-col items-center">
      {/* Header Text */}
      <div className="text-center z-10 mb-8 md:mb-12 flex flex-col items-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={hasLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="text-white text-4xl md:text-6xl lg:text-[5rem] font-black tracking-tight max-w-4xl leading-[1.1] pt-12"
        >
          Discover the Series Streaming Experience with <span className="text-[#D4FF3E]">MOVIEHUB</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={hasLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="text-[#8A8A8E] mt-6 text-lg md:text-xl font-medium max-w-xl"
        >
          Our young and expert admins prepare amazing and trend series for you to watch online and priceless
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={hasLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex gap-4 mt-8"
        >
          <Link href={`/watch/${activeMovie?.mediaType || 'movie'}/${activeMovie?.id}`} className="bg-[#D4FF3E] text-black font-semibold px-8 py-3.5 rounded-full hover:bg-white hover:scale-105 transition-all text-sm md:text-lg">
            Get started
          </Link>
          <Link href="/live-tv" className="border border-[#8A8A8E] text-white font-semibold px-8 py-3.5 rounded-full hover:border-[#D4FF3E] hover:text-[#D4FF3E] transition-all text-sm md:text-lg">
            Live TV
          </Link>
        </motion.div>
      </div>

      {/* 2D Overlay Carousel Area */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={hasLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-[1400px] h-[300px] md:h-[550px] flex items-center justify-center mt-2"
      >
        <AnimatePresence mode="popLayout" custom={direction}>
          {/* Previous Poster - Left side */}
          <motion.div
            key={`prev-${prevMovie.id}`}
            layout
            initial={false}
            animate={{ opacity: 0.7, x: "-55%", scale: 0.85, zIndex: 0 }}
            exit={{ opacity: 0, x: "-70%", scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute h-[250px] md:h-[450px] w-[70%] md:w-[45%] cursor-pointer group"
            onClick={() => paginate(-1)}
          >
            <div className="w-full h-full rounded-[3rem] md:rounded-[4rem] overflow-hidden relative shadow-2xl transition-all group-hover:opacity-100">
              <Image src={getTMDBImageUrl(prevMovie.backdropPath || prevMovie.posterPath, 780)} alt="Previous" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          </motion.div>

          {/* Next Poster - Right side */}
          <motion.div
            key={`next-${nextMovie.id}`}
            layout
            initial={false}
            animate={{ opacity: 0.7, x: "55%", scale: 0.85, zIndex: 0 }}
            exit={{ opacity: 0, x: "70%", scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute h-[250px] md:h-[450px] w-[70%] md:w-[45%] cursor-pointer group"
            onClick={() => paginate(1)}
          >
            <div className="w-full h-full rounded-[3rem] md:rounded-[4rem] overflow-hidden relative shadow-2xl transition-all group-hover:opacity-100">
              <Image src={getTMDBImageUrl(nextMovie.backdropPath || nextMovie.posterPath, 780)} alt="Next" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          </motion.div>

          {/* Active Center Poster */}
          <motion.div
            key={`active-${activeMovie.id}`}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, x: "0%", scale: 1, zIndex: 20 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute h-full w-[85%] md:w-[65%]"
          >
            <Link href={`/watch/${activeMovie?.mediaType || 'movie'}/${activeMovie?.id}`}>
              <div className="w-full h-full rounded-[3rem] md:rounded-[4rem] overflow-hidden relative shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/5 cursor-pointer group">
                <Image src={getTMDBImageUrl(activeMovie.backdropPath || activeMovie.posterPath, 1280)} alt={activeMovie.title} fill priority className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-90" />
                
                <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-end">
                   <h2 className="text-3xl md:text-5xl lg:text-6xl font-black drop-shadow-xl text-white tracking-tight">{activeMovie.title}</h2>
                   <div className="flex flex-wrap items-center gap-3 mt-4 text-sm font-semibold">
                      <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white">
                        <span className="text-[#D4FF3E]">★</span> {Number(activeMovie.voteAverage).toFixed(1)}/10
                      </span>
                      <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[#8A8A8E]">
                        Trending Now
                      </span>
                      <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white">
                        {activeMovie.releaseDate?.substring(0, 4) || "2024"}
                      </span>
                   </div>
                </div>

                {/* Floating Navigation Controls over active card edges */}
                <div className="absolute z-30 flex items-center justify-between w-full px-4 md:px-8 top-1/2 -translate-y-1/2 pointer-events-none">
                    <button 
                      onClick={(e) => { e.preventDefault(); paginate(-1); }}
                      className="pointer-events-auto w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#D4FF3E] hover:text-black hover:border-transparent transition-all shadow-xl -ml-6 md:-ml-12 opacity-0 group-hover:opacity-100"
                    >
                       <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                    <button 
                      onClick={(e) => { e.preventDefault(); paginate(1); }}
                      className="pointer-events-auto w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#D4FF3E] hover:text-black hover:border-transparent transition-all shadow-xl -mr-6 md:-mr-12 opacity-0 group-hover:opacity-100"
                    >
                       <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
