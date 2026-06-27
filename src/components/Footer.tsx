"use client";

import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0F0F0F] pt-20 pb-10 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, #FF5500, #FF2D6B, #8B5CF6, #00C2FF, #AAFF00, transparent)" }} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-condensed text-5xl tracking-wider mb-4" style={{ background: "linear-gradient(135deg, #FF5500, #FF2D6B, #8B5CF6, #00C2FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>HANSUM</h2>
              <p className="font-sans text-white/40 text-sm leading-relaxed max-w-xs">
                Cork&apos;s finest rotisserie chicken, handcrafted daily inside Marina Market.
                Premium ingredients, patient cooking, zero shortcuts.
              </p>
              <a
                href="https://www.instagram.com/hansumcork"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 text-white/40 hover:text-orange-400 transition-colors duration-200 font-sans text-sm"
              >
                <InstagramIcon className="w-4 h-4" />
                @hansumcork
              </a>
            </motion.div>
          </div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-sans font-semibold text-white text-xs tracking-widest uppercase mb-5">
              Navigate
            </h3>
            <ul className="space-y-3">
              {["Menu", "Gallery", "Find Us", "Reviews"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="font-sans text-white/40 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Hours & Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-sans font-semibold text-white text-xs tracking-widest uppercase mb-5">
              Visit Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#00F5C4" }} />
                <div>
                  <p className="text-white/60 text-sm font-sans">Marina Market</p>
                  <p className="text-white/40 text-xs font-sans">Cork City, Ireland</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#FFD000" }} />
                <div>
                  <p className="text-white/60 text-sm font-sans">Mon–Sun</p>
                  <p className="text-white/40 text-xs font-sans">12:00 PM – 8:00 PM</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-white/20 text-xs">
            © {year} Hansum Rotisserie. All rights reserved.
          </p>
          <p className="font-sans text-white/20 text-xs">
            Inside Marina Market · Cork City · Ireland
          </p>
        </div>
      </div>
    </footer>
  );
}
