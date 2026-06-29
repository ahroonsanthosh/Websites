"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const traits = [
  { label: "Baked Daily", desc: "Everything comes out of the oven fresh each morning." },
  { label: "Single Origin", desc: "Coffee sourced from ethical farms, pulled with care." },
  { label: "Cork Proud", desc: "Independent, local, and rooted in the heart of the city." },
];

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="py-32 bg-[#0d0905]">
      <div className="max-w-5xl mx-auto px-8 md:px-16 lg:px-20 grid md:grid-cols-2 gap-20 items-center">
        {/* Text side */}
        <div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="text-amber-500/60 text-xs uppercase tracking-[0.4em] font-light"
          >
            Our Story
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.15 }}
            className="font-serif text-4xl md:text-5xl text-amber-50 mt-4 mb-6 leading-[1.1]"
          >
            A little corner
            <br />
            <em className="text-amber-400 not-italic">worth finding.</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="text-stone-400 text-base leading-relaxed font-light"
          >
            Dulce Bun House started with a simple idea: make Cork feel a little sweeter.
            Tucked into Oliver Plunkett Street, we've been feeding the city's early risers,
            late-morning lingerers, and everyone in between.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="text-stone-500 text-sm leading-relaxed font-light mt-4"
          >
            We obsess over laminated pastry, single-origin espresso, and the kind of atmosphere
            where you actually want to stay a while.
          </motion.p>
        </div>

        {/* Traits */}
        <div className="flex flex-col">
          {traits.map((trait, i) => (
            <motion.div
              key={trait.label}
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.12 }}
              className="group flex gap-6 items-start py-8 border-b border-stone-800/40 last:border-0 cursor-default"
            >
              <span className="text-amber-600/40 text-xs font-mono mt-0.5 w-5 shrink-0 group-hover:text-amber-500 transition-colors duration-500">
                0{i + 1}
              </span>
              <div>
                <p className="text-amber-100 font-medium mb-1.5 group-hover:text-amber-300 transition-colors duration-300">
                  {trait.label}
                </p>
                <p className="text-stone-500 text-sm font-light leading-relaxed">{trait.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
