const links = ["About", "Menu", "Gallery", "Contact"];
const social = [
  { label: "Instagram", href: "https://www.instagram.com/cocoacafecork/" },
  { label: "Facebook",  href: "https://www.facebook.com/COCOACAFEIE/"    },
];

export function Footer() {
  return (
    <footer className="bg-[var(--dark)] border-t border-white/[0.06] py-14">
      <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)] flex flex-col items-center gap-5 text-center">
        <div className="font-['Playfair_Display'] text-[2.2rem] font-semibold tracking-[0.18em] text-[var(--cream)]">
          COCOA
        </div>
        <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--grey)]">
          Fine Handmade Chocolate · Cork City
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-2 justify-center mt-3">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(" ", "")}`}
              className="text-[11px] tracking-[0.12em] uppercase text-[var(--grey)] hover:text-[var(--amber)] transition-colors"
            >{l}</a>
          ))}
          {social.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener"
              className="text-[11px] tracking-[0.12em] uppercase text-[var(--grey)] hover:text-[var(--amber)] transition-colors"
            >{s.label}</a>
          ))}
        </div>
        <p className="text-[11px] text-[var(--grey)]/40 pt-5 border-t border-white/[0.06] w-full">
          © {new Date().getFullYear()} COCOA · 8 Winthrop Street, Cork
        </p>
      </div>
    </footer>
  );
}
