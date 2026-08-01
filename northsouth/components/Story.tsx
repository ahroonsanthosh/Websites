"use client";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Story() {
  const ref = useRef<HTMLElement>(null);
  const textRef = useRef(null);
  const inView = useInView(textRef, { once: true, margin: "-15% 0px" });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const paragraphs = [
    "NorthSouth began as a simple idea — that the best meals are the ones shared slowly, over good coffee, in a room that feels like someone's home.",
    "Nestled in the heart of Tralee on Russell Street, we opened our doors to serve the kind of food that reminds you where you are. Locally sourced, carefully prepared, served without ceremony.",
    "From Kerry lamb to Kerrygold butter, we cook with what's around us. Every plate is an honest one.",
  ];

  return (
    <section id="story" ref={ref} className="py-24 md:py-40 bg-[#f8f5f0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16 md:gap-24 items-center">
        {/* Image side */}
        <div className="relative order-2 md:order-1">
          <div className="relative overflow-hidden rounded-2xl aspect-[4/5]">
            <motion.img
              style={{ y: imgY }}
              src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAHWJuUsmgs8VpBqi0kghMsGZR1Ro5uVFoaO576R0j-9-TnLBSR0xVtL-XKjjt40PINW-c5IJkJEEFfCArWimOyO-J3FGstWp4VtBaXxzLzmK4byvp927JToWvPlp6lhBIvQg6FJ=s1360-w1360-h1020-rw"
              alt="NorthSouth Café — cosy interior"
              className="w-full h-[120%] object-cover -mt-[10%]"
              loading="lazy"
            />
          </div>

          {/* Floating stat card */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: 30 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="absolute -bottom-6 -right-4 md:-right-8 bg-[#1a1510] text-white rounded-2xl p-6 md:p-8 shadow-2xl max-w-[180px] md:max-w-[200px]"
          >
            <div className="font-display text-4xl md:text-5xl text-[#c8864a] leading-none">Mon–Sat</div>
            <div className="text-white/60 text-sm mt-2 leading-relaxed">
              Open<br />8am – 4pm<br />
              <span className="text-xs">(Sat from 9am)</span>
            </div>
          </motion.div>

          {/* Decorative dot */}
          <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full border border-[#c8864a]/30 hidden md:block" />
        </div>

        {/* Text side */}
        <div ref={textRef} className="order-1 md:order-2">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="text-[#c8864a] text-xs tracking-[0.3em] uppercase"
          >
            Who we are
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl text-[#1a1510] mt-4 leading-tight"
          >
            Our<br /><em>Story</em>
          </motion.h2>

          <div className="h-px w-16 bg-[#c8864a] mt-6 mb-8" />

          <div className="space-y-5">
            {paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
                className="text-[#1a1510]/70 leading-relaxed text-base md:text-lg"
              >
                {p}
              </motion.p>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex items-center gap-4"
          >
            <div className="h-px w-10 bg-[#c8864a]" />
            <span className="font-display italic text-[#c8864a] text-lg">Good food. Good people.</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
