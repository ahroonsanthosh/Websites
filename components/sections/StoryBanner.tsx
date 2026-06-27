"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EmberParticles } from "@/components/ui/ember-particles";

const words = ["Slow.", "Fire.", "Flavour."];

export default function StoryBanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#1A0C05] py-24 md:py-36 flex flex-col items-center justify-center text-center"
    >
      <EmberParticles />

      {/* Radial glow behind text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[300px] rounded-full bg-[#E8622A] opacity-10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-accent text-[11px] tracking-[0.35em] uppercase text-[#E8622A] mb-8"
        >
          The Uncle's Way
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {words.map((word, wi) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + wi * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="font-display italic text-5xl sm:text-6xl md:text-8xl font-bold text-[#FDF6EB] cursor-default select-none"
              whileHover={{
                color: "#E8622A",
                scale: 1.08,
                transition: { type: "spring", stiffness: 300, damping: 16 },
              }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-10 text-[#FDF6EB]/50 text-sm md:text-base font-accent tracking-wide max-w-md mx-auto leading-relaxed"
        >
          Every bird we serve has spent hours over open fire. No shortcuts. No timers. Just instinct, heat, and forty years of family know-how.
        </motion.p>
      </div>
    </section>
  );
}
