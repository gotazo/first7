import type {
  TeachingContentRecord,
} from "./types.ts";

interface TeachingEntryLike {
  id: string;
  data: {
    id: string;
    title: string;
    related?: string[];
    keywords?: string[];
    scriptures?: string[];
  };
}

export function adaptTeachingEntries(
  entries: readonly TeachingEntryLike[],
): TeachingContentRecord[] {
  return entries.map((entry) => ({
    kind: "teachings",
    id: entry.id,
    title: entry.data.title,
    href: `/teachings/${entry.id}`,
    authoredId: entry.data.id,
    related: [...(entry.data.related ?? [])],
    keywords: [...(entry.data.keywords ?? [])],
    scriptures: [...(entry.data.scriptures ?? [])],
  }));
}