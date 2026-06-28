"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import { spring, easeCine } from "@/lib/motion";

interface HeroContent {
  headline: string;
  subheadline: string;
  cta_primary: string;
  cta_primary_link: string;
  cta_secondary: string;
  cta_secondary_link: string;
  badge: string;
}

export default function HeroSection({ content }: { content: HeroContent }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [introDone, setIntroDone] = useState(false);

  // Scroll runway: the section is tall; the scene inside is pinned (sticky).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Multi-state scroll transformation of the pinned scene — continuous from
  // the first pixel of scroll, fading out at the very end so the next section
  // follows immediately (the fiery overlay fills the final stretch, no blank).
  // GPU-only transforms (scale / translate / opacity) — no animated blur or
  // background repaints, so the scene stays buttery while scrolling.
  const headlineScale = useTransform(scrollYProgress, [0, 0.9], [1, 1.35]);
  const headlineY = useTransform(scrollYProgress, [0, 0.9], ["0%", "-26%"]);
  const headlineOpacity = useTransform(scrollYProgress, [0.4, 0.82], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.7]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.9], [0.05, 0.16]);
  const sceneOverlay = useTransform(scrollYProgress, [0.45, 0.92], [0, 0.9]);
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // Direct transforms — no intermediate spring; browser scroll is already
  // smooth on modern devices and chained springs add visible lag.
  const sHeadlineScale = headlineScale;
  const sHeadlineY = headlineY;
  const sHeadlineOpacity = headlineOpacity;
  const sBgScale = bgScale;

  // Cursor influence field (normalised -0.5..0.5).
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);

  useEffect(() => {
    const t = setTimeout(() => setIntroDone(true), reduce ? 0 : 1700);
    return () => clearTimeout(t);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const handle = (e: MouseEvent) => {
      mvX.set(e.clientX / window.innerWidth - 0.5);
      mvY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [mvX, mvY, reduce]);

  const words = content.headline.split(" ");

  // Subtle scene tilt following the cursor (parallax camera).
  const tiltX = useSpring(useTransform(mvY, [-0.5, 0.5], [4, -4]), spring.smooth);
  const tiltY = useSpring(useTransform(mvX, [-0.5, 0.5], [-4, 4]), spring.smooth);

  return (
    <section ref={ref} className="relative h-[220vh]" id="hero" aria-label="Hansum Rotisserie hero">
      {/* Pinned cinematic scene */}
      <div className="sticky top-0 h-screen overflow-hidden bg-[#1A1A1A] flex items-center justify-center pt-24 pb-8">
        {/* Real photo background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/uploads/photo-hero.png"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
            style={{ filter: "brightness(0.28) saturate(1.2)" }}
          />
        </div>
        {/* Static base atmosphere (no per-frame repaint) */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(255,85,0,0.22) 0%, rgba(255,45,107,0.08) 40%, transparent 100%)",
          }}
        />
        {/* Accent glow — animates OPACITY only (GPU-composited, smooth) */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 55% 55%, rgba(251,191,36,0.14) 0%, rgba(249,115,22,0) 55%)",
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* BACKGROUND depth layer — giant kinetic wordmark */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none will-change-transform"
          style={{ scale: sBgScale, opacity: bgOpacity }}
        >
          <span className="font-condensed text-[26vw] leading-none text-white whitespace-nowrap">
            HANSUM
          </span>
        </motion.div>

        {/* FOREGROUND — headline & content, with camera tilt */}
        <motion.div
          className="relative z-20 text-center px-6 max-w-6xl mx-auto will-change-transform"
          style={{
            scale: sHeadlineScale,
            y: sHeadlineY,
            opacity: sHeadlineOpacity,
            rotateX: tiltX,
            rotateY: tiltY,
            transformPerspective: 1200,
          }}
        >

          {/* Headline — layered mask reveal (no fade/slide) */}
          <h1 className="font-display text-[clamp(3rem,9vw,8rem)] leading-[0.92] font-black text-white mb-8 tracking-tight">
            {words.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.2em] last:mr-0">
                <motion.span
                  className={`inline-block ${i === words.length - 1 ? "text-gradient" : ""}`}
                  initial={{ y: "115%", rotate: 4 }}
                  animate={{ y: "0%", rotate: 0 }}
                  transition={{ ...spring.smooth, delay: 0.35 + i * 0.09 }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Subheadline — clip mask reveal */}
          <motion.div
            className="overflow-hidden mx-auto max-w-2xl mb-12"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 1, ease: easeCine, delay: 0.9 }}
          >
            <p className="font-sans text-[clamp(1rem,2.5vw,1.35rem)] text-white/60 font-light leading-relaxed">
              {content.subheadline}
            </p>
          </motion.div>

          {/* CTAs — appear ONLY after the intro transformation completes */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={introDone ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={spring.snappy}
            style={{ pointerEvents: introDone ? "auto" : "none" }}
          >
            <MagneticButton href={content.cta_primary_link} variant="primary" className="text-base px-7 py-4 md:px-10 md:py-5">
              {content.cta_primary}
              <span className="ml-1">→</span>
            </MagneticButton>
            <MagneticButton
              href={content.cta_secondary_link}
              variant="ghost"
              className="text-base px-7 py-4 md:px-10 md:py-5 border-white/30 text-white hover:bg-white hover:text-charcoal"
            >
              {content.cta_secondary}
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Scene-transition overlay — the scene "burns in" as you scroll out */}
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{
            opacity: sceneOverlay,
            background:
              "radial-gradient(ellipse 120% 90% at 50% 120%, rgba(249,115,22,0.5) 0%, rgba(220,38,38,0.25) 40%, transparent 70%)",
          }}
        />

        {/* Scroll indicator (fades as the transformation begins) */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
          style={{ opacity: scrollHintOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: introDone ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-white/30 text-xs font-sans tracking-[0.3em] uppercase">Scroll</span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent"
            animate={{ scaleY: [1, 0.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
