"use client";

import { motion } from "framer-motion";

const items = [
  "Honest Food",
  "Great Coffee",
  "Cork's Victorian Quarter",
  "Wed – Sun",
  "MacCurtain Street",
  "Seasonal Plates",
  "Slow Mornings",
];

export default function Marquee() {
  const repeated = [...items, ...items];
  return (
    <div className="bg-[var(--orange)] overflow-hidden py-4" aria-hidden="true">
      <motion.div
        className="flex items-center gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-8 flex-shrink-0">
            <span className="font-[var(--font-display)] font-black text-xl md:text-2xl text-white italic">
              {item}
            </span>
            <span className="text-white/60 text-lg">★</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
