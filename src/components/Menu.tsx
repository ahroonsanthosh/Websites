"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import RiverDivider from "./RiverDivider";

interface MenuData {
  menu: { heading: string; subheading: string; images: string[] };
}

const labels = ["All Day", "Drinks", "Specials"];
const subtitles = [
  "Plates, bowls, toasties — built around honest produce.",
  "Coffee done right. Teas, sodas and a few surprises.",
  "What we felt like making. Always worth asking.",
];

export default function Menu({ data }: { data: MenuData }) {
  const [active, setActive] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section
      id="menu"
      ref={ref}
      className="bg-[var(--cream)] grain"
      aria-labelledby="menu-heading"
    >
      <div className="px-6 md:px-12 max-w-7xl mx-auto pt-24 md:pt-32 pb-20 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12 md:mb-16 border-b border-[var(--line-light)] pb-8"
        >
          <p className="label-engrave text-[var(--rust)] mb-5">IV — What&apos;s on the Table</p>
          <h2
            id="menu-heading"
            className="font-[var(--font-display)] italic font-black text-[clamp(3rem,9vw,7.5rem)] leading-[0.88] text-[var(--ink)]"
            style={{ letterSpacing: "-0.025em" }}
          >
            {data.menu.heading}
          </h2>
        </motion.div>

        <div className="space-y-4 md:space-y-5">
          {data.menu.images.map((img, i) => (
            <motion.div
              key={i}
              className="group relative overflow-hidden rounded-2xl cursor-pointer border border-[var(--line-light)] bg-[var(--parchment)]"
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              onClick={() => setActive(img)}
              role="button"
              tabIndex={0}
              aria-label={`View ${labels[i]} menu`}
              onKeyDown={(e) => e.key === "Enter" && setActive(img)}
              whileHover={{ y: -2 }}
            >
              <div className="flex flex-col md:flex-row md:items-stretch">
                {/* Image */}
                <div className="w-full h-52 md:w-72 lg:w-96 md:h-auto flex-shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={labels[i]}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Text */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center gap-3">
                  <p className="label-engrave text-[var(--rust)]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3
                    className="font-[var(--font-display)] italic font-black text-2xl md:text-3xl text-[var(--ink)]"
                    style={{ letterSpacing: "-0.015em" }}
                  >
                    {labels[i]}
                  </h3>
                  <p className="font-[var(--font-sans)] text-sm text-[var(--ink)]/60 leading-relaxed max-w-sm">
                    {subtitles[i]}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <motion.div
                      className="w-8 h-8 rounded-full border border-[var(--brass)] flex items-center justify-center text-[var(--brass)] text-xs flex-shrink-0"
                      whileHover={{ backgroundColor: "var(--brass)", color: "var(--ink)" }}
                      transition={{ duration: 0.2 }}
                    >
                      ↗
                    </motion.div>
                    <span className="font-[var(--font-sans)] text-xs text-[var(--ink)]/35 tracking-wide">
                      Tap to view
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <RiverDivider from="var(--cream)" to="var(--parchment)" flip />

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--ink)]/85 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className="relative max-w-3xl w-full"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={active} alt="Menu detail" className="w-full h-auto rounded-2xl max-h-[85vh] object-contain" />
              <button
                className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-[var(--brass)] text-[var(--ink)] flex items-center justify-center hover:bg-[var(--brass-light)] transition-colors text-xl font-bold"
                onClick={() => setActive(null)}
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
