"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";
import { siteContent } from "@/data/content";
import { PulseBeams } from "@/components/ui/pulse-beams";
import { Section, SectionLabel } from "@/components/ui/section";

const beams = [
  {
    path: "M269 220.5H16.5C10.9772 220.5 6.5 224.977 6.5 230.5V398.5",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: { x1: ["0%", "0%", "200%"], x2: ["0%", "0%", "180%"], y1: ["80%", "0%", "0%"], y2: ["100%", "20%", "20%"] },
      transition: { duration: 2.5, repeat: Infinity, repeatType: "loop" as const, ease: "linear", repeatDelay: 1.5, delay: 0 },
    },
    connectionPoints: [{ cx: 6.5, cy: 398.5, r: 5 }, { cx: 269, cy: 220.5, r: 5 }],
  },
  {
    path: "M568 200H841C846.523 200 851 195.523 851 190V40",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: { x1: ["20%", "100%", "100%"], x2: ["0%", "90%", "90%"], y1: ["80%", "80%", "-20%"], y2: ["100%", "100%", "0%"] },
      transition: { duration: 2.5, repeat: Infinity, repeatType: "loop" as const, ease: "linear", repeatDelay: 1.5, delay: 0.8 },
    },
    connectionPoints: [{ cx: 851, cy: 34, r: 5 }, { cx: 568, cy: 200, r: 5 }],
  },
  {
    path: "M380 168V17C380 11.4772 384.477 7 390 7H414",
    gradientConfig: {
      initial: { x1: "-40%", x2: "-10%", y1: "0%", y2: "20%" },
      animate: { x1: ["40%", "0%", "0%"], x2: ["10%", "0%", "0%"], y1: ["0%", "0%", "180%"], y2: ["20%", "20%", "200%"] },
      transition: { duration: 2.5, repeat: Infinity, repeatType: "loop" as const, ease: "linear", repeatDelay: 1.5, delay: 1.6 },
    },
    connectionPoints: [{ cx: 420.5, cy: 6.5, r: 5 }, { cx: 380, cy: 168, r: 5 }],
  },
];

const today = new Date().getDay();
const dayOrder = [1, 2, 3, 4, 5, 6, 0];

export function HoursLocation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="hours" className="bg-stone-950 overflow-hidden">
      <Section className="bg-stone-950" wide>
        <div ref={ref} className="grid md:grid-cols-2 gap-16 lg:gap-28">
          {/* Hours */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9 }}
          >
            <div className="flex items-center gap-3 mb-10">
              <Clock size={15} className="text-amber-500/60" />
              <SectionLabel>Opening Hours</SectionLabel>
            </div>

            {siteContent.hours.map((h, i) => {
              const isToday = dayOrder[i] === today;
              return (
                <motion.div
                  key={h.day}
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.08 + i * 0.05 }}
                  className={`flex justify-between items-center py-4 border-b border-stone-800/30 last:border-0 transition-colors duration-300 group hover:text-amber-200 ${
                    isToday ? "text-amber-300" : "text-stone-500"
                  }`}
                >
                  <span className="font-light text-sm flex items-center gap-2.5">
                    {isToday && (
                      <motion.span
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"
                      />
                    )}
                    {h.day}
                  </span>
                  <span className="font-mono text-sm tabular-nums">
                    {h.open} — {h.close}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15 }}
            id="location"
          >
            <div className="flex items-center gap-3 mb-10">
              <MapPin size={15} className="text-amber-500/60" />
              <SectionLabel>Find Us</SectionLabel>
            </div>

            <p className="font-serif text-3xl md:text-4xl text-amber-100 mb-1 leading-tight">
              48 Oliver Plunkett St
            </p>
            <p className="text-stone-500 font-light mb-8">Centre, Cork, T12 C6KF</p>

            <a
              href="tel:0212413256"
              className="group flex items-center gap-3 text-stone-400 hover:text-amber-300 transition-colors duration-300 mb-10"
            >
              <Phone size={14} className="text-amber-600/50 group-hover:text-amber-500 transition-colors shrink-0" />
              <span className="font-mono text-sm">(021) 241 3256</span>
            </a>

            <a
              href="https://maps.google.com/?q=48+Oliver+Plunkett+St+Cork"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs px-6 py-3 rounded-full border border-amber-700/50 text-amber-200 hover:bg-amber-700/20 transition-all duration-300 tracking-widest uppercase mb-10"
            >
              <MapPin size={12} />
              Open in Maps
            </a>

            <div className="rounded-2xl overflow-hidden border border-stone-800/40 aspect-video">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2461.123!2d-8.4713!3d51.8979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4844900af0c99d85%3A0x9648b7a5a2e19b7f!2s48+Oliver+Plunkett+St%2C+Centre%2C+Cork!5e0!3m2!1sen!2sie!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Dulce Bun House location"
              />
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Pulse beams sign-off */}
      <PulseBeams
        beams={beams}
        gradientColors={{ start: "#d4a574", middle: "#c8773a", end: "#6b3a1f" }}
        baseColor="#2a1a0e"
        accentColor="#6b3a1f"
        className="bg-[#0a0604] h-64 md:h-80"
      >
        <div className="text-center px-6">
          <p className="font-serif text-3xl md:text-4xl text-amber-100 mb-2">See you soon.</p>
          <p className="text-stone-500 text-sm font-light">Oliver Plunkett St, Cork</p>
        </div>
      </PulseBeams>
    </section>
  );
}
