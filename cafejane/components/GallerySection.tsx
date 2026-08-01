"use client"
import { useState } from "react"
import { motion } from "framer-motion"

const photos = [
  {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAF99cauAev_v8gk4wjw-WzrbptyNdfI0pbKwcixcFuKawCb0_b5DXtpziCFWsIty5Labp5f7Oew08xnKxeV4AILqjMEzslUU5mh3PuEa0wjh1nEAnXfBod67ejCEujxO0IPoWLQo7fkGaQC=s1360-w1360-h1020-rw",
    label: "Morning light",
    number: "01",
  },
  {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHHcIFaC5tHkZmKHrkEle_aaSEQyZCQRKNkVgbV9bGjq1HC9z3EdyH7drlUEMZmzVlScpSgaTxY7NSnm46LA7z-kDZIxpE4Rw_AynribxUd7M9DEPidsK4BHjSMfUiFb4eZ-g_2zEqtV9w=s1360-w1360-h1020-rw",
    label: "The details",
    number: "02",
  },
  {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHeV0S_0qbKrd36BRqoJoLndSorRsK32ZESzd08LIYO-kSnxJO3qx2_z_fIW5Fq1nTZWBqnFpqNTHvgJel0XUjjAeFX73fxQvg4dRzUp1jeBBRsJqOOc5L3A5x73C38uuuuXvO_VWGrvPA=s1360-w1360-h1020-rw",
    label: "Handcrafted",
    number: "03",
  },
  {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGh5kPBQhst-WTL8qQqjbv0QRmXrQWRjxlbcW5Gn8HALAw3qmvjub4RM64SSiVf794PNzU48aFvXPKWO0Rr-GrpbwS0qOU8Lzh1X43Rm7IUYqY9L1If-bHa0t95jm60QT6wXAlU=s1360-w1360-h1020-rw",
    label: "Our space",
    number: "04",
  },
  {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAG2oRf8DLtXOoRVyLDmue9AggQf1iSsiaRKR_UcheGE1VwsxwY96Ih2lfAc7VnwVqe-jT68W2gCzA36DRWFMxHqmbfJLIq30C-Edv80S1BJIMAKga-9NACWMDR_xxRwnHhRC8q-=s1360-w1360-h1020-rw",
    label: "Slow Saturdays",
    number: "05",
  },
]

export default function GallerySection() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section className="bg-[#F5F0E8] py-20 md:py-36 overflow-hidden">
      {/* Header */}
      <div className="px-6 md:px-16 lg:px-32 max-w-7xl mx-auto mb-8 flex items-end justify-between flex-wrap gap-6">
        <motion.h2
          className="text-[#2C1810] font-light leading-none"
          style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', letterSpacing: '-0.02em' }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          The <em className="italic text-[#C8A882]">space</em>
        </motion.h2>
        <motion.p
          className="text-[#6B3F2A]/60 text-xs font-light max-w-xs leading-relaxed text-right"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          Every corner considered.<br />Come see it for yourself.
        </motion.p>
      </div>

      {/* Desktop: horizontal accordion */}
      <div className="hidden md:flex gap-1 px-6 md:px-16 lg:px-32">
        {photos.map((photo, i) => (
          <motion.div
            key={i}
            className="relative overflow-hidden rounded-[2px] cursor-pointer flex-shrink-0"
            style={{
              height: '420px',
              flexBasis: active === i ? '38%' : '15.5%',
              transition: 'flex-basis 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <motion.img
              src={photo.src}
              alt={photo.label}
              className="w-full h-full object-cover"
              animate={{ scale: active === i ? 1.04 : 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A]/60 via-transparent to-transparent" />

            {/* Number — always visible, fades on expand */}
            <motion.span
              className="absolute top-4 right-4 text-[10px] tracking-[0.2em] text-white"
              animate={{ opacity: active === i ? 0.4 : 0.25 }}
              transition={{ duration: 0.3 }}
            >
              {photo.number}
            </motion.span>

            {/* Label — slides up on expand */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 px-5 pb-5"
              animate={{ y: active === i ? 0 : 10, opacity: active === i ? 1 : 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-white text-xs tracking-[0.3em] uppercase font-light">{photo.label}</p>
            </motion.div>

            {/* Collapsed: vertical label */}
            <motion.div
              className="absolute inset-0 flex items-end justify-center pb-5"
              animate={{ opacity: active === i ? 0 : 0.5 }}
              transition={{ duration: 0.25 }}
            >
              <span
                className="text-white/60 text-[9px] tracking-[0.3em] uppercase font-light"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                {photo.label}
              </span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Mobile: 2-col grid */}
      <div className="md:hidden grid grid-cols-2 gap-1.5 px-4">
        {photos.map((photo, i) => (
          <motion.div
            key={i}
            className={`relative overflow-hidden rounded-[2px] ${i === 0 ? 'col-span-2' : ''}`}
            style={{ height: i === 0 ? '260px' : '160px' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={photo.src} alt={photo.label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A]/50 to-transparent" />
            <span className="absolute bottom-3 left-3 text-white/70 text-[9px] tracking-[0.3em] uppercase font-light">
              {photo.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Hint */}
      <motion.div
        className="hidden md:flex items-center gap-3 px-6 md:px-16 lg:px-32 mt-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        <div className="w-5 h-px bg-[#C8A882]/30" />
        <span className="text-[#C8A882]/40 text-[10px] tracking-[0.4em] uppercase font-light">Hover to explore</span>
      </motion.div>
    </section>
  )
}
