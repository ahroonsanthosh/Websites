'use client'

import { motion } from 'framer-motion'
import { MenuItem } from '@/lib/content'

interface Props {
  breakfast: MenuItem[]
  lunch: MenuItem[]
  drinks: MenuItem[]
}

function MenuCategory({ title, items, delay = 0, tag = 'tag-orange' }: {
  title: string
  items: MenuItem[]
  delay?: number
  tag?: string
}) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="mb-6"
      >
        <span className={`tag ${tag}`}>{title}</span>
      </motion.div>

      <div>
        {items.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: delay + i * 0.05 }}
            className="menu-row flex items-center justify-between py-3.5 px-3 -mx-3 rounded-lg cursor-default"
          >
            <span className="font-sans text-brand-text font-medium text-sm sm:text-base">
              {item.name}
            </span>
            <span className="menu-price font-sans text-brand-muted font-semibold text-sm ml-4 shrink-0 tabular-nums">
              {item.price}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function MenuSection({ breakfast, lunch, drinks }: Props) {
  return (
    <section id="menu" className="py-20 md:py-32 bg-brand-surface" aria-label="Menu">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="tag tag-orange mb-4 block w-fit">What We Serve</span>
            <h2
              className="font-display font-bold text-brand-text leading-tight"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)' }}
            >
              Good food.<br />
              <span className="text-brand-accent italic">Simple as that.</span>
            </h2>
          </div>
          <p className="font-sans text-brand-muted text-xs tracking-wide max-w-[200px] sm:text-right pb-1">
            Menu changes seasonally.<br />Subject to availability.
          </p>
        </div>

        {/* Menu grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="bg-brand-bg rounded-2xl p-6 sm:p-8">
            <MenuCategory title="Breakfast" items={breakfast} delay={0} tag="tag-orange" />
          </div>
          <div className="bg-brand-bg rounded-2xl p-6 sm:p-8">
            <MenuCategory title="Lunch" items={lunch} delay={0.05} tag="tag-green" />
          </div>
          <div className="bg-brand-bg rounded-2xl p-6 sm:p-8 sm:col-span-2 lg:col-span-1">
            <MenuCategory title="Drinks" items={drinks} delay={0.1} tag="tag-orange" />
          </div>
        </div>
      </div>
    </section>
  )
}
