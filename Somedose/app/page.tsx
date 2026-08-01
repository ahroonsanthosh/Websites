import { getContent } from "@/lib/content";
import { SomeDoseHero } from "@/components/ui/cinematic-landing-hero";
import MenuSection from "@/components/sections/MenuSection";
import LocationsSection from "@/components/sections/LocationsSection";
import HoursSection from "@/components/sections/HoursSection";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";

export default function Home() {
  const data = getContent();
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <SomeDoseHero />
      <MenuSection categories={data.menu.categories} />
      <LocationsSection locations={data.locations} />
      <HoursSection hours={data.hours} />
      <Footer locations={data.locations} instagram={data.site.instagram} />
    </main>
  );
}
