import { readJSON, writeJSON } from "./storage";

export function readContent<T>(filename: string): Promise<T> {
  return readJSON<T>(filename);
}

export function writeContent(filename: string, data: unknown): Promise<void> {
  return writeJSON(filename, data);
}

export function getHeroContent() {
  return readContent<{
    headline: string;
    subheadline: string;
    cta_primary: string;
    cta_primary_link: string;
    cta_secondary: string;
    cta_secondary_link: string;
    badge: string;
  }>("hero");
}

export function getMenuContent() {
  return readContent<{
    categories: string[];
    items: Array<{
      id: string;
      name: string;
      category: string;
      description: string;
      price: string;
      featured: boolean;
      available: boolean;
      badge: string;
      emoji: string;
    }>;
  }>("menu");
}

export function getLocationContent() {
  return readContent<{
    name: string;
    address_line1: string;
    address_line2: string;
    google_maps_url: string;
    hours: Record<string, { open: string; close: string; closed: boolean }>;
  }>("location");
}

export function getReviewsContent() {
  return readContent<{
    reviews: Array<{
      id: string;
      name: string;
      text: string;
      rating: number;
      date: string;
    }>;
  }>("reviews");
}

export function getSettingsContent() {
  return readContent<{
    instagram: string;
    instagram_url: string;
    announcement_banner: string;
    announcement_active: boolean;
    contact_email: string;
  }>("settings");
}

export function getSeoContent() {
  return readContent<{
    title: string;
    description: string;
    og_image: string;
    keywords: string;
  }>("seo");
}

export function getGalleryContent() {
  return readContent<{
    images: Array<{
      id: string;
      src: string;
      alt: string;
      order: number;
    }>;
  }>("gallery");
}
