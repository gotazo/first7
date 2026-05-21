export interface BiblicalName {

  name: string;

  meaning: string;

  gender:
    | "male"
    | "female";

  origin: string;

  verse: string;

  testament?: "old" | "new";

  categories?: string[];

  tags?: string[];

}