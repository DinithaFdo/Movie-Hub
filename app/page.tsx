
import {
  getTrendingMovies,
  getTrendingTV,
  getPopularMovies,
  getTopRatedMovies,
} from "@/services/tmdb";
import { CurvedCarousel } from "@/components/sections/CurvedCarousel";
import { FeaturesGrid } from "@/components/sections/features-grid";
import { StackedCarousel } from "@/components/sections/stacked-carousel";
import { TabbedGrid } from "@/components/sections/tabbed-grid";
import { NewsletterFooter } from "@/components/layout/newsletter-footer";

export const revalidate = 3600; // ISR - revalidate every hour

export default async function Home() {
  const [trendingMovies, trendingTV, popularMovies, topRatedMovies] =
    await Promise.allSettled([
      getTrendingMovies(),
      getTrendingTV(),
      getPopularMovies(),
      getTopRatedMovies(),
    ]);

  const trendingMoviesData = trendingMovies.status === "fulfilled" ? trendingMovies.value : [];
  const trendingTVData = trendingTV.status === "fulfilled" ? trendingTV.value : [];
  const popularMoviesData = popularMovies.status === "fulfilled" ? popularMovies.value : [];
  const topRatedMoviesData = topRatedMovies.status === "fulfilled" ? topRatedMovies.value : [];

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[var(--bg-base)]">
      {/* Subtle modern glowing orbs */}
      <div className="pointer-events-none absolute -left-64 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-[#D4FF3E]/5 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-[40%] -z-10 h-[600px] w-[600px] rounded-full bg-[#D4FF3E]/5 blur-[150px]" />

      <CurvedCarousel movies={trendingMoviesData} />
      <FeaturesGrid />
      <StackedCarousel movies={topRatedMoviesData} />
      <TabbedGrid movies={popularMoviesData} tvShows={trendingTVData} />
      
      <NewsletterFooter />
    </main>
  );
}
