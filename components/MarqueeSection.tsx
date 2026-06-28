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
  "Est. Daily",
  "·",
]

export default function MarqueeSection() {
  return (
    <div className="bg-[#C8A882] py-5 overflow-hidden">
      <div className="flex">
        {[0, 1].map((rep) => (
          <motion.div
            key={rep}
            className="flex items-center gap-8 pr-8 whitespace-nowrap flex-shrink-0"
            animate={{ x: [0, "-50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: rep === 1 ? -10 : 0 }}
            style={{ willChange: "transform" }}
          >
            {[...items, ...items].map((item, i) => (
              <span
                key={i}
                className={`text-[#2C1810] font-light tracking-wider ${item === "·" ? "text-[#2C1810]/40 text-xs" : "text-xs uppercase tracking-[0.3em]"}`}
              >
                {item}
              </span>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
