import { matchesBibleChapter } from "./matchesBibleChapter.ts";
import type { BibleReferenceBookData } from "./validateBibleReference.ts";

export interface ScriptureContentEntry {
  id: string;
  data: {
    scriptures?: readonly string[];
    draft?: boolean;
  };
}

export function getChapterRelatedContent<
  T extends ScriptureContentEntry,
>(
  entries: readonly T[],
  bookSlug: string,
  chapterNumber: number,
  bibleBooks: Readonly<Record<string, BibleReferenceBookData>>,
): T[] {
  return entries.filter((entry) => {
    if (entry.data.draft === true) return false;

    return (entry.data.scriptures ?? []).some((reference) =>
      matchesBibleChapter(
        reference,
        bookSlug,
        chapterNumber,
        bibleBooks,
      ),
    );
  });
}
