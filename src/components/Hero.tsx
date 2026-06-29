"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import RiverDivider from "./RiverDivider";

function Heron() {
  return (
    <motion.svg
      viewBox="0 0 160 200"
      className="w-24 md:w-36 h-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, delay: 0.8 }}
      aria-hidden="true"
    >
      {/* Body / neck curve */}
      <motion.path
        d="M80 190 C 78 158, 96 138, 90 105 C 86 78, 62 68, 66 44 C 69 24, 88 12, 104 17 C 116 21, 112 36, 102 40"
        fill="none"
        stroke="var(--brass)"
        strokeWidth="1.8"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.2, delay: 0.9, ease: "easeInOut" }}
      />
      {/* Beak */}
      <motion.path
        d="M104 17 L130 4"
        fill="none"
        stroke="var(--brass)"
        strokeWidth="1.8"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, delay: 2.8, ease: "easeOut" }}
      />
      {/* Wings */}
      <motion.path
        d="M90 105 C 72 116, 50 112, 36 128 M90 118 C 108 128, 126 124, 136 140"
        fill="none"
        stroke="var(--brass)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.65"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 2.2, ease: "easeInOut" }}
      />
      {/* Eye */}
      <motion.circle
        cx="106" cy="20" r="2.5" fill="var(--brass)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2 }}
      />
    </motion.svg>
  );
}

export default function Hero({
  data,
}: {
  data: { heading: string; subheading: string; cta: string; image: string };
}) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heronY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <section
      ref={containerRef}
      className="relative bg-[var(--ink)] grain overflow-hidden"
      aria-label="Hero"
    >
      <motion.div
        className="relative px-8 md:px-16 lg:px-24 max-w-[1500px] mx-auto w-full pt-28 md:pt-40 pb-24 md:pb-36"
        style={{ opacity }}
      >
        {/* Heron — decorative, absolute top-right on desktop */}
        <motion.div
          className="absolute top-8 right-6 md:top-12 md:right-12 hidden sm:block"
          style={{ y: heronY }}
        >
          <Heron />
        </motion.div>

        {/* Top label */}
        <motion.div
          className="flex items-center gap-3 mb-10 md:mb-14"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="h-px w-10 bg-[var(--brass)] flex-shrink-0" />
          <p className="label-engrave text-[var(--brass-light)]">
            Est. on the bend of the Lee · Cork&apos;s Victorian Quarter
          </p>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="font-[var(--font-display)] italic font-black leading-[0.85] text-[var(--cream)] select-none w-full min-w-0"
          style={{ fontSize: "clamp(3.2rem, 16vw, 14rem)", letterSpacing: "-0.01em" }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {data.heading}
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="font-[var(--font-sans)] text-[var(--mist)] text-base md:text-lg max-w-md mt-8 md:mt-10 leading-relaxed"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          {data.subheading} — a daytime café where slow mornings, honest plates and a good
          cup of coffee drift along at their own pace.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap items-center gap-4 mt-10 md:mt-12"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
        >
          <a
            href="#menu"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="pill pill-solid font-[var(--font-sans)]"
          >
            {data.cta}
          </a>
          <a
            href="#location"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#location")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="pill pill-brass font-[var(--font-sans)]"
          >
            Find the Door
          </a>
          <span className="flex items-center gap-2 ml-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brass)] animate-pulse" />
            <span className="font-[var(--font-sans)] text-xs text-[var(--mist)] tracking-wide">
              Open Wed – Sun
            </span>
          </span>
        </motion.div>
      </motion.div>

      <RiverDivider from="var(--ink)" to="var(--parchment)" />
    </section>
  );
}
