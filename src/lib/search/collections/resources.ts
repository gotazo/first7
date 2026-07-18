import { getCollection } from "astro:content";

import type { SearchItem } from "../types";

export async function buildResourceIndex(): Promise<SearchItem[]> {
  const resources = await getCollection("resources");

  return resources.map((resource) => ({
    id: resource.id,

    type: "resource",

    title: resource.data.title,

    description: resource.data.description,

    url: `/resources/${resource.id}`,

    topics: [
      resource.data.category ?? "",
    ].filter(Boolean),

    keywords: [
      resource.data.type ?? "",
      resource.data.category ?? "",
    ].filter(Boolean),

    tags: [
      resource.data.type ?? "",
      resource.data.category ?? "",
    ].filter(Boolean),

    content: [
      resource.data.title,
      resource.data.description,
      resource.data.type ?? "",
      resource.data.category ?? "",
    ]
      .filter(Boolean)
      .join(" "),

    reference: undefined,
  }));
}