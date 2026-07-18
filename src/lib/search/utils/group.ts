import type { SearchItem, SearchType } from "../types";

export interface SearchGroup {
  type: SearchType;
  title: string;
  items: SearchItem[];
}

const GROUP_ORDER: SearchType[] = [
  "teaching",
  "dictionary",
  "verse",
  "plan",
  "guide",
  "resource",
  "reflection",
];

const GROUP_TITLES: Record<SearchType, string> = {
  teaching: "Teachings",
  dictionary: "Dictionary",
  verse: "Verse Cards",
  plan: "Plans",
  guide: "Guides",
  resource: "Resources",
  reflection: "Reflections",
  bible: "Bible",
};

export function groupResults(results: SearchItem[]): SearchGroup[] {
  const map = new Map<SearchType, SearchItem[]>();

  for (const result of results) {
    if (!map.has(result.type)) {
      map.set(result.type, []);
    }

    map.get(result.type)!.push(result);
  }

  return GROUP_ORDER
    .filter((type) => map.has(type))
    .map((type) => ({
      type,
      title: GROUP_TITLES[type],
      items: map.get(type)!,
    }));
}