import type { SearchItem, SearchType } from "./types";

import { filterByType } from "./utils/filter";
import { searchByQuery } from "./utils/query";

let cache: SearchItem[] | null = null;

export interface SearchOptions {
  query?: string;
  type?: SearchType | "all";
  limit?: number;
}

/**
 * Load and cache the search index.
 */
export async function loadSearchIndex(): Promise<SearchItem[]> {
  if (cache !== null) {
    return cache;
  }

  const response = await fetch("/search-index.json");

  if (!response.ok) {
    throw new Error("Failed to load search index.");
  }

  const items: SearchItem[] = await response.json();

  cache = items;

  return items;
}

/**
 * Search the index.
 */
export async function search(
  options: SearchOptions = {}
): Promise<SearchItem[]> {
  const items = await loadSearchIndex();

  let results = items;

  // Filter by type
  results = filterByType(
    results,
    options.type ?? "all"
  );

  // Search query
  results = searchByQuery(
    results,
    options.query ?? ""
  );

  // Ranking
  // (coming from utils/ranking.ts)

  // Limit
  if (
    options.limit !== undefined &&
    options.limit > 0
  ) {
    results = results.slice(0, options.limit);
  }

  return results;
}

/**
 * Clear cached index.
 */
export function clearSearchCache(): void {
  cache = null;
}

/**
 * Get cached index.
 */
export function getCachedSearchIndex(): SearchItem[] | null {
  return cache;
}