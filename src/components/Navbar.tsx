"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

const links = [
  { label: "Menu", href: "#menu" },
  { label: "Gallery", href: "#gallery" },
  { label: "Hours", href: "#location" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
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
      <motion.header
        className={`sticky top-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "bg-[var(--ink)]/95 backdrop-blur-sm border-b border-[var(--line-dark)]"
            : "bg-[var(--ink)]"
        }`}
        animate={{ y: visible ? 0 : -72 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex items-center justify-between px-6 md:px-12 py-4">
          <a
            href="#"
            className="font-[var(--font-display)] italic font-black text-2xl text-[var(--cream)] hover:text-[var(--brass)] transition-colors"
            aria-label="Bayou home"
          >
            Bayou
          </a>

          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => { e.preventDefault(); go(l.href); }}
                className="label-engrave text-[var(--mist)] hover:text-[var(--brass)] transition-colors relative group"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--brass)] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#menu"
              onClick={(e) => { e.preventDefault(); go("#menu"); }}
              className="pill pill-brass hidden md:inline-flex"
            >
              View Menu
            </a>

            <button
              className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span className={`block h-0.5 bg-[var(--brass)] transition-all duration-300 ${menuOpen ? "w-6 rotate-45 translate-y-[7px]" : "w-6"}`} />
              <span className={`block h-0.5 bg-[var(--brass)] transition-all duration-300 ${menuOpen ? "opacity-0 w-6" : "w-4"}`} />
              <span className={`block h-0.5 bg-[var(--brass)] transition-all duration-300 ${menuOpen ? "w-6 -rotate-45 -translate-y-[7px]" : "w-5"}`} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[var(--ink)] grain flex flex-col justify-center px-8 pt-20"
            initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 3.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 3.5rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.5rem) 3.5rem)" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="flex flex-col gap-7">
              {links.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  onClick={(e) => { e.preventDefault(); go(l.href); }}
                  className="font-[var(--font-display)] italic font-black text-5xl text-[var(--cream)] hover:text-[var(--brass)] transition-colors"
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
              className="mt-14"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <a
                href="#menu"
                onClick={(e) => { e.preventDefault(); go("#menu"); }}
                className="pill pill-solid"
              >
                View Menu →
              </a>
              <p className="label-engrave text-[var(--mist)] mt-10 leading-loose">
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
