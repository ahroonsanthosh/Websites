"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

interface ScrollExpansionHeroProps {
  imageSrc: string;
  imageAlt: string;
  tagline?: string;
  title: React.ReactNode;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function ScrollExpansionHero({
  imageSrc,
  imageAlt,
  tagline,
  title,
  subtitle,
  ctaLabel = "Explore",
  ctaHref = "#menu",
}: ScrollExpansionHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const width         = useTransform(scrollYProgress, [0, 0.65], ["52%", "100%"]);
  const height        = useTransform(scrollYProgress, [0, 0.65], ["58vh", "100vh"]);
  const borderRadius  = useTransform(scrollYProgress, [0, 0.5],  ["20px", "0px"]);
  const overlayOpacity= useTransform(scrollYProgress, [0, 0.6],  [0.3, 0.7]);
  const textY         = useTransform(scrollYProgress, [0, 0.4],  [0, -60]);
  const textOpacity   = useTransform(scrollYProgress, [0, 0.3],  [1, 0]);
  const ctaOpacity    = useTransform(scrollYProgress, [0.5, 0.75],[0, 1]);
  const ctaY          = useTransform(scrollYProgress, [0.5, 0.75],[32, 0]);
  const subOpacity    = useTransform(scrollYProgress, [0.5, 0.78],[0, 1]);
  const subY          = useTransform(scrollYProgress, [0.5, 0.78],[24, 0]);
  const frameBorder   = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-[var(--dark)]">

        {/* Grain */}
        <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.035]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "128px" }} />

        {/* Expanding image */}
        <motion.div style={{ width, height, borderRadius }} className="relative overflow-hidden">
          <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover object-center" />
          <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-[var(--dark)]" />

          {/* Subtitle inside expanded image */}
          <motion.div style={{ opacity: subOpacity, y: subY }}
            className="absolute inset-0 flex flex-col items-center justify-end pb-12 md:pb-20 text-center px-6 z-10">
            <p className="text-[10px] tracking-[0.28em] uppercase text-[var(--amber)] mb-3 font-medium">
              {tagline ?? "Cork City · Est. 2012"}
            </p>
            {subtitle && (
              <p className="text-[var(--cream-2)] text-base md:text-xl font-light"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>
                {subtitle}
              </p>
            )}
          </motion.div>

          {/* Frame border */}
          <motion.div style={{ opacity: frameBorder, borderRadius }}
            className="absolute inset-0 border border-[var(--amber)] pointer-events-none" />
        </motion.div>

        {/* Floating headline */}
        <motion.div style={{ y: textY, opacity: textOpacity }}
          className="absolute top-[15%] md:top-[20%] left-0 right-0 flex flex-col items-center text-center px-6 z-20 pointer-events-none">
          <p className="text-[9px] md:text-[11px] tracking-[0.3em] uppercase text-[var(--amber)] font-medium mb-4 md:mb-6">
            {tagline ?? "Cork City · Est. 2012"}
          </p>
          <div className="text-[var(--cream)] leading-[0.88]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {title}
          </div>
        </motion.div>

        {/* CTA after expansion */}
        <motion.div style={{ opacity: ctaOpacity, y: ctaY }}
          className="absolute bottom-8 md:bottom-12 left-0 right-0 flex flex-col items-center gap-3 z-20">
          <a href={ctaHref}
            className="px-8 md:px-10 py-3.5 md:py-4 bg-[var(--amber)] text-[var(--dark)] text-[10px] md:text-[11px] font-semibold tracking-[0.18em] uppercase transition-all duration-300 hover:bg-[var(--amber-lt)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(200,134,10,0.35)]">
            {ctaLabel}
          </a>
          <div className="flex flex-col items-center gap-2 opacity-50">
            <span className="text-[8px] tracking-[0.25em] uppercase text-[var(--grey)]">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-[var(--amber)] to-transparent animate-pulse" />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
