import { NextRequest, NextResponse } from "next/server";
import { getMovieDetails, getTVDetails } from "@/services/tmdb";
import type { MediaType } from "@/types/movie";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = Number(searchParams.get("id"));
  const type = searchParams.get("type") as MediaType;

  if (!id || (type !== "movie" && type !== "tv")) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  try {
    const details = type === "movie" ? await getMovieDetails(id) : await getTVDetails(id);
    const trailer = details.videos?.find(v => v.type === "Trailer" || v.type === "Teaser");
    
    if (trailer) {
      return NextResponse.json({ key: trailer.key });
    }
    
    return NextResponse.json({ key: null });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
