'use client';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import type { SiteContent } from '@/types/content';

export default function Footer({ content }: { content: SiteContent }) {
  const { site } = content;
  const year = new Date().getFullYear();

  const links = [
    { label: 'Menu', href: '#menu' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const scroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-coffee-900 text-cream-300 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-coffee-700/40">

          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-display text-2xl font-bold tracking-[0.2em] text-cream-100 hover:text-coffee-200 transition-colors"
          >
            LOKA
          </button>

          {/* Nav */}
          <nav className="flex flex-wrap justify-center gap-6 md:gap-8">
            {links.map((link) => (
              <button
                key={link.label}
                onClick={() => scroll(link.href)}
                className="hover-underline text-xs font-medium uppercase tracking-widest text-cream-400/60 hover:text-cream-200 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Social */}
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-cream-400/60 hover:text-cream-200 transition-colors"
          >
            <Instagram className="h-4 w-4" />
            <span className="text-xs uppercase tracking-widest">Instagram</span>
          </a>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-cream-500/40">
          <p>{site.address}</p>
          <p className="hidden md:block">·</p>
          <p>{site.phone}</p>
          <p className="hidden md:block">·</p>
          <p>© {year} LOKA Coffee Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
