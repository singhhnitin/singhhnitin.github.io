import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    author: z.string().optional(),
  }),
});

const drafts = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    author: z.string().optional(),
  }),
});

export const collections = { blog, drafts };
