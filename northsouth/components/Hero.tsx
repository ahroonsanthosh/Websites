"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen min-h-[640px] overflow-hidden bg-[#1a1510]">
      {/* Parallax image */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAFyPf8LELmzcZMR1C8YQi-IyJ07JKy8wMRzEGIMW_aWIB7Kbrox-qAptVyn2iv_YFirQU229khHHhRHkLuR5AnhsGcyajqN9QrYZplHNLhFxgz2xHUP-qrvmGoAeKj0sR3OCrfORgGs-8zN=s1360-w1360-h1020-rw"
          alt="NorthSouth Café interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1510]/80 via-[#1a1510]/50 to-[#1a1510]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510]/60 via-transparent to-[#1a1510]/30" />
      </motion.div>

      {/* Content — absolutely positioned to avoid flex-height quirks */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 flex flex-col justify-end"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 w-full pb-14 md:pb-20">
          {/* Pre-heading */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center gap-3 mb-5"
          >
            <div className="h-px w-8 bg-[#c8864a]" />
            <span className="text-[#c8864a] text-[11px] tracking-[0.3em] uppercase font-medium">
              Tralee, Co. Kerry
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(3rem,8vw,6.5rem)] text-white leading-[0.92] tracking-tight max-w-2xl"
          >
            Where <em>north</em>
            <br />meets <em>south</em>
            <span className="text-[#c8864a]">.</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="mt-5 text-white/65 text-sm md:text-base max-w-xs leading-relaxed font-light"
          >
            Breakfast &amp; brunch crafted with care, served in the heart of Tralee.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.3 }}
            className="flex flex-wrap gap-3 mt-8"
          >
            <a
              href="#menu"
              className="inline-flex items-center gap-2 bg-[#c8864a] text-white text-[11px] tracking-[0.2em] uppercase px-6 py-3 rounded-full hover:bg-[#b87840] transition-all duration-300 hover:-translate-y-0.5"
            >
              View Menu
            </a>
            <a
              href="#story"
              className="inline-flex items-center gap-2 border border-white/25 text-white text-[11px] tracking-[0.2em] uppercase px-6 py-3 rounded-full hover:border-white/50 transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-sm"
            >
              Our Story
            </a>
          </motion.div>

          {/* Hours */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="mt-10 flex items-center gap-2 text-white/40 text-[11px] tracking-widest"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#c8864a] animate-pulse shrink-0" />
            <span>Open Today · Mon–Fri 8am–4pm · Sat 9am–4pm</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="absolute bottom-7 right-8 md:right-12 z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown size={13} className="text-white/35" />
        </motion.div>
        <span className="text-white/25 text-[9px] tracking-[0.3em] uppercase [writing-mode:vertical-rl]">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
