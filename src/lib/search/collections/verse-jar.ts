import { getCollection } from "astro:content";

import type { SearchItem } from "../types";

export async function buildVerseJarIndex(): Promise<SearchItem[]> {
  const verses = await getCollection("verseJar");

  return verses.map((verse) => ({
    id: verse.id,

    type: "verse",

    title: verse.data.title,

    description: verse.data.verse,

    url: `/verse-jar/${verse.id}`,

    topics: [verse.data.category],

    keywords: [
      ...verse.data.tags,
      verse.data.reference,
    ],

    tags: [
      verse.data.category,
      ...verse.data.tags,
    ],

    content: [
      verse.data.title,
      verse.data.verse,
      verse.data.reference,
      verse.data.category,
      ...verse.data.tags,
    ].join(" "),

    reference: verse.data.reference,
  }));
}