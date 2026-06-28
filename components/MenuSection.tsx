"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const menuImages = [
  "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGsC1U768HPBVx22uu4452h271mfnhXhYGG3ti7hNGp1NOOMXcT1hH29QAu_WZ7VNaOJ_KJkfrOqv4d1MVgBAEHfTZxh_ZVYwn1sKKg5M0blln3UqV5ocmyvyAjyVKPpVDR9kjx3g=s1360-w1360-h1020-rw",
  "https://lh3.googleusercontent.com/gps-cs-s/APNQkAG-GAFehIMPkV4hQoHj3JjCheUbcb79pkzNi6bGmTDXFKsKdfAu1dv5DxwF_pZhkHwBuIn-qiuwrYH1llx3bi3Yf0Hnv-oJXW-gB66Dc2xXX6b8RbODM68zL24hY7A364BnTl5J=s1360-w1360-h1020-rw",
]

const menuItems = [
  { category: "Coffee", items: ["Espresso", "Flat White", "Cortado", "Pour Over", "Cold Brew"] },
  { category: "Food", items: ["Avocado Toast", "Granola Bowl", "Eggs Benedict", "Sourdough & Butter", "Seasonal Soup"] },
  { category: "Pastry", items: ["Croissant", "Pain au Chocolat", "Banana Bread", "Scone", "Carrot Cake"] },
]

export default function MenuSection() {
  const [activeImg, setActiveImg] = useState(0)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <section id="menu" className="bg-[#1A0F0A] py-28 md:py-40 px-6 md:px-16 lg:px-32 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-20 flex-wrap gap-8">
          <div>
            <motion.p
              className="text-[#C8A882]/60 text-xs tracking-[0.4em] uppercase mb-4 font-light"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              What We Serve
            </motion.p>
            <motion.h2
              className="text-white font-light leading-none"
              style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.02em' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              Our<br /><em className="italic text-[#C8A882]">Menu</em>
            </motion.h2>
          </div>

          {/* Live menu image switcher */}
          <div className="flex gap-2">
            {menuImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-8 h-1 transition-all duration-300 ${i === activeImg ? 'bg-[#C8A882]' : 'bg-white/20'}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          {/* Menu items */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-10">
            {menuItems.map((group, gi) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: gi * 0.1 }}
              >
                <p className="text-[#C8A882] text-xs tracking-[0.4em] uppercase mb-6 font-light border-b border-white/10 pb-4">
                  {group.category}
                </p>
                <ul className="space-y-4">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="relative"
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <motion.span
                        className="text-white/70 text-sm font-light cursor-default block transition-colors duration-200"
                        animate={{ color: hoveredItem === item ? '#C8A882' : 'rgba(255,255,255,0.7)' }}
                      >
                        {item}
                        {hoveredItem === item && (
                          <motion.span
                            className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#C8A882]"
                            layoutId="menu-dot"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Menu image */}
          <div className="relative h-[400px] md:h-auto overflow-hidden rounded-sm">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={menuImages[activeImg]}
                alt="Menu item"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A]/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white/60 text-xs tracking-[0.3em] uppercase font-light">
                Seasonal · Fresh · Daily
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
