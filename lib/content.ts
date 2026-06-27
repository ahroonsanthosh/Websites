import rawContent from "@/content/content.json";

export type HourEntry = {
  day: string;
  time: string;
  closed: boolean;
};

export type MenuItem = {
  name: string;
  description: string;
  price: string;
  tag: string;
};

export type MenuCategory = "Rotisserie" | "Wraps & Rolls" | "Sides" | "Drinks";

export type SiteContent = typeof rawContent;

export const content: SiteContent = rawContent;

export default content;
