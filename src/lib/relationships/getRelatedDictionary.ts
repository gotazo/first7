import { getCollection } from "astro:content";

export async function getRelatedDictionary(scripture: string) {
  const entries = await getCollection("dictionary");

  return entries.filter((entry) => entry.data.scriptures.includes(scripture));
}
