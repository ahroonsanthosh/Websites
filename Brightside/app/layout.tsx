import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bright Side — Specialty Coffee · Cork City",
  description:
    "Bright Side is a neighbourhood café on Washington Street West, Cork. Specialty espresso, fresh food, and a warm welcome every weekday from 8am to 3pm.",
  keywords: ["café", "coffee", "Cork", "specialty coffee", "Washington Street", "Bright Side"],
  openGraph: {
    title: "Bright Side Café · Cork",
    description: "Specialty coffee & fresh food at 23a Washington Street West, Cork. Mon–Fri 8am–3pm.",
    type: "website",
    locale: "en_IE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F7F3EC]">{children}</body>
    </html>
  );
}
