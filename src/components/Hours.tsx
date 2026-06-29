"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface HoursEntry {
  day: string;
  status: "open" | "closed";
  open: string;
  close: string;
}

function formatTime(t: string) {
  if (!t) return "";
  const [h] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}${suffix}`;
}

function DayRow({ entry, index }: { entry: HoursEntry; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });
  const isOpen = entry.status === "open";

  return (
    <motion.div
      ref={ref}
      className="flex items-center justify-between py-4 border-b border-[var(--border)] group"
      initial={{ opacity: 0, x: -16 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.06, duration: 0.45 }}
    >
      <span className="font-[var(--font-display)] font-black text-xl text-[var(--charcoal)] group-hover:text-[var(--orange)] transition-colors duration-200">
        {entry.day}
      </span>

      {isOpen ? (
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[var(--sage)] animate-pulse" />
          <span className="font-[var(--font-sans)] text-sm font-medium text-[var(--charcoal)]">
            {formatTime(entry.open)} – {formatTime(entry.close)}
          </span>
        </div>
      ) : (
        <span className="font-[var(--font-sans)] text-sm text-[var(--muted)] italic">Closed</span>
      )}
    </motion.div>
  );
}

interface SiteData {
  hours: HoursEntry[];
  site: { address: string; phone: string };
}

export default function Hours({ data }: { data: SiteData }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(headingRef, { once: true });

  return (
    <section
      id="location"
      className="py-20 md:py-32 bg-[var(--warm-white)]"
      aria-labelledby="hours-heading"
    >
      <div className="px-5 md:px-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Hours column */}
          <div>
            <p className="font-[var(--font-sans)] text-xs font-semibold tracking-widest uppercase text-[var(--orange)] mb-4">
              Opening Hours
            </p>
            <h2
              ref={headingRef}
              id="hours-heading"
              className="font-[var(--font-display)] font-black text-[clamp(2rem,5vw,3.5rem)] text-[var(--charcoal)] mb-8 leading-[1]"
              style={{ letterSpacing: "-0.02em" }}
            >
              When we&apos;re<br />open
            </h2>
            <div>
              {data.hours.map((entry, i) => (
                <DayRow key={entry.day} entry={entry} index={i} />
              ))}
            </div>
          </div>

          {/* Location column */}
          <div className="flex flex-col gap-10">
            <div>
              <p className="font-[var(--font-sans)] text-xs font-semibold tracking-widest uppercase text-[var(--orange)] mb-4">
                Find Us
              </p>

              {/* Map placeholder with bounce pin */}
              <motion.a
                href="https://maps.google.com/?q=8+MacCurtain+Street+Cork"
                target="_blank"
                rel="noopener noreferrer"
                className="block group relative overflow-hidden rounded-2xl bg-[var(--cream)] border border-[var(--border)] h-52 mb-6"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                aria-label="View on Google Maps"
              >
                <div className="w-full h-full flex items-center justify-center flex-col gap-3">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-[var(--orange)] flex items-center justify-center text-white text-xl"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  >
                    ◎
                  </motion.div>
                  <p className="font-[var(--font-display)] font-black text-lg text-[var(--charcoal)]">
                    View on Google Maps
                  </p>
                  <p className="font-[var(--font-sans)] text-sm text-[var(--muted)]">
                    8 MacCurtain Street, Cork
                  </p>
                </div>
                <div className="absolute inset-0 bg-[var(--orange)] opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl" />
              </motion.a>

              {/* Contact info */}
              <div className="space-y-5">
                <div>
                  <p className="font-[var(--font-sans)] text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-1">Address</p>
                  <p className="font-[var(--font-sans)] text-base text-[var(--charcoal)]">{data.site.address}</p>
                </div>
                <div>
                  <p className="font-[var(--font-sans)] text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-1">Phone</p>
                  <a
                    href={`tel:${data.site.phone.replace(/\D/g, "")}`}
                    className="font-[var(--font-sans)] text-base text-[var(--charcoal)] hover:text-[var(--orange)] transition-colors"
                  >
                    {data.site.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Pill CTA */}
            <a
              href="https://maps.google.com/?q=8+MacCurtain+Street+Cork"
              target="_blank"
              rel="noopener noreferrer"
              className="pill pill-solid self-start font-[var(--font-sans)] font-semibold"
            >
              Get Directions →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
