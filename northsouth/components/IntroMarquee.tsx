"use client";
import { motion } from "framer-motion";

const words = ["Breakfast", "·", "Brunch", "·", "Coffee", "·", "Good Food", "·", "Tralee", "·", "Est. Daily 8am", "·"];

export default function IntroMarquee() {
  return (
    <div className="overflow-hidden bg-[#1a1510] py-4 border-y border-[#c8864a]/20">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
        className="flex gap-8 whitespace-nowrap"
        style={{ width: "max-content" }}
      >
        {[...words, ...words].map((word, i) => (
          <span
            key={i}
            className={`text-xs tracking-[0.3em] uppercase ${
              word === "·" ? "text-[#c8864a]" : "text-white/60"
            }`}
          >
            {word}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
