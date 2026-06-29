"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function RotatingBadge() {
  const repeated = "Bayou · Cork · Café · ".repeat(3);
  return (
    <motion.div
      className="w-20 h-20 md:w-28 md:h-28 relative flex-shrink-0"
      animate={{ rotate: 360 }}
      transition={{ duration: 12, ease: "linear", repeat: Infinity }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <path id="circle-path" d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
        </defs>
        <circle cx="50" cy="50" r="44" fill="var(--charcoal)" />
        <text fontSize="10.5" fontWeight="600" fill="var(--cream)" letterSpacing="2" style={{ fontFamily: "var(--font-sans)" }}>
          <textPath href="#circle-path">{repeated}</textPath>
        </text>
        <text x="50" y="57" textAnchor="middle" fontSize="22" fontWeight="900" fill="var(--cream)" style={{ fontFamily: "var(--font-display)" }}>
          B
        </text>
      </svg>
    </motion.div>
  );
}

function CircleImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <motion.div
      className={`circle-crop overflow-hidden border-4 border-[var(--warm-white)] shadow-xl flex-shrink-0 ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full h-full object-cover" fetchPriority="high" />
    </motion.div>
  );
}

export default function Hero({
  data,
}: {
  data: { heading: string; subheading: string; cta: string; image: string };
}) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const galleryImg =
    "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEUg33F93WGg0ppMzcimi7v4Qdftsa-WK2EGNXm01Nl8V-cpCON4i050eOarGOVIISnr-aSTAX8_gmaDNhD-jzORu9LraSbAVDDKSsvGmPRpLd3i4W17mUk1R2vEt3SNhvOdoTKtWBe4NsH=s1360-w1360-h1020-rw";

  return (
    <section
      ref={containerRef}
      className="relative bg-[var(--warm-white)] overflow-hidden flex flex-col justify-center pt-16 md:pt-20 pb-20 md:pb-28"
      aria-label="Hero"
    >
      <motion.div className="relative px-5 md:px-10 max-w-[1600px] mx-auto w-full" style={{ opacity }}>
        {/* Top row: subtext + badge */}
        <div className="flex items-start justify-between mb-10 md:mb-14">
          <motion.p
            className="font-[var(--font-sans)] text-sm md:text-base text-[var(--muted)] max-w-[180px] md:max-w-xs leading-snug mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            A cosy daytime café in
            <br />
            Cork&apos;s Victorian Quarter
          </motion.p>
          <RotatingBadge />
        </div>

        {/* Heading row with inline circle images (flex, not absolute) */}
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-12 md:mb-16">
          <motion.div style={{ y: y1 }} className="hidden sm:block">
            <CircleImage
              src={data.image}
              alt="Inside Bayou café"
              className="w-[90px] h-[90px] md:w-[150px] md:h-[150px] lg:w-[190px] lg:h-[190px]"
            />
          </motion.div>

          <motion.h1
            className="font-[var(--font-display)] font-black leading-[0.88] text-[var(--charcoal)] select-none text-center"
            style={{
              fontSize: "clamp(4.2rem, 16vw, 13rem)",
              letterSpacing: "-0.02em",
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {data.heading}
          </motion.h1>

          <motion.div style={{ y: y2 }} className="hidden sm:block">
            <CircleImage
              src={galleryImg}
              alt="Bayou food and coffee"
              className="w-[70px] h-[70px] md:w-[120px] md:h-[120px] lg:w-[150px] lg:h-[150px]"
            />
          </motion.div>
        </div>

        {/* Mobile-only circle row (since hidden in heading on small screens) */}
        <div className="flex sm:hidden justify-center gap-5 mb-12">
          <CircleImage src={data.image} alt="Inside Bayou café" className="w-20 h-20" />
          <CircleImage src={galleryImg} alt="Bayou food and coffee" className="w-20 h-20" />
        </div>

        {/* Bottom row: status + CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="flex items-center gap-2 order-3 sm:order-1">
            <span className="w-2 h-2 rounded-full bg-[var(--sage)] animate-pulse inline-block" />
            <span className="font-[var(--font-sans)] text-sm font-medium text-[var(--muted)]">
              Open Wed – Sun
            </span>
          </div>

          <a
            href="#menu"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="pill pill-solid font-[var(--font-sans)] font-semibold order-1 sm:order-2"
          >
            See the Menu →
          </a>

          <a
            href="#location"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#location")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="pill pill-orange font-[var(--font-sans)] font-semibold order-2 sm:order-3"
          >
            Find Us
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-[var(--border)]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1, duration: 1.2 }}
      />
    </section>
  );
}
