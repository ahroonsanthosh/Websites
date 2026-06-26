"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import FloatingIngredient from "@/components/ui/FloatingIngredient";

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
  const [showConfetti, setShowConfetti] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const headline = content.headline.split(" ");

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
  };

  const wordVariants = {
    hidden: { y: "120%", opacity: 0, rotate: 3 },
    visible: {
      y: "0%",
      opacity: 1,
      rotate: 0,
      transition: { type: "spring" as const, stiffness: 80, damping: 16 },
    },
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#1A1A1A]"
      id="hero"
    >
      {/* Animated gradient bg */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(249,115,22,0.15) 0%, rgba(220,38,38,0.08) 40%, #1A1A1A 100%)",
            "radial-gradient(ellipse 60% 80% at 40% 60%, rgba(220,38,38,0.15) 0%, rgba(249,115,22,0.08) 40%, #1A1A1A 100%)",
            "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(251,191,36,0.1) 0%, rgba(249,115,22,0.12) 40%, #1A1A1A 100%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />

      {/* Giant background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.span
          className="font-condensed text-[22vw] leading-none text-white/[0.04] whitespace-nowrap"
          animate={{ x: ["-2%", "2%", "-2%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          HANSUM
        </motion.span>
      </div>

      {/* Floating ingredients */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingIngredient emoji="🍗" size={52} initialX={8} initialY={15} duration={7} delay={0.5} amplitude={25} />
        <FloatingIngredient emoji="🌶️" size={38} initialX={88} initialY={20} duration={9} delay={1} amplitude={18} />
        <FloatingIngredient emoji="🥗" size={44} initialX={12} initialY={70} duration={8} delay={1.5} amplitude={22} />
        <FloatingIngredient emoji="🧀" size={34} initialX={85} initialY={72} duration={6} delay={0.8} amplitude={15} />
        <FloatingIngredient emoji="🔥" size={30} initialX={50} initialY={10} duration={5} delay={2} amplitude={12} />
      </div>

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-6 max-w-6xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-sans tracking-widest uppercase mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          {content.badge}
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="font-display text-[clamp(3rem,9vw,8rem)] leading-[0.92] font-black text-white mb-8 tracking-tight"
        >
          {headline.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mr-[0.2em] last:mr-0">
              <motion.span
                variants={wordVariants}
                className={`inline-block ${i === headline.length - 1 ? "text-gradient" : ""}`}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7, ease: "easeOut" }}
          className="font-sans text-[clamp(1rem,2.5vw,1.35rem)] text-white/60 font-light max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          {content.subheadline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton
            href={content.cta_primary_link}
            variant="primary"
            className="text-base px-10 py-5"
            onClick={() => setShowConfetti(true)}
          >
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

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="text-white/30 text-[10px] font-sans tracking-[0.3em] uppercase">Scroll</span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent"
          animate={{ scaleY: [1, 0.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </section>
  );
}
