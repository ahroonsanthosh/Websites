import { Facebook, Instagram, MapPin } from 'lucide-react';
import { MinimalistHero } from '@/components/ui/minimalist-hero';
import { BackgroundCircles } from '@/components/ui/background-circles';
import { About } from '@/components/site/about';
import { Menu } from '@/components/site/menu';
import { Gallery } from '@/components/site/gallery';
import { Testimonials } from '@/components/site/testimonials';
import { Visit } from '@/components/site/visit';
import { Footer } from '@/components/site/footer';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Menu', href: '#menu' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Visit', href: '#visit' },
];

const socialLinks = [
  { icon: Instagram, href: 'https://www.instagram.com/maddenstralee/', label: 'Instagram' },
  { icon: Facebook, href: 'https://www.facebook.com/maddenscoffee/', label: 'Facebook' },
  {
    icon: MapPin,
    href: 'https://www.tripadvisor.ie/Restaurant_Review-g186613-d20224953-Reviews-Maddens-Tralee_County_Kerry.html',
    label: 'Tripadvisor',
  },
];

function App() {
  return (
    <main id="top">
      <MinimalistHero
        logoText="Maddens"
        logoAccent="."
        navLinks={navLinks}
        mainText="A small, sunny coffee house down Milk Market Lane — speciality coffee, proper brunch and pastries baked the slow way, served with a Kerry welcome."
        readMoreLink="#about"
        readMoreLabel="Our Story"
        imageSrc="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80"
        imageAlt="A freshly made latte in a ceramic cup at Maddens"
        overlayText={{ part1: 'slow', part2: 'mornings.' }}
        socialLinks={socialLinks}
        locationText="Tralee, Co. Kerry"
      />
      <About />
      <Menu />
      <Gallery />
      <Testimonials />
      <Visit />
      <BackgroundCircles
        title="Come say hello"
        description="We're pouring Monday to Saturday, 10am to 4pm, down Milk Market Lane. First visit? The flat white and a fruit scone is the classic order."
        variant="tertiary"
        className="min-h-[80vh]"
      >
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="https://maps.google.com/?q=Maddens,+11-12+Milk+Market+Ln,+Tralee,+Co.+Kerry"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-espresso-900 px-8 py-3.5 font-medium text-cream-50 shadow-lg shadow-espresso-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-espresso-800"
          >
            Get Directions
          </a>
          <a
            href="tel:+353858570644"
            className="rounded-full border-2 border-espresso-900/20 px-8 py-3.5 font-medium text-espresso-900 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-brand hover:text-amber-brand"
          >
            085 857 0644
          </a>
        </div>
      </BackgroundCircles>
      <Footer />
    </main>
  );
}

export default App;
