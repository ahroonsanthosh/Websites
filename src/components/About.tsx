"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function About({ data }: { data: { about: { heading: string; body: string; image: string } } }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      id="about"
      ref={ref}
      className="py-20 md:py-32 px-5 md:px-10 bg-[var(--cream)]"
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 md:gap-20 items-center">
        {/* Image — circle on mobile, square with circle overlay on desktop */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="relative h-[300px] md:h-[500px] overflow-hidden rounded-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.about.image}
              alt="Inside Bayou café"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          {/* Floating tag */}
          <motion.div
            className="absolute -bottom-5 -right-3 md:-right-8 bg-[var(--orange)] text-white px-5 py-3 rounded-2xl"
            initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
            animate={isInView ? { opacity: 1, scale: 1, rotate: -4 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <p className="font-[var(--font-display)] font-black text-sm">Est. Cork</p>
            <p className="font-[var(--font-sans)] text-xs opacity-90">Victorian Quarter</p>
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="font-[var(--font-sans)] text-xs font-semibold tracking-widest uppercase text-[var(--orange)] mb-4">
            Our Story
          </p>
          <h2
            id="about-heading"
            className="font-[var(--font-display)] font-black text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] text-[var(--charcoal)] mb-6"
            style={{ letterSpacing: "-0.02em" }}
          >
            {data.about.heading}
          </h2>
          <p className="font-[var(--font-sans)] text-[var(--muted)] leading-relaxed text-base mb-8 max-w-md">
            {data.about.body}
          </p>

          {/* Three micro-facts */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--border)]">
            {[
              { label: "Days Open", value: "5" },
              { label: "MacCurtain St.", value: "No. 8" },
              { label: "Est.", value: "Cork" },
            ].map((f) => (
              <div key={f.label}>
                <p className="font-[var(--font-display)] font-black text-2xl text-[var(--charcoal)]">{f.value}</p>
                <p className="font-[var(--font-sans)] text-xs text-[var(--muted)] mt-0.5">{f.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
