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
          <div className="w-8 h-px" style={{ background: "#FF6BDB" }} />
          <span className="text-xs font-sans tracking-[0.3em] uppercase font-medium" style={{ color: "#FF6BDB" }}>
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

      {/* Bento-box grid — 3 cols, 4 rows, specific spans per tile */}
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "260px 260px 260px 260px",
          }}
        >
          {[
            /* [colStart, colEnd, rowStart, rowEnd] */
            [1, 2, 1, 3], // img0 — tall left
            [2, 3, 1, 2], // img1 — top mid
            [3, 4, 1, 2], // img2 — top right
            [2, 4, 2, 3], // img3 — wide mid-right
            [1, 2, 3, 4], // img4 — mid-left
            [2, 3, 3, 4], // img5 — mid-center
            [3, 4, 3, 5], // img6 — tall right
            [1, 3, 4, 5], // img7 — wide bottom-left
          ].map(([cs, ce, rs, re], i) => {
            const tile = sorted[i];
            return (
              <motion.button
                key={tile?.id ?? `placeholder-${i}`}
                type="button"
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setLightboxIndex(i)}
                aria-label={`View: ${tile?.alt ?? "Hansum food"}`}
                className="relative rounded-2xl overflow-hidden cursor-none group"
                style={{ gridColumn: `${cs} / ${ce}`, gridRow: `${rs} / ${re}` }}
                data-cursor-label="VIEW"
              >
                <HansumImage
                  src={tile?.src}
                  alt={tile?.alt ?? "Hansum rotisserie"}
                  gradient={PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length]}
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white/80 text-xs font-sans bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">@hansumcork</span>
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
