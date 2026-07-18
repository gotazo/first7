import { getCollection } from "astro:content";

import type { SearchItem } from "../types";

export async function buildTeachingIndex(): Promise<SearchItem[]> {
  const teachings = await getCollection("teachings");

  return teachings.map((teaching) => ({
    id: teaching.id,

    type: "teaching",

    title: teaching.data.title,

    description: teaching.data.summary,

    url: `/teachings/${teaching.id}`,

    topics: teaching.data.topics,

    keywords: teaching.data.keywords,

    tags: [
      ...teaching.data.topics,
      ...teaching.data.keywords,
    ],

    content: [
      teaching.data.title,
      teaching.data.summary,
      teaching.data.truth,
      ...teaching.data.insight,
      ...teaching.data.application,
    ].join(" "),

    reference: teaching.data.scripture.ref,
  }));
}