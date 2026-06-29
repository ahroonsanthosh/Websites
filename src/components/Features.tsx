"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const pillars = [
  {
    number: "01",
    title: "The Coffee",
    body: "Single origins and seasonal blends, dialed in by hand. No shortcuts.",
    icon: "◎",
  },
  {
    number: "02",
    title: "The Food",
    body: "Seasonal plates built around what's good today, not what's convenient.",
    icon: "◈",
  },
  {
    number: "03",
    title: "The Space",
    body: "A room that earns your silence. Come as you are, stay as long as you like.",
    icon: "◉",
  },
];

function PillarCard({
  item,
  index,
}: {
  item: (typeof pillars)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="group relative border border-[var(--border)] p-8 md:p-10 cursor-default overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Animated bg fill from bottom */}
      <motion.div
        className="absolute inset-0 bg-[var(--terracotta)] origin-bottom"
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        style={{ transformOrigin: "bottom" }}
      />

      <div className="relative z-10">
        {/* Number */}
        <motion.span
          className="font-[var(--font-sans)] text-[10px] tracking-[0.3em] uppercase block mb-6"
          animate={{ color: hovered ? "rgba(245,239,224,0.5)" : "var(--terracotta)" }}
        >
          {item.number}
        </motion.span>

        {/* Icon */}
        <motion.span
          className="block text-4xl mb-5"
          animate={{
            color: hovered ? "rgba(245,239,224,0.9)" : "var(--charcoal)",
            rotate: hovered ? 15 : 0,
            scale: hovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          {item.icon}
        </motion.span>

        {/* Title */}
        <motion.h3
          className="font-[var(--font-serif)] text-2xl font-light mb-4"
          animate={{ color: hovered ? "var(--cream)" : "var(--charcoal)" }}
        >
          {item.title}
        </motion.h3>

        {/* Body */}
        <motion.p
          className="font-[var(--font-sans)] text-sm leading-relaxed"
          animate={{ color: hovered ? "rgba(245,239,224,0.75)" : "var(--muted)" }}
        >
          {item.body}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function Features() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(headingRef, { once: true });

  return (
    <section className="py-28 md:py-40 px-6 md:px-12 lg:px-24 bg-[var(--warm-white)]" aria-label="What we offer">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-20 max-w-xl">
          <motion.div
            className="flex items-center gap-4 mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="separator" />
            <span className="font-[var(--font-sans)] text-[10px] tracking-[0.3em] uppercase text-[var(--terracotta)]">
              What we do
            </span>
          </motion.div>

          <h2
            ref={headingRef}
            className="font-[var(--font-serif)] text-[clamp(2rem,4.5vw,3.5rem)] font-light text-[var(--charcoal)] leading-[1.15]"
          >
            {["Three", "things,", "done", "well."].map((word, i) => (
              <span key={i} className="overflow-hidden inline-block mr-[0.25em]">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pillars.map((p, i) => (
            <PillarCard key={p.number} item={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
