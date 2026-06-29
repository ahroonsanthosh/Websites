"use client";

import { motion } from "framer-motion";

interface MarqueeProps {
  items: string[];
  speed?: number;
  separator?: string;
  className?: string;
}

export function Marquee({ items, speed = 30, separator = "·", className = "" }: MarqueeProps) {
  const repeated = [...items, ...items, ...items];

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        animate={{ x: "-33.333%" }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="inline-flex gap-8 will-change-transform"
      >
        {repeated.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-8">
            <span>{item}</span>
            <span className="opacity-30">{separator}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
