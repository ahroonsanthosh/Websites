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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0c0b09] text-[#f2ede6]">
        {children}
      </body>
    </html>
  );
}
