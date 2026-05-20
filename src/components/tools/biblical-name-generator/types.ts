export interface BiblicalName {
  name: string;

  meaning: string;

  gender:
    | "male"
    | "female";

  origin: string;

  category: string;

  verse: string;

  testament?: "old" | "new";

  tags?: string[];
}