"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INJECTED_STYLES = `
  .cafe-gsap-reveal { visibility: hidden; }

  .cafe-film-grain {
    position: absolute; inset: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 50; opacity: 0.04; mix-blend-mode: overlay;
    background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)"/></svg>');
  }

  .cafe-bg-grid {
    background-size: 56px 56px;
    background-image:
      linear-gradient(to right, rgba(107,124,106,0.08) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(107,124,106,0.08) 1px, transparent 1px);
    mask-image: radial-gradient(ellipse at center, black 0%, transparent 68%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 68%);
  }

  .cafe-text-reveal {
    color: #2C2C2A;
    text-shadow:
      0 8px 24px rgba(44,44,42,0.12),
      0 2px 4px rgba(44,44,42,0.06);
  }

  .cafe-text-gradient {
    background: linear-gradient(180deg, #3D5A3C 0%, rgba(61,90,60,0.55) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transform: translateZ(0);
    filter:
      drop-shadow(0px 8px 16px rgba(61,90,60,0.18))
      drop-shadow(0px 2px 4px rgba(61,90,60,0.10));
  }

  .cafe-text-clip-reveal {
    clip-path: inset(0 100% 0 0);
  }

  .cafe-depth-card {
    background: linear-gradient(148deg, #3D5A3C 0%, #1E2E1E 100%);
    box-shadow:
      0 40px 100px -20px rgba(0,0,0,0.70),
      0 20px 40px -20px rgba(0,0,0,0.55),
      inset 0 1px 2px rgba(255,255,255,0.14),
      inset 0 -2px 4px rgba(0,0,0,0.55);
    border: 1px solid rgba(255,255,255,0.045);
  }

  .cafe-card-sheen {
    position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
    background: radial-gradient(700px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.055) 0%, transparent 38%);
    mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  .cafe-card-silver {
    background: linear-gradient(180deg, #FFFFFF 0%, #B0BBA8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transform: translateZ(0);
    filter:
      drop-shadow(0px 10px 20px rgba(0,0,0,0.65))
      drop-shadow(0px 3px 6px rgba(0,0,0,0.50));
  }

  .cafe-product-frame {
    background: linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%);
    box-shadow:
      0 50px 120px -20px rgba(0,0,0,0.85),
      0 20px 40px -10px rgba(0,0,0,0.60),
      inset 0 1px 1px rgba(255,255,255,0.08),
      inset 0 -1px 2px rgba(0,0,0,0.60);
    border: 1px solid rgba(255,255,255,0.06);
  }

  .cafe-float-badge {
    background: linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 100%);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.11),
      0 20px 40px -10px rgba(0,0,0,0.70),
      inset 0 1px 1px rgba(255,255,255,0.18),
      inset 0 -1px 1px rgba(0,0,0,0.40);
  }
`;

export interface CafeCinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  instanceId: string;
  tagline1?: string;
  tagline2?: string;
  taglineSub?: string;
  cardHeading?: string;
  cardDescription?: React.ReactNode;
  badge1Text?: string;
  badge1Sub?: string;
  badge1Emoji?: string;
  badge2Text?: string;
  badge2Sub?: string;
  badge2Emoji?: string;
  productImageSrc?: string;
  productImageAlt?: string;
  scrollLength?: number;
  cardVariant?: "product" | "editorial";
}

export function CafeCinematicHero({
  instanceId,
  tagline1 = "Good mornings,",
  tagline2 = "start here.",
  taglineSub,
  cardHeading = "Specialty coffee,",
  cardDescription = <>Fresh espresso, single-origin beans, and a warm corner on <span className="text-white font-semibold">Washington Street</span> — open every weekday from 8am.</>,
  badge1Text = "Washington St, Cork",
  badge1Sub = "23a, Cork City Centre",
  badge1Emoji = "📍",
  badge2Text = "Mon – Fri",
  badge2Sub = "8 am – 3 pm",
  badge2Emoji = "☕",
  productImageSrc = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=700&q=85&auto=format&fit=crop",
  productImageAlt = "Bright Side specialty coffee",
  scrollLength = 3000,
  cardVariant = "product",
  className,
  ...props
}: CafeCinematicHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const s = (name: string) => `.cafe-hero-${instanceId} .${name}`;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && productRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          mainCardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;
          gsap.to(productRef.current, {
            rotationY: xVal * 8,
            rotationX: -yVal * 6,
            ease: "power3.out",
            duration: 1.4,
          });
        }
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(s("ch-tagline1"), { autoAlpha: 0, y: 40, scale: 0.92, filter: "blur(12px)", rotationX: -12 });
      gsap.set(s("ch-tagline2"), { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
      gsap.set(s("ch-tagline-sub"), { autoAlpha: 0, y: 16 });
      gsap.set(s("ch-main-card"), { y: window.innerHeight + 180, autoAlpha: 1 });
      // image starts visible in card; only text overlays and badges animate in
      gsap.set([s("ch-card-left"), s("ch-card-right"), s("ch-badge")], { autoAlpha: 0 });

      const introTl = gsap.timeline({ delay: 0.2 });
      introTl
        .to(s("ch-tagline1"), { duration: 1.1, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0, ease: "expo.out" })
        .to(s("ch-tagline2"), { duration: 0.9, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" }, "-=0.6")
        .to(s("ch-tagline-sub"), { duration: 0.7, autoAlpha: 1, y: 0, ease: "power3.out" }, "-=0.3");

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${scrollLength}`,
          pin: true,
          scrub: 1.0,
          anticipatePin: 1,
        },
      });

      scrollTl
        .to([s("ch-hero-text"), s("cafe-bg-grid-el")], { scale: 1.08, filter: "blur(14px)", opacity: 0.12, ease: "power2.inOut", duration: 1.2 }, 0)
        .to(s("ch-main-card"), { y: 0, ease: "power3.inOut", duration: 1.2 }, 0)
        .to(s("ch-main-card"), { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 0.8 })
        // image already visible — just animate scale for a subtle reveal effect
        .fromTo(s("ch-product-img"), { scale: 1.08 }, { scale: 1, ease: "power2.out", duration: 1.2 }, "-=0.5")
        .fromTo(s("ch-badge"), { y: 60, autoAlpha: 0, scale: 0.78, rotationZ: -6 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.4)", duration: 0.9, stagger: 0.12 }, "-=0.8")
        .fromTo(s("ch-card-left"), { x: -36, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 0.9 }, "-=0.9")
        .fromTo(s("ch-card-right"), { x: 36, autoAlpha: 0, scale: 0.86 }, { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 0.9 }, "<")
        .to({}, { duration: 0.8 })
        .to([s("ch-badge"), s("ch-card-left"), s("ch-card-right")], {
          autoAlpha: 0, y: -16, ease: "power2.in", duration: 0.5,
        })
        .to(s("ch-main-card"), { y: -window.innerHeight - 200, ease: "power3.in", duration: 1.0 }, "-=0.2");

    }, containerRef);

    return () => ctx.revert();
  }, [instanceId, scrollLength]);

  return (
    <div
      ref={containerRef}
      className={cn(`cafe-hero-${instanceId}`, "relative w-screen h-screen overflow-hidden flex items-center justify-center bg-[#F7F3EC] font-sans antialiased", className)}
      style={{ perspective: "1500px" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="cafe-film-grain" aria-hidden="true" />
      <div className="cafe-bg-grid-el cafe-bg-grid absolute inset-0 z-0 pointer-events-none opacity-60" aria-hidden="true" />

      {/* Hero text layer */}
      <div className="ch-hero-text absolute z-10 flex flex-col items-center justify-center text-center w-screen px-6 will-change-transform">
        <h1 className="ch-tagline1 cafe-gsap-reveal cafe-text-reveal text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-none mb-3">
          {tagline1}
        </h1>
        <h1 className="ch-tagline2 cafe-gsap-reveal cafe-text-clip-reveal cafe-text-gradient text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter leading-none">
          {tagline2}
        </h1>
        {taglineSub && (
          <p className="ch-tagline-sub cafe-gsap-reveal mt-7 text-[#5C5C56] text-sm md:text-base font-light tracking-wide max-w-xs mx-auto leading-relaxed">
            {taglineSub}
          </p>
        )}
      </div>

      {/* The card */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: "1500px" }}>
        <div
          ref={mainCardRef}
          className="ch-main-card cafe-depth-card relative overflow-hidden cafe-gsap-reveal flex items-center justify-center pointer-events-auto w-[92vw] md:w-[82vw] h-[90vh] md:h-[82vh] rounded-[28px] md:rounded-[36px]"
        >
          <div className="cafe-card-sheen" aria-hidden="true" />

          {cardVariant === "editorial" ? (
            <div className="relative w-full h-full flex flex-col lg:flex-row z-10">

              {/* Left: editorial text column */}
              <div className="ch-card-left cafe-gsap-reveal flex-[55] flex flex-col justify-center px-7 lg:px-12 py-8 lg:py-10 relative z-20">
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/35 font-semibold mb-5">
                  Bright Side · Cork
                </p>
                <div className="mb-6">
                  {cardHeading.split(",").map((part, i, arr) => (
                    <h2
                      key={i}
                      className={`text-[2.6rem] md:text-[4rem] lg:text-[5rem] font-black uppercase tracking-tighter leading-[0.86] cafe-card-silver ${i === arr.length - 1 && arr.length > 1 ? "opacity-45" : ""}`}
                    >
                      {part.trim()}
                    </h2>
                  ))}
                </div>
                <p className="text-green-100/60 text-sm lg:text-[0.95rem] font-light leading-relaxed max-w-[240px] mb-7">
                  {cardDescription}
                </p>
                <div className="flex flex-col gap-2.5">
                  <div className="ch-badge cafe-float-badge rounded-xl p-2.5 flex items-center gap-3 self-start">
                    <div className="w-7 h-7 rounded-full bg-white/08 flex items-center justify-center border border-white/12 flex-shrink-0">
                      <span className="text-xs drop-shadow" aria-hidden="true">{badge1Emoji}</span>
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold tracking-tight">{badge1Text}</p>
                      <p className="text-green-200/50 text-[10px]">{badge1Sub}</p>
                    </div>
                  </div>
                  <div className="ch-badge cafe-float-badge rounded-xl p-2.5 flex items-center gap-3 self-start">
                    <div className="w-7 h-7 rounded-full bg-white/08 flex items-center justify-center border border-white/12 flex-shrink-0">
                      <span className="text-xs drop-shadow" aria-hidden="true">{badge2Emoji}</span>
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold tracking-tight">{badge2Text}</p>
                      <p className="text-green-200/50 text-[10px]">{badge2Sub}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: full-bleed image panel — visible immediately */}
              <div className="ch-product-wrap flex-[45] relative overflow-hidden" style={{ perspective: "1000px" }}>
                <div
                  ref={productRef}
                  className="absolute inset-0 will-change-transform"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={productImageSrc}
                    alt={productImageAlt}
                    className="ch-product-img w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1E2E1E]/70 via-[#1E2E1E]/15 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Decorative right-edge accent */}
              <div className="ch-card-right cafe-gsap-reveal absolute right-5 top-1/2 -translate-y-1/2 hidden lg:flex" aria-hidden="true">
                <span
                  className="text-white/12 text-[9px] uppercase tracking-[0.35em] font-semibold"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  {cardHeading.replace(",", "").trim()}
                </span>
              </div>
            </div>

          ) : (
            <div className="relative w-full h-full max-w-7xl mx-auto px-5 lg:px-14 flex flex-col justify-evenly lg:grid lg:grid-cols-3 items-center lg:gap-10 z-10 py-8 lg:py-0">

              {/* Heading — top on mobile, right on desktop */}
              <div className="ch-card-right cafe-gsap-reveal order-1 lg:order-3 flex justify-center lg:justify-end z-20 w-full">
                <div className="text-center lg:text-right">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/40 font-semibold mb-2">Bright Side</p>
                  <h2 className="text-5xl md:text-7xl lg:text-[7.5rem] font-black uppercase tracking-tighter leading-none cafe-card-silver">
                    {cardHeading.split(",")[0]}
                  </h2>
                  {cardHeading.includes(",") && (
                    <h2 className="text-5xl md:text-7xl lg:text-[7.5rem] font-black uppercase tracking-tighter leading-none cafe-card-silver opacity-55">
                      {cardHeading.split(",")[1]?.trim()}
                    </h2>
                  )}
                </div>
              </div>

              {/* Product image — center, visible immediately */}
              <div className="ch-product-wrap order-2 relative w-full h-[280px] md:h-[420px] lg:h-[520px] flex items-center justify-center" style={{ perspective: "1000px" }}>
                <div className="relative scale-[0.82] md:scale-90 lg:scale-100 w-full h-full flex items-center justify-center">
                  <div
                    ref={productRef}
                    className="relative w-[260px] h-[260px] md:w-[360px] md:h-[360px] lg:w-[400px] lg:h-[400px] rounded-[2.5rem] cafe-product-frame overflow-hidden will-change-transform"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={productImageSrc}
                      alt={productImageAlt}
                      className="ch-product-img w-full h-full object-cover"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/05 pointer-events-none" />
                  </div>

                  <div className="ch-badge cafe-float-badge absolute top-4 md:top-8 left-[-8px] md:left-[-60px] rounded-xl md:rounded-2xl p-3 md:p-4 flex items-center gap-3 z-30">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/08 flex items-center justify-center border border-white/12">
                      <span className="text-sm md:text-lg drop-shadow" aria-hidden="true">{badge1Emoji}</span>
                    </div>
                    <div>
                      <p className="text-white text-xs md:text-sm font-bold tracking-tight">{badge1Text}</p>
                      <p className="text-green-200/50 text-[10px] md:text-xs">{badge1Sub}</p>
                    </div>
                  </div>

                  <div className="ch-badge cafe-float-badge absolute bottom-8 md:bottom-14 right-[-8px] md:right-[-60px] rounded-xl md:rounded-2xl p-3 md:p-4 flex items-center gap-3 z-30">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/08 flex items-center justify-center border border-white/12">
                      <span className="text-sm md:text-lg drop-shadow" aria-hidden="true">{badge2Emoji}</span>
                    </div>
                    <div>
                      <p className="text-white text-xs md:text-sm font-bold tracking-tight">{badge2Text}</p>
                      <p className="text-green-200/50 text-[10px] md:text-xs">{badge2Sub}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description — bottom on mobile, left on desktop */}
              <div className="ch-card-left cafe-gsap-reveal order-3 lg:order-1 flex flex-col justify-center text-center lg:text-left z-20 w-full px-2 lg:px-0">
                <p className="hidden md:block text-green-100/65 text-base lg:text-lg font-light leading-relaxed max-w-xs mx-auto lg:mx-0">
                  {cardDescription}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
