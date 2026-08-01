import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
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
  badgeText?: string;
  circleClassName?: string;
  className?: string;
}

// Circular text that spins slowly around the hero image
const SpinningBadge = ({ text }: { text: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.6 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.7, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
    className="absolute -right-2 top-4 z-20 h-24 w-24 md:-right-4 md:top-8 md:h-32 md:w-32"
    aria-hidden="true"
  >
    <svg viewBox="0 0 100 100" className="h-full w-full animate-spin-slow">
      <defs>
        <path id="badge-circle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
      </defs>
      <circle cx="50" cy="50" r="49" className="fill-espresso-900" />
      <text className="fill-cream-50 font-sans text-[6.8px] font-semibold uppercase tracking-[0.14em]">
        <textPath href="#badge-circle">{text}</textPath>
      </text>
    </svg>
    <span className="absolute inset-0 flex items-center justify-center font-serif text-xl text-amber-brand">✦</span>
  </motion.div>
);

// Helper component for navigation links
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="relative text-xs font-medium uppercase tracking-[0.2em] text-foreground/70 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-rust-600 after:transition-transform after:duration-300 hover:text-foreground hover:after:origin-left hover:after:scale-x-100"
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
  badgeText,
  circleClassName,
  className,
}: MinimalistHeroProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  // Gentle parallax: circle drifts down, photo drifts up as you scroll away
  const { scrollY } = useScroll();
  const circleY = useTransform(scrollY, [0, 700], [0, reduceMotion ? 0 : 90]);
  const imageY = useTransform(scrollY, [0, 700], [0, reduceMotion ? 0 : -70]);
  const textY = useTransform(scrollY, [0, 700], [0, reduceMotion ? 0 : 40]);

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
          {logoAccent && <span className="text-poppy">{logoAccent}</span>}
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
      <div className="relative grid w-full max-w-7xl flex-grow grid-cols-1 items-center gap-6 py-8 lg:grid-cols-3 lg:gap-0 lg:py-0">
        {/* Left Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="z-20 order-3 text-center lg:order-1 lg:text-left"
        >
          <p className="mx-auto max-w-xs text-sm leading-relaxed text-foreground/80 lg:mx-0">{mainText}</p>
          <a
            href={readMoreLink}
            className="mt-4 inline-block text-sm font-medium text-foreground underline decoration-rust-600 decoration-2 underline-offset-4 transition-colors hover:text-rust-600"
          >
            {readMoreLabel}
          </a>
        </motion.div>

        {/* Center Image with Circle */}
        <div className="relative order-2 flex h-full min-h-[340px] items-center justify-center lg:min-h-0">
          <motion.div
            style={{ y: circleY }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className={cn(
              'absolute z-0 h-[280px] w-[280px] rounded-full bg-amber-brand/90 md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]',
              circleClassName
            )}
          ></motion.div>
          <motion.div style={{ y: imageY }} className="relative z-10">
            <motion.img
              src={imageSrc}
              alt={imageAlt}
              loading="eager"
              fetchPriority="high"
              width={288}
              height={416}
              className="h-80 w-56 rounded-full object-cover object-[50%_65%] shadow-2xl shadow-espresso-900/30 md:h-[26rem] md:w-64 lg:h-[30rem] lg:w-72"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://placehold.co/400x600/E8A33D/2C2016?text=Maddens';
              }}
            />
            {badgeText && <SpinningBadge text={badgeText} />}
          </motion.div>
        </div>

        {/* Right Text */}
        <motion.div style={{ y: textY }} className="z-20 order-1 min-w-0 pt-2 lg:order-3 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex items-center justify-center text-center lg:justify-start lg:text-left"
          >
            <h1 className="font-serif text-5xl font-semibold leading-[0.95] text-foreground sm:text-6xl md:text-7xl lg:text-[clamp(3.25rem,6.5vw,6rem)]">
              {overlayText.part1}
              <br />
              <span className="italic text-poppy">{overlayText.part2}</span>
            </h1>
          </motion.div>
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
