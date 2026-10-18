import { validateBibleReference } from "./validateBibleReference.ts";
import type { BibleReferenceBookData } from "./validateBibleReference.ts";

export function matchesBibleChapter(
  scriptureReference: string,
  bookSlug: string,
  chapterNumber: number,
  bibleBooks: Readonly<Record<string, BibleReferenceBookData>>,
): boolean {
  if (!Number.isInteger(chapterNumber) || chapterNumber < 1) {
    return false;
  }

  const targetBook = bibleBooks[bookSlug];

  const chapterData = targetBook?.chapters[String(chapterNumber)];
  const verseCount =
    typeof chapterData === "number"
      ? chapterData
      : Array.isArray(chapterData)
        ? chapterData.length
        : 0;

  if (verseCount < 1) {
    return false;
  }

  const reference = validateBibleReference(
    scriptureReference,
    bibleBooks,
  );

  if (!reference) return false;

  return (
    reference.book === bookSlug &&
    reference.chapter === chapterNumber
  );
}
