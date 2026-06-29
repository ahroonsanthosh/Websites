"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import RiverDivider from "./RiverDivider";

function Heron() {
  return (
    <motion.svg
      viewBox="0 0 200 220"
      className="w-28 md:w-44 h-auto"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      aria-hidden="true"
    >
      <motion.path
        d="M40 200 C 38 170, 60 150, 55 120 C 52 95, 30 85, 35 60 C 38 40, 55 25, 70 30 C 80 33, 78 45, 70 48 M70 30 L100 10 M70 48 C 65 55, 58 60, 50 58"
        fill="none"
        stroke="var(--brass)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.6, ease: "easeInOut" }}
      />
      <motion.ellipse
        cx="60" cy="58" rx="3" ry="2.4" fill="var(--brass)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      />
      <motion.path
        d="M55 120 C 40 130, 20 128, 10 145 M55 130 C 65 138, 80 138, 92 150"
        fill="none"
        stroke="var(--brass)"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, delay: 1.6, ease: "easeInOut" }}
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
  const drift = useTransform(scrollYProgress, [0, 1], [0, 30]);

  return (
    <section
      ref={containerRef}
      className="relative bg-[var(--ink)] grain overflow-hidden"
      aria-label="Hero"
    >
      <motion.div
        className="relative px-6 md:px-12 max-w-[1500px] mx-auto w-full pt-28 md:pt-36 pb-20 md:pb-28"
        style={{ opacity }}
      >
        {/* Top label row */}
        <motion.div
          className="flex items-center gap-3 mb-10 md:mb-14"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="h-px w-10 bg-[var(--brass)]" />
          <p className="label-engrave text-[var(--brass-light)]">
            Est. on the bend of the Lee · Cork&apos;s Victorian Quarter
          </p>
        </motion.div>

        <div className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-14 items-end">
          <motion.h1
            className="font-[var(--font-display)] italic font-black leading-[0.85] text-[var(--cream)] select-none"
            style={{ fontSize: "clamp(4.5rem, 17vw, 14rem)", letterSpacing: "-0.01em" }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {data.heading}
          </motion.h1>

          <motion.div style={{ y: drift }} className="flex justify-start md:justify-end">
            <Heron />
          </motion.div>
        </div>

        <motion.p
          className="font-[var(--font-sans)] text-[var(--mist)] text-base md:text-lg max-w-md mt-8 md:mt-10 leading-relaxed"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          {data.subheading} — a daytime café where slow mornings, honest plates and a good
          cup of coffee drift along at their own pace.
        </motion.p>

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
