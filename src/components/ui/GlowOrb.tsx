"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * A soft orb of warm light that follows the cursor and lights up the page.
 * Pure GPU work (transform + screen blend), disabled on touch / reduced motion.
 */
export default function GlowOrb() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const cx = useSpring(x, { stiffness: 300, damping: 30, mass: 0.5 });
  const cy = useSpring(y, { stiffness: 300, damping: 30, mass: 0.5 });
  const hx = useSpring(x, { stiffness: 90, damping: 24, mass: 1.1 });
  const hy = useSpring(y, { stiffness: 90, damping: 24, mass: 1.1 });

  useEffect(() => {
    if (reduce) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[35] overflow-hidden"
      style={{ mixBlendMode: "screen" }}
      aria-hidden="true"
    >
      {/* Wide soft halo (slow) */}
      <motion.div
        style={{ x: hx, y: hy }}
        className="absolute -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        <div
          style={{
            width: 520,
            height: 520,
            background:
              "radial-gradient(circle, rgba(249,115,22,0.20) 0%, rgba(249,115,22,0.07) 38%, rgba(249,115,22,0) 68%)",
          }}
        />
      </motion.div>

      {/* Hot core (snappy) */}
      <motion.div
        style={{ x: cx, y: cy }}
        className="absolute -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        <motion.div
          style={{
            width: 240,
            height: 240,
            background:
              "radial-gradient(circle, rgba(254,240,138,0.28) 0%, rgba(251,191,36,0.18) 32%, rgba(249,115,22,0.10) 55%, rgba(249,115,22,0) 72%)",
          }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
