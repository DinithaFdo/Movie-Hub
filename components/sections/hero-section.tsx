/**
 * Hero Section - Featured movie with background, gradient, and CTAs
 */

import Link from "next/link";
import { Play, Info, Calendar, Star } from "lucide-react";
import { getTrendingMovies, getTMDBImageUrl } from "@/services/tmdb";
import { formatRating, formatDate, truncateText } from "@/utils/helpers";

export async function HeroSection() {
  try {
    const movies = await getTrendingMovies();
    const featured = movies[0];

    if (!featured) {
      return null;
    }

    const backgroundImage = getTMDBImageUrl(featured.backdropPath, 1280);

    return (
      <section className="hero-surface reveal-on-scroll relative mx-3 h-[82vh] w-auto overflow-hidden rounded-4xl border border-(--border-default) shadow-elevation-5 md:mx-6 md:h-[88vh] lg:mx-8 lg:rounded-5xl">
        {/* Background Image with Zoom Effect */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[16s] hover:scale-105"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: "center",
          }}
        >
          {/* Multiple Gradient Overlays */}
          <div className="absolute inset-0 bg-linear-to-t from-(--bg-base) via-(--bg-base)/56 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-(--bg-base)/95 via-(--bg-base)/46 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-b from-black/35 via-transparent to-(--bg-base)" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(255,194,71,0.4), transparent 42%)",
            }}
          />
          <div className="hero-grain absolute inset-0" />
        </div>

        {/* Content */}
        <div className="relative z-10 grid h-full items-end px-5 pb-10 md:grid-cols-[minmax(0,1fr)_260px] md:items-center md:px-12 md:pb-0 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-16">
          <div className="animate-fade-in max-w-3xl space-y-7 md:space-y-8">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-(--primary)/35 bg-(--primary)/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-(--primary) md:text-sm">
                Featured
              </span>
              <div className="flex items-center gap-1 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-sm font-semibold text-yellow-300 backdrop-blur">
                <Star size={16} fill="#facc15" />
                {formatRating(featured.voteAverage)}
              </div>
              <div className="flex items-center gap-1 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-sm text-(--text-secondary) backdrop-blur">
                <Calendar size={16} />
                {formatDate(featured.releaseDate)}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-balance text-4xl font-black leading-[0.95] tracking-tight text-(--text-primary) drop-shadow-2xl md:text-6xl lg:text-7xl xl:text-8xl">
              {featured.title}
            </h1>

            {/* Description */}
            <p className="max-w-2xl text-pretty text-base text-(--text-secondary) drop-shadow-lg md:text-lg">
              {truncateText(featured.overview, 200)}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-2 md:gap-4">
              <Link
                href={`/watch/${featured.mediaType}/${featured.id}`}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-(--primary) px-7 py-3 text-sm font-black uppercase tracking-wide text-black shadow-elevation-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--primary-light) hover:shadow-elevation-5 md:px-8 md:text-base"
              >
                <Play size={20} className="group-hover:fill-current" />
                <span>Watch Now</span>
              </Link>

              <Link
                href={`/watch/${featured.mediaType}/${featured.id}`}
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-(--border-default) bg-black/45 px-7 py-3 text-sm font-bold text-(--text-primary) backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-(--primary)/40 hover:bg-(--primary)/12 md:px-8 md:text-base"
              >
                <Info size={20} />
                <span>More Info</span>
              </Link>
            </div>
          </div>

          <div className="hero-side-panel mt-6 hidden rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl md:block">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-(--text-muted)">
              Scene Metrics
            </p>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-(--text-muted)">
                  Audience Score
                </p>
                <p className="mt-1 text-lg font-black text-(--text-primary)">
                  ★ {formatRating(featured.voteAverage)}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-(--text-muted)">
                  Release
                </p>
                <p className="mt-1 text-lg font-black text-(--text-primary)">
                  {formatDate(featured.releaseDate)}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-(--text-muted)">
                  Type
                </p>
                <p className="mt-1 text-lg font-black text-(--text-primary)">
                  {featured.mediaType === "tv" ? "Series" : "Movie"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-(--primary-glow) blur-3xl" />
        <div className="pointer-events-none absolute bottom-6 right-6 hidden rounded-full border border-white/15 bg-black/35 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-(--text-secondary) backdrop-blur md:inline-flex">
          Cinematic Premiere
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error loading hero section:", error);
    return null;
  }
}
