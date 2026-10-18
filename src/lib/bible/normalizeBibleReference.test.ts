
import test from "node:test";
import assert from "node:assert/strict";

import { normalizeBibleReference } from "./normalizeBibleReference.ts";

test("normalizes an explicit chapter and verse", () => {
  assert.deepEqual(normalizeBibleReference("Jude 1:24"), {
    book: "jude",
    chapter: 1,
    verse: 24,
    path: "/bible/jude/1#v24",
  });
});

test("normalizes a single-chapter book reference as a verse", () => {
  assert.deepEqual(normalizeBibleReference("Jude 24"), {
    book: "jude",
    chapter: 1,
    verse: 24,
    path: "/bible/jude/1#v24",
  });
});

test("normalizes Philemon references", () => {
  assert.deepEqual(normalizeBibleReference("Philemon 6"), {
    book: "philemon",
    chapter: 1,
    verse: 6,
    path: "/bible/philemon/1#v6",
  });
});

test("keeps multi-chapter references as chapter references", () => {
  assert.deepEqual(normalizeBibleReference("Genesis 3"), {
    book: "genesis",
    chapter: 3,
    path: "/bible/genesis/3",
  });
});

test("normalizes an explicit verse reference in a multi-chapter book", () => {
  assert.deepEqual(normalizeBibleReference("Genesis 3:16"), {
    book: "genesis",
    chapter: 3,
    verse: 16,
    path: "/bible/genesis/3#v16",
  });
});

test("returns null for unknown books", () => {
  assert.equal(normalizeBibleReference("Unknownbook 3:16"), null);
});

test("normalizes a verse range in a multi-chapter book", () => {
  assert.deepEqual(normalizeBibleReference("Exodus 4:14-16"), {
    book: "exodus",
    chapter: 4,
    verse: 14,
    endVerse: 16,
    path: "/bible/exodus/4#v14",
  });
});

test("normalizes a verse range in a single-chapter book", () => {
  assert.deepEqual(normalizeBibleReference("Jude 24-26"), {
    book: "jude",
    chapter: 1,
    verse: 24,
    endVerse: 26,
    path: "/bible/jude/1#v24",
  });
});

test("rejects a reversed verse range", () => {
  assert.equal(normalizeBibleReference("Genesis 3:16-14"), null);
});

test("rejects an ambiguous chapter range", () => {
  assert.equal(normalizeBibleReference("Genesis 3-5"), null);
});

test("rejects malformed verse ranges", () => {
  assert.equal(normalizeBibleReference("Genesis 3:14-"), null);
  assert.equal(normalizeBibleReference("Genesis 3:14-abc"), null);
});
