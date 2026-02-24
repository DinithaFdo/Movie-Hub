# Movie Hub

Modern, cinematic movie streaming discovery UI built with Next.js App Router using:

- **TMDB** for discovery data (trending, popular, top-rated, now playing, search)
- **VidSrc** for video embed playback
- **Server-first caching strategy** tuned for Vercel free tier

## Setup

1. Copy the environment file:

```bash
cp .env.example .env.local
```

2. Add your TMDB key in `.env.local`:

```env
TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_VIDSRC_BASE_URL=https://vidsrc.cc/v2/embed
```

3. Install and run:

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

VidSrc URL pattern used by the app:

- Movie: `${NEXT_PUBLIC_VIDSRC_BASE_URL}/movie/{tmdbId}`
- TV: `${NEXT_PUBLIC_VIDSRC_BASE_URL}/tv/{tmdbId}/{season}/{episode}` (defaults to `1/1`)

## Architecture

Core structure:

- `app/` → routes (`/`, `/watch/[type]/[id]`, `/api/search`)
- `components/` → UI modules (layout, search, cards, skeletons, theme)
- `lib/` → TMDB client, VidSrc URL builder, env helpers
- `types/` → shared domain types

Design goals:

- Modular and scalable components
- Clear server/client boundaries
- Suspense + route loading for premium skeleton experience

## Caching Strategy (Vercel-Friendly)

Implemented recommendations:

- TMDB fetches use `next.revalidate`:
  - Trending: 1h
  - Now Playing / Popular: 30m
  - Top Rated: 4h
  - Details: 12h
  - Search API: 5m
- Search route sets `Cache-Control: public, s-maxage=300, stale-while-revalidate=86400`

Why this helps:

- Reduces duplicate TMDB requests
- Keeps perceived performance high
- Protects free-tier quotas and limits origin pressure

## Additional Recommendations

- Add Redis (Upstash) for edge query caching if traffic grows.
- Add auth + user watchlist with a DB (Neon/Postgres + Prisma).
- Add error boundaries for external API/network faults.
- Add analytics and A/B testing before award submissions.
