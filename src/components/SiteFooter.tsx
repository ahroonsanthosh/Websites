'use client'

import { ExternalLink } from 'lucide-react'

interface Props {
  contact: {
    address: string
    instagram: string
    facebook: string
  }
}

export default function SiteFooter({ contact }: Props) {
  return (
    <footer className="bg-brand-bg border-t border-brand-border py-16 px-6 lg:px-12" role="contentinfo">
      <div className="max-w-7xl mx-auto">
        <div className="h-px bg-brand-accent/30 mb-16" aria-hidden="true" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <a
            href="#"
            className="footer-wordmark font-display text-brand-text text-xl font-light uppercase hover:text-brand-accent transition-colors duration-300"
            aria-label="Happy Days — back to top"
          >
            Happy Days
          </a>

          <div className="text-center">
            <p className="font-sans text-brand-text/30 text-xs tracking-[0.2em] uppercase">
              Penrose Wharf · Cork · Mon–Fri 8am–3pm
            </p>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-sans text-brand-text/40 text-xs tracking-widest uppercase hover:text-brand-accent transition-all duration-200"
              aria-label="Happy Days on Instagram"
            >
              <ExternalLink size={12} strokeWidth={1.5} aria-hidden="true" />
              Instagram
            </a>
            <a
              href={contact.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-sans text-brand-text/40 text-xs tracking-widest uppercase hover:text-brand-accent transition-all duration-200"
              aria-label="Happy Days on Facebook"
            >
              <ExternalLink size={12} strokeWidth={1.5} aria-hidden="true" />
              Facebook
            </a>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="font-sans text-brand-text/20 text-xs">
            © {new Date().getFullYear()} Happy Days Deli. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
