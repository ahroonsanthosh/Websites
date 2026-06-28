export default function Footer() {
  return (
    <footer className="py-16 px-6 md:px-12 bg-brand-bg" role="contentinfo">
      <div className="max-w-7xl mx-auto">
        <div className="h-px bg-brand-accent mb-12" aria-hidden="true" />

        <div className="flex flex-col items-center gap-6 text-center">
          <a
            href="#"
            className="footer-wordmark font-display text-2xl md:text-3xl text-brand-text"
            aria-label="Happy Days — back to top"
          >
            HAPPY DAYS
          </a>

          <p className="font-sans text-xs tracking-widest text-brand-text/40 uppercase">
            Penrose Wharf · Cork · Mon–Fri 8am–3pm
          </p>

          <div className="flex items-center gap-6" role="list" aria-label="Social media links">
            <a
              href="https://www.instagram.com/happydaysdeli/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-text/40 hover:text-brand-accent transition-all duration-300 hover:scale-110 inline-block"
              aria-label="Happy Days on Instagram"
              role="listitem"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
            </a>
            <a
              href="https://www.facebook.com/p/Happy-Days-Deli-61574488780439/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-text/40 hover:text-brand-accent transition-all duration-300 hover:scale-110 inline-block"
              aria-label="Happy Days on Facebook"
              role="listitem"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
          </div>

          <p className="font-sans text-xs text-brand-text/25">
            &copy; {new Date().getFullYear()} Happy Days. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
