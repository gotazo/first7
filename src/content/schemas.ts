import { z } from "astro/zod";

export const scriptureSchema = z.object({
  reference: z.string(),
  text: z.string(),
});

export const featuredVerseSchema = scriptureSchema;