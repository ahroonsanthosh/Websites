'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, ExternalLink } from 'lucide-react'
import { HourEntry } from '@/lib/content'

interface Props {
  hours: HourEntry[]
  contact: {
    address: string
    instagram: string
    facebook: string
  }
}

function getCurrentDay(): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[new Date().getDay()]
}

export default function Visit({ hours, contact }: Props) {
  const today = getCurrentDay()

  return (
    <section id="visit" className="py-32 md:py-40 bg-brand-surface" aria-label="Visit us">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex items-center gap-4 mb-16">
          <span className="font-sans text-brand-accent text-xs tracking-[0.4em] uppercase">04</span>
          <div className="h-px bg-brand-border" style={{ width: '60px' }} />
          <span className="font-sans text-brand-text/40 text-xs tracking-[0.3em] uppercase">Find Us</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="font-display text-brand-text font-light leading-tight mb-20"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
        >
          Come find us<br />
          <em>on the wharf.</em>
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Address column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          >
            <div className="flex items-start gap-3 mb-8">
              <MapPin size={16} strokeWidth={1.5} className="text-brand-accent mt-1 shrink-0" />
              <p className="font-sans text-brand-text/50 text-xs tracking-[0.3em] uppercase">Address</p>
            </div>

            {/* Large address typography */}
            <address
              className="not-italic font-display text-brand-text font-light leading-tight mb-10"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}
            >
              Penrose Wharf<br />
              <span className="text-brand-text/50">Penrose Quay</span><br />
              <span className="text-brand-text/50">Victorian Quarter</span><br />
              Cork<br />
              <span className="text-brand-accent">T23 RK11</span>
            </address>

            <a
              href="https://maps.google.com/?q=Penrose+Wharf+Cork+T23+RK11"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn inline-flex items-center gap-3 px-7 py-3.5 border border-brand-accent text-brand-accent font-sans text-sm tracking-widest uppercase hover:bg-brand-accent hover:text-brand-bg transition-all duration-300"
            >
              <ExternalLink size={14} strokeWidth={1.5} aria-hidden="true" />
              Get Directions
            </a>
          </motion.div>

          {/* Hours column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.15 }}
          >
            <div className="flex items-start gap-3 mb-8">
              <Clock size={16} strokeWidth={1.5} className="text-brand-accent mt-1 shrink-0" />
              <p className="font-sans text-brand-text/50 text-xs tracking-[0.3em] uppercase">Opening Hours</p>
            </div>

            <div className="space-y-0">
              {hours.map((entry, i) => {
                const isToday = entry.day === today
                return (
                  <motion.div
                    key={entry.day}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                  >
                    <div
                      className={`flex justify-between items-center py-4 px-3 -mx-3 transition-colors ${
                        isToday ? 'bg-brand-accent/8' : ''
                      }`}
                    >
                      <span
                        className={`font-sans text-sm tracking-wide ${
                          isToday ? 'text-brand-accent font-medium' : 'text-brand-text/60'
                        }`}
                      >
                        {entry.day}
                        {isToday && (
                          <span className="ml-2 text-brand-accent text-[10px] tracking-[0.2em] uppercase">Today</span>
                        )}
                      </span>
                      <span
                        className={`font-sans text-sm ${
                          isToday ? 'text-brand-accent font-medium' : entry.closed ? 'text-brand-text/25' : 'text-brand-text/60'
                        }`}
                      >
                        {entry.closed ? 'Closed' : `${entry.open} – ${entry.close}`}
                      </span>
                    </div>
                    <div className="h-px bg-brand-border mx-3" />
                  </motion.div>
                )
              })}
            </div>

            <p className="mt-8 font-sans text-brand-text/30 text-xs tracking-[0.2em] uppercase">
              Kitchen closes at 2:30pm
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
