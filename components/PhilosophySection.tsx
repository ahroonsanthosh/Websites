"use client"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const lines = [
  { text: "Good coffee.", highlight: true },
  { text: "Good food.", highlight: false },
  { text: "Good people.", highlight: true },
]

export default function PhilosophySection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const x1 = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"])
  const x2 = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"])

  return (
    <section ref={ref} className="relative bg-[#FAFAF7] py-32 md:py-48 overflow-hidden">
      {/* Ghost background text */}
      <motion.p
        className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap select-none pointer-events-none"
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(6rem, 18vw, 16rem)',
          letterSpacing: '-0.05em',
          color: '#2C1810',
          opacity: 0.03,
          x: x2,
        }}
      >
        Café Jane Cork
      </motion.p>

      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-32 relative z-10">
        <div className="max-w-2xl">
          <motion.p
            className="text-[#C8A882] text-xs tracking-[0.4em] uppercase mb-10 font-light"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Philosophy
          </motion.p>

          {/* Headlines — always visible, subtle entrance */}
          <div className="space-y-1 mb-12">
            {lines.map((line, i) => (
              <motion.h2
                key={i}
                className={`font-light leading-tight ${line.highlight ? 'text-[#2C1810]' : 'text-[#C8A882]'}`}
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 'clamp(2.8rem, 7vw, 6.5rem)',
                  letterSpacing: '-0.02em',
                }}
                initial={{ opacity: 0.4, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {line.text}
              </motion.h2>
            ))}
          </div>

          <motion.p
            className="text-[#2C1810]/65 font-light text-sm md:text-base leading-relaxed max-w-md"
            initial={{ opacity: 0.3, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            We opened Café Jane with one simple idea: that ordinary moments — a morning coffee,
            a slice of toast, a quiet hour — can be made beautiful with a little care.
          </motion.p>
        </div>

        {/* Side image — parallax, less washed */}
        <motion.div
          className="absolute right-0 top-0 bottom-0 w-2/5 overflow-hidden hidden lg:block"
          style={{ x: x1 }}
        >
          <img
            src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAGh5kPBQhst-WTL8qQqjbv0QRmXrQWRjxlbcW5Gn8HALAw3qmvjub4RM64SSiVf794PNzU48aFvXPKWO0Rr-GrpbwS0qOU8Lzh1X43Rm7IUYqY9L1If-bHa0t95jm60QT6wXAlU=s1360-w1360-h1020-rw"
            alt="Café Jane exterior"
            className="w-full h-full object-cover"
            style={{ opacity: 0.55 }}
          />
          {/* Fade left edge into page background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAF7] via-[#FAFAF7]/20 to-transparent" />
          {/* Subtle warm tint */}
          <div className="absolute inset-0 bg-[#C8A882]/10 mix-blend-multiply" />
        </motion.div>
      </div>
    </section>
  )
}
