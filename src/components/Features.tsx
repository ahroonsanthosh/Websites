"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import RiverDivider from "./RiverDivider";

const pillars = [
  {
    glyph: "☕",
    roman: "I",
    title: "The Coffee",
    body: "Single origins and seasonal blends, dialled in by hand. No shortcuts, no theatre — just an honest cup worth the walk.",
  },
  {
    glyph: "🌿",
    roman: "II",
    title: "The Food",
    body: "Seasonal plates built around what's good today. Produce first, then the recipe — never the other way round.",
  },
  {
    glyph: "◎",
    roman: "III",
    title: "The Space",
    body: "A room that earns your quiet. Come as you are, stay as long as the coffee lasts.",
  },
];

export default function Features() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <section ref={ref} className="bg-[var(--moss)] grain" aria-label="What we offer">
      <div className="px-6 md:px-12 max-w-7xl mx-auto pt-24 md:pt-32 pb-28 md:pb-36">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-20">
          <p className="label-engrave text-[var(--brass)]">III — Three Things, Steeped</p>
          <h2
            className="font-[var(--font-display)] italic font-black text-[clamp(2rem,5vw,4rem)] text-[var(--cream)] leading-[1]"
            style={{ letterSpacing: "-0.02em" }}
          >
            Done well,<br />or not at all.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {pillars.map((p, i) => (
            <motion.div
              key={p.roman}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
            >
              {/* Wax-seal badge */}
              <motion.div
                className="seal w-20 h-20 flex items-center justify-center mb-8 bg-[rgba(255,255,255,0.04)]"
                whileHover={{ scale: 1.08, rotate: 6 }}
                transition={{ duration: 0.35 }}
              >
                <span className="text-2xl">{p.glyph}</span>
              </motion.div>

              <p className="label-engrave text-[var(--brass)] mb-4">{p.roman}</p>
              <h3
                className="font-[var(--font-display)] italic font-black text-2xl md:text-3xl text-[var(--cream)] mb-4"
                style={{ letterSpacing: "-0.01em" }}
              >
                {p.title}
              </h3>
              <p className="font-[var(--font-sans)] text-sm leading-relaxed text-[var(--mist)]">
                {p.body}
              </p>
              <div className="mt-8 h-px bg-[var(--line-dark)]" />
            </motion.div>
          ))}
        </div>
      </div>

      <RiverDivider from="var(--moss)" to="var(--cream)" />
    </section>
  );
}
