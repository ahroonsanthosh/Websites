"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// 21st.dev – Large footer text with stagger
interface SiteInfo {
  name: string;
  address: string;
  phone: string;
  tagline: string;
  instagram?: string;
}

export default function Footer({ data }: { data: { site: SiteInfo } }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <footer
      className="bg-[var(--dark-brown)] text-[var(--cream)] overflow-hidden"
      aria-label="Footer"
    >
      {/* Large brand text */}
      <div ref={ref} className="px-6 md:px-12 pt-20 pb-6 border-b border-[rgba(245,239,224,0.08)]">
        <div className="overflow-hidden">
          <motion.h2
            className="font-[var(--font-serif)] text-[clamp(5rem,22vw,18rem)] leading-[0.85] font-light tracking-tight text-[rgba(245,239,224,0.06)] select-none"
            initial={{ y: "101%" }}
            animate={isInView ? { y: "0%" } : {}}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            aria-hidden="true"
          >
            Bayou
          </motion.h2>
        </div>
      </div>

      {/* Footer links row */}
      <div className="px-6 md:px-12 py-14 grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-[rgba(245,239,224,0.08)]">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-[var(--font-serif)] text-3xl font-light mb-4">{data.site.name}</p>
          <p className="font-[var(--font-sans)] text-[var(--muted)] text-sm leading-relaxed max-w-xs">
            {data.site.tagline}
          </p>
        </motion.div>

        {/* Visit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <p className="font-[var(--font-sans)] text-[9px] tracking-[0.3em] uppercase text-[var(--terracotta)] mb-5">
            Visit
          </p>
          <address className="not-italic font-[var(--font-sans)] text-sm text-[var(--muted)] leading-loose">
            {data.site.address.split(",").map((line, i) => (
              <span key={i} className="block">{line.trim()}</span>
            ))}
          </address>
          <a
            href={`tel:${data.site.phone.replace(/\D/g, "")}`}
            className="block mt-4 font-[var(--font-sans)] text-sm text-[var(--cream)] hover:text-[var(--terracotta)] transition-colors duration-300"
          >
            {data.site.phone}
          </a>
        </motion.div>

        {/* Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <p className="font-[var(--font-sans)] text-[9px] tracking-[0.3em] uppercase text-[var(--terracotta)] mb-5">
            Hours
          </p>
          <div className="font-[var(--font-sans)] text-sm text-[var(--muted)] space-y-1.5 leading-relaxed">
            <p>Mon – Tue <span className="italic font-[var(--font-serif)]">Closed</span></p>
            <p>Wed – Thu <span className="text-[var(--cream)]">12 – 3 pm</span></p>
            <p>Fri – Sun <span className="text-[var(--cream)]">10 am – 3 pm</span></p>
          </div>

          {data.site.instagram && (
            <a
              href={data.site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 font-[var(--font-sans)] text-xs tracking-widest uppercase text-[var(--muted)] hover:text-[var(--terracotta)] transition-colors duration-300 group"
              aria-label="Follow Bayou on Instagram"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span className="group-hover-line">Instagram</span>
            </a>
          )}
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-[var(--font-sans)] text-[10px] tracking-[0.2em] uppercase text-[var(--muted)]">
          © {new Date().getFullYear()} Bayou. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a
            href="/admin"
            className="font-[var(--font-sans)] text-[10px] tracking-[0.2em] uppercase text-[var(--muted)] hover:text-[var(--terracotta)] transition-colors duration-300"
          >
            Admin
          </a>
          <span className="font-[var(--font-sans)] text-[10px] tracking-[0.2em] uppercase text-[var(--muted)]">
            Victorian Quarter, Cork
          </span>
        </div>
      </div>
    </footer>
  );
}
