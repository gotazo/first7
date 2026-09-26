export type ContentKind =
  | "dictionary"
  | "teachings"
  | "prophecy"
  | "numbers";

export interface ContentKey {
  kind: ContentKind;
  id: string;
}

export type RelationshipStrength =
  | "strong"
  | "medium"
  | "weak";

export type RelationshipProvenance =
  | {
      kind: "explicit-related";
      sourceField: "related";
      authoredValue: string;
    }
  | {
      kind: "explicit-see-also";
      sourceField: "seeAlso";
      authoredValue: string;
    }
  | {
      kind: "explicit-prophecy-number";
      sourceField: "numbers";
      authoredValue: number;
    }
  | {
      kind: "canonical-term-match";
      sourceField: "term" | "terms";
      matchedValue: string;
    }
  | {
      kind: "alias-match";
      sourceField: "aliases";
      matchedValue: string;
    }
  | {
      kind: "topic-match";
      sourceField: "topics";
      matchedValue: string;
    }
  | {
      kind: "scripture-overlap";
      sourceField:
        | "scriptures"
        | "scripture.ref"
        | "reference.ref"
        | "featuredVerse.ref";
      matchedValue: string;
    };

export interface RelationshipEvidence {
  provenance: RelationshipProvenance;
  strength: RelationshipStrength;
}

export interface RelationshipEdge {
  source: ContentKey;
  target: ContentKey;
  evidence: RelationshipEvidence[];
  strength: RelationshipStrength;
}

export interface RelationshipDiagnostic {
  source: ContentKey;
  field: "id" | "related" | "seeAlso" | "numbers" | "draft";
  authoredValue: string;
  reason:
    | "unresolved"
    | "ambiguous"
    | "duplicate-id"
    | "route-id-compatibility"
    | "draft-target"
    | "draft-source"
    | "self-reference";
}

interface BaseContentRecord {
  id: string;
  title: string;
  href: string;
}

export interface DictionaryContentRecord extends BaseContentRecord {
  kind: "dictionary";
  term: string;
  aliases: string[];
  related: string[];
  seeAlso: string[];
}

export interface TeachingContentRecord extends BaseContentRecord {
  kind: "teachings";
  authoredId: string;
  related: string[];
}

export interface ProphecyContentRecord extends BaseContentRecord {
  kind: "prophecy";
  related: string[];
  numbers: number[];
  draft: boolean;
}

export interface NumberContentRecord extends BaseContentRecord {
  kind: "numbers";
  number: number;
  related: string[];
}

export interface RelationshipCollections {
  dictionary: DictionaryContentRecord[];
  teachings: TeachingContentRecord[];
  prophecy: ProphecyContentRecord[];
  numbers: NumberContentRecord[];
}

export type RelationshipContentRecord =
  | DictionaryContentRecord
  | TeachingContentRecord
  | ProphecyContentRecord
  | NumberContentRecord;

export interface RelationshipIndex {
  content: RelationshipContentRecord[];
  edges: RelationshipEdge[];
  diagnostics: RelationshipDiagnostic[];
}

export interface StudyMoreContentItem {
  kind: ContentKind;
  id: string;
  title: string;
  href: string;
  relationship: RelationshipEdge;
}

export interface StudyMoreGroup {
  kind: ContentKind;
  title: string;
  items: StudyMoreContentItem[];
}

export interface StudyMoreResult {
  source: ContentKey;
  groups: StudyMoreGroup[];
  diagnostics: RelationshipDiagnostic[];
}