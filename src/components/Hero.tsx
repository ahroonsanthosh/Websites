'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { ChevronDown } from 'lucide-react'

const ShaderBackground = dynamic(
  () => import('@/components/ui/animated-shader-background'),
  { ssr: false }
)

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section
      id="hero"
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Shader background */}
      <div className="absolute inset-0 bg-brand-bg">
        {mounted && <ShaderBackground />}
      </div>

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(8,6,3,0.6) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        ref={textRef}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        {/* Section label */}
        <p
          className="font-sans text-brand-accent text-xs tracking-[0.4em] uppercase mb-8 opacity-0"
          style={{ animation: 'fade-in 1s ease 0.3s both' }}
        >
          Penrose Wharf · Cork
        </p>

        {/* Main headline */}
        <h1
          className="font-display text-brand-text font-light leading-none tracking-tight"
          style={{
            fontSize: 'clamp(4rem, 15vw, 14rem)',
            animation: 'fade-in-up 1.2s cubic-bezier(0.25,1,0.5,1) 0.1s both',
          }}
        >
          Happy Days
        </h1>

        {/* Gold rule */}
        <div
          className="gold-rule-animate mt-6 mb-6 h-px bg-brand-accent"
          style={{ width: 'clamp(80px, 15vw, 180px)' }}
          aria-hidden="true"
        />

        {/* Subtitle */}
        <p
          className="font-sans text-brand-text/50 text-sm md:text-base tracking-[0.3em] uppercase"
          style={{ animation: 'fade-in 1s ease 1.5s both' }}
        >
          Breakfast &amp; Lunch
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="font-sans text-brand-text/30 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <ChevronDown
          size={18}
          strokeWidth={1}
          className="animate-bounce-slow text-brand-accent"
          aria-hidden="true"
        />
      </div>

    </section>
  )
}
