"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";

interface FloatingIngredientProps {
  emoji: string;
  size?: number;
  initialX?: number;
  initialY?: number;
  duration?: number;
  delay?: number;
  amplitude?: number;
}

export default function FloatingIngredient({
  emoji,
  size = 48,
  initialX = 0,
  initialY = 0,
  duration = 6,
  delay = 0,
  amplitude = 20,
}: FloatingIngredientProps) {
  return (
    <motion.div
      className="absolute select-none pointer-events-none z-10"
      style={{ fontSize: size, left: `${initialX}%`, top: `${initialY}%` }}
      initial={{ opacity: 0, scale: 0, rotate: -15 }}
      animate={{
        opacity: [0, 1, 1],
        scale: [0, 1.1, 1],
        y: [0, -amplitude, -amplitude / 2, -amplitude * 0.8, 0],
        rotate: [-15, 5, -5, 8, -15],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {emoji}
    </motion.div>
  );
}
