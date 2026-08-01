"use client"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { MeshGradient } from "@paper-design/shaders-react"

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Mesh gradient */}
      <div className="absolute inset-0">
        <MeshGradient
          className="absolute inset-0 w-full h-full"
          colors={["#2C1810", "#6B3F2A", "#C8A882", "#F5F0E8", "#8B5E3C"]}
          speed={0.12}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-[#1A0F0A]/70" />
      </div>

      {/* Nav */}
      <motion.nav
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-16 py-7"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="text-white/80 text-[11px] tracking-[0.35em] uppercase font-light">
          Café Jane
        </span>
        <div className="hidden md:flex items-center gap-8">
          {["Menu", "About", "Visit"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="underline-draw text-white/55 hover:text-white/90 text-[11px] tracking-[0.25em] uppercase font-light transition-colors duration-400"
            >
              {item}
            </a>
          ))}
        </div>
        <a
          href="tel:0212410668"
          className="hidden md:block text-white/55 hover:text-white/90 text-[11px] tracking-[0.2em] font-light transition-colors duration-400"
        >
          (021) 241 0668
        </a>
        {/* Mobile: call CTA */}
        <a
          href="tel:0212410668"
          className="md:hidden text-white/60 text-[11px] tracking-[0.2em] font-light"
        >
          Call
        </a>
      </motion.nav>

      {/* Hero content — parallax on scroll */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-6"
        style={{ y, opacity }}
      >
        <motion.p
          className="text-white/40 text-[10px] tracking-[0.55em] uppercase mb-7 font-light"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.5, ease: [0.22, 1, 0.36, 1] }}
        >
          Shandon Street · Cork City
        </motion.p>

        <div className="overflow-hidden mb-4">
          <motion.h1
            className="text-white font-light leading-none"
            style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(4.5rem, 14vw, 11rem)', letterSpacing: '-0.025em' }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, delay: 2.3, ease: [0.22, 1, 0.36, 1] }}
          >
            Café
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            className="font-light leading-none italic text-[#C8A882]"
            style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(4.5rem, 14vw, 11rem)', letterSpacing: '-0.025em' }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, delay: 2.45, ease: [0.22, 1, 0.36, 1] }}
          >
            Jane.
          </motion.h1>
        </div>

        <motion.p
          className="text-white/50 text-sm md:text-base font-light max-w-xs leading-relaxed tracking-wide mt-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 2.8, ease: [0.22, 1, 0.36, 1] }}
        >
          A quiet corner for good coffee, honest food, and slow mornings.
        </motion.p>

        <motion.div
          className="mt-10 flex items-center gap-3 text-white/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 3.1 }}
        >
          <div className="w-6 h-px bg-white/25" />
          <span className="text-[10px] tracking-[0.4em] uppercase">Scroll</span>
          <div className="w-6 h-px bg-white/25" />
        </motion.div>
      </motion.div>

      {/* Scroll dot */}
      <motion.div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 0.6 }}
      >
        <motion.div
          className="w-1 h-1 rounded-full bg-white/35"
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  )
}
