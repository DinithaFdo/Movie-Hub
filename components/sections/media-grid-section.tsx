/**
 * Media Grid Section - Reusable component for displaying media in grid or row
 */

"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { MediaCard } from "@/components/cards/media-card";
import type { MovieSummary } from "@/types/movie";

interface MediaGridSectionProps {
  title: string;
  subtitle?: string;
  media: MovieSummary[];
  variant?: "grid" | "row";
}

export function MediaGridSection({
  title,
  subtitle,
  media,
  variant = "grid",
}: MediaGridSectionProps) {
  const sectionRef = useScrollReveal({ threshold: 0.1, delay: true });

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="reveal-on-scroll relative w-full px-4 md:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="mb-4 flex items-end justify-between gap-4 md:mb-8">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--text-muted)">
            Curated Collection
          </p>
          <h2 className="text-balance text-2xl font-black tracking-tight text-(--text-primary) md:text-3xl lg:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 max-w-3xl text-sm text-(--text-tertiary) md:text-base">
              {subtitle}
            </p>
          )}
        </div>
        <span className="hidden rounded-full border border-(--border-default) bg-(--bg-elevated)/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-(--text-muted) md:inline-flex">
          {media.length} titles
        </span>
      </div>

      {/* Grid/Row */}
      {media.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-full aspect-video rounded-xl skeleton" />
          ))}
        </div>
      ) : variant === "row" ? (
        <div className="group/rail relative -mx-4 overflow-x-auto px-4 pb-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
          <div className="flex snap-x snap-mandatory gap-4 md:gap-5">
            {media.map((item) => (
              <div
                key={item.id}
                className="w-40 shrink-0 snap-start md:w-48 lg:w-52"
              >
                <MediaCard
                  media={item}
                  variant="small"
                  showActionButtons={false}
                />
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-12 bg-linear-to-r from-(--bg-base) to-transparent md:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-12 bg-linear-to-l from-(--bg-base) to-transparent md:block" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {media.map((item) => (
            <MediaCard key={item.id} media={item} showActionButtons={true} />
          ))}
        </div>
      )}
    </section>
  );
}
