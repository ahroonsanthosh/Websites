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
    <footer ref={ref} className="bg-[var(--ink)] grain text-[var(--cream)]" aria-label="Footer">
      {/* Oversized wordmark */}
      <div className="overflow-hidden pt-20 px-8 md:px-16 lg:px-24 border-b border-[var(--line-dark)]">
        <motion.h2
          className="font-[var(--font-display)] italic font-black leading-[0.85] pb-3"
          style={{
            fontSize: "clamp(5rem,22vw,18rem)",
            letterSpacing: "-0.02em",
            color: "var(--teal)",
          }}
          initial={{ y: "105%" }}
          animate={isInView ? { y: "0%" } : {}}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          Bayou
        </motion.h2>
      </div>

      {/* Info grid */}
      <div className="px-8 md:px-16 lg:px-24 py-20 grid grid-cols-1 md:grid-cols-3 gap-14 border-b border-[var(--line-dark)]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <p className="font-[var(--font-display)] italic font-black text-3xl mb-3 text-[var(--cream)]">
            {data.site.name}
          </p>
          <p className="font-[var(--font-sans)] text-sm text-[var(--mist)] max-w-xs leading-relaxed">
            {data.site.tagline}
          </p>
          {data.site.instagram && (
            <a
              href={data.site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 pill pill-brass text-xs"
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
          <p className="label-engrave text-[var(--brass)] mb-5">Visit</p>
          <address className="not-italic font-[var(--font-sans)] text-sm text-[var(--mist)] leading-loose">
            {data.site.address.split(",").map((l, i) => (
              <span key={i} className="block">{l.trim()}</span>
            ))}
          </address>
          <a
            href={`tel:${data.site.phone.replace(/\D/g, "")}`}
            className="block mt-4 font-[var(--font-sans)] text-sm text-[var(--cream)] hover:text-[var(--brass)] transition-colors"
          >
            {data.site.phone}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
        >
          <p className="label-engrave text-[var(--brass)] mb-5">Hours</p>
          <div className="font-[var(--font-sans)] text-sm text-[var(--mist)] space-y-2">
            <p>Mon – Tue <span className="italic opacity-50">Closed</span></p>
            <p>Wed – Thu <span className="text-[var(--cream)]">12 – 3 pm</span></p>
            <p>Fri – Sun <span className="text-[var(--cream)]">10 am – 3 pm</span></p>
          </div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="px-8 md:px-16 lg:px-24 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-[var(--font-sans)] text-xs text-[var(--cream)]/25">
          © {new Date().getFullYear()} Bayou. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a href="/admin" className="font-[var(--font-sans)] text-xs text-[var(--cream)]/25 hover:text-[var(--brass)] transition-colors">
            Admin
          </a>
          <span className="font-[var(--font-sans)] text-xs text-[var(--cream)]/25">
            Victorian Quarter, Cork
          </span>
        </div>
      </div>
    </footer>
  );
}
