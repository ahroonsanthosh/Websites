import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "COCOA — Fine Handmade Chocolate · Cork City",
  description:
    "COCOA is Cork's premier chocolate café on Winthrop Street. Fine handmade chocolates, specialty coffee, and artisan pastries in the heart of Cork City.",
  openGraph: {
    title: "COCOA — Fine Handmade Chocolate",
    description: "Handcrafted chocolates, specialty coffee & artisan pastries on Winthrop Street, Cork.",
    siteName: "COCOA Cork",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0c0b09] text-[#f2ede6]">
        {children}
      </body>
    </html>
  );
}
