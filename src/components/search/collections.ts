export interface SearchCollection {
  title: string;
  href: string;
  description: string;
  icon: string;
  color: string;
}

export const SEARCH_COLLECTIONS: SearchCollection[] = [
  {
    title: "Teachings",
    href: "/teachings",
    description: "In-depth Bible studies",
    icon: "book-open",
    color: "text-sky-600 dark:text-sky-400",
  },
  {
    title: "Dictionary",
    href: "/dictionary",
    description: "Biblical words explained",
    icon: "book-text",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Verse Jar",
    href: "/verse-jar",
    description: "Draw a verse by topic",
    icon: "scroll-text",
    color: "text-violet-600 dark:text-violet-400",
  },
  {
    title: "Plans",
    href: "/start",
    description: "7-day reading plans",
    icon: "calendar-days",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    title: "Resources",
    href: "/resources",
    description: "Downloads and guides",
    icon: "library",
    color: "text-slate-600 dark:text-slate-400",
  },
  {
    title: "Guides",
    href: "/guides",
    description: "Practical Christian living",
    icon: "compass",
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    title: "Reflections",
    href: "/reflections",
    description: "Daily encouragement",
    icon: "heart",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    title: "Numbers",
    href: "/number",
    description: "Biblical number meanings",
    icon: "hash",
    color: "text-indigo-600 dark:text-indigo-400",
  },
];