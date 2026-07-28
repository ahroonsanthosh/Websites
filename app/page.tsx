import { Navigation } from "@/components/sections/Navigation";
import { CafeCinematicHero } from "@/components/ui/cinematic-cafe-hero";
import { MenuSection } from "@/components/sections/MenuSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { ContactSection } from "@/components/sections/ContactSection";
import { FooterSection } from "@/components/sections/FooterSection";

const R = "https://raw.githubusercontent.com/ahroonsanthosh/Brightside/main";

export default function Home() {
  return (
    <main className="relative overflow-x-hidden">
      <Navigation />

      {/* Hero 1: coffee cup floats in from the right */}
      <CafeCinematicHero
        instanceId="hero1"
        tagline1="Good mornings,"
        tagline2="start here."
        cardHeading="Specialty, coffee."
        cardDescription={
          <>
            Freshly pulled espresso, single-origin beans and a warm corner on{" "}
            <span className="text-white font-semibold">Washington Street</span> — open every
            weekday from 8am.
          </>
        }
        badge1Text="Washington St, Cork"
        badge1Sub="23a, City Centre"
        badge1Emoji="📍"
        badge2Text="Mon – Fri"
        badge2Sub="8 am – 3 pm"
        badge2Emoji="☕"
        ctaHeading="Come in. Sit down."
        ctaDescription="Bright Side is your neighbourhood café where every morning tastes like it should."
        ctaPrimaryLabel="Find Us"
        ctaPrimaryHref="#contact"
        ctaSecondaryLabel="See the Menu"
        ctaSecondaryHref="#menu"
        productImageSrc={R + "/Screenshot%202026-06-26%20111049.png"}
        productImageAlt="Bright Side specialty flat white with latte art"
        scrollLength={6800}
      />

      <MenuSection />

      {/* Hero 2: food bowl floats in from the right */}
      <CafeCinematicHero
        instanceId="hero2"
        tagline1="Eat well,"
        tagline2="feel bright."
        cardHeading="Made fresh, daily."
        cardDescription={
          <>
            From house-baked cinnamon rolls to seasonal granola bowls — every dish is made with
            care and served the way{" "}
            <span className="text-white font-semibold">Cork deserves</span>.
          </>
        }
        badge1Text="Made in-house"
        badge1Sub="Fresh every morning"
        badge1Emoji="🌿"
        badge2Text="Seasonal menu"
        badge2Sub="Local ingredients"
        badge2Emoji="🍃"
        ctaHeading="Taste the difference."
        ctaDescription="Drop in any weekday and try what everyone in Cork is talking about."
        ctaPrimaryLabel="See Gallery"
        ctaPrimaryHref="#gallery"
        ctaSecondaryLabel="Find Us"
        ctaSecondaryHref="#contact"
        productImageSrc={R + "/Screenshot%202026-06-26%20111113.png"}
        productImageAlt="Bright Side fresh food bowl"
        scrollLength={6200}
      />

      <GallerySection />

      <ContactSection />

      <FooterSection />
    </main>
  );
}
