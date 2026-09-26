import type {
  DictionaryContentRecord,
} from "./types.ts";

interface DictionaryEntryLike {
  id: string;
  data: {
    title: string;
    term: string;
    aliases?: string[];
    related?: string[];
    seeAlso?: string[];
  };
}

export function adaptDictionaryEntries(
  entries: readonly DictionaryEntryLike[],
): DictionaryContentRecord[] {
  return entries.map((entry) => ({
    kind: "dictionary",
    id: entry.id,
    title: entry.data.title,
    href: `/dictionary/${entry.id}`,
    term: entry.data.term,
    aliases: [...(entry.data.aliases ?? [])],
    related: [...(entry.data.related ?? [])],
    seeAlso: [...(entry.data.seeAlso ?? [])],
  }));
}