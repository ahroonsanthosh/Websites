"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useOpenNow } from "@/hooks/use-open-now";
import { SITE } from "@/data/site";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#menu", label: "Menu" },
  { href: "#gallery", label: "The Goods" },
  { href: "#visit", label: "Find Us" },
];

export function Nav() {
  const openNow = useOpenNow();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-espresso/85 backdrop-blur-md text-cream shadow-lg shadow-espresso/20"
          : "bg-transparent text-cream"
      )}
    >
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4"
        aria-label="Main"
      >
        <a
          href="#top"
          className="font-display text-xl font-semibold tracking-tight"
        >
          Dulce<span className="text-honey">.</span>
        </a>

        <div className="hidden items-center gap-8 text-sm font-medium sm:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="link-sweep">
              {l.label}
            </a>
          ))}
        </div>

        <a
          href={SITE.phoneHref}
          className="flex items-center gap-2 rounded-full border border-cream/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors hover:border-honey hover:text-honey"
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              openNow ? "bg-pistachio animate-pulse" : "bg-berry"
            )}
            aria-hidden
          />
          {openNow ? "Open now" : "Closed"}
        </a>
      </nav>
    </motion.header>
  );
}
