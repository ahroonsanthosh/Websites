import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Café Jane · Cork City",
  description: "A neighbourhood café on Shandon Street, Cork. Specialty coffee, seasonal food, and fresh pastries. Open Tuesday–Sunday.",
  keywords: "cafe cork, coffee cork, shandon street cafe, cafe jane cork, specialty coffee cork",
  openGraph: {
    title: "Café Jane · Cork City",
    description: "A quiet corner for good coffee, honest food, and slow mornings. 116 Shandon Street, Cork.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#FAFAF7]">{children}</body>
    </html>
  );
}
