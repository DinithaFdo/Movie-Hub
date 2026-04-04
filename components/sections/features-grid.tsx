"use client";

import { motion } from "framer-motion";
import { MonitorPlay, Smartphone, Download } from "lucide-react";

export function FeaturesGrid() {
  const features = [
    {
      title: "Watch anywhere",
      description: "Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.",
      icon: MonitorPlay,
    },
    {
      title: "Ad-free",
      description: "Enjoy uninterrupted entertainment without any annoying advertisements.",
      icon: Smartphone,
    },
    {
      title: "No account required",
      description: "Start streaming instantly without the hassle of signing up or logging in.",
      icon: Download,
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-20 pb-16 md:pb-32">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
        >
          What's Different?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[var(--text-secondary)] text-lg"
        >
          Enjoy the most premium features of Cinestream
        </motion.p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15 }}
            whileHover={{ y: -10 }}
            className="group bg-[#1A1A1D] rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-8 transition-all hover:bg-[#202024] hover:shadow-[0_0_30px_rgba(212,255,62,0.1)] border border-transparent hover:border-[#D4FF3E]/30"
          >
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/40 flex items-center justify-center mb-4 md:mb-8 border border-white/5 group-hover:border-[#D4FF3E]/50 transition-colors">
              <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-[#D4FF3E]" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">{feature.title}</h3>
            <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
