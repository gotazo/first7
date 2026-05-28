import { getCollection } from "astro:content";

export async function getRelatedProphecy(scripture: string) {
  const entries = await getCollection("prophecy");

  return entries.filter((entry) => entry.data.scriptures.includes(scripture));
}
