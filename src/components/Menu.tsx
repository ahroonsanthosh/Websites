"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import RiverDivider from "./RiverDivider";

interface MenuItem {
  name: string;
  price: string;
  v?: boolean;
}

interface MenuGroup {
  name: string;
  note?: string;
  items: MenuItem[];
}

interface MenuSection {
  label: string;
  note?: string;
  items: MenuItem[];
  groups?: MenuGroup[];
}

interface MenuData {
  menu: {
    heading: string;
    subheading: string;
    sections: MenuSection[];
  };
}

function ItemRow({ item }: { item: MenuItem }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5 border-b border-[var(--line-light)] last:border-0">
      <span className="font-[var(--font-sans)] text-sm text-[var(--ink)] leading-snug">
        {item.name}
        {item.v && (
          <span className="ml-1.5 text-[10px] text-[var(--rust)] font-semibold tracking-wide uppercase">v</span>
        )}
      </span>
      <span className="font-[var(--font-sans)] text-sm text-[var(--ink)]/70 whitespace-nowrap tabular-nums">
        {item.price}
      </span>
    </div>
  );
}

function SectionPanel({ section, index, isInView }: { section: MenuSection; index: number; isInView: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="border border-[var(--line-light)] rounded-2xl bg-[var(--parchment)] overflow-hidden"
    >
      <button
        className="w-full flex items-center justify-between p-6 md:p-8 text-left group"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="flex flex-col gap-1">
          <p className="label-engrave text-[var(--rust)]">{String(index + 1).padStart(2, "0")}</p>
          <h3
            className="font-[var(--font-display)] italic font-black text-2xl md:text-3xl text-[var(--ink)]"
            style={{ letterSpacing: "-0.015em" }}
          >
            {section.label}
          </h3>
          {section.note && (
            <p className="font-[var(--font-sans)] text-xs text-[var(--ink)]/50 tracking-wide">{section.note}</p>
          )}
        </div>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="w-8 h-8 rounded-full border border-[var(--brass)] flex items-center justify-center text-[var(--brass)] text-lg flex-shrink-0"
        >
          +
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-8 pb-6 md:pb-8 border-t border-[var(--line-light)]">
              <div className="pt-4">
                {section.items.map((item, i) => (
                  <ItemRow key={i} item={item} />
                ))}
              </div>

              {section.groups?.map((group, gi) => (
                <div key={gi} className="mt-6">
                  <div className="mb-3">
                    <p className="font-[var(--font-sans)] font-semibold text-sm text-[var(--ink)] uppercase tracking-widest">
                      {group.name}
                    </p>
                    {group.note && (
                      <p className="font-[var(--font-sans)] text-xs text-[var(--ink)]/50 mt-0.5">{group.note}</p>
                    )}
                  </div>
                  {group.items.map((item, i) => (
                    <ItemRow key={i} item={item} />
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Menu({ data }: { data: MenuData }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section
      id="menu"
      ref={ref}
      className="bg-[var(--cream)] grain"
      aria-labelledby="menu-heading"
    >
      <div className="px-8 md:px-16 lg:px-24 max-w-7xl mx-auto pt-28 md:pt-40 pb-32 md:pb-44">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12 md:mb-16 border-b border-[var(--line-light)] pb-8"
        >
          <p className="label-engrave text-[var(--rust)] mb-5">IV — What&apos;s on the Table</p>
          <h2
            id="menu-heading"
            className="font-[var(--font-display)] italic font-black text-[clamp(3rem,9vw,7.5rem)] leading-[0.88] text-[var(--ink)]"
            style={{ letterSpacing: "-0.025em" }}
          >
            {data.menu.heading}
          </h2>
        </motion.div>

        <div className="space-y-4 md:space-y-5">
          {data.menu.sections.map((section, i) => (
            <SectionPanel key={i} section={section} index={i} isInView={isInView} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="font-[var(--font-sans)] text-xs text-[var(--ink)]/40 tracking-wide mt-8"
        >
          Please ask a member of staff re allergens. (v) vegetarian.
        </motion.p>
      </div>

      <RiverDivider from="var(--cream)" to="var(--parchment)" flip />
    </section>
  );
}
