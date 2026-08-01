'use client';
import type { SiteContent } from '@/types/content';
import CustomCursor from '@/components/CustomCursor';
import ScrollProgress from '@/components/ScrollProgress';
import Navigation from '@/components/Navigation';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Menu from '@/components/sections/Menu';
import Gallery from '@/components/sections/Gallery';
import Hours from '@/components/sections/Hours';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';

export default function ClientPage({ content }: { content: SiteContent }) {
  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Navigation />
      <main>
        <Hero content={content} />
        <About content={content} />
        <Menu content={content} />
        <Gallery content={content} />
        <Hours content={content} />
        <Contact content={content} />
      </main>
      <Footer content={content} />
    </>
  );
}
