import Link from "next/link";
import { Heart } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="mt-12 border-t border-white/10 bg-black/70">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-gray-400 sm:flex-row sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} MovieHub. All rights reserved.</p>
        <p className="flex items-center gap-2">
          made with
          <Heart size={14} className="text-[#ffa31a]" fill="currentColor" />
          by
          <Link
            href="https://www.dinitha.me"
            target="_blank"
            rel="noreferrer"
            className="text-[#ffd38a] transition-colors hover:text-[#ffa31a]"
          >
            Dinitha
          </Link>
        </p>
      </div>
    </footer>
  );
}
