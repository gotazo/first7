import { getCollection } from "astro:content";

import type { SearchItem } from "./search";

export async function buildSearchIndex(): Promise<SearchItem[]> {

  const index: SearchItem[] = [];

  const teachings = await getCollection("teachings");

  for (const teaching of teachings) {

    index.push({

      id: teaching.id,

      type: "teaching",

      title: teaching.data.title,

      description: teaching.data.summary,

      url: `/teachings/${teaching.id}`,

      topics: teaching.data.topics,

      keywords: teaching.data.keywords,

      reference: teaching.data.scripture.ref,

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
    });

  }

  return index;
}