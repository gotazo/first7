import { getCollection } from "astro:content";

import type { SearchItem } from "../types";

export async function buildGuideIndex(): Promise<SearchItem[]> {
  const guides = await getCollection("guides");

  return guides.map((guide) => ({
    id: guide.id,

    type: "guide",

    title: guide.data.title,

    description: guide.data.description ?? "",

    url: `/guides/${guide.id}`,

    topics: [],

    keywords: [],

    tags: [
      ...(guide.data.featured ? ["featured"] : []),
      ...(guide.data.new ? ["new"] : []),
      ...(guide.data.updated ? ["updated"] : []),
    ],

    content: [
      guide.data.title,
      guide.data.description ?? "",
    ]
      .filter(Boolean)
      .join(" "),

    reference: undefined,
  }));
}