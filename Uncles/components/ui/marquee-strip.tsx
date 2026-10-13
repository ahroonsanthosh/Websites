"use client";

import content from "@/lib/content";

const items = content.marquee.items;
const repeated = [...items, ...items, ...items];

export function MarqueeStrip() {
  return (
    <div className="bg-[#1A0C05] border-y border-[#FDF6EB]/8 py-4 overflow-hidden select-none">
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 28s linear infinite;
          will-change: transform;
        }
      `}</style>
      <div className="marquee-track">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="flex items-center font-accent text-[11px] tracking-[0.3em] uppercase whitespace-nowrap"
          >
            <span className="text-[#FDF6EB]/40 px-5">{item}</span>
            <span className="text-[#EE1C1C] text-[8px]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
