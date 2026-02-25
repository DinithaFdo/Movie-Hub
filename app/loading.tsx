import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";
import { MovieRowSkeleton } from "@/components/skeletons/movie-row-skeleton";

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-14 pt-24 sm:px-6 lg:px-8">
      <HeroSkeleton />
      <MovieRowSkeleton />
      <MovieRowSkeleton />
      <MovieRowSkeleton />
    </main>
  );
}
