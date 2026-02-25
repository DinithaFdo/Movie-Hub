"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Play, Clock, Star } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { fetchSeasonEpisodes } from "@/app/actions";
import { getTMDBImageUrl } from "@/lib/tmdb";
import type { Season, Episode } from "@/types/movie";

interface SeasonSelectorProps {
  mediaId: string;
  seasons: Season[];
}

export function SeasonSelector({ mediaId, seasons }: SeasonSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSeason = Number(searchParams.get("season")) || 1;
  const currentEpisode = Number(searchParams.get("episode")) || 1;

  const [selectedSeason, setSelectedSeason] = useState(currentSeason);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function loadEpisodes() {
      setLoading(true);
      const data = await fetchSeasonEpisodes(mediaId, selectedSeason);
      setEpisodes(data);
      setLoading(false);
    }
    loadEpisodes();
  }, [mediaId, selectedSeason]);

  const handleEpisodeSelect = (episodeNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("season", selectedSeason.toString());
    params.set("episode", episodeNum.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const activeSeason = seasons.find((s) => s.seasonNumber === selectedSeason);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Episodes</h3>

        {/* Season Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 rounded-lg border border-[#ffa31a]/35 bg-[#1a1a1a] px-4 py-2 transition-colors hover:bg-[#ffa31a]/15"
          >
            <span className="font-medium text-white">
              {activeSeason?.name || `Season ${selectedSeason}`}
            </span>
            <ChevronDown
              size={16}
              className={cn("transition-transform", isOpen && "rotate-180")}
            />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full z-20 mt-2 max-h-60 w-48 overflow-y-auto rounded-lg border border-[#2a2a2a] bg-[#111111] shadow-xl custom-scrollbar">
              {seasons
                .filter((s) => s.seasonNumber > 0)
                .map(
                  (
                    season, // Filter out Season 0 (Specials) if desired
                  ) => (
                    <button
                      key={season.id}
                      onClick={() => {
                        setSelectedSeason(season.seasonNumber);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors",
                        selectedSeason === season.seasonNumber
                          ? "text-[#ffa31a]"
                          : "text-gray-300",
                      )}
                    >
                      {season.name} ({season.episodeCount} eps)
                    </button>
                  ),
                )}
            </div>
          )}
        </div>
      </div>

      {/* Episodes List */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-white/5 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : episodes.length > 0 ? (
          <div className="grid gap-3 max-h-150 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
            {episodes.map((ep) => (
              <div
                key={ep.id}
                onClick={() => handleEpisodeSelect(ep.episodeNumber)}
                className={cn(
                  "group flex w-full min-w-0 cursor-pointer flex-col gap-3 rounded-lg border border-transparent p-3 transition-all hover:border-[#ffa31a]/40 hover:bg-[#ffa31a]/10 sm:flex-row sm:gap-4",
                  currentSeason === selectedSeason &&
                    currentEpisode === ep.episodeNumber
                    ? "border-[#ffa31a]/60 bg-[#ffa31a]/15"
                    : "bg-transparent",
                )}
              >
                <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-md bg-neutral-800 sm:h-20 sm:w-36">
                  {ep.stillPath ? (
                    <Image
                      src={getTMDBImageUrl(ep.stillPath, "w300")}
                      alt={ep.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                      No Preview
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play
                      size={24}
                      fill="white"
                      className="text-white drop-shadow-lg"
                    />
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="line-clamp-2 text-sm font-semibold text-white sm:truncate sm:max-w-50">
                      {ep.episodeNumber}. {ep.name}
                    </span>
                    {currentSeason === selectedSeason &&
                      currentEpisode === ep.episodeNumber && (
                        <span className="rounded bg-[#ffa31a] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
                          Now Playing
                        </span>
                      )}
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                    {ep.overview || "No description available."}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{ep.runtime}m</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star
                        size={12}
                        className="text-[#ffa31a]"
                        fill="currentColor"
                      />
                      <span>{ep.voteAverage?.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No episodes found for this season.
          </div>
        )}
      </div>
    </div>
  );
}
