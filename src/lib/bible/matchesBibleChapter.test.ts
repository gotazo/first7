import assert from "node:assert/strict";
import test from "node:test";

import { matchesBibleChapter } from "./matchesBibleChapter.ts";

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
      "5": ["Verse 1", "Verse 2"],
    },
  },
  jude: {
    chapters: {
      "1": ["Verse 1", "Verse 2", "Verse 3"],
    },
  },
};

test("matches a verse range to its chapter", () => {
  assert.equal(
    matchesBibleChapter("Exodus 4:1-3", "exodus", 4, bibleBooks),
    true,
  );
});

test("does not match a reference to another chapter", () => {
  assert.equal(
    matchesBibleChapter("Exodus 4:1-3", "exodus", 5, bibleBooks),
    false,
  );
});

test("matches a valid single-chapter book reference", () => {
  assert.equal(
    matchesBibleChapter("Jude 2", "jude", 1, bibleBooks),
    true,
  );
});

test("rejects a reference to a nonexistent verse", () => {
  assert.equal(
    matchesBibleChapter("Genesis 1:999", "genesis", 1, bibleBooks),
    false,
  );
});

test("rejects a nonexistent target chapter", () => {
  assert.equal(
    matchesBibleChapter("Genesis 1:1", "genesis", 99, bibleBooks),
    false,
  );
});

test("rejects an unknown book reference", () => {
  assert.equal(
    matchesBibleChapter("Unknownbook 1:1", "genesis", 1, bibleBooks),
    false,
  );
});
