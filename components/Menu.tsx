"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type MenuItem = { name: string; price: string; desc: string; featured?: boolean };
type Tab = { id: string; label: string; items: MenuItem[] };

const tabs: Tab[] = [
  {
    id: "hot", label: "Hot Drinks",
    items: [
      { name: "Espresso",                 price: "€2.80", desc: "Rich single shot, dark roast"                          },
      { name: "Americano",                price: "€3.20", desc: "Espresso lengthened with hot water"                   },
      { name: "Latte",                    price: "€3.80", desc: "Silky steamed milk, gentle espresso"                  },
      { name: "Cappuccino",               price: "€3.80", desc: "Equal parts espresso, milk & foam"                    },
      { name: "Signature Hot Chocolate",  price: "€4.50", desc: "Our house blend, velvety & indulgent", featured: true },
      { name: "Drinking Chocolate",       price: "€5.50", desc: "70% dark melted chocolate — the real thing", featured: true },
      { name: "Flat White",               price: "€3.80", desc: "Double ristretto, microfoamed milk"                   },
      { name: "Mocha",                    price: "€4.20", desc: "Espresso meets our handmade chocolate sauce"          },
    ],
  },
  {
    id: "cold", label: "Cold Drinks",
    items: [
      { name: "Iced Latte",        price: "€4.20", desc: "Cold milk, espresso over ice"                              },
      { name: "Iced Chocolate",    price: "€4.80", desc: "Chilled handmade chocolate, topped with cream", featured: true },
      { name: "Cold Brew",         price: "€3.80", desc: "12-hour steeped, smooth & bold"                            },
      { name: "Iced Matcha Latte", price: "€4.50", desc: "Ceremonial grade matcha, oat milk"                         },
      { name: "Fresh Lemonade",    price: "€3.50", desc: "House-made, lightly sparkling"                             },
    ],
  },
  {
    id: "food", label: "Food",
    items: [
      { name: "Freshly Baked Scone", price: "€4.50",   desc: "Served warm with whipped cream & jam",              featured: true },
      { name: "Chocolate Brownie",   price: "€3.80",   desc: "Dense, fudgy — made with 70% dark chocolate",       featured: true },
      { name: "Slice of Cake",       price: "€5.50",   desc: "Rotating seasonal selection, ask at the counter"                   },
      { name: "Butter Croissant",    price: "€3.20",   desc: "Flaky, golden, baked fresh daily"                                  },
      { name: "Whole Cakes",         price: "From €35", desc: "Available to order — please enquire in advance"                   },
      { name: "Sourdough Toast",     price: "€3.50",   desc: "With butter & house jam or smashed avocado"                       },
    ],
  },
  {
    id: "chocolate", label: "Chocolates",
    items: [
      { name: "Truffles — Box of 6",  price: "€9.50",    desc: "Dark, milk & white — seasonal flavours",     featured: true },
      { name: "Truffles — Box of 12", price: "€17.50",   desc: "Perfect for gifting",                        featured: true },
      { name: "Single-Origin Bars",   price: "€4.80",    desc: "Ecuador, Madagascar & more — rotating origin"               },
      { name: "Gift Boxes",           price: "From €15", desc: "Curated selection, beautifully packaged"                     },
      { name: "Seasonal Collection",  price: "In store", desc: "Limited-edition flavours, made in small batches"             },
      { name: "Chocolate Bark",       price: "€5.50",    desc: "Topped with nuts, fruit & sea salt"                         },
    ],
  },
];

export function Menu() {
  const [active, setActive] = useState("hot");
  const current = tabs.find(t => t.id === active)!;

  return (
    <section id="menu" className="py-20 md:py-32 lg:py-40 bg-[var(--dark-2)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-10 md:mb-14">
          <p className="text-[11px] tracking-[0.28em] uppercase text-[var(--amber)] font-medium mb-3">
            What We Serve
          </p>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl lg:text-[3.4rem] leading-tight text-[var(--cream)]">
            The Menu
          </h2>
        </motion.div>

        {/* Tabs — centered on desktop, scrollable on mobile */}
        <div className="flex justify-center mb-10 md:mb-12">
          <div className="flex border-b border-white/10 overflow-x-auto w-full max-w-xl"
            style={{ scrollbarWidth: "none" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActive(t.id)}
                className={`flex-1 flex-shrink-0 min-w-[80px] px-4 md:px-6 py-3.5 text-[10px] md:text-[11px] font-['Inter'] font-medium tracking-[0.14em] uppercase border-b-2 -mb-px transition-all duration-200 text-center ${
                  active === t.id
                    ? "text-[var(--amber)] border-[var(--amber)]"
                    : "text-[var(--grey)] border-transparent hover:text-[var(--cream-2)]"
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu items — clean list style */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-2xl mx-auto">

            <div className="flex flex-col divide-y divide-white/[0.07]">
              {current.items.map((it, i) => (
                <motion.div key={it.name}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  className="flex items-baseline justify-between gap-6 py-5 group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="font-['Playfair_Display'] text-[16px] md:text-[17px] text-[var(--cream)] leading-snug">
                        {it.name}
                      </span>
                      {it.featured && (
                        <span className="text-[8px] font-['Inter'] font-semibold tracking-[0.15em] uppercase text-[var(--amber)] border border-[var(--amber)]/40 px-1.5 py-0.5 leading-none">
                          House
                        </span>
                      )}
                    </div>
                    <p className="text-[14px] md:text-[15px] text-[var(--grey)] leading-relaxed"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>
                      {it.desc}
                    </p>
                  </div>
                  <span className="font-['Inter'] text-[13px] font-medium text-[var(--amber)] whitespace-nowrap tracking-wide flex-shrink-0">
                    {it.price}
                  </span>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-[11px] font-['Inter'] tracking-[0.18em] uppercase text-[var(--grey)] mt-10 pb-2 border-t border-white/[0.07] pt-6">
              Ask at the counter for daily specials
            </p>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
