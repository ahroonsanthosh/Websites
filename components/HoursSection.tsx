"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const hours = [
  { day: "Monday", time: null },
  { day: "Tuesday", time: "8am – 5pm" },
  { day: "Wednesday", time: "8am – 5pm" },
  { day: "Thursday", time: "8am – 5pm" },
  { day: "Friday", time: "8am – 5pm" },
  { day: "Saturday", time: "10am – 5pm" },
  { day: "Sunday", time: "10am – 5pm" },
]

const todayName = new Date().toLocaleDateString("en-IE", { weekday: "long" })

function HourRow({ day, time, index }: { day: string; time: string | null; index: number }) {
  const [hovered, setHovered] = useState(false)
  const isToday = day === todayName
  const isOpen = time !== null

  return (
    <motion.div
      className="relative overflow-hidden cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Hover fill */}
      <motion.div
        className="absolute inset-0 bg-[#C8A882]/10 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className={`relative flex items-center justify-between py-5 border-b border-white/[0.08] px-1 ${isToday ? 'border-b-[#C8A882]/30' : ''}`}>
        <div className="flex items-center gap-4">
          {/* Today indicator */}
          <AnimatePresence>
            {isToday && (
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[#C8A882]"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.4, 1] }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.06 }}
              />
            )}
          </AnimatePresence>

          <span className={`text-sm font-light transition-colors duration-300 ${
            isToday ? 'text-[#C8A882]' : hovered ? 'text-white' : 'text-white/50'
          }`}>
            {day}
          </span>

          {isToday && (
            <motion.span
              className="text-[10px] tracking-[0.3em] uppercase text-[#C8A882]/50 font-light"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              Today
            </motion.span>
          )}
        </div>

        <motion.span
          className={`text-sm font-light transition-colors duration-300 ${
            !isOpen ? 'text-white/20' : isToday ? 'text-white' : hovered ? 'text-white/90' : 'text-white/50'
          }`}
          animate={{ x: hovered && isOpen ? -4 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {time ?? "Closed"}
        </motion.span>
      </div>
    </motion.div>
  )
}

export default function HoursSection() {
  return (
    <section id="visit" className="bg-[#1A0F0A] py-28 md:py-40 px-6 md:px-16 lg:px-32">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
        {/* Left: Address + atmosphere */}
        <div>
          <motion.p
            className="text-[#C8A882]/40 text-xs tracking-[0.45em] uppercase mb-6 font-light"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Find Us
          </motion.p>

          <motion.h2
            className="text-white font-light leading-[0.9] mb-14"
            style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(3rem, 6vw, 5rem)', letterSpacing: '-0.025em' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            Come<br />
            <em className="italic text-[#C8A882]">visit us.</em>
          </motion.h2>

          {/* Address block with staggered reveal */}
          {[
            { label: "Street", value: "116 Shandon Street" },
            { label: "Area", value: "Gurranabraher, Cork" },
            { label: "Eircode", value: "T23 YR02" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="flex items-baseline gap-6 mb-5"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            >
              <span className="text-[#C8A882]/30 text-[10px] tracking-[0.3em] uppercase w-16 flex-shrink-0">{item.label}</span>
              <span className="text-white/70 text-sm font-light">{item.value}</span>
            </motion.div>
          ))}

          <motion.a
            href="tel:0212410668"
            className="inline-flex items-center gap-3 text-[#C8A882] text-sm font-light mt-8 group"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.span
              className="w-8 h-px bg-[#C8A882] origin-left block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.8 }}
            />
            <span className="underline-draw group-hover:text-white transition-colors">(021) 241 0668</span>
          </motion.a>

          {/* Decorative grid */}
          <motion.div
            className="mt-14 relative w-full h-44 overflow-hidden rounded-[2px]"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            data-cursor="Visit"
          >
            <div className="w-full h-full bg-[#2C1810]/40 relative overflow-hidden">
              {/* Grid lines */}
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={`h${i}`}
                  className="absolute inset-x-0 h-px bg-white/[0.06]"
                  style={{ top: `${i * 10 + 5}%` }}
                  initial={{ scaleX: 0, originX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.04 }}
                />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={`v${i}`}
                  className="absolute inset-y-0 w-px bg-white/[0.06]"
                  style={{ left: `${i * 10 + 5}%` }}
                  initial={{ scaleY: 0, originY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.04 }}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#C8A882] mx-auto mb-3"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                  <p className="text-white/30 text-[10px] tracking-[0.4em] uppercase">Shandon St · Cork</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: Hours */}
        <div>
          <motion.p
            className="text-[#C8A882]/40 text-xs tracking-[0.45em] uppercase mb-6 font-light"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Opening Hours
          </motion.p>

          <motion.p
            className="text-white/20 text-xs font-light mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            We're open most of the week.<br />
            Mondays we rest.
          </motion.p>

          <div className="mt-2">
            {hours.map((h, i) => (
              <HourRow key={h.day} day={h.day} time={h.time} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
