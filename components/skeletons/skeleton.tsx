/**
 * Skeleton Loading Component - Placeholder while content loads
 */

import { cn } from "@/utils/helpers";

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "skeleton rounded-lg bg-[var(--bg-elevated)]",
            className,
          )}
        />
      ))}
    </>
  );
}

export function MediaCardSkeleton() {
  return (
    <div className="rounded-[2.5rem] overflow-hidden shadow-xl bg-black/40 border border-white/5 w-full h-[280px] md:h-[320px] relative">
      <Skeleton className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 space-y-3 z-10">
        <Skeleton className="h-5 w-3/4 rounded-full bg-white/20" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-12 rounded-full bg-[#D4FF3E]/20" />
          <Skeleton className="h-4 w-16 rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
}

export function MediaGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MediaCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[85vh] w-full overflow-hidden rounded-2xl">
      <Skeleton className="w-full h-full" />
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute bottom-0 left-0 w-full max-w-7xl p-8 md:p-16 space-y-4">
        <Skeleton className="h-16 w-3/4 rounded-2xl" />
        <Skeleton className="h-6 w-1/2" />
        <div className="mt-8 flex gap-4">
          <Skeleton className="h-12 w-32 rounded-full" />
          <Skeleton className="h-12 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="w-full space-y-4 px-4 py-8 md:px-12">
      <Skeleton className="h-8 w-48" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-shrink-0">
            <Skeleton className="w-40 aspect-video rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 p-3 rounded-lg bg-[var(--bg-elevated)]"
        >
          <Skeleton className="w-16 h-24 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
