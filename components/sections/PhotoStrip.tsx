"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { siteContent } from "@/data/content";

export function PhotoStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  const row1 = siteContent.images.slice(0, 5);
  const row2 = siteContent.images.slice(3);

  return (
    <section ref={ref} className="py-24 bg-stone-950 overflow-hidden">
      <div className="mb-4">
        <motion.div style={{ x: x1 }} className="flex gap-4 mb-4">
          {[...row1, ...row1].map((src, i) => (
            <div
              key={i}
              className="flex-none w-72 h-52 rounded-2xl overflow-hidden"
              style={{ aspectRatio: "4/3" }}
            >
              <img
                src={src}
                alt="Dulce Bun House"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </motion.div>

        <motion.div style={{ x: x2 }} className="flex gap-4">
          {[...row2, ...row2].map((src, i) => (
            <div
              key={i}
              className="flex-none w-72 h-52 rounded-2xl overflow-hidden"
              style={{ aspectRatio: "4/3" }}
            >
              <img
                src={src}
                alt="Dulce Bun House"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
