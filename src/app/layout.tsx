import type { Metadata } from "next";
import "./globals.css";
import { getSeoContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoContent();
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      locale: "en_IE",
      siteName: "Hansum Rotisserie",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Anton&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              name: "Hansum Rotisserie",
              description: "Premium rotisserie chicken in Cork City.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Marina Market",
                addressLocality: "Cork",
                addressCountry: "IE",
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
                  opens: "12:00",
                  closes: "20:00",
                },
              ],
              servesCuisine: "Rotisserie Chicken",
              sameAs: ["https://www.instagram.com/hansumcork"],
            }),
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
