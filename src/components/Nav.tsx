'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '#about',   label: 'About' },
  { href: '#menu',    label: 'Menu' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#visit',   label: 'Visit' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-brand-bg/95 backdrop-blur-sm border-b border-brand-border shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 sm:h-16 flex items-center justify-between">
          <a
            href="#"
            className="font-display text-brand-text text-xl font-semibold tracking-tight hover:text-brand-accent transition-colors duration-200"
            aria-label="Happy Days — home"
          >
            Happy Days
          </a>

          {/* Desktop */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="nav-link font-sans text-sm font-medium tracking-wide text-brand-muted hover:text-brand-text transition-colors duration-200"
              >
                {label}
              </a>
            ))}
            <a
              href="#visit"
              className="ml-2 px-4 py-2 bg-brand-accent text-white text-xs font-bold tracking-wider uppercase rounded-full hover:bg-brand-text transition-colors duration-200"
            >
              Find Us
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-brand-text p-2 -mr-1 rounded-lg hover:bg-brand-surface transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu size={22} strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`mobile-menu fixed inset-0 z-[60] bg-brand-bg flex flex-col ${mobileOpen ? 'open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <div>
          <div className="flex items-center justify-between px-5 h-14 border-b border-brand-border">
            <span className="font-display text-brand-text text-xl font-semibold tracking-tight">Happy Days</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-brand-text p-2 -mr-1 rounded-lg hover:bg-brand-surface transition-colors"
              aria-label="Close menu"
            >
              <X size={22} strokeWidth={2} />
            </button>
          </div>

          <nav className="flex flex-col px-6 pt-8 gap-1" aria-label="Mobile navigation">
            {links.map(({ href, label }, i) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                style={{ animationDelay: `${i * 60}ms` }}
                className="font-sans text-2xl font-bold text-brand-text py-4 border-b border-brand-border hover:text-brand-accent transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="mt-auto px-6 pb-10">
            <a
              href="#visit"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center py-4 bg-brand-accent text-white font-bold tracking-wider uppercase text-sm rounded-full hover:bg-brand-text transition-colors duration-200"
            >
              Find Us · Penrose Wharf
            </a>
            <p className="text-center mt-4 font-sans text-brand-muted text-xs tracking-wide">
              Mon–Fri · 8am–3pm
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
