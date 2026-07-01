"use client";

import { motion } from "framer-motion";
import { GALLERY } from "@/data/site";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function About() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:py-32" aria-label="About">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={0}
            className="text-xs font-semibold uppercase tracking-[0.3em] text-berry"
          >
            The short version
          </motion.p>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={1}
            className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
          >
            We do buns.
            <br />
            <em className="text-caramel">Seriously good ones.</em>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={2}
            className="mt-6 max-w-[46ch] text-lg leading-relaxed text-cocoa/70"
          >
            Soft brioche dough, proofed slow and baked fresh every single
            morning on Oliver Plunkett Street. Pair one with a flat white,
            grab a window seat, watch Cork go by. That's it. That's the
            whole idea.
          </motion.p>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <motion.img
            src={GALLERY[3].src}
            alt={GALLERY[3].alt}
            loading="lazy"
            initial={{ opacity: 0, rotate: -4, y: 40 }}
            whileInView={{ opacity: 1, rotate: -3, y: 0 }}
            whileHover={{ rotate: 0, scale: 1.02 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="aspect-[4/3] w-full rounded-2xl border-4 border-cocoa object-cover shadow-[8px_8px_0_#C98A3D]"
          />
          <motion.span
            initial={{ scale: 0, rotate: -20 }}
            whileInView={{ scale: 1, rotate: 8 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.4 }}
            className="absolute -right-4 -top-6 rounded-full bg-berry px-4 py-2 font-display text-sm font-semibold italic text-cream shadow-lg"
          >
            baked today ✳
          </motion.span>
        </div>
      </div>
    </section>
  );
}
