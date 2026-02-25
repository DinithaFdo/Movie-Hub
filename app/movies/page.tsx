import { MediaGrid } from "@/components/sections/media-grid";
import { getDiscovery } from "@/lib/tmdb";

export const revalidate = 3600;

export default async function MoviesPage() {
  const initialMedia = await getDiscovery("movie", "popular", 1);

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/95 to-[#050505]/80" />
      </div>

      <main className="pt-20">
        <MediaGrid
          initialMedia={initialMedia}
          type="movie"
          title="Recommended Movies"
        />
      </main>
    </div>
  );
}
