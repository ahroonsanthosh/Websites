import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F7F3EB",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
