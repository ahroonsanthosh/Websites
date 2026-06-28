export default function Footer() {
  return (
    <footer className="bg-brand-text py-12 px-5 sm:px-8" role="contentinfo">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <a
            href="#"
            className="footer-wordmark font-display text-brand-bg text-2xl sm:text-3xl font-bold"
            aria-label="Happy Days — back to top"
          >
            Happy Days
          </a>

          <div className="flex items-center gap-5">
            <a
              href="https://www.instagram.com/happydaysdeli/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-brand-bg/50 text-xs font-semibold tracking-widest uppercase hover:text-brand-bg transition-colors duration-200 flex items-center gap-2"
              aria-label="Instagram"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
              Instagram
            </a>
            <a
              href="https://www.facebook.com/p/Happy-Days-Deli-61574488780439/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-brand-bg/50 text-xs font-semibold tracking-widest uppercase hover:text-brand-bg transition-colors duration-200 flex items-center gap-2"
              aria-label="Facebook"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              Facebook
            </a>
          </div>
        </div>

        <div className="border-t border-brand-bg/10 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-sans text-brand-bg/40 text-xs">
            Penrose Wharf · Penrose Quay · Victorian Quarter · Cork · T23 RK11
          </p>
          <p className="font-sans text-brand-bg/40 text-xs">
            &copy; {new Date().getFullYear()} Happy Days. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
