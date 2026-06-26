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

  // Image container expands from small centered frame to full viewport
  const width  = useTransform(scrollYProgress, [0, 0.7], ["40%", "100%"]);
  const height = useTransform(scrollYProgress, [0, 0.7], ["55vh", "100vh"]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.5], ["24px", "0px"]);

  // Overlay darkens as it expands
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.35, 0.72]);

  // Title & tagline float upward and fade
  const textY       = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  // Bottom CTA fades in as expansion completes
  const ctaOpacity  = useTransform(scrollYProgress, [0.5, 0.75], [0, 1]);
  const ctaY        = useTransform(scrollYProgress, [0.5, 0.75], [40, 0]);

  // Subtitle that appears inside the expanded image
  const subOpacity  = useTransform(scrollYProgress, [0.55, 0.8], [0, 1]);
  const subY        = useTransform(scrollYProgress, [0.55, 0.8], [30, 0]);

  return (
    <div ref={containerRef} className="relative h-[250vh]">
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-[var(--dark)]">

        {/* Grain overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px",
          }}
        />

        {/* Expanding image frame */}
        <motion.div
          style={{ width, height, borderRadius }}
          className="relative overflow-hidden"
        >
          {/* Photo */}
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover object-center"
          />

          {/* Dark overlay */}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-[var(--dark)]"
          />

          {/* Subtitle inside expanded image */}
          <motion.div
            style={{ opacity: subOpacity, y: subY }}
            className="absolute inset-0 flex flex-col items-center justify-end pb-16 md:pb-24 text-center px-6"
          >
            <p className="text-[11px] tracking-[0.28em] uppercase text-[var(--amber)] mb-4 font-medium">
              {tagline ?? "Cork City · Est. 2012"}
            </p>
            {subtitle && (
              <p
                className="text-[var(--cream-2)] text-lg md:text-2xl font-light"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}
              >
                {subtitle}
              </p>
            )}
          </motion.div>

          {/* Thin amber border when collapsed */}
          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]),
              borderRadius,
            }}
            className="absolute inset-0 border border-[var(--amber)] pointer-events-none"
          />
        </motion.div>

        {/* Floating headline — above the frame, fades as expansion starts */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="absolute top-[18%] md:top-[22%] left-0 right-0 flex flex-col items-center text-center px-6 z-20 pointer-events-none"
        >
          <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--amber)] font-medium mb-6">
            {tagline ?? "Cork City · Est. 2012"}
          </p>
          <div
            className="text-[var(--cream)] leading-[0.88] select-none"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {title}
          </div>
        </motion.div>

        {/* CTA — fades in after expansion */}
        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="absolute bottom-10 md:bottom-14 left-0 right-0 flex flex-col items-center gap-4 z-20"
        >
          <a
            href={ctaHref}
            className="px-10 py-4 bg-[var(--amber)] text-[var(--dark)] text-[11px] font-semibold tracking-[0.18em] uppercase transition-all duration-300 hover:bg-[var(--amber-lt)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(200,134,10,0.35)]"
          >
            {ctaLabel}
          </a>
          <div className="flex flex-col items-center gap-2 opacity-60">
            <span className="text-[9px] tracking-[0.25em] uppercase text-[var(--grey)]">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-[var(--amber)] to-transparent animate-pulse" />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
