"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const pillars = [
  { number: "01", emoji: "☕", title: "The Coffee", body: "Single origins and seasonal blends, dialed in by hand. No shortcuts." },
  { number: "02", emoji: "🌿", title: "The Food", body: "Seasonal plates built around what's good today, not what's convenient." },
  { number: "03", emoji: "🏠", title: "The Space", body: "A room that earns your silence. Come as you are, stay as long as you like." },
];

export default function Features() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <section ref={ref} className="py-24 md:py-32 bg-[var(--forest)]" aria-label="What we offer">
      <div className="px-5 md:px-10 max-w-7xl mx-auto">
        <div className="mb-14 md:mb-16">
          <p className="font-[var(--font-sans)] text-xs font-semibold tracking-widest uppercase text-[var(--orange-light)] mb-3">
            What we do
          </p>
          <h2 className="font-[var(--font-display)] font-black text-[clamp(2rem,5vw,4rem)] text-white leading-[1]" style={{ letterSpacing: "-0.02em" }}>
            Three things,<br />done well.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p, i) => {
            const [hovered, setHovered] = useState(false);
            return (
              <motion.div
                key={p.number}
                className="relative overflow-hidden rounded-2xl p-8 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] cursor-default"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                whileHover={{ borderColor: "rgba(232,99,58,0.5)" }}
              >
                <motion.div
                  className="absolute inset-0 bg-[var(--orange)] origin-bottom"
                  animate={{ scaleY: hovered ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                  style={{ transformOrigin: "bottom" }}
                />
                <div className="relative z-10">
                  <span className="text-4xl block mb-5">{p.emoji}</span>
                  <p className="font-[var(--font-sans)] text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: hovered ? "rgba(255,255,255,0.6)" : "var(--orange-light)" }}>
                    {p.number}
                  </p>
                  <h3 className="font-[var(--font-display)] font-black text-2xl mb-3 transition-colors duration-200" style={{ color: hovered ? "white" : "white" }}>
                    {p.title}
                  </h3>
                  <p className="font-[var(--font-sans)] text-sm leading-relaxed transition-colors duration-200" style={{ color: hovered ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.5)" }}>
                    {p.body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
