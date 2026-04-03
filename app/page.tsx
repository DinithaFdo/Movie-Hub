import { Suspense } from "react";
import {
  getTrendingMovies,
  getTrendingTV,
  getPopularMovies,
  getTopRatedMovies,
} from "@/services/tmdb";
import { HeroSection } from "@/components/sections/hero-section";
import { EditorialSpotlight } from "@/components/sections/editorial-spotlight";
import { MediaGridSection } from "@/components/sections/media-grid-section";
import { HeroSkeleton, RowSkeleton } from "@/components/skeletons/skeleton";

export const revalidate = 3600; // ISR - revalidate every hour

export default async function Home() {
  const [trendingMovies, trendingTV, popularMovies, topRatedMovies] =
    await Promise.allSettled([
      getTrendingMovies(),
      getTrendingTV(),
      getPopularMovies(),
      getTopRatedMovies(),
    ]);

  const trendingMoviesData =
    trendingMovies.status === "fulfilled" ? trendingMovies.value : [];
  const trendingTVData =
    trendingTV.status === "fulfilled" ? trendingTV.value : [];
  const popularMoviesData =
    popularMovies.status === "fulfilled" ? popularMovies.value : [];
  const topRatedMoviesData =
    topRatedMovies.status === "fulfilled" ? topRatedMovies.value : [];
  const spotlightMedia = [
    ...topRatedMoviesData.slice(0, 2),
    ...popularMoviesData.slice(0, 2),
    ...trendingMoviesData.slice(0, 1),
  ];

  return (
    <main className="relative min-h-screen overflow-x-clip pb-24">
      <div className="pointer-events-none absolute inset-0 -z-10 page-atmosphere" />
      <div className="pointer-events-none absolute inset-0 -z-10 page-grid" />
      <div className="pointer-events-none absolute -left-32 top-64 -z-10 h-64 w-64 rounded-full bg-(--primary)/20 blur-3xl" />
      {/* Hero Section */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      {/* Content Sections */}
      <div className="relative space-y-14 pt-12 md:space-y-18 md:pt-18 lg:space-y-20">
        <Suspense fallback={<RowSkeleton />}>
          <EditorialSpotlight media={spotlightMedia} />
        </Suspense>

        {/* Trending Movies */}
        <Suspense fallback={<RowSkeleton />}>
          <MediaGridSection
            title="Trending Movies"
            subtitle="Blockbuster momentum, global chatter, and big-screen energy in one ribbon."
            media={trendingMoviesData}
            variant="row"
          />
        </Suspense>

        {/* Trending TV Shows */}
        <Suspense fallback={<RowSkeleton />}>
          <MediaGridSection
            title="Trending TV Series"
            subtitle="The binge map: crowd-favorite episodes and breakout series everyone talks about."
            media={trendingTVData}
            variant="row"
          />
        </Suspense>

        {/* Popular Movies */}
        <Suspense fallback={<RowSkeleton />}>
          <MediaGridSection
            title="Popular Right Now"
            subtitle="Massive fan picks this week, curated for instant watch decisions."
            media={popularMoviesData}
            variant="row"
          />
        </Suspense>

        {/* Top Rated Movies */}
        <Suspense fallback={<RowSkeleton />}>
          <MediaGridSection
            title="Top Rated Masterpieces"
            subtitle="Prestige cinema, peak storytelling, and all-time critical darlings."
            media={topRatedMoviesData}
            variant="row"
          />
        </Suspense>
      </div>
    </main>
  );
}
