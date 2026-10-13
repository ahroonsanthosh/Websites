import type { Transition } from "framer-motion";

/**
 * One consistent, physics-based motion system for the whole site.
 * Everything springs — no linear easing.
 */
export const spring = {
  /** Snappy UI response (buttons, hovers). */
  snappy: { type: "spring", stiffness: 400, damping: 28, mass: 0.6 } as Transition,
  /** Smooth, weighty motion (scene elements). */
  smooth: { type: "spring", stiffness: 120, damping: 22, mass: 1 } as Transition,
  /** Loose, floaty drift (background depth layers). */
  floaty: { type: "spring", stiffness: 60, damping: 18, mass: 1.4 } as Transition,
  /** Magnetic attraction. */
  magnetic: { type: "spring", stiffness: 200, damping: 15, mass: 0.5 } as Transition,
};

/** Cinematic mask-reveal easing (used for clip-path / curtain reveals). */
export const easeCine = [0.16, 1, 0.3, 1] as const;
export const easeCurtain = [0.76, 0, 0.24, 1] as const;
