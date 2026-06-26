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

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-8 md:mb-10 overflow-x-auto"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActive(t.id)}
              className={`flex-shrink-0 px-5 md:px-7 py-3.5 text-[11px] font-['Inter'] font-medium tracking-[0.12em] uppercase border-b-2 -mb-px transition-all duration-200 ${
                active === t.id
                  ? "text-[var(--amber)] border-[var(--amber)]"
                  : "text-[var(--grey)] border-transparent hover:text-[var(--cream-2)]"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Menu items */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {current.items.map(it => (
                <div key={it.name}
                  className={`flex items-start gap-4 px-5 py-5 rounded-sm transition-colors duration-200 ${
                    it.featured
                      ? "bg-[rgba(200,134,10,0.08)] hover:bg-[rgba(200,134,10,0.13)]"
                      : "bg-[var(--dark-3)] hover:bg-[rgba(255,255,255,0.03)]"
                  }`}>
                  {/* Text block */}
                  <div className="flex-1 min-w-0">
                    <p className="font-['Playfair_Display'] text-[16px] md:text-[17px] text-[var(--cream)] leading-snug mb-1">
                      {it.name}
                    </p>
                    <p className="text-[14px] md:text-[15px] text-[var(--grey)] leading-relaxed"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>
                      {it.desc}
                    </p>
                  </div>
                  {/* Price — always right-aligned, never wraps */}
                  <span className="font-['Inter'] text-[13px] font-semibold text-[var(--amber)] whitespace-nowrap leading-snug pt-px tracking-wide">
                    {it.price}
                  </span>
                </div>
              ))}
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
