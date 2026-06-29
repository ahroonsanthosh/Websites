"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

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
    <section ref={ref} className="py-28 px-6 bg-[#0d0905]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <span className="text-amber-500/60 text-xs uppercase tracking-[0.4em] font-light">
              The Good Stuff
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-amber-50 mt-3">
              Worth the walk.
            </h2>
          </div>
          <p className="text-stone-500 text-sm font-light max-w-xs">
            A few things we're properly proud of. Find them behind the counter, every day.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {specials.map((item, i) => (
            <SpecialCard key={item.name} item={item} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
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
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative overflow-hidden rounded-2xl border border-stone-700/60 p-7 cursor-default group"
      style={{ background: "rgba(255,255,255,0.04)" }}
    >
      {/* Hover glow */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(212,165,116,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="flex items-start justify-between mb-4">
        <motion.span
          animate={{ scale: hovered ? 1.15 : 1, rotate: hovered ? 5 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl"
        >
          {item.emoji}
        </motion.span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-900/30 text-amber-500/80 border border-amber-800/30 uppercase tracking-wider">
            {item.tag}
          </span>
          <span className="font-mono text-amber-400 text-sm">{item.price}</span>
        </div>
      </div>

      <h3 className="font-serif text-xl text-amber-100 mb-2 group-hover:text-amber-200 transition-colors duration-300">
        {item.name}
      </h3>
      <p className="text-stone-500 text-sm font-light leading-relaxed">{item.desc}</p>

      {/* Bottom border that animates on hover */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent origin-center"
      />
    </motion.div>
  );
}
