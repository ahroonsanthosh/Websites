'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'

interface Props {
  about: string
}

const IMAGES = [
  'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGkP3GEjEMW7i3H2CdcolNFylU9-r19TBx5_nmpjhjo6Ofckd8ujvfIMt06-zVvV6j1wlkNSXCjWUEVB3g0WaqfB6brNfW9oePHBBlUGbOamXCtCmYsTTBvTwAmtgJmu-LTBBC801IR81J0=s1360-w1360-h1020-rw',
  'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFAQwBjNw1JPHaHvMx6VJmlDSPBYv2ihCFH1q52cOqtJ3KuOSlmdWUaJSP7L1sxT6o-jfyHZ3WhxjK1RFaB6ZRVKXGqkF6wsgqlVpq6ol9bi2KSK5-m9mGZ7ismDiAxD5Etuh-FaPOB3ozx=s1360-w1360-h1020-rw',
]

export default function About({ about }: Props) {
  return (
    <section id="about" className="py-32 md:py-40 bg-brand-bg" aria-label="About">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-20">
          <span className="font-sans text-brand-accent text-xs tracking-[0.4em] uppercase">01</span>
          <div className="h-px flex-1 bg-brand-border" style={{ maxWidth: '60px' }} />
          <span className="font-sans text-brand-text/40 text-xs tracking-[0.3em] uppercase">Our Story</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
            className="relative"
          >
            {/* Main image */}
            <div className="relative aspect-[4/5] overflow-hidden gallery-item">
              <img
                src={IMAGES[0]}
                alt="Inside Happy Days café, Penrose Wharf Cork"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="gallery-border" aria-hidden="true" />
            </div>
            {/* Offset accent image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.25 }}
              className="absolute -bottom-8 -right-6 w-1/2 aspect-square overflow-hidden gallery-item border-4 border-brand-bg"
            >
              <img
                src={IMAGES[1]}
                alt="Food at Happy Days café"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="gallery-border" aria-hidden="true" />
            </motion.div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1], delay: 0.15 }}
            className="pt-8 lg:pt-0"
          >
            <h2 className="font-display text-brand-text font-light leading-tight mb-8"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
              Where the day<br />
              <em>begins well.</em>
            </h2>

            <p className="font-sans text-brand-text/60 text-base md:text-lg leading-relaxed mb-8 max-w-md">
              {about}
            </p>

            {/* Pull quote */}
            <blockquote className="border-l-2 border-brand-accent pl-6 mb-10">
              <p className="font-display text-brand-accent italic text-xl md:text-2xl font-light leading-snug">
                &ldquo;Cork&rsquo;s favourite morning ritual&rdquo;
              </p>
            </blockquote>

            {/* Small details */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="font-sans text-brand-accent text-xs tracking-[0.3em] uppercase mb-2">Location</p>
                <p className="font-sans text-brand-text/60 text-sm leading-relaxed">Penrose Wharf<br />Victorian Quarter</p>
              </div>
              <div>
                <p className="font-sans text-brand-accent text-xs tracking-[0.3em] uppercase mb-2">Hours</p>
                <p className="font-sans text-brand-text/60 text-sm leading-relaxed">Mon–Fri<br />8am – 3pm</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
