"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

interface MenuData {
  menu: { heading: string; subheading: string; images: string[] };
}

export default function Menu({ data }: { data: MenuData }) {
  const [activeImg, setActiveImg] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-8%" });

  const labels = ["All Day", "Drinks", "Specials"];
  const descriptions = [
    "Plates, bowls, toasties — good food made from honest ingredients.",
    "Coffee done right. Teas, sodas, and a few surprises.",
    "What we felt like making today. Always worth asking.",
  ];

  return (
    <section
      id="menu"
      ref={ref}
      className="py-20 md:py-32 bg-[var(--warm-white)]"
      aria-labelledby="menu-heading"
    >
      <div className="px-5 md:px-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="font-[var(--font-sans)] text-xs font-semibold tracking-widest uppercase text-[var(--orange)] mb-3">
              {data.menu.subheading}
            </p>
            <h2
              id="menu-heading"
              className="font-[var(--font-display)] font-black text-[clamp(3rem,9vw,7rem)] leading-[0.92] text-[var(--charcoal)]"
              style={{ letterSpacing: "-0.03em" }}
            >
              {data.menu.heading}
            </h2>
          </div>
          <p className="font-[var(--font-sans)] text-sm text-[var(--muted)] max-w-xs leading-relaxed">
            Click any image to view the full menu. We update it regularly — always seasonal, always honest.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {data.menu.images.map((img, i) => (
            <motion.div
              key={i}
              className="group relative overflow-hidden rounded-2xl cursor-pointer bg-[var(--cream)]"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={() => setActiveImg(img)}
              role="button"
              tabIndex={0}
              aria-label={`View ${labels[i]} menu`}
              onKeyDown={(e) => e.key === "Enter" && setActiveImg(img)}
              whileHover={{ y: -4 }}
            >
              <div className="overflow-hidden h-[240px] md:h-[320px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`${labels[i]} menu`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Bottom */}
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="font-[var(--font-display)] font-black text-xl text-[var(--charcoal)]">{labels[i]}</p>
                  <p className="font-[var(--font-sans)] text-xs text-[var(--muted)] mt-0.5">{descriptions[i]}</p>
                </div>
                <motion.div
                  className="w-10 h-10 rounded-full bg-[var(--charcoal)] flex items-center justify-center text-white text-sm flex-shrink-0"
                  whileHover={{ scale: 1.1, backgroundColor: "var(--orange)" }}
                  transition={{ duration: 0.2 }}
                >
                  ↗
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeImg && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImg(null)}
          >
            <motion.div
              className="relative max-w-3xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeImg} alt="Menu detail" className="w-full h-auto rounded-2xl max-h-[85vh] object-contain" />
              <button
                className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white text-[var(--charcoal)] flex items-center justify-center hover:bg-[var(--orange)] hover:text-white transition-colors duration-200 text-xl font-bold"
                onClick={() => setActiveImg(null)}
                aria-label="Close"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
