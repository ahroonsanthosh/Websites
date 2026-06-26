"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const images = [
  { src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80", alt: "Coffee and chocolate", label: "The Counter", span: "" },
  { src: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80", alt: "Cocoa cafe interior", label: "The Interior", span: "row-span-2" },
  { src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80", alt: "Artisan cake", label: "Artisan Cakes", span: "" },
  { src: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&q=80", alt: "Handmade chocolates", label: "Handmade Chocolates", span: "col-span-2" },
  { src: "https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?w=800&q=80", alt: "Specialty coffee", label: "Specialty Coffee", span: "" },
  { src: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=800&q=80", alt: "Cosy seating", label: "Cosy Seating", span: "row-span-2" },
];

export function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="gallery" className="py-[clamp(80px,12vw,160px)]">
      <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
        <div className="text-center mb-14">
          <p className="text-[11px] tracking-[0.28em] uppercase text-[var(--amber)] font-medium mb-4">Inside Cocoa</p>
          <h2 className="font-['Playfair_Display'] text-[clamp(2.4rem,6vw,5rem)] leading-[1.1] text-[var(--cream)]">
            A Glimpse<br /><em className="text-[var(--amber-lt)]">of the Space</em>
          </h2>
        </div>
      </div>

      <div
        ref={ref}
        className="grid grid-cols-3 auto-rows-[280px] md:auto-rows-[320px] gap-2 px-[clamp(24px,5vw,80px)] max-w-[1280px] mx-auto"
      >
        {images.map((img, i) => (
          <motion.div
            key={img.src}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`relative overflow-hidden cursor-pointer group ${img.span}`}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[var(--dark)] opacity-0 group-hover:opacity-45 transition-opacity duration-400" />
            <div className="absolute inset-0 flex items-end p-7 opacity-0 group-hover:opacity-100 transition-all duration-400">
              <span
                className="text-[var(--cream)] text-[1.1rem] translate-y-3 group-hover:translate-y-0 transition-transform duration-400"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}
              >
                {img.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
