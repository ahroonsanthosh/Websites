import Link from "next/link";
import { MapPin } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

interface Location { name: string; eircode: string; slug: string; }

export default function Footer({ locations, instagram }: { locations: Location[]; instagram: string }) {
  return (
    <footer className="bg-[#1B2A5E] py-16 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[#5ABFC0]/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-[400px] h-[300px] bg-[#5ABFC0]/08 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-[300px] h-[200px] bg-[#F2B8C6]/08 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <svg width="28" height="28" viewBox="0 0 120 120" fill="none">
                <circle cx="72" cy="36" r="28" fill="#F2B8C6" stroke="#FDFAF6" strokeWidth="6"/>
                <circle cx="50" cy="64" r="34" fill="none" stroke="#FDFAF6" strokeWidth="6"/>
                <path d="M28 72 Q44 50 60 68 Q76 86 92 64" stroke="#5ABFC0" strokeWidth="8" strokeLinecap="round" fill="none"/>
              </svg>
              <div>
                <div className="text-white font-bold text-sm tracking-widest uppercase">Some Dose</div>
                <div className="text-[#5ABFC0] text-[9px] tracking-[0.25em] uppercase">Coffee Co.</div>
              </div>
            </div>
            <p className="text-white/40 text-sm font-light leading-relaxed max-w-[200px]">Specialty coffee and fresh pastries across Cork, Ireland.</p>
            <a href={instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-[#5ABFC0] text-sm hover:text-[#F2B8C6] transition-colors duration-200">
              <InstagramIcon className="w-4 h-4" /> @some_dose
            </a>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-white/30 text-[10px] uppercase tracking-[0.3em] mb-5 font-semibold">Locations</h4>
            <div className="flex flex-col gap-3">
              {locations.map((loc) => (
                <Link key={loc.slug} href={`/locations/${loc.slug}`} className="flex items-start gap-2 group">
                  <MapPin className="w-3.5 h-3.5 text-[#5ABFC0] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white/70 text-sm group-hover:text-white transition-colors duration-200">{loc.name}</div>
                    <div className="text-white/30 text-[10px]">{loc.eircode}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Hours summary */}
          <div>
            <h4 className="text-white/30 text-[10px] uppercase tracking-[0.3em] mb-5 font-semibold">Hours</h4>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Mon – Fri</span>
                <span className="text-white/80 tabular-nums">7:30 am – 3:30 pm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Sat – Sun</span>
                <span className="text-white/80 tabular-nums">8:30 am – 3:00 pm</span>
              </div>
            </div>
            <div className="mt-6 h-[1px] bg-gradient-to-r from-[#5ABFC0]/40 to-[#F2B8C6]/40 rounded-full" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/08 gap-4">
          <p className="text-white/25 text-xs">© {new Date().getFullYear()} Some Dose Coffee Co. All rights reserved.</p>
          <Link href="/admin" className="text-white/20 text-xs hover:text-white/40 transition-colors duration-200">Staff Login</Link>
        </div>
      </div>
    </footer>
  );
}
