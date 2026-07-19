import { getCollection, type CollectionEntry } from "astro:content";

export async function getDailyVerse(): Promise<
  CollectionEntry<"verseJar">
> {
  const verses = await getCollection("verseJar");

  const dayNumber = Math.floor(Date.now() / 86400000);

  return verses[dayNumber % verses.length];
}