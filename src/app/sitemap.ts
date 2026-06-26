import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://hansumrotisserie.ie";
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/#menu`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/#gallery`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/#location`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
