"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SiteInfo {
  name: string;
  address: string;
  phone: string;
  tagline: string;
  instagram?: string;
}

export default function Footer({ data }: { data: { site: SiteInfo } }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <footer ref={ref} className="bg-[var(--charcoal)] text-[var(--cream)]" aria-label="Footer">
      {/* Big Bayou text */}
      <div className="overflow-hidden pt-16 px-5 md:px-10 border-b border-[rgba(255,255,255,0.06)]">
        <motion.h2
          className="font-[var(--font-display)] font-black text-[var(--cream)] leading-[0.85] pb-2"
          style={{
            fontSize: "clamp(5rem,22vw,18rem)",
            letterSpacing: "-0.03em",
            opacity: 0.07,
          }}
          initial={{ y: "101%" }}
          animate={isInView ? { y: "0%" } : {}}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          Bayou
        </motion.h2>
      </div>

      {/* Info grid */}
      <div className="px-5 md:px-10 py-14 grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-[rgba(255,255,255,0.06)]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <p className="font-[var(--font-display)] font-black text-3xl mb-3">{data.site.name}</p>
          <p className="font-[var(--font-sans)] text-sm text-[rgba(247,243,235,0.5)] max-w-xs leading-relaxed">
            {data.site.tagline}
          </p>
          {data.site.instagram && (
            <a
              href={data.site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 pill pill-orange text-sm py-2 px-5"
            >
              Instagram ↗
            </a>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
        >
          <p className="font-[var(--font-sans)] text-xs font-semibold tracking-widest uppercase text-[var(--orange)] mb-5">
            Visit
          </p>
          <address className="not-italic font-[var(--font-sans)] text-sm text-[rgba(247,243,235,0.6)] leading-loose">
            {data.site.address.split(",").map((l, i) => (
              <span key={i} className="block">{l.trim()}</span>
            ))}
          </address>
          <a
            href={`tel:${data.site.phone.replace(/\D/g, "")}`}
            className="block mt-4 font-[var(--font-sans)] text-sm text-[var(--cream)] hover:text-[var(--orange)] transition-colors"
          >
            {data.site.phone}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
        >
          <p className="font-[var(--font-sans)] text-xs font-semibold tracking-widest uppercase text-[var(--orange)] mb-5">
            Hours
          </p>
          <div className="font-[var(--font-sans)] text-sm text-[rgba(247,243,235,0.6)] space-y-2">
            <p>Mon – Tue <span className="italic">Closed</span></p>
            <p>Wed – Thu <span className="text-[var(--cream)]">12 – 3 pm</span></p>
            <p>Fri – Sun <span className="text-[var(--cream)]">10 am – 3 pm</span></p>
          </div>
        </motion.div>
      </div>

      {/* Bottom */}
      <div className="px-5 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-[var(--font-sans)] text-xs text-[rgba(247,243,235,0.3)]">
          © {new Date().getFullYear()} Bayou. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a href="/admin" className="font-[var(--font-sans)] text-xs text-[rgba(247,243,235,0.3)] hover:text-[var(--orange)] transition-colors">
            Admin
          </a>
          <span className="font-[var(--font-sans)] text-xs text-[rgba(247,243,235,0.3)]">
            Victorian Quarter, Cork
          </span>
        </div>
      </div>
    </footer>
  );
}
