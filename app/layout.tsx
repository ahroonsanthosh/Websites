import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Oswald } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Uncle's Deli Cork | Rotisserie Chicken · The English Market",
  description:
    "Cork's best rotisserie chicken. Find us at Unit 12, The English Market, Grand Parade, Cork City. Fresh, fire-roasted, unforgettable.",
  openGraph: {
    title: "Uncle's Deli Cork",
    description: "Rotisserie Chicken · The English Market · Cork City",
    siteName: "Uncle's Deli Cork",
    locale: "en_IE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${oswald.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
