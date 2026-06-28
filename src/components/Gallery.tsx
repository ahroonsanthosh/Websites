'use client'

import { motion } from 'framer-motion'

const IMAGES = [
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGkP3GEjEMW7i3H2CdcolNFylU9-r19TBx5_nmpjhjo6Ofckd8ujvfIMt06-zVvV6j1wlkNSXCjWUEVB3g0WaqfB6brNfW9oePHBBlUGbOamXCtCmYsTTBvTwAmtgJmu-LTBBC801IR81J0=s1360-w1360-h1020-rw', caption: 'Morning light at the wharf', aspect: 'aspect-[4/5]' },
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFAQwBjNw1JPHaHvMx6VJmlDSPBYv2ihCFH1q52cOqtJ3KuOSlmdWUaJSP7L1sxT6o-jfyHZ3WhxjK1RFaB6ZRVKXGqkF6wsgqlVpq6ol9bi2KSK5-m9mGZ7ismDiAxD5Etuh-FaPOB3ozx=s1360-w1360-h1020-rw', caption: 'Fresh from the kitchen', aspect: 'aspect-square' },
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAF5EL_a_CK9V6t92OHt8Gbn-3m_HsPuUgkvjHOhNw2B4L5We9bZpJIWd-JvXpFKvt_7hQeJCzVt8nl73ww-dvZVYJO6LhRaomz9lIfjLnzN3vcwlU2Cji0hCjLQUIJqMr-Bszzc00-UnvI7=s1360-w1360-h1020-rw', caption: 'The space, as it is', aspect: 'aspect-[4/3]' },
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFaQ7So7jHLXYK4zQAiQrhlSk17tQ-xApPtWKaAEcLkEniSrlCEJl6qq675jjAK92N56e8rQ7YR_VbD_p_HEvpcG-z9rw5gH9ufKzDzaPAqGed3dJo-SM-xUbg-gaRE8yOi_S_at_x9OM4=s1360-w1360-h1020-rw', caption: 'Details that matter', aspect: 'aspect-[3/4]' },
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAEa8CAwsCHwvGmrWa76Hyv51HvoaE8DKbYGNy6S9b9rO8cCkAGtX_tjbsicbTMlnaaUXJOLDUK4GN-HJtJ7kRzOaWwAjmuj_rgrmqYxrYJjI1yvjYPL2NJl69dDouR1tRdyoGhcIgjh9dU=s1360-w1360-h1020-rw', caption: 'Start the day right', aspect: 'aspect-square' },
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGY1VIcQWQyVI9EpaAgNYLM2WNp5982lAV01gqbq7bY9plRgOrQmRucPnXEQF3_br0nFTJpgibhagYQ1g-0bRA_jUKMxitnHd-bdRQ94HdCHCmW8DP-YMYIbQQHVyqD2JaNuwQObtjyTWU=s1360-w1360-h1020-rw', caption: 'Good food, simply made', aspect: 'aspect-[4/5]' },
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAHUWxCz-3l76ngXTcOoYt52a5GeCIv2dFaJ2vpmBKAt1EY-BiEH41ghWXVOJHlkp5BzhUI4LXgKtJg-T7Fg5DhwK5irc37Rd6HLd8Gg6OhW9uggWQO35TClpSLLbMJBIq1Rk2WA56alaIVE=s1360-w1360-h1020-rw', caption: "Cork's favourite corner", aspect: 'aspect-[4/3]' },
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAG-f6zCJfd2JTumNQozK3uT-PA8XjKoeeVSCNcsXFTYOFmRvHRhBsqAmD5NyDRwPNrd3PwM-pEOx9HfwkzMjbuzLh_7WX7l77fTHRI6TVl9WE1a5bWQctLHv1GYLF4WHVa4IvlF_JK5LB-B=s1360-w1360-h1020-rw', caption: 'Every morning, without fail', aspect: 'aspect-square' },
]

export default function Gallery() {
  return (
    <section id="gallery" className="py-32 md:py-40 bg-brand-bg" aria-label="Gallery">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="flex items-center gap-4 mb-16">
          <span className="font-sans text-brand-accent text-xs tracking-[0.4em] uppercase">03</span>
          <div className="h-px bg-brand-border" style={{ width: '60px' }} />
          <span className="font-sans text-brand-text/40 text-xs tracking-[0.3em] uppercase">The Space</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="font-display text-brand-text font-light leading-tight mb-20"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
        >
          A corner worth<br />
          <em>coming back to.</em>
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {IMAGES.map(({ src, caption, aspect }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: (i % 3) * 0.1 }}
              className={`gallery-item ${aspect}`}
            >
              <img
                src={src}
                alt={caption}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="gallery-border" aria-hidden="true" />
              <div className="gallery-caption">
                <p className="font-sans text-brand-text/80 text-xs tracking-[0.2em] uppercase">
                  {caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
