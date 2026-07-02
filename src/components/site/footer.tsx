import { Facebook, Instagram, MapPin } from 'lucide-react';

const socials = [
  { icon: Instagram, href: 'https://www.instagram.com/maddenstralee/', label: 'Instagram' },
  { icon: Facebook, href: 'https://www.facebook.com/maddenscoffee/', label: 'Facebook' },
  {
    icon: MapPin,
    href: 'https://www.tripadvisor.ie/Restaurant_Review-g186613-d20224953-Reviews-Maddens-Tralee_County_Kerry.html',
    label: 'Tripadvisor',
  },
];

export function Footer() {
  return (
    <footer className="bg-espresso-900 px-6 py-12 text-cream-100">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <p className="font-serif text-3xl font-semibold">
          Madden's<span className="text-amber-brand">.</span>
        </p>
        <p className="max-w-md text-sm leading-relaxed text-cream-100/60">
          Coffee, brunch & baked things down Milk Market Lane, Tralee. Open Monday to Saturday, 10am – 4pm.
        </p>
        <div className="flex items-center gap-5">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="inline-block text-cream-100/60 transition-all duration-300 hover:-translate-y-1 hover:text-amber-brand"
            >
              <s.icon className="h-5 w-5" />
            </a>
          ))}
        </div>
        <p className="text-xs text-cream-100/40">
          © {new Date().getFullYear()} Madden's, Tralee. Made with love (and a lot of coffee).
        </p>
      </div>
    </footer>
  );
}
