"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#about" },
  { label: "Hours", href: "#hours" },
  { label: "Find Us", href: "#location" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const { scrollY } = useScroll();
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setAtTop(latest < 80);
    setHidden(latest > lastY.current && latest > 200);
    lastY.current = latest;
  });

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          atTop ? "bg-transparent" : "bg-stone-950/90 backdrop-blur-md border-b border-stone-800/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="#"
            className="font-serif text-xl text-amber-100 tracking-wide hover:text-amber-300 transition-colors"
          >
            Dulce
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-stone-400 hover:text-amber-200 transition-colors duration-300 tracking-widest uppercase"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#location"
            className="hidden md:block text-xs px-5 py-2 rounded-full border border-amber-700/60 text-amber-200 hover:bg-amber-700/20 transition-all duration-300 tracking-widest uppercase"
          >
            Visit Us
          </a>

          <button
            className="md:hidden text-stone-300 p-1"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: open ? 1 : 0, y: open ? 0 : -20, pointerEvents: open ? "auto" : "none" }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-40 flex flex-col pt-20 px-8 bg-stone-950/98 backdrop-blur-xl md:hidden"
      >
        {links.map((link, i) => (
          <motion.a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: open ? 1 : 0, x: open ? 0 : -20 }}
            transition={{ delay: i * 0.06 }}
            className="py-5 text-2xl font-light text-stone-300 border-b border-stone-800/50 hover:text-amber-300 transition-colors"
          >
            {link.label}
          </motion.a>
        ))}
        <a
          href="tel:0212413256"
          className="mt-8 text-amber-500 text-sm tracking-widest"
        >
          (021) 241 3256
        </a>
      </motion.div>
    </>
  );
}
