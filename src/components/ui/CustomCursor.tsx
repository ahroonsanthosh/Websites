"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [label, setLabel] = useState("");
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const ringX = useSpring(cursorX, { damping: 20, stiffness: 200, mass: 0.8 });
  const ringY = useSpring(cursorY, { damping: 20, stiffness: 200, mass: 0.8 });

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    // Cheap interactivity check off the event target — no getComputedStyle or
    // elementFromPoint (both force synchronous style/layout work each move).
    const checkPointer = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest) return;
      const interactive = !!target.closest(
        'a, button, [role="button"], input, textarea, select, label, [data-cursor-label]'
      );
      setIsPointer((prev) => (prev === interactive ? prev : interactive));
      const labelEl = target.closest("[data-cursor-label]") as HTMLElement | null;
      const dataLabel = labelEl?.dataset.cursorLabel ?? "";
      setLabel((prev) => (prev === dataLabel ? prev : dataLabel));
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseover", checkPointer);
    document.addEventListener("mouseleave", () => setIsVisible(false));

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", checkPointer);
      document.removeEventListener("mouseleave", () => setIsVisible(false));
    };
  }, [cursorX, cursorY]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden>
      {/* Dot */}
      <motion.div
        style={{ x: cursorX, y: cursorY }}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-500"
        animate={{ opacity: isVisible ? 1 : 0, scale: isPointer ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
      {/* Ring */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-500/60 flex items-center justify-center"
        animate={{
          opacity: isVisible ? 1 : 0,
          width: isPointer ? 56 : label ? 64 : 36,
          height: isPointer ? 56 : label ? 64 : 36,
          backgroundColor: isPointer ? "rgba(249,115,22,0.1)" : "transparent",
        }}
        transition={{ duration: 0.2 }}
      >
        {label && (
          <span className="text-[9px] font-condensed tracking-widest text-orange-500 uppercase">
            {label}
          </span>
        )}
      </motion.div>
    </div>
  );
}
