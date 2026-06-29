"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

const links = [
  { label: "Menu", href: "#menu" },
  { label: "Gallery", href: "#gallery" },
  { label: "Find Us", href: "#location" },
  { label: "About", href: "#about" },
];

function AnnouncementBar({ onClose }: { onClose: () => void }) {
  return (
    <div className="announcement-bar flex items-center justify-center gap-3">
      <span>Wed–Thu 12–3 pm · Fri–Sun 10 am–3 pm · 8 MacCurtain Street, Cork :)</span>
      <button
        onClick={onClose}
        className="absolute right-4 text-white opacity-70 hover:opacity-100 text-lg leading-none"
        aria-label="Close announcement"
      >
        ×
      </button>
    </div>
  );
}

export default function Navbar() {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest < lastY.current || latest < 80);
    setScrolled(latest > 60);
    lastY.current = latest;
  });

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const go = (href: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <>
      {bannerVisible && <AnnouncementBar onClose={() => setBannerVisible(false)} />}

      <motion.header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[var(--warm-white)]/95 backdrop-blur-sm border-b border-[var(--border)]" : "bg-[var(--warm-white)]"
        }`}
        animate={{ y: visible ? 0 : -80 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex items-center justify-between px-5 md:px-10 py-4">
          {/* Logo wordmark */}
          <a
            href="#"
            className="font-[var(--font-display)] font-black text-2xl tracking-tight text-[var(--charcoal)] hover:text-[var(--orange)] transition-colors duration-200"
            aria-label="Bayou home"
          >
            Bayou
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => { e.preventDefault(); go(l.href); }}
                className="font-[var(--font-sans)] text-sm font-medium text-[var(--charcoal)] hover:text-[var(--orange)] transition-colors duration-200 relative group"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--orange)] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <a
              href="#menu"
              onClick={(e) => { e.preventDefault(); go("#menu"); }}
              className="pill pill-orange hidden md:inline-flex text-sm py-2 px-5"
            >
              See the Menu
            </a>
            {/* Instagram */}
            <a
              href="https://www.instagram.com/bayoucork"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-full border border-[var(--border)] hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors duration-200"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* Burger */}
            <button
              className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span className={`block h-0.5 bg-[var(--charcoal)] transition-all duration-300 ${menuOpen ? "w-6 rotate-45 translate-y-[7px]" : "w-6"}`} />
              <span className={`block h-0.5 bg-[var(--charcoal)] transition-all duration-300 ${menuOpen ? "opacity-0" : "w-4"}`} />
              <span className={`block h-0.5 bg-[var(--charcoal)] transition-all duration-300 ${menuOpen ? "w-6 -rotate-45 -translate-y-[7px]" : "w-5"}`} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[var(--cream)] flex flex-col justify-center px-8 pt-20"
            initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 3.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 3.5rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.5rem) 3.5rem)" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="flex flex-col gap-6">
              {links.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  onClick={(e) => { e.preventDefault(); go(l.href); }}
                  className="font-[var(--font-display)] font-black text-5xl text-[var(--charcoal)] hover:text-[var(--orange)] transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <motion.div
              className="mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <a
                href="#menu"
                onClick={(e) => { e.preventDefault(); go("#menu"); }}
                className="pill pill-solid text-base py-3 px-8"
              >
                See the Menu →
              </a>
              <p className="font-[var(--font-sans)] text-sm text-[var(--muted)] mt-8">
                8 MacCurtain Street, Cork<br />
                (021) 245 5740
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
