"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import MagneticButton from "@/components/ui/MagneticButton";

const links = [
  { label: "Menu", href: "#menu" },
  { label: "Gallery", href: "#gallery" },
  { label: "Find Us", href: "#location" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-dark shadow-xl shadow-black/20 py-3" : "py-6 bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="font-condensed text-3xl text-white tracking-wider hover:text-orange-400 transition-colors duration-200">
            HANSUM
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-sans text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-orange-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://www.instagram.com/hansumcork"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hansum Rotisserie on Instagram"
              className="text-white/50 hover:text-orange-400 transition-colors duration-200"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
            <MagneticButton href="#order" variant="primary" className="py-2.5 px-6 text-sm">
              Order Now
            </MagneticButton>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="md:hidden text-white p-2"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[200] bg-[#1A1A1A] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-16">
              <span className="font-condensed text-3xl text-white tracking-wider">HANSUM</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="text-white/60 hover:text-white p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-2 flex-1">
              {links.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-4xl sm:text-5xl font-black text-white hover:text-orange-500 transition-colors duration-200 py-2 whitespace-nowrap"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <a
                href="https://www.instagram.com/hansumcork"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/50 hover:text-orange-400 transition-colors font-sans text-sm"
              >
                <InstagramIcon className="w-5 h-5" />
                @hansumcork
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
