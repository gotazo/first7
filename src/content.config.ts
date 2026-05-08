import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/* =========================
   📄 STATIC PAGES
========================= */
const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string().optional(),
  }),
});

/* =========================
   🌿 REFLECTIONS
========================= */
const reflections = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/reflections" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
  }),
});

/* =========================
   📰 BLOG
========================= */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    excerpt: z.string(),
    featured: z.boolean().optional(),
  }),
});

/* =========================
   📥 RESOURCES
========================= */
const resources = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/resources" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    file: z.string().optional(),
    type: z.string().optional(),
    icon: z.string().optional(),
    cover: z.string().optional(),
  }),
});

/* =========================
   🚀 PLANS
========================= */
const start = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/plans" }),
  schema: z.object({
    title: z.string(),
    plan: z.string(),
    day: z.number(),
    description: z.string(),
    verse: z.string(),
  }),
});

/* =========================
   🧭 GUIDES
========================= */
const guides = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/guides" }),
  schema: z.object({
    title: z.string(),
    featured: z.boolean().optional(),
    new: z.boolean().optional(),
    updated: z.boolean().optional(),
    description: z.string().optional(),
  }),
});

/* =========================
   📖 VERSES
========================= */
const verses = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/verses" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
  }),
});

/* =========================
   🙏 PRAYERS
========================= */
const prayers = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/prayers" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
  }),
});

/* =========================
   🛠️ TOOLS
========================= */
const tools = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/tools" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    component: z.string(),
    featured: z.boolean().optional(),
    order: z.number().optional(),
    icon: z.string().optional(),
  }),
});

/* =========================
   🧠 TEACHINGS (YOUR SYSTEM)
========================= */
const teachings = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/teachings",
  }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),

    topics: z.array(z.string()),
    keywords: z.array(z.string()).optional(),

    scripture: z.object({
      ref: z.string(),
      text: z.string(),
    }),

    truth: z.string(),

    insight: z.array(z.string()),
    application: z.array(z.string()),

    prayer: z.string(),
  }),
});

/* =========================
   📦 EXPORT (ONLY ONCE)
========================= */
export const collections = {
  pages,
  reflections,
  blog,
  resources,
  start,
  guides,
  verses,
  prayers,
  tools,
  teachings,
};