"use client";

import Link from "next/link";
import { Clapperboard, Home, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0D0D0F] text-white flex items-center justify-center">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,255,62,0.05),transparent_60%)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-4xl flex flex-col items-center justify-center px-6 text-center"
      >
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-white backdrop-blur shadow-xl">
          <Clapperboard size={18} className="text-[#D4FF3E]" />
          <span className="text-sm font-bold tracking-widest uppercase">
            MovieHub
          </span>
        </div>

        <h1 className="text-8xl md:text-[12rem] font-black tracking-tight text-[#D4FF3E] leading-none drop-shadow-[0_0_80px_rgba(212,255,62,0.3)]">
          404
        </h1>
        <p className="mt-6 text-3xl font-black md:text-5xl tracking-tight text-white drop-shadow-xl">
          Scene Not Found
        </p>
        <p className="mt-4 max-w-lg text-lg text-[#8A8A8E] font-medium leading-relaxed">
          Looks like this scene ended up on the cutting room floor. Let's get you back to the premier.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 bg-[#D4FF3E] text-black font-black uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white hover:scale-105 transition-all w-full sm:w-auto shadow-[0_0_40px_rgba(212,255,62,0.2)]"
          >
            <Home size={20} />
            Back to Home
          </Link>
          <Link 
            href="/movies"
            className="flex items-center justify-center gap-2 border-2 border-white/10 bg-black/50 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:border-[#D4FF3E] hover:text-[#D4FF3E] hover:bg-black transition-all w-full sm:w-auto backdrop-blur-md"
          >
            <Search size={20} />
            Browse Movies
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
