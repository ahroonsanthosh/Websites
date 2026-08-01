import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Some Dose Coffee Co. - Specialty Coffee, Cork",
  description: "Specialty coffee, fresh pastries, and dairy-free options across three Cork locations.",
  openGraph: { title: "Some Dose Coffee Co.", description: "Three locations across Cork, Ireland.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FDFAF6]">{children}</body>
    </html>
  );
}
