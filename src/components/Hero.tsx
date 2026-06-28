'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const BG = 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGkP3GEjEMW7i3H2CdcolNFylU9-r19TBx5_nmpjhjo6Ofckd8ujvfIMt06-zVvV6j1wlkNSXCjWUEVB3g0WaqfB6brNfW9oePHBBlUGbOamXCtCmYsTTBvTwAmtgJmu-LTBBC801IR81J0=s1360-w1360-h1020-rw'

export default function Hero() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = BG
    img.onload = () => setLoaded(true)
  }, [])

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-brand-surface"
      aria-label="Hero"
    >
      {/* Background photo */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={BG}
          alt=""
          aria-hidden="true"
          className="hero-img w-full h-full object-cover"
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.8s ease' }}
        />
        {/* Warm overlay — heavier at bottom so text always reads */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(254,250,245,0.55) 0%, rgba(254,250,245,0.3) 40%, rgba(26,17,10,0.65) 100%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 flex flex-col items-start pt-24 pb-32">

        {/* Tag */}
        <span
          className="tag tag-orange mb-6"
          style={{ animation: 'fade-in 0.6s ease 0.2s both' }}
        >
          ☀ Penrose Wharf · Cork
        </span>

        {/* Headline */}
        <h1
          className="font-display text-brand-bg font-bold leading-[0.9] tracking-tight mb-6"
          style={{
            fontSize: 'clamp(4.5rem, 18vw, 14rem)',
            textShadow: '0 2px 40px rgba(26,17,10,0.15)',
            animation: 'fade-in-up 0.9s cubic-bezier(0.25,1,0.5,1) 0.1s both',
          }}
        >
          Happy<br />Days
        </h1>

        {/* Sub line */}
        <p
          className="font-sans text-brand-bg/80 font-medium text-base sm:text-lg tracking-wide mb-10 max-w-xs"
          style={{ animation: 'fade-in 0.8s ease 0.7s both' }}
        >
          Breakfast &amp; lunch done right.<br />Mon–Fri, 8am–3pm.
        </p>

        {/* CTA row */}
        <div
          className="flex flex-wrap gap-3"
          style={{ animation: 'fade-in 0.8s ease 1s both' }}
        >
          <a href="#menu" className="cta-btn rounded-full">
            See the menu
          </a>
          <a href="#visit" className="cta-outline rounded-full" style={{ borderColor: 'rgba(254,250,245,0.7)', color: '#FEFAF5' }}>
            Find us
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
        style={{ animation: 'fade-in 1s ease 1.8s both' }}
      >
        <ChevronDown
          size={20}
          strokeWidth={2}
          className="animate-bounce-slow text-brand-bg/60"
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
