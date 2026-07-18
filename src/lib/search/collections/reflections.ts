import { getCollection } from "astro:content";

import type { SearchItem } from "../types";

export async function buildReflectionIndex(): Promise<SearchItem[]> {
  const reflections = await getCollection("reflections");

  return reflections.map((reflection) => ({
    id: reflection.id,

    type: "reflection",

    title: reflection.data.title,

    description: reflection.data.excerpt,

    url: `/reflections/${reflection.id}`,

    topics: [],

    keywords: [],

    tags: [],

    content: [
      reflection.data.title,
      reflection.data.excerpt,
      reflection.data.date.toISOString().split("T")[0],
    ]
      .filter(Boolean)
      .join(" "),

    reference: undefined,
  }));
}