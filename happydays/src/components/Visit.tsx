'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, ExternalLink } from 'lucide-react'
import { HourEntry } from '@/lib/content'

interface Props {
  hours: HourEntry[]
  contact?: {
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
    <section id="visit" className="py-20 md:py-32 bg-brand-surface" aria-label="Visit us">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">

        <div className="mb-10">
          <span className="tag tag-green mb-4 block w-fit">Find Us</span>
          <h2
            className="font-display font-bold text-brand-text leading-tight"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)' }}
          >
            Come find us<br />
            <span className="text-brand-accent italic">on the wharf.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Address card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
            className="bg-brand-bg rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 mb-5">
              <MapPin size={16} strokeWidth={2} className="text-brand-accent" />
              <span className="font-sans text-brand-muted text-xs font-semibold tracking-widest uppercase">Address</span>
            </div>

            <address className="not-italic mb-6">
              <p className="font-sans font-bold text-brand-text text-xl sm:text-2xl leading-snug mb-1">
                Penrose Wharf
              </p>
              <p className="font-sans text-brand-muted text-base leading-relaxed">
                Penrose Quay, Victorian Quarter<br />
                Cork · T23 RK11
              </p>
            </address>

            <a
              href="https://maps.google.com/?q=Penrose+Wharf+Cork+T23+RK11"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn rounded-full text-xs"
            >
              <ExternalLink size={13} strokeWidth={2.5} aria-hidden="true" />
              Get Directions
            </a>

            {/* Social */}
            {contact && (
              <div className="mt-8 pt-6 border-t border-brand-border flex items-center gap-4">
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-sans text-brand-muted text-xs font-semibold tracking-wide uppercase hover:text-brand-accent transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
                  Instagram
                </a>
                <a
                  href={contact.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-sans text-brand-muted text-xs font-semibold tracking-wide uppercase hover:text-brand-accent transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  Facebook
                </a>
              </div>
            )}
          </motion.div>

          {/* Hours card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: 0.12 }}
            className="bg-brand-bg rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 mb-5">
              <Clock size={16} strokeWidth={2} className="text-brand-accent" />
              <span className="font-sans text-brand-muted text-xs font-semibold tracking-widest uppercase">Opening Hours</span>
            </div>

            <div className="space-y-1">
              {hours.map((entry, i) => {
                const isToday = entry.day === today
                return (
                  <motion.div
                    key={entry.day}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className={`flex justify-between items-center py-3 px-3 rounded-xl ${
                      isToday ? 'bg-brand-accent/10' : ''
                    }`}
                  >
                    <span className={`font-sans text-sm font-semibold ${isToday ? 'text-brand-accent' : 'text-brand-text'}`}>
                      {entry.day}
                      {isToday && (
                        <span className="ml-2 inline-block bg-brand-accent text-white text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-full">
                          Today
                        </span>
                      )}
                    </span>
                    <span className={`font-sans text-sm font-medium tabular-nums ${
                      isToday ? 'text-brand-accent' : entry.closed ? 'text-brand-border font-normal' : 'text-brand-muted'
                    }`}>
                      {entry.closed ? 'Closed' : `${entry.open} – ${entry.close}`}
                    </span>
                  </motion.div>
                )
              })}
            </div>

            <p className="mt-6 font-sans text-brand-muted text-xs">
              Kitchen closes at 2:30pm daily.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
