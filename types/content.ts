export interface MenuItem {
  id: string;
  name: string;
  price: string;
  description?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface HoursEntry {
  day: string;
  hours: string;
  closed: boolean;
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface SiteContent {
  site: {
    name: string;
    tagline: string;
    description: string;
    phone: string;
    address: string;
    email: string;
    instagram: string;
    facebook: string;
  };
  hero: {
    badge: string;
    mainText: string;
    overlayPart1: string;
    overlayPart2: string;
    image: string;
  };
  about: {
    heading: string;
    body1: string;
    body2: string;
    quote: string;
    image: string;
  };
  menu: {
    categories: MenuCategory[];
  };
  gallery: {
    images: GalleryImage[];
  };
  hours: {
    days: HoursEntry[];
  };
}
