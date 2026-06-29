'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import type { SiteContent, MenuCategory } from '@/types/content';

function MenuItemRow({ name, price, description, index }: { name: string; price: string; description?: string; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5%' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex items-baseline justify-between py-4 border-b border-coffee-200/50 last:border-0"
    >
      {/* Hover line */}
      <motion.div
        className="absolute left-0 bottom-0 h-px bg-coffee-300"
        initial={{ width: 0 }}
        animate={{ width: hovered ? '100%' : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="flex-1 pr-4">
        <span className="text-coffee-900 font-medium text-sm md:text-base transition-colors group-hover:text-coffee-700">
          {name}
        </span>
        {description && (
          <p className="text-coffee-500/60 text-xs mt-0.5 font-light">{description}</p>
        )}
      </div>

      <motion.span
        className="font-display text-coffee-400 text-sm md:text-base font-medium tabular-nums"
        animate={{ x: hovered ? -4 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {price}
      </motion.span>
    </motion.div>
  );
}

export default function Menu({ content }: { content: SiteContent }) {
  const { menu } = content;
  const [active, setActive] = useState<string>(menu.categories[0]?.id ?? '');
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true });

  const activeCategory: MenuCategory | undefined = menu.categories.find((c) => c.id === active);

  return (
    <section id="menu" className="bg-cream-200/40 py-28 md:py-36 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <div ref={headingRef} className="mb-16 text-center">
          <div className="overflow-hidden mb-3">
            <motion.p
              className="text-xs font-medium uppercase tracking-widest text-coffee-400"
              initial={{ y: '110%' }}
              animate={headingInView ? { y: '0%' } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              — What We Serve
            </motion.p>
          </div>
          <div className="overflow-hidden">
            <motion.h2
              className="font-display text-4xl md:text-6xl font-bold text-coffee-900"
              initial={{ y: '110%' }}
              animate={headingInView ? { y: '0%' } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Our Menu
            </motion.h2>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-12" role="tablist">
          {menu.categories.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={active === cat.id}
              onClick={() => setActive(cat.id)}
              className={`relative px-5 py-2.5 text-xs font-medium uppercase tracking-widest rounded-full transition-all duration-300 ${
                active === cat.id
                  ? 'text-cream-50 bg-coffee-700'
                  : 'text-coffee-600 hover:text-coffee-900 bg-cream-200 hover:bg-cream-300'
              }`}
            >
              {cat.name}
              {active === cat.id && (
                <motion.span
                  layoutId="pill"
                  className="absolute inset-0 bg-coffee-700 rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Items */}
        <AnimatePresence mode="wait">
          {activeCategory && (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-16"
            >
              {activeCategory.items.map((item, i) => (
                <MenuItemRow
                  key={item.id}
                  name={item.name}
                  price={item.price}
                  description={item.description}
                  index={i}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Note */}
        <motion.p
          className="text-center text-xs text-coffee-400/60 mt-12 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          All items subject to availability · Allergen info available on request
        </motion.p>
      </div>
    </section>
  );
}
