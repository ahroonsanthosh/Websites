"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";

interface KineticMarqueeProps {
  text: string;
  baseSpeed?: number;
  className?: string;
  dark?: boolean;
}

/**
 * A marquee whose direction/speed react to scroll velocity, with a subtle
 * skew while scrolling — a premium kinetic-typography touch.
 */
export default function KineticMarquee({
  text,
  baseSpeed = 60,
  className = "",
  dark = false,
}: KineticMarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const skew = useTransform(smoothVelocity, [-1000, 0, 1000], [-6, 0, 6], { clamp: true });

  const directionFactor = useRef(1);

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseSpeed * (delta / 1000);
    const v = velocityFactor.get();
    if (v < 0) directionFactor.current = -1;
    else if (v > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * v;
    const next = baseX.get() + moveBy;
    // wrap within -50%..0
    baseX.set(((next % -50) + -50) % -50);
  });

  const x = useTransform(baseX, (v) => `${v}%`);
  const repeated = `${text}   ${text}   ${text}   ${text}   `;

  return (
    <div
      ref={ref}
      className={`overflow-hidden whitespace-nowrap ${dark ? "bg-[#1A1A1A]" : "bg-[#FFF8F0]"} border-y ${dark ? "border-white/10" : "border-[#1A1A1A]/10"} py-6 ${className}`}
    >
      <motion.div className="flex whitespace-nowrap" style={{ x, skewX: skew }}>
        <span
          className={`font-condensed text-[clamp(2rem,5vw,4rem)] tracking-[0.08em] ${dark ? "text-white/80" : "text-[#1A1A1A]/80"}`}
        >
          {repeated}
        </span>
        <span
          className={`font-condensed text-[clamp(2rem,5vw,4rem)] tracking-[0.08em] ${dark ? "text-white/80" : "text-[#1A1A1A]/80"}`}
        >
          {repeated}
        </span>
      </motion.div>
    </div>
  );
}
