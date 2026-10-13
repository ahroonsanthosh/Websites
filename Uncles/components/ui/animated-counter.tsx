"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: string;
  className?: string;
  duration?: number;
}

function parseNumber(val: string): { prefix: string; num: number; suffix: string } {
  const match = val.match(/^([^0-9]*)([0-9]+)([^0-9]*)$/);
  if (!match) return { prefix: "", num: 0, suffix: val };
  return { prefix: match[1], num: parseInt(match[2], 10), suffix: match[3] };
}

export function AnimatedCounter({ value, className = "", duration = 1800 }: AnimatedCounterProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState("0");
  const { prefix, num, suffix } = parseNumber(value);
  const isNumeric = num > 0 || value === "0";

  useEffect(() => {
    if (!inView || !isNumeric) { setDisplay(value); return; }
    // For large numbers (e.g. years), start near the end so the count is readable
    const startNum = num >= 1000 ? Math.floor(num * 0.88) : 0;
    const range = num - startNum;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startNum + eased * range);
      setDisplay(`${prefix}${current}${suffix}`);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView]);

  return <span ref={ref} className={className}>{display}</span>;
}
