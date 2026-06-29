"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import content from "@/lib/content";
import { BouncyWords } from "@/components/ui/bouncy-text";
import { LampContainer } from "@/components/ui/lamp";

const { hours, business } = content;

export default function Location() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const today = new Date().getDay();

  return (
    <section id="location" ref={ref} className="overflow-hidden">
      <LampContainer>
        <div className="max-w-7xl mx-auto px-5 md:px-10 pb-14 md:pb-24 w-full">

          <div className="text-center mb-14">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="font-accent text-[11px] tracking-[0.3em] uppercase text-[#EE1C1C] mb-4"
            >
              Come Find Us
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display italic text-3xl md:text-6xl font-bold text-[#FDF6EB]"
            >
              <BouncyWords text="We're in the Market." />
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-start">

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl overflow-hidden border border-[#FDF6EB]/10 h-[260px] sm:h-[320px] md:h-[440px] relative"
            >
              <iframe
                src={business.mapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) saturate(0.7)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${business.name} — ${business.address.line2}`}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-10 md:space-y-12 py-2"
            >
              {/* Address */}
              <div>
                <p className="font-accent text-[10px] tracking-[0.3em] uppercase text-[#EE1C1C] mb-4">Address</p>
                <p className="font-display italic text-[#FDF6EB] text-2xl font-semibold leading-snug mb-3">{business.name}</p>
                <p className="text-[#FDF6EB]/50 text-sm leading-loose">
                  {business.address.line1}<br />
                  {business.address.line2}<br />
                  {business.address.city}, {business.address.eircode}
                </p>
                <motion.a
                  href={business.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-5 text-[#EE1C1C] font-accent text-[10px] tracking-[0.25em] uppercase hover:opacity-70 transition-opacity"
                  whileHover={{ x: 3, transition: { type: "spring", stiffness: 400 } }}
                >
                  Get Directions
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </motion.a>
              </div>

              <div className="h-px bg-[#FDF6EB]/8" />

              {/* Hours */}
              <div>
                <p className="font-accent text-[10px] tracking-[0.3em] uppercase text-[#EE1C1C] mb-6">Opening Hours</p>
                <div className="space-y-3">
                  {hours.map((h, i) => {
                    const dayIndex = i === 6 ? 0 : i + 1;
                    const isToday = dayIndex === today;
                    return (
                      <div
                        key={h.day}
                        className={`flex justify-between items-baseline ${isToday ? "text-[#FDF6EB]" : "text-[#FDF6EB]/35"}`}
                      >
                        <div className="flex items-center gap-2.5">
                          {isToday && <span className="w-1.5 h-1.5 rounded-full bg-[#EE1C1C] shrink-0" />}
                          <span className={`font-accent text-[11px] tracking-widest uppercase ${!isToday ? "ml-4" : ""} ${isToday ? "font-semibold" : ""}`}>{h.day}</span>
                        </div>
                        <span className={`text-sm tabular-nums ${h.closed ? "opacity-30" : ""}`}>{h.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-[#FDF6EB]/8" />

              {/* Social */}
              <motion.a
                href={`https://www.instagram.com/${business.instagram}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
                whileHover={{ x: 4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#EE1C1C] shrink-0">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                <span className="font-accent text-[11px] tracking-[0.25em] uppercase text-[#FDF6EB]/50 group-hover:text-[#EE1C1C] transition-colors">@{business.instagram}</span>
              </motion.a>
            </motion.div>
          </div>
        </div>
      </LampContainer>
    </section>
  );
}
