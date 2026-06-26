"use client";
import { useEffect, useState } from "react";

const links = [
  { label: "About",   href: "#about"   },
  { label: "Menu",    href: "#menu"    },
  { label: "Gallery", href: "#gallery" },
  { label: "Visit Us",href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-[68px] transition-all duration-500 ${
        scrolled ? "bg-[#0c0b09]/92 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.05)]" : ""
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-full flex items-center justify-between">
        <a
          href="#"
          className="font-['Playfair_Display'] text-2xl font-semibold tracking-[0.15em] text-[var(--cream)] hover:text-[var(--amber)] transition-colors"
        >
          COCOA
        </a>

        {/* Desktop */}
        <ul className="hidden md:flex gap-10 items-center">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-[11px] font-medium tracking-[0.14em] uppercase text-[var(--grey-lt)] hover:text-[var(--cream)] transition-colors relative group"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--amber)] group-hover:w-full transition-all duration-300" />
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="md:hidden flex flex-col gap-[5px] p-1"
        >
          <span className={`block w-6 h-[1.5px] bg-[var(--cream)] transition-all duration-300 ${open ? "rotate-45 translate-y-[6.5px]" : ""}`} />
          <span className={`block w-6 h-[1.5px] bg-[var(--cream)] transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-[1.5px] bg-[var(--cream)] transition-all duration-300 ${open ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-0 top-[68px] bg-[#0c0b09]/97 backdrop-blur-2xl flex flex-col items-center justify-center gap-10 transition-transform duration-500 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="text-base font-medium tracking-[0.2em] uppercase text-[var(--grey-lt)] hover:text-[var(--amber)] transition-colors"
          >
            {l.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
