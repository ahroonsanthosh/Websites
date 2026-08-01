import HeroSection from "@/components/HeroSection"
import MarqueeSection from "@/components/MarqueeSection"
import AboutSection from "@/components/AboutSection"
import PhilosophySection from "@/components/PhilosophySection"
import MenuSection from "@/components/MenuSection"
import GallerySection from "@/components/GallerySection"
import HoursSection from "@/components/HoursSection"
import FooterSection from "@/components/FooterSection"
import PageIntro from "@/components/PageIntro"
import CursorFollower from "@/components/CursorFollower"

export default function Home() {
  return (
    <>
      <PageIntro />
      <CursorFollower />
      <main>
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <PhilosophySection />
        <MenuSection />
        <GallerySection />
        <HoursSection />
        <FooterSection />
      </main>
    </>
  )
}
