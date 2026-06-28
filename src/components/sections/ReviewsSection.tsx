"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Star } from "lucide-react";

interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: string;
}

const CARD_ACCENTS = [
  { num: "#FF5500", star: "#FF5500", avatar: "from-[#FF5500] to-[#FF2D6B]" },
  { num: "#FFD000", star: "#FFD000", avatar: "from-[#FFD000] to-[#FF5500]" },
  { num: "#AAFF00", star: "#AAFF00", avatar: "from-[#AAFF00] to-[#00F5C4]" },
  { num: "#00C2FF", star: "#00C2FF", avatar: "from-[#00C2FF] to-[#8B5CF6]" },
  { num: "#FF2D6B", star: "#FF2D6B", avatar: "from-[#FF2D6B] to-[#FF6BDB]" },
  { num: "#8B5CF6", star: "#8B5CF6", avatar: "from-[#8B5CF6] to-[#00C2FF]" },
];

function ReviewCard({ review, i }: { review: Review; i: number }) {
  const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.06 }}
      className="glass rounded-3xl p-6 relative overflow-hidden"
      style={{ borderColor: accent.num + "33" }}
    >
      <div className="absolute top-0 left-0 bottom-0 w-1 rounded-l-3xl" style={{ background: accent.num }} />
      <div className="absolute top-2 right-4 font-display text-[6rem] leading-none select-none pointer-events-none" style={{ color: accent.num + "18" }}>&ldquo;</div>
      <div className="flex items-center gap-3 mb-4">
        <span className="font-condensed text-3xl leading-none" style={{ color: accent.num + "99" }}>{String(i + 1).padStart(2, "0")}</span>
        <div className="flex gap-1">
          {[...Array(review.rating)].map((_, j) => (
            <Star key={j} className="w-4 h-4" style={{ fill: accent.star, color: accent.star }} />
          ))}
        </div>
      </div>
      <p className="font-display text-[#1A1A1A] text-base leading-relaxed mb-4 relative z-10">&ldquo;{review.text}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${accent.avatar} flex items-center justify-center text-white font-bold text-sm font-sans flex-shrink-0`}>{review.name[0]}</div>
        <div>
          <p className="font-sans font-semibold text-[#1A1A1A] text-sm">{review.name}</p>
          <p className="font-sans text-[#1A1A1A]/40 text-xs">Verified Review</p>
        </div>
      </div>
    </motion.article>
  );
}

function SectionHeader() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-px" style={{ background: "#00C2FF" }} />
        <span className="text-xs font-sans tracking-[0.3em] uppercase font-medium" style={{ color: "#00C2FF" }}>The Proof</span>
      </div>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-[clamp(1.6rem,3.5vw,4rem)] font-black text-[#1A1A1A] leading-tight"
      >
        What Cork is Saying.
      </motion.h2>
    </div>
  );
}

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [heightVh, setHeightVh] = useState(240);

  useEffect(() => {
    const calc = () => {
      const track = trackRef.current;
      if (!track) return;
      const t = Math.max(0, track.scrollWidth - window.innerWidth + 24);
      setTravel(t);
      setHeightVh(Math.round(100 + (t / window.innerHeight) * 100));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [reviews.length]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -travel]);
  const x = useSpring(xRaw, { stiffness: 120, damping: 40, mass: 0.5 });
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 40 });

  return (
    <div id="reviews">
      {/* ── Mobile: simple vertical stack ── */}
      <section className="md:hidden bg-[#FFF8F0] py-16 px-6">
        <div className="mb-8">
          <SectionHeader />
        </div>
        <div className="space-y-4">
          {reviews.map((review, i) => (
            <ReviewCard key={review.id} review={review} i={i} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <p className="font-condensed text-5xl leading-none mb-3 text-gradient">JOIN THEM.</p>
          <a href="#order" className="font-sans font-medium text-sm border-b" style={{ color: "#FF2D6B", borderColor: "rgba(255,45,107,0.4)" }}>
            Come taste why →
          </a>
        </div>
      </section>

      {/* ── Desktop: horizontal cinema scroll ── */}
      <section
        ref={ref}
        className="relative bg-[#FFF8F0] hidden md:block"
        style={{ height: `${heightVh}vh` }}
      >
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <div className="max-w-7xl mx-auto w-full px-6 mb-14">
            <SectionHeader />
          </div>
          <motion.div ref={trackRef} style={{ x }} className="flex gap-6 px-6 will-change-transform">
            {reviews.map((review, i) => {
              const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
              return (
                <motion.article
                  key={review.id}
                  whileHover={{ y: -10, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                  className="flex-shrink-0 w-[420px] glass rounded-3xl p-10 relative overflow-hidden cursor-default"
                  style={{ borderColor: accent.num + "33" }}
                >
                  <div className="absolute top-0 left-0 bottom-0 w-1 rounded-l-3xl" style={{ background: accent.num }} />
                  <div className="absolute top-2 right-6 font-display text-[8rem] leading-none select-none pointer-events-none" style={{ color: accent.num + "18" }}>&ldquo;</div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-condensed text-5xl leading-none" style={{ color: accent.num + "99" }}>{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, j) => (
                        <Star key={j} className="w-4 h-4" style={{ fill: accent.star, color: accent.star }} />
                      ))}
                    </div>
                  </div>
                  <p className="font-display text-[#1A1A1A] text-2xl leading-relaxed mb-8 relative z-10">&ldquo;{review.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${accent.avatar} flex items-center justify-center text-white font-bold text-sm font-sans`}>{review.name[0]}</div>
                    <div>
                      <p className="font-sans font-semibold text-[#1A1A1A] text-sm">{review.name}</p>
                      <p className="font-sans text-[#1A1A1A]/40 text-xs">Verified Review</p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
            <div className="flex-shrink-0 w-[380px] flex items-center justify-center pr-6">
              <div className="text-center">
                <p className="font-condensed text-7xl leading-none mb-3 text-gradient">JOIN<br />THEM.</p>
                <a href="#order" className="inline-block mt-2 font-sans font-medium text-sm border-b transition-colors" style={{ color: "#FF2D6B", borderColor: "rgba(255,45,107,0.4)" }}>Come taste why →</a>
              </div>
            </div>
          </motion.div>
          <div className="max-w-7xl mx-auto w-full px-6 mt-10">
            <div className="h-px bg-[#1A1A1A]/10 relative overflow-hidden">
              <motion.div className="absolute inset-y-0 left-0 origin-left w-full" style={{ scaleX: progressScaleX, background: "linear-gradient(to right, #FF5500, #FF2D6B, #8B5CF6, #00C2FF)" }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
