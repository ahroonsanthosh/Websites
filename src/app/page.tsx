import CustomCursor from "@/components/ui/CustomCursor";
import Preloader from "@/components/ui/Preloader";
import ScrollProgress from "@/components/ui/ScrollProgress";
import DraggableStickers from "@/components/ui/DraggableStickers";
import KineticMarquee from "@/components/ui/KineticMarquee";
import Navigation from "@/components/Navigation";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import HeroSection from "@/components/sections/HeroSection";
import WhyHansumSection from "@/components/sections/WhyHansumSection";
import MenuSection from "@/components/sections/MenuSection";
import GallerySection from "@/components/sections/GallerySection";
import LocationSection from "@/components/sections/LocationSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/Footer";
import {
  getHeroContent,
  getMenuContent,
  getLocationContent,
  getReviewsContent,
  getSettingsContent,
  getGalleryContent,
} from "@/lib/content";

// Re-read content from disk on each request so CMS edits appear immediately.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [hero, menu, location, reviews, settings, gallery] = await Promise.all([
    getHeroContent(),
    getMenuContent(),
    getLocationContent(),
    getReviewsContent(),
    getSettingsContent(),
    getGalleryContent(),
  ]);

  return (
    <main>
      {/* Skip to content for keyboard users */}
      <a href="#menu" className="skip-link">Skip to menu</a>

      {/* Premium intro preloader */}
      <Preloader />

      {/* Noise texture overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Scroll progress indicator */}
      <ScrollProgress />

      {/* Custom cursor (desktop only) */}
      <CustomCursor />

      {/* Playful draggable food stickers + hatching eggs */}
      <DraggableStickers />

      {/* Announcement banner */}
      {settings.announcement_active && (
        <AnnouncementBanner text={settings.announcement_banner} />
      )}

      {/* Navigation */}
      <Navigation />

      {/* Sections */}
      <HeroSection content={hero} />
      <WhyHansumSection />
      <KineticMarquee text="FRESH DAILY · ROTISSERIE COOKED · PIRI PIRI · MARINA MARKET · CORK ·" />
      <MenuSection content={menu} />
      <GallerySection images={gallery.images} />
      <LocationSection content={location} />
      <KineticMarquee text="CHICKEN WORTH LEAVING HOME FOR · @HANSUMCORK ·" dark />
      <ReviewsSection reviews={reviews.reviews} />
      <CTASection />
      <Footer />
    </main>
  );
}
