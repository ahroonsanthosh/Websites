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
  const x1 = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"])
  const x2 = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"])

  return (
    <section ref={ref} className="relative bg-[#FAFAF7] py-32 md:py-48 overflow-hidden">
      {/* Large background text */}
      <motion.p
        className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap text-[#2C1810]/[0.03] font-light select-none pointer-events-none"
        style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(6rem, 18vw, 16rem)', x: x2, letterSpacing: '-0.05em' }}
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
          >
            Our Philosophy
          </motion.p>

          <div className="space-y-2">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                className="overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.1, delay: i * 0.2 }}
              >
                <motion.h2
                  className={`font-light leading-none ${line.highlight ? 'text-[#2C1810]' : 'text-[#C8A882]'}`}
                  style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(3rem, 7vw, 6.5rem)', letterSpacing: '-0.02em' }}
                  initial={{ y: "110%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line.text}
                </motion.h2>
              </motion.div>
            ))}
          </div>

          <motion.p
            className="mt-12 text-[#6B3F2A]/60 font-light text-sm leading-relaxed max-w-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            We opened Café Jane with one simple idea: that ordinary moments — a morning coffee,
            a slice of toast, a quiet hour — can be made beautiful with a little care.
          </motion.p>
        </div>

        {/* Side image — parallax */}
        <motion.div
          className="absolute right-0 top-0 bottom-0 w-1/3 overflow-hidden hidden lg:block"
          style={{ x: x1 }}
        >
          <img
            src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAGh5kPBQhst-WTL8qQqjbv0QRmXrQWRjxlbcW5Gn8HALAw3qmvjub4RM64SSiVf794PNzU48aFvXPKWO0Rr-GrpbwS0qOU8Lzh1X43Rm7IUYqY9L1If-bHa0t95jm60QT6wXAlU=s1360-w1360-h1020-rw"
            alt="Café Jane atmosphere"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#FAFAF7]" />
        </motion.div>
      </div>
    </section>
  )
}
