import type {
  ProphecyContentRecord,
} from "./types.ts";

interface ProphecyEntryLike {
  id: string;
  data: {
    title: string;
    related?: string[];
    numbers?: number[];
    draft?: boolean;
  };
}

export function adaptProphecyEntries(
  entries: readonly ProphecyEntryLike[],
): ProphecyContentRecord[] {
  return entries.map((entry) => ({
    kind: "prophecy",
    id: entry.id,
    title: entry.data.title,
    href: `/prophecy/${entry.id}`,
    related: [...(entry.data.related ?? [])],
    numbers: [...(entry.data.numbers ?? [])],
    draft: entry.data.draft ?? false,
  }));
}