import Image from "next/image";
import Link from "next/link";

import { getTMDBImageUrl } from "@/services/tmdb";
import { formatRating, truncateText } from "@/utils/helpers";
import type { MovieSummary } from "@/types/movie";

interface EditorialSpotlightProps {
  media: MovieSummary[];
}

export function EditorialSpotlight({ media }: EditorialSpotlightProps) {
  const picks = media
    .filter((item) => Boolean(item.backdropPath || item.posterPath))
    .slice(0, 3);

  if (picks.length < 3) return null;

  const primary = picks[0]!;
  const second = picks[1]!;
  const third = picks[2]!;

  return (
    <section className="reveal-on-scroll px-4 md:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-3 md:mb-8">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--text-muted)">
            Editor&rsquo;s Frame
          </p>
          <h2 className="text-2xl font-black tracking-tight text-(--text-primary) md:text-4xl">
            Tonight&rsquo;s Signature Picks
          </h2>
        </div>
        <span className="hidden rounded-full border border-(--border-default) bg-(--bg-elevated)/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-(--text-muted) md:inline-flex">
          Handpicked Moodboard
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5 lg:gap-6">
        <Link
          href={`/watch/${primary.mediaType}/${primary.id}`}
          className="group relative overflow-hidden rounded-3xl border border-(--border-default) bg-(--bg-elevated) shadow-elevation-3 transition-all duration-500 hover:-translate-y-1 hover:shadow-elevation-5 md:col-span-8"
        >
          <div className="relative aspect-16/10">
            <Image
              src={getTMDBImageUrl(
                primary.backdropPath || primary.posterPath,
                "original",
              )}
              alt={primary.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#05070e] via-[#05070e]/40 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,204,108,0.22),transparent_48%)]" />
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full border border-(--primary)/45 bg-(--primary)/14 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-(--primary)">
                Spotlight
              </span>
              <span className="rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-xs font-semibold text-white/90">
                ★ {formatRating(primary.voteAverage)}
              </span>
            </div>
            <h3 className="text-2xl font-black leading-tight text-white md:text-4xl">
              {primary.title}
            </h3>
            <p className="mt-3 max-w-xl text-sm text-(--text-secondary) md:text-base">
              {truncateText(primary.overview, 140)}
            </p>
          </div>
        </Link>

        <div className="grid grid-cols-1 gap-4 md:col-span-4">
          {[second, third].map((item, index) => (
            <Link
              key={item.id}
              href={`/watch/${item.mediaType}/${item.id}`}
              className="group relative overflow-hidden rounded-3xl border border-(--border-default) bg-(--bg-elevated) shadow-elevation-3 transition-all duration-500 hover:-translate-y-1 hover:shadow-elevation-4"
            >
              <div className="relative aspect-16/10 md:aspect-16/11">
                <Image
                  src={getTMDBImageUrl(
                    item.backdropPath || item.posterPath,
                    780,
                  )}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#05070e] via-[#05070e]/30 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="mb-2 inline-flex rounded-full border border-white/15 bg-black/35 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/80">
                  Frame {index + 2}
                </div>
                <h3 className="line-clamp-2 text-lg font-extrabold text-white">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
