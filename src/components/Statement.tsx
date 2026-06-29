"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Diagonal rotating marquee band — inspired by Hen's Teeth "Useful Links" section
function DiagonalMarquee({ text, reverse = false }: { text: string; reverse?: boolean }) {
  const repeated = `${text} ★ `.repeat(8);
  return (
    <div
      className="overflow-hidden py-3 bg-[var(--charcoal)]"
      style={{ transform: "rotate(-2.5deg)", margin: "0 -40px" }}
    >
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: reverse ? ["0%", "50%"] : ["0%", "-50%"] }}
        transition={{ duration: 18, ease: "linear", repeat: Infinity }}
      >
        <span className="font-[var(--font-display)] font-black text-[clamp(1.5rem,4vw,2.5rem)] text-[var(--cream)] whitespace-nowrap pr-8 italic">
          {repeated}
        </span>
        <span className="font-[var(--font-display)] font-black text-[clamp(1.5rem,4vw,2.5rem)] text-[var(--cream)] whitespace-nowrap pr-8 italic">
          {repeated}
        </span>
      </motion.div>
    </div>
  );
}

export default function Statement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <div ref={ref} className="overflow-hidden py-10 md:py-14 my-4 bg-[var(--warm-white)]" aria-hidden="true">
      <motion.div style={{ y }}>
        <DiagonalMarquee text="Honest food · Great coffee · Cork" />
        <div className="py-2" />
        <DiagonalMarquee text="Wed–Sun · MacCurtain Street · Victorian Quarter" reverse />
      </motion.div>
    </div>
  );
}
