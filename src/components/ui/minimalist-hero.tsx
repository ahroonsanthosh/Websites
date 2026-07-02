import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the props interface for type safety and reusability
interface MinimalistHeroProps {
  logoText: string;
  logoAccent?: string;
  navLinks: { label: string; href: string }[];
  mainText: string;
  readMoreLink: string;
  readMoreLabel?: string;
  imageSrc: string;
  imageAlt: string;
  overlayText: {
    part1: string;
    part2: string;
  };
  socialLinks: { icon: LucideIcon; href: string; label: string }[];
  locationText: string;
  circleClassName?: string;
  className?: string;
}

// Helper component for navigation links
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/60 transition-colors hover:text-foreground"
  >
    {children}
  </a>
);

// Helper component for social media icons
const SocialIcon = ({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="text-foreground/60 transition-colors hover:text-foreground"
  >
    <Icon className="h-5 w-5" />
  </a>
);

// The main reusable Hero Section component
export const MinimalistHero = ({
  logoText,
  logoAccent,
  navLinks,
  mainText,
  readMoreLink,
  readMoreLabel = 'Read More',
  imageSrc,
  imageAlt,
  overlayText,
  socialLinks,
  locationText,
  circleClassName,
  className,
}: MinimalistHeroProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={cn(
        'relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-background p-6 font-sans sm:p-8 md:p-12',
        className
      )}
    >
      {/* Header */}
      <header className="z-30 flex w-full max-w-7xl items-center justify-between">
        <motion.a
          href="#top"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="font-serif text-2xl font-bold tracking-wide"
        >
          {logoText}
          {logoAccent && <span className="text-amber-brand">{logoAccent}</span>}
        </motion.a>
        <div className="hidden items-center space-x-8 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.label} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </div>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col space-y-1.5 md:hidden"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <span className="block h-0.5 w-6 bg-foreground"></span>
          <span className="block h-0.5 w-6 bg-foreground"></span>
          <span className="block h-0.5 w-5 bg-foreground"></span>
        </motion.button>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-background/95 backdrop-blur-md md:hidden"
          >
            <button
              className="absolute right-6 top-7 text-foreground"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <X className="h-7 w-7" />
            </button>
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.35 }}
                onClick={() => setMenuOpen(false)}
                className="font-serif text-3xl font-medium tracking-wide text-foreground"
              >
                {link.label}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="relative grid w-full max-w-7xl flex-grow grid-cols-1 items-center gap-6 py-8 md:grid-cols-3 md:gap-0 md:py-0">
        {/* Left Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="z-20 order-2 text-center md:order-1 md:text-left"
        >
          <p className="mx-auto max-w-xs text-sm leading-relaxed text-foreground/80 md:mx-0">{mainText}</p>
          <a
            href={readMoreLink}
            className="mt-4 inline-block text-sm font-medium text-foreground underline decoration-amber-brand decoration-2 underline-offset-4 transition-colors hover:text-amber-brand"
          >
            {readMoreLabel}
          </a>
        </motion.div>

        {/* Center Image with Circle */}
        <div className="relative order-1 flex h-full min-h-[320px] items-center justify-center md:order-2 md:min-h-0">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className={cn(
              'absolute z-0 h-[280px] w-[280px] rounded-full bg-amber-brand/90 md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]',
              circleClassName
            )}
          ></motion.div>
          <motion.img
            src={imageSrc}
            alt={imageAlt}
            loading="eager"
            className="relative z-10 h-72 w-52 rounded-t-full object-cover shadow-2xl shadow-espresso-900/30 md:h-96 md:w-64 lg:h-[26rem] lg:w-72"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'https://placehold.co/400x600/E8A33D/2C2016?text=Maddens';
            }}
          />
        </div>

        {/* Right Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="z-20 order-3 flex min-w-0 items-center justify-center text-center md:justify-start md:text-left"
        >
          <h1 className="font-serif text-5xl font-semibold leading-[0.95] text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            {overlayText.part1}
            <br />
            <span className="italic text-amber-brand">{overlayText.part2}</span>
          </h1>
        </motion.div>
      </div>

      {/* Footer Elements */}
      <footer className="z-30 flex w-full max-w-7xl items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex items-center space-x-4"
        >
          {socialLinks.map((link) => (
            <SocialIcon key={link.label} href={link.href} icon={link.icon} label={link.label} />
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.3 }}
          className="text-sm font-medium text-foreground/80"
        >
          {locationText}
        </motion.div>
      </footer>
    </div>
  );
};
