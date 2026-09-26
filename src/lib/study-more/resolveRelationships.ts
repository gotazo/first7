import type {
  ContentKey,
  ContentKind,
  DictionaryContentRecord,
  NumberContentRecord,
  ProphecyContentRecord,
  RelationshipCollections,
  RelationshipDiagnostic,
  RelationshipEdge,
  RelationshipIndex,
  RelationshipProvenance,
  RelationshipContentRecord,
  StudyMoreGroup,
  StudyMoreResult,
  TeachingContentRecord,
} from "./types.ts";

const CONTENT_KIND_ORDER: ContentKind[] = [
  "dictionary",
  "teachings",
  "prophecy",
  "numbers",
];

const GROUP_TITLES: Record<ContentKind, string> = {
  dictionary: "Dictionary",
  teachings: "Teachings",
  prophecy: "Prophecy",
  numbers: "Numbers",
};
  type ExplicitRelationshipProvenance = Extract<
    RelationshipProvenance,
    { kind: "explicit-related" | "explicit-see-also" | "explicit-prophecy-number" }
  >;

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function compareKeys(left: ContentKey, right: ContentKey): number {
  const kindDifference =
    CONTENT_KIND_ORDER.indexOf(left.kind) -
    CONTENT_KIND_ORDER.indexOf(right.kind);

  return kindDifference || compareText(left.id, right.id);
}

function keyOf(record: ContentKey): string {
  return JSON.stringify([record.kind, record.id]);
}

function sameKey(left: ContentKey, right: ContentKey): boolean {
  return left.kind === right.kind && left.id === right.id;
}

function groupBy<T>(
  records: readonly T[],
  getKey: (record: T) => string,
): Map<string, T[]> {
  const groups = new Map<string, T[]>();

  for (const record of records) {
    const key = getKey(record);
    const group = groups.get(key);

    if (group) {
      group.push(record);
    } else {
      groups.set(key, [record]);
    }
  }

  return groups;
}

function normalizeDictionaryValue(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function diagnosticKey(diagnostic: RelationshipDiagnostic): string {
  return JSON.stringify([
    diagnostic.source.kind,
    diagnostic.source.id,
    diagnostic.field,
    diagnostic.authoredValue,
    diagnostic.reason,
  ]);
}

function provenanceKey(provenance: RelationshipProvenance): string {
  return JSON.stringify(provenance);
}

function sortDiagnostics(
  diagnostics: RelationshipDiagnostic[],
): RelationshipDiagnostic[] {
  const unique = new Map<string, RelationshipDiagnostic>();

  for (const diagnostic of diagnostics) {
    unique.set(diagnosticKey(diagnostic), diagnostic);
  }

  return [...unique.values()].sort((left, right) =>
    compareKeys(left.source, right.source) ||
    compareText(left.field, right.field) ||
    compareText(left.authoredValue, right.authoredValue) ||
    compareText(left.reason, right.reason),
  );
}

function diagnostic(
  source: ContentKey,
  field: RelationshipDiagnostic["field"],
  authoredValue: string,
  reason: RelationshipDiagnostic["reason"],
): RelationshipDiagnostic {
  return {
    source: { ...source },
    field,
    authoredValue,
    reason,
  };
}

function addDuplicateIdentityDiagnostics(
  records: readonly RelationshipContentRecord[],
  diagnostics: RelationshipDiagnostic[],
): void {
  const routeIds = groupBy(records, (record) => keyOf(record));

  for (const candidates of routeIds.values()) {
    if (candidates.length < 2) continue;

    for (const candidate of candidates) {
      diagnostics.push(
        diagnostic(candidate, "id", candidate.id, "duplicate-id"),
      );
    }
  }

  const teachingIds = groupBy(
    records.filter(
      (record): record is TeachingContentRecord =>
        record.kind === "teachings",
    ),
    (record) => record.authoredId,
  );

  for (const [authoredId, candidates] of teachingIds) {
    if (candidates.length < 2) continue;

    for (const candidate of candidates) {
      diagnostics.push(
        diagnostic(candidate, "id", authoredId, "duplicate-id"),
      );
    }
  }

  const numberIdentities = groupBy(
    records.filter(
      (record): record is NumberContentRecord =>
        record.kind === "numbers",
    ),
    (record) => String(record.number),
  );

  for (const [number, candidates] of numberIdentities) {
    if (candidates.length < 2) continue;

    for (const candidate of candidates) {
      diagnostics.push(
        diagnostic(candidate, "id", number, "duplicate-id"),
      );
    }
  }
}

type LookupResult<T> =
  | { status: "resolved"; record: T }
  | { status: "ambiguous" }
  | { status: "unresolved" };

function lookupUnique<T>(records: readonly T[] | undefined): LookupResult<T> {
  if (!records?.length) return { status: "unresolved" };
  if (records.length !== 1) return { status: "ambiguous" };
  return { status: "resolved", record: records[0] };
}

function addEvidence(
  edge: RelationshipEdge,
    provenance: ExplicitRelationshipProvenance,
): void {
  const evidenceKey = provenanceKey(provenance);

  if (
    edge.evidence.some(
      (evidence) => provenanceKey(evidence.provenance) === evidenceKey,
    )
  ) {
    return;
  }

  edge.evidence.push({ provenance, strength: "strong" });
}

export function buildRelationshipIndex(
  collections: RelationshipCollections,
): RelationshipIndex {
  const records: RelationshipContentRecord[] = [
    ...collections.dictionary,
    ...collections.teachings,
    ...collections.prophecy,
    ...collections.numbers,
  ].sort((left, right) => compareKeys(left, right));

  const diagnostics: RelationshipDiagnostic[] = [];
  const edgesByKey = new Map<string, RelationshipEdge>();
  const recordsByKey = groupBy(records, keyOf);
  const dictionaryById = groupBy(collections.dictionary, (record) => record.id);
  const dictionaryByTerm = groupBy(
    collections.dictionary,
    (record) => normalizeDictionaryValue(record.term),
  );
  const dictionaryByAlias = groupBy(
    collections.dictionary.flatMap((record) =>
      [...new Set(record.aliases.map(normalizeDictionaryValue))].map(
        (alias) => ({ alias, record }),
      ),
    ),
    (item) => item.alias,
  );
  const teachingsByAuthoredId = groupBy(
    collections.teachings,
    (record) => record.authoredId,
  );
  const teachingsByRouteId = groupBy(
    collections.teachings,
    (record) => record.id,
  );
  const prophecyById = groupBy(
    collections.prophecy,
    (record) => record.id,
  );
  const numbersById = groupBy(
    collections.numbers,
    (record) => record.id,
  );
  const numbersByValue = groupBy(
    collections.numbers,
    (record) => String(record.number),
  );

  addDuplicateIdentityDiagnostics(records, diagnostics);

  const appendEdge = (
    source: RelationshipContentRecord,
    target: RelationshipContentRecord,
      provenance: ExplicitRelationshipProvenance,
  ): void => {
    if (sameKey(source, target)) {
      diagnostics.push(
        diagnostic(
          source,
          provenance.sourceField,
          String(provenance.authoredValue),
          "self-reference",
        ),
      );
      return;
    }

    const edgeKey = JSON.stringify([keyOf(source), keyOf(target)]);
    let edge = edgesByKey.get(edgeKey);

    if (!edge) {
      edge = {
        source: { kind: source.kind, id: source.id },
        target: { kind: target.kind, id: target.id },
        evidence: [],
        strength: "strong",
      };
      edgesByKey.set(edgeKey, edge);
    }

    addEvidence(edge, provenance);
  };

  const handleLookup = (
    source: RelationshipContentRecord,
    field: RelationshipDiagnostic["field"],
    authoredValue: string,
    result: LookupResult<RelationshipContentRecord>,
    provenance: ExplicitRelationshipProvenance,
  ): void => {
    if (result.status === "unresolved") {
      diagnostics.push(diagnostic(source, field, authoredValue, "unresolved"));
      return;
    }

    if (result.status === "ambiguous") {
      diagnostics.push(diagnostic(source, field, authoredValue, "ambiguous"));
      return;
    }

    if (result.record.kind === "prophecy" && result.record.draft) {
      diagnostics.push(
        diagnostic(source, field, authoredValue, "draft-target"),
      );
      return;
    }

    appendEdge(source, result.record, provenance);
  };

  const handleDraftSource = (
    source: ProphecyContentRecord,
  ): void => {
    for (const authoredValue of source.related) {
      diagnostics.push(
        diagnostic(source, "related", authoredValue, "draft-source"),
      );
    }

    for (const authoredValue of source.numbers) {
      diagnostics.push(
        diagnostic(
          source,
          "numbers",
          String(authoredValue),
          "draft-source",
        ),
      );
    }
  };

  const dictionaryRecords = [...collections.dictionary].sort(compareKeys);

  for (const source of dictionaryRecords) {
    for (const authoredValue of source.related) {
      const byId = lookupUnique<DictionaryContentRecord>(
        dictionaryById.get(authoredValue),
      );
      let result: LookupResult<DictionaryContentRecord> = byId;

      if (byId.status === "unresolved") {
        const byTerm = lookupUnique(
          dictionaryByTerm.get(normalizeDictionaryValue(authoredValue)),
        );
        result = byTerm;

        if (byTerm.status === "unresolved") {
          const aliasRecords = dictionaryByAlias
            .get(normalizeDictionaryValue(authoredValue))
            ?.map((item) => item.record);
          result = lookupUnique(aliasRecords);
        }
      }

      handleLookup(
        source,
        "related",
        authoredValue,
        result,
        {
          kind: "explicit-related",
          sourceField: "related",
          authoredValue,
        },
      );
    }

    for (const authoredValue of source.seeAlso) {
      const byId = lookupUnique<DictionaryContentRecord>(
        dictionaryById.get(authoredValue),
      );
      let result: LookupResult<DictionaryContentRecord> = byId;

      if (byId.status === "unresolved") {
        const byTerm = lookupUnique(
          dictionaryByTerm.get(normalizeDictionaryValue(authoredValue)),
        );
        result = byTerm;

        if (byTerm.status === "unresolved") {
          const aliasRecords = dictionaryByAlias
            .get(normalizeDictionaryValue(authoredValue))
            ?.map((item) => item.record);
          result = lookupUnique(aliasRecords);
        }
      }

      handleLookup(
        source,
        "seeAlso",
        authoredValue,
        result,
        {
          kind: "explicit-see-also",
          sourceField: "seeAlso",
          authoredValue,
        },
      );
    }
  }

  const teachingRecords = [...collections.teachings].sort(compareKeys);

  for (const source of teachingRecords) {
    for (const authoredValue of source.related) {
      const authoredMatch = lookupUnique(
        teachingsByAuthoredId.get(authoredValue),
      );

      if (authoredMatch.status === "ambiguous") {
        diagnostics.push(
          diagnostic(source, "related", authoredValue, "duplicate-id"),
        );
        continue;
      }

      if (authoredMatch.status === "resolved") {
        handleLookup(
          source,
          "related",
          authoredValue,
          authoredMatch,
          {
            kind: "explicit-related",
            sourceField: "related",
            authoredValue,
          },
        );
        continue;
      }

      const routeMatch = lookupUnique(
        teachingsByRouteId.get(authoredValue),
      );

      if (routeMatch.status === "resolved") {
        diagnostics.push(
          diagnostic(
            source,
            "related",
            authoredValue,
            "route-id-compatibility",
          ),
        );
        handleLookup(
          source,
          "related",
          authoredValue,
          routeMatch,
          {
            kind: "explicit-related",
            sourceField: "related",
            authoredValue,
          },
        );
      } else {
        handleLookup(
          source,
          "related",
          authoredValue,
          routeMatch,
          {
            kind: "explicit-related",
            sourceField: "related",
            authoredValue,
          },
        );
      }
    }
  }

  const prophecyRecords = [...collections.prophecy].sort(compareKeys);

  for (const source of prophecyRecords) {
    if (source.draft) {
      handleDraftSource(source);
      continue;
    }

    for (const authoredValue of source.related) {
      handleLookup(
        source,
        "related",
        authoredValue,
        lookupUnique(prophecyById.get(authoredValue)),
        {
          kind: "explicit-related",
          sourceField: "related",
          authoredValue,
        },
      );
    }

    for (const authoredValue of source.numbers) {
      const target = lookupUnique(
        numbersByValue.get(String(authoredValue)),
      );
      handleLookup(
        source,
        "numbers",
        String(authoredValue),
        target,
        {
          kind: "explicit-prophecy-number",
          sourceField: "numbers",
          authoredValue,
        },
      );
    }
  }

  const numberRecords = [...collections.numbers].sort(compareKeys);

  for (const source of numberRecords) {
    for (const authoredValue of source.related) {
      handleLookup(
        source,
        "related",
        authoredValue,
        lookupUnique(numbersById.get(authoredValue)),
        {
          kind: "explicit-related",
          sourceField: "related",
          authoredValue,
        },
      );
    }
  }

  const edges = [...edgesByKey.values()];

  return {
    content: records,
    edges,
    diagnostics: sortDiagnostics(diagnostics),
  };
}

export function getStudyMoreResult(
  index: RelationshipIndex,
  source: ContentKey,
): StudyMoreResult {
  const contentByKey = groupBy(index.content, keyOf);
  const resultEdges = index.edges.flatMap((edge) => {
    if (sameKey(edge.source, source)) return [{ edge, reverse: false }];

    const isNumberReverseLookup =
      source.kind === "numbers" &&
      sameKey(edge.target, source) &&
      edge.evidence.some(
        (evidence) =>
          evidence.provenance.kind === "explicit-prophecy-number",
      );

    return isNumberReverseLookup ? [{ edge, reverse: true }] : [];
  });

  const groupsByKind = new Map<ContentKind, StudyMoreGroup>();
  const seenTargets = new Set<string>();

  for (const { edge, reverse } of resultEdges) {
    const targetKey = reverse ? edge.source : edge.target;
    const targetRecords = contentByKey.get(keyOf(targetKey)) ?? [];
    const target = lookupUnique(targetRecords);

    if (target.status !== "resolved") continue;

    const targetRecord = target.record;
    if (targetRecord.kind === "prophecy" && targetRecord.draft) continue;

    const canonicalTargetKey = keyOf(targetKey);
    if (seenTargets.has(canonicalTargetKey)) continue;
    seenTargets.add(canonicalTargetKey);

    let group = groupsByKind.get(targetKey.kind);
    if (!group) {
      group = {
        kind: targetKey.kind,
        title: GROUP_TITLES[targetKey.kind],
        items: [],
      };
      groupsByKind.set(targetKey.kind, group);
    }

    group.items.push({
      kind: targetRecord.kind,
      id: targetRecord.id,
      title: targetRecord.title,
      href: targetRecord.href,
      relationship: edge,
    });
  }

  const groups = [...groupsByKind.values()].sort(
    (left, right) =>
      CONTENT_KIND_ORDER.indexOf(left.kind) -
      CONTENT_KIND_ORDER.indexOf(right.kind),
  );

  return {
    source: { ...source },
    groups,
    diagnostics: index.diagnostics.filter((item) =>
      sameKey(item.source, source),
    ),
  };
}