import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dulce Bun House | Cork City",
  description:
    "Cork's favourite corner for coffee & fresh-baked buns. 48 Oliver Plunkett St, Cork City. Open Mon–Fri 8:30am, Sat 9:30am, Sun 10:30am.",
  keywords: ["café", "cork", "coffee", "buns", "pastry", "bakery", "dulce", "oliver plunkett"],
  openGraph: {
    title: "Dulce Bun House",
    description: "Fresh-baked buns & great espresso in the heart of Cork City.",
    type: "website",
    locale: "en_IE",
  },
  themeColor: "#0a0604",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-stone-950">{children}</body>
    </html>
  );
}
