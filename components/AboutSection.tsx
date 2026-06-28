"use client"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const images = [
  "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHgs-QKf_C20dNSo4p_-chiLoIDzicBRH05AUadc4yU__KvlweZZ2KmfIttrOS0DXvMWe4f8lGzd2p6Q_BqoUE1mxKetdm7lnila7IZdsA2AJfvvoA-pcOEMn7jCqocba1PEIweZi5cUz5S=s1360-w1360-h1020-rw",
  "https://lh3.googleusercontent.com/gps-cs-s/APNQkAH6-GIshzw81USbQmQ4cpnkugbo3PbHtAZ6dBlO98dg4Rv7ND-0Xf_a-mR_41aveOfl91TooRy_usLchQJV1_YA5UqaZsZiATlYLD-z4vxOVK5pLBZKF3BZhZKwWyouXPdIjRWe=s1360-w1360-h1020-rw",
]

function AnimatedWord({ word, delay }: { word: string; delay: number }) {
  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {word}&nbsp;
    </motion.span>
  )
}

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  const headline = "A neighbourhood café where every detail matters."

  return (
    <section id="about" ref={ref} className="bg-[#F5F0E8] py-28 md:py-40 px-6 md:px-16 lg:px-32">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">
        {/* Left: Text */}
        <div>
          <motion.p
            className="text-[#C8A882] text-xs tracking-[0.4em] uppercase mb-8 font-light"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Story
          </motion.p>

          <h2
            className="text-[#2C1810] font-light leading-tight mb-10 text-balance"
            style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.02em' }}
          >
            {headline.split(" ").map((word, i) => (
              <AnimatedWord key={i} word={word} delay={i * 0.07} />
            ))}
          </h2>

          <motion.div
            className="space-y-5 text-[#6B3F2A]/80 font-light leading-relaxed text-sm md:text-base"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <p>
              Nestled on Shandon Street in Cork, Café Jane is a place built on the belief
              that a great cup of coffee and a carefully prepared plate of food can make
              anyone's day a little better.
            </p>
            <p>
              We source seasonally, bake daily, and pour with intention. Whether you're
              stopping in before work or settling in for the afternoon, you'll always find
              a warm welcome and something worth lingering over.
            </p>
          </motion.div>

          <motion.div
            className="mt-12 flex items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="h-px flex-1 bg-[#C8A882]/40" />
            <span className="text-[#C8A882] text-xs tracking-[0.3em] uppercase font-light">
              116 Shandon St, Cork
            </span>
          </motion.div>
        </div>

        {/* Right: Staggered images */}
        <div className="relative h-[480px] md:h-[600px]">
          <motion.div
            className="absolute top-0 right-0 w-3/4 h-3/4 overflow-hidden rounded-sm"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={images[0]}
              alt="Café Jane interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#2C1810]/10" />
          </motion.div>

          <motion.div
            className="absolute bottom-0 left-0 w-2/3 h-2/3 overflow-hidden rounded-sm border-4 border-[#F5F0E8]"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={images[1]}
              alt="Coffee at Café Jane"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Floating label */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="bg-[#2C1810] text-white text-xs tracking-[0.3em] uppercase px-5 py-3 font-light">
              Since Cork
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
