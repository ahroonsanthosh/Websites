"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useEffect, useState } from "react";

const stats = [
  { value: 100, suffix: "%", label: "Fresh daily", description: "Every chicken prepared fresh each morning.", color: "#FF5500", bg: "rgba(255,85,0,0.08)" },
  { value: 4, suffix: "hrs", label: "Slow-roasted", description: "Patient rotisserie cooking for maximum flavour.", color: "#FFD000", bg: "rgba(255,208,0,0.08)" },
  { value: 1, suffix: "", label: "Premium rotisserie", description: "One machine, one obsession, perfect chicken.", color: "#AAFF00", bg: "rgba(170,255,0,0.08)" },
  { value: 7, suffix: "/7", label: "Days a week", description: "Open every day, noon to eight.", color: "#FF2D6B", bg: "rgba(255,45,107,0.08)" },
];

function CountUp({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = (target / (duration / step));
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [active, target]);

  return (
    <span>
      {count}{suffix}
    </span>
  );
}

export default function WhyHansumSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 bg-[#FFF8F0] overflow-hidden" id="about">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-8 h-px bg-orange-500" />
          <span className="text-orange-500 text-xs font-sans tracking-[0.3em] uppercase font-medium">
            Why Hansum
          </span>
        </motion.div>

        {/* Headline */}
        <div className="mb-20">
          <div className="overflow-hidden mb-2">
            <motion.h2
              initial={{ y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-black text-[#1A1A1A] leading-none"
            >
              Not your average
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-black italic leading-none text-gradient"
            >
              chicken spot.
            </motion.h2>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className="group glass rounded-3xl p-8 relative overflow-hidden cursor-default"
              style={{ borderColor: stat.color + "33" }}
            >
              {/* Coloured top bar */}
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: stat.color }} />
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" style={{ background: stat.bg }} />

              <div className="relative z-10">
                <div className="font-condensed text-[clamp(3rem,7vw,5rem)] leading-none mb-3" style={{ color: stat.color }}>
                  <CountUp target={stat.value} suffix={stat.suffix} active={isInView} />
                </div>
                <div className="font-display font-bold text-base text-[#1A1A1A] mb-2">{stat.label}</div>
                <div className="font-sans text-sm text-[#1A1A1A]/50 leading-relaxed">{stat.description}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom: text + photo side by side */}
        <div className="mt-20 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <p className="font-sans text-[clamp(1.1rem,2vw,1.35rem)] text-[#1A1A1A]/70 leading-relaxed">
              We started with one obsession: make the best rotisserie chicken Cork has ever tasted.
              Premium ingredients. Patient cooking. Zero shortcuts.{" "}
              <span className="font-semibold" style={{ color: "#FF5500" }}>Inside Marina Market</span>, where food is taken seriously.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl overflow-hidden h-72 lg:h-80 group"
          >
            <img
              src="/uploads/photo-kitchen-team.png"
              alt="Hansum team at work"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="font-sans text-white/80 text-xs tracking-widest uppercase">The Team</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
