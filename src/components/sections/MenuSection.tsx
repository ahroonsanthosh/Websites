"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  featured: boolean;
  available: boolean;
  badge: string;
  emoji: string;
}

interface MenuContent {
  categories: string[];
  items: MenuItem[];
}

function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(220px circle at ${mouseX}px ${mouseY}px, rgba(249,115,22,0.18), transparent 70%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: -6,
        rotateX: 3,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      className="group glass-dark rounded-2xl p-6 relative overflow-hidden cursor-default"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Cursor-following spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{ background: spotlight }}
      />
      {/* Base glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

      {/* Top row */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <motion.span
          className="text-4xl inline-block"
          whileHover={{ scale: 1.25, rotate: -12 }}
          transition={{ type: "spring", stiffness: 400, damping: 12 }}
        >
          {item.emoji}
        </motion.span>
        <div className="flex flex-col items-end gap-2">
          {item.badge && (
            <span className="text-[10px] font-sans font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
              {item.badge}
            </span>
          )}
          {!item.available && (
            <span className="text-[10px] font-sans tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/5 text-white/30">
              Unavailable
            </span>
          )}
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="font-display font-bold text-white text-xl mb-2 group-hover:text-orange-400 transition-colors duration-200">
          {item.name}
        </h3>
        <p className="font-sans text-white/50 text-sm leading-relaxed mb-5">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-condensed text-2xl text-orange-400 tracking-wide">
            {item.price}
          </span>
          <span className="text-xs text-white/20 font-sans uppercase tracking-widest">
            {item.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function MenuSection({ content }: { content: MenuContent }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", ...content.categories];

  const filtered = activeCategory === "All"
    ? content.items
    : content.items.filter((i) => i.category === activeCategory);

  return (
    <section className="relative py-32 bg-[#1A1A1A] overflow-hidden" id="menu">
      {/* Giant background word */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="font-condensed text-[28vw] leading-none text-white/[0.025] select-none">
          MENU
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-8 h-px bg-orange-500" />
            <span className="text-orange-500 text-xs font-sans tracking-[0.3em] uppercase font-medium">
              What We Serve
            </span>
          </motion.div>

          <div className="overflow-hidden mb-2">
            <motion.h2
              initial={{ y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(3rem,7vw,6rem)] font-black text-white leading-none"
            >
              The Menu.
            </motion.h2>
          </div>
        </div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-sans font-medium transition-all duration-200 cursor-none ${
                activeCategory === cat
                  ? "bg-orange-500 text-white"
                  : "border border-white/20 text-white/60 hover:border-orange-500/50 hover:text-orange-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Menu grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((item, i) => (
              <MenuCard key={item.id} item={item} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
