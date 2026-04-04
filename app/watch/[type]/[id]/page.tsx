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
      {/* Background with Deep Overlay */}
      <div className="absolute top-0 left-0 right-0 h-[80vh] z-0 pointer-events-none">
        {details.backdropPath && (
          <Image
            src={getTMDBImageUrl(details.backdropPath, "original")}
            alt="Background"
            fill
            className="object-cover opacity-30 mask-image-gradient"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0F] via-[#0D0D0F]/80 to-transparent" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-[1800px] overflow-x-clip px-4 pt-32 pb-20 md:px-8 lg:px-12">
        
        <TheaterPlayer streamUrl={streamUrl} title={details.title} />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px] mt-16 max-w-[1400px] mx-auto">
          
          <div className="space-y-10">
            {/* Core Info Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[#D4FF3E] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {type === "tv" ? "TV Series" : "Movie"}
                </span>
                <span className="bg-[#1A1A1D] border border-white/10 text-white text-xs font-bold px-3 py-1 rounded-full">
                  HD
                </span>
                {details.releaseDate && (
                  <span className="text-[#8A8A8E] text-sm font-bold">
                    {new Date(details.releaseDate).getFullYear()}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 drop-shadow-lg">
                {details.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 mb-8 text-[#8A8A8E] font-medium border-b border-white/5 pb-8">
                <div className="flex items-center gap-2">
                  <Star size={20} className="text-[#D4FF3E] fill-current" />
                  <span className="text-white font-bold text-lg">
                    {details.voteAverage?.toFixed(1)}
                  </span>
                </div>
                
                {details.runtime ? (
                  <div className="flex items-center gap-2 text-white">
                    <Clock size={16} />
                    <span>
                      {Math.floor(details.runtime / 60)}h{" "}
                      {details.runtime % 60}m
                    </span>
                  </div>
                ) : null}
                
                {details.numberOfSeasons && (
                  <div className="flex items-center gap-2 text-white">
                    <Info size={16} />
                    <span>{details.numberOfSeasons} Seasons</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-8">
                <WatchActions detail={details} />
                {details.genres && (
                  <div className="flex flex-wrap gap-2 ml-4">
                    {details.genres.map((g) => (
                      <span
                        key={g.id}
                        className="rounded-full border border-[#D4FF3E]/30 bg-[#1A1A1D] px-4 py-1.5 text-xs font-bold text-[#D4FF3E]"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <p className="max-w-3xl text-lg leading-relaxed text-[#8A8A8E] font-medium">
                {details.overview}
              </p>
            </div>

            {/* TV Season Selector */}
            {type === "tv" && details.seasons && (
              <div className="pt-4">
                <SeasonSelector mediaId={id} seasons={details.seasons} />
              </div>
            )}

            {/* Premium Actor Cast Cards */}
            {details.cast && details.cast.length > 0 && (
              <div className="space-y-6 pt-10">
                <h3 className="text-3xl font-bold text-white tracking-tight">Top Cast</h3>
                <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar snap-x snap-mandatory">
                  {details.cast.slice(0, 10).map((actor: CastMember) => (
                    <div
                      key={actor.id}
                      className="flex flex-col gap-3 w-[140px] shrink-0 snap-start group cursor-pointer"
                    >
                      <div className="relative h-[200px] w-full overflow-hidden rounded-3xl bg-[#1A1A1D] border border-white/5 shadow-xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:border-[#D4FF3E]/30">
                        {actor.profilePath ? (
                          <Image
                            src={getTMDBImageUrl(actor.profilePath, "w185")}
                            alt={actor.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#8A8A8E]">
                            N/A
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-white line-clamp-1 group-hover:text-[#D4FF3E] transition-colors">{actor.name}</p>
                        <p className="text-[13px] font-medium text-[#8A8A8E] line-clamp-1">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Mobile Recommendations */}
            {details.similar.length > 0 && (
              <div className="space-y-6 pt-10 lg:hidden">
                <h3 className="text-3xl font-bold text-white tracking-tight">More to Watch</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
                  {details.similar.slice(0, 8).map((rec) => (
                    <Link
                      href={`/watch/${type}/${rec.id}`}
                      key={rec.id}
                      className="group shrink-0 w-[240px] snap-center"
                    >
                      <div className="relative h-[160px] w-full overflow-hidden rounded-[2rem] bg-[#1A1A1D] border border-transparent group-hover:border-[#D4FF3E]/30 transition-all shadow-xl">
                        {rec.backdropPath ? (
                          <Image
                            src={getTMDBImageUrl(rec.backdropPath, "w300")}
                            alt={rec.title || "Movie"}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-white/5">N/A</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-4">
                           <h4 className="line-clamp-1 text-sm font-bold text-white group-hover:text-[#D4FF3E] transition-colors">
                             {rec.title}
                           </h4>
                           <div className="flex items-center gap-1 mt-1 text-xs font-bold text-[#8A8A8E]">
                              <span className="text-[#D4FF3E]">★ {rec.voteAverage?.toFixed(1)}</span>
                           </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recommendations Sidebar - Grid Stacked */}
          <div className="hidden lg:block space-y-8 pl-4">
            <h3 className="text-3xl font-bold mb-6 text-white tracking-tight">More Like This</h3>
            <div className="grid grid-cols-1 gap-6">
              {details.similar.slice(0, 6).map((rec) => (
                <Link
                  href={`/watch/${type}/${rec.id}`}
                  key={rec.id}
                  className="group relative h-[220px] w-full overflow-hidden rounded-[2.5rem] bg-[#1A1A1D] shadow-xl border border-transparent transition-all hover:-translate-y-2 hover:border-[#D4FF3E]/30"
                >
                    {rec.backdropPath ? (
                      <Image
                        src={getTMDBImageUrl(rec.backdropPath, "w500")}
                        alt={rec.title || "Movie"}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                       <div className="flex h-full w-full items-center justify-center bg-white/5">N/A</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    
                    <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#D4FF3E] text-black flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-xl">
                       <Play className="w-5 h-5 fill-current" />
                    </button>

                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <h4 className="line-clamp-2 text-lg font-bold text-white drop-shadow-md">
                        {rec.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-2">
                         <span className="text-xs font-bold bg-[#D4FF3E]/10 border border-[#D4FF3E]/20 text-[#D4FF3E] px-2 py-0.5 rounded-full backdrop-blur-md">
                            ★ {rec.voteAverage?.toFixed(1) || "N/A"}
                         </span>
                         <span className="text-xs font-bold text-[#8A8A8E] bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-md">
                            {rec.releaseDate?.substring(0,4)}
                         </span>
                      </div>
                    </div>
                </Link>
              ))}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
