"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

interface MenuItem { id: string; name: string; description: string; price: string; tags: string[]; }
interface Category { id: string; name: string; items: MenuItem[]; }

const TAG_STYLES: Record<string, string> = {
  signature: "bg-[#1B2A5E] text-white",
  vegan: "bg-[#5ABFC0]/15 text-[#3a9fa0]",
  "dairy-free": "bg-[#F2B8C6]/30 text-[#c47a8a]",
  "gluten-free": "bg-amber-50 text-amber-700",
};

export default function MenuSection({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState(categories[0]?.id ?? "");
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".menu-heading", { y: 50, autoAlpha: 0, scale: 0.95 }, { y: 0, autoAlpha: 1, scale: 1, duration: 1, ease: "back.out(1.5)", scrollTrigger: { trigger: ".menu-heading", start: "top 85%" } });
      gsap.fromTo(".menu-tab", { y: 24, autoAlpha: 0, scale: 0.85 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.7, stagger: 0.08, ease: "back.out(2)", scrollTrigger: { trigger: ".menu-tabs", start: "top 85%" } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    gsap.fromTo(".menu-item-card", { y: 30, autoAlpha: 0, scale: 0.94 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.55, stagger: 0.06, ease: "back.out(1.8)" });
  }, [active]);

  const activeCategory = categories.find((c) => c.id === active);

  return (
    <section ref={sectionRef} id="menu" className="teal-glow-section py-24 md:py-36 bg-[#FDFAF6] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(90,191,192,0.09) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(242,184,198,0.07) 0%, transparent 40%)" }} />

      <div className="max-w-6xl mx-auto px-6">
        <div className="menu-heading text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#5ABFC0] font-semibold">What we serve</span>
          <h2 className="text-4xl md:text-6xl font-bold text-[#1B2A5E] mt-3 mb-4 tracking-tight" style={{ fontFamily: "Georgia, serif" }}>The Menu</h2>
          <div className="w-12 h-[2px] bg-gradient-to-r from-[#5ABFC0] to-[#F2B8C6] mx-auto rounded-full" />
        </div>

        {/* Category tabs */}
        <div className="menu-tabs flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActive(cat.id)}
              className={`menu-tab px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${active === cat.id ? "bg-[#1B2A5E] text-white shadow-[0_4px_20px_rgba(27,42,94,0.3),0_0_20px_rgba(90,191,192,0.2)]" : "bg-white text-[#1B2A5E]/60 border border-[#1B2A5E]/10 hover:border-[#5ABFC0]/40 hover:text-[#1B2A5E] hover:shadow-[0_0_16px_rgba(90,191,192,0.2)]"}`}>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {activeCategory?.items.map((item) => (
            <div key={item.id} className="menu-item-card group bg-white rounded-2xl p-6 border border-[#1B2A5E]/06 hover:border-[#5ABFC0]/40 hover:shadow-[0_8px_32px_rgba(90,191,192,0.18),0_0_0_1px_rgba(90,191,192,0.18)] hover:scale-[1.025] transition-all duration-300 cursor-default">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-semibold text-[#1B2A5E] text-base group-hover:text-[#1B2A5E] transition-colors">{item.name}</h3>
                    {item.tags.map((t) => (
                      <span key={t} className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${TAG_STYLES[t] ?? "bg-gray-100 text-gray-500"}`}>{t}</span>
                    ))}
                  </div>
                  <p className="text-[#1B2A5E]/50 text-sm font-light leading-relaxed">{item.description}</p>
                </div>
                <span className="text-[#1B2A5E] font-bold text-base whitespace-nowrap tabular-nums">€{item.price}</span>
              </div>
              {/* Hover accent line */}
              <div className="mt-4 h-[1px] bg-gradient-to-r from-[#5ABFC0]/0 via-[#5ABFC0]/40 to-[#F2B8C6]/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>

        <p className="text-center text-[#1B2A5E]/40 text-sm mt-10 font-light">Menu rotates with the seasons. Ask your barista for today's specials.</p>
      </div>
    </section>
  );
}
