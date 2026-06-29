"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

// 21st.dev – large kinetic type with scroll-driven transform
export default function Statement() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const lineRef = useRef<HTMLDivElement>(null);
  const lineInView = useInView(lineRef, { once: true });

  return (
    <section
      ref={ref}
      className="py-24 md:py-36 bg-[var(--cream)] overflow-hidden relative"
      aria-hidden="true"
    >
      {/* Background texture */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{ opacity }}
        aria-hidden="true"
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, var(--charcoal) 39px, var(--charcoal) 40px)`,
          }}
        />
      </motion.div>

      {/* Line 1 – drifts left */}
      <motion.div style={{ x: x1 }}>
        <p className="font-[var(--font-serif)] text-[clamp(3.5rem,11vw,9rem)] leading-[1] font-light text-[var(--charcoal)] whitespace-nowrap pl-6">
          Slow mornings. Good coffee.
        </p>
      </motion.div>

      {/* Divider with animated dot */}
      <div ref={lineRef} className="flex items-center gap-4 px-6 md:px-12 my-6">
        <motion.div
          className="h-px bg-[var(--terracotta)] origin-left"
          initial={{ scaleX: 0 }}
          animate={lineInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          style={{ width: "clamp(60px, 15vw, 160px)" }}
        />
        <motion.span
          className="font-[var(--font-sans)] text-[9px] tracking-[0.3em] uppercase text-[var(--terracotta)]"
          initial={{ opacity: 0 }}
          animate={lineInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Bayou, Cork
        </motion.span>
      </div>

      {/* Line 2 – drifts right */}
      <motion.div style={{ x: x2 }} className="flex justify-end pr-6">
        <p className="font-[var(--font-serif)] italic text-[clamp(3.5rem,11vw,9rem)] leading-[1] font-light text-[rgba(26,26,24,0.12)] whitespace-nowrap">
          A place to be.
        </p>
      </motion.div>
    </section>
  );
}
