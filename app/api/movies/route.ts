import { NextRequest, NextResponse } from "next/server";

import { getPopularMovies } from "@/services/tmdb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const pageParam = request.nextUrl.searchParams.get("page");
  const page =
    Number.isFinite(Number(pageParam)) && Number(pageParam) > 0
      ? Number(pageParam)
      : 1;

  try {
    const results = await getPopularMovies(page);

    return NextResponse.json(results, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Failed to fetch popular movies:", error);
    return NextResponse.json([], {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }
}
