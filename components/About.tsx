"use client";
import { motion } from "framer-motion";

const item = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.8, delay, ease: "easeOut" as const },
});

export function About() {
  return (
    <section id="about" className="py-20 md:py-32 lg:py-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-center">

          {/* Images */}
          <motion.div {...item(0)}
            className="relative w-full mx-auto lg:mx-0"
            style={{ aspectRatio: "4/5", maxWidth: 480 }}>
            <div className="absolute top-0 left-0 w-[78%] h-[82%] overflow-hidden">
              <img
                src="/images/interior.png"
                alt="Cocoa cafe counter — Edison lights, warm atmosphere, Winthrop Street Cork"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-[48%] h-[44%] border-[5px] border-[var(--dark)] overflow-hidden">
              <img
                src="/images/latte.png"
                alt="Latte art at Cocoa, Cork"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Text */}
          <div className="flex flex-col">
            <motion.p {...item(0.05)}
              className="text-[11px] tracking-[0.28em] uppercase text-[var(--amber)] font-medium mb-3">
              Our Story
            </motion.p>

            <motion.h2 {...item(0.1)}
              className="font-['Playfair_Display'] text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.1] text-[var(--cream)] mb-6">
              A Labour<br />
              <em className="text-[var(--amber-lt)] font-normal not-italic" style={{ fontStyle: "italic" }}>of Love</em>
            </motion.h2>

            <motion.p {...item(0.15)} className="text-[var(--grey-lt)] leading-[1.9] mb-5 text-[17px] md:text-[18px]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Tucked away on Winthrop Street in the heart of Cork City, COCOA was
              born from a deep passion for fine chocolate and the belief that every
              cup, every truffle, every pastry should be something worth pausing for.
            </motion.p>

            <motion.p {...item(0.2)} className="text-[var(--grey-lt)] leading-[1.9] text-[17px] md:text-[18px]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              We source the finest cacao and craft each chocolate by hand — from
              single-origin bars to silk-smooth drinking chocolate, from seasonal
              truffles to gift boxes made to delight. Pull up a chair beneath our
              Edison lights, and let the city wait a while.
            </motion.p>

            <motion.div {...item(0.25)}
              className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-white/10">
              {[
                { n: "100%", l: "Handmade"      },
                { n: "10+",  l: "Years in Cork" },
                { n: "40+",  l: "Varieties"     },
              ].map(({ n, l }) => (
                <div key={l} className="flex flex-col">
                  <span className="font-['Playfair_Display'] text-[2rem] md:text-[2.4rem] font-semibold text-[var(--amber)] leading-none">
                    {n}
                  </span>
                  <span className="text-[9px] md:text-[10px] tracking-[0.14em] uppercase text-[var(--grey)] mt-2">
                    {l}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
