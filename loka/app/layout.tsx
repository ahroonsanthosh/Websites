import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LOKA Coffee Shop — Tralee, Co. Kerry',
  description:
    'Specialty coffee & wholesome food, crafted with care in the heart of Tralee. Open Mon–Sat 9am–3pm at 35 Lower Castle St.',
  keywords: ['coffee shop', 'Tralee', 'Kerry', 'specialty coffee', 'breakfast', 'cafe'],
  openGraph: {
    title: 'LOKA Coffee Shop',
    description: 'Specialty coffee & wholesome food in Tralee, Co. Kerry.',
    url: 'https://lokacoffee.ie',
    siteName: 'LOKA Coffee Shop',
    locale: 'en_IE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LOKA Coffee Shop',
    description: 'Specialty coffee & wholesome food in Tralee, Co. Kerry.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${cormorant.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#FAFAF6" />
      </head>
      <body className="font-body bg-cream-100 text-coffee-900 grain antialiased">
        {children}
      </body>
    </html>
  );
}
