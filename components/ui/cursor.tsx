"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 120, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 120, damping: 20, mass: 0.5 });

  const dotX = useSpring(x, { stiffness: 400, damping: 28 });
  const dotY = useSpring(y, { stiffness: 400, damping: 28 });

  const scaleRef = useRef(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const enter = () => { scaleRef.current = true; };
    const leave = () => { scaleRef.current = false; };

    document.addEventListener("mousemove", move);
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });

    return () => {
      document.removeEventListener("mousemove", move);
    };
  }, [x, y]);

  return (
    <>
      {/* Ring */}
      <motion.div
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
        className="fixed top-0 left-0 z-[9999] w-8 h-8 rounded-full border border-amber-500/40 pointer-events-none mix-blend-difference hidden md:block"
      />
      {/* Dot */}
      <motion.div
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        className="fixed top-0 left-0 z-[9999] w-1.5 h-1.5 rounded-full bg-amber-400 pointer-events-none hidden md:block"
      />
    </>
  );
}
