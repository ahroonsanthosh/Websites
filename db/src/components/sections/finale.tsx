"use client";

import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { SITE } from "@/data/site";

const SpiralAnimation = lazy(() =>
  import("@/components/ui/spiral-animation").then((m) => ({
    default: m.SpiralAnimation,
  }))
);

// Full-bleed closing moment; the spiral canvas only mounts once scrolled
// into view so it costs nothing on page load.
export function Finale() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  return (
    <section
      ref={ref}
      className="relative h-[80vh] overflow-hidden bg-[#12090a] text-cream"
      aria-label="See you soon"
    >
      {visible && !reducedMotion && (
        <div className="absolute inset-0 opacity-80">
          <Suspense fallback={null}>
            <SpiralAnimation />
          </Suspense>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-espresso via-transparent to-transparent" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
        <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">
          See you at the counter.
        </h2>
        <a
          href={SITE.mapsHref}
          target="_blank"
          rel="noreferrer"
          className="text-sm uppercase tracking-[0.3em] text-honey transition-all duration-500 hover:tracking-[0.4em]"
        >
          Take me there →
        </a>
      </div>
    </section>
  );
}
