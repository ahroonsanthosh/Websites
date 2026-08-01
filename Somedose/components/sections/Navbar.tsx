"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Menu, X } from "lucide-react";

function IgIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.fromTo(navRef.current,{y:-20,autoAlpha:0},{y:0,autoAlpha:1,duration:1,delay:.5,ease:"expo.out"});
    const s = () => setScrolled(window.scrollY>60);
    window.addEventListener("scroll",s,{passive:true});
    return () => window.removeEventListener("scroll",s);
  },[]);
  const links = [{href:"#menu",label:"Menu"},{href:"#locations",label:"Locations"},{href:"#hours",label:"Hours"}];
  return (
    <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled?"bg-[#FDFAF6]/90 backdrop-blur-md shadow-sm border-b border-[#1B2A5E]/06":"bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <svg width="32" height="32" viewBox="0 0 120 120" fill="none" className="transition-transform duration-300 group-hover:rotate-6">
            <circle cx="72" cy="36" r="28" fill="#F2B8C6" stroke="#1B2A5E" strokeWidth="6"/>
            <circle cx="50" cy="64" r="34" fill="none" stroke="#1B2A5E" strokeWidth="6"/>
            <path d="M28 72 Q44 50 60 68 Q76 86 92 64" stroke="#5ABFC0" strokeWidth="8" strokeLinecap="round" fill="none"/>
            <path d="M28 80 Q44 62 60 76 Q76 90 92 72" stroke="#5ABFC0" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".5"/>
          </svg>
          <div className="flex flex-col leading-none">
            <span className="text-[#1B2A5E] font-bold text-sm tracking-widest uppercase">Some Dose</span>
            <span className="text-[#5ABFC0] text-[9px] tracking-[.25em] uppercase font-medium">Coffee Co.</span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => <a key={l.href} href={l.href} className="text-[#1B2A5E]/60 hover:text-[#1B2A5E] text-sm font-medium tracking-wide transition-colors relative group">{l.label}<span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#5ABFC0] group-hover:w-full transition-all duration-300" /></a>)}
          <a href="https://www.instagram.com/some_dose/?hl=en" target="_blank" rel="noopener noreferrer" className="text-[#1B2A5E]/60 hover:text-[#5ABFC0] transition-colors"><IgIcon className="w-4 h-4" /></a>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-[#1B2A5E] p-1">{open?<X className="w-5 h-5" />:<Menu className="w-5 h-5" />}</button>
      </div>
      <div className={`md:hidden overflow-hidden transition-all duration-400 bg-[#FDFAF6]/95 backdrop-blur-lg border-t border-[#1B2A5E]/06 ${open?"max-h-64":"max-h-0"}`}>
        <div className="px-6 py-6 flex flex-col gap-5">
          {links.map(l => <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-[#1B2A5E] text-base font-medium">{l.label}</a>)}
          <a href="https://www.instagram.com/some_dose/?hl=en" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#5ABFC0] text-sm font-medium"><IgIcon className="w-4 h-4" /> @some_dose</a>
        </div>
      </div>
    </nav>
  );
}
