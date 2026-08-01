"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";

const links = [
  { label: "Menu", href: "#menu" },
  { label: "Story", href: "#story" },
  { label: "Visit", href: "#visit" },
  { label: "Gallery", href: "#gallery" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#f8f5f0]/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
            : "bg-gradient-to-b from-[#1a1510]/50 to-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex flex-col leading-none group">
            <span className={`font-display text-xl md:text-2xl font-semibold tracking-wide transition-colors duration-500 ${scrolled ? "text-[#1a1510]" : "text-white"}`}>
              NorthSouth
            </span>
            <span className={`text-[10px] tracking-[0.3em] uppercase font-light -mt-0.5 transition-colors duration-500 ${scrolled ? "text-[#9e9890]" : "text-white/50"}`}>
              Café · Tralee
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={`hover-underline text-sm tracking-[0.12em] uppercase transition-colors duration-500 ${scrolled ? "text-[#1a1510]/60 hover:text-[#1a1510]" : "text-white/60 hover:text-white"}`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <a
            href="#visit"
            className={`hidden md:inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase px-5 py-2.5 rounded-full transition-all duration-500 ${scrolled ? "border border-[#c8864a] text-[#c8864a] hover:bg-[#c8864a] hover:text-white" : "border border-white/30 text-white hover:border-white/60"}`}
          >
            Find Us
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(true)}
            className={`md:hidden p-2 transition-colors duration-500 ${scrolled ? "text-[#1a1510]" : "text-white"}`}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-[#1a1510] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-16">
              <span className="font-display text-xl text-white">NorthSouth</span>
              <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white">
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-col justify-center flex-1 px-8 gap-2">
              {links.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="font-display text-4xl text-white/90 hover:text-[#c8864a] transition-colors py-3 border-b border-white/10"
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <div className="px-8 pb-12 text-[#9e9890] text-sm">
              <p>12 Russell St, Tralee</p>
              <p className="mt-1">(066) 717 1277</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
