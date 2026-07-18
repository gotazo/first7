import type { SearchItem } from "../types";

/**
 * Search across all searchable fields.
 */
export function searchByQuery(
  items: SearchItem[],
  query: string
): SearchItem[] {
  const q = query.trim().toLowerCase();

  if (!q) {
    return items;
  }

  return items.filter((item) => {
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q) ||
      item.keywords.some((keyword) =>
        keyword.toLowerCase().includes(q)
      ) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(q)
      ) ||
      item.topics.some((topic) =>
        topic.toLowerCase().includes(q)
      ) ||
      item.reference?.toLowerCase().includes(q)
    );
  });
}