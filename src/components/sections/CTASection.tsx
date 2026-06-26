"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InstagramIcon from "@/components/ui/InstagramIcon";
import MagneticButton from "@/components/ui/MagneticButton";

function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; color: string; delay: number }>>([]);

  useEffect(() => {
    if (!active) return;
    const colors = ["#F97316", "#DC2626", "#FBBF24", "#FFF8F0", "#ffffff"];
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

  const triggerConfetti = () => {
    setConfetti(false);
    requestAnimationFrame(() => setConfetti(true));
  };

  return (
    <section className="relative py-40 bg-[#1A1A1A] overflow-hidden" id="order">
      <Confetti active={confetti} />

      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(249,115,22,0.2) 0%, #1A1A1A 70%)",
            "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(220,38,38,0.15) 0%, #1A1A1A 70%)",
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(249,115,22,0.2) 0%, #1A1A1A 70%)",
          ],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Giant background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
        <motion.span
          className="font-condensed text-[30vw] leading-none text-white/[0.03]"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          EAT
        </motion.span>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-sans tracking-widest uppercase mb-10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          Open Daily · 12pm–8pm
        </motion.div>

        <div className="overflow-hidden mb-4">
          <motion.h2
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(3.5rem,10vw,9rem)] font-black text-white leading-none"
          >
            Ready to
          </motion.h2>
        </div>
        <div className="overflow-hidden mb-12">
          <motion.h2
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(3.5rem,10vw,9rem)] font-black italic text-orange-500 leading-none"
          >
            Eat?
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="font-sans text-white/50 text-lg mb-12 max-w-md mx-auto"
        >
          Find us inside Marina Market, Cork City. Open every day, noon to eight.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton
            href="#menu"
            variant="primary"
            className="text-base px-10 py-5"
            onClick={triggerConfetti}
          >
            View Full Menu 🍗
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
      </div>
    </section>
  );
}
