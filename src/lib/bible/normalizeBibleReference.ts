
type NormalizedBibleReference = {
  book: string;
  chapter: number;
  verse?: number;
  endVerse?: number;
  path: string;
};

const BOOK_ALIASES: Record<string, string> = {
  genesis: "genesis",
  gen: "genesis",
  exodus: "exodus",
  exo: "exodus",
  ex: "exodus",
  leviticus: "leviticus",
  lev: "leviticus",
  numbers: "numbers",
  num: "numbers",
  deuteronomy: "deuteronomy",
  deut: "deuteronomy",
  joshua: "joshua",
  josh: "joshua",
  judges: "judges",
  judg: "judges",
  ruth: "ruth",

  "1 samuel": "1-samuel",
  "1 sam": "1-samuel",
  "2 samuel": "2-samuel",
  "2 sam": "2-samuel",
  "1 kings": "1-kings",
  "1 kgs": "1-kings",
  "2 kings": "2-kings",
  "2 kgs": "2-kings",
  "1 chronicles": "1-chronicles",
  "1 chron": "1-chronicles",
  "1 chr": "1-chronicles",
  "2 chronicles": "2-chronicles",
  "2 chron": "2-chronicles",
  "2 chr": "2-chronicles",

  ezra: "ezra",
  nehemiah: "nehemiah",
  esther: "esther",
  job: "job",

  psalm: "psalms",
  psalms: "psalms",
  psa: "psalms",

  proverbs: "proverbs",
  prov: "proverbs",
  ecclesiastes: "ecclesiastes",
  ecc: "ecclesiastes",

  "song of solomon": "songofsolomon",
  song: "songofsolomon",
  songs: "songofsolomon",
  canticles: "songofsolomon",
  sos: "songofsolomon",

  isaiah: "isaiah",
  isa: "isaiah",
  jeremiah: "jeremiah",
  jer: "jeremiah",
  ezekiel: "ezekiel",
  ezek: "ezekiel",
  daniel: "daniel",
  dan: "daniel",
  hosea: "hosea",
  joel: "joel",
  amos: "amos",
  obadiah: "obadiah",
  jonah: "jonah",
  micah: "micah",
  nahum: "nahum",
  habakkuk: "habakkuk",
  zephaniah: "zephaniah",
  haggai: "haggai",
  zechariah: "zechariah",
  malachi: "malachi",

  matthew: "matthew",
  matt: "matthew",
  mark: "mark",
  luke: "luke",
  john: "john",
  acts: "acts",
  romans: "romans",
  rom: "romans",

  "1 corinthians": "1-corinthians",
  "1 cor": "1-corinthians",
  "2 corinthians": "2-corinthians",
  "2 cor": "2-corinthians",
  galatians: "galatians",
  eph: "ephesians",
  ephesians: "ephesians",
  philippians: "philippians",
  colossians: "colossians",

  "1 thessalonians": "1-thessalonians",
  "2 thessalonians": "2-thessalonians",
  "1 timothy": "1-timothy",
  "2 timothy": "2-timothy",
  titus: "titus",
  philemon: "philemon",
  hebrews: "hebrews",
  james: "james",

  "1 peter": "1-peter",
  "2 peter": "2-peter",
  "1 john": "1-john",
  "2 john": "2-john",
  "3 john": "3-john",
  jude: "jude",

  revelation: "revelation",
  rev: "revelation",
};

const SINGLE_CHAPTER_BOOKS = new Set([
  "obadiah",
  "philemon",
  "2-john",
  "3-john",
  "jude",
]);

export function normalizeBibleReference(
  input: string,
): NormalizedBibleReference | null {
  if (!input.trim()) return null;

  const normalized = input.trim().toLowerCase().replace(/\s+/g, " ");

  const match = normalized.match(
    /^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?|-(\d+))?$/,
  );

  if (!match) return null;

  const rawBook = match[1].trim();
  const number = Number(match[2]);
  const explicitVerse = match[3] ? Number(match[3]) : undefined;
  const colonRangeEnd = match[4] ? Number(match[4]) : undefined;
  const singleChapterRangeEnd = match[5] ? Number(match[5]) : undefined;

  if (!Number.isInteger(number) || number < 1) return null;

  if (
    (match[3] && (!Number.isInteger(explicitVerse) || explicitVerse! < 1)) ||
    (match[4] && (!Number.isInteger(colonRangeEnd) || colonRangeEnd! < 1)) ||
    (match[5] &&
      (!Number.isInteger(singleChapterRangeEnd) ||
        singleChapterRangeEnd! < 1))
  ) {
    return null;
  }

  const book = BOOK_ALIASES[rawBook];

  if (!book) return null;

  if (SINGLE_CHAPTER_BOOKS.has(book)) {
    if (explicitVerse !== undefined && number !== 1) return null;

    const verse = explicitVerse ?? number;
    const endVerse = colonRangeEnd ?? singleChapterRangeEnd;

    if (endVerse !== undefined && endVerse < verse) return null;

    return {
      book,
      chapter: 1,
      verse,
      ...(endVerse !== undefined ? { endVerse } : {}),
      path: `/bible/${book}/1#v${verse}`,
    };
  }

  // A range without a colon is ambiguous for multi-chapter books.
  if (singleChapterRangeEnd !== undefined) return null;

  const chapter = number;

  if (
    explicitVerse !== undefined &&
    colonRangeEnd !== undefined &&
    colonRangeEnd < explicitVerse
  ) {
    return null;
  }

  return {
    book,
    chapter,
    ...(explicitVerse !== undefined ? { verse: explicitVerse } : {}),
    ...(colonRangeEnd !== undefined ? { endVerse: colonRangeEnd } : {}),
    path: `/bible/${book}/${chapter}${
      explicitVerse !== undefined ? `#v${explicitVerse}` : ""
    }`,
  };
}
