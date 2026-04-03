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
            className="flex items-center gap-3 rounded-full border border-white/10 bg-[#1A1A1D] px-6 py-2.5 transition-all hover:bg-black/80 hover:border-[#D4FF3E]/30 backdrop-blur-md shadow-lg"
          >
            <span className="font-bold text-white tracking-wide">
              {activeSeason?.name || `Season ${selectedSeason}`}
            </span>
            <ChevronDown
              size={18}
              className={cn("transition-transform text-[#D4FF3E]", isOpen && "rotate-180")}
            />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full z-50 mt-3 max-h-[300px] w-56 overflow-y-auto rounded-[2rem] border border-white/10 bg-[#0D0D0F]/95 backdrop-blur-xl shadow-2xl p-2 hide-scrollbar">
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
                        "w-full text-left px-4 py-3 text-sm font-bold rounded-2xl transition-all mb-1",
                        selectedSeason === season.seasonNumber
                          ? "bg-[#D4FF3E]/10 text-[#D4FF3E]"
                          : "text-[#8A8A8E] hover:bg-white/5 hover:text-white",
                      )}
                    >
                      {season.name} <span className="text-xs opacity-70 ml-1 font-medium">({season.episodeCount} eps)</span>
                    </button>
                  ),
                )}
            </div>
          )}
        </div>
      </div>

      {/* Episodes List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4 pt-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-[#1A1A1D] rounded-[2.5rem] animate-pulse border border-white/5"
              />
            ))}
          </div>
        ) : episodes.length > 0 ? (
          <div className="grid gap-4 max-h-[800px] overflow-y-auto pr-2 hide-scrollbar pb-10">
            {episodes.map((ep) => (
              <div
                key={ep.id}
                onClick={() => handleEpisodeSelect(ep.episodeNumber)}
                className={cn(
                  "group flex flex-row cursor-pointer gap-3 sm:gap-6 rounded-3xl sm:rounded-[2.5rem] p-2.5 sm:p-4 transition-all duration-300 shadow-lg border border-transparent",
                  currentSeason === selectedSeason && currentEpisode === ep.episodeNumber
                    ? "border-[#D4FF3E]/30 bg-[#1A1A1D] shadow-[0_10px_30px_-15px_rgba(212,255,62,0.2)]"
                    : "bg-[#1A1A1D] hover:border-white/10 hover:-translate-y-1",
                )}
              >
                <div className="relative h-24 w-36 sm:h-36 sm:w-[240px] shrink-0 overflow-hidden rounded-2xl sm:rounded-4xl bg-[#0D0D0F]">
                  {ep.stillPath ? (
                    <Image
                      src={getTMDBImageUrl(ep.stillPath, "w500")}
                      alt={ep.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] sm:text-xs font-bold text-[#8A8A8E]">
                      NO PREVIEW
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#D4FF3E] flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Play size={16} className="text-black fill-current translate-x-0.5 sm:w-5 sm:h-5" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col flex-1 justify-center min-w-0 pr-1 sm:pr-2 py-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-lg sm:text-2xl font-black text-white/20">
                        {String(ep.episodeNumber).padStart(2, "0")}
                      </span>
                      <h4 className="text-sm sm:text-lg font-bold text-white line-clamp-1 group-hover:text-[#D4FF3E] transition-colors">
                        {ep.name}
                      </h4>
                    </div>
                    {currentSeason === selectedSeason &&
                      currentEpisode === ep.episodeNumber && (
                        <span className="w-fit rounded-full bg-[#D4FF3E] px-2 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-black shadow-lg shrink-0">
                          Now Playing
                        </span>
                      )}
                  </div>
                  
                  <p className="hidden sm:block text-sm font-medium text-[#8A8A8E] line-clamp-2 mb-4 flex-1">
                    {ep.overview || "No description available for this episode."}
                  </p>
                  
                  <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-bold mt-auto">
                    <div className="flex items-center gap-1 sm:gap-1.5 bg-black/40 px-2 sm:px-2.5 py-1 rounded-full text-[#8A8A8E]">
                      <Clock size={12} className="text-[#D4FF3E] sm:w-[14px] sm:h-[14px]" />
                      <span>{ep.runtime || "--"}m</span>
                    </div>
                    {ep.voteAverage > 0 && (
                      <div className="flex items-center gap-1 sm:gap-1.5 bg-[#D4FF3E]/10 border border-[#D4FF3E]/20 px-2 sm:px-2.5 py-1 rounded-full text-[#D4FF3E]">
                        <Star size={12} className="fill-current sm:w-[14px] sm:h-[14px]" />
                        <span>{ep.voteAverage.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-[#8A8A8E] bg-[#1A1A1D] rounded-[2.5rem] border border-white/5">
            <p className="font-bold">No episodes found</p>
            <p className="text-sm mt-1">This season might be unaired or missing data.</p>
          </div>
        )}
      </div>
    </div>
  );
}
