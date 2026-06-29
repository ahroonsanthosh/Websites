import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import IntroMarquee from "@/components/IntroMarquee";
import Menu from "@/components/Menu";
import ScrollBanner from "@/components/ScrollBanner";
import Story from "@/components/Story";
import Gallery from "@/components/Gallery";
import Visit from "@/components/Visit";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="grain-overlay">
      <Nav />
      <Hero />
      <IntroMarquee />
      <Menu />
      <ScrollBanner />
      <Story />
      <Gallery />
      <Visit />
      <Footer />
    </main>
  );
}
