"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

// 21st.dev – Clip reveal animation for images
function ClipImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div ref={ref} className="relative overflow-hidden">
      <motion.div
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={isInView ? { clipPath: "inset(0 0% 0 0)" } : {}}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
        className="w-full h-full"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </motion.div>

      {/* Wipe overlay that disappears */}
      <motion.div
        className="absolute inset-0 bg-[var(--cream)]"
        initial={{ x: "0%" }}
        animate={isInView ? { x: "100%" } : {}}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
      />
    </div>
  );
}

// 21st.dev – Stagger text reveal
function SplitReveal({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });
  const words = text.split(" ");

  return (
    <p ref={ref} className={`flex flex-wrap gap-x-[0.3em] ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={isInView ? { y: "0%" } : {}}
            transition={{
              delay: delay + i * 0.04,
              duration: 0.65,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </p>
  );
}

interface SiteData {
  about: { heading: string; body: string; image: string };
}

export default function About({ data }: { data: SiteData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-10%" });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-28 md:py-40 px-6 md:px-12 lg:px-24 bg-[var(--warm-white)]"
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-center">
        {/* Left: text */}
        <div className="order-2 md:order-1">
          {/* Eyebrow */}
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="separator" />
            <span className="font-[var(--font-sans)] text-[10px] tracking-[0.3em] uppercase text-[var(--terracotta)]">
              Our Story
            </span>
          </motion.div>

          {/* Heading with line-by-line reveal */}
          <h2
            ref={headingRef}
            id="about-heading"
            className="font-[var(--font-serif)] text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.1] text-[var(--charcoal)] font-light mb-8 overflow-hidden"
          >
            {data.about.heading.split(" ").map((word, i) => (
              <span key={i} className="overflow-hidden inline-block mr-[0.25em]">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={headingInView ? { y: "0%" } : {}}
                  transition={{ delay: i * 0.07, duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h2>

          {/* Body */}
          <SplitReveal
            text={data.about.body}
            className="font-[var(--font-sans)] text-[var(--muted)] leading-[1.85] text-[0.95rem] mb-10 max-w-md"
            delay={0.3}
          />

          {/* Micro-detail: signature line */}
          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="h-px flex-1 max-w-[60px] bg-[var(--border)]" />
            <span className="font-[var(--font-serif)] italic text-[var(--muted)] text-lg">
              Est. Cork, Ireland
            </span>
          </motion.div>
        </div>

        {/* Right: image with parallax */}
        <div className="order-1 md:order-2 relative h-[420px] md:h-[580px] overflow-hidden">
          <motion.div className="absolute inset-0" style={{ y: imageY }}>
            <ClipImage src={data.about.image} alt="Inside Bayou café" />
          </motion.div>

          {/* Floating tag */}
          <motion.div
            className="absolute bottom-6 left-6 bg-[var(--cream)] px-5 py-3 z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <p className="font-[var(--font-sans)] text-[9px] tracking-[0.25em] uppercase text-[var(--muted)]">
              Wed – Sun
            </p>
            <p className="font-[var(--font-serif)] text-[var(--charcoal)] text-lg mt-0.5">
              MacCurtain St.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
