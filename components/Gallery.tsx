"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const images = [
  { src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=900&q=85", alt: "Hot drinking chocolate at Cocoa",           label: "Drinking Chocolate"  },
  { src: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=900&q=85", alt: "Macarons in rows, Cocoa pastry selection",  label: "French Macarons"     },
  { src: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=900&q=85", alt: "Pastry and baked goods display",            label: "Baked Daily"         },
  { src: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=900&q=85", alt: "Warm interior at Cocoa Cork",              label: "The Interior"        },
  { src: "https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=900&q=85", alt: "Latte art on marble table",                label: "Specialty Coffee"    },
  { src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&q=85", alt: "Rich chocolate cake slice on board",       label: "Artisan Cakes"       },
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

      {/* Mobile: 2-col equal grid | Desktop: 3col with varied ratios */}
      <div ref={ref}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
        {images.map((img, i) => (
          <motion.div key={img.src}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: "easeOut" }}
            className="relative overflow-hidden group cursor-pointer"
            style={{
              aspectRatio: i === 0 || i === 3
                ? "4/3"
                : i === 1 || i === 4
                  ? "3/4"
                  : "1/1"
            }}>
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark)]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 flex items-end p-4 md:p-6">
              <div className="translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <span
                  className="text-[var(--cream)] text-sm md:text-base lg:text-lg block"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>
                  {img.label}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
