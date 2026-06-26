"use client";

import { motion } from "framer-motion";
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

export default function LocationSection({ content }: { content: LocationContent }) {
  const today = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  const query = content.map_query || `${content.address_line1}, ${content.address_line2}`;
  // Keyless Google Maps embed — no API key required.
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;

  return (
    <section className="relative py-32 bg-[#1A1A1A] overflow-hidden" id="location">
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
              <div className="w-8 h-px bg-orange-500" />
              <span className="text-orange-500 text-xs font-sans tracking-[0.3em] uppercase font-medium">
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
                className="font-display text-[clamp(2.5rem,5vw,5rem)] font-black italic text-orange-500 leading-none"
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
              <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
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
                      isToday ? "text-orange-400" : "text-white/60"
                    }`}
                  >
                    <span className={`font-sans text-sm font-medium ${isToday ? "text-orange-400" : ""}`}>
                      {day}
                      {isToday && (
                        <span className="ml-2 text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30 uppercase tracking-widest">
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
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 font-sans text-sm font-medium">Open Now</span>
                <span className="text-white/30 font-sans text-sm">· Closes at 8:00 PM</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Map placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 rounded-3xl overflow-hidden h-72 lg:h-96 relative border border-white/10 group"
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
