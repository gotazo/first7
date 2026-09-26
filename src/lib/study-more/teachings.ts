import type {
  TeachingContentRecord,
} from "./types.ts";

interface TeachingEntryLike {
  id: string;
  data: {
    id: string;
    title: string;
    related?: string[];
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
  }));
}