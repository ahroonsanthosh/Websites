"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const fade = (i: number) => ({
    initial: { opacity: 0, y: 36 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 },
    transition: { duration: 0.85, delay: i * 0.12, ease: "easeOut" as const },
  });

  return (
    <section id="about" className="py-20 md:py-32 lg:py-40">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          {/* Images */}
          <motion.div {...fade(0)} className="relative w-full max-w-sm mx-auto lg:max-w-none" style={{ aspectRatio: "3/4" }}>
            <div className="absolute top-0 left-0 w-[78%] h-[82%] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=900&q=80"
                alt="Handcrafted chocolates"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-[50%] h-[46%] border-[5px] border-[var(--dark)] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
                alt="Coffee at Cocoa"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Text */}
          <div className="flex flex-col">
            <motion.p {...fade(1)}
              className="text-[11px] tracking-[0.28em] uppercase text-[var(--amber)] font-medium mb-3">
              Our Story
            </motion.p>
            <motion.h2 {...fade(2)}
              className="font-['Playfair_Display'] text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-[var(--cream)] mb-6">
              A Labour<br /><em className="text-[var(--amber-lt)] font-normal">of Love</em>
            </motion.h2>
            <motion.p {...fade(3)} className="text-[var(--grey-lt)] leading-[1.85] mb-4 text-sm md:text-base">
              Tucked away on Winthrop Street in the heart of Cork City, COCOA was
              born from a deep passion for fine chocolate and the belief that every
              cup, every truffle, every pastry should be something worth pausing for.
            </motion.p>
            <motion.p {...fade(4)} className="text-[var(--grey-lt)] leading-[1.85] text-sm md:text-base">
              We source the finest cacao and craft each chocolate by hand — from
              single-origin bars to silk-smooth drinking chocolate, from seasonal
              truffles to gift boxes made to delight. Pull up a chair beneath our
              Edison lights, and let the city wait a while.
            </motion.p>

            <motion.div {...fade(5)}
              className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-white/10">
              {[
                { n: "100%", l: "Handmade" },
                { n: "10+",  l: "Years in Cork" },
                { n: "40+",  l: "Varieties" },
              ].map(({ n, l }) => (
                <div key={l} className="flex flex-col gap-1">
                  <span className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-[var(--amber)] leading-none">{n}</span>
                  <span className="text-[9px] md:text-[10px] tracking-[0.14em] uppercase text-[var(--grey)] mt-1">{l}</span>
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
