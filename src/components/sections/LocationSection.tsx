"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { MapPin, Clock, ExternalLink } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

interface LocationContent {
  name: string;
  address_line1: string;
  address_line2: string;
  google_maps_url: string;
  map_query?: string;
  hours: Record<string, { open: string; close: string; closed: boolean }>;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** Parse a "12:00 PM" / "8:00 PM" style string into minutes since midnight. */
function parseTime(t: string): number | null {
  const m = t.trim().match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const pm = m[3].toLowerCase() === "pm";
  if (h === 12) h = 0;
  if (pm) h += 12;
  return h * 60 + min;
}

interface OpenStatus {
  open: boolean;
  message: string;
}

/** Current weekday + minutes-since-midnight in Cork (Europe/Dublin). */
function nowInCork(): { weekday: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-IE", {
    timeZone: "Europe/Dublin",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekday = get("weekday");
  let hour = parseInt(get("hour"), 10);
  if (hour === 24) hour = 0;
  const minute = parseInt(get("minute"), 10);
  return { weekday, minutes: hour * 60 + minute };
}

function computeStatus(
  hours: LocationContent["hours"],
  todayName: string,
  nowMin: number
): OpenStatus {
  const today = hours[todayName];

  if (today && !today.closed) {
    const o = parseTime(today.open);
    const c = parseTime(today.close);
    if (o !== null && c !== null && nowMin >= o && nowMin < c) {
      return { open: true, message: `Open now · Closes at ${today.close}` };
    }
    if (o !== null && nowMin < o) {
      return { open: false, message: `Closed · Opens today at ${today.open}` };
    }
  }

  // Find the next day that's open.
  const idx = DAYS.indexOf(todayName);
  for (let i = 1; i <= 7; i++) {
    const d = DAYS[(idx + i) % 7];
    const h = hours[d];
    if (h && !h.closed) {
      const label = i === 1 ? "tomorrow" : d;
      return { open: false, message: `Closed · Opens ${label} at ${h.open}` };
    }
  }
  return { open: false, message: "Closed" };
}

export default function LocationSection({ content }: { content: LocationContent }) {
  // Computed on the client (after mount) in Cork time to avoid SSR/timezone
  // mismatch — so "Open now" reflects the shop's actual local hours.
  const [today, setToday] = useState<string | null>(null);
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const tick = () => {
      const { weekday, minutes } = nowInCork();
      setToday(weekday);
      setStatus(computeStatus(content.hours, weekday, minutes));
    };
    tick();
    const id = setInterval(tick, 60_000); // keep fresh across the hour
    return () => clearInterval(id);
  }, [content.hours]);

  const query = content.map_query || `${content.address_line1}, ${content.address_line2}`;
  // Keyless Google Maps embed — no API key required.
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;

  // Depth parallax for the map reveal.
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const mapScaleRaw = useTransform(scrollYProgress, [0.1, 0.55], [1.18, 1]);
  const mapClip = useTransform(scrollYProgress, [0.1, 0.5], [28, 0]);
  const mapClipPath = useTransform(mapClip, (v) => `inset(${v}% ${v}% ${v}% ${v}% round 24px)`);
  const mapScale = useSpring(mapScaleRaw, { stiffness: 120, damping: 40, mass: 0.5 });

  return (
    <section ref={sectionRef} className="relative py-32 bg-[#1A1A1A] overflow-hidden" id="location">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-px" style={{ background: "#00F5C4" }} />
              <span className="text-xs font-sans tracking-[0.3em] uppercase font-medium" style={{ color: "#00F5C4" }}>
                Find Us
              </span>
            </motion.div>

            <div className="overflow-hidden mb-2">
              <motion.h2
                initial={{ y: "110%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-[clamp(2.5rem,5vw,5rem)] font-black text-white leading-none"
              >
                We&apos;re inside
              </motion.h2>
            </div>
            <div className="overflow-hidden mb-8">
              <motion.h2
                initial={{ y: "110%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-[clamp(2.5rem,5vw,5rem)] font-black italic leading-none text-gradient"
              >
                Marina Market.
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-3 mb-8"
            >
              <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#00F5C4" }} />
              <div>
                <p className="text-white font-sans font-medium">{content.address_line1}</p>
                <p className="text-white/50 font-sans text-sm">{content.address_line2}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <MagneticButton href={content.google_maps_url} variant="primary" className="gap-2">
                Get Directions
                <ExternalLink className="w-4 h-4" />
              </MagneticButton>
            </motion.div>
          </div>

          {/* Right: hours card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="glass-dark rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-orange-500" />
              <span className="text-white font-display font-bold text-lg">Opening Hours</span>
            </div>

            <div className="space-y-3">
              {DAYS.map((day, i) => {
                const hours = content.hours[day];
                const isToday = day === today;
                return (
                  <motion.div
                    key={day}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className={`flex justify-between items-center py-2.5 border-b border-white/5 last:border-0 ${
                      isToday ? "" : "text-white/60"
                    }`}
                  >
                    <span className="font-sans text-sm font-medium" style={isToday ? { color: "#AAFF00" } : {}}>
                      {day}
                      {isToday && (
                        <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest" style={{ background: "rgba(170,255,0,0.15)", color: "#AAFF00", border: "1px solid rgba(170,255,0,0.35)" }}>
                          Today
                        </span>
                      )}
                    </span>
                    <span className="font-sans text-sm">
                      {hours.closed ? "Closed" : `${hours.open} – ${hours.close}`}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    !status ? "bg-white/30" : status.open ? "bg-green-400 animate-pulse" : "bg-red-400"
                  }`}
                />
                <span
                  className={`font-sans text-sm font-medium ${
                    !status ? "text-white/40" : status.open ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {status ? status.message : "Open daily · 12pm – 8pm"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Photo strip — fills the gap between info and map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 rounded-3xl overflow-hidden h-64 relative group"
        >
          <img
            src="/uploads/photo-chef-counter.png"
            alt="Hansum team at work"
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            style={{ filter: "brightness(0.75) saturate(1.1)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center px-6 md:px-10">
            <div>
              <p className="font-condensed text-white text-[clamp(2rem,5vw,3.5rem)] leading-none">Crafted with care.</p>
              <p className="font-sans text-white/60 text-sm mt-2">Every day. Inside Marina Market.</p>
            </div>
          </div>
        </motion.div>

        {/* Map — depth reveal: scales down + un-clips as you scroll into it */}
        <motion.div
          style={{ scale: mapScale, clipPath: mapClipPath }}
          className="mt-16 rounded-3xl overflow-hidden h-72 lg:h-96 relative border border-white/10 group will-change-transform"
        >
          {/* Real embedded Google Map (keyless) */}
          <iframe
            src={mapSrc}
            title={`Map showing ${content.name} at ${query}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 w-full h-full grayscale-[0.3] contrast-[1.05] transition-all duration-500 group-hover:grayscale-0"
            style={{ border: 0, filter: "saturate(1.1)" }}
            allowFullScreen
          />

          {/* Floating location pill overlay */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <div className="glass-dark rounded-full pl-3 pr-4 py-2 flex items-center gap-2 shadow-lg">
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <MapPin className="w-4 h-4 text-orange-500" />
              </motion.span>
              <span className="text-white font-sans text-xs font-medium">{content.name} · Marina Market</span>
            </div>
          </div>

          {/* Open-in-Maps button */}
          <a
            href={content.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 z-10 glass-dark rounded-full px-4 py-2 flex items-center gap-1.5 text-white text-xs font-sans font-medium hover:text-orange-400 transition-colors shadow-lg"
          >
            Open in Google Maps
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
