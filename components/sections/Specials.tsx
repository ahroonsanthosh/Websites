"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Section, SectionLabel, SectionHeading } from "@/components/ui/section";

const specials = [
  {
    index: "01",
    name: "Cinnamon Scroll",
    desc: "Laminated dough, cinnamon butter, cream cheese glaze. The one people queue for.",
    price: "€4.50",
    tag: "Most ordered",
  },
  {
    index: "02",
    name: "Oat Flat White",
    desc: "Single origin espresso pulled tight, stretched with oat milk. Silky every time.",
    price: "€4.20",
    tag: "Daily driver",
  },
  {
    index: "03",
    name: "Matcha Latte",
    desc: "Ceremonial grade matcha, oat milk, a touch of vanilla. Earthy and smooth.",
    price: "€4.50",
    tag: "Fan fave",
  },
  {
    index: "04",
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
          className="mb-16 md:mb-20"
        >
          <SectionLabel>The Good Stuff</SectionLabel>
          <SectionHeading>Worth the walk.</SectionHeading>
          <p className="text-stone-500 text-base font-light mt-5 max-w-sm leading-relaxed">
            A few things we&apos;re properly proud of — behind the counter, every day.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-px bg-stone-800/20 border border-stone-800/20 rounded-2xl overflow-hidden">
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.09 }}
      className="relative group bg-[#0d0905] p-10 xl:p-12 cursor-default overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 0% 100%, rgba(180,120,60,0.07) 0%, transparent 55%)",
        }}
      />

      <div className="flex items-start justify-between mb-8">
        <span className="font-mono text-[11px] text-stone-700 tracking-widest">{item.index}</span>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-amber-600/70 uppercase tracking-[0.18em] font-light">
            {item.tag}
          </span>
          <span className="font-mono text-amber-400/90 text-sm tabular-nums">{item.price}</span>
        </div>
      </div>

      <h3 className="font-serif text-3xl text-amber-50 mb-3 leading-tight group-hover:text-amber-100 transition-colors duration-300">
        {item.name}
      </h3>
      <p className="text-stone-500 text-sm leading-relaxed font-light max-w-xs">{item.desc}</p>

      <div className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-amber-700/50 to-transparent group-hover:w-full transition-all duration-500 ease-out" />
    </motion.div>
  );
}
