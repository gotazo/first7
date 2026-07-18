import { getCollection } from "astro:content";

import type { SearchItem } from "../types";

export async function buildPlanIndex(): Promise<SearchItem[]> {
  const plans = await getCollection("start");

  return plans.map((plan) => ({
    id: plan.id,

    type: "plan",

    title: plan.data.title,

    description: plan.data.description,

    url: `/plans/${plan.data.plan}/day/${plan.data.day}`,

    topics: [plan.data.plan],

    keywords: [
      plan.data.plan,
      `day ${plan.data.day}`,
      plan.data.verse,
    ],

    tags: [
      plan.data.plan,
      `day-${plan.data.day}`,
    ],

    content: [
      plan.data.title,
      plan.data.description,
      plan.data.plan,
      plan.data.verse,
      `day ${plan.data.day}`,
    ].join(" "),

    reference: plan.data.verse,
  }));
}