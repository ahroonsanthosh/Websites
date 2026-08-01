"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import RiverDivider from "./RiverDivider";

export default function About({ data }: { data: { about: { heading: string; body: string; image: string } } }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      id="about"
      ref={ref}
      className="bg-[var(--parchment)] grain"
      aria-labelledby="about-heading"
    >
      <div className="pt-28 md:pt-40 pb-32 md:pb-48 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto grid md:grid-cols-[1fr_1.1fr] gap-16 md:gap-24 items-start">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="label-engrave text-[var(--rust)] mb-5">II — Where the River Bends</p>
          <h2
            id="about-heading"
            className="font-[var(--font-display)] italic font-black text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.05] text-[var(--ink)] mb-7"
          >
            {data.about.heading}
          </h2>
          <p className="drop-cap font-[var(--font-sans)] text-[var(--ink)]/75 leading-relaxed text-base md:text-lg max-w-md mb-10">
            {data.about.body}
          </p>

          <div className="flex gap-10 pt-8 border-t border-[var(--line-light)]">
            {[
              { label: "Days Open", value: "5" },
              { label: "Address", value: "No. 8" },
              { label: "Since", value: "Cork" },
            ].map((f) => (
              <div key={f.label}>
                <p className="font-[var(--font-display)] italic font-black text-2xl text-[var(--rust)]">{f.value}</p>
                <p className="label-engrave text-[var(--ink)]/55 mt-1">{f.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="arch-frame h-[340px] md:h-[480px] border-4 border-[var(--brass)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.about.image}
              alt="Inside Bayou café"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <motion.div
            className="seal absolute -bottom-6 -left-6 w-24 h-24 bg-[var(--ink)] flex flex-col items-center justify-center text-center px-2"
            initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
            animate={isInView ? { opacity: 1, scale: 1, rotate: -8 } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="font-[var(--font-display)] italic font-black text-[var(--brass-light)] text-xs leading-tight">
              Victorian<br />Quarter
            </p>
          </motion.div>
        </motion.div>
      </div>

      <RiverDivider from="var(--parchment)" to="var(--teal)" />
    </section>
  );
}
