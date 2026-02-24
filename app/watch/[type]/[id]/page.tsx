import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Star, Info } from "lucide-react";

import { SeasonSelector } from "@/components/watch/season-selector";
import { WatchActions } from "@/components/watch/watch-actions";
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
    return {
      title: `Watch ${item.title} · MovieHub`,
      description: item.overview?.slice(0, 160) || "Stream now on MovieHub",
      openGraph: {
        images: [getTMDBImageUrl(item.backdropPath || item.posterPath, "w1280")],
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

  const details = await getMediaDetails(type, id) as MediaDetail;
  if (!details) notFound();

  const streamUrl = buildVidSrcUrl(type, id, { season, episode });

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white selection:bg-[#00f3ff] selection:text-black">
      {/* Background with Overlay */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/90 to-[#050505]/60 z-10" />
        {details.backdropPath && (
          <Image
            src={getTMDBImageUrl(details.backdropPath, "original")}
            alt="Background"
            fill
            className="object-cover opacity-50 blur-sm"
            priority
          />
        )}
      </div>

      <main className="relative z-10 mx-auto max-w-400 p-4 pt-24 md:p-8 md:pt-28 lg:px-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20 mb-6"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_350px] xl:gap-12">
          <div className="space-y-8">
            {/* Player Container */}
            <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-cyan-500/10">
              <iframe
                src={streamUrl}
                className="absolute inset-0 h-full w-full"
                allowFullScreen
                allow="autoplay; encrypted-media; picture-in-picture"
              />
            </div>

            {/* Info Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">
                  {details.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1 text-[#00f3ff]">
                    <Star size={16} fill="currentColor" />
                    <span className="font-bold">{details.voteAverage?.toFixed(1)}</span>
                  </div>
                  {details.releaseDate && (
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{new Date(details.releaseDate).getFullYear()}</span>
                    </div>
                  )}
                  {details.runtime ? (
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>
                    </div>
                  ) : null}
                  {details.numberOfSeasons && (
                    <div className="flex items-center gap-1">
                      <Info size={16} />
                      <span>{details.numberOfSeasons} Seasons</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                   <WatchActions detail={details} />
                   {details.genres && (
                      <div className="flex flex-wrap gap-2">
                        {details.genres.map((g) => (
                          <span key={g.id} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white">
                            {g.name}
                          </span>
                        ))}
                      </div>
                    )}
                </div>

                <p className="max-w-4xl text-lg leading-relaxed text-gray-300">
                  {details.overview}
                </p>
              </div>

               {type === "tv" && details.seasons && (
                 <div className="pb-8 border-b border-white/10">
                    <SeasonSelector mediaId={id} seasons={details.seasons} />
                 </div>
               )}
            </div>

            {/* Cast Section */}
            {details.cast && details.cast.length > 0 && (
              <div className="space-y-4 pt-8 border-t border-white/10">
                <h3 className="text-xl font-semibold text-white">Top Cast</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {details.cast.slice(0, 10).map((actor: CastMember) => (
                    <div key={actor.id} className="flex shrink-0 flex-col gap-2 w-24 text-center">
                      <div className="relative h-24 w-24 mx-auto overflow-hidden rounded-full border-2 border-white/10 bg-neutral-800">
                        {actor.profilePath ? (
                          <Image
                            src={getTMDBImageUrl(actor.profilePath, "w185")}
                            alt={actor.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">No Image</div>
                        )}
                      </div>
                      <p className="text-sm font-medium leading-tight text-white line-clamp-2">{actor.name}</p>
                      <p className="text-xs text-gray-400 line-clamp-1">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recommendations Sidebar */}
          <div className="hidden lg:block space-y-6">
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
               <h3 className="text-lg font-semibold mb-4 text-white">More Like This</h3>
               <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
                 {details.similar.slice(0, 6).map((rec) => (
                   <Link href={`/watch/${type}/${rec.id}`} key={rec.id} className="group flex gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors">
                     <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-md bg-neutral-800">
                       {rec.backdropPath ? (
                         <Image 
                            src={getTMDBImageUrl(rec.backdropPath, "w300")}
                            alt={rec.title || "Movie"}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                         />
                       ) : (
                         <div className="flex h-full w-full items-center justify-center bg-white/5 text-xs text-gray-500">No Image</div>
                       )}
                     </div>
                     <div className="flex flex-col justify-center min-w-0">
                       <h4 className="text-sm font-medium text-white group-hover:text-[#00f3ff] transition-colors line-clamp-2">
                         {rec.title}
                       </h4>
                       <div className="flex items-center gap-1 mt-1">
                         <Star size={12} className="text-[#00f3ff]" fill="currentColor" />
                         <span className="text-xs text-gray-400">{rec.voteAverage?.toFixed(1) || "N/A"}</span>
                       </div>
                     </div>
                   </Link>
                 ))}
                 {details.similar.length === 0 && (
                    <p className="text-sm text-gray-500">No recommendations available.</p>
                 )}
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
