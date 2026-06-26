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

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Measure exact horizontal travel so the last card lands flush (no blank).
  const [travel, setTravel] = useState(0);
  const [heightVh, setHeightVh] = useState(240);

  useEffect(() => {
    const calc = () => {
      const track = trackRef.current;
      if (!track) return;
      const t = Math.max(0, track.scrollWidth - window.innerWidth + 24);
      setTravel(t);
      // Keep horizontal speed natural (~1px vertical ≈ 1px horizontal).
      setHeightVh(Math.round(100 + (t / window.innerHeight) * 100));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [reviews.length]);

  // Vertical scroll through the tall section drives horizontal travel of the
  // pinned card track (a cinematic "proof" reel).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -travel]);
  const x = useSpring(xRaw, { stiffness: 120, damping: 40, mass: 0.5 });
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 40 });

  return (
    // Tall runway — height measured so horizontal travel finishes exactly.
    <section
      ref={ref}
      className="relative bg-[#FFF8F0]"
      id="reviews"
      style={{ height: `${heightVh}vh` }}
    >
      {/* Pinned scene */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* Header */}
        <div className="max-w-7xl mx-auto w-full px-6 mb-10 md:mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-orange-500" />
            <span className="text-orange-500 text-xs font-sans tracking-[0.3em] uppercase font-medium">
              The Proof
            </span>
          </div>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(2.5rem,6vw,5rem)] font-black text-[#1A1A1A] leading-none"
            >
              What Cork is Saying.
            </motion.h2>
          </div>
        </div>

        {/* Horizontal card track */}
        <motion.div ref={trackRef} style={{ x }} className="flex gap-6 px-6 will-change-transform">
          {reviews.map((review, i) => (
            <motion.article
              key={review.id}
              whileHover={{ y: -10, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className="flex-shrink-0 w-[78vw] sm:w-[60vw] md:w-[420px] glass rounded-3xl p-8 md:p-10 relative overflow-hidden cursor-default"
            >
              <div className="absolute top-2 right-6 font-display text-[8rem] text-orange-500/10 leading-none select-none pointer-events-none">
                &ldquo;
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="font-condensed text-5xl text-orange-500/40 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-orange-500 text-orange-500" />
                  ))}
                </div>
              </div>

              <p className="font-display text-[#1A1A1A] text-xl md:text-2xl leading-relaxed mb-8 relative z-10">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm font-sans">
                  {review.name[0]}
                </div>
                <div>
                  <p className="font-sans font-semibold text-[#1A1A1A] text-sm">{review.name}</p>
                  <p className="font-sans text-[#1A1A1A]/40 text-xs">Verified Review</p>
                </div>
              </div>
            </motion.article>
          ))}

          {/* Tail card — closing flourish */}
          <div className="flex-shrink-0 w-[78vw] sm:w-[50vw] md:w-[380px] flex items-center justify-center pr-6">
            <div className="text-center">
              <p className="font-condensed text-6xl md:text-7xl text-[#1A1A1A] leading-none mb-3">
                JOIN<br />THEM.
              </p>
              <a
                href="#order"
                className="inline-block mt-2 text-orange-500 font-sans font-medium text-sm border-b border-orange-500/40 hover:border-orange-500 transition-colors"
              >
                Come taste why →
              </a>
            </div>
          </div>
        </motion.div>

        {/* Scrub progress bar */}
        <div className="max-w-7xl mx-auto w-full px-6 mt-10">
          <div className="h-px bg-[#1A1A1A]/10 relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-orange-500 origin-left w-full"
              style={{ scaleX: progressScaleX }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
