"use client";

import { Instagram, Twitter, Linkedin, Github } from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function NewsletterFooter() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  // Moves from right to left smoothly as you scroll down
  const x = useTransform(scrollYProgress, [0, 1], ["50%", "-10%"]);

  return (
    <footer ref={containerRef} className="w-full relative overflow-hidden bg-[#0D0D0F] pt-24 pb-12 border-t border-white/5">
      
      {/* Massive Moving Text Effect */}
      <div className="w-full overflow-hidden flex items-center justify-center py-12 md:py-24 select-none relative z-0">
         <motion.div 
           style={{ x }}
           className="text-[12rem] md:text-[20rem] lg:text-[28rem] font-black tracking-tighter text-white/5 whitespace-nowrap leading-none"
         >
            MOVIE HUB
         </motion.div>
         {/* Second layer for a slight glowing effect overlaid */}
         <motion.div 
           style={{ x: useTransform(scrollYProgress, [0, 1], ["40%", "-20%"]) }}
           className="absolute text-[12rem] md:text-[20rem] lg:text-[28rem] font-black tracking-tighter text-transparent [-webkit-text-stroke:2px_rgba(212,255,62,0.1)] whitespace-nowrap leading-none mix-blend-screen"
         >
            MOVIE HUB
         </motion.div>
      </div>

      {/* Clean Dark Footer Links Area */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-8 md:px-16 mt-[-100px] md:mt-[-200px]">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-16 lg:gap-8 mb-8 backdrop-blur-md bg-black/20 p-8 md:p-12 rounded-[3rem] border border-white/5">
          
          {/* Brand Col */}
          <div className="max-w-md">
            <h3 className="text-3xl font-black tracking-tight text-white mb-4">MOVIEHUB</h3>
            <p className="text-[#8A8A8E] text-base leading-relaxed mb-8 font-medium">
              Your ultimate destination for endless streaming. Access thousands of movies and TV shows completely ad-free, anywhere, anytime.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-black hover:bg-[#D4FF3E] transition-all"><Instagram size={18} /></Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-black hover:bg-[#D4FF3E] transition-all"><Twitter size={18} /></Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-black hover:bg-[#D4FF3E] transition-all"><Linkedin size={18} /></Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-black hover:bg-[#D4FF3E] transition-all"><Github size={18} /></Link>
            </div>
          </div>

          {/* Core Links */}
          <div className="flex items-center gap-8 md:gap-16 w-full lg:w-auto">
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-2">Navigation</h4>
              <Link href="/" className="text-[#8A8A8E] text-base font-semibold hover:text-[#D4FF3E] transition-colors">Home</Link>
              <Link href="/movies" className="text-[#8A8A8E] text-base font-semibold hover:text-[#D4FF3E] transition-colors">Movies</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-2 opacity-0">Hidden</h4>
              <Link href="/tv" className="text-[#8A8A8E] text-base font-semibold hover:text-[#D4FF3E] transition-colors">TV Shows</Link>
              <Link href="/favorites" className="text-[#8A8A8E] text-base font-semibold hover:text-[#D4FF3E] transition-colors">Favorites</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center relative w-full pt-8 border-t border-white/5 pb-32 md:pb-48">
           <div className="flex gap-8">
             <Link href="#" className="text-[#8A8A8E] text-sm font-semibold hover:text-white transition-colors">Privacy Policy</Link>
             <Link href="#" className="text-[#8A8A8E] text-sm font-semibold hover:text-white transition-colors">Terms of Service</Link>
           </div>
        </div>
      </div>

      {/* Massive Half-Hidden Green Container */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[50%] w-[95%] md:w-[80%] max-w-6xl h-[300px] bg-[#D4FF3E] rounded-[4rem] flex items-start justify-center z-20 shadow-[0_-20px_80px_rgba(212,255,62,0.15)] pointer-events-auto">
         <div className="mt-12 text-center px-4 flex flex-col items-center">
            <h3 className="text-black text-2xl md:text-3xl font-black tracking-tight mb-2">
               Made with ❤️ by Dinitha
            </h3>
            <a href="https://www.dinitha.me" target="_blank" rel="noreferrer" className="text-black/60 hover:text-black font-bold text-sm md:text-lg underline underline-offset-4 decoration-2 transition-all cursor-pointer">
               www.dinitha.me
            </a>
         </div>
      </div>
    </footer>
  );
}
