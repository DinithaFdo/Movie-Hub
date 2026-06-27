/**
 * Skeleton Loading Components — Styled to match Cinestream theme
 */

import { cn } from "@/utils/helpers";

interface SkeletonProps {
  className?: string;
  count?: number;
}

/* Base shimmer block */
export function Skeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse bg-[#1A1A1D] rounded-2xl",
            className,
          )}
        />
      ))}
    </>
  );
}

/* ── Media Card (square/landscape grid card) ── */
export function MediaCardSkeleton() {
  return (
    <div className="rounded-[2.5rem] overflow-hidden bg-[#1A1A1D] border border-white/5 w-full h-[280px] md:h-[320px] relative animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0F] via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 space-y-2.5">
        <div className="h-4 w-3/4 bg-white/10 rounded-full" />
        <div className="flex gap-2">
          <div className="h-3 w-10 bg-[#D4FF3E]/20 rounded-full" />
          <div className="h-3 w-14 bg-white/10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ── Media Grid ── */
export function MediaGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MediaCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ── Hero Carousel Skeleton ── */
export function HeroSkeleton() {
  return (
    <div className="relative w-full overflow-hidden rounded-[2.5rem] md:rounded-[4rem] bg-[#1A1A1D] border border-white/5 animate-pulse" style={{ aspectRatio: "16/7" }}>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0F] via-[#0D0D0F]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 space-y-5">
        {/* badges */}
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-[#D4FF3E]/20 rounded-full" />
          <div className="h-5 w-10 bg-white/10 rounded-full" />
        </div>
        {/* title */}
        <div className="h-12 md:h-16 w-2/3 bg-white/10 rounded-2xl" />
        <div className="h-4 w-1/2 bg-white/5 rounded-full" />
        {/* buttons */}
        <div className="flex gap-4 pt-2">
          <div className="h-12 w-36 bg-[#D4FF3E]/20 rounded-full" />
          <div className="h-12 w-36 bg-white/10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ── Horizontal Row skeleton (marquee / scrollable) ── */
export function RowSkeleton() {
  return (
    <div className="w-full space-y-5 py-6">
      <div className="h-7 w-44 bg-[#1A1A1D] rounded-full animate-pulse" />
      <div className="flex gap-5 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="shrink-0 w-[280px] h-[280px] rounded-[2.5rem] bg-[#1A1A1D] animate-pulse border border-white/5" />
        ))}
      </div>
    </div>
  );
}

/* ── Watch page skeleton ── */
export function WatchPageSkeleton() {
  return (
    <div className="w-full space-y-10 px-4 sm:px-6 md:px-10 pt-24">
      {/* Player */}
      <div className="max-w-[1400px] mx-auto w-full aspect-video rounded-[2.5rem] md:rounded-[4rem] bg-[#1A1A1D] animate-pulse border border-white/5" />

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-10">
        {/* Left info */}
        <div className="flex-1 space-y-6">
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-[#D4FF3E]/20 rounded-full animate-pulse" />
            <div className="h-6 w-10 bg-white/10 rounded-full animate-pulse" />
          </div>
          <div className="h-12 w-3/4 bg-[#1A1A1D] rounded-2xl animate-pulse" />
          <div className="flex gap-4">
            <div className="h-5 w-14 bg-[#1A1A1D] rounded-full animate-pulse" />
            <div className="h-5 w-20 bg-[#1A1A1D] rounded-full animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-[#1A1A1D] rounded-full animate-pulse" />
            <div className="h-4 w-5/6 bg-[#1A1A1D] rounded-full animate-pulse" />
            <div className="h-4 w-2/3 bg-[#1A1A1D] rounded-full animate-pulse" />
          </div>
          {/* Cast row */}
          <div className="space-y-4 pt-4">
            <div className="h-7 w-28 bg-[#1A1A1D] rounded-full animate-pulse" />
            <div className="flex gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="shrink-0 w-[120px] space-y-2">
                  <div className="h-[160px] w-full rounded-3xl bg-[#1A1A1D] animate-pulse border border-white/5" />
                  <div className="h-3 w-4/5 bg-[#1A1A1D] rounded-full animate-pulse" />
                  <div className="h-2.5 w-3/5 bg-[#1A1A1D] rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="hidden lg:flex flex-col gap-4 w-[340px] shrink-0">
          <div className="h-7 w-32 bg-[#1A1A1D] rounded-full animate-pulse" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 bg-[#1A1A1D] rounded-3xl p-3 border border-white/5 animate-pulse">
              <div className="w-[110px] h-[75px] rounded-2xl bg-white/5 shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3.5 w-full bg-white/10 rounded-full" />
                <div className="h-3 w-2/3 bg-white/5 rounded-full" />
                <div className="h-2.5 w-12 bg-[#D4FF3E]/20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Search Results skeleton ── */
export function SearchResultsSkeleton() {
  return (
    <div className="py-2 space-y-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 px-4 py-3 rounded-2xl bg-white/5 animate-pulse"
        >
          <div className="w-12 h-16 rounded-xl bg-white/10 shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-3.5 w-2/3 bg-white/10 rounded-full" />
            <div className="h-2.5 w-1/2 bg-white/5 rounded-full" />
            <div className="h-2.5 w-1/3 bg-[#D4FF3E]/15 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
