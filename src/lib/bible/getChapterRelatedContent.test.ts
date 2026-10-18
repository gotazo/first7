import assert from "node:assert/strict";
import test from "node:test";

import { getChapterRelatedContent } from "./getChapterRelatedContent.ts";

const bibleBooks = {
  genesis: {
    chapters: {
      "1": ["Verse 1", "Verse 2", "Verse 3"],
      "2": ["Verse 1", "Verse 2"],
    },
  },
  exodus: {
    chapters: {
      "4": ["Verse 1", "Verse 2", "Verse 3"],
    },
  },
};

const entries = [
  { id: "creation", data: { scriptures: ["Genesis 1:1-3"] } },
  { id: "chapter-two", data: { scriptures: ["Genesis 2:1"] } },
  { id: "invalid", data: { scriptures: ["Genesis 1:999"] } },
  { id: "draft", data: { scriptures: ["Genesis 1:1"], draft: true } },
  { id: "no-reference", data: {} },
];

test("selects entries with valid references to the requested chapter", () => {
  const result = getChapterRelatedContent(
    entries,
    "genesis",
    1,
    bibleBooks,
  );

  assert.deepEqual(
    result.map((entry) => entry.id),
    ["creation"],
  );
});

test("matches a different book and chapter correctly", () => {
  const result = getChapterRelatedContent(
    [
      { id: "exodus", data: { scriptures: ["Exodus 4:1-2"] } },
      { id: "genesis", data: { scriptures: ["Genesis 1:1"] } },
    ],
    "exodus",
    4,
    bibleBooks,
  );

  assert.deepEqual(
    result.map((entry) => entry.id),
    ["exodus"],
  );
});

test("returns an empty array when no entries match", () => {
  assert.deepEqual(
    getChapterRelatedContent(
      [],
      "genesis",
      1,
      bibleBooks,
    ),
    [],
  );
});
