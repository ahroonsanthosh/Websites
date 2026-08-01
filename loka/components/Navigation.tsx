'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu } from 'lucide-react';

const links = [
  { label: 'Menu', href: '#menu' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'About', href: '#about' },
  { label: 'Hours', href: '#hours' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 60);
      setHidden(currentY > lastScrollY.current && currentY > 300);
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-6 py-5 transition-all duration-500 md:px-12 ${
            scrolled
              ? 'bg-cream-100/90 backdrop-blur-md shadow-sm'
              : 'bg-transparent'
          }`}
        >
          <a
            href="#top"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="font-display text-lg font-bold tracking-[0.15em] text-coffee-800"
          >
            LOKA
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.href)}
                className="hover-underline text-xs font-medium uppercase tracking-widest text-coffee-700/60 transition-colors hover:text-coffee-700"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav('#contact')}
              className="group relative overflow-hidden rounded-full border border-coffee-300 px-5 py-2 text-xs font-medium uppercase tracking-widest text-coffee-700 transition-colors hover:text-cream-100"
            >
              <span className="relative z-10">Book a Table</span>
              <span className="absolute inset-0 origin-bottom translate-y-full bg-coffee-700 transition-transform duration-300 ease-expo-out group-hover:translate-y-0" />
            </button>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-1 text-coffee-700"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </motion.header>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col bg-coffee-900"
            initial={{ clipPath: 'circle(0% at calc(100% - 2rem) 2rem)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 2rem) 2rem)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 2rem) 2rem)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex justify-between items-center px-6 py-5">
              <span className="font-display text-xl font-bold tracking-[0.15em] text-cream-100">LOKA</span>
              <button
                className="text-cream-300"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col justify-center flex-1 px-8 gap-2">
              {links.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => handleNav(link.href)}
                  className="py-4 text-left font-display text-4xl font-bold text-cream-100/80 hover:text-cream-100 transition-colors border-b border-coffee-700/30"
                >
                  {link.label}
                </motion.button>
              ))}
            </nav>

            <div className="px-8 py-8 text-cream-500 text-sm">
              35 Lower Castle St, Tralee · Mon–Sat 9am–3pm
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
