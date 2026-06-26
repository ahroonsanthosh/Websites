"use client";
import { useEffect, useState } from "react";

const links = [
  { label: "About",    href: "#about"   },
  { label: "Menu",     href: "#menu"    },
  { label: "Gallery",  href: "#gallery" },
  { label: "Visit Us", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 h-16 md:h-[68px] transition-all duration-500 ${
        scrolled || open ? "bg-[#0c0b09]/95 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.05)]" : ""
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 h-full flex items-center justify-between">
          <a href="#" onClick={() => setOpen(false)}
            className="font-['Playfair_Display'] text-xl md:text-2xl font-semibold tracking-[0.15em] text-[var(--cream)] hover:text-[var(--amber)] transition-colors z-10">
            COCOA
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex gap-8 lg:gap-10 items-center">
            {links.map(l => (
              <li key={l.href}>
                <a href={l.href}
                  className="text-[11px] font-medium tracking-[0.12em] uppercase text-[var(--grey-lt)] hover:text-[var(--cream)] transition-colors relative group">
                  {l.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--amber)] group-hover:w-full transition-all duration-300" />
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(o => !o)} aria-label="Toggle menu"
            className="md:hidden flex flex-col gap-[5px] p-2 z-10">
            <span className={`block w-6 h-[1.5px] bg-[var(--cream)] transition-all duration-300 origin-center ${open ? "rotate-45 translate-y-[6.5px]" : ""}`} />
            <span className={`block w-6 h-[1.5px] bg-[var(--cream)] transition-all duration-300 ${open ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-6 h-[1.5px] bg-[var(--cream)] transition-all duration-300 origin-center ${open ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <div className={`md:hidden fixed inset-0 z-40 bg-[#0c0b09]/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 transition-all duration-500 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        {links.map((l, i) => (
          <a key={l.href} href={l.href}
            onClick={() => setOpen(false)}
            className="text-2xl font-['Playfair_Display'] font-normal text-[var(--grey-lt)] hover:text-[var(--amber)] transition-colors"
            style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}>
            {l.label}
          </a>
        ))}
        <div className="mt-4 flex gap-6">
          <a href="https://www.instagram.com/cocoacafecork/" target="_blank" rel="noopener"
            className="text-[11px] tracking-[0.18em] uppercase text-[var(--grey)] hover:text-[var(--amber)] transition-colors">
            Instagram
          </a>
          <a href="https://www.facebook.com/COCOACAFEIE/" target="_blank" rel="noopener"
            className="text-[11px] tracking-[0.18em] uppercase text-[var(--grey)] hover:text-[var(--amber)] transition-colors">
            Facebook
          </a>
        </div>
      </div>
    </>
  );
}
