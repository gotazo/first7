import type { SearchItem, SearchType } from "../types";

/**
 * Filter results by content type.
 */
export function filterByType(
  items: SearchItem[],
  type: SearchType | "all" = "all"
): SearchItem[] {
  if (type === "all") {
    return items;
  }

  return items.filter((item) => item.type === type);
}