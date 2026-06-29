'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MinimalistHeroProps {
  logoText: string;
  navLinks: { label: string; href: string }[];
  mainText: string;
  readMoreLink: string;
  imageSrc: string;
  imageAlt: string;
  overlayText: { part1: string; part2: string };
  socialLinks: { icon: LucideIcon; href: string }[];
  locationText: string;
  className?: string;
  circleClassName?: string;
  onNavClick?: (href: string) => void;
}

const NavLink = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <a
    href={href}
    onClick={onClick}
    className="hover-underline text-xs font-medium tracking-widest text-coffee-700/60 transition-colors hover:text-coffee-700 uppercase"
  >
    {children}
  </a>
);

const SocialIcon = ({ href, icon: Icon }: { href: string; icon: LucideIcon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-coffee-700/50 transition-colors hover:text-coffee-700"
  >
    <Icon className="h-4 w-4" />
  </a>
);

export const MinimalistHero = ({
  logoText,
  navLinks,
  mainText,
  readMoreLink,
  imageSrc,
  imageAlt,
  overlayText,
  socialLinks,
  locationText,
  className,
  circleClassName,
  onNavClick,
}: MinimalistHeroProps) => {
  return (
    <div
      className={cn(
        'relative flex h-screen w-full flex-col items-center justify-between overflow-hidden bg-cream-100 px-6 py-8 font-body md:px-12 md:py-10',
        className
      )}
    >
      {/* Header */}
      <header className="z-30 flex w-full max-w-7xl items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-xl font-bold tracking-[0.15em] text-coffee-800"
        >
          {logoText}
        </motion.div>
        <nav className="hidden items-center space-x-8 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.label} href={link.href} onClick={onNavClick ? () => onNavClick(link.href) : undefined}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col space-y-1.5 md:hidden"
          aria-label="Open menu"
        >
          <span className="block h-px w-6 bg-coffee-800" />
          <span className="block h-px w-6 bg-coffee-800" />
          <span className="block h-px w-4 bg-coffee-800" />
        </motion.button>
      </header>

      {/* Main content */}
      <div className="relative grid w-full max-w-7xl flex-grow grid-cols-1 items-center md:grid-cols-3">
        {/* Left: tagline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="z-20 order-2 md:order-1 text-center md:text-left"
        >
          <p className="mx-auto max-w-[220px] text-sm leading-relaxed text-coffee-700/70 md:mx-0">
            {mainText}
          </p>
          <a
            href={readMoreLink}
            className="hover-underline mt-5 inline-block text-xs font-medium uppercase tracking-widest text-coffee-600"
          >
            Our Story
          </a>
        </motion.div>

        {/* Center: image in circle */}
        <div className="relative order-1 md:order-2 flex justify-center items-center h-full py-8 md:py-0">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className={cn(
              'absolute z-0 h-[280px] w-[280px] rounded-full md:h-[380px] md:w-[380px] lg:h-[460px] lg:w-[460px]',
              circleClassName ?? 'bg-coffee-200/60'
            )}
          />
          <motion.img
            src={imageSrc}
            alt={imageAlt}
            className="relative z-10 h-[320px] w-[240px] object-cover md:h-[420px] md:w-[320px] lg:h-[500px] lg:w-[380px] rounded-2xl shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              t.onerror = null;
              t.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80';
            }}
          />
        </div>

        {/* Right: large type */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="z-20 order-3 flex items-center justify-center text-center md:justify-end md:text-right"
        >
          <h1 className="font-display text-6xl font-extrabold leading-none text-coffee-800 md:text-7xl lg:text-8xl">
            {overlayText.part1}
            <br />
            <span className="italic font-light">{overlayText.part2}</span>
          </h1>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="z-30 flex w-full max-w-7xl items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center space-x-4"
        >
          {socialLinks.map((link, i) => (
            <SocialIcon key={i} href={link.href} icon={link.icon} />
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs font-medium uppercase tracking-widest text-coffee-700/50"
        >
          {locationText}
        </motion.div>
      </footer>
    </div>
  );
};
