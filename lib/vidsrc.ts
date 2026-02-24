import { env } from "@/lib/env";
import type { MediaType } from "@/types/movie";

type VidSrcOptions = {
  season?: string;
  episode?: string;
};

export function buildVidSrcUrl(
  type: MediaType,
  tmdbId: string,
  options?: VidSrcOptions,
): string {
  const baseUrl = env.vidsrcBaseUrl.replace(/\/$/, "");

  if (type === "movie") {
    return `${baseUrl}/movie/${tmdbId}`;
  }

  const season = options?.season?.trim() || "1";
  const episode = options?.episode?.trim() || "1";

  return `${baseUrl}/tv/${tmdbId}/${season}/${episode}`;
}
