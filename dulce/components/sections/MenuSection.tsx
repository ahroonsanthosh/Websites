"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { siteContent } from "@/data/content";
import { Section, SectionLabel, SectionHeading } from "@/components/ui/section";
import { X } from "lucide-react";

const menuCategories = [
  {
    name: "Buns & Pastry",
    items: [
      { name: "Cinnamon Scroll", price: "€4.50", tag: "fan fave" },
      { name: "Cardamom Bun", price: "€4.00" },
      { name: "Almond Croissant", price: "€4.50" },
      { name: "Pain au Chocolat", price: "€3.80" },
      { name: "Morning Bun", price: "€4.20", tag: "seasonal" },
    ],
  },
  {
    name: "Coffee",
    items: [
      { name: "Flat White", price: "€3.80" },
      { name: "Oat Latte", price: "€4.20" },
      { name: "Filter Coffee", price: "€3.00" },
      { name: "Cortado", price: "€3.50" },
      { name: "Matcha Latte", price: "€4.50", tag: "popular" },
    ],
  },
  {
    name: "Food",
    items: [
      { name: "Avocado Toast", price: "€9.50" },
      { name: "Granola Bowl", price: "€8.00" },
      { name: "Smashed Egg Toast", price: "€10.50" },
      { name: "Bun House Breakfast", price: "€13.00", tag: "weekend only" },
    ],
  },
];

export function MenuSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Section id="menu" className="bg-stone-950">
      <div ref={ref}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <SectionLabel>What we serve</SectionLabel>
          <SectionHeading>The Menu</SectionHeading>
        </motion.div>

        {/* Tab bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-16"
        >
          <div className="inline-flex gap-1 bg-stone-900 border border-stone-700/50 rounded-full p-1.5">
            {menuCategories.map((cat, i) => (
              <button
                key={cat.name}
                onClick={() => setActiveTab(i)}
                className="relative px-6 py-2.5 text-sm rounded-full transition-colors duration-300"
              >
                {activeTab === i && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full bg-amber-800/60 border border-amber-700/30"
                  />
                )}
                <span
                  className={`relative z-10 font-light ${
                    activeTab === i ? "text-amber-200" : "text-stone-500"
                  } transition-colors duration-300`}
                >
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Menu items — max-w narrower so list feels contained */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="mx-auto" style={{ maxWidth: "560px" }}
          >
            {menuCategories[activeTab].items.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.06 }}
                className="group flex items-center justify-between py-5 border-b border-stone-800/40 last:border-0 hover:border-amber-800/30 transition-colors duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-stone-200 text-base font-light group-hover:text-amber-200 transition-colors duration-300">
                    {item.name}
                  </span>
                  {item.tag && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-900/40 text-amber-400 border border-amber-700/30 uppercase tracking-wider">
                      {item.tag}
                    </span>
                  )}
                </div>
                <span className="text-amber-500 font-mono text-sm tabular-nums ml-6">{item.price}</span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => setMenuOpen(true)}
            className="text-sm text-stone-600 hover:text-amber-400 transition-colors duration-300 underline underline-offset-4 decoration-stone-800 hover:decoration-amber-700"
          >
            View full menu images →
          </button>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {siteContent.menuImages.map((src, i) => (
                <img key={i} src={src} alt="Menu" className="w-full rounded-2xl object-contain" />
              ))}
            </motion.div>
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full border border-stone-700 text-stone-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
