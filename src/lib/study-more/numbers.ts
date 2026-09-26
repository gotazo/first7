import type {
  NumberContentRecord,
} from "./types.ts";

interface NumberEntryLike {
  id: string;
  data: {
    title: string;
    number: number;
    related?: string[];
  };
}

export function adaptNumberEntries(
  entries: readonly NumberEntryLike[],
): NumberContentRecord[] {
  return entries.map((entry) => ({
    kind: "numbers",
    id: entry.id,
    title: entry.data.title,
    href: `/number/${entry.id}`,
    number: entry.data.number,
    related: [...(entry.data.related ?? [])],
  }));
}