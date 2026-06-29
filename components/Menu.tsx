"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

type Category = "breakfast" | "lunch" | "drinks";

const menuData: Record<Category, { name: string; desc: string; price: string; tag?: string }[]> = {
  breakfast: [
    { name: "The Full NorthSouth", desc: "Two eggs your way, back rashers, sausage, black & white pudding, grilled tomato, mushrooms, sourdough toast", price: "€14.50", tag: "House favourite" },
    { name: "Eggs Benedict", desc: "Poached eggs, smoked Irish salmon, hollandaise, toasted brioche muffin", price: "€13.00" },
    { name: "Avocado & Poached Eggs", desc: "Smashed avocado, two poached eggs, dukkah, chilli flakes, sourdough", price: "€12.50", tag: "Vegetarian" },
    { name: "French Toast", desc: "Brioche, maple syrup, fresh strawberries, whipped cream, powdered sugar", price: "€11.50" },
    { name: "Smoked Salmon Bagel", desc: "Cream cheese, capers, red onion, lemon, toasted sesame bagel", price: "€12.00" },
    { name: "Kerry Porridge", desc: "Oat porridge with Kerrygold butter, honey, mixed seeds, seasonal fruit", price: "€7.50", tag: "Vegan option" },
  ],
  lunch: [
    { name: "Kerry Lamb Sandwich", desc: "Slow-roast Kerry lamb, wholegrain mustard, rocket, red onion jam, toasted focaccia", price: "€13.50", tag: "Local produce" },
    { name: "BLT Club", desc: "Smoked back bacon, gem lettuce, vine tomato, mayo, toasted white sourdough", price: "€12.00" },
    { name: "Soup of the Day", desc: "Homemade seasonal soup, crusty brown bread, Kerrygold butter", price: "€8.00" },
    { name: "Caesar Salad", desc: "Baby cos, crispy pancetta, parmesan shavings, anchovies, house dressing, croutons", price: "€12.50" },
    { name: "Grilled Chicken Wrap", desc: "Marinated chicken, roasted peppers, guacamole, sour cream, flour tortilla", price: "€12.00" },
    { name: "Quiche of the Day", desc: "Homemade quiche, side salad, house pickles", price: "€11.00" },
  ],
  drinks: [
    { name: "Flat White", desc: "Double ristretto, micro-foam steamed milk", price: "€3.80" },
    { name: "Specialty Latte", desc: "Ask about today's seasonal flavour", price: "€4.20", tag: "Ask us" },
    { name: "Cold Brew", desc: "12-hour slow-steeped, served over ice", price: "€4.50" },
    { name: "Kerry Gold Tea", desc: "Loose-leaf blend, served with brown bread scone", price: "€3.50" },
    { name: "Fresh Juice", desc: "Orange, apple, or the daily blend", price: "€4.00" },
    { name: "House Smoothie", desc: "Banana, oat milk, almond butter, honey, maca", price: "€6.00", tag: "Energising" },
  ],
};

const categories: { key: Category; label: string }[] = [
  { key: "breakfast", label: "Breakfast" },
  { key: "lunch", label: "Lunch" },
  { key: "drinks", label: "Drinks" },
];

function MenuItem({ name, desc, price, tag, index }: { name: string; desc: string; price: string; tag?: string; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group flex items-start justify-between py-5 border-b border-[#1a1510]/10 hover:border-[#c8864a]/30 transition-all duration-300 menu-item-hover cursor-default"
    >
      <div className="flex-1 pr-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-display text-lg text-[#1a1510] group-hover:text-[#c8864a] transition-colors duration-300">
            {name}
          </span>
          {tag && (
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#c8864a] border border-[#c8864a]/40 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          )}
        </div>
        <p className="text-[#9e9890] text-sm mt-1 leading-relaxed max-w-lg">{desc}</p>
      </div>
      <span className="font-display text-lg text-[#1a1510] shrink-0 mt-0.5">{price}</span>
    </motion.div>
  );
}

export default function Menu() {
  const [active, setActive] = useState<Category>("breakfast");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <section id="menu" className="py-24 md:py-32 bg-[#f8f5f0]">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        {/* Heading */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 md:mb-20"
        >
          <span className="text-[#c8864a] text-xs tracking-[0.3em] uppercase">What we serve</span>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-[#1a1510] mt-3 leading-tight">
            Our Menu
          </h2>
          <div className="h-px w-16 bg-[#c8864a] mt-6" />
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-12 border-b border-[#1a1510]/10">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              className={`relative px-6 py-3 text-sm tracking-[0.15em] uppercase transition-all duration-300 ${
                active === cat.key
                  ? "text-[#1a1510]"
                  : "text-[#9e9890] hover:text-[#1a1510]"
              }`}
            >
              {cat.label}
              {active === cat.key && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c8864a]"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Items */}
        <div>
          {menuData[active].map((item, i) => (
            <MenuItem key={item.name} {...item} index={i} />
          ))}
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-10 text-[#9e9890] text-sm italic text-center"
        >
          Serving breakfast from 8am · Lunch from 12pm · All day until 4pm<br />
          Please inform us of any allergies or dietary requirements
        </motion.p>
      </div>
    </section>
  );
}
