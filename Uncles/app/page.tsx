"use client";

import ScrollMorphHero from "@/components/ui/scroll-morph-hero";
import Navbar from "@/components/sections/Navbar";
import About from "@/components/sections/About";
import { MarqueeStrip } from "@/components/ui/marquee-strip";
import Menu from "@/components/sections/Menu";
import Gallery from "@/components/sections/Gallery";
import Location from "@/components/sections/Location";
import Footer from "@/components/sections/Footer";

export default function Home() {
  const scrollPastHero = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      <Navbar />

      {/* Hero — full viewport, captures scroll for the morph animation */}
      <section className="relative w-full h-screen" style={{ touchAction: "none" }}>
        <ScrollMorphHero onScrollPast={scrollPastHero} />
      </section>

      <MarqueeStrip />
      <About />
      <Menu />
      <Gallery />
      <Location />
<Footer />
    </main>
  );
}
