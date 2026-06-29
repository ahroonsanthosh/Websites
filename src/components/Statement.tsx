"use client";

import { motion } from "framer-motion";
import RiverDivider from "./RiverDivider";

export default function Statement() {
  const items = [
    "Honest food",
    "Great coffee",
    "Slow mornings",
    "MacCurtain Street",
    "Victorian Quarter",
    "Open Wed – Sun",
  ];
  const repeated = [...items, ...items, ...items];

  return (
    <section className="bg-[var(--teal)] grain overflow-hidden" aria-hidden="true">
      <div className="py-16 md:py-24">
        <motion.div
          className="flex items-center gap-10 md:gap-16 whitespace-nowrap pl-10"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{ duration: 28, ease: "linear", repeat: Infinity }}
        >
          {repeated.map((item, i) => (
            <span key={i} className="flex items-center gap-10 md:gap-16 flex-shrink-0">
              <span
                className="font-[var(--font-display)] italic font-black text-[clamp(1.4rem,3.5vw,2.4rem)] text-[var(--brass-light)]"
                style={{ letterSpacing: "-0.01em" }}
              >
                {item}
              </span>
              <span className="text-[var(--brass)] text-sm opacity-60">✦</span>
            </span>
          ))}
        </motion.div>
      </div>

      <RiverDivider from="var(--teal)" to="var(--moss)" flip />
    </section>
  );
}
