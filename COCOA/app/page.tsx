import { Navbar } from "@/components/Navbar";
import { ScrollExpansionHero } from "@/components/ui/scroll-expansion-hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { Menu } from "@/components/Menu";
import { Gallery } from "@/components/Gallery";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar />

      <main id="main-content" className="w-full">
      <ScrollExpansionHero
        imageSrc="/images/hero.png"
        imageAlt="Signature coffee at Cocoa, Cork — dark, moody, handcrafted"
        tagline="Cork City · Est. 2012"
        title={
          <span className="text-[clamp(5rem,18vw,16rem)] font-bold tracking-[-0.02em]">
            COCOA
          </span>
        }
        subtitle="Fine Handmade Chocolate"
        ctaLabel="Explore the Menu"
        ctaHref="#menu"
      />

      <Marquee />
      <About />
<Menu />
      <Gallery />
      <Contact />
      </main>
      <Footer />
    </>
  );
}
