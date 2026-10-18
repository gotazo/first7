import assert from "node:assert/strict";
import test from "node:test";

import { validateBibleReference } from "./validateBibleReference.ts";

const bibleBooks = {
  genesis: {
    chapters: {
      "1": ["Verse 1", "Verse 2", "Verse 3"],
      "2": ["Verse 1", "Verse 2"],
    },
  },
  jude: {
    chapters: {
      "1": ["Verse 1", "Verse 2", "Verse 3"],
    },
  },
};

test("validates an existing chapter", () => {
  assert.equal(
    validateBibleReference("Genesis 2", bibleBooks)?.path,
    "/bible/genesis/2",
  );
});

test("validates an existing verse", () => {
  assert.equal(
    validateBibleReference("Genesis 1:3", bibleBooks)?.path,
    "/bible/genesis/1#v3",
  );
});

test("validates a verse range when both boundaries exist", () => {
  const result = validateBibleReference("Genesis 1:2-3", bibleBooks);

  assert.equal(result?.verse, 2);
  assert.equal(result?.endVerse, 3);
});

test("validates a single-chapter book reference", () => {
  assert.equal(
    validateBibleReference("Jude 3", bibleBooks)?.path,
    "/bible/jude/1#v3",
  );
});

test("rejects a nonexistent book", () => {
  assert.equal(validateBibleReference("Unknownbook 1", bibleBooks), null);
});

test("rejects a nonexistent chapter", () => {
  assert.equal(validateBibleReference("Genesis 3", bibleBooks), null);
});

test("rejects a nonexistent verse", () => {
  assert.equal(validateBibleReference("Genesis 1:4", bibleBooks), null);
});

test("rejects a range whose ending verse does not exist", () => {
  assert.equal(validateBibleReference("Genesis 1:2-4", bibleBooks), null);
});

test("rejects a single-chapter reference beyond the available verses", () => {
  assert.equal(validateBibleReference("Jude 4", bibleBooks), null);
});
