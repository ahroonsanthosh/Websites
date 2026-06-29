"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// Polaroid-style tilt card with hover straighten
function PolaroidCard({ src, alt, index }: { src: string; alt: string; index: number }) {
  const rotations = [-3, 2, -1.5, 3.5, -2.5, 1, -4];
  const baseRotate = rotations[index % rotations.length];
  const [hovered, setHovered] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      className="bg-white p-3 pb-8 shadow-md cursor-pointer"
      initial={{ opacity: 0, y: 40, rotate: baseRotate }}
      animate={isInView ? { opacity: 1, y: 0, rotate: hovered ? 0 : baseRotate } : {}}
      whileHover={{ scale: 1.04, zIndex: 10 }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
        rotate: { duration: 0.3 },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", zIndex: hovered ? 10 : 1 }}
    >
      <div className="overflow-hidden aspect-square">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
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
    <section
      id="gallery"
      className="py-20 md:py-32 bg-[var(--cream)]"
      aria-labelledby="gallery-heading"
    >
      <div className="px-5 md:px-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <p className="font-[var(--font-sans)] text-xs font-semibold tracking-widest uppercase text-[var(--orange)] mb-3">
              The Space
            </p>
            <h2
              ref={headingRef}
              id="gallery-heading"
              className="font-[var(--font-display)] font-black text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.92] text-[var(--charcoal)]"
              style={{ letterSpacing: "-0.03em" }}
            >
              {data.gallery.heading}
            </h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 text-sm text-[var(--muted)] font-[var(--font-sans)]">
              <span className="w-2 h-2 rounded-full bg-[var(--sage)]" />
              8 MacCurtain Street, Cork
            </div>
          </motion.div>
        </div>

        {/* Polaroid grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {data.gallery.images.map((img, i) => (
            <PolaroidCard
              key={i}
              src={img}
              alt={`Bayou café — photo ${i + 1}`}
              index={i}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <a
            href="https://www.instagram.com/bayoucork"
            target="_blank"
            rel="noopener noreferrer"
            className="pill pill-dark inline-flex font-[var(--font-sans)] font-semibold"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            More on Instagram ↗
          </a>
        </motion.div>
      </div>
    </section>
  );
}
