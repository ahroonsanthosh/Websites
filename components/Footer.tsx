"use client";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const InstagramIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="5"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

const FacebookIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-[#0f0b08] text-white py-16 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div>
            <div className="font-display text-3xl text-white mb-2">NorthSouth</div>
            <div className="text-[#9e9890] text-xs tracking-[0.25em] uppercase">Café · Tralee, Co. Kerry</div>
            <div className="mt-4 flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-[#c8864a] hover:border-[#c8864a]/40 transition-all duration-300" aria-label="Instagram">
                <InstagramIcon size={14} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-[#c8864a] hover:border-[#c8864a]/40 transition-all duration-300" aria-label="Facebook">
                <FacebookIcon size={14} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="text-xs tracking-[0.25em] uppercase text-[#9e9890] mb-4">Navigate</div>
              {[["Menu", "#menu"], ["Our Story", "#story"], ["Gallery", "#gallery"], ["Find Us", "#visit"]].map(([label, href]) => (
                <a key={label} href={href} className="block text-white/50 hover:text-white transition-colors py-1 hover-underline">{label}</a>
              ))}
            </div>
            <div>
              <div className="text-xs tracking-[0.25em] uppercase text-[#9e9890] mb-4">Contact</div>
              <a href="tel:0667171277" className="block text-white/50 hover:text-white transition-colors py-1">(066) 717 1277</a>
              <p className="text-white/50 py-1">12 Russell St</p>
              <p className="text-white/50 py-1">Tralee, Co. Kerry</p>
            </div>
            <div>
              <div className="text-xs tracking-[0.25em] uppercase text-[#9e9890] mb-4">Hours</div>
              <p className="text-white/50 py-1">Mon–Fri · 8am–4pm</p>
              <p className="text-white/50 py-1">Saturday · 9am–4pm</p>
              <p className="text-white/30 py-1">Sunday · Closed</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4">
          <p className="text-white/20 text-xs tracking-wider">
            © {new Date().getFullYear()} NorthSouth Café. All rights reserved.
          </p>
          <button
            onClick={scrollTop}
            className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-white/30 hover:text-white transition-colors group"
          >
            Back to top
            <ArrowUp size={12} className="group-hover:-translate-y-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </footer>
  );
}
