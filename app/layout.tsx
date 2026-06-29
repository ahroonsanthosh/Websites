import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NorthSouth Café | Tralee, Co. Kerry",
  description: "Breakfast & brunch crafted with care in the heart of Tralee. Open Mon–Fri 8am–4pm, Sat 9am–4pm. 12 Russell Street, Tralee, Co. Kerry.",
  keywords: ["café", "Tralee", "Kerry", "breakfast", "brunch", "coffee", "NorthSouth"],
  openGraph: {
    title: "NorthSouth Café",
    description: "Good food in the heart of Tralee.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,900;1,400;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
