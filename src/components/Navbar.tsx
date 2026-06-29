"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

const links = [
  { label: "About", href: "#about" },
  { label: "Menu", href: "#menu" },
  { label: "Gallery", href: "#gallery" },
  { label: "Find Us", href: "#location" },
];

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const direction = latest > lastScrollY.current;
    setVisible(!direction || latest < 80);
    setAtTop(latest < 60);
    lastScrollY.current = latest;
  });

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleLinkClick = (href: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 transition-all duration-500"
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div
          className={`flex items-center justify-between py-5 transition-all duration-500 ${
            !atTop
              ? "border-b border-[var(--border)] backdrop-blur-md bg-[rgba(250,247,242,0.9)]"
              : ""
          }`}
        >
          {/* Logo */}
          <a
            href="#"
            className="font-[var(--font-serif)] text-2xl md:text-3xl tracking-widest uppercase font-light text-[var(--charcoal)] hover:text-[var(--terracotta)] transition-colors duration-300"
            aria-label="Bayou home"
          >
            Bayou
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10" aria-label="Main navigation">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => { e.preventDefault(); handleLinkClick(l.href); }}
                className="font-[var(--font-sans)] text-xs tracking-[0.2em] uppercase text-[var(--muted)] hover:text-[var(--charcoal)] hover-line transition-colors duration-300"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Hours pill */}
          <div className="hidden md:flex items-center gap-2 text-xs font-[var(--font-sans)] tracking-wide text-[var(--muted)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--sage)] inline-block" />
            Open Wed–Sun
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden relative w-8 h-8 flex flex-col justify-center items-end gap-[5px] group"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span
              className={`block h-px bg-[var(--charcoal)] transition-all duration-400 ease-in-out ${
                menuOpen ? "w-6 rotate-45 translate-y-[6px]" : "w-6"
              }`}
            />
            <span
              className={`block h-px bg-[var(--charcoal)] transition-all duration-400 ease-in-out ${
                menuOpen ? "w-6 -rotate-45 -translate-y-[0px]" : "w-4"
              }`}
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[var(--dark-brown)] flex flex-col justify-center items-start px-10"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="flex flex-col gap-8" aria-label="Mobile navigation">
              {links.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  onClick={(e) => { e.preventDefault(); handleLinkClick(l.href); }}
                  className="font-[var(--font-serif)] text-5xl font-light text-[var(--cream)] hover:text-[var(--terracotta)] transition-colors duration-300"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <motion.div
              className="mt-16 text-[var(--muted)] font-[var(--font-sans)] text-xs tracking-widest uppercase space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p>8 MacCurtain Street, Cork</p>
              <p>(021) 245 5740</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
