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
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute inset-0 bg-[#C8A882]/10 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className={`relative flex items-center justify-between py-4 border-b border-white/[0.07] px-1 ${isToday ? 'border-b-[#C8A882]/25' : ''}`}>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {isToday && (
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[#C8A882]"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
              />
            )}
          </AnimatePresence>

          <span className={`text-sm font-light transition-colors duration-200 ${
            isToday ? 'text-[#C8A882]' : hovered ? 'text-white' : 'text-white/65'
          }`}>
            {day}
          </span>

          {isToday && (
            <motion.span
              className="text-[10px] tracking-[0.3em] uppercase text-[#C8A882]/50 font-light"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              Today
            </motion.span>
          )}
        </div>

        <motion.span
          className={`text-sm font-light transition-colors duration-200 ${
            !isOpen ? 'text-white/25' : isToday ? 'text-white' : hovered ? 'text-white/90' : 'text-white/65'
          }`}
          animate={{ x: hovered && isOpen ? -3 : 0 }}
          transition={{ duration: 0.25 }}
        >
          {time ?? "Closed"}
        </motion.span>
      </div>
    </motion.div>
  )
}

export default function HoursSection() {
  return (
    <section id="visit" className="bg-[#1A0F0A] py-20 md:py-36 px-6 md:px-16 lg:px-32">
      <div className="max-w-7xl mx-auto">

        {/* Top: address + hours side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 mb-12 md:mb-16">

          {/* Left: Address */}
          <div>
            <motion.p
              className="text-[#C8A882] text-[10px] tracking-[0.45em] uppercase mb-6 font-light"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Find Us
            </motion.p>

            <motion.h2
              className="text-white font-light leading-tight mb-10"
              style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.025em' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              Come<br />
              <em className="italic text-[#C8A882]">visit us.</em>
            </motion.h2>

            {[
              { label: "Street", value: "116 Shandon Street" },
              { label: "Area", value: "Gurranabraher, Cork" },
              { label: "Eircode", value: "T23 YR02" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="flex items-baseline gap-6 mb-4"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.15 + i * 0.08 }}
              >
                <span className="text-[#C8A882]/55 text-[10px] tracking-[0.3em] uppercase w-14 flex-shrink-0">{item.label}</span>
                <span className="text-white/80 text-sm font-light">{item.value}</span>
              </motion.div>
            ))}

            <motion.a
              href="tel:0212410668"
              className="inline-flex items-center gap-3 text-[#C8A882] hover:text-white text-sm font-light mt-7 transition-colors duration-300 group"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <motion.span
                className="w-7 h-px bg-[#C8A882] origin-left block group-hover:bg-white transition-colors duration-300"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.65 }}
              />
              (021) 241 0668
            </motion.a>
          </div>

          {/* Right: Hours */}
          <div>
            <motion.p
              className="text-[#C8A882] text-[10px] tracking-[0.45em] uppercase mb-6 font-light"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Opening Hours
            </motion.p>

            <motion.p
              className="text-white/45 text-xs font-light mb-6 leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              Open Tuesday – Sunday.<br />Mondays we rest.
            </motion.p>

            <div>
              {hours.map((h, i) => (
                <HourRow key={h.day} day={h.day} time={h.time} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Google Maps — full width below */}
        <motion.div
          className="relative w-full overflow-hidden rounded-[2px]"
          style={{ height: 'clamp(260px, 40vw, 460px)' }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <iframe
            title="Café Jane location"
            src="https://maps.google.com/maps?q=116+Shandon+Street,+Gurranabraher,+Cork&output=embed&z=16"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'grayscale(1) contrast(1.1) brightness(0.75)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          {/* Warm colour tint overlay — doesn't block interaction */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, #C8A882/0 70%, #1A0F0A 100%)', mixBlendMode: 'multiply' }}
          />
          {/* Pin label */}
          <div className="absolute bottom-4 left-4 pointer-events-none">
            <div className="bg-[#1A0F0A]/80 backdrop-blur-sm px-4 py-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C8A882]" />
              <span className="text-white/70 text-[10px] tracking-[0.3em] uppercase font-light">Café Jane · Shandon St</span>
            </div>
          </div>
        </motion.div>

        {/* Directions link below map */}
        <motion.div
          className="flex justify-end mt-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <a
            href="https://maps.google.com/?q=116+Shandon+Street,+Gurranabraher,+Cork"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-draw text-[#C8A882]/60 hover:text-[#C8A882] text-[10px] tracking-[0.35em] uppercase font-light transition-colors duration-300"
          >
            Open in Google Maps ↗
          </a>
        </motion.div>

      </div>
    </section>
  )
}
