import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

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

    print_label: z.string().optional(),
    print_price: z.string().optional(),
    print_url: z.url().optional(),
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
    keywords: z.array(z.string()).default([]),

    scripture: z.object({
      ref: z.string(),
      text: z.string(),
    }),

    scriptures: z.array(
      z.string()
    ).default([]),

    truth: z.string(),

    insight: z.array(z.string()),
    application: z.array(z.string()),

    prayer: z.string().optional(),
  }),
});

/* =========================
   PROPHECY (STUDY SYSTEM)
========================= */
const prophecy = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/prophecy",
  }),

  schema: z.object({
    title: z.string(),
    description: z.string(),

  category: z.enum([
      "symbols",
      "people",
      "nations",
      "places",
      "events",
      "timeline"
  ]),

    tags: z.array(z.string()).default([]),

    scriptures: z.array(z.string()).default([]),

    related: z.array(z.string()).default([]),

    terms: z.array(z.string()).default([]),

    order: z.number().optional(),

    numbers: z.array(z.number()).default([]),

    notes: z.array(z.string()).default([]),

    draft: z.boolean().default(false),

    featuredVerse: z
      .object({
        ref: z.string(),
        text: z.string(),
      })
      .optional(),
  }),
});

const dictionary = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/dictionary",
  }),

  schema: z.object({
    title: z.string(),

    term: z.string(),

    shortMeaning: z.string(),

    related: z.array(z.string()).default([]),

    scriptures: z.array(z.string()).default([]),

    aliases: z.array(z.string()).default([]),

    seeAlso: z.array(z.string()).default([]),
  }),
});

/* =========================
   NUMBER (STUDY SYSTEM)
========================= */
const numbers = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/numbers",
  }),

  schema: z.object({
    title: z.string(),

    number: z.number(),

    shortMeaning: z.string(),

    category: z.enum([
      "symbolic",
      "prophetic",
      "historical"
    ]).optional(),

    featuredVerse: z
      .object({
        ref: z.string(),
        text: z.string(),
      })
      .optional(),

    scriptures: z.array(z.string()).default([]),

    related: z.array(z.string()).default([]),

    terms: z.array(z.string()).default([]),

    aliases: z.array(z.string()).default([]),

    notes: z.array(z.string()).default([]),
  }),
});

/* =========================
   VERSE JAR (STUDY SYSTEM)
========================= */

const verseJar = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/verse-jar",
  }),

  schema: z.object({
    id: z.string(),
    title: z.string(),

  category: z.enum([
    "faith",
    "hope",
    "encouragement",
    "prayer",
    "peace",
    "wisdom",
    "strength",
    "love",
    "joy",
    "grace",
    "comfort",
    "salvation",
    "thanksgiving",
    "praise",
    "guidance",
    "trust",
    "fear-not",
  ]),

    reference: z.string(),

    verse: z.string(),

    tags: z.array(z.string()).default([]),
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
  prophecy,
  dictionary,
  numbers,
  verseJar,
};
