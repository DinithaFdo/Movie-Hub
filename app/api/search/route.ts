import { NextRequest, NextResponse } from "next/server";

import {
  getPopularMovies,
  getPopularTV,
  getTrendingMovies,
  getTrendingTV,
  searchMultiPaginated,
} from "@/services/tmdb";
import type { MovieSummary } from "@/types/movie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix: number[][] = Array.from({ length: rows }, () =>
    new Array<number>(cols).fill(0),
  );

  for (let i = 0; i < rows; i += 1) matrix[i]![0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0]![j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i]![j] = Math.min(
        matrix[i - 1]![j]! + 1,
        matrix[i]![j - 1]! + 1,
        matrix[i - 1]![j - 1]! + cost,
      );
    }
  }

  return matrix[a.length]![b.length]!;
}

function similarityScore(query: string, title: string): number {
  const q = normalizeText(query);
  const t = normalizeText(title);
  if (!q || !t) return 0;

  if (t.includes(q)) return 1;

  const qTokens = q.split(" ").filter(Boolean);
  const tTokens = t.split(" ").filter(Boolean);

  const tokenHitRatio = qTokens.length
    ? qTokens.filter((token) =>
        tTokens.some((candidate) => candidate.includes(token)),
      ).length / qTokens.length
    : 0;

  const maxLength = Math.max(q.length, t.length);
  const distance = levenshteinDistance(q, t);
  const normalizedDistanceScore = maxLength > 0 ? 1 - distance / maxLength : 0;

  return Math.max(tokenHitRatio * 0.8, normalizedDistanceScore);
}

async function getFuzzyFallbackResults(query: string): Promise<MovieSummary[]> {
  const [popularMovies, popularTV, trendingMovies, trendingTV] =
    await Promise.all([
      getPopularMovies(1),
      getPopularTV(1),
      getTrendingMovies(),
      getTrendingTV(),
    ]);

  const candidates = [
    ...popularMovies,
    ...popularTV,
    ...trendingMovies,
    ...trendingTV,
  ];
  const deduped = new Map<string, MovieSummary>();

  for (const item of candidates) {
    deduped.set(`${item.mediaType}:${item.id}`, item);
  }

  return Array.from(deduped.values())
    .map((item) => ({ item, score: similarityScore(query, item.title) }))
    .filter((entry) => entry.score >= 0.55)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map((entry) => entry.item);
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const pageParam = request.nextUrl.searchParams.get("page");
  const page =
    Number.isFinite(Number(pageParam)) && Number(pageParam) > 0
      ? Number(pageParam)
      : 1;

  if (query.length < 2) {
    return NextResponse.json({
      results: [],
      page: 1,
      totalPages: 1,
      totalResults: 0,
    });
  }

  try {
    const payload = await searchMultiPaginated(query, page);

    if (payload.results.length > 0) {
      return NextResponse.json(payload, {
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      });
    }

    const fallbackResults = await getFuzzyFallbackResults(query);
    const fallbackPayload = {
      results: fallbackResults,
      page: 1,
      totalPages: 1,
      totalResults: fallbackResults.length,
    };

    return NextResponse.json(fallbackPayload, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch {
    return NextResponse.json(
      { results: [], page, totalPages: 1, totalResults: 0 },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      },
    );
  }
}
