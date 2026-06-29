"use client";

import { motion } from "framer-motion";

// 21st.dev – Infinite horizontal marquee ticker
const items = [
  "Honest Food",
  "Great Coffee",
  "Cork's Victorian Quarter",
  "Wed – Sun",
  "MacCurtain Street",
  "Seasonal Plates",
  "Slow Mornings",
];

function Track({ reverse = false }: { reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="flex overflow-hidden py-5 border-y border-[rgba(245,239,224,0.1)]">
      <motion.div
        className="flex gap-10 flex-shrink-0 items-center"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-10 flex-shrink-0">
            <span className="font-[var(--font-serif)] text-[clamp(1.2rem,3vw,2rem)] font-light text-[var(--cream)] whitespace-nowrap italic">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--terracotta)] flex-shrink-0" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="bg-[var(--forest)] overflow-hidden py-1" aria-hidden="true">
      <Track />
      <Track reverse />
    </div>
  );
}
