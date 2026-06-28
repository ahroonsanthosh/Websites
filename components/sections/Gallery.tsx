"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import content from "@/lib/content";
import { assetPath } from "@/lib/asset";
import { BouncyWords } from "@/components/ui/bouncy-text";

const { gallery, business } = content;

const spans = [
  "col-span-1 md:row-span-2",
  "col-span-1",
  "col-span-1",
  "col-span-1 md:row-span-2",
  "col-span-1",
  "col-span-1",
  "col-span-1 md:col-span-2",
  "col-span-1 md:col-span-2",
];

function GalleryPhoto({ photo, index, span, inView }: { photo: typeof gallery[number]; index: number; span: string; inView: boolean }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * -8;
    setTilt({ x, y });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: Math.min(index * 0.07, 0.35), ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-2xl group ${span}`}
      style={{ perspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <motion.div
        className="w-full h-full"
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <img
          src={assetPath(photo.src)}
          alt={photo.alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-[#1A0C05]/0 group-hover:bg-[#1A0C05]/40 transition-all duration-400" />
        <div className="absolute inset-0 flex items-end justify-start p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="font-display italic text-white text-sm font-semibold drop-shadow-lg">{photo.alt}</span>
        </div>
        {/* Orange corner accent on hover */}
        <motion.div
          className="absolute top-0 left-0 w-0 h-0.5 bg-[#E8622A] group-hover:w-full transition-all duration-500 rounded-full"
        />
      </motion.div>
    </motion.div>
  );
}

export default function Gallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="gallery" ref={ref} className="bg-[#FDF6EB] py-14 md:py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-10">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="font-accent text-[11px] tracking-[0.3em] uppercase text-[#E8622A] mb-3"
            >
              Fresh Daily
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display italic text-3xl md:text-5xl font-bold text-[#1A0C05]"
            >
              <BouncyWords text="The Food Speaks" className="block" />
              <span className="text-[#E8622A]">
                <BouncyWords text="For Itself." />
              </span>
            </motion.h2>
          </div>
          <motion.a
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 300 } }}
            whileTap={{ scale: 0.97 }}
            href={`https://www.instagram.com/${business.instagram}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#1A0C05] text-[#1A0C05] font-accent text-[11px] tracking-[0.2em] uppercase rounded-full hover:bg-[#1A0C05] hover:text-[#FDF6EB] transition-all duration-300 self-start md:self-auto"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            @{business.instagram}
          </motion.a>
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
          style={{ gridAutoRows: "160px" }}
        >
          {gallery.map((photo, i) => (
            <GalleryPhoto
              key={i}
              photo={photo}
              index={i}
              span={spans[i] ?? "col-span-1"}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
