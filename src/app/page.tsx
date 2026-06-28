import { getSiteData } from '@/lib/content';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import About from '@/components/About';
import MenuSection from '@/components/MenuSection';
import Gallery from '@/components/Gallery';
import Visit from '@/components/Visit';
import Footer from '@/components/Footer';

export default async function Home() {
  const data = await getSiteData();

  return (
    <>
      <Nav />
      <main id="main-content">
        <Hero />
        <About about={data.about} />
        <MenuSection
          breakfast={data.menu.breakfast}
          lunch={data.menu.lunch}
          drinks={data.menu.drinks}
        />
        <Gallery captions={data.galleryCaptions} />
        <Visit hours={data.hours} contact={data.contact} />
      </main>
      <Footer />
    </>
  );
}
