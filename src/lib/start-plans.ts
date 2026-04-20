import { getCollection, type CollectionEntry } from 'astro:content';

export type StartEntry = CollectionEntry<'start'>;

export type PlanSummary = {
  plan: string;
  entries: StartEntry[];
};

type DayCard = {
  day: number;
  title: string;
};

type DayPath = {
  plan: string;
  entry: StartEntry;
  planDays: number[];
};

type PlanPath = {
  plan: string;
  days: DayCard[];
};

const entriesPromise = getCollection('start').then((entries) =>
  entries.slice().sort((left, right) => {
    const planOrder = left.data.plan.localeCompare(right.data.plan);
    return planOrder !== 0 ? planOrder : left.data.day - right.data.day;
  })
);

const summariesPromise = entriesPromise.then((entries) => {
  const grouped = new Map<string, StartEntry[]>();

  for (const entry of entries) {
    const plan = entry.data.plan.trim();
    const current = grouped.get(plan);

    if (current) {
      current.push(entry);
      continue;
    }

    grouped.set(plan, [entry]);
  }

  return [...grouped.entries()].map(([plan, planEntries]) => ({
    plan,
    entries: planEntries
  }));
});

const parseListEnv = (value: unknown) => {
  if (typeof value !== 'string') return null;

  const items = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? new Set(items) : null;
};

const parsePositiveIntEnv = (value: unknown) => {
  if (typeof value !== 'string') return null;

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const applyBuildFilters = (summaries: PlanSummary[]) => {
  const includedPlans = parseListEnv(import.meta.env.PLAN_BUILD_INCLUDE);
  const maxDay = parsePositiveIntEnv(import.meta.env.PLAN_BUILD_MAX_DAY);

  return summaries
    .filter((summary) => (includedPlans ? includedPlans.has(summary.plan) : true))
    .map((summary) => ({
      ...summary,
      entries: maxDay
        ? summary.entries.filter((entry) => entry.data.day <= maxDay)
        : summary.entries
    }))
    .filter((summary) => summary.entries.length > 0);
};

export async function getStartPlanSummaries() {
  const summaries = await summariesPromise;
  return applyBuildFilters(summaries);
}

export async function getStartPlanDaysStaticPaths() {
  const summaries = await getStartPlanSummaries();
  const dayPaths: DayPath[] = [];

  for (const summary of summaries) {
    const planDays = summary.entries.map((entry) => entry.data.day);

    for (const entry of summary.entries) {
      dayPaths.push({
        plan: summary.plan,
        entry,
        planDays
      });
    }
  }

  return dayPaths;
}

export async function getStartPlanStaticPaths() {
  const summaries = await getStartPlanSummaries();

  return summaries.map<PlanPath>((summary) => ({
    plan: summary.plan,
    days: summary.entries.map((entry) => ({
      day: entry.data.day,
      title: entry.data.title
    }))
  }));
}
