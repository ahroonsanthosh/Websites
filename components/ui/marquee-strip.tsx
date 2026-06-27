"use client";

import { motion } from "framer-motion";

const items = [
  "Slow Roasted",
  "Cork City",
  "Since 2019",
  "Open Daily",
  "Rotisserie",
  "English Market",
  "Family Recipe",
  "Cork's Favourite",
];

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const repeated = [...items, ...items];
  return (
    <div className="flex overflow-hidden">
      <motion.div
        className="flex shrink-0 gap-0"
        animate={{ x: reverse ? ["0%", "50%"] : ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-0 font-accent text-[11px] tracking-[0.3em] uppercase whitespace-nowrap"
          >
            <span className="text-[#FDF6EB]/40 px-6">{item}</span>
            <span className="text-[#E8622A] text-[8px]">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function MarqueeStrip() {
  return (
    <div className="bg-[#1A0C05] border-y border-[#FDF6EB]/8 py-4 overflow-hidden select-none">
      <MarqueeRow />
    </div>
  );
}
