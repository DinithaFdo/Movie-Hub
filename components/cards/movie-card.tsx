"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Calendar, Heart } from "lucide-react";
import { getTMDBImageUrl } from "@/lib/tmdb";
import type { MovieSummary } from "@/types/movie";
import { useFavorites } from "@/context/favorites-context";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: MovieSummary;
  priority?: boolean;
  index?: number;
}

export function MovieCard({
  movie,
  priority = false,
  index = 0,
}: MovieCardProps) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const favorite = isFavorite(movie.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -10 }}
      className="group relative w-40 md:w-50 shrink-0 cursor-pointer"
    >
      <Link href={`/watch/${movie.mediaType}/${movie.id}`}>
        <div className="relative aspect-2/3 overflow-hidden rounded-xl bg-[#1a1a1a] shadow-lg transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(255,163,26,0.22)]">
          <Image
            src={getTMDBImageUrl(movie.posterPath, "w500")}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 160px, 200px"
            priority={priority}
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Action Buttons Overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            <button
              onClick={toggleFavorite}
              className={cn(
                "bg-black/60 backdrop-blur-md p-2 rounded-full transition-colors hover:bg-white/20",
                favorite ? "text-red-500" : "text-white",
              )}
            >
              <Heart size={16} fill={favorite ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-medium text-white/80">
              <div className="flex items-center gap-1">
                <Star size={12} className="text-yellow-400" fill="#facc15" />
                <span>{movie.voteAverage.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>
                  {movie.releaseDate
                    ? new Date(movie.releaseDate).getFullYear()
                    : "N/A"}
                </span>
              </div>
            </div>

            <button className="w-full rounded bg-[#ffa31a] py-1.5 text-xs font-bold uppercase tracking-wide text-black transition-colors group-hover:bg-[#ffbe55]">
              Watch Now
            </button>
          </div>
        </div>

        <div className="mt-3 px-1">
          <h3 className="text-sm font-bold text-white truncate transition-colors group-hover:text-[#ffd38a]">
            {movie.title}
          </h3>
          <p className="text-xs text-gray-500 capitalize">{movie.mediaType}</p>
        </div>
      </Link>
    </motion.div>
  );
}
