"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// 21st.dev – Magnetic hover for image cards
function MagneticCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left - rect.width / 2) * 0.07;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.07;
    setPos({ x, y });
  };

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}

interface MenuData {
  menu: { heading: string; subheading: string; images: string[] };
}

export default function Menu({ data }: { data: MenuData }) {
  const [activeImg, setActiveImg] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: "-10%" });

  return (
    <section
      id="menu"
      className="py-28 md:py-40 bg-[var(--dark-brown)]"
      aria-labelledby="menu-heading"
    >
      <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <motion.div
            className="flex items-center gap-4 mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-px w-10 bg-[var(--terracotta)]" />
            <span className="font-[var(--font-sans)] text-[10px] tracking-[0.3em] uppercase text-[var(--terracotta)]">
              {data.menu.subheading}
            </span>
          </motion.div>

          <h2
            ref={headingRef}
            id="menu-heading"
            className="font-[var(--font-serif)] text-[clamp(3rem,8vw,7rem)] leading-[0.95] font-light text-[var(--cream)] overflow-hidden"
          >
            {data.menu.heading.split("").map((char, i) => (
              <span key={i} className="overflow-hidden inline-block">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={isInView ? { y: "0%" } : {}}
                  transition={{ delay: i * 0.03, duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                >
                  {char === " " ? " " : char}
                </motion.span>
              </span>
            ))}
          </h2>
        </div>

        {/* Menu cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.menu.images.map((img, i) => {
            const labels = ["All Day", "Drinks", "Specials"];
            return (
              <MagneticCard key={i} className="cursor-pointer">
                <motion.div
                  className="relative overflow-hidden h-[280px] md:h-[420px]"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                  onClick={() => setActiveImg(img)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${labels[i]} menu`}
                  onKeyDown={(e) => e.key === "Enter" && setActiveImg(img)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${labels[i]} menu`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,16,8,0.8)] via-transparent to-transparent" />

                  {/* Label */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="font-[var(--font-sans)] text-[9px] tracking-[0.3em] uppercase text-[var(--terracotta)] mb-1">
                      Menu
                    </p>
                    <p className="font-[var(--font-serif)] text-[var(--cream)] text-2xl font-light">
                      {labels[i]}
                    </p>
                  </div>

                  {/* Hover expand hint */}
                  <motion.div
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--cream)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <span className="text-[var(--charcoal)] text-xs">↗</span>
                  </motion.div>
                </motion.div>
              </MagneticCard>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeImg && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(26,16,8,0.95)] p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActiveImg(null)}
          >
            <motion.div
              className="relative max-w-3xl w-full max-h-[90vh]"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImg}
                alt="Menu detail"
                className="w-full h-full object-contain max-h-[85vh]"
              />
              <button
                className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-[var(--cream)] flex items-center justify-center text-[var(--charcoal)] hover:bg-[var(--terracotta)] hover:text-white transition-colors duration-200"
                onClick={() => setActiveImg(null)}
                aria-label="Close menu image"
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
