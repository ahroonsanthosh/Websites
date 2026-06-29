"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";
import { siteContent } from "@/data/content";
import { PulseBeams } from "@/components/ui/pulse-beams";

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

const today = new Date().getDay(); // 0=Sun, 1=Mon...
const dayOrder = [1, 2, 3, 4, 5, 6, 0];

export function HoursLocation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="hours" ref={ref} className="bg-stone-950 overflow-hidden">
      {/* Hours */}
      <div className="py-28 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Clock size={16} className="text-amber-500/60" />
            <span className="text-amber-500/60 text-xs uppercase tracking-[0.4em] font-light">
              Opening Hours
            </span>
          </div>
          <div className="space-y-0">
            {siteContent.hours.map((h, i) => {
              const dayIndex = dayOrder[i];
              const isToday = dayIndex === today;
              return (
                <motion.div
                  key={h.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className={`flex justify-between py-3.5 border-b border-stone-800/30 last:border-0 ${
                    isToday ? "text-amber-300" : "text-stone-500"
                  } hover:text-amber-200 transition-colors duration-300 group`}
                >
                  <span className="font-light text-sm flex items-center gap-2">
                    {isToday && (
                      <motion.span
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"
                      />
                    )}
                    {h.day}
                  </span>
                  <span className="font-mono text-sm">
                    {h.open} — {h.close}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          id="location"
        >
          <div className="flex items-center gap-3 mb-8">
            <MapPin size={16} className="text-amber-500/60" />
            <span className="text-amber-500/60 text-xs uppercase tracking-[0.4em] font-light">
              Find Us
            </span>
          </div>
          <p className="font-serif text-2xl text-amber-100 mb-2 leading-snug">
            48 Oliver Plunkett St
          </p>
          <p className="text-stone-500 mb-8 font-light">Centre, Cork, T12 C6KF</p>

          <a
            href="tel:0212413256"
            className="group flex items-center gap-3 text-stone-400 hover:text-amber-300 transition-colors duration-300 mb-8"
          >
            <Phone size={14} className="text-amber-600/50 group-hover:text-amber-500 transition-colors" />
            <span className="font-mono text-sm">(021) 241 3256</span>
          </a>

          <a
            href="https://maps.google.com/?q=48+Oliver+Plunkett+St+Cork"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs px-6 py-3 rounded-full border border-amber-700/50 text-amber-200 hover:bg-amber-700/20 transition-all duration-300 tracking-widest uppercase"
          >
            <MapPin size={12} />
            Open in Maps
          </a>

          {/* Simple map embed placeholder */}
          <div className="mt-8 rounded-2xl overflow-hidden border border-stone-800/40 aspect-video">
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

      {/* Pulse beams connection section */}
      <PulseBeams
        beams={beams}
        gradientColors={{ start: "#d4a574", middle: "#c8773a", end: "#6b3a1f" }}
        baseColor="#2a1a0e"
        accentColor="#6b3a1f"
        className="bg-[#0a0604] h-64 md:h-80"
      >
        <div className="text-center">
          <p className="font-serif text-2xl md:text-3xl text-amber-100 mb-2">
            See you soon.
          </p>
          <p className="text-stone-500 text-sm font-light">Oliver Plunkett St, Cork</p>
        </div>
      </PulseBeams>
    </section>
  );
}
