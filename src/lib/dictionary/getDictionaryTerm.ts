import { getCollection } from "astro:content";

export async function getDictionaryTerm(term: string) {
  const entries = await getCollection("dictionary");

  const normalized = term.toLowerCase();

  return entries.find((entry) => {
    const main = entry.data.term.toLowerCase() === normalized;

    const aliases = entry.data.aliases?.some(
      (alias) => alias.toLowerCase() === normalized,
    );

    return main || aliases;
  });
}
