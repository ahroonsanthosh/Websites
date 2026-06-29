"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { siteContent } from "@/data/content";
import { X } from "lucide-react";

const layout = [
  { col: "col-span-2 row-span-2", aspect: "aspect-square" },
  { col: "col-span-1", aspect: "aspect-square" },
  { col: "col-span-1", aspect: "aspect-square" },
  { col: "col-span-1", aspect: "aspect-video" },
  { col: "col-span-1", aspect: "aspect-square" },
  { col: "col-span-2", aspect: "aspect-video" },
];

export function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section ref={ref} className="py-24 bg-[#0d0905]">
      <div className="max-w-6xl mx-auto px-8 md:px-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="text-amber-500/60 text-xs uppercase tracking-[0.4em] font-light">
            Gallery
          </span>
          <h2 className="font-serif text-4xl text-amber-50 mt-3">A glimpse inside</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[180px] md:auto-rows-[220px]">
          {siteContent.images.slice(0, 6).map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className={`${layout[i]?.col || ""} overflow-hidden rounded-2xl cursor-pointer group relative`}
              onClick={() => setLightbox(src)}
            >
              <img
                src={src}
                alt="Dulce Bun House"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.img
              src={lightbox}
              alt=""
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-full max-h-full rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 text-stone-400 hover:text-white p-2"
            >
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
