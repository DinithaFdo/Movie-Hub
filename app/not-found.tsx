import Link from "next/link";
import { Clapperboard, ArrowLeft, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,163,26,0.18),transparent_45%),radial-gradient(circle_at_80%_90%,rgba(255,163,26,0.12),transparent_40%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ffa31a]/40 bg-[#151515]/85 px-4 py-2 text-[#ffd38a] backdrop-blur">
          <Clapperboard size={16} />
          <span className="text-xs font-semibold uppercase tracking-widest">
            MovieHub
          </span>
        </div>

        <h1 className="text-7xl font-black tracking-tight text-[#ffa31a] sm:text-8xl md:text-9xl">
          404
        </h1>
        <p className="mt-3 text-2xl font-bold sm:text-3xl">Scene Not Found</p>
        <p className="mt-4 max-w-xl text-sm text-[#a3a3a3] sm:text-base">
          The page you are looking for is missing, removed, or moved to another
          location.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/">
            <Button className="gap-2">
              <ArrowLeft size={16} />
              Back to Home
            </Button>
          </Link>
          <Link href="/movies">
            <Button variant="outline" className="gap-2">
              <Search size={16} />
              Browse Movies
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
