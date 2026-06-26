"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function Preloader() {
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setDone(true);
      return;
    }
    let c = 0;
    const interval = setInterval(() => {
      c += Math.floor(Math.random() * 9) + 3;
      if (c >= 100) {
        c = 100;
        clearInterval(interval);
        setTimeout(() => setDone(true), 600);
      }
      setCount(c);
    }, 90);
    return () => clearInterval(interval);
  }, [reduce]);

  // Lock scroll while the preloader is visible.
  useEffect(() => {
    document.body.style.overflow = done ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [done]);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] bg-[#1A1A1A] flex flex-col items-center justify-center overflow-hidden"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Rotating chicken */}
          <motion.div
            className="text-6xl mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          >
            🍗
          </motion.div>

          {/* Logo reveal */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-condensed text-white text-[clamp(3rem,12vw,7rem)] tracking-wider leading-none"
            >
              HANSUM
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-sans text-white/30 text-xs tracking-[0.4em] uppercase mt-2"
          >
            Rotisserie · Cork
          </motion.p>

          {/* Counter */}
          <div className="absolute bottom-8 right-8 font-condensed text-white/80 text-5xl tabular-nums">
            {count}
          </div>

          {/* Progress line */}
          <div className="absolute bottom-0 left-0 h-1 bg-orange-500" style={{ width: `${count}%` }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
