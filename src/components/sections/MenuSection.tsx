"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  featured: boolean;
  available: boolean;
  badge: string;
}

interface MenuContent {
  categories: string[];
  items: MenuItem[];
}

/* ─── Bouncing letter component ─── */
function BounceLetter({ char, index }: { char: string; index: number }) {
  return (
    <motion.span
      className="inline-block"
      animate={{ y: [0, -14, 0] }}
      transition={{
        duration: 0.6,
        repeat: Infinity,
        repeatDelay: 2.8,
        delay: index * 0.055,
        ease: [0.36, 0, 0.64, 1],
        times: [0, 0.4, 1],
      }}
    >
      {char === " " ? " " : char}
    </motion.span>
  );
}

function BouncingHeading({ text }: { text: string }) {
  return (
    <span aria-label={text}>
      {text.split("").map((char, i) => (
        <BounceLetter key={i} char={char} index={i} />
      ))}
    </span>
  );
}

const BADGE_COLOURS: Record<string, { bg: string; text: string; border: string }> = {
  "Fan Favourite": { bg: "rgba(255,85,0,0.15)",  text: "#FF5500", border: "rgba(255,85,0,0.3)" },
  "Popular":       { bg: "rgba(255,208,0,0.15)", text: "#B88A00", border: "rgba(255,208,0,0.4)" },
  "Fresh":         { bg: "rgba(170,255,0,0.12)", text: "#6BBF00", border: "rgba(170,255,0,0.35)" },
  "For Kids":      { bg: "rgba(0,194,255,0.12)", text: "#0099CC", border: "rgba(0,194,255,0.3)" },
  "New":           { bg: "rgba(139,92,246,0.15)", text: "#8B5CF6", border: "rgba(139,92,246,0.3)" },
};
const BADGE_DEFAULT = { bg: "rgba(255,45,107,0.12)", text: "#FF2D6B", border: "rgba(255,45,107,0.3)" };

function BadgePill({ badge }: { badge: string }) {
  const c = BADGE_COLOURS[badge] ?? BADGE_DEFAULT;
  return (
    <span
      className="text-[10px] font-sans font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {badge}
    </span>
  );
}

/* ─── Expanding menu card ─── */
function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Tilt on hover
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onMouseLeave() {
    setHovered(false);
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.07 }}
      animate={{ scale: hovered ? 1.04 : 1, zIndex: hovered ? 10 : 1 }}
      style={{
        rotateX: hovered ? rotateX : 0,
        rotateY: hovered ? rotateY : 0,
        transformStyle: "preserve-3d",
        transformPerspective: 900,
        position: "relative",
      }}
      className="group cursor-default"
    >
      {/* Card body */}
      <motion.div
        animate={{
          boxShadow: hovered
            ? "0 32px 64px rgba(249,115,22,0.18), 0 8px 24px rgba(0,0,0,0.35)"
            : "0 2px 8px rgba(0,0,0,0.12)",
        }}
        transition={{ duration: 0.25 }}
        className="relative rounded-2xl overflow-hidden bg-[#1A1A1A] border border-white/06"
      >
        {/* Orange accent top line — grows on hover */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 via-red-500 to-orange-400 origin-left"
        />

        {/* Spotlight follow */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: hovered
              ? `radial-gradient(260px circle at ${mx.get() * 100 + 50}% ${my.get() * 100 + 50}%, rgba(249,115,22,0.10), transparent 70%)`
              : "none",
          }}
        />

        <div className="p-6">
          {/* Top row */}
          <div className="flex items-start justify-between mb-5">
            <span className="font-sans text-[10px] text-white/25 uppercase tracking-widest">
              {item.category}
            </span>
            {item.badge && (
              <BadgePill badge={item.badge} />
            )}
          </div>

          {/* Name */}
          <h3 className="font-display font-bold text-white leading-tight mb-3 transition-colors duration-200 group-hover:text-orange-400"
            style={{ fontSize: "clamp(1.15rem,2.2vw,1.4rem)" }}>
            {item.name}
          </h3>

          {/* Description — expands on hover */}
          <div className="overflow-hidden">
            <motion.p
              animate={{ maxHeight: hovered ? 120 : 48, opacity: hovered ? 1 : 0.5 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-white/50 text-sm leading-relaxed"
              style={{ overflow: "hidden" }}
            >
              {item.description}
            </motion.p>
          </div>

          {/* Price row */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/06">
            <motion.span
              animate={{ color: hovered ? "#f97316" : "#fb923c" }}
              className="font-condensed text-[2rem] leading-none tracking-wide"
            >
              {item.price}
            </motion.span>
            {!item.available && (
              <span className="text-[10px] font-sans text-white/25 uppercase tracking-widest">
                Unavailable
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Category filter pills ─── */
function FilterPills({
  categories,
  active,
  onChange,
}: {
  categories: string[];
  active: string;
  onChange: (c: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-wrap gap-2 mb-12"
    >
      {["All", ...categories].map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className="relative px-5 py-2.5 rounded-full text-sm font-sans font-medium transition-colors duration-200 cursor-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          {active === cat && (
            <motion.span
              layoutId="pill-active"
              className="absolute inset-0 rounded-full bg-orange-500"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className={`relative z-10 ${active === cat ? "text-white" : "text-white/50 hover:text-white"}`}>
            {cat}
          </span>
        </button>
      ))}
    </motion.div>
  );
}

/* ─── Main export ─── */
export default function MenuSection({ content }: { content: MenuContent }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? content.items
    : content.items.filter((item) => item.category === activeCategory);

  return (
    <section id="menu" className="relative bg-[#111111] py-28 overflow-hidden">

      {/* Giant faint MENU wordmark behind everything */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span className="font-condensed text-[28vw] leading-none text-white/[0.025] whitespace-nowrap">
          MENU
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-8 h-px bg-orange-500" />
            <span className="text-orange-500 text-[11px] font-sans tracking-[0.35em] uppercase font-medium">
              What We Serve
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-[clamp(3rem,7vw,6.5rem)] font-black text-white leading-none"
          >
            <BouncingHeading text="The Menu." />
          </motion.h2>
        </div>

        {/* Filter pills */}
        <FilterPills
          categories={content.categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
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
