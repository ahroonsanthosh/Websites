"use client";

import { Marquee } from "@/components/ui/marquee";

const items = [
  "Fresh Daily",
  "Cork City",
  "Single Origin Coffee",
  "Laminated Pastry",
  "Oliver Plunkett St",
  "Open Every Day",
  "Good Vibes",
  "Baked with Love",
];

export function MarqueeBand() {
  return (
    <div className="py-5 border-y border-stone-800/30 bg-stone-950 overflow-hidden">
      <Marquee
        items={items}
        speed={40}
        className="text-xs uppercase tracking-[0.3em] text-stone-600 font-light"
      />
    </div>
  );
}
