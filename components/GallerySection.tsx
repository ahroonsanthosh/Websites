"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

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
    <section className="bg-[#F5F0E8] py-28 md:py-40 overflow-hidden">
      {/* Header */}
      <div className="px-6 md:px-16 lg:px-32 max-w-7xl mx-auto mb-10 flex items-end justify-between flex-wrap gap-8">
        <motion.h2
          className="text-[#2C1810] font-light leading-none"
          style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.02em' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          The <em className="italic text-[#C8A882]">space</em>
        </motion.h2>
        <motion.p
          className="text-[#6B3F2A]/50 text-sm font-light max-w-xs leading-relaxed text-right"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Every corner considered.<br />Come see it for yourself.
        </motion.p>
      </div>

      {/* Horizontal scroll strip */}
      <div className="flex gap-4 px-6 md:px-16 lg:px-32 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {photos.map((photo, i) => (
          <motion.div
            key={i}
            className="relative flex-shrink-0 overflow-hidden rounded-[2px] cursor-pointer group"
            style={{
              width: active === i ? '420px' : '220px',
              height: '360px',
              transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            data-cursor="View"
          >
            <motion.img
              src={photo.src}
              alt={photo.label}
              className="w-full h-full object-cover"
              animate={{ scale: active === i ? 1.03 : 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A]/70 via-transparent to-transparent"
              animate={{ opacity: active === i ? 1 : 0.3 }}
              transition={{ duration: 0.4 }}
            />

            {/* Number */}
            <motion.span
              className="absolute top-4 right-4 text-white/30 font-light"
              style={{ fontSize: '0.625rem', letterSpacing: '0.2em' }}
              animate={{ opacity: active === i ? 0.6 : 0.3 }}
            >
              {photo.number}
            </motion.span>

            {/* Label */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-5"
              animate={{ y: active === i ? 0 : 8, opacity: active === i ? 1 : 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-white text-xs tracking-[0.3em] uppercase font-light">{photo.label}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Scroll hint */}
      <motion.div
        className="flex items-center gap-3 px-6 md:px-16 lg:px-32 mt-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
      >
        <div className="w-6 h-px bg-[#C8A882]/30" />
        <span className="text-[#C8A882]/40 text-[10px] tracking-[0.4em] uppercase font-light">Hover to explore</span>
      </motion.div>
    </section>
  )
}
