import { getContent } from "@/lib/content";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import LocationGallery from "@/components/sections/LocationGallery";
import { MapPin, Clock, ArrowLeft } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

const DAYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
const DAY_LABELS: Record<string, string> = { monday:"Mon", tuesday:"Tue", wednesday:"Wed", thursday:"Thu", friday:"Fri", saturday:"Sat", sunday:"Sun" };

export async function generateStaticParams() {
  const data = getContent();
  return data.locations.map((loc: { slug: string }) => ({ slug: loc.slug }));
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getContent();
  const location = data.locations.find((l: { slug: string }) => l.slug === slug);
  if (!location) notFound();

  const otherLocations = data.locations.filter((l: { slug: string }) => l.slug !== slug);

  return (
    <main className="overflow-x-hidden bg-[#FDFAF6]">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[75vh] min-h-[500px] flex items-end overflow-hidden">
        <img src={location.images[0]} alt={location.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a3a]/95 via-[#0d1a3a]/50 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-16 w-full">
          <Link href="/#locations" className="inline-flex items-center gap-2 text-white/50 text-sm mb-6 hover:text-white transition-colors duration-200 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            All locations
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-[#5ABFC0]" />
            <span className="text-[#5ABFC0] text-xs uppercase tracking-widest font-semibold">{location.handle} · {location.eircode}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-2" style={{ fontFamily: "Georgia, serif" }}>{location.name}</h1>
          <p className="text-white/50 text-lg font-light">Some Dose Coffee Co.</p>
        </div>
      </section>

      {/* Gallery */}
      <LocationGallery images={location.images} name={location.name} />

      {/* Info grid */}
      <section className="py-20 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        {/* Hours */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-4 h-4 text-[#5ABFC0]" />
            <h2 className="text-[#1B2A5E] font-bold text-xl" style={{ fontFamily: "Georgia, serif" }}>Opening Hours</h2>
          </div>
          <div className="bg-white rounded-2xl border border-[#1B2A5E]/06 overflow-hidden shadow-[0_0_24px_rgba(90,191,192,0.08)]">
            {DAYS.map((day, i) => {
              const h = data.hours[day];
              const todayIdx = new Date().getDay();
              const map = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
              const today = map[todayIdx] === day;
              return (
                <div key={day} className={`flex justify-between px-5 py-3 text-sm ${today ? "bg-[#1B2A5E]" : ""} ${i < DAYS.length - 1 ? "border-b border-[#1B2A5E]/05" : ""}`}>
                  <span className={`font-medium ${today ? "text-white" : "text-[#1B2A5E]"}`}>{DAY_LABELS[day]}{today && <span className="ml-2 text-[9px] uppercase tracking-widest text-[#5ABFC0]">Today</span>}</span>
                  <span className={`tabular-nums ${today ? "text-[#5ABFC0]" : "text-[#1B2A5E]/50"}`}>{h.open} – {h.close}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Address + social */}
        <div>
          <h2 className="text-[#1B2A5E] font-bold text-xl mb-6" style={{ fontFamily: "Georgia, serif" }}>Find Us</h2>
          <div className="bg-white rounded-2xl border border-[#1B2A5E]/06 p-6 mb-4 shadow-[0_0_24px_rgba(90,191,192,0.08)]">
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="w-4 h-4 text-[#5ABFC0] mt-0.5" />
              <div>
                <p className="text-[#1B2A5E] font-semibold text-sm">{location.name}</p>
                <p className="text-[#1B2A5E]/50 text-sm">{location.address}</p>
                <p className="text-[#5ABFC0] text-xs mt-1 font-mono">{location.eircode}</p>
              </div>
            </div>
            <a href={`https://maps.google.com/?q=${encodeURIComponent(location.address + " Cork Ireland")}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B2A5E] border border-[#1B2A5E]/15 px-4 py-2 rounded-xl hover:bg-[#1B2A5E] hover:text-white hover:border-transparent hover:shadow-[0_0_20px_rgba(90,191,192,0.3)] transition-all duration-300">
              Open in Maps
            </a>
          </div>
          <a href="https://www.instagram.com/some_dose/?hl=en" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 bg-gradient-to-r from-[#1B2A5E] to-[#0d1a3a] rounded-2xl px-6 py-4 group hover:from-[#5ABFC0] hover:to-[#3a9fa0] transition-all duration-500">
            <InstagramIcon className="w-5 h-5 text-[#5ABFC0] group-hover:text-white transition-colors duration-300" />
            <div>
              <p className="text-white text-sm font-semibold">Follow @some_dose</p>
              <p className="text-white/40 text-xs group-hover:text-white/70 transition-colors duration-300">Daily specials on Instagram</p>
            </div>
          </a>
        </div>
      </section>

      {/* Other locations */}
      <section className="py-16 bg-[#1B2A5E]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-white/50 text-sm uppercase tracking-widest mb-8 font-semibold">Other locations</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {otherLocations.map((loc: { id: string; slug: string; images: string[]; name: string; eircode: string }) => (
              <Link key={loc.id} href={`/locations/${loc.slug}`} className="relative rounded-2xl overflow-hidden group h-48">
                <img src={loc.images[0]} alt={loc.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a3a]/90 via-[#0d1a3a]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-white font-bold text-lg" style={{ fontFamily: "Georgia, serif" }}>{loc.name}</p>
                  <p className="text-[#5ABFC0] text-xs">{loc.eircode}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#5ABFC0] to-[#F2B8C6] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer locations={data.locations} instagram={data.site.instagram} />
    </main>
  );
}
