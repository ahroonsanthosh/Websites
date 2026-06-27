"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import content from "@/lib/content";

const { menu } = content;
type Category = typeof menu.categories[number];

export default function Menu() {
  const [active, setActive] = useState<Category>(menu.categories[0]);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const items = (menu.items as Record<string, typeof menu.items.Rotisserie>)[active] ?? [];

  return (
    <section id="menu" ref={ref} className="bg-[#1A0C05] py-16 md:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-10">

        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="font-accent text-[11px] tracking-[0.3em] uppercase text-[#E8622A] mb-4"
          >
            What We Serve
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display italic text-4xl md:text-6xl font-bold text-[#FDF6EB]"
          >
            The Menu
          </motion.h2>
        </div>

        {/* Tabs — horizontal scroll on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 -mx-5 md:mx-0"
        >
          <div className="flex overflow-x-auto scrollbar-hide gap-3 px-5 md:px-0 md:justify-center pb-1">
            {menu.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`relative shrink-0 px-6 py-2.5 rounded-full font-accent text-[11px] tracking-[0.15em] uppercase transition-all duration-300 ${
                  active === cat
                    ? "bg-[#E8622A] text-white"
                    : "bg-[#FDF6EB]/10 text-[#FDF6EB]/60 hover:bg-[#FDF6EB]/20 hover:text-[#FDF6EB]"
                }`}
              >
                {cat}
                {active === cat && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 rounded-full bg-[#E8622A] -z-10"
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="grid sm:grid-cols-2 gap-4 md:gap-5"
          >
            {items.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="group relative bg-[#FDF6EB]/5 hover:bg-[#FDF6EB]/10 border border-[#FDF6EB]/10 hover:border-[#E8622A]/40 rounded-2xl p-6 transition-all duration-300"
              >
                {item.tag && (
                  <span className="absolute top-4 right-4 px-2.5 py-1 bg-[#E8622A] text-white font-accent text-[9px] tracking-widest uppercase rounded-full">
                    {item.tag}
                  </span>
                )}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display italic text-[#FDF6EB] text-xl font-semibold mb-1.5">{item.name}</h3>
                    <p className="text-[#FDF6EB]/50 text-sm leading-relaxed">{item.description}</p>
                  </div>
                  <span className="font-accent text-[#E8622A] text-lg font-semibold shrink-0 mt-0.5">{item.price}</span>
                </div>
                <div className="mt-4 h-px bg-gradient-to-r from-[#E8622A]/0 via-[#E8622A]/30 to-[#E8622A]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center text-[#FDF6EB]/30 text-xs mt-10 font-accent tracking-wider"
        >
          {menu.note}
        </motion.p>
      </div>
    </section>
  );
}
