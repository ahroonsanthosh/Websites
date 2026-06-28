'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, ArrowDown, Menu, X } from 'lucide-react';

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

const InfiniteGallery = dynamic(
  () => import('@/components/ui/3d-gallery-photography'),
  { ssr: false }
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const cafeImages = [
  { src: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80', alt: 'Café interior' },
  { src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&auto=format&fit=crop&q=80', alt: 'Espresso' },
  { src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&auto=format&fit=crop&q=80', alt: 'Morning coffee' },
  { src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&auto=format&fit=crop&q=80', alt: 'Café atmosphere' },
  { src: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&auto=format&fit=crop&q=80', alt: 'Coffee preparation' },
  { src: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1200&auto=format&fit=crop&q=80', alt: 'Latte art' },
  { src: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&auto=format&fit=crop&q=80', alt: 'Café corner' },
  { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&auto=format&fit=crop&q=80', alt: 'Brunch plate' },
  { src: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1200&auto=format&fit=crop&q=80', alt: 'Fresh pastry' },
];

const hours = [
  { day: 'Monday',    time: '7:30 am – 3 pm' },
  { day: 'Tuesday',   time: '7:30 am – 3 pm' },
  { day: 'Wednesday', time: '7:30 am – 3 pm' },
  { day: 'Thursday',  time: '7:30 am – 3 pm' },
  { day: 'Friday',    time: '7:30 am – 3 pm' },
  { day: 'Saturday',  time: '9 am – 3 pm' },
  { day: 'Sunday',    time: '9:30 am – 3 pm' },
];

const menuItems = [
  {
    category: 'Coffee',
    items: ['Espresso', 'Flat White', 'Cortado', 'Filter', 'Cold Brew', 'Oat Latte'],
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80',
  },
  {
    category: 'Food',
    items: ['Avocado Toast', 'Eggs Benedict', 'Granola Bowl', 'Sourdough & Butter', 'Seasonal Salad', 'House Scone'],
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
  },
  {
    category: 'Pastry',
    items: ['Croissant', 'Pain au Chocolat', 'Banana Bread', 'Almond Tart', 'Morning Bun', 'Kouign-Amann'],
    img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
  },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = ['About', 'Menu', 'Visit'];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(26,15,10,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(181,118,58,0.15)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <a href="#" className="font-display text-xl text-[var(--cream)]" style={{ letterSpacing: '0.22em' }}>
            5 POINTS
          </a>
          <div className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`}
                className="nav-link text-[11px] uppercase tracking-widest text-[var(--stone)] hover:text-[var(--cream)] transition-colors">
                {l}
              </a>
            ))}
            <a href="https://www.instagram.com/5pointscafecork/" target="_blank" rel="noopener noreferrer"
              className="text-[var(--stone)] hover:text-[var(--copper)] transition-colors" aria-label="Instagram">
              <InstagramIcon size={16} />
            </a>
          </div>
          <button className="md:hidden text-[var(--cream)] p-1" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <div
        className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 transition-all duration-500"
        style={{
          background: 'rgba(26,15,10,0.97)',
          backdropFilter: 'blur(20px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transform: open ? 'translateY(0)' : 'translateY(-12px)',
        }}
      >
        {links.map((l) => (
          <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
            className="font-display text-5xl italic text-[var(--cream)] hover:text-[var(--copper)] transition-colors">
            {l}
          </a>
        ))}
        <a href="https://www.instagram.com/5pointscafecork/" target="_blank" rel="noopener noreferrer"
          className="text-[var(--stone)] hover:text-[var(--copper)] transition-colors mt-4">
          <InstagramIcon size={22} />
        </a>
      </div>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden" aria-label="Hero">
      <InfiniteGallery
        images={cafeImages}
        speed={1.1}
        visibleCount={12}
        className="absolute inset-0 w-full h-full"
        fadeSettings={{ fadeIn: { start: 0.05, end: 0.25 }, fadeOut: { start: 0.4, end: 0.43 } }}
        blurSettings={{ blurIn: { start: 0.0, end: 0.1 }, blurOut: { start: 0.4, end: 0.43 }, maxBlur: 6.0 }}
      />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(26,15,10,0.05) 0%, rgba(26,15,10,0.72) 100%)' }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none mix-blend-exclusion">
        <p className="opacity-0-start animate-reveal-fade delay-200 text-[10px] uppercase tracking-[0.35em] text-[var(--copper)] mb-6">
          Victorian Quarter · Cork City
        </p>
        <h1 className="font-display opacity-0-start animate-reveal-up delay-300 text-[clamp(3.5rem,10vw,9rem)] leading-none tracking-tight text-white">
          5 Points
        </h1>
        <p className="font-display italic opacity-0-start animate-reveal-fade delay-500 text-[clamp(1rem,2.5vw,1.5rem)] text-white/60 mt-3">
          Coffee. Food. Community.
        </p>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0-start animate-reveal-fade delay-800">
        <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--stone)]">Scroll</span>
        <ArrowDown size={14} strokeWidth={1.5} className="text-[var(--copper)] scroll-indicator" />
      </div>
    </section>
  );
}

// ─── Marquee ticker ───────────────────────────────────────────────────────────

function Ticker() {
  const items = ['Specialty Coffee', 'Seasonal Menu', 'MacCurtain Street', 'Open Daily', 'Victorian Quarter', 'Cork City', 'Breakfast & Lunch'];
  const repeated = [...items, ...items];
  return (
    <div className="overflow-hidden py-4 border-y border-[rgba(181,118,58,0.12)] bg-[var(--bark)]"
      style={{ maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)' }}>
      <div className="flex gap-10 whitespace-nowrap"
        style={{ animation: 'ticker 22s linear infinite', width: 'max-content' }}>
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-10 text-[10px] uppercase tracking-[0.3em] text-[var(--stone)]">
            {item}
            <span className="text-[var(--copper)] opacity-60">·</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function About() {
  const { ref, inView } = useInView();
  return (
    <section id="about" className="py-28 md:py-40 px-6 md:px-10 max-w-7xl mx-auto" ref={ref}>
      <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--copper)] mb-6 transition-all duration-700"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)' }}>
            Our Story
          </p>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.1] text-[var(--cream)] mb-8"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(20px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s' }}>
            A corner of calm<br />
            <span className="italic text-[var(--stone)]">on MacCurtain St.</span>
          </h2>
          <div className="space-y-5 text-[var(--stone)] leading-relaxed text-[0.95rem]"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)', transition: 'all 0.7s ease 0.2s' }}>
            <p>
              5 Points sits at the heart of Cork's Victorian Quarter — a neighbourhood café that takes its
              craft seriously without taking itself too seriously. Since opening our doors at 59 MacCurtain
              Street, we've become the morning ritual of choice for a community that values good coffee,
              honest food, and a seat that's always warm.
            </p>
            <p>
              We source seasonally, roast with care, and plate with intention. Whether you're in for a
              quick flat white or a long breakfast with the paper, this place is yours.
            </p>
          </div>
          <div className="flex gap-10 mt-10 pt-10 border-t border-[rgba(181,118,58,0.2)]"
            style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.7s ease 0.35s' }}>
            {[['7:30', 'Opens weekdays'], ['3 pm', 'Kitchen closes'], ['59', 'MacCurtain St']].map(([n, l]) => (
              <div key={n}>
                <div className="font-display text-3xl text-[var(--copper)]">{n}</div>
                <div className="text-[10px] uppercase tracking-widest text-[var(--stone)] mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[480px] md:h-[600px]"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateX(24px)', transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s' }}>
          <div className="img-zoom absolute inset-0 overflow-hidden" style={{ borderRadius: '2px' }}>
            <img src={cafeImages[3].src} alt="5 Points Café" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="absolute -bottom-6 -left-6 md:-left-10 bg-[var(--bark)] border border-[rgba(181,118,58,0.25)] p-5 w-44 animate-float"
            style={{ borderRadius: '2px' }}>
            <div className="font-display text-3xl text-[var(--copper)]">★</div>
            <div className="text-[var(--cream)] text-sm mt-2 leading-snug font-display italic">"Best flat white in Cork"</div>
            <div className="text-[8px] uppercase tracking-widest text-[var(--stone)] mt-2">Google Reviews</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Menu ─────────────────────────────────────────────────────────────────────

function MenuSection() {
  const { ref, inView } = useInView();
  return (
    <section id="menu" className="py-24 md:py-36 px-6 md:px-10 bg-[var(--bark)]" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--copper)] mb-4"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(12px)', transition: 'all 0.7s ease' }}>
            What We Do
          </p>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] text-[var(--cream)]"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)', transition: 'all 0.7s ease 0.1s' }}>
            The Menu
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {menuItems.map((cat, i) => (
            <div key={cat.category} className="menu-card bg-[var(--espresso)] overflow-hidden" style={{
              borderRadius: '2px',
              opacity: inView ? 1 : 0,
              transform: inView ? 'none' : 'translateY(24px)',
              transition: `opacity 0.7s ease ${i * 0.12}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`,
            }}>
              <div className="img-zoom h-56 w-full">
                <img src={cat.img} alt={cat.category} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-7">
                <h3 className="font-display text-2xl text-[var(--cream)] mb-5">{cat.category}</h3>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[var(--stone)] text-sm group">
                      <span className="w-4 h-px bg-[var(--copper)] opacity-40 group-hover:opacity-100 group-hover:w-6 transition-all duration-300" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-[var(--stone)] text-sm mt-10"
          style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.7s ease 0.5s' }}>
          Menu changes seasonally · Ask your server for today's specials
        </p>
      </div>
    </section>
  );
}

// ─── Gallery strip ────────────────────────────────────────────────────────────

function GalleryStrip() {
  const { ref, inView } = useInView(0.1);
  return (
    <section className="py-20 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-10 flex items-center justify-between">
        <h2 className="font-display italic text-[clamp(1.8rem,3.5vw,2.8rem)] text-[var(--cream)]"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(12px)', transition: 'all 0.7s ease' }}>
          From Our Tables
        </h2>
        <a href="https://www.instagram.com/5pointscafecork/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[var(--copper)] hover:text-[var(--cream)] transition-colors">
          <InstagramIcon size={14} />
          Follow
        </a>
      </div>
      <div className="flex gap-4 pl-6 md:pl-10 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
        {cafeImages.map((img, i) => (
          <div key={i} className="img-zoom flex-shrink-0 w-64 h-80 md:w-80 md:h-96" style={{
            borderRadius: '2px',
            opacity: inView ? 1 : 0,
            transition: `opacity 0.6s ease ${i * 0.07}s`,
          }}>
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
          </div>
        ))}
        <div className="flex-shrink-0 w-6" />
      </div>
    </section>
  );
}

// ─── Visit ────────────────────────────────────────────────────────────────────

function Visit() {
  const { ref, inView } = useInView();
  const today = new Date().toLocaleDateString('en-IE', { weekday: 'long' });

  return (
    <section id="visit" className="py-28 md:py-40 px-6 md:px-10 bg-[var(--bark)]" ref={ref}>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24">
        {/* Hours */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--copper)] mb-5"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(12px)', transition: 'all 0.7s ease' }}>
            Opening Hours
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] text-[var(--cream)] mb-8"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)', transition: 'all 0.7s ease 0.1s' }}>
            Come find us
          </h2>
          <div className="space-y-0" style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.7s ease 0.2s' }}>
            {hours.map(({ day, time }) => {
              const isToday = day === today;
              return (
                <div key={day} className="hours-row flex justify-between items-center py-3 px-3 cursor-default"
                  style={{ borderBottom: '1px solid rgba(181,118,58,0.1)' }}>
                  <span className={`text-sm ${isToday ? 'text-[var(--copper)]' : 'text-[var(--stone)]'}`}
                    style={{ fontWeight: isToday ? 500 : 300 }}>
                    {day}
                    {isToday && <span className="ml-2 text-[9px] uppercase tracking-widest opacity-70"> · Today</span>}
                  </span>
                  <span className={`text-sm font-display ${isToday ? 'text-[var(--cream)]' : 'text-[var(--stone)]'}`}>
                    {time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Location */}
        <div style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateX(20px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s' }}>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--copper)] mb-5">Find Us</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] text-[var(--cream)] mb-8">How to reach us</h2>
          <div className="space-y-6 mb-10">
            {[
              { icon: <MapPin size={16} strokeWidth={1.5} className="text-[var(--copper)] mt-1 flex-shrink-0" />,
                content: <div className="text-[var(--cream)] text-sm leading-relaxed">59 MacCurtain Street<br />Victorian Quarter<br />Cork, T23 F9DT</div> },
              { icon: <Phone size={16} strokeWidth={1.5} className="text-[var(--copper)] flex-shrink-0" />,
                content: <a href="tel:0212412168" className="text-[var(--cream)] text-sm hover:text-[var(--copper)] transition-colors">(021) 241 2168</a> },
              { icon: <InstagramIcon size={16} />,
                content: <a href="https://www.instagram.com/5pointscafecork/" target="_blank" rel="noopener noreferrer" className="text-[var(--cream)] text-sm hover:text-[var(--copper)] transition-colors">@5pointscafecork</a> },
            ].map(({ icon, content }, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <div className="group-hover:scale-110 transition-transform duration-300 mt-0.5">{icon}</div>
                {content}
              </div>
            ))}
          </div>
          <div className="overflow-hidden" style={{ borderRadius: '2px', height: 220 }}>
            <iframe
              title="5 Points Café map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2461.7!2d-8.4707!3d51.9023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4844902a6e4e4e3d%3A0xc2d1a4f0b7e8e9a0!2s59%20MacCurtain%20St%2C%20Cork%2C%20Ireland!5e0!3m2!1sen!2sie!4v1234567890"
              width="100%" height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) saturate(0.4)' }}
              loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-14 px-6 md:px-10 border-t border-[rgba(181,118,58,0.15)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-display text-lg text-[var(--stone)]" style={{ letterSpacing: '0.22em' }}>5 POINTS</div>
        <p className="text-[var(--stone)] text-[11px] text-center leading-loose">
          59 MacCurtain Street, Cork<br className="md:hidden" />
          <span className="hidden md:inline"> · </span>
          Mon–Fri 7:30 am – 3 pm · Sat 9 am – 3 pm · Sun 9:30 am – 3 pm
        </p>
        <a href="https://www.instagram.com/5pointscafecork/" target="_blank" rel="noopener noreferrer"
          className="text-[var(--stone)] hover:text-[var(--copper)] transition-colors" aria-label="Instagram">
          <InstagramIcon size={16} />
        </a>
      </div>
      <p className="text-center text-[var(--stone)] text-[10px] mt-6 opacity-40">
        © {new Date().getFullYear()} 5 Points Café · All rights reserved
      </p>
    </footer>
  );
}

// ─── Cursor ───────────────────────────────────────────────────────────────────

function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setVisible(true);
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) {
        dot.current.style.left = `${e.clientX}px`;
        dot.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', onMove);
    let raf: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.1);
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.1);
      if (ring.current) {
        ring.current.style.left = `${ringPos.current.x}px`;
        ring.current.style.top = `${ringPos.current.y}px`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  if (!visible) return null;

  return (
    <>
      <div ref={dot} style={{ position: 'fixed', width: 6, height: 6, background: 'var(--copper)', borderRadius: '50%', pointerEvents: 'none', zIndex: 9999, transform: 'translate(-50%,-50%)', top: 0, left: 0 }} />
      <div ref={ring} style={{ position: 'fixed', width: 30, height: 30, border: '1px solid rgba(181,118,58,0.45)', borderRadius: '50%', pointerEvents: 'none', zIndex: 9998, transform: 'translate(-50%,-50%)', top: 0, left: 0 }} />
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="bg-[var(--espresso)] text-[var(--cream)]">
      <CustomCursor />
      <Nav />
      <Hero />
      <Ticker />
      <About />
      <div className="divider-line" />
      <MenuSection />
      <div className="divider-line" />
      <GalleryStrip />
      <div className="divider-line" />
      <Visit />
      <Footer />
    </main>
  );
}
