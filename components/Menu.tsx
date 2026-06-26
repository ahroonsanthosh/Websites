"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type MenuItem = { name: string; price: string; desc: string; featured?: boolean };
type Tab = { id: string; label: string; items: MenuItem[] };

const tabs: Tab[] = [
  {
    id: "hot", label: "Hot Drinks",
    items: [
      { name: "Espresso", price: "€2.80", desc: "Rich single shot, dark roast" },
      { name: "Americano", price: "€3.20", desc: "Espresso lengthened with hot water" },
      { name: "Latte", price: "€3.80", desc: "Silky steamed milk, gentle espresso" },
      { name: "Cappuccino", price: "€3.80", desc: "Equal parts espresso, milk & foam" },
      { name: "Signature Hot Chocolate", price: "€4.50", desc: "Our house blend, velvety & indulgent", featured: true },
      { name: "Drinking Chocolate", price: "€5.50", desc: "70% dark melted chocolate — the real thing", featured: true },
      { name: "Flat White", price: "€3.80", desc: "Double ristretto, microfoamed milk" },
      { name: "Mocha", price: "€4.20", desc: "Espresso meets our handmade chocolate sauce" },
    ],
  },
  {
    id: "cold", label: "Cold Drinks",
    items: [
      { name: "Iced Latte", price: "€4.20", desc: "Cold milk, espresso over ice" },
      { name: "Iced Chocolate", price: "€4.80", desc: "Chilled handmade chocolate, topped with cream", featured: true },
      { name: "Cold Brew", price: "€3.80", desc: "12-hour steeped, smooth & bold" },
      { name: "Iced Matcha Latte", price: "€4.50", desc: "Ceremonial grade matcha, oat milk" },
      { name: "Fresh Lemonade", price: "€3.50", desc: "House-made, lightly sparkling" },
    ],
  },
  {
    id: "food", label: "Food",
    items: [
      { name: "Freshly Baked Scone", price: "€4.50", desc: "Served warm with whipped cream & jam", featured: true },
      { name: "Chocolate Brownie", price: "€3.80", desc: "Dense, fudgy — made with 70% dark chocolate", featured: true },
      { name: "Slice of Cake", price: "€5.50", desc: "Rotating seasonal selection, ask at the counter" },
      { name: "Butter Croissant", price: "€3.20", desc: "Flaky, golden, baked fresh daily" },
      { name: "Whole Cakes", price: "From €35", desc: "Available to order — please enquire in advance" },
      { name: "Sourdough Toast", price: "€3.50", desc: "With butter & house jam or smashed avocado" },
    ],
  },
  {
    id: "chocolate", label: "Chocolates",
    items: [
      { name: "Handmade Truffles · Box of 6", price: "€9.50", desc: "Dark, milk & white — seasonal flavours", featured: true },
      { name: "Handmade Truffles · Box of 12", price: "€17.50", desc: "Perfect for gifting", featured: true },
      { name: "Single-Origin Bars", price: "€4.80", desc: "Ecuador, Madagascar & more — rotating origin" },
      { name: "Gift Boxes", price: "From €15", desc: "Curated selection, beautifully packaged" },
      { name: "Seasonal Collection", price: "Ask in store", desc: "Limited-edition flavours, made in small batches" },
      { name: "Chocolate Bark", price: "€5.50", desc: "Topped with nuts, fruit & sea salt" },
    ],
  },
];

export function Menu() {
  const [active, setActive] = useState("hot");
  const current = tabs.find(t => t.id === active)!;

  return (
    <section id="menu" className="py-[clamp(80px,12vw,160px)] bg-[var(--dark-2)]">
      <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
        <div className="text-center mb-16">
          <p className="text-[11px] tracking-[0.28em] uppercase text-[var(--amber)] font-medium mb-4">What We Serve</p>
          <h2 className="font-['Playfair_Display'] text-[clamp(2.4rem,6vw,5rem)] leading-[1.1] text-[var(--cream)]">
            The Menu
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-14 border-b border-white/10 overflow-x-auto scrollbar-none">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`px-7 py-3.5 text-[11px] font-medium tracking-[0.14em] uppercase whitespace-nowrap border-b-2 -mb-px transition-colors duration-300 ${
                active === t.id
                  ? "text-[var(--amber)] border-[var(--amber)]"
                  : "text-[var(--grey)] border-transparent hover:text-[var(--cream)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.06]"
          >
            {current.items.map(item => (
              <div
                key={item.name}
                className={`p-7 md:p-8 transition-colors duration-300 ${
                  item.featured
                    ? "bg-[rgba(200,134,10,0.06)] hover:bg-[rgba(200,134,10,0.1)]"
                    : "bg-[var(--dark-2)] hover:bg-[var(--dark-3)]"
                }`}
              >
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-['Playfair_Display'] text-[1.05rem] text-[var(--cream)]">{item.name}</span>
                  <span className="flex-1 border-b border-dotted border-white/20 mb-1 min-w-4" />
                  <span className="font-['Playfair_Display'] text-[1rem] font-semibold text-[var(--amber)] whitespace-nowrap">{item.price}</span>
                </div>
                <p className="text-[13px] text-[var(--grey)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
