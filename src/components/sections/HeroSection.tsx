"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
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

/** A single depth-layered, cursor-reactive floating ingredient. */
function FloatingFood({
  emoji,
  baseX,
  baseY,
  depth,
  size,
  mvX,
  mvY,
  scrollFloat,
}: {
  emoji: string;
  baseX: number;
  baseY: number;
  depth: number; // 0 (far) → 1 (near); near = more parallax/cursor pull
  size: number;
  mvX: MotionValue<number>;
  mvY: MotionValue<number>;
  scrollFloat: MotionValue<number>;
}) {
  // Cursor magnetic field — nearer layers react more strongly.
  const pull = 80 * depth;
  const cursorX = useTransform(mvX, [-0.5, 0.5], [-pull, pull]);
  const cursorY = useTransform(mvY, [-0.5, 0.5], [-pull, pull]);
  const x = useSpring(cursorX, spring.floaty);
  const y = useSpring(cursorY, spring.floaty);

  return (
    // Layer 1 — position + scroll parallax
    <motion.div
      className="absolute will-change-transform"
      style={{
        left: `${baseX}%`,
        top: `${baseY}%`,
        y: scrollFloat,
        opacity: 0.55 + depth * 0.45,
        zIndex: Math.round(depth * 10),
        filter: depth < 0.5 ? "blur(2px)" : "none",
      }}
    >
      {/* Layer 2 — cursor magnetic field (springs) */}
      <motion.div style={{ x, y }}>
        {/* Layer 3 — entrance + idle bob */}
        <motion.span
          className="block select-none"
          style={{ fontSize: size }}
          initial={{ scale: 0, rotate: -30 }}
          animate={{
            scale: 1,
            rotate: [0, depth > 0.6 ? 8 : -6, 0],
            y: [0, -12 * depth, 0],
          }}
          transition={{
            scale: { ...spring.smooth, delay: 0.4 + (1 - depth) * 0.3 },
            rotate: { duration: 5 + depth * 3, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 5 + depth * 3, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          {emoji}
        </motion.span>
      </motion.div>
    </motion.div>
  );
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

  // Multi-state scroll transformation of the pinned scene.
  const headlineScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.35]);
  const headlineY = useTransform(scrollYProgress, [0, 0.6], ["0%", "-30%"]);
  const headlineBlur = useTransform(scrollYProgress, [0, 0.45], [0, 12]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.7], [0.05, 0.12]);
  const sceneOverlay = useTransform(scrollYProgress, [0.3, 0.75], [0, 1]);
  const foodScrollY = useTransform(scrollYProgress, [0, 1], [0, -240]);
  const filterBlur = useTransform(headlineBlur, (b) => `blur(${b}px)`);
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

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
    <section ref={ref} className="relative h-[200vh]" id="hero" aria-label="Hansum Rotisserie hero">
      {/* Pinned cinematic scene */}
      <div className="sticky top-0 h-screen overflow-hidden bg-[#1A1A1A] flex items-center justify-center">
        {/* Animated gradient atmosphere */}
        <motion.div
          className="absolute inset-0 z-0"
          animate={{
            background: [
              "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(249,115,22,0.18) 0%, rgba(220,38,38,0.08) 40%, #1A1A1A 100%)",
              "radial-gradient(ellipse 60% 80% at 45% 55%, rgba(220,38,38,0.16) 0%, rgba(249,115,22,0.08) 40%, #1A1A1A 100%)",
              "radial-gradient(ellipse 80% 60% at 55% 40%, rgba(251,191,36,0.12) 0%, rgba(249,115,22,0.12) 40%, #1A1A1A 100%)",
            ],
          }}
          transition={{ duration: 9, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />

        {/* BACKGROUND depth layer — giant kinetic wordmark */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ scale: bgScale, opacity: bgOpacity }}
        >
          <span className="font-condensed text-[26vw] leading-none text-white whitespace-nowrap">
            HANSUM
          </span>
        </motion.div>

        {/* MID depth layer — cursor-reactive floating food */}
        <div className="absolute inset-0 pointer-events-none">
          <FloatingFood emoji="🍗" baseX={10} baseY={22} depth={1} size={64} mvX={mvX} mvY={mvY} scrollFloat={foodScrollY} />
          <FloatingFood emoji="🌶️" baseX={84} baseY={26} depth={0.8} size={46} mvX={mvX} mvY={mvY} scrollFloat={foodScrollY} />
          <FloatingFood emoji="🧀" baseX={16} baseY={70} depth={0.55} size={40} mvX={mvX} mvY={mvY} scrollFloat={foodScrollY} />
          <FloatingFood emoji="🥗" baseX={80} baseY={68} depth={0.7} size={50} mvX={mvX} mvY={mvY} scrollFloat={foodScrollY} />
          <FloatingFood emoji="🔥" baseX={50} baseY={14} depth={0.35} size={34} mvX={mvX} mvY={mvY} scrollFloat={foodScrollY} />
        </div>

        {/* FOREGROUND — headline & content, with camera tilt */}
        <motion.div
          className="relative z-20 text-center px-6 max-w-6xl mx-auto"
          style={{
            scale: headlineScale,
            y: headlineY,
            opacity: headlineOpacity,
            filter: filterBlur,
            rotateX: tiltX,
            rotateY: tiltY,
            transformPerspective: 1200,
          }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring.smooth, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-sans tracking-widest uppercase mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            {content.badge}
          </motion.div>

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
            <MagneticButton href={content.cta_primary_link} variant="primary" className="text-base px-10 py-5">
              {content.cta_primary}
              <span className="ml-1">→</span>
            </MagneticButton>
            <MagneticButton
              href={content.cta_secondary_link}
              variant="ghost"
              className="text-base px-10 py-5 border-white/30 text-white hover:bg-white hover:text-charcoal"
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
          <span className="text-white/30 text-[10px] font-sans tracking-[0.3em] uppercase">Scroll</span>
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
