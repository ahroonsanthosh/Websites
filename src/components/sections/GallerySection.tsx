"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import HansumImage from "@/components/ui/HansumImage";

const PLACEHOLDER_COLORS = [
  "from-orange-900/80 to-red-900/80",
  "from-amber-800/80 to-orange-900/80",
  "from-red-900/80 to-orange-800/80",
  "from-orange-800/80 to-yellow-900/80",
  "from-red-800/80 to-red-900/80",
  "from-amber-900/80 to-orange-800/80",
];

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  order: number;
}

export default function GallerySection({ images = [] }: { images?: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const sorted = [...images].sort((a, b) => a.order - b.order);
  // Always render six tiles; fill empties with branded placeholders.
  const tiles = Array.from({ length: Math.max(6, sorted.length) }, (_, i) => sorted[i]);

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
          {tiles.map((tile, i) => {
            const tall = i === 0 || i === 4;
            return (
              <motion.button
                key={tile?.id ?? `placeholder-${i}`}
                type="button"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                onClick={() => setLightboxIndex(i)}
                aria-label={`View gallery image: ${tile?.alt ?? "Hansum food"}`}
                className={`w-full break-inside-avoid relative rounded-2xl overflow-hidden cursor-none group ${tall ? "aspect-[3/4]" : "aspect-square"}`}
                data-cursor-label="VIEW"
              >
                <HansumImage
                  src={tile?.src}
                  alt={tile?.alt ?? "Hansum rotisserie"}
                  gradient={PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length]}
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="transition-transform duration-500 group-hover:scale-105"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                    <p className="text-white text-xs font-sans">@hansumcork</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
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
              className="relative w-full max-w-lg aspect-square rounded-3xl overflow-hidden flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <HansumImage
                src={tiles[lightboxIndex]?.src}
                alt={tiles[lightboxIndex]?.alt ?? "Hansum rotisserie"}
                gradient={PLACEHOLDER_COLORS[lightboxIndex % PLACEHOLDER_COLORS.length]}
                sizes="512px"
              />
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-sans bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">@hansumcork</p>
            </motion.div>
            <button
              onClick={() => setLightboxIndex(null)}
              aria-label="Close lightbox"
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
