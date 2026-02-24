import { MediaGrid } from "@/components/sections/media-grid";
import { getDiscovery } from "@/lib/tmdb";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const revalidate = 3600;

export default async function SeriesPage() {
  const initialMedia = await getDiscovery("tv", "popular", 1);

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/95 to-[#050505]/80" />
      </div>
      
      <main className="pt-20">
        <Suspense fallback={<div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-[#00f3ff]" /></div>}>
          <MediaGrid initialMedia={initialMedia} type="tv" title="TV Series" />
        </Suspense>
      </main>
    </div>
  );
}
