"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import InstagramIcon from "@/components/ui/InstagramIcon";
import MagneticButton from "@/components/ui/MagneticButton";

function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; color: string; delay: number }>>([]);

  useEffect(() => {
    if (!active) return;
    const colors = ["#FF5500", "#FF2D6B", "#FFD000", "#AAFF00", "#00C2FF", "#8B5CF6", "#FF6BDB", "#00F5C4", "#ffffff"];
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.3,
      }))
    );
    const t = setTimeout(() => setParticles([]), 2500);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={`${p.id}-${active}`}
            className="absolute w-2 h-2 rounded-sm"
            style={{ left: `${p.x}%`, backgroundColor: p.color, top: "50%" }}
            initial={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
            animate={{
              y: [-20, -150 - Math.random() * 100],
              opacity: [1, 1, 0],
              scale: [1, 0.5],
              rotate: Math.random() * 360,
              x: (Math.random() - 0.5) * 200,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, delay: p.delay, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function CTASection() {
  const [confetti, setConfetti] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const triggerConfetti = () => {
    setConfetti(false);
    requestAnimationFrame(() => setConfetti(true));
  };

  // Scroll-scrubbed typography climax.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const ss = { stiffness: 200, damping: 38, mass: 0.35 };
  const bgScale = useSpring(useTransform(scrollYProgress, [0, 1], [0.75, 2.3]), ss);
  // Opacity does not need spring — direct transform is smoother and lag-free.
  const bgOpacity = useTransform(scrollYProgress, [0, 0.55, 1], [0.03, 0.09, 0.03]);
  const titleScale = useSpring(useTransform(scrollYProgress, [0, 0.55], [0.82, 1.04]), ss);
  const titleY = useSpring(useTransform(scrollYProgress, [0, 0.55], [60, 0]), ss);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0.2, 0.7], [0, 1]);
  const ctaOpacity = useTransform(scrollYProgress, [0.45, 0.7], [0, 1]);
  const ctaY = useSpring(useTransform(scrollYProgress, [0.45, 0.75], [40, 0]), ss);

  return (
    <section ref={ref} className="relative h-[180vh] bg-[#1A1A1A]" id="order">
      {/* Pinned climax scene */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        <Confetti active={confetti} />

        {/* Static base + scroll-driven warm glow (opacity only) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 55%, rgba(249,115,22,0.12) 0%, #1A1A1A 70%)",
          }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: glowOpacity,
            background:
              "radial-gradient(ellipse 90% 70% at 50% 60%, rgba(139,92,246,0.3) 0%, rgba(255,45,107,0.15) 40%, rgba(255,85,0,0) 70%)",
          }}
        />

        {/* Giant scroll-scrubbed background word */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
          <motion.span
            style={{ scale: bgScale, opacity: bgOpacity }}
            className="font-condensed text-[30vw] leading-none text-white will-change-transform"
          >
            EAT
          </motion.span>
        </div>

        {/* Foreground climax */}
        <motion.div
          style={{ scale: titleScale, y: titleY, opacity: titleOpacity }}
          className="relative z-10 max-w-5xl mx-auto px-6 text-center will-change-transform"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-sans tracking-widest uppercase mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Open Daily · 12pm–8pm
          </div>

          <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-black text-white leading-none mb-2">
            Ready to
          </h2>
          <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-black italic leading-none mb-10 text-gradient">
            Eat?
          </h2>

          <p className="font-sans text-white/50 text-lg mb-12 max-w-md mx-auto">
            Find us inside Marina Market, Cork City. Open every day, noon to eight.
          </p>

          <motion.div
            style={{ opacity: ctaOpacity, y: ctaY }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <MagneticButton
              href="#menu"
              variant="primary"
              className="text-base px-10 py-5"
              onClick={triggerConfetti}
            >
              View Full Menu
            </MagneticButton>
            <MagneticButton
              href="https://www.instagram.com/hansumcork"
              variant="ghost"
              className="text-base px-10 py-5 border-white/30 text-white hover:bg-white hover:text-charcoal gap-2"
            >
              <InstagramIcon className="w-4 h-4" />
              Follow Us
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
