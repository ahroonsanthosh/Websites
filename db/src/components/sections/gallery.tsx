"use client";

import { motion } from "framer-motion";
import { GALLERY } from "@/data/site";

const ROTATIONS = [-2, 1.5, -1, 2, -1.5, 1, -2.5, 1.5];

export function Gallery() {
  return (
    <section id="gallery" className="py-24 sm:py-32" aria-label="Gallery">
      <div className="mx-auto max-w-6xl px-5">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl font-semibold tracking-tight sm:text-6xl"
        >
          The goods<span className="text-honey">.</span>
        </motion.h2>
        <p className="mt-3 max-w-[50ch] text-cocoa/60">
          Straight from the counter. Come see for yourself — or stalk us a
          little longer first, we get it.
        </p>

        <div className="mt-12 columns-2 gap-4 md:columns-3 [&>*]:mb-4">
          {GALLERY.map((img, i) => (
            <motion.figure
              key={img.src}
              initial={{ opacity: 0, y: 40, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: ROTATIONS[i % ROTATIONS.length] }}
              whileHover={{ rotate: 0, scale: 1.03, zIndex: 10 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.6,
                delay: (i % 3) * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative overflow-hidden rounded-xl border-2 border-cocoa bg-paper shadow-[4px_4px_0_rgba(43,29,22,0.9)]"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="block w-full object-cover"
              />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
