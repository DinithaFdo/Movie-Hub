"use client";

import { useFavorites } from "@/context/favorites-context";
import { MovieCard } from "@/components/cards/movie-card";
import { motion } from "framer-motion";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-[#050505] text-white">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-br from-[#050505] via-[#0a0a0a] to-[#050505]" />
        <div className="absolute top-0 left-0 w-full h-96 bg-[#00f3ff]/5 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">
          My List
        </h1>
        <p className="text-gray-400 mb-12">
          Your personal collection of movies and series
        </p>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="p-4 rounded-full bg-white/5 mb-4">
              <span className="text-4xl">📺</span>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              It&apos;s empty here
            </h3>
            <p className="text-gray-400">
              Mark movies and series as favorites to see them here.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
          >
            {favorites.map((movie, index) => (
              <div key={movie.id} className="flex justify-center">
                <MovieCard movie={movie} index={index} />
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
