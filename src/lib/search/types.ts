export type SearchType =
  | "teaching"
  | "dictionary"
  | "verse"
  | "plan"
  | "resource"
  | "guide"
  | "reflection"
  | "bible";

export interface SearchItem {
  id: string;

  type: SearchType;

  title: string;

  description: string;

  url: string;

  topics: string[];

  keywords: string[];

  tags: string[];

  content: string;

  reference?: string;
}