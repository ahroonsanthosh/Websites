import { defineCollection, z } from 'astro:content';

const locations = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    weight: z.number(),
    kind: z.enum(['flagship', 'shop', 'stockist']),
    address: z.string(),
    mapUrl: z.string().url(),
    blurb: z.string(),
    hours: z.array(
      z.object({
        day: z.string(),
        time: z.string(),
      })
    ),
    image: z.string(),
    imageAlt: z.string(),
  }),
});

const menuCategories = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    weight: z.number(),
    note: z.string().optional(),
    items: z.array(
      z.object({
        name: z.string(),
        price: z.string(),
        note: z.string().optional(),
      })
    ),
  }),
});

const timeline = defineCollection({
  type: 'data',
  schema: z.object({
    year: z.string(),
    title: z.string(),
    body: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    weight: z.number(),
  }),
});

const settings = defineCollection({
  type: 'data',
  schema: z.object({
    businessName: z.string(),
    tagline: z.string(),
    email: z.string().email(),
    instagram: z.string().url(),
    facebook: z.string().url(),
    operaHousePage: z.string().url(),
    metaDescription: z.string(),
  }),
});

export const collections = { locations, menuCategories, timeline, settings };
