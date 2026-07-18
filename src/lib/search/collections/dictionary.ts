import { getCollection } from "astro:content";

import type { SearchItem } from "../types";

export async function buildDictionaryIndex(): Promise<SearchItem[]> {
  const entries = await getCollection("dictionary");

  return entries.map((entry) => ({
    id: entry.id,

    type: "dictionary",

    title: entry.data.title,

    description: entry.data.shortMeaning,

    url: `/dictionary/${entry.id}`,

    topics: entry.data.tags,

    keywords: [
      entry.data.term,
      ...entry.data.aliases,
      ...entry.data.related,
      ...entry.data.seeAlso,
    ],

    tags: [
      ...entry.data.tags,
      ...entry.data.aliases,
      ...entry.data.related,
      ...entry.data.seeAlso,
    ],

    content: [
      entry.data.title,
      entry.data.term,
      entry.data.shortMeaning,
      entry.data.biblicalUsage ?? "",

      entry.data.hebrew?.word ?? "",
      entry.data.hebrew?.transliteration ?? "",
      entry.data.hebrew?.meaning ?? "",

      entry.data.greek?.word ?? "",
      entry.data.greek?.transliteration ?? "",
      entry.data.greek?.meaning ?? "",
    ].join(" "),

    reference: entry.data.reference?.ref,
  }));
}