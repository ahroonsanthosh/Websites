import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bayou — Cork's Victorian Quarter",
  description: "Bayou Café — A cosy daytime café at 8 MacCurtain Street, Cork's Victorian Quarter. Serving honest food and great coffee Wed–Sun.",
  keywords: ["cafe", "cork", "coffee", "brunch", "MacCurtain Street", "Victorian Quarter"],
  openGraph: {
    title: "Bayou Café Cork",
    description: "A cosy daytime café in Cork's Victorian Quarter. Wed–Sun.",
    type: "website",
    locale: "en_IE",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#F5EFE0",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
