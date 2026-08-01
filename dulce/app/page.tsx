import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { MarqueeBand } from "@/components/sections/MarqueeBand";
import { PhotoStrip } from "@/components/sections/PhotoStrip";
import { About } from "@/components/sections/About";
import { Specials } from "@/components/sections/Specials";
import { MenuSection } from "@/components/sections/MenuSection";
import { VideoScroll } from "@/components/sections/VideoScroll";
import { Gallery } from "@/components/sections/Gallery";
import { HoursLocation } from "@/components/sections/HoursLocation";
import { Footer } from "@/components/sections/Footer";
import { CustomCursor } from "@/components/ui/cursor";

export default function Home() {
  return (
    <main className="bg-stone-950">
      <CustomCursor />
      <Navbar />
      <Hero />
      <MarqueeBand />
      <PhotoStrip />
      <About />
      <MarqueeBand />
      <Specials />
      <MenuSection />
      <VideoScroll />
      <Gallery />
      <HoursLocation />
      <Footer />
    </main>
  );
}
