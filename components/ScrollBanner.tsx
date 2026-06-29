"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ScrollBanner() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={ref} className="relative h-[50vh] min-h-[360px] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAHh38AbbcR4OpjpG1gaXg_P3joeKhi0Q9AN9td1Wa44gFHGPmTO4l-U5S-GM7bP3-6Ty58P3zalug7l0DMop7nOoDHQRDSJL30Oh2iDoEeRoGMar2yr0fVavLqq9aXFk1-CaMwk-LSZrNf9=s1360-w1360-h1020-rw"
          alt="NorthSouth Café food"
          className="w-full h-[120%] object-cover -mt-[10%]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#1a1510]/60" />
      </motion.div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display text-3xl md:text-5xl lg:text-6xl text-white leading-tight max-w-3xl"
        >
          <em>"Good food is the foundation of genuine happiness."</em>
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 flex items-center gap-3 text-white/40 text-xs tracking-[0.3em] uppercase"
        >
          <div className="h-px w-8 bg-[#c8864a]" />
          Auguste Escoffier
          <div className="h-px w-8 bg-[#c8864a]" />
        </motion.div>
      </div>
    </section>
  );
}
