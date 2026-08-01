'use client'

import { motion } from 'framer-motion'

interface Props {
  captions?: string[]
}

const IMAGES = [
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGkP3GEjEMW7i3H2CdcolNFylU9-r19TBx5_nmpjhjo6Ofckd8ujvfIMt06-zVvV6j1wlkNSXCjWUEVB3g0WaqfB6brNfW9oePHBBlUGbOamXCtCmYsTTBvTwAmtgJmu-LTBBC801IR81J0=s1360-w1360-h1020-rw', caption: 'Morning light at the wharf', span: 'col-span-2 row-span-2' },
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFAQwBjNw1JPHaHvMx6VJmlDSPBYv2ihCFH1q52cOqtJ3KuOSlmdWUaJSP7L1sxT6o-jfyHZ3WhxjK1RFaB6ZRVKXGqkF6wsgqlVpq6ol9bi2KSK5-m9mGZ7ismDiAxD5Etuh-FaPOB3ozx=s1360-w1360-h1020-rw', caption: 'Fresh from the kitchen', span: '' },
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAF5EL_a_CK9V6t92OHt8Gbn-3m_HsPuUgkvjHOhNw2B4L5We9bZpJIWd-JvXpFKvt_7hQeJCzVt8nl73ww-dvZVYJO6LhRaomz9lIfjLnzN3vcwlU2Cji0hCjLQUIJqMr-Bszzc00-UnvI7=s1360-w1360-h1020-rw', caption: 'The space', span: '' },
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFaQ7So7jHLXYK4zQAiQrhlSk17tQ-xApPtWKaAEcLkEniSrlCEJl6qq675jjAK92N56e8rQ7YR_VbD_p_HEvpcG-z9rw5gH9ufKzDzaPAqGed3dJo-SM-xUbg-gaRE8yOi_S_at_x9OM4=s1360-w1360-h1020-rw', caption: 'Details that matter', span: 'col-span-2' },
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAEa8CAwsCHwvGmrWa76Hyv51HvoaE8DKbYGNy6S9b9rO8cCkAGtX_tjbsicbTMlnaaUXJOLDUK4GN-HJtJ7kRzOaWwAjmuj_rgrmqYxrYJjI1yvjYPL2NJl69dDouR1tRdyoGhcIgjh9dU=s1360-w1360-h1020-rw', caption: 'Start the day right', span: '' },
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGY1VIcQWQyVI9EpaAgNYLM2WNp5982lAV01gqbq7bY9plRgOrQmRucPnXEQF3_br0nFTJpgibhagYQ1g-0bRA_jUKMxitnHd-bdRQ94HdCHCmW8DP-YMYIbQQHVyqD2JaNuwQObtjyTWU=s1360-w1360-h1020-rw', caption: 'Good food, simply made', span: '' },
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAHUWxCz-3l76ngXTcOoYt52a5GeCIv2dFaJ2vpmBKAt1EY-BiEH41ghWXVOJHlkp5BzhUI4LXgKtJg-T7Fg5DhwK5irc37Rd6HLd8Gg6OhW9uggWQO35TClpSLLbMJBIq1Rk2WA56alaIVE=s1360-w1360-h1020-rw', caption: "Cork's favourite corner", span: '' },
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAG-f6zCJfd2JTumNQozK3uT-PA8XjKoeeVSCNcsXFTYOFmRvHRhBsqAmD5NyDRwPNrd3PwM-pEOx9HfwkzMjbuzLh_7WX7l77fTHRI6TVl9WE1a5bWQctLHv1GYLF4WHVa4IvlF_JK5LB-B=s1360-w1360-h1020-rw', caption: 'Every morning, without fail', span: '' },
]

export default function Gallery({ captions: _captions }: Props) {
  return (
    <section id="gallery" className="py-20 md:py-32 bg-brand-bg" aria-label="Gallery">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">

        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="tag tag-green mb-4 block w-fit">The Space</span>
            <h2
              className="font-display font-bold text-brand-text leading-tight"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)' }}
            >
              A corner worth<br />
              <span className="text-brand-accent italic">coming back to.</span>
            </h2>
          </div>
        </div>

        {/* Mobile: simple 2-col grid */}
        <div className="grid grid-cols-2 gap-2 sm:hidden">
          {IMAGES.map(({ src, caption }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
              className={`gallery-item rounded-xl overflow-hidden ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}
            >
              <img src={src} alt={caption} className="w-full h-full object-cover" loading="lazy" />
              <div className="gallery-caption">
                <p className="font-sans text-white/90 text-xs font-medium">{caption}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop: editorial mosaic */}
        <div className="hidden sm:grid grid-cols-3 auto-rows-[220px] gap-3">
          {IMAGES.map(({ src, caption, span }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
              className={`gallery-item rounded-2xl overflow-hidden ${span}`}
            >
              <img src={src} alt={caption} className="w-full h-full object-cover" loading="lazy" />
              <div className="gallery-caption">
                <p className="font-sans text-white/90 text-xs font-semibold tracking-wide">{caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
