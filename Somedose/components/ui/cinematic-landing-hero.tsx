"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { DottedSurface } from "@/components/ui/dotted-surface";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }
  .film-grain { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 50; opacity: 0.04; mix-blend-mode: overlay; background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>'); }
  .bg-grid-dose { background-size: 60px 60px; background-image: linear-gradient(to right, rgba(27,42,94,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(27,42,94,0.06) 1px, transparent 1px); mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%); -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%); }
  .text-dose-reveal { color: #1B2A5E; }
  .text-dose-wave { background: linear-gradient(135deg, #5ABFC0 0%, #1B2A5E 60%, #F2B8C6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; transform: translateZ(0); filter: drop-shadow(0px 8px 20px rgba(90,191,192,0.25)); }
  .text-card-cream { background: linear-gradient(180deg, #FDFAF6 0%, #E8D5C4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; transform: translateZ(0); filter: drop-shadow(0px 8px 20px rgba(0,0,0,0.5)); }
  .dose-card { background: linear-gradient(145deg, #1B2A5E 0%, #0d1a3a 100%); box-shadow: 0 40px 100px -20px rgba(0,0,0,0.7), 0 20px 40px -20px rgba(0,0,0,0.5), inset 0 1px 2px rgba(242,184,198,0.15), inset 0 -2px 4px rgba(0,0,0,0.6); border: 1px solid rgba(90,191,192,0.12); position: relative; }
  .card-sheen { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50; background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(90,191,192,0.08) 0%, transparent 40%); mix-blend-mode: screen; transition: opacity 0.3s ease; }
  .wave-accent { background: linear-gradient(90deg, #5ABFC0, #F2B8C6); height: 2px; border-radius: 1px; }
  .dose-badge { background: linear-gradient(135deg, rgba(90,191,192,0.12) 0%, rgba(242,184,198,0.06) 100%); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); box-shadow: 0 0 0 1px rgba(90,191,192,0.2), 0 20px 40px -12px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.1); }
  .progress-ring { transform: rotate(-90deg); transform-origin: center; stroke-dasharray: 402; stroke-dashoffset: 402; stroke-linecap: round; }
  .btn-dose-light { background: linear-gradient(180deg, #FDFAF6 0%, #F0EBE3 100%); color: #1B2A5E; box-shadow: 0 0 0 1px rgba(27,42,94,0.08), 0 2px 4px rgba(27,42,94,0.1), 0 12px 24px -4px rgba(27,42,94,0.2), 0 0 20px rgba(90,191,192,0.12), inset 0 1px 1px rgba(255,255,255,1); transition: all 0.4s cubic-bezier(0.25,1,0.5,1); }
  .btn-dose-light:hover { transform: translateY(-3px); box-shadow: 0 0 0 1px rgba(90,191,192,0.25), 0 6px 12px rgba(27,42,94,0.15), 0 20px 32px -6px rgba(27,42,94,0.25), 0 0 30px rgba(90,191,192,0.25), inset 0 1px 1px rgba(255,255,255,1); }
  .btn-dose-dark { background: linear-gradient(180deg, #5ABFC0 0%, #3a9fa0 100%); color: #FFFFFF; box-shadow: 0 0 0 1px rgba(90,191,192,0.3), 0 2px 4px rgba(0,0,0,0.3), 0 12px 24px -4px rgba(90,191,192,0.3), 0 0 24px rgba(90,191,192,0.3), inset 0 1px 1px rgba(255,255,255,0.3); transition: all 0.4s cubic-bezier(0.25,1,0.5,1); }
  .btn-dose-dark:hover { transform: translateY(-3px); box-shadow: 0 0 0 1px rgba(90,191,192,0.5), 0 6px 12px rgba(90,191,192,0.2), 0 20px 32px -6px rgba(90,191,192,0.4), 0 0 40px rgba(90,191,192,0.4), inset 0 1px 1px rgba(255,255,255,0.3); }
`;

export interface SomeDoseHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  tagline1?: string;
  tagline2?: string;
  ctaHeading?: string;
  ctaDescription?: string;
}

export function SomeDoseHero({
  tagline1 = "Specialty coffee,",
  tagline2 = "baked fresh daily.",
  ctaHeading = "Find your closest dose.",
  ctaDescription = "Three locations across Cork. Same obsessive quality, same rotating Roasted Brown beans, same in-house pastries — every morning.",
  className,
  ...props
}: SomeDoseHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;
      cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          mainCardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        }
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => { window.removeEventListener("mousemove", handleMouseMove); cancelAnimationFrame(requestRef.current); };
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const ctx = gsap.context(() => {
      gsap.set(".text-track", { autoAlpha: 0, y: 60, scale: 0.85, filter: "blur(20px)", rotationX: -20 });
      gsap.set(".text-wave", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
      gsap.set(".main-card", { y: window.innerHeight + 200, autoAlpha: 1 });
      gsap.set([".card-content-left", ".card-content-right", ".card-gallery-wrap"], { autoAlpha: 0 });
      gsap.set(".cta-wrapper", { autoAlpha: 0, scale: 0.8, filter: "blur(30px)" });

      gsap.timeline({ delay: 0.3 })
        .to(".text-track", { duration: 1.4, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0, ease: "back.out(1.4)" })
        .to(".text-wave", { duration: 1.2, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" }, "-=0.8");

      const scrollTl = gsap.timeline({
        scrollTrigger: { trigger: containerRef.current, start: "top top", end: "+=3800", pin: true, scrub: 1, anticipatePin: 1 },
      });

      scrollTl
        .to([".hero-text-wrapper", ".bg-grid-dose"], { scale: 1.1, filter: "blur(20px)", opacity: 0.15, ease: "power2.inOut", duration: 1.5 }, 0)
        .to(".main-card", { y: 0, ease: "power3.inOut", duration: 1.5 }, 0)
        .to(".main-card", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 1.2 })
        .fromTo(".card-gallery-wrap", { y: 120, autoAlpha: 0, scale: 0.85 }, { y: 0, autoAlpha: 1, scale: 1, ease: "back.out(1.3)", duration: 1.5 }, "-=0.4")
        .fromTo(".card-content-left", { x: -40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "back.out(1.5)", duration: 1 }, "-=1")
        .fromTo(".card-content-right", { x: 40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "back.out(1.5)", duration: 1 }, "<")
        .to({}, { duration: 1.2 })
        .set(".hero-text-wrapper", { autoAlpha: 0 })
        .set(".cta-wrapper", { autoAlpha: 1 })
        .to({}, { duration: 0.6 })
        .to([".card-gallery-wrap", ".card-content-left", ".card-content-right"], { scale: 0.92, y: -30, autoAlpha: 0, ease: "power3.in", duration: 0.8, stagger: 0.04 })
        .to(".main-card", { autoAlpha: 0, ease: "power2.in", duration: 1 }, "pullback")
        .to(".cta-wrapper", { scale: 1, filter: "blur(0px)", ease: "back.out(1.3)", duration: 1.4 }, "pullback");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-screen h-screen overflow-hidden flex items-center justify-center bg-[#FDFAF6] font-sans antialiased", className)} style={{ perspective: "1500px" }} {...props}>
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <DottedSurface className="z-[1]" />
      <div className="film-grain" aria-hidden="true" />
      <div className="bg-grid-dose absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />

      {/* Hero text */}
      <div className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4">
        <div className="wave-accent w-16 mb-8 opacity-60" />
        <h1 className="text-track gsap-reveal text-dose-reveal text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tight mb-3" style={{ fontFamily: "Georgia, serif" }}>
          {tagline1}
        </h1>
        <h1 className="text-wave gsap-reveal text-dose-wave text-5xl md:text-7xl lg:text-[6rem] font-extrabold tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>
          {tagline2}
        </h1>
        <p className="text-track gsap-reveal mt-6 text-[#1B2A5E]/50 text-base md:text-lg font-light tracking-wide uppercase letter-spacing-widest">
          Cork, Ireland · Three Locations
        </p>
      </div>

      {/* CTA section */}
      <div className="cta-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 gsap-reveal pointer-events-auto">
        <div className="wave-accent w-12 mb-6 mx-auto" />
        <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-dose-wave" style={{ fontFamily: "Georgia, serif" }}>{ctaHeading}</h2>
        <p className="text-[#1B2A5E]/60 text-lg mb-10 max-w-lg mx-auto font-light leading-relaxed">{ctaDescription}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#locations" className="btn-dose-dark px-8 py-4 rounded-2xl font-semibold text-base tracking-wide">Explore Locations</a>
          <a href="#menu" className="btn-dose-light px-8 py-4 rounded-2xl font-semibold text-base tracking-wide">View Menu</a>
        </div>
      </div>

      {/* The card */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: "1500px" }}>
        <div ref={mainCardRef} className="main-card dose-card relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-[92vw] md:w-[80vw] h-[90vh] md:h-[80vh] rounded-[28px] md:rounded-[36px]">
          <div className="card-sheen" aria-hidden="true" />
          <div className="relative w-full h-full max-w-6xl mx-auto px-6 lg:px-12 grid lg:grid-cols-5 items-center gap-8 z-10 py-8">

            {/* Left text */}
            <div className="card-content-left gsap-reveal lg:col-span-2 flex flex-col justify-center order-2 lg:order-1">
              <div className="wave-accent w-10 mb-6" />
              <h3 className="text-card-cream text-3xl lg:text-4xl font-bold mb-4 tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
                Obsessive about quality.
              </h3>
              <p className="text-[#5ABFC0]/80 text-sm lg:text-base font-light leading-relaxed mb-6">
                Rotating Roasted Brown beans. In-house pastries baked every morning. Oat and coconut milk as standard. Three Cork locations, one standard.
              </p>
              <div className="flex gap-3 flex-wrap">
                {["Specialty Coffee", "Fresh Pastries", "Dairy-Free"].map((tag) => (
                  <span key={tag} className="text-[10px] uppercase tracking-widest text-[#5ABFC0] border border-[#5ABFC0]/30 px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>

            {/* Center gallery */}
            <div className="card-gallery-wrap lg:col-span-2 order-1 lg:order-2 relative h-[280px] lg:h-[480px] flex items-center justify-center">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <img src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAHqc33jXu2_yMWtQQ9yYwr1d51fdGzRL-oUz8h4oJeMeuKx2d-Pb_k02Q9L-mjZm7_e1eTLSnv4cyIrBTswHESWAVcgIEgi7SAlFnhT3dARtsIt0Sjk3l2w09GD3TJLHvLDEL8=s1360-w1360-h1020-rw" alt="Some Dose Coffee interior" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a3a]/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[#FDFAF6]/90 text-xs uppercase tracking-widest font-semibold">Some Dose Coffee Co.</p>
                  <p className="text-[#5ABFC0] text-[10px] tracking-wide mt-1">Cork, Ireland</p>
                </div>
              </div>
            </div>

            {/* Right — locations list */}
            <div className="card-content-right gsap-reveal lg:col-span-1 order-3 flex flex-col justify-center gap-4">
              {["Hanley's Cork", "Turners Cross", "Opera House"].map((loc, i) => (
                <div key={loc} className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-1 h-8 rounded-full bg-[#5ABFC0]/30 group-hover:bg-[#5ABFC0] transition-colors duration-300" />
                  <div>
                    <p className="text-white text-sm font-semibold group-hover:text-[#5ABFC0] transition-colors duration-300">{loc}</p>
                    <p className="text-[#5ABFC0]/50 text-[10px] uppercase tracking-wider">Cork</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
