
import { normalizeBibleReference } from "./normalizeBibleReference.ts";

export interface BibleReferenceBookData {
  chapters: Record<string, readonly string[] | number>;
}

export function validateBibleReference(
  input: string,
  bibleBooks: Readonly<Record<string, BibleReferenceBookData>>,
) {
  const reference = normalizeBibleReference(input);

  if (!reference) return null;

  const book = bibleBooks[reference.book];

  if (!book) return null;

  const chapterData = book.chapters[String(reference.chapter)];

  const verseCount =
    typeof chapterData === "number"
      ? chapterData
      : Array.isArray(chapterData)
        ? chapterData.length
        : 0;

  if (!Number.isInteger(verseCount) || verseCount < 1) {
    return null;
  }

  if (
    reference.verse !== undefined &&
    reference.verse > verseCount
  ) {
    return null;
  }

  if (
    reference.endVerse !== undefined &&
    reference.endVerse > verseCount
  ) {
    return null;
  }

  return reference;
}
