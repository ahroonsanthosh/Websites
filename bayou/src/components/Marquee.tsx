"use client";

import { motion } from "framer-motion";
import RiverDivider from "./RiverDivider";

const items = [
  "Honest Food",
  "Great Coffee",
  "Cork's Victorian Quarter",
  "Wed – Sun",
  "MacCurtain Street",
  "Seasonal Plates",
  "Slow Mornings",
  "Open Doors",
];

export default function Marquee() {
  const repeated = [...items, ...items, ...items];
  return (
    <div className="bg-[var(--rust)] grain" aria-hidden="true">
      <div className="overflow-hidden py-12 md:py-16">
        <motion.div
          className="flex items-center gap-10 whitespace-nowrap pl-10"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{ duration: 26, ease: "linear", repeat: Infinity }}
        >
          {repeated.map((item, i) => (
            <span key={i} className="flex items-center gap-10 flex-shrink-0">
              <span className="font-[var(--font-display)] italic font-black text-xl md:text-2xl text-[var(--cream)]">
                {item}
              </span>
              <span className="text-[var(--brass-light)] opacity-60 text-xs">✦</span>
            </span>
          ))}
        </motion.div>
      </div>
      <RiverDivider from="var(--rust)" to="var(--cream)" flip />
    </div>
  );
}
