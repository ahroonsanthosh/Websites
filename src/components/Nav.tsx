'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '#about', label: 'About' },
  { href: '#menu', label: 'Menu' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#visit', label: 'Visit' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-brand-bg/95 backdrop-blur-sm border-b border-brand-border' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <a
            href="#"
            className="font-display text-brand-text text-lg font-medium tracking-[0.25em] uppercase hover:text-brand-accent transition-colors duration-300"
            aria-label="Happy Days — home"
          >
            Happy Days
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10" aria-label="Main navigation">
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="nav-link font-sans text-sm tracking-widest uppercase text-brand-text/70 hover:text-brand-text transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-brand-text p-2 -mr-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`mobile-menu fixed inset-0 z-[60] bg-brand-bg flex flex-col ${mobileOpen ? 'open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-brand-border">
          <span className="font-display text-brand-text text-lg tracking-[0.25em] uppercase">Happy Days</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-brand-text p-2 -mr-2"
            aria-label="Close menu"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>
        <nav className="flex flex-col items-start px-8 pt-12 gap-8" aria-label="Mobile navigation">
          {links.map(({ href, label }, i) => (
            <a
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              style={{ animationDelay: `${i * 80}ms` }}
              className="font-display text-4xl text-brand-text font-light tracking-wide hover:text-brand-accent transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="mt-auto px-8 pb-12 text-brand-text/30 text-xs tracking-widest uppercase font-sans">
          Penrose Wharf · Cork
        </div>
      </div>
    </>
  )
}
