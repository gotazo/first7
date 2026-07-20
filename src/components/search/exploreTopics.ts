export interface ExploreTopic {
  title: string;
  query: string;
  icon: string;
  color: string;
  bgColor: string;
}

export const EXPLORE_TOPICS: ExploreTopic[] = [
  {
    title: "Faith",
    query: "faith",
    icon: "shield-check",
    color: "text-sky-600 dark:text-sky-400",
    bgColor: "bg-sky-50 dark:bg-sky-900/30",
  },
  {
    title: "Prayer",
    query: "prayer",
    icon: "hand-helping",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
  },
  {
    title: "Hope",
    query: "hope",
    icon: "sunrise",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/30",
  },
  {
    title: "Love",
    query: "love",
    icon: "heart",
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-900/30",
  },
  {
    title: "Grace",
    query: "grace",
    icon: "gift",
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-900/30",
  },
  {
    title: "Peace",
    query: "peace",
    icon: "leaf",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/30",
  },
  {
    title: "Forgiveness",
    query: "forgiveness",
    icon: "heart-handshake",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-900/30",
  },
  {
    title: "Gospel",
    query: "gospel",
    icon: "book-open",
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
  },
  {
    title: "Wisdom",
    query: "wisdom",
    icon: "lightbulb",
    color: "text-yellow-600 dark:text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/30",
  },
  {
    title: "Anxiety",
    query: "anxiety",
    icon: "shield-plus",
    color: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-50 dark:bg-slate-800/40",
  },
];