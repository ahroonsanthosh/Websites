const links = [
  { label: "About",    href: "#about"   },
  { label: "Menu",     href: "#menu"    },
  { label: "Gallery",  href: "#gallery" },
  { label: "Contact",  href: "#contact" },
];
const social = [
  { label: "Instagram", href: "https://www.instagram.com/cocoacafecork/" },
  { label: "Facebook",  href: "https://www.facebook.com/COCOACAFEIE/"    },
];

export function Footer() {
  return (
    <footer className="bg-[var(--dark)] border-t border-white/[0.06] py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col items-center gap-4 text-center">
        <div className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold tracking-[0.18em] text-[var(--cream)]">
          COCOA
        </div>
        <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--grey)]">
          Fine Handmade Chocolate · Cork City
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center mt-2">
          {links.map(l => (
            <a key={l.label} href={l.href}
              className="text-[11px] tracking-[0.12em] uppercase text-[var(--grey)] hover:text-[var(--amber)] transition-colors">
              {l.label}
            </a>
          ))}
          {social.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener"
              className="text-[11px] tracking-[0.12em] uppercase text-[var(--grey)] hover:text-[var(--amber)] transition-colors">
              {s.label}
            </a>
          ))}
        </div>
        <p className="text-[11px] text-white/20 pt-5 border-t border-white/[0.06] w-full mt-2">
          © {new Date().getFullYear()} COCOA · 8 Winthrop Street, Cork
        </p>
      </div>
    </footer>
  );
}
