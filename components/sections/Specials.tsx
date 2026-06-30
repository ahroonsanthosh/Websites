"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Section, SectionLabel, SectionHeading } from "@/components/ui/section";

const specials = [
  {
    emoji: "🌀",
    name: "Cinnamon Scroll",
    desc: "Laminated dough, cinnamon butter, cream cheese glaze. The one people queue for.",
    price: "€4.50",
    tag: "Most ordered",
  },
  {
    emoji: "☕",
    name: "Oat Flat White",
    desc: "Single origin espresso pulled tight, stretched with oat milk. Silky every time.",
    price: "€4.20",
    tag: "Daily driver",
  },
  {
    emoji: "🌿",
    name: "Matcha Latte",
    desc: "Ceremonial grade matcha, oat milk, a touch of vanilla. Earthy and smooth.",
    price: "€4.50",
    tag: "Fan fave",
  },
  {
    emoji: "🥐",
    name: "Almond Croissant",
    desc: "Day-old croissants soaked in syrup, filled and topped with frangipane. Perfect.",
    price: "€4.50",
    tag: "Weekend treat",
  },
];

export function Specials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <Section className="bg-[#0d0905]" wide>
      <div ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16 md:mb-20"
        >
          <SectionLabel>The Good Stuff</SectionLabel>
          <SectionHeading>Worth the walk.</SectionHeading>
          <p className="text-stone-500 text-base font-light mt-5 max-w-sm mx-auto leading-relaxed">
            A few things we're properly proud of — behind the counter, every day.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {specials.map((item, i) => (
            <SpecialCard key={item.name} item={item} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function SpecialCard({
  item,
  index,
  inView,
}: {
  item: (typeof specials)[0];
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative overflow-hidden rounded-3xl border border-stone-700/50 p-8 lg:p-10 cursor-default group"
      style={{ background: "rgba(255,255,255,0.04)" }}
    >
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% -10%, rgba(212,165,116,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="flex items-start justify-between mb-6">
        <motion.span
          animate={{ scale: hovered ? 1.2 : 1, rotate: hovered ? 8 : 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 280 }}
          className="text-4xl select-none"
        >
          {item.emoji}
        </motion.span>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-900/40 text-amber-400/90 border border-amber-800/40 uppercase tracking-wider font-medium">
            {item.tag}
          </span>
          <span className="font-mono text-amber-400 text-sm">{item.price}</span>
        </div>
      </div>

      <h3 className="font-serif text-2xl text-amber-100 mb-3 group-hover:text-amber-200 transition-colors duration-300">
        {item.name}
      </h3>
      <p className="text-stone-500 text-sm leading-relaxed font-light">{item.desc}</p>

      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600/60 to-transparent origin-center"
      />
    </motion.div>
  );
}
