import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

/* =========================
   🌿 REFLECTIONS (NEW)
========================= */
const reflections = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/reflections' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string()
  })
});

/* =========================
   📰 BLOG
========================= */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    excerpt: z.string(),
    featured: z.boolean().optional()
  })
});

/* =========================
   📜 BIBLE (OPTIONAL - KEEP OR REMOVE LATER)
========================= */

/* =========================
   📥 RESOURCES
========================= */
const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    file: z.string().optional(),
    type: z.string().optional() // pdf, guide, etc
  })
});

/* =========================
   🚀 PLANS (CORE SYSTEM)
========================= */
const start = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/plans' }),
  schema: z.object({
    title: z.string(),
    plan: z.string(),
    day: z.number(),
    description: z.string(),
    verse: z.string()
  })
});

/* =========================
   🧭 GUIDES (OPTIONAL)
========================= */
const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    featured: z.boolean().optional(),
    new: z.boolean().optional(),
    updated: z.boolean().optional(),
    description: z.string().optional(),
  })
});

/* =========================
   📦 EXPORT
========================= */
export const collections = {
  reflections,
  blog,
  resources,
  start,
  guides
};