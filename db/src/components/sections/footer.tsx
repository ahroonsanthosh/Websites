import { SITE } from "@/data/site";

export function Footer() {
  return (
    <footer className="bg-espresso px-5 py-10 text-cream/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs sm:flex-row">
        <p>
          © {new Date().getFullYear()} {SITE.name} · Cork, Ireland
        </p>
        <p>
          <a href={SITE.phoneHref} className="link-sweep hover:text-cream">
            {SITE.phone}
          </a>
          <span className="mx-2">·</span>
          <a
            href={SITE.mapsHref}
            target="_blank"
            rel="noreferrer"
            className="link-sweep hover:text-cream"
          >
            48 Oliver Plunkett St
          </a>
        </p>
      </div>
    </footer>
  );
}
