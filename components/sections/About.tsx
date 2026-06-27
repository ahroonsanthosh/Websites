"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import content from "@/lib/content";
import { assetPath } from "@/lib/asset";
import { RevealText } from "@/components/ui/reveal-text";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { GradientText } from "@/components/ui/gradient-text";

const { about } = content;

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="bg-[#FDF6EB] overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* Left — sticky image stack */}
          <div className="md:sticky md:top-24 py-16 md:py-36">
            <div className="relative h-[300px] sm:h-[380px] md:h-[540px]">
              <motion.div
                initial={{ opacity: 0, x: -40, rotate: -3 }}
                animate={inView ? { opacity: 1, x: 0, rotate: -3 } : {}}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.03, rotate: -1, transition: { type: "spring", stiffness: 250, damping: 20 } }}
                className="absolute top-0 left-0 w-[65%] h-[75%] rounded-2xl overflow-hidden shadow-xl cursor-pointer"
              >
                <img
                  src={assetPath(about.images[0].src)}
                  alt={about.images[0].alt}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0C05]/40 to-transparent" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40, rotate: 4 }}
                animate={inView ? { opacity: 1, x: 0, rotate: 4 } : {}}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.03, rotate: 2, transition: { type: "spring", stiffness: 250, damping: 20 } }}
                className="absolute bottom-0 right-0 w-[60%] h-[65%] rounded-2xl overflow-hidden shadow-xl border-4 border-[#FDF6EB] cursor-pointer"
              >
                <img
                  src={assetPath(about.images[1].src)}
                  alt={about.images[1].alt}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.35 }}
                whileHover={{ scale: 1.12, rotate: 5, transition: { type: "spring", stiffness: 400, damping: 15 } }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-24 h-24 rounded-full bg-[#E8622A] flex flex-col items-center justify-center text-center shadow-2xl border-4 border-[#FDF6EB] cursor-pointer"
              >
                <span className="font-display italic text-white text-[10px] leading-tight font-bold">Est.</span>
                <AnimatedCounter value={about.stats[0].value} className="font-accent text-white text-lg font-bold" />
              </motion.div>
            </div>
          </div>

          {/* Right — scrolling text */}
          <div className="py-16 md:py-36 space-y-16">

            {/* Heading block */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="font-accent text-[11px] tracking-[0.3em] uppercase text-[#E8622A] mb-4"
              >
                Our Story
              </motion.p>

              <h2 className="font-display italic text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A0C05] leading-tight mb-6">
                <RevealText text="Born in the heart of" className="block" delay={0.1} />
                <RevealText text="Cork." className="block" delay={0.4} />
              </h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="space-y-4 text-[#1A0C05]/70 leading-relaxed text-[15px]"
              >
                {about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
              </motion.div>
            </div>

            {/* Gradient pull-quote */}
            <div className="border-l-2 border-[#E8622A]/40 pl-5">
              <p className="font-display italic text-2xl md:text-3xl font-bold leading-snug">
                <GradientText>No shortcuts. No timers. Just fire.</GradientText>
              </p>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="flex gap-8"
            >
              {about.stats.map((s) => (
                <motion.div
                  key={s.label}
                  className="flex flex-col cursor-default"
                  whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 14 } }}
                >
                  <motion.span
                    className="font-display italic text-3xl font-bold text-[#E8622A]"
                    whileHover={{ scale: 1.1, transition: { type: "spring", stiffness: 400, damping: 12 } }}
                  >
                    <AnimatedCounter value={s.value} />
                  </motion.span>
                  <span className="font-accent text-[10px] tracking-[0.2em] uppercase text-[#1A0C05]/50 mt-1">{s.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
