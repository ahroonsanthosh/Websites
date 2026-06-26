"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface StickerDef {
  id: string;
  emoji: string;
  x: string;
  y: string;
  rotate: number;
  size: number;
  hatch?: boolean;
}

const STICKERS: StickerDef[] = [
  { id: "chick-1", emoji: "🍗", x: "6%", y: "18%", rotate: -14, size: 44 },
  { id: "pepper-1", emoji: "🌶️", x: "90%", y: "30%", rotate: 18, size: 38 },
  { id: "egg-1", emoji: "🥚", x: "92%", y: "68%", rotate: 6, size: 40, hatch: true },
  { id: "cheese-1", emoji: "🧀", x: "4%", y: "72%", rotate: 10, size: 36 },
  { id: "egg-2", emoji: "🥚", x: "10%", y: "46%", rotate: -8, size: 34, hatch: true },
];

/** Tiny burst of emoji particles shown when an egg hatches. */
function HatchBurst() {
  const bits = ["✨", "💛", "⭐", "🐥", "✨", "💫"];
  return (
    <div className="absolute inset-0 pointer-events-none">
      {bits.map((b, i) => {
        const angle = (i / bits.length) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 text-lg"
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
            animate={{
              x: Math.cos(angle) * 60,
              y: Math.sin(angle) * 60,
              opacity: 0,
              scale: 1.2,
            }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            {b}
          </motion.span>
        );
      })}
    </div>
  );
}

function Sticker({ def, dragConstraints }: { def: StickerDef; dragConstraints: React.RefObject<HTMLDivElement | null> }) {
  const [hatched, setHatched] = useState(false);
  const [bursting, setBursting] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleTap = () => {
    if (dragging) return;
    if (def.hatch && !hatched) {
      setHatched(true);
      setBursting(true);
      setTimeout(() => setBursting(false), 900);
    }
  };

  const emoji = def.hatch && hatched ? "🐥" : def.emoji;

  return (
    <motion.button
      type="button"
      drag
      dragConstraints={dragConstraints}
      dragElastic={0.2}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 18 }}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setTimeout(() => setDragging(false), 50)}
      onTap={handleTap}
      whileDrag={{ scale: 1.25, rotate: def.rotate + 20, zIndex: 50 }}
      whileHover={{ scale: 1.15, rotate: def.rotate + 8 }}
      aria-label={def.hatch ? "Draggable egg — tap to hatch" : "Draggable food sticker"}
      className="absolute pointer-events-auto cursor-grab active:cursor-grabbing select-none touch-none"
      style={{ left: def.x, top: def.y, fontSize: def.size, rotate: def.rotate }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: Math.random() * 0.5 + 0.3, type: "spring", stiffness: 200, damping: 15 }}
    >
      <motion.span
        className="block drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)]"
        animate={hatched ? { rotate: [0, -15, 15, -8, 0] } : {}}
        transition={{ duration: 0.6 }}
      >
        {emoji}
      </motion.span>
      <AnimatePresence>{bursting && <HatchBurst />}</AnimatePresence>
    </motion.button>
  );
}

export default function DraggableStickers() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  if (reduce) return null;

  return (
    <div
      ref={constraintsRef}
      className="fixed inset-0 z-40 pointer-events-none"
      aria-hidden="false"
    >
      {STICKERS.map((def) => (
        <Sticker key={def.id} def={def} dragConstraints={constraintsRef} />
      ))}
    </div>
  );
}
