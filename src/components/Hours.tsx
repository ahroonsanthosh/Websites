"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface HoursEntry {
  day: string;
  status: "open" | "closed";
  open: string;
  close: string;
}

function formatTime(time: string) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return m === 0 ? `${hour}${suffix}` : `${hour}:${m.toString().padStart(2, "0")}${suffix}`;
}

// 21st.dev – Counter / number roll animation
function DayRow({ entry, index }: { entry: HoursEntry; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });
  const isOpen = entry.status === "open";

  return (
    <motion.div
      ref={ref}
      className="group relative flex items-center justify-between py-5 border-b border-[var(--border)] overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Hover bg fill */}
      <motion.div
        className="absolute inset-0 bg-[var(--terracotta)] opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 pointer-events-none"
      />

      {/* Day */}
      <span className="font-[var(--font-serif)] text-xl text-[var(--charcoal)] font-light w-36">
        {entry.day}
      </span>

      {/* Status dot */}
      <motion.span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isOpen ? "bg-[var(--sage)]" : "bg-[var(--muted)] opacity-30"}`}
        animate={isOpen ? { scale: [1, 1.3, 1] } : {}}
        transition={{ repeat: isOpen ? Infinity : 0, duration: 2, delay: index * 0.2 }}
      />

      {/* Hours */}
      <span className="font-[var(--font-sans)] text-sm text-right min-w-[120px]">
        {isOpen ? (
          <span className="text-[var(--charcoal)]">
            {formatTime(entry.open)} – {formatTime(entry.close)}
          </span>
        ) : (
          <span className="text-[var(--muted)] italic font-[var(--font-serif)]">Closed</span>
        )}
      </span>
    </motion.div>
  );
}

interface SiteData {
  hours: HoursEntry[];
  site: {
    address: string;
    phone: string;
    email?: string;
  };
}

export default function Hours({ data }: { data: SiteData }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(headingRef, { once: true });

  return (
    <section
      id="location"
      className="py-28 md:py-40 bg-[var(--warm-white)] px-6 md:px-12 lg:px-24"
      aria-labelledby="hours-heading"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 md:gap-32">
        {/* Hours */}
        <div>
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="separator" />
            <span className="font-[var(--font-sans)] text-[10px] tracking-[0.3em] uppercase text-[var(--terracotta)]">
              Opening Hours
            </span>
          </motion.div>

          <h2
            ref={headingRef}
            id="hours-heading"
            className="font-[var(--font-serif)] text-[clamp(2rem,4vw,3rem)] font-light text-[var(--charcoal)] mb-10 overflow-hidden"
          >
            {["When", "we're", "open"].map((word, i) => (
              <span key={i} className="overflow-hidden inline-block mr-[0.25em]">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={isInView ? { y: "0%" } : {}}
                  transition={{ delay: i * 0.1, duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h2>

          <div>
            {data.hours.map((entry, i) => (
              <DayRow key={entry.day} entry={entry} index={i} />
            ))}
          </div>
        </div>

        {/* Location & info */}
        <div className="flex flex-col justify-start pt-0 md:pt-24">
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="separator" />
            <span className="font-[var(--font-sans)] text-[10px] tracking-[0.3em] uppercase text-[var(--terracotta)]">
              Find Us
            </span>
          </motion.div>

          {/* Map embed placeholder with actual link */}
          <motion.a
            href="https://maps.google.com/?q=8+MacCurtain+Street+Cork"
            target="_blank"
            rel="noopener noreferrer"
            className="block relative overflow-hidden mb-8 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            aria-label="View on Google Maps"
          >
            <div className="w-full h-56 bg-[var(--cream)] flex items-center justify-center border border-[var(--border)] overflow-hidden">
              <div className="text-center">
                <motion.div
                  className="w-10 h-10 rounded-full bg-[var(--terracotta)] flex items-center justify-center mx-auto mb-3"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </motion.div>
                <p className="font-[var(--font-serif)] text-[var(--charcoal)] text-lg">View on Maps</p>
                <p className="font-[var(--font-sans)] text-[var(--muted)] text-xs mt-1">8 MacCurtain Street</p>
              </div>
              <div className="absolute inset-0 bg-[var(--terracotta)] opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            </div>
          </motion.a>

          {/* Contact details */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {[
              {
                label: "Address",
                value: data.site.address,
                href: "https://maps.google.com/?q=8+MacCurtain+Street+Cork",
              },
              {
                label: "Phone",
                value: data.site.phone,
                href: `tel:${data.site.phone.replace(/\D/g, "")}`,
              },
            ].map((item) => (
              <div key={item.label}>
                <p className="font-[var(--font-sans)] text-[9px] tracking-[0.3em] uppercase text-[var(--terracotta)] mb-1">
                  {item.label}
                </p>
                <a
                  href={item.href}
                  className="font-[var(--font-serif)] text-lg text-[var(--charcoal)] hover:text-[var(--terracotta)] transition-colors duration-300 hover-line"
                  target={item.label === "Address" ? "_blank" : undefined}
                  rel={item.label === "Address" ? "noopener noreferrer" : undefined}
                >
                  {item.value}
                </a>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
