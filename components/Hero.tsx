"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen min-h-[600px] flex flex-col overflow-hidden bg-[#f8f5f0]">
      {/* Parallax hero image */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAFyPf8LELmzcZMR1C8YQi-IyJ07JKy8wMRzEGIMW_aWIB7Kbrox-qAptVyn2iv_YFirQU229khHHhRHkLuR5AnhsGcyajqN9QrYZplHNLhFxgz2xHUP-qrvmGoAeKj0sR3OCrfORgGs-8zN=s1360-w1360-h1020-rw"
          alt="NorthSouth Café interior"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1510]/75 via-[#1a1510]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510]/50 via-transparent to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex flex-col justify-end h-full max-w-7xl mx-auto px-6 md:px-10 pb-16 md:pb-24 w-full"
      >
        <div className="max-w-2xl">
          {/* Pre-heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-10 bg-[#c8864a]" />
            <span className="text-[#c8864a] text-xs tracking-[0.3em] uppercase font-medium">
              Tralee, Co. Kerry
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[0.95] tracking-tight"
          >
            Where <em>north</em>
            <br />meets <em>south</em>
            <span className="text-[#c8864a]">.</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="mt-6 text-white/70 text-base md:text-lg max-w-sm leading-relaxed font-light"
          >
            Breakfast &amp; brunch crafted with care, served in the heart of Tralee.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.3 }}
            className="flex flex-wrap gap-4 mt-10"
          >
            <a
              href="#menu"
              className="inline-flex items-center gap-2 bg-[#c8864a] text-white text-xs tracking-[0.2em] uppercase px-7 py-3.5 rounded-full hover:bg-[#b87840] transition-all duration-300 hover:-translate-y-0.5"
            >
              View Menu
            </a>
            <a
              href="#story"
              className="inline-flex items-center gap-2 border border-white/30 text-white text-xs tracking-[0.2em] uppercase px-7 py-3.5 rounded-full hover:border-white/60 transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-sm"
            >
              Our Story
            </a>
          </motion.div>
        </div>

        {/* Hours strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="mt-16 md:mt-20 flex items-center gap-6 text-white/50 text-xs tracking-widest"
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#c8864a] animate-pulse" />
            <span>Open Today · Mon–Fri 8am–4pm · Sat 9am–4pm</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-8 right-8 md:right-12 z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown size={14} className="text-white/40" />
        </motion.div>
        <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase [writing-mode:vertical-rl]">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
