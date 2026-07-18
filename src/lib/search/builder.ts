import type { SearchItem } from "./types";

import { buildTeachingIndex } from "./collections/teachings";
import { buildDictionaryIndex } from "./collections/dictionary";
import { buildVerseJarIndex } from "./collections/verse-jar";
import { buildPlanIndex } from "./collections/plans";
import { buildResourceIndex } from "./collections/resources";
import { buildGuideIndex } from "./collections/guides";
import { buildReflectionIndex } from "./collections/reflections";

// Register all search index builders here

const builders = [
  buildTeachingIndex,
  buildDictionaryIndex,
  buildVerseJarIndex,
  buildPlanIndex,
  buildResourceIndex,
  buildGuideIndex,
  buildReflectionIndex,
];


export async function buildSearchIndex(): Promise<SearchItem[]> {
  const results = await Promise.all(
    builders.map((builder) => builder())
  );

  return results.flat();
}