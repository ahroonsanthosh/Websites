'use client'

import { motion } from 'framer-motion'
import { MenuItem } from '@/lib/content'

interface Props {
  breakfast: MenuItem[]
  lunch: MenuItem[]
  drinks: MenuItem[]
}

function CategorySection({
  title,
  items,
  delay = 0,
}: {
  title: string
  items: MenuItem[]
  delay?: number
}) {
  return (
    <div>
      <motion.h3
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1], delay }}
        className="font-sans text-brand-accent text-xs tracking-[0.4em] uppercase mb-8"
      >
        {title}
      </motion.h3>

      <div className="space-y-0">
        {items.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: delay + i * 0.05 }}
            className="menu-item-row group"
          >
            <div className="flex items-center justify-between py-4 px-1 cursor-default">
              <span className="font-display text-brand-text text-lg md:text-xl font-light group-hover:text-brand-text transition-colors duration-200">
                {item.name}
              </span>
              <span className="menu-price font-sans text-sm tracking-wide ml-4 shrink-0">
                {item.price}
              </span>
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: delay + i * 0.06 + 0.1 }}
              className="h-px bg-brand-border origin-left"
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function MenuSection({ breakfast, lunch, drinks }: Props) {
  return (
    <section id="menu" className="py-32 md:py-40 bg-brand-surface" aria-label="Menu">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="flex items-center gap-4 mb-16">
          <span className="font-sans text-brand-accent text-xs tracking-[0.4em] uppercase">02</span>
          <div className="h-px bg-brand-border" style={{ width: '60px' }} />
          <span className="font-sans text-brand-text/40 text-xs tracking-[0.3em] uppercase">What We Serve</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="font-display text-brand-text font-light leading-tight mb-20"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
        >
          Good food.<br />
          <em>Simple as that.</em>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
          <div className="space-y-16">
            <CategorySection title="Breakfast — until noon" items={breakfast} delay={0} />
            <CategorySection title="Drinks" items={drinks} delay={0.1} />
          </div>
          <div>
            <CategorySection title="Lunch" items={lunch} delay={0.05} />
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 font-sans text-brand-text/30 text-xs tracking-[0.2em] uppercase"
        >
          Menu changes seasonally · All items subject to availability
        </motion.p>
      </div>
    </section>
  )
}
