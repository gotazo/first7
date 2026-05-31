type NormalizedBibleReference = {
  book: string;
  chapter: number;
  verse?: number;
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

  "song of solomon": "song-of-solomon",
  song: "song-of-solomon",
  songs: "song-of-solomon",
  canticles: "song-of-solomon",
  sos: "song-of-solomon",

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

export function normalizeBibleReference(
  input: string,
): NormalizedBibleReference | null {
  if (!input) return null;

  const normalized = input.trim().toLowerCase().replace(/\s+/g, " ");

  const match = normalized.match(/^(.+?)\s+(\d+)(?::(\d+))?$/);

  if (!match) {
    return null;
  }

  const rawBook = match[1].trim();

  const chapter = Number(match[2]);

  if (!chapter) {
    return null;
  }

  const verse = match[3] ? Number(match[3]) : undefined;

  if (match[3] && !verse) {
    return null;
  }

  const book = BOOK_ALIASES[rawBook];

  if (!book) {
    return null;
  }

  return {
    book,

    chapter,
    ...(verse ? { verse } : {}),

    path: `/bible/${book}/${chapter}${verse ? `#v${verse}` : ""}`,
  };
}
