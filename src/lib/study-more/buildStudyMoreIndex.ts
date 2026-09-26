import { getCollection } from "astro:content";

import { adaptDictionaryEntries } from "./dictionary.ts";
import { adaptNumberEntries } from "./numbers.ts";
import { adaptProphecyEntries } from "./prophecy.ts";
import { adaptTeachingEntries } from "./teachings.ts";
import { buildRelationshipIndex } from "./resolveRelationships.ts";

export async function buildStudyMoreIndex() {
  const [dictionary, teachings, prophecy, numbers] = await Promise.all([
    getCollection("dictionary"),
    getCollection("teachings"),
    getCollection("prophecy"),
    getCollection("numbers"),
  ]);

  return buildRelationshipIndex({
    dictionary: adaptDictionaryEntries(dictionary),
    teachings: adaptTeachingEntries(teachings),
    prophecy: adaptProphecyEntries(prophecy),
    numbers: adaptNumberEntries(numbers),
  });
}