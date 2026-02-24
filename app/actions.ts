"use server";

import { getDiscovery, getSeasonDetails } from "@/lib/tmdb";
import type { MediaType } from "@/types/movie";

export async function fetchMedia(type: MediaType, page: number) {
  try {
    const data = await getDiscovery(type, "popular", page);
    return data;
  } catch (error) {
    console.error("Error fetching media:", error);
    return [];
  }
}

export async function fetchSeasonEpisodes(mediaId: string, seasonNumber: number) {
   try {
     return await getSeasonDetails(mediaId, seasonNumber);
   } catch {
     return [];
   }
}
