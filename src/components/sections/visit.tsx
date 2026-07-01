"use client";

import { motion } from "framer-motion";
import { PulseBeams } from "@/components/ui/pulse-beams";
import { Magnetic } from "@/components/magnetic";
import { HOURS, SITE } from "@/data/site";
import { MapPin, Phone } from "lucide-react";

const beams = [
  {
    path: "M269 220.5H16.5C10.9772 220.5 6.5 224.977 6.5 230.5V398.5",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: {
        x1: ["0%", "0%", "200%"],
        x2: ["0%", "0%", "180%"],
        y1: ["80%", "0%", "0%"],
        y2: ["100%", "20%", "20%"],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 2,
        delay: Math.random() * 2,
      },
    },
    connectionPoints: [
      { cx: 6.5, cy: 398.5, r: 6 },
      { cx: 269, cy: 220.5, r: 6 },
    ],
  },
  {
    path: "M568 200H841C846.523 200 851 195.523 851 190V40",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: {
        x1: ["20%", "100%", "100%"],
        x2: ["0%", "90%", "90%"],
        y1: ["80%", "80%", "-20%"],
        y2: ["100%", "100%", "0%"],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 2,
        delay: Math.random() * 2,
      },
    },
    connectionPoints: [
      { cx: 851, cy: 34, r: 6.5 },
      { cx: 568, cy: 200, r: 6 },
    ],
  },
  {
    path: "M425.5 274V333C425.5 338.523 421.023 343 415.5 343H152C146.477 343 142 347.477 142 353V426.5",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: {
        x1: ["20%", "100%", "100%"],
        x2: ["0%", "90%", "90%"],
        y1: ["80%", "80%", "-20%"],
        y2: ["100%", "100%", "0%"],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 2,
        delay: Math.random() * 2,
      },
    },
    connectionPoints: [
      { cx: 142, cy: 427, r: 6.5 },
      { cx: 425.5, cy: 274, r: 6 },
    ],
  },
  {
    path: "M493 274V333.226C493 338.749 497.477 343.226 503 343.226H760C765.523 343.226 770 347.703 770 353.226V427",
    gradientConfig: {
      initial: { x1: "40%", x2: "50%", y1: "160%", y2: "180%" },
      animate: { x1: "0%", x2: "10%", y1: "-40%", y2: "-20%" },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 2,
        delay: Math.random() * 2,
      },
    },
    connectionPoints: [
      { cx: 770, cy: 427, r: 6.5 },
      { cx: 493, cy: 274, r: 6 },
    ],
  },
  {
    path: "M380 168V17C380 11.4772 384.477 7 390 7H414",
    gradientConfig: {
      initial: { x1: "-40%", x2: "-10%", y1: "0%", y2: "20%" },
      animate: {
        x1: ["40%", "0%", "0%"],
        x2: ["10%", "0%", "0%"],
        y1: ["0%", "0%", "180%"],
        y2: ["20%", "20%", "200%"],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 2,
        delay: Math.random() * 2,
      },
    },
    connectionPoints: [
      { cx: 420.5, cy: 6.5, r: 6 },
      { cx: 380, cy: 168, r: 6 },
    ],
  },
];

// Warm café palette instead of the demo's blue/purple
const gradientColors = {
  start: "#E8B45A",
  middle: "#C4526A",
  end: "#C98A3D",
};

export function Visit() {
  return (
    <section
      id="visit"
      className="border-t-2 border-cocoa bg-espresso text-cream"
      aria-label="Find us"
    >
      <PulseBeams
        beams={beams}
        gradientColors={gradientColors}
        baseColor="#3d2b1f"
        accentColor="#6b4b35"
        className="!h-auto min-h-[90vh] py-24"
      >
        <div className="mx-auto grid max-w-4xl gap-12 px-5 text-center sm:grid-cols-2 sm:text-left">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-4xl font-semibold tracking-tight sm:text-5xl"
            >
              Come say hi<span className="text-honey">.</span>
            </motion.h2>
            <p className="mt-4 text-cream/60">
              Middle of Oliver Plunkett Street. You literally can't miss us —
              follow the cinnamon.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:items-start">
              <Magnetic>
                <a
                  href={SITE.mapsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-full bg-honey px-6 py-3 font-semibold text-espresso shadow-[0_4px_24px_rgba(232,180,90,0.4)] transition-shadow hover:shadow-[0_4px_36px_rgba(232,180,90,0.65)]"
                >
                  <MapPin size={18} /> Get directions
                </a>
              </Magnetic>
              <a
                href={SITE.phoneHref}
                className="link-sweep flex items-center gap-2 text-sm text-cream/70 hover:text-cream"
              >
                <Phone size={15} /> {SITE.phone}
              </a>
              <p className="text-sm text-cream/50">{SITE.address}</p>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold italic text-honey">
              Opening hours
            </h3>
            <ul className="mt-4 space-y-1.5 text-sm">
              {HOURS.map((h) => (
                <li
                  key={h.day}
                  className="flex justify-between gap-6 border-b border-cream/10 pb-1.5"
                >
                  <span className="text-cream/70">{h.day}</span>
                  <span className="tabular-nums">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PulseBeams>
    </section>
  );
}
