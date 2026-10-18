
const canonicalBookNames: Readonly<Record<string, string>> = {
  songofsolomon: "Song of Solomon",
};

export function getBibleBookDisplayName(book: string): string {
  const normalized = book.toLowerCase().replace(/-/g, " ");

  return (
    canonicalBookNames[book.toLowerCase()] ??
    normalized.replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}
