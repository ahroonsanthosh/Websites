"use client"
import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { MeshGradient } from "@paper-design/shaders-react"

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => { setMounted(true) }, [])

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Warm mesh gradient background */}
      <div className="absolute inset-0">
        <MeshGradient
          className="absolute inset-0 w-full h-full"
          colors={["#2C1810", "#6B3F2A", "#C8A882", "#F5F0E8", "#8B5E3C"]}
          speed={0.15}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#1A0F0A]/60" />
      </div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Nav */}
      <motion.nav
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-8 md:px-16 py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <span className="text-white/90 text-xs tracking-[0.35em] uppercase font-light">
          Café Jane
        </span>
        <div className="hidden md:flex items-center gap-10">
          {["Menu", "About", "Visit"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="underline-draw text-white/70 hover:text-white text-xs tracking-[0.25em] uppercase font-light transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </div>
        <a
          href="tel:021-241-0668"
          className="text-white/70 hover:text-white text-xs tracking-[0.2em] font-light transition-colors duration-300"
        >
          (021) 241 0668
        </a>
      </motion.nav>

      {/* Main hero content */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-6"
        style={{ y, opacity }}
      >
        <motion.p
          className="text-white/50 text-xs tracking-[0.5em] uppercase mb-8 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Est. Cork City · Shandon Street
        </motion.p>

        <motion.h1
          className="text-white font-light leading-none mb-6"
          style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(4rem, 12vw, 11rem)', letterSpacing: '-0.02em' }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          Café<br />
          <em className="italic text-[#C8A882]">Jane</em>
        </motion.h1>

        <motion.p
          className="text-white/60 text-sm md:text-base font-light max-w-xs leading-relaxed tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          A quiet corner for good coffee, honest food, and slow mornings.
        </motion.p>

        <motion.div
          className="mt-12 flex items-center gap-2 text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          <div className="w-8 h-px bg-white/30" />
          <span className="text-xs tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-8 h-px bg-white/30" />
        </motion.div>
      </motion.div>

      {/* Scroll indicator dot */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-1 h-1 rounded-full bg-white/40" />
      </motion.div>
    </section>
  )
}
