import { Suspense } from "react";

import { HeroFeatured } from "@/components/sections/hero-featured";
import { MovieRow } from "@/components/sections/movie-row";

function HeroSkeleton() {
  return (
    <div className="relative h-[85vh] w-full animate-pulse overflow-hidden bg-neutral-900">
      <div className="absolute inset-x-0 bottom-0 h-96 bg-linear-to-t from-black via-black/80 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full max-w-7xl p-8 md:p-16 space-y-4">
        <div className="h-16 w-3/4 rounded-2xl bg-white/5" />
        <div className="h-6 w-1/2 rounded-full bg-white/5" />
        <div className="mt-8 flex gap-4">
          <div className="h-12 w-32 rounded-full bg-white/10" />
          <div className="h-12 w-32 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

function RowSkeleton() {
  return (
    <div className="w-full space-y-4 px-4 py-8 md:px-12">
      <div className="h-8 w-48 animate-pulse rounded bg-white/5" />
      <div className="flex gap-4 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="aspect-2/3 w-45 shrink-0 animate-pulse rounded-xl bg-white/5"
          />
        ))}
      </div>
    </div>
  );
}

export const revalidate = 3600;

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] pb-24 text-white selection:bg-[#00f3ff] selection:text-black">
      {/* Hero Section - Full Width & Immersive */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroFeatured />
      </Suspense>

      {/* Content Sections - Overlapping Hero slightly for that seamless look */}
      <div className="relative z-10 -mt-20 space-y-4 pt-20 md:-mt-32 md:space-y-12">
        <Suspense fallback={<RowSkeleton />}>
          <MovieRow id="trending" />
        </Suspense>

        <Suspense fallback={<RowSkeleton />}>
          <MovieRow id="now-playing" />
        </Suspense>

        <Suspense fallback={<RowSkeleton />}>
          <MovieRow id="popular" />
        </Suspense>

        <Suspense fallback={<RowSkeleton />}>
          <MovieRow id="top-rated" />
        </Suspense>
      </div>
    </main>
  );
}
