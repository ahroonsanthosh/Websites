"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star } from "lucide-react";

interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: string;
}

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <section ref={ref} className="relative py-32 bg-[#FFF8F0] overflow-hidden" id="reviews">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-8 h-px bg-orange-500" />
          <span className="text-orange-500 text-xs font-sans tracking-[0.3em] uppercase font-medium">
            Reviews
          </span>
        </motion.div>

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

      {/* Scrolling cards */}
      <div className="overflow-hidden">
        <motion.div style={{ x }} className="flex gap-6 px-6 pb-4">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 40, rotate: i % 2 === 0 ? -1 : 1 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, rotate: i % 2 === 0 ? -1 : 1, transition: { type: "spring", stiffness: 300 } }}
              className="flex-shrink-0 w-[320px] md:w-[380px] glass rounded-3xl p-8 relative overflow-hidden cursor-default"
            >
              {/* Quote mark */}
              <div className="absolute top-4 right-6 font-display text-8xl text-orange-500/10 leading-none select-none">
                &ldquo;
              </div>

              <div className="flex gap-1 mb-5">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-orange-500 text-orange-500" />
                ))}
              </div>

              <p className="font-display text-[#1A1A1A] text-lg leading-relaxed mb-6 relative z-10">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm font-sans">
                  {review.name[0]}
                </div>
                <div>
                  <p className="font-sans font-semibold text-[#1A1A1A] text-sm">{review.name}</p>
                  <p className="font-sans text-[#1A1A1A]/40 text-xs">Google Review</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
