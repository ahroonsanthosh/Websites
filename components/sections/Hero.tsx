'use client';
import { Instagram } from 'lucide-react';
import { MinimalistHero } from '@/components/ui/minimalist-hero';
import type { SiteContent } from '@/types/content';

const navLinks: { label: string; href: string }[] = [];

export default function Hero({ content }: { content: SiteContent }) {
  const { hero, site } = content;

  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="top">
      <MinimalistHero
        logoText="LOKA"
        navLinks={navLinks}
        mainText={hero.mainText}
        readMoreLink="#about"
        imageSrc={hero.image}
        imageAlt="LOKA Coffee Shop"
        overlayText={{ part1: hero.overlayPart1, part2: hero.overlayPart2 }}
        socialLinks={[{ icon: Instagram, href: site.instagram }]}
        locationText="Tralee, Co. Kerry"
        circleClassName="bg-coffee-200/50"
        onNavClick={handleNav}
      />
    </section>
  );
}
