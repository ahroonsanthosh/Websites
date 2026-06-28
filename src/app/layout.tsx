import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Happy Days Deli | Penrose Wharf, Cork',
  description: 'Cork\'s favourite morning ritual. Fresh food and specialty coffee at Penrose Wharf, Victorian Quarter. Open Mon–Fri 8am–3pm.',
  keywords: 'Happy Days, Happy Days Deli, Cork café, Penrose Wharf, breakfast Cork, lunch Cork, specialty coffee Cork',
  openGraph: {
    title: 'Happy Days Deli | Penrose Wharf, Cork',
    description: 'Cork\'s favourite morning ritual. Fresh food and specialty coffee at Penrose Wharf, Victorian Quarter.',
    url: 'https://happydayscork.ie',
    siteName: 'Happy Days Deli',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGkP3GEjEMW7i3H2CdcolNFylU9-r19TBx5_nmpjhjo6Ofckd8ujvfIMt06-zVvV6j1wlkNSXCjWUEVB3g0WaqfB6brNfW9oePHBBlUGbOamXCtCmYsTTBvTwAmtgJmu-LTBBC801IR81J0=s1360-w1360-h1020-rw',
        width: 1360,
        height: 1020,
        alt: 'Happy Days Deli Cork',
      }
    ],
    locale: 'en_IE',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="bg-brand-bg text-brand-text font-sans">
        {children}
      </body>
    </html>
  )
}
