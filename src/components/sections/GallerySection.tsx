"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { X } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";

const PLACEHOLDER_COLORS = [
  "from-orange-900/80 to-red-900/80",
  "from-amber-800/80 to-orange-900/80",
  "from-red-900/80 to-orange-800/80",
  "from-orange-800/80 to-yellow-900/80",
  "from-red-800/80 to-red-900/80",
  "from-amber-900/80 to-orange-800/80",
];

const PLACEHOLDER_CONTENT = [
  { emoji: "🥪", label: "Hansum Ciabatta" },
  { emoji: "🍗", label: "Whole Chicken" },
  { emoji: "🌯", label: "Hansum Wrap" },
  { emoji: "🍟", label: "Messy Wedges" },
  { emoji: "🥗", label: "Hansum Salad" },
  { emoji: "🔥", label: "Rotisserie" },
];

export default function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const marqueeText = "ROTISSERIE • CORK • MARINA MARKET • @HANSUMCORK • FRESH DAILY • ";

  return (
    <section className="relative py-32 bg-[#FFF8F0] overflow-hidden" id="gallery">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-8 h-px bg-orange-500" />
          <span className="text-orange-500 text-xs font-sans tracking-[0.3em] uppercase font-medium">
            On the Gram
          </span>
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(2.5rem,6vw,5rem)] font-black text-[#1A1A1A] leading-none"
            >
              Follow the Journey.
            </motion.h2>
          </div>
          <motion.a
            href="https://www.instagram.com/hansumcork"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-5 py-3 rounded-full border border-[#1A1A1A]/20 text-[#1A1A1A] font-sans font-medium text-sm hover:border-orange-500 hover:text-orange-500 transition-colors duration-200 self-start"
          >
            <InstagramIcon className="w-4 h-4" />
            @hansumcork
          </motion.a>
        </div>
      </div>

      {/* Masonry-style grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {PLACEHOLDER_CONTENT.map((item, i) => {
            const tall = i === 0 || i === 4;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                onClick={() => setLightboxIndex(i)}
                className={`break-inside-avoid relative rounded-2xl overflow-hidden cursor-none group ${tall ? "aspect-[3/4]" : "aspect-square"} bg-gradient-to-br ${PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length]}`}
                data-cursor-label="VIEW"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl mb-3">{item.emoji}</span>
                  <span className="font-sans text-white/70 text-sm tracking-wide">{item.label}</span>
                </div>

                {/* Hover overlay */}
                <motion.div
                  className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ opacity: 1 }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                    <p className="text-white text-xs font-sans">@hansumcork</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Infinite marquee strip */}
      <div className="mt-20 overflow-hidden border-t border-b border-[#1A1A1A]/10 py-5">
        <motion.div
          className="flex whitespace-nowrap gap-0"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(4)].map((_, i) => (
            <span key={i} className="font-condensed text-2xl tracking-[0.15em] text-[#1A1A1A]/30 pr-0">
              {marqueeText}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-8"
            onClick={() => setLightboxIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`relative w-full max-w-lg aspect-square rounded-3xl bg-gradient-to-br ${PLACEHOLDER_COLORS[lightboxIndex % PLACEHOLDER_COLORS.length]} flex flex-col items-center justify-center`}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-8xl mb-4">{PLACEHOLDER_CONTENT[lightboxIndex].emoji}</span>
              <span className="font-display text-white text-2xl font-bold">{PLACEHOLDER_CONTENT[lightboxIndex].label}</span>
              <p className="text-white/50 text-sm mt-2 font-sans">@hansumcork</p>
            </motion.div>
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
