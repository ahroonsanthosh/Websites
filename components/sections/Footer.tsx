"use client";

import { motion } from "framer-motion";
import { BouncyText } from "@/components/ui/bouncy-text";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Menu", href: "#menu" },
  { label: "Gallery", href: "#gallery" },
  { label: "Find Us", href: "#location" },
];

export default function Footer() {
  const handleNav = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0D0602] border-t border-[#FDF6EB]/5 py-14 px-5 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">

          {/* Brand */}
          <div className="text-center md:text-left">
            <motion.div
              className="flex items-center gap-2 justify-center md:justify-start mb-3 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              whileHover={{ x: -2, transition: { type: "spring", stiffness: 300 } }}
            >
              <motion.div
                className="w-8 h-8 rounded-full bg-[#EE1C1C] flex items-center justify-center"
                whileHover={{ rotate: 20, scale: 1.1, transition: { type: "spring", stiffness: 400 } }}
              >
                <span className="text-white font-accent text-xs font-bold">U</span>
              </motion.div>
              <span className="font-display italic text-[#FDF6EB] text-xl font-bold">
                Uncle&apos;s Deli Cork
              </span>
            </motion.div>
            <p className="text-[#FDF6EB]/40 text-xs max-w-[220px] leading-relaxed">
              Rotisserie chicken, done right. In the heart of{" "}
              <a
                href="https://www.englishmarket.ie"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#EE1C1C] transition-colors underline underline-offset-2"
              >
                The English Market
              </a>{" "}
              since 2019.
            </p>
          </div>

          {/* Nav */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-[#FDF6EB]/40 hover:text-[#EE1C1C] font-accent text-[10px] tracking-[0.2em] uppercase transition-colors"
              >
                <BouncyText text={link.label} />
              </button>
            ))}
          </div>

          {/* Social */}
          <motion.a
            href="https://www.instagram.com/unclesdelicork/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#FDF6EB]/40 hover:text-[#EE1C1C] transition-colors group"
            whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 300 } }}
          >
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              whileHover={{ rotate: 12, transition: { type: "spring", stiffness: 400 } }}
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </motion.svg>
            <span className="font-accent text-[10px] tracking-widest uppercase">Instagram</span>
          </motion.a>
        </div>

        <div className="mt-12 pt-6 border-t border-[#FDF6EB]/5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[#FDF6EB]/20 text-[11px] font-accent tracking-wider">
            © {new Date().getFullYear()}{" "}Uncle&apos;s Deli Cork. All rights reserved.
          </p>
          <p className="text-[#FDF6EB]/20 text-[11px] font-accent tracking-wider">
            Unit 12, The English Market, Cork City
          </p>
        </div>
      </div>
    </footer>
  );
}
