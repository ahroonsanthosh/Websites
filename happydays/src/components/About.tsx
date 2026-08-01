'use client'

import { motion } from 'framer-motion'

interface Props {
  about: string
}

const IMAGES = [
  'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFAQwBjNw1JPHaHvMx6VJmlDSPBYv2ihCFH1q52cOqtJ3KuOSlmdWUaJSP7L1sxT6o-jfyHZ3WhxjK1RFaB6ZRVKXGqkF6wsgqlVpq6ol9bi2KSK5-m9mGZ7ismDiAxD5Etuh-FaPOB3ozx=s1360-w1360-h1020-rw',
  'https://lh3.googleusercontent.com/gps-cs-s/APNQkAF5EL_a_CK9V6t92OHt8Gbn-3m_HsPuUgkvjHOhNw2B4L5We9bZpJIWd-JvXpFKvt_7hQeJCzVt8nl73ww-dvZVYJO6LhRaomz9lIfjLnzN3vcwlU2Cji0hCjLQUIJqMr-Bszzc00-UnvI7=s1360-w1360-h1020-rw',
]

export default function About({ about }: Props) {
  return (
    <section id="about" className="py-20 md:py-32 bg-brand-bg" aria-label="About">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">

        {/* Label */}
        <div className="flex items-center gap-3 mb-10">
          <span className="tag tag-orange">Our Story</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="col-span-2 aspect-video overflow-hidden rounded-2xl gallery-item">
              <img
                src={IMAGES[0]}
                alt="Inside Happy Days café"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-xl gallery-item">
              <img
                src={IMAGES[1]}
                alt="Food at Happy Days"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-xl gallery-item">
              <img
                src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAFaQ7So7jHLXYK4zQAiQrhlSk17tQ-xApPtWKaAEcLkEniSrlCEJl6qq675jjAK92N56e8rQ7YR_VbD_p_HEvpcG-z9rw5gH9ufKzDzaPAqGed3dJo-SM-xUbg-gaRE8yOi_S_at_x9OM4=s1360-w1360-h1020-rw"
                alt="Details at Happy Days"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.15 }}
            className="pt-8 lg:pt-0"
          >
            <h2
              className="font-display font-bold text-brand-text leading-tight mb-6"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)' }}
            >
              Where the day<br />
              <span className="text-brand-accent italic">begins well.</span>
            </h2>

            <p className="font-sans text-brand-muted text-base sm:text-lg leading-relaxed mb-8">
              {about}
            </p>

            <div className="grid grid-cols-2 gap-5 border-t border-brand-border pt-8">
              <div>
                <p className="tag tag-green mb-3">Location</p>
                <p className="font-sans text-brand-text text-sm leading-relaxed font-medium">
                  Penrose Wharf<br />Victorian Quarter<br />Cork
                </p>
              </div>
              <div>
                <p className="tag tag-orange mb-3">Hours</p>
                <p className="font-sans text-brand-text text-sm leading-relaxed font-medium">
                  Mon–Fri<br />8am – 3pm<br />
                  <span className="text-brand-muted text-xs">Sat–Sun closed</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
