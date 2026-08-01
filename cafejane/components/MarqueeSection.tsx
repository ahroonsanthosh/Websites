"use client"
import { motion } from "framer-motion"

const items = [
  "Specialty Coffee",
  "·",
  "Seasonal Menu",
  "·",
  "Fresh Pastries",
  "·",
  "Cork City",
  "·",
  "Shandon Street",
  "·",
]

const track = [...items, ...items]

export default function MarqueeSection() {
  return (
    <div className="bg-[#C8A882] py-4 overflow-hidden select-none">
      <div className="flex w-max">
        <motion.div
          className="flex items-center gap-6 pr-6 whitespace-nowrap"
          animate={{ x: [0, "-50%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ willChange: "transform" }}
        >
          {track.map((item, i) => (
            <span
              key={i}
              className={`text-[#2C1810] font-light ${
                item === "·"
                  ? "text-[#2C1810]/35 text-sm"
                  : "text-[10px] uppercase tracking-[0.3em]"
              }`}
            >
              {item}
            </span>
          ))}
        </motion.div>
        {/* Duplicate for seamless loop */}
        <motion.div
          className="flex items-center gap-6 pr-6 whitespace-nowrap"
          animate={{ x: [0, "-50%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ willChange: "transform" }}
          aria-hidden
        >
          {track.map((item, i) => (
            <span
              key={i}
              className={`text-[#2C1810] font-light ${
                item === "·"
                  ? "text-[#2C1810]/35 text-sm"
                  : "text-[10px] uppercase tracking-[0.3em]"
              }`}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
