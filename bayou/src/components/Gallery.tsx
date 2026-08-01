"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import RiverDivider from "./RiverDivider";

function ArchCard({ src, alt, index }: { src: string; alt: string; index: number }) {
  const tilts = [-2, 1.5, -1, 2, -1.5, 1];
  const tilt = tilts[index % tilts.length];
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      className="relative cursor-pointer"
      style={{ rotate: tilt, zIndex: hovered ? 10 : 1 }}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0, rotate: hovered ? 0 : tilt } : {}}
      transition={{ delay: index * 0.07, duration: 0.55, rotate: { duration: 0.3 } }}
      whileHover={{ scale: 1.04, zIndex: 10 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Arch frame */}
      <div className="bg-[var(--ink)] p-2 pb-6 shadow-xl">
        <div className="arch-frame h-[220px] md:h-[280px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </div>
      {/* Brass plate label */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-[var(--brass)] px-3 py-0.5 rounded-sm w-[70%] text-center">
        <p className="font-[var(--font-sans)] text-[9px] font-semibold text-[var(--ink)] tracking-widest uppercase truncate">
          Bayou · Cork
        </p>
      </div>
    </motion.div>
  );
}

interface GalleryData {
  gallery: { heading: string; images: string[] };
}

export default function Gallery({ data }: { data: GalleryData }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(headingRef, { once: true });

  return (
    <section id="gallery" className="bg-[var(--parchment)] grain" aria-labelledby="gallery-heading">
      <div className="px-8 md:px-16 lg:px-24 max-w-7xl mx-auto pt-28 md:pt-40 pb-32 md:pb-44">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-16 md:mb-20">
          <div>
            <p className="label-engrave text-[var(--rust)] mb-5">V — Along the Bank</p>
            <h2
              ref={headingRef}
              id="gallery-heading"
              className="font-[var(--font-display)] italic font-black text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.92] text-[var(--ink)]"
              style={{ letterSpacing: "-0.025em" }}
            >
              {data.gallery.heading}
            </h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-start md:items-end gap-2"
          >
            <span className="label-engrave text-[var(--ink)]/50">8 MacCurtain Street</span>
            <a
              href="https://www.instagram.com/bayoucork"
              target="_blank"
              rel="noopener noreferrer"
              className="pill pill-ink text-xs"
            >
              Follow ↗
            </a>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8 pb-10">
          {data.gallery.images.map((img, i) => (
            <ArchCard key={i} src={img} alt={`Bayou café — photo ${i + 1}`} index={i} />
          ))}
        </div>
      </div>

      <RiverDivider from="var(--parchment)" to="var(--rust)" />
    </section>
  );
}
