"use client";

import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

// 21st.dev – Horizontal scroll marquee gallery
function MarqueeTrack({ images, direction = 1 }: { images: string[]; direction?: number }) {
  const doubled = [...images, ...images];
  return (
    <div className="flex overflow-hidden">
      <motion.div
        className="flex gap-3 flex-shrink-0"
        animate={{ x: direction > 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 25, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((img, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 w-[260px] md:w-[320px] h-[200px] md:h-[240px] overflow-hidden group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={`Bayou gallery ${(i % images.length) + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[var(--dark-brown)] opacity-0 group-hover:opacity-20 transition-opacity duration-400" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// 21st.dev – Tilt card on hover
function TiltImage({ src, alt, index }: { src: string; alt: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientY - rect.top - rect.height / 2) / rect.height) * -12;
    const y = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 12;
    setTilt({ x, y });
  };

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden cursor-pointer group"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="w-full h-full"
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-[220px] md:h-[280px] object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </motion.div>
    </motion.div>
  );
}

interface GalleryData {
  gallery: { heading: string; images: string[] };
}

export default function Gallery({ data }: { data: GalleryData }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(headingRef, { once: true });

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  const half = Math.ceil(data.gallery.images.length / 2);
  const row1 = data.gallery.images.slice(0, half);
  const row2 = data.gallery.images.slice(half);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="py-28 md:py-40 overflow-hidden bg-[var(--cream)]"
      aria-labelledby="gallery-heading"
    >
      {/* Heading */}
      <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto mb-16">
        <motion.div
          className="flex items-center gap-4 mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="separator" />
          <span className="font-[var(--font-sans)] text-[10px] tracking-[0.3em] uppercase text-[var(--terracotta)]">
            The Space
          </span>
        </motion.div>

        <h2
          ref={headingRef}
          id="gallery-heading"
          className="font-[var(--font-serif)] text-[clamp(2.5rem,6vw,5rem)] font-light text-[var(--charcoal)] leading-tight"
        >
          {data.gallery.heading.split(" ").map((word, i) => (
            <span key={i} className="overflow-hidden inline-block mr-[0.2em]">
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={isInView ? { y: "0%" } : {}}
                transition={{ delay: i * 0.1, duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h2>
      </div>

      {/* Marquee rows */}
      <div className="space-y-3 mb-16">
        <MarqueeTrack images={row1} direction={1} />
        {row2.length > 0 && <MarqueeTrack images={row2} direction={-1} />}
      </div>

      {/* Grid below marquee */}
      <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {data.gallery.images.slice(0, 3).map((img, i) => (
            <TiltImage
              key={i}
              src={img}
              alt={`Bayou café ${i + 1}`}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
