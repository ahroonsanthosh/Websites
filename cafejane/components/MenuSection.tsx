"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const menuImages = [
  "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGsC1U768HPBVx22uu4452h271mfnhXhYGG3ti7hNGp1NOOMXcT1hH29QAu_WZ7VNaOJ_KJkfrOqv4d1MVgBAEHfTZxh_ZVYwn1sKKg5M0blln3UqV5ocmyvyAjyVKPpVDR9kjx3g=s1360-w1360-h1020-rw",
  "https://lh3.googleusercontent.com/gps-cs-s/APNQkAG-GAFehIMPkV4hQoHj3JjCheUbcb79pkzNi6bGmTDXFKsKdfAu1dv5DxwF_pZhkHwBuIn-qiuwrYH1llx3bi3Yf0Hnv-oJXW-gB66Dc2xXX6b8RbODM68zL24hY7A364BnTl5J=s1360-w1360-h1020-rw",
]

const menuItems = [
  {
    category: "Coffee",
    items: [
      { name: "Espresso", price: "€2.80" },
      { name: "Flat White", price: "€3.60" },
      { name: "Cortado", price: "€3.40" },
      { name: "Pour Over", price: "€4.20" },
      { name: "Cold Brew", price: "€4.50" },
    ],
  },
  {
    category: "Food",
    items: [
      { name: "Avocado Toast", price: "€9.50" },
      { name: "Granola Bowl", price: "€7.50" },
      { name: "Eggs Benedict", price: "€12.00" },
      { name: "Sourdough & Butter", price: "€4.50" },
      { name: "Seasonal Soup", price: "€8.00" },
    ],
  },
  {
    category: "Pastry",
    items: [
      { name: "Croissant", price: "€3.50" },
      { name: "Pain au Chocolat", price: "€3.80" },
      { name: "Banana Bread", price: "€3.50" },
      { name: "Scone", price: "€3.00" },
      { name: "Carrot Cake", price: "€4.50" },
    ],
  },
]

export default function MenuSection() {
  const [activeImg, setActiveImg] = useState(0)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <section id="menu" className="bg-[#1A0F0A] py-20 md:py-36 px-6 md:px-16 lg:px-32 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <motion.p
              className="text-[#C8A882] text-[10px] tracking-[0.45em] uppercase mb-4 font-light"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              What We Serve
            </motion.p>
            <motion.h2
              className="text-white font-light leading-none"
              style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', letterSpacing: '-0.02em' }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Our<br /><em className="italic text-[#C8A882]">Menu</em>
            </motion.h2>
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-white/20 text-[10px] tracking-[0.3em] uppercase mr-2">Gallery</span>
            {menuImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                aria-label={`Show image ${i + 1}`}
                className={`transition-all duration-400 rounded-full ${
                  i === activeImg ? 'w-6 h-1.5 bg-[#C8A882]' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8">
          {/* Menu columns */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {menuItems.map((group, gi) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: gi * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-[#C8A882] text-[10px] tracking-[0.4em] uppercase mb-4 font-light border-b border-white/[0.08] pb-3">
                  {group.category}
                </p>
                <ul className="space-y-0">
                  {group.items.map((item) => {
                    const hovered = hoveredItem === item.name
                    return (
                      <li
                        key={item.name}
                        className="relative flex items-baseline justify-between py-2.5 border-b border-white/[0.05] group cursor-default"
                        onMouseEnter={() => setHoveredItem(item.name)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        {/* Hover fill */}
                        <motion.div
                          className="absolute inset-0 bg-[#C8A882]/[0.05]"
                          initial={false}
                          animate={{ opacity: hovered ? 1 : 0 }}
                          transition={{ duration: 0.2 }}
                        />
                        <motion.span
                          className="text-sm font-light relative z-10 leading-snug"
                          style={{ fontFamily: 'Georgia, serif' }}
                          animate={{ color: hovered ? '#C8A882' : 'rgba(255,255,255,0.80)' }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.name}
                        </motion.span>
                        <motion.span
                          className="text-xs font-light relative z-10 tabular-nums pl-3 flex-shrink-0"
                          animate={{ color: hovered ? '#C8A882' : 'rgba(200,168,130,0.50)' }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.price}
                        </motion.span>
                      </li>
                    )
                  })}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Menu image */}
          <div className="relative h-64 sm:h-80 lg:h-auto overflow-hidden rounded-[2px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={menuImages[activeImg]}
                alt="Menu item"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A]/70 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <p className="text-white/50 text-[10px] tracking-[0.35em] uppercase font-light">
                Seasonal · Fresh · Daily
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
