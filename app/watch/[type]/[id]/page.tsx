import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Star, Info, Play } from "lucide-react";

import { SeasonSelector } from "@/components/watch/season-selector";
import { WatchActions } from "@/components/watch/watch-actions";
import { TheaterPlayer } from "@/components/watch/theater-player";
import { getMediaDetails, getTMDBImageUrl } from "@/lib/tmdb";
import { buildVidSrcUrl } from "@/lib/vidsrc";
import type { MediaType, CastMember, MediaDetail } from "@/types/movie";

type WatchPageParams = {
  type: string;
  id: string;
};

function isMediaType(value: string): value is MediaType {
  return value === "movie" || value === "tv";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<WatchPageParams>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { id, type } = resolvedParams;

  if (!isMediaType(type)) return { title: "Not Found" };

  try {
    const item = await getMediaDetails(type as MediaType, id);
    const mediaLabel = type === "tv" ? "TV Series" : "Movie";
    const shareTitle = `Watch ${item.title} (${mediaLabel}) on MovieHub`;
    const shareDescription =
      item.overview?.slice(0, 160) || `Stream ${item.title} on MovieHub`;
    const previewImage = getTMDBImageUrl(
      item.backdropPath || item.posterPath,
      "w1280",
    );
    const canonicalUrl = `/watch/${type}/${id}`;

    return {
      title: shareTitle,
      description: shareDescription,
      openGraph: {
        title: shareTitle,
        description: shareDescription,
        url: canonicalUrl,
        images: [previewImage],
      },
      twitter: {
        card: "summary_large_image",
        title: shareTitle,
        description: shareDescription,
        images: [previewImage],
      },
    };
  } catch {
    return { title: "Error · MovieHub" };
  }
}

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<WatchPageParams>;
  searchParams: Promise<{ season?: string; episode?: string }>;
}) {
  const { type, id } = await params;
  const { season, episode } = await searchParams;

  if (!isMediaType(type)) notFound();

  const details = (await getMediaDetails(type, id)) as MediaDetail;
  if (!details) notFound();

  const streamUrl = buildVidSrcUrl(type, id, { season, episode });

  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-[#0D0D0F] text-white">
      {/* Ambient backdrop */}
      <div className="absolute top-0 left-0 right-0 h-[70vh] z-0 pointer-events-none">
        {details.backdropPath && (
          <Image
            src={getTMDBImageUrl(details.backdropPath, "original")}
            alt="Background"
            fill
            className="object-cover opacity-20"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0D0D0F]/70 to-[#0D0D0F]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0F]/60 via-transparent to-[#0D0D0F]/60" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-[1800px] px-4 sm:px-6 md:px-10 lg:px-16 pt-24 sm:pt-28 pb-24">

        {/* ─── Player ─── */}
        <div className="max-w-[1400px] mx-auto">
          <TheaterPlayer streamUrl={streamUrl} title={details.title} />
        </div>

        {/* ─── Content below player ─── */}
        <div className="max-w-[1400px] mx-auto mt-10 sm:mt-14">

          {/* ─── Two-column layout on large screens ─── */}
          <div className="flex flex-col lg:flex-row gap-10 xl:gap-14">

            {/* ══ LEFT COLUMN: Info + Seasons + Cast ══ */}
            <div className="flex-1 min-w-0 space-y-10">

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="bg-[#D4FF3E] text-black text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {type === "tv" ? "TV Series" : "Movie"}
                </span>
                <span className="bg-[#1A1A1D] border border-white/10 text-white text-[11px] font-black px-3 py-1 rounded-full">
                  HD
                </span>
                {details.releaseDate && (
                  <span className="text-[#8A8A8E] text-sm font-bold">
                    {new Date(details.releaseDate).getFullYear()}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.1]">
                {details.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-[#8A8A8E] font-medium border-b border-white/5 pb-6">
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-[#D4FF3E] fill-current" />
                  <span className="text-white font-bold text-base">
                    {details.voteAverage?.toFixed(1)}
                  </span>
                </div>
                {details.runtime ? (
                  <div className="flex items-center gap-2 text-white">
                    <Clock size={15} />
                    <span>
                      {Math.floor(details.runtime / 60)}h{" "}
                      {details.runtime % 60}m
                    </span>
                  </div>
                ) : null}
                {details.numberOfSeasons && (
                  <div className="flex items-center gap-2 text-white">
                    <Info size={15} />
                    <span>{details.numberOfSeasons} Seasons</span>
                  </div>
                )}
              </div>

              {/* Actions + Genres */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <WatchActions detail={details} />
                {details.genres && (
                  <div className="flex flex-wrap gap-2">
                    {details.genres.map((g) => (
                      <span
                        key={g.id}
                        className="rounded-full border border-[#D4FF3E]/25 bg-[#1A1A1D] px-3 py-1 text-xs font-bold text-[#D4FF3E]"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Overview */}
              <p className="text-base sm:text-lg leading-relaxed text-[#8A8A8E] font-medium max-w-2xl">
                {details.overview}
              </p>

              {/* TV Season Selector */}
              {type === "tv" && details.seasons && (
                <div className="pt-2">
                  <SeasonSelector mediaId={id} seasons={details.seasons} />
                </div>
              )}

              {/* Top Cast */}
              {details.cast && details.cast.length > 0 && (
                <div className="space-y-5 pt-4">
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Top Cast
                  </h3>
                  <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
                    {details.cast.slice(0, 12).map((actor: CastMember) => (
                      <div
                        key={actor.id}
                        className="flex flex-col gap-3 w-[120px] sm:w-[140px] shrink-0 snap-start group cursor-pointer"
                      >
                        <div className="relative h-[160px] sm:h-[190px] w-full overflow-hidden rounded-3xl bg-[#1A1A1D] border border-white/5 shadow-lg transition-all duration-300 group-hover:-translate-y-2 group-hover:border-[#D4FF3E]/30 group-hover:shadow-[0_8px_30px_-10px_rgba(212,255,62,0.25)]">
                          {actor.profilePath ? (
                            <Image
                              src={getTMDBImageUrl(actor.profilePath, "w185")}
                              alt={actor.name}
                              fill
                              className="object-cover object-top"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#8A8A8E] bg-[#1A1A1D]">
                              N/A
                            </div>
                          )}
                          {/* Subtle gradient at bottom */}
                          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <div>
                          <p className="text-[13px] sm:text-sm font-bold text-white line-clamp-1 group-hover:text-[#D4FF3E] transition-colors">
                            {actor.name}
                          </p>
                          <p className="text-[11px] sm:text-[13px] font-medium text-[#8A8A8E] line-clamp-1 mt-0.5">
                            {actor.character}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* More to Watch — mobile horizontal scroll */}
              {details.similar.length > 0 && (
                <div className="space-y-5 pt-4 lg:hidden">
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    More to Watch
                  </h3>
                  <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
                    {details.similar.slice(0, 10).map((rec) => (
                      <Link
                        href={`/watch/${type}/${rec.id}`}
                        key={rec.id}
                        className="group shrink-0 w-[200px] sm:w-[240px] snap-start"
                      >
                        <div className="relative h-[130px] sm:h-[150px] w-full overflow-hidden rounded-3xl bg-[#1A1A1D] border border-transparent group-hover:border-[#D4FF3E]/30 transition-all duration-300 shadow-lg">
                          {rec.backdropPath ? (
                            <Image
                              src={getTMDBImageUrl(rec.backdropPath, "w500")}
                              alt={rec.title || "Movie"}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-white/5 text-xs text-[#8A8A8E]">N/A</div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                          {/* Play on hover */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-10 h-10 rounded-full bg-[#D4FF3E] flex items-center justify-center shadow-lg scale-75 group-hover:scale-100 transition-transform duration-300">
                              <Play size={16} className="text-black fill-current translate-x-0.5" />
                            </div>
                          </div>
                          <div className="absolute inset-x-0 bottom-0 p-3">
                            <h4 className="line-clamp-1 text-sm font-bold text-white group-hover:text-[#D4FF3E] transition-colors">
                              {rec.title}
                            </h4>
                            <span className="text-[11px] font-bold text-[#D4FF3E]">
                              ★ {rec.voteAverage?.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ══ RIGHT COLUMN: Recommendations sidebar ══ */}
            {details.similar.length > 0 && (
              <div className="hidden lg:flex flex-col gap-5 w-[340px] xl:w-[380px] shrink-0">
                <h3 className="text-2xl font-black text-white tracking-tight">
                  More to Watch
                </h3>
                <div className="flex flex-col gap-4 max-h-[calc(100vh-180px)] overflow-y-auto hide-scrollbar pr-1">
                  {details.similar.slice(0, 10).map((rec) => (
                    <Link
                      href={`/watch/${type}/${rec.id}`}
                      key={rec.id}
                      className="group flex gap-4 items-start bg-[#1A1A1D] rounded-3xl p-3 border border-white/5 hover:border-[#D4FF3E]/25 transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-[110px] xl:w-[130px] h-[75px] xl:h-[85px] shrink-0 rounded-2xl overflow-hidden bg-black border border-white/5">
                        {rec.backdropPath ? (
                          <Image
                            src={getTMDBImageUrl(rec.backdropPath, "w300")}
                            alt={rec.title || "Movie"}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-white/5 text-[10px] text-[#8A8A8E]">N/A</div>
                        )}
                        {/* play icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-8 h-8 rounded-full bg-[#D4FF3E] flex items-center justify-center shadow-md">
                            <Play size={12} className="text-black fill-current translate-x-px" />
                          </div>
                        </div>
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0 py-1">
                        <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-[#D4FF3E] transition-colors">
                          {rec.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[11px] font-black text-[#D4FF3E]">
                            ★ {rec.voteAverage?.toFixed(1) || "N/A"}
                          </span>
                          {rec.releaseDate && (
                            <span className="text-[11px] font-bold text-[#8A8A8E]">
                              {rec.releaseDate.substring(0, 4)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
