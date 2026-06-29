"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springX = useSpring(cursorX, { stiffness: 500, damping: 40 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40 });

  const trailX = useSpring(cursorX, { stiffness: 120, damping: 20 });
  const trailY = useSpring(cursorY, { stiffness: 120, damping: 20 });

  const isHoverRef = useRef(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverable = target.closest('a, button, [data-cursor="hover"]');
      if (hoverable && !isHoverRef.current) {
        isHoverRef.current = true;
        dotRef.current?.classList.add("scale-0");
        ringRef.current?.classList.add("!w-12", "!h-12", "!border-terracotta");
      } else if (!hoverable && isHoverRef.current) {
        isHoverRef.current = false;
        dotRef.current?.classList.remove("scale-0");
        ringRef.current?.classList.remove("!w-12", "!h-12", "!border-terracotta");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Dot */}
      <motion.div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[var(--terracotta)] pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hidden md:block"
        style={{ x: springX, y: springY }}
      />
      {/* Ring */}
      <motion.div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[var(--terracotta)] opacity-50 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hidden md:block"
        style={{ x: trailX, y: trailY }}
      />
    </>
  );
}
