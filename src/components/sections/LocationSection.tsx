"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, ExternalLink } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

interface LocationContent {
  name: string;
  address_line1: string;
  address_line2: string;
  google_maps_url: string;
  hours: Record<string, { open: string; close: string; closed: boolean }>;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function LocationSection({ content }: { content: LocationContent }) {
  const today = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

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
          className="mt-16 rounded-3xl overflow-hidden h-64 lg:h-80 relative bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-white/5 flex items-center justify-center group cursor-none"
          data-cursor-label="MAP"
        >
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <MapPin className="w-12 h-12 text-orange-500" />
            </motion.div>
            <div className="text-center">
              <p className="text-white font-display font-bold text-lg">Marina Market</p>
              <p className="text-white/40 font-sans text-sm">Cork City, Ireland</p>
            </div>
          </div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDZoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
        </motion.div>
      </div>
    </section>
  );
}
