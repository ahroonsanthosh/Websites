"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Section, SectionLabel, SectionHeading } from "@/components/ui/section";

const traits = [
  { label: "Baked Daily", desc: "Everything comes out of the oven fresh each morning." },
  { label: "Single Origin", desc: "Coffee sourced from ethical farms, pulled with care." },
  { label: "Cork Proud", desc: "Independent, local, and rooted in the heart of the city." },
];

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Section id="about" className="bg-[#0d0905]" wide>
      <div ref={ref} className="grid md:grid-cols-2 gap-16 lg:gap-28 items-center">
        {/* Text column */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <SectionLabel>Our Story</SectionLabel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1 }}
          >
            <SectionHeading className="mb-8">
              A little corner
              <br />
              <em className="text-amber-400 not-italic">worth finding.</em>
            </SectionHeading>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="text-stone-400 text-base md:text-lg leading-relaxed font-light mb-4"
          >
            Dulce Bun House started with one idea: make Cork feel a little sweeter.
            Tucked into Oliver Plunkett Street, we've been feeding the city's early risers,
            late-morning lingerers, and everyone in between.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.38 }}
            className="text-stone-500 text-sm leading-relaxed font-light"
          >
            We obsess over laminated pastry, single-origin espresso, and the kind of atmosphere
            where you actually want to stay a while.
          </motion.p>
        </div>

        {/* Traits column */}
        <div>
          {traits.map((trait, i) => (
            <motion.div
              key={trait.label}
              initial={{ opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.12 }}
              className="group flex gap-8 items-start py-8 border-b border-stone-800/40 last:border-0 cursor-default"
            >
              <span className="text-amber-700/50 text-xs font-mono mt-1 w-6 shrink-0 group-hover:text-amber-500 transition-colors duration-500">
                0{i + 1}
              </span>
              <div>
                <p className="text-amber-100 font-medium text-base mb-2 group-hover:text-amber-300 transition-colors duration-300">
                  {trait.label}
                </p>
                <p className="text-stone-500 text-sm font-light leading-relaxed">{trait.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
