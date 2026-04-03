"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePreloader } from "@/components/context/preloader-context";

export function Preloader() {
  const { hasLoaded, setHasLoaded } = usePreloader();
  const [phase, setPhase] = useState<"letters" | "combined">("letters");

  useEffect(() => {
    if (hasLoaded) return;
    
    // Switch from individual letters to combined string after 1.8s
    const phaseTimer = setTimeout(() => {
      setPhase("combined");
    }, 1800);

    // Unmount entire preloader at 2.6s to trigger layout float to navbar
    const removeTimer = setTimeout(() => {
      setHasLoaded(true);
    }, 2400);

    return () => {
      clearTimeout(phaseTimer);
      clearTimeout(removeTimer);
    };
  }, [hasLoaded, setHasLoaded]);

  if (hasLoaded) return null;

  const text = "MOVIEHUB";
  const letters = Array.from(text);

  return (
    <AnimatePresence>
      {!hasLoaded && (
        <motion.div
          key="preloader"
          exit={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0D0D0F]"
        >
          <div className="relative text-3xl md:text-5xl lg:text-7xl font-black tracking-tight text-[#D4FF3E] flex items-center justify-center">
            {phase === "letters" ? (
              <div className="flex">
                {letters.map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.1,
                      ease: [0.215, 0.61, 0.355, 1], // cubic-bezier smooth ease-out
                    }}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            ) : (
              // This is the combined tag bridging to the layoutId="logo" in Navbar
              <motion.span
                layoutId="logo"
                className="inline-block"
              >
                MOVIEHUB
              </motion.span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
