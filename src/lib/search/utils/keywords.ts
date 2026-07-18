export function buildKeywords(words: string[]): string[] {
  return [...new Set(words)];
}