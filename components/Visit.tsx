"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone, Clock } from "lucide-react";

const InstagramIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="5"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

const FacebookIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const hours = [
  { day: "Monday", time: "8am – 4pm" },
  { day: "Tuesday", time: "8am – 4pm" },
  { day: "Wednesday", time: "8am – 4pm" },
  { day: "Thursday", time: "8am – 4pm" },
  { day: "Friday", time: "8am – 4pm" },
  { day: "Saturday", time: "9am – 4pm" },
  { day: "Sunday", time: "Closed" },
];

const today = new Date().getDay(); // 0=Sun, 1=Mon, ...
const dayIndex = [6, 0, 1, 2, 3, 4, 5][today]; // map to our hours array index

function InfoCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5">
      <div className="w-10 h-10 rounded-full bg-[#c8864a]/10 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={16} className="text-[#c8864a]" />
      </div>
      <div>
        <div className="text-xs tracking-[0.2em] uppercase text-[#9e9890] mb-1">{title}</div>
        <div className="text-[#1a1510] leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export default function Visit() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section id="visit" className="py-24 md:py-40 bg-[#1a1510] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <span className="text-[#c8864a] text-xs tracking-[0.3em] uppercase">Come see us</span>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-white mt-3 leading-tight">
            Find Us
          </h2>
          <div className="h-px w-16 bg-[#c8864a] mt-6" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-8"
          >
            <InfoCard icon={MapPin} title="Address">
              <p>12 Russell Street</p>
              <p>Tralee, Co. Kerry</p>
              <p className="text-white/40 text-sm">V92 W265</p>
            </InfoCard>

            <InfoCard icon={Phone} title="Phone">
              <a href="tel:0667171277" className="hover:text-[#c8864a] transition-colors hover-underline">
                (066) 717 1277
              </a>
            </InfoCard>

            <InfoCard icon={Clock} title="Opening Hours">
              <div className="space-y-2 mt-1">
                {hours.map((h, i) => (
                  <div
                    key={h.day}
                    className={`flex justify-between text-sm py-1.5 border-b border-white/5 ${
                      i === dayIndex ? "text-[#c8864a]" : h.time === "Closed" ? "text-white/30" : "text-white/70"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {i === dayIndex && <div className="w-1 h-1 rounded-full bg-[#c8864a] animate-pulse" />}
                      {h.day}
                    </span>
                    <span>{h.time}</span>
                  </div>
                ))}
              </div>
            </InfoCard>

            {/* Socials */}
            <div className="flex gap-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-[#c8864a] hover:border-[#c8864a]/50 transition-all duration-300"
                aria-label="Instagram"
              >
                <InstagramIcon size={15} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-[#c8864a] hover:border-[#c8864a]/50 transition-all duration-300"
                aria-label="Facebook"
              >
                <FacebookIcon size={15} />
              </a>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden aspect-[4/3] md:aspect-auto md:h-full min-h-[320px] border border-white/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2430.4!2d-9.7038!3d52.2673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x485b5c4a6a06ab4f%3A0x0!2s12+Russell+St%2C+Tralee%2C+Co.+Kerry%2C+V92+W265!5e0!3m2!1sen!2sie!4v1000000000000!5m2!1sen!2sie"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(0.7) contrast(1.1)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="NorthSouth Café location"
              />
            </div>

            {/* Pin card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="absolute top-4 left-4 bg-[#f8f5f0] text-[#1a1510] rounded-xl px-4 py-3 shadow-lg"
            >
              <div className="font-display text-sm font-semibold">NorthSouth Café</div>
              <div className="text-[#9e9890] text-xs mt-0.5">12 Russell St, Tralee</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
