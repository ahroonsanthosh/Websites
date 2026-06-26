"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.9, delay: i * 0.15, ease: "easeOut" as const },
  }),
};

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="py-[clamp(80px,12vw,160px)] px-[clamp(24px,5vw,80px)] max-w-[1280px] mx-auto">
      <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(48px,8vw,120px)] items-center">

        {/* Images */}
        <motion.div
          custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="relative aspect-[3/4] max-w-[560px]"
        >
          <div className="w-4/5 h-[85%] overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=900&q=80"
              alt="Handcrafted chocolates"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-[52%] h-[48%] border-[6px] border-[var(--dark)] overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
              alt="Coffee at Cocoa"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </motion.div>

        {/* Text */}
        <div className="flex flex-col">
          <motion.p custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="text-[11px] tracking-[0.28em] uppercase text-[var(--amber)] font-medium mb-4"
          >
            Our Story
          </motion.p>
          <motion.h2 custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="text-[clamp(2.4rem,6vw,5rem)] leading-[1.1] font-['Playfair_Display'] font-normal text-[var(--cream)] mb-7"
          >
            A Labour<br /><em className="text-[var(--amber-lt)]">of Love</em>
          </motion.h2>
          <motion.p custom={3} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="text-[var(--grey-lt)] leading-[1.8] mb-5"
          >
            Tucked away on Winthrop Street in the heart of Cork City, COCOA was
            born from a deep passion for fine chocolate and the belief that every
            cup, every truffle, every pastry should be something worth pausing for.
          </motion.p>
          <motion.p custom={4} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="text-[var(--grey-lt)] leading-[1.8] mb-12"
          >
            We source the finest cacao and craft each chocolate by hand — from
            single-origin bars to silk-smooth drinking chocolate, from seasonal
            truffles to gift boxes made to delight. Pull up a chair beneath our
            Edison lights, and let the city wait a while.
          </motion.p>
          <motion.div custom={5} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="flex gap-10 pt-10 border-t border-white/10"
          >
            {[
              { n: "100%", l: "Handmade" },
              { n: "10+", l: "Years in Cork" },
              { n: "40+", l: "Chocolate varieties" },
            ].map(({ n, l }) => (
              <div key={l} className="flex flex-col gap-1">
                <span className="font-['Playfair_Display'] text-[2.4rem] font-semibold text-[var(--amber)] leading-none">{n}</span>
                <span className="text-[10px] tracking-[0.16em] uppercase text-[var(--grey)]">{l}</span>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
