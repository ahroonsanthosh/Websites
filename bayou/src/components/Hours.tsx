"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import RiverDivider from "./RiverDivider";

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
      className="flex items-center justify-between py-5 border-b border-[var(--line-light)] group"
      initial={{ opacity: 0, x: -16 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.07, duration: 0.45 }}
    >
      <span className="font-[var(--font-display)] italic font-black text-xl md:text-2xl text-[var(--ink)] group-hover:text-[var(--rust)] transition-colors">
        {entry.day}
      </span>
      {isOpen ? (
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[var(--brass)] animate-pulse" />
          <span className="font-[var(--font-sans)] text-sm font-medium text-[var(--ink)]">
            {formatTime(entry.open)} – {formatTime(entry.close)}
          </span>
        </div>
      ) : (
        <span className="font-[var(--font-sans)] text-sm text-[var(--ink)]/40 italic">Closed</span>
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
    <section id="location" className="bg-[var(--cream)] grain" aria-labelledby="hours-heading">
      <div className="px-8 md:px-16 lg:px-24 max-w-7xl mx-auto pt-28 md:pt-40 pb-32 md:pb-44">
        <p className="label-engrave text-[var(--rust)] mb-6">VI — The Tides</p>
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          {/* Hours column */}
          <div>
            <h2
              ref={headingRef}
              id="hours-heading"
              className="font-[var(--font-display)] italic font-black text-[clamp(2.5rem,6vw,4.5rem)] text-[var(--ink)] mb-10 leading-[0.92]"
              style={{ letterSpacing: "-0.025em" }}
            >
              When we&apos;re<br />open
            </h2>
            <div>
              {data.hours.map((entry, i) => (
                <DayRow key={entry.day} entry={entry} index={i} />
              ))}
            </div>
          </div>

          {/* Map + contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col gap-8"
          >
            <motion.a
              href="https://maps.google.com/?q=8+MacCurtain+Street+Cork"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative overflow-hidden rounded-2xl border border-[var(--line-light)] bg-[var(--parchment)] h-56"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              aria-label="View on Google Maps"
            >
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <motion.div
                  className="seal w-14 h-14 flex items-center justify-center bg-[var(--ink)] text-[var(--brass)] text-xl"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                >
                  ◎
                </motion.div>
                <p className="font-[var(--font-display)] italic font-black text-lg text-[var(--ink)]">
                  View on Google Maps
                </p>
                <p className="label-engrave text-[var(--ink)]/50">8 MacCurtain Street, Cork</p>
              </div>
            </motion.a>

            <div className="space-y-6">
              <div>
                <p className="label-engrave text-[var(--ink)]/45 mb-2">Address</p>
                <p className="font-[var(--font-sans)] text-base text-[var(--ink)]">{data.site.address}</p>
              </div>
              <div>
                <p className="label-engrave text-[var(--ink)]/45 mb-2">Phone</p>
                <a
                  href={`tel:${data.site.phone.replace(/\D/g, "")}`}
                  className="font-[var(--font-sans)] text-base text-[var(--ink)] hover:text-[var(--rust)] transition-colors"
                >
                  {data.site.phone}
                </a>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=8+MacCurtain+Street+Cork"
              target="_blank"
              rel="noopener noreferrer"
              className="pill pill-ink self-start font-[var(--font-sans)]"
            >
              Get Directions →
            </a>
          </motion.div>
        </div>
      </div>

      <RiverDivider from="var(--cream)" to="var(--ink)" />
    </section>
  );
}
