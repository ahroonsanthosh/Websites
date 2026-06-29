"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// 21st.dev – Text Scramble / Reveal animation
function ScrambleText({ text, delay = 0 }: { text: string; delay?: number }) {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const [display, setDisplay] = useState(text.split("").map(() => " "));
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    timeout = setTimeout(() => {
      let iteration = 0;
      const letters = text.split("");
      const interval = setInterval(() => {
        setDisplay(
          letters.map((char, i) => {
            if (char === " ") return " ";
            if (i < iteration) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
        );
        iteration += 0.5;
        if (iteration >= letters.length) {
          clearInterval(interval);
          setDisplay(letters);
          setDone(true);
        }
      }, 40);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [text, delay, chars]);

  return (
    <span className={`transition-opacity duration-500 ${done ? "opacity-100" : "opacity-80"}`}>
      {display.join("")}
    </span>
  );
}

// 21st.dev – Word-by-word reveal
function WordReveal({
  text,
  delay = 0,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <span className={`inline-flex flex-wrap gap-x-[0.3em] ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: delay + i * 0.1,
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero({ data }: { data: { heading: string; subheading: string; cta: string; image: string } }) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax on image
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Parallax image */}
      <motion.div
        className="absolute inset-0 scale-110"
        style={{ y: imageY }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.image}
          alt="Bayou Café interior"
          className="w-full h-full object-cover"
          fetchPriority="high"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(26,26,24,0.55)] via-[rgba(26,26,24,0.3)] to-[rgba(26,26,24,0.7)]" />
      </motion.div>

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-20 text-center px-6 max-w-4xl mx-auto"
        style={{ y: textY, opacity }}
      >
        {/* Eyebrow */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="h-px w-12 bg-[var(--terracotta)]" />
          <span className="text-[var(--cream)] font-[var(--font-sans)] text-[10px] tracking-[0.3em] uppercase opacity-80">
            {data.subheading}
          </span>
          <div className="h-px w-12 bg-[var(--terracotta)]" />
        </motion.div>

        {/* Main heading – Scramble */}
        <h1 className="font-[var(--font-serif)] text-[clamp(5rem,18vw,14rem)] leading-[0.9] text-[var(--cream)] font-light tracking-tight mb-8">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <ScrambleText text={data.heading} delay={0.6} />
          </motion.span>
        </h1>

        {/* Subtext */}
        <div className="font-[var(--font-sans)] text-[var(--cream)] text-sm tracking-[0.15em] opacity-75 uppercase mb-12">
          <WordReveal text="Cork · Wed – Sun · MacCurtain Street" delay={1.2} />
        </div>

        {/* CTA */}
        <motion.a
          href="#menu"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="inline-flex items-center gap-3 px-8 py-4 border border-[var(--cream)] text-[var(--cream)] font-[var(--font-sans)] text-xs tracking-[0.2em] uppercase hover:bg-[var(--cream)] hover:text-[var(--charcoal)] transition-all duration-400 group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          {data.cta}
          <motion.span
            className="inline-block"
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            →
          </motion.span>
        </motion.a>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{ opacity }}
      >
        <span className="text-[var(--cream)] font-[var(--font-sans)] text-[9px] tracking-[0.3em] uppercase opacity-50">
          Scroll
        </span>
        <div className="w-px h-10 bg-[var(--cream)] opacity-30 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-[var(--cream)]"
            animate={{ height: ["0%", "100%"], top: ["0%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
