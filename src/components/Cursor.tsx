"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40 });
  const sy = useSpring(y, { stiffness: 500, damping: 40 });
  const tx = useSpring(x, { stiffness: 100, damping: 20 });
  const ty = useSpring(y, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-[var(--orange)] pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{ x: sx, y: sy }}
      />
      <motion.div
        className="fixed top-0 left-0 w-9 h-9 rounded-full border-2 border-[var(--orange)] opacity-40 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{ x: tx, y: ty }}
      />
    </>
  );
}
