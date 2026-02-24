import Link from "next/link";
import { Play, Info, Calendar, Star } from "lucide-react";
import { getTMDBImageUrl, getTrendingMovies } from "@/lib/tmdb";

export async function HeroFeatured() {
  const featuredMovie = (await getTrendingMovies())[0];

  if (!featuredMovie) {
    return null;
  }

  const backgroundImage = getTMDBImageUrl(
    featuredMovie.backdropPath,
    "original",
  );

  return (
    <section className="relative h-[85vh] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-105"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-[#050505] via-[#050505]/40 to-transparent" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-center px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="animate-fade-in max-w-3xl space-y-6">
          <div className="flex items-center gap-3">
            <span className="bg-[#00f3ff]/10 border border-[#00f3ff]/20 text-[#00f3ff] px-3 py-1 text-xs font-bold tracking-widest uppercase rounded">
              Featured
            </span>
            <div className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
              <Star size={14} fill="#facc15" />
              {featuredMovie.voteAverage.toFixed(1)}
            </div>
            <div className="flex items-center gap-1 text-gray-300 text-sm">
              <Calendar size={14} />
              {featuredMovie.releaseDate
                ? new Date(featuredMovie.releaseDate).getFullYear()
                : "N/A"}
            </div>
          </div>

          <h1 className="text-5xl font-black leading-tight tracking-tight text-white sm:text-7xl lg:text-8xl drop-shadow-2xl">
            {featuredMovie.title}
          </h1>

          <p className="line-clamp-3 max-w-2xl text-lg text-gray-300 sm:text-xl drop-shadow-md">
            {featuredMovie.overview}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/watch/${featuredMovie.mediaType}/${featuredMovie.id}`}
              className="group flex items-center gap-3 rounded-xl bg-[#00f3ff] px-8 py-4 text-base font-bold text-black transition-all hover:bg-white hover:scale-105 hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]"
            >
              <Play size={20} fill="#000" className="group-hover:fill-black" />
              Watch Now
            </Link>
            <Link
              href={`/watch/${featuredMovie.mediaType}/${featuredMovie.id}`}
              className="group flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-md px-8 py-4 text-base font-bold text-white transition-all hover:bg-white/20 hover:scale-105 border border-white/10"
            >
              <Info size={20} />
              More Info
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
