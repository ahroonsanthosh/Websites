"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const R = "https://raw.githubusercontent.com/ahroonsanthosh/Brightside/main";

const DRINKS = [
  { name: "Espresso", price: "2.50", priceLg: "2.80" },
  { name: "Americano", price: "3.20", priceLg: "3.40" },
  { name: "Macchiato", price: "2.80", priceLg: "3.20" },
  { name: "Flat White", price: "3.50", priceLg: null },
  { name: "Cappuccino", price: "3.50", priceLg: "3.70" },
  { name: "Latte", price: "3.50", priceLg: "3.70" },
  { name: "Mocha", price: "3.70", priceLg: "4.00" },
  { name: "Hot Chocolate", price: "3.70", priceLg: "4.00" },
  { name: "Chai Latte", price: "3.70", priceLg: "4.00" },
  { name: "Matcha Latte", price: "3.70", priceLg: "4.00" },
  { name: "Iced Americano", price: "3.70", priceLg: null },
  { name: "Iced Latte", price: "4.20", priceLg: null },
  { name: "Barry's Tea", price: "2.30", priceLg: null },
  { name: "Herbal Tea", price: "3.30", priceLg: null },
];

const EXTRAS = [
  { name: "Alternative Milk", price: "+0.40" },
  { name: "Syrup", price: "+0.50" },
];

export function MenuSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".menu-heading",
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1, y: 0, ease: "expo.out", duration: 1.2,
          scrollTrigger: { trigger: ".menu-heading", start: "top 82%", toggleActions: "play none none none" },
        }
      );
      gsap.fromTo(
        ".menu-item",
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1, y: 0, ease: "power3.out", duration: 0.7, stagger: 0.055,
          scrollTrigger: { trigger: ".menu-grid", start: "top 78%", toggleActions: "play none none none" },
        }
      );
      gsap.fromTo(
        ".menu-note",
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.8,
          scrollTrigger: { trigger: ".menu-note", start: "top 88%", toggleActions: "play none none none" },
        }
      );
      gsap.fromTo(
        ".menu-photo-panel",
        { autoAlpha: 0, x: 30 },
        {
          autoAlpha: 1, x: 0, ease: "expo.out", duration: 1.2,
          scrollTrigger: { trigger: ".menu-photo-panel", start: "top 80%", toggleActions: "play none none none" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="relative bg-[#F7F3EC] py-28 md:py-36 px-6"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3D5A3C]/20 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="menu-heading text-center mb-20">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#3D5A3C]/70 font-semibold mb-4">
            Drinks Menu
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-[#2C2C2A] tracking-tight leading-none">
            What we brew.
          </h2>
          <p className="mt-5 text-[#5C5C56] text-lg font-light max-w-sm mx-auto">
            Specialty espresso · single-origin beans · lovingly made
          </p>
        </div>

        {/* Two-column layout: menu list left, photo right */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] lg:grid-cols-[1fr_400px] gap-12 md:gap-16 items-start">
          {/* Menu list */}
          <div>
            <div className="menu-grid space-y-0">
              {DRINKS.map((item, i) => (
                <div
                  key={item.name}
                  className={`menu-item flex items-center justify-between py-5 ${
                    i < DRINKS.length - 1 ? "border-b border-[#3D5A3C]/10" : ""
                  } group`}
                >
                  <span className="text-[#2C2C2A] text-base md:text-lg font-medium group-hover:text-[#3D5A3C] transition-colors duration-200">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-6">
                    <span className="text-[#3D5A3C] font-semibold text-base md:text-lg tabular-nums">
                      €{item.price}
                    </span>
                    {item.priceLg && (
                      <span className="text-[#3D5A3C]/55 font-medium text-sm md:text-base tabular-nums">
                        €{item.priceLg}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-[#3D5A3C]/15">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#3D5A3C]/60 font-semibold mb-6">
                Add-ons
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                {EXTRAS.map((e) => (
                  <div
                    key={e.name}
                    className="menu-item flex items-center justify-between flex-1 py-4 px-6 rounded-2xl bg-[#3D5A3C]/05 border border-[#3D5A3C]/10"
                  >
                    <span className="text-[#2C2C2A] text-sm font-medium">{e.name}</span>
                    <span className="text-[#3D5A3C] font-semibold text-sm tabular-nums">{e.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="menu-note mt-10 text-xs text-[#5C5C56]/60 font-light tracking-wide">
              Prices shown are for regular / large where applicable. All prices include VAT.
            </p>
          </div>

          {/* Photo panel — sticky on desktop */}
          <div className="menu-photo-panel hidden md:block md:sticky md:top-28 self-start">
            <div className="rounded-3xl overflow-hidden aspect-[3/4] shadow-[0_8px_40px_rgba(61,90,60,0.12)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={R + "/Screenshot%202026-06-26%20111049.png"}
                alt="Specialty latte at Bright Side"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="mt-5 px-1">
              <p className="text-xs text-[#5C5C56]/60 font-light tracking-wide text-center italic">
                Single-origin, pulled fresh every morning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
