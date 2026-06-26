"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const images = [
  { src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80", alt: "Coffee at Cocoa",        label: "The Counter"          },
  { src: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80", alt: "Cocoa cafe interior",   label: "The Interior"         },
  { src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80", alt: "Artisan cake",          label: "Artisan Cakes"        },
  { src: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80", alt: "Handmade chocolates",   label: "Handmade Chocolates"  },
  { src: "https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?w=800&q=80", alt: "Specialty coffee",      label: "Specialty Coffee"     },
  { src: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=800&q=80", alt: "Cosy seating",         label: "Cosy Seating"         },
];

export function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="gallery" className="py-20 md:py-32 lg:py-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 mb-10 md:mb-14 text-center">
        <p className="text-[11px] tracking-[0.28em] uppercase text-[var(--amber)] font-medium mb-3">Inside Cocoa</p>
        <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl lg:text-6xl leading-tight text-[var(--cream)]">
          A Glimpse<br /><em className="text-[var(--amber-lt)] font-normal">of the Space</em>
        </h2>
      </div>

      {/* Mobile: single column | Tablet: 2col | Desktop: 3col */}
      <div ref={ref}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {images.map((img, i) => (
          <motion.div key={img.src}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: "easeOut" }}
            className="relative overflow-hidden group cursor-pointer"
            style={{ aspectRatio: i === 0 || i === 3 ? "4/3" : "3/4" }}>
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[var(--dark)] opacity-0 group-hover:opacity-40 transition-opacity duration-400" />
            <div className="absolute inset-0 flex items-end p-5 md:p-6">
              <span
                className="text-[var(--cream)] text-base md:text-lg opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}>
                {img.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
