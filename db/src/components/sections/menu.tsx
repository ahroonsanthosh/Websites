"use client";

import { motion } from "framer-motion";
import { MENU } from "@/data/site";

export function Menu() {
  return (
    <section
      id="menu"
      className="border-y-2 border-cocoa bg-paper py-24 sm:py-32"
      aria-label="Menu"
    >
      <div className="mx-auto max-w-6xl px-5">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl font-semibold tracking-tight sm:text-6xl"
        >
          The menu<span className="text-berry">.</span>
        </motion.h2>

        <div className="mt-14 grid gap-16 md:grid-cols-2">
          {MENU.map((cat, ci) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: ci * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <h3 className="font-display text-2xl font-semibold italic text-caramel">
                {cat.category}
              </h3>
              <p className="mt-1 text-sm text-cocoa/60">{cat.blurb}</p>
              <ul className="mt-6 space-y-4">
                {cat.items.map((item) => (
                  <li key={item.name} className="group/row flex items-baseline">
                    <span className="font-medium">
                      {item.name}
                      {item.tag && (
                        <span className="ml-2 inline-block -rotate-2 rounded bg-berry/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-berry transition-transform group-hover/row:rotate-0">
                          {item.tag}
                        </span>
                      )}
                      <span className="block text-sm font-normal text-cocoa/55">
                        {item.desc}
                      </span>
                    </span>
                    <span className="dot-leader" aria-hidden />
                    <span className="font-display font-semibold tabular-nums transition-colors group-hover/row:text-berry">
                      {item.price}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="mt-12 text-center text-xs uppercase tracking-widest text-cocoa/40">
          Menu changes with the seasons — specials on the counter, always.
        </p>
      </div>
    </section>
  );
}
