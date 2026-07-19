export interface SearchCollection {
  title: string;
  href: string;
  description: string;
  icon: string;
}

export const SEARCH_COLLECTIONS: SearchCollection[] = [
  {
    title: "Teachings",
    href: "/teachings",
    description: "In-depth Bible studies",
    icon: "book-open",
  },
  {
    title: "Dictionary",
    href: "/dictionary",
    description: "Biblical words explained",
    icon: "book-text",
  },
  {
    title: "Verse Jar",
    href: "/verse-jar",
    description: "Draw a verse by topic",
    icon: "scroll-text",
  },
  {
    title: "Plans",
    href: "/start",
    description: "7-day reading plans",
    icon: "calendar-days",
  },
  {
    title: "Resources",
    href: "/resources",
    description: "Downloads and guides",
    icon: "library",
  },
  {
    title: "Guides",
    href: "/guides",
    description: "Practical Christian living",
    icon: "compass",
  },
  {
    title: "Reflections",
    href: "/reflections",
    description: "Daily encouragement",
    icon: "heart",
  },
];