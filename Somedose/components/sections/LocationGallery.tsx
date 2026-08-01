"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";
if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);
export default function LocationGallery({ images, name }: { images: string[]; name: string }) {
  const [cur, setCur] = useState(0);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => { gsap.fromTo(".gallery-grid-img",{scale:1.08,autoAlpha:0},{scale:1,autoAlpha:1,duration:1,stagger:.1,ease:"expo.out",scrollTrigger:{trigger:".gallery-grid-img",start:"top 85%"}}); },ref);
    return () => ctx.revert();
  },[]);
  return (
    <section ref={ref} className="py-16 bg-[#FDFAF6]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden mb-4 h-[400px] md:h-[520px] group">
          {images.map((src,i) => <img key={i} src={src} alt={`${name} ${i+1}`} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i===cur?"opacity-100":"opacity-0"}`} />)}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a3a]/30 to-transparent pointer-events-none" />
          <button onClick={() => setCur(c => (c-1+images.length)%images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={() => setCur(c => (c+1)%images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"><ChevronRight className="w-5 h-5" /></button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">{images.map((_,i) => <button key={i} onClick={() => setCur(i)} className={`rounded-full transition-all duration-300 ${i===cur?"w-5 h-1.5 bg-white":"w-1.5 h-1.5 bg-white/40"}`} />)}</div>
        </div>
        <div className="grid grid-cols-5 gap-2">{images.slice(0,5).map((src,i) => <button key={i} onClick={() => setCur(i)} className={`gallery-grid-img relative rounded-xl overflow-hidden h-20 transition-all ${i===cur?"ring-2 ring-[#5ABFC0]":"opacity-60 hover:opacity-100"}`}><img src={src} alt={`${name} ${i+1}`} className="w-full h-full object-cover" /></button>)}</div>
      </div>
    </section>
  );
}
