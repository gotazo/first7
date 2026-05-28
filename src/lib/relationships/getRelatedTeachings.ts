import { getCollection } from "astro:content";

export async function getRelatedTeachings(scripture: string) {
  const entries = await getCollection("teachings");

  return entries.filter((entry) => entry.data.scriptures?.includes(scripture));
}
