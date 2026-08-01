'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { SiteContent } from '@/types/content';

function RevealText({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        initial={{ y: '110%' }}
        animate={inView ? { y: '0%' } : {}}
        transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function About({ content }: { content: SiteContent }) {
  const { about } = content;
  const imageRef = useRef(null);
  const imageInView = useInView(imageRef, { once: true, margin: '-5%' });
  const quoteRef = useRef(null);
  const quoteInView = useInView(quoteRef, { once: true, margin: '-5%' });

  return (
    <section id="about" className="bg-cream-100 py-28 md:py-36 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <RevealText>
          <p className="text-xs font-medium uppercase tracking-widest text-coffee-400 mb-12">
            — Our Story
          </p>
        </RevealText>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start">
          {/* Image */}
          <motion.div
            ref={imageRef}
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            animate={imageInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative overflow-hidden rounded-2xl aspect-[4/5]">
              <img
                src={about.image}
                alt="LOKA Coffee Shop"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.onerror = null;
                  t.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80';
                }}
              />
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/20 to-transparent" />
            </div>

            {/* Floating accent badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={imageInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-5 -right-5 bg-coffee-300 text-cream-50 rounded-2xl px-5 py-4 shadow-lg"
            >
              <p className="font-display text-2xl font-bold leading-none">Open</p>
              <p className="text-xs mt-1 font-medium opacity-80">Mon – Sat</p>
              <p className="text-xs font-medium opacity-80">9am – 3pm</p>
            </motion.div>
          </motion.div>

          {/* Text */}
          <div className="flex flex-col justify-center gap-6 pt-6 md:pt-16">
            <RevealText>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-coffee-900 leading-tight">
                {about.heading}
              </h2>
            </RevealText>

            <RevealText delay={0.1}>
              <p className="text-coffee-700/70 leading-relaxed text-base md:text-lg">
                {about.body1}
              </p>
            </RevealText>

            <RevealText delay={0.2}>
              <p className="text-coffee-700/60 leading-relaxed text-base">
                {about.body2}
              </p>
            </RevealText>

            {/* Quote */}
            <motion.blockquote
              ref={quoteRef}
              className="mt-4 border-l-2 border-coffee-300 pl-6"
              initial={{ opacity: 0, x: 20 }}
              animate={quoteInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-italic text-xl italic text-coffee-500 leading-relaxed">
                "{about.quote}"
              </p>
            </motion.blockquote>

            {/* Divider dots */}
            <motion.div
              className="flex gap-2 mt-2"
              initial={{ opacity: 0 }}
              animate={quoteInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-1 w-1 rounded-full bg-coffee-300" />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
