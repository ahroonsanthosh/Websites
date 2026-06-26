import { Navbar } from "@/components/Navbar";
import { ScrollExpansionHero } from "@/components/ui/scroll-expansion-hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { MenuPreviewScroll } from "@/components/MenuPreviewScroll";
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
        imageSrc="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1800&q=85"
        imageAlt="Hot chocolate at Cocoa cafe Cork — warm, indulgent, handcrafted"
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
      <MenuPreviewScroll />
      <Menu />
      <Gallery />
      <Contact />
      </main>
      <Footer />
    </>
  );
}
