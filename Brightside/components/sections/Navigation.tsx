"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });

    gsap.fromTo(
      navRef.current,
      { y: -80, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, ease: "expo.out", duration: 1.0, delay: 0.8 }
    );

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#menu", label: "Menu" },
    { href: "#gallery", label: "Gallery" },
    { href: "#contact", label: "Find Us" },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled
            ? "bg-[#F7F3EC]/90 backdrop-blur-md shadow-[0_1px_0_rgba(61,90,60,0.10)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 group">
            <span className="w-7 h-7 rounded-full bg-[#3D5A3C] flex items-center justify-center shadow-sm">
              <span className="text-[10px] text-white font-black">B</span>
            </span>
            <span
              className="text-[#2C2C2A] text-sm font-bold tracking-wide uppercase"
              style={{ letterSpacing: "0.12em" }}
            >
              Bright Side
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[#5C5C56] hover:text-[#3D5A3C] text-sm font-medium tracking-wide transition-colors duration-200"
              >
                {l.label}
              </a>
            ))}
            <a
              href="https://www.instagram.com/brightsidecork/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#3D5A3C]/25 hover:border-[#3D5A3C] hover:bg-[#3D5A3C]/06 transition-all duration-200"
              aria-label="Instagram"
            >
              <svg className="w-3.5 h-3.5 text-[#3D5A3C]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 group"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-[1.5px] bg-[#3D5A3C] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[4.5px]" : ""}`} />
            <span className={`block w-5 h-[1.5px] bg-[#3D5A3C] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-[1.5px] bg-[#3D5A3C] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[4.5px]" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[99] bg-[#F7F3EC]/97 backdrop-blur-sm flex flex-col items-center justify-center gap-10 transition-all duration-500 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {links.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setMenuOpen(false)}
            className="text-[#2C2C2A] text-4xl font-bold tracking-tight hover:text-[#3D5A3C] transition-colors"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            {l.label}
          </a>
        ))}
        <a
          href="https://www.instagram.com/brightsidecork/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#3D5A3C] text-sm uppercase tracking-widest font-semibold mt-4"
        >
          @brightsidecork
        </a>
      </div>
    </>
  );
}
