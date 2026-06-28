import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "5 Points Café — Victorian Quarter, Cork",
  description: "A beloved neighbourhood café on MacCurtain Street in Cork's Victorian Quarter. Exceptional coffee, seasonal food, and a warm welcome every day.",
  keywords: ["café", "cork", "coffee", "brunch", "MacCurtain Street", "Victorian Quarter", "5 Points"],
  openGraph: {
    title: "5 Points Café — Cork City",
    description: "Exceptional coffee and seasonal food in Cork's Victorian Quarter.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
