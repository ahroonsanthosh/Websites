"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

type Category = "Rotisserie" | "Wraps & Rolls" | "Sides" | "Drinks";

interface MenuItem {
  name: string;
  description: string;
  price: string;
  tag?: string;
}

const menu: Record<Category, MenuItem[]> = {
  Rotisserie: [
    { name: "Whole Chicken", description: "Full fire-roasted bird, crispy skin, juicy meat. Serves 3–4.", price: "€14.00", tag: "Best Value" },
    { name: "Half Chicken", description: "Half bird with leg and breast. Perfect for one.", price: "€8.00" },
    { name: "Quarter — Leg", description: "Juicy thigh and drumstick. Our most popular cut.", price: "€5.50", tag: "Fan Fave" },
    { name: "Quarter — Breast", description: "Lean breast with crispy skin and rich seasoning.", price: "€6.00" },
  ],
  "Wraps & Rolls": [
    { name: "Uncle's Classic Wrap", description: "Rotisserie chicken, house slaw, smoky mayo, iceberg.", price: "€10.00", tag: "Signature" },
    { name: "BBQ Chicken Roll", description: "Crusty roll loaded with BBQ chicken and pickled red onion.", price: "€8.50" },
    { name: "Caesar Chicken Wrap", description: "Romaine, parmesan, house Caesar dressing, crispy chicken.", price: "€9.50" },
    { name: "Veggie Market Wrap", description: "Roasted market veg, hummus, feta, fresh leaves.", price: "€8.00" },
  ],
  Sides: [
    { name: "Roast Potatoes", description: "Crispy gold potatoes seasoned with rosemary and sea salt.", price: "€3.50" },
    { name: "Coleslaw", description: "House-made creamy coleslaw. Classic.", price: "€2.50" },
    { name: "Side Salad", description: "Fresh leaves, cherry tomato, cucumber, lemon dressing.", price: "€3.00" },
    { name: "Stuffing", description: "Herb-packed homemade stuffing. Pure comfort.", price: "€2.00", tag: "Must Try" },
    { name: "Gravy", description: "Rich chicken gravy from the spit drippings.", price: "€1.50" },
  ],
  Drinks: [
    { name: "Fresh Lemonade", description: "Hand-squeezed, lightly sparkling.", price: "€3.50" },
    { name: "Cork Craft Cola", description: "Local craft cola, ice cold.", price: "€2.50" },
    { name: "Still / Sparkling Water", description: "500ml bottle.", price: "€1.50" },
    { name: "Organic Juice", description: "Apple or orange, pressed daily.", price: "€3.00" },
  ],
};

const categories: Category[] = ["Rotisserie", "Wraps & Rolls", "Sides", "Drinks"];

export default function Menu() {
  const [active, setActive] = useState<Category>("Rotisserie");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="menu" ref={ref} className="bg-[#1A0C05] py-16 md:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-10">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="font-accent text-[11px] tracking-[0.3em] uppercase text-[#E8622A] mb-4"
          >
            What We Serve
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display italic text-4xl md:text-6xl font-bold text-[#FDF6EB]"
          >
            The Menu
          </motion.h2>
        </div>

        {/* Category tabs — horizontal scroll on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 -mx-5 md:mx-0"
        >
          <div className="flex overflow-x-auto scrollbar-hide gap-3 px-5 md:px-0 md:justify-center pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`relative shrink-0 px-6 py-2.5 rounded-full font-accent text-[11px] tracking-[0.15em] uppercase transition-all duration-300 ${
                  active === cat
                    ? "bg-[#E8622A] text-white"
                    : "bg-[#FDF6EB]/10 text-[#FDF6EB]/60 hover:bg-[#FDF6EB]/20 hover:text-[#FDF6EB]"
                }`}
              >
                {cat}
                {active === cat && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 rounded-full bg-[#E8622A] -z-10"
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Menu items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="grid sm:grid-cols-2 gap-4 md:gap-5"
          >
            {menu[active].map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="group relative bg-[#FDF6EB]/5 hover:bg-[#FDF6EB]/10 border border-[#FDF6EB]/10 hover:border-[#E8622A]/40 rounded-2xl p-6 transition-all duration-300"
              >
                {item.tag && (
                  <span className="absolute top-4 right-4 px-2.5 py-1 bg-[#E8622A] text-white font-accent text-[9px] tracking-widest uppercase rounded-full">
                    {item.tag}
                  </span>
                )}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display italic text-[#FDF6EB] text-xl font-semibold mb-1.5">
                      {item.name}
                    </h3>
                    <p className="text-[#FDF6EB]/50 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <span className="font-accent text-[#E8622A] text-lg font-semibold shrink-0 mt-0.5">
                    {item.price}
                  </span>
                </div>
                <div className="mt-4 h-px bg-gradient-to-r from-[#E8622A]/0 via-[#E8622A]/30 to-[#E8622A]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center text-[#FDF6EB]/30 text-xs mt-10 font-accent tracking-wider"
        >
          All prices include VAT · Menu subject to seasonal change · Ask about daily specials
        </motion.p>
      </div>
    </section>
  );
}
