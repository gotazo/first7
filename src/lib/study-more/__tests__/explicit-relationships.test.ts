import assert from "node:assert/strict";
import test from "node:test";

import {
  buildRelationshipIndex,
  getStudyMoreResult,
} from "../resolveRelationships.ts";
import type {
  DictionaryContentRecord,
  NumberContentRecord,
  ProphecyContentRecord,
  RelationshipCollections,
  TeachingContentRecord,
} from "../types.ts";

function dictionary(
  id: string,
  term: string,
  options: Partial<
    Pick<DictionaryContentRecord, "aliases" | "related" | "seeAlso">
  > = {},
): DictionaryContentRecord {
  return {
    kind: "dictionary",
    id,
    title: term,
    href: `/dictionary/${id}`,
    term,
    aliases: options.aliases ?? [],
    related: options.related ?? [],
    seeAlso: options.seeAlso ?? [],
  };
}

function teaching(
  id: string,
  authoredId: string,
  related: string[] = [],
): TeachingContentRecord {
  return {
    kind: "teachings",
    id,
    authoredId,
    title: authoredId,
    href: `/teachings/${id}`,
    related,
  };
}

function prophecy(
  id: string,
  options: Partial<
    Pick<ProphecyContentRecord, "related" | "numbers" | "draft">
  > = {},
): ProphecyContentRecord {
  return {
    kind: "prophecy",
    id,
    title: id,
    href: `/prophecy/${id}`,
    related: options.related ?? [],
    numbers: options.numbers ?? [],
    draft: options.draft ?? false,
  };
}

function numberEntry(
  id: string,
  number: number,
  related: string[] = [],
): NumberContentRecord {
  return {
    kind: "numbers",
    id,
    number,
    title: `Number ${number}`,
    href: `/number/${id}`,
    related,
  };
}

function collections(
  overrides: Partial<RelationshipCollections> = {},
): RelationshipCollections {
  return {
    dictionary: overrides.dictionary ?? [],
    teachings: overrides.teachings ?? [],
    prophecy: overrides.prophecy ?? [],
    numbers: overrides.numbers ?? [],
  };
}

function edgeFor(
  index: ReturnType<typeof buildRelationshipIndex>,
  sourceKind: string,
  sourceId: string,
  targetKind: string,
  targetId: string,
) {
  return index.edges.find(
    (edge) =>
      edge.source.kind === sourceKind &&
      edge.source.id === sourceId &&
      edge.target.kind === targetKind &&
      edge.target.id === targetId,
  );
}

test("Dictionary related resolves an exact canonical entry.id first", () => {
  const index = buildRelationshipIndex(
    collections({
      dictionary: [
        dictionary("source", "Source", { related: ["target-id"] }),
        dictionary("target-id", "Different term"),
        dictionary("other", "target-id"),
      ],
    }),
  );

  assert.ok(edgeFor(index, "dictionary", "source", "dictionary", "target-id"));
  assert.equal(index.edges.length, 1);
});

test("Dictionary related resolves a unique normalized term", () => {
  const index = buildRelationshipIndex(
    collections({
      dictionary: [
        dictionary("source", "Source", { related: ["  TARGET   TERM "] }),
        dictionary("target", "Target Term"),
      ],
    }),
  );

  assert.ok(edgeFor(index, "dictionary", "source", "dictionary", "target"));
});

test("Dictionary related resolves a unique normalized alias", () => {
  const index = buildRelationshipIndex(
    collections({
      dictionary: [
        dictionary("source", "Source", { related: ["also called target"] }),
        dictionary("target", "Canonical target", {
          aliases: ["Also  Called Target"],
        }),
      ],
    }),
  );

  assert.ok(edgeFor(index, "dictionary", "source", "dictionary", "target"));
});

test("Dictionary duplicate canonical terms are ambiguous and omitted", () => {
  const index = buildRelationshipIndex(
    collections({
      dictionary: [
        dictionary("source", "Source", { related: ["shared term"] }),
        dictionary("one", "Shared Term"),
        dictionary("two", " shared   term "),
      ],
    }),
  );

  assert.equal(index.edges.length, 0);
  assert.ok(
    index.diagnostics.some(
      (item) =>
        item.source.id === "source" &&
        item.authoredValue === "shared term" &&
        item.reason === "ambiguous",
    ),
  );
});

test("Dictionary duplicate aliases are ambiguous and omitted", () => {
  const index = buildRelationshipIndex(
    collections({
      dictionary: [
        dictionary("source", "Source", { seeAlso: ["shared alias"] }),
        dictionary("one", "One", { aliases: ["Shared Alias"] }),
        dictionary("two", "Two", { aliases: ["shared   alias"] }),
      ],
    }),
  );

  assert.equal(index.edges.length, 0);
  assert.ok(
    index.diagnostics.some(
      (item) => item.field === "seeAlso" && item.reason === "ambiguous",
    ),
  );
});

test("Dictionary unknown explicit value is diagnosed without a URL", () => {
  const index = buildRelationshipIndex(
    collections({
      dictionary: [dictionary("source", "Source", { related: ["missing"] })],
    }),
  );
  const result = getStudyMoreResult(index, {
    kind: "dictionary",
    id: "source",
  });

  assert.equal(index.edges.length, 0);
  assert.deepEqual(result.groups, []);
  assert.equal(result.diagnostics[0]?.reason, "unresolved");
  assert.equal("href" in (result.diagnostics[0] ?? {}), false);
});

test("Dictionary precedence stops on ID or term before later lookup tiers", () => {
  const index = buildRelationshipIndex(
    collections({
      dictionary: [
        dictionary("source", "Source", {
          related: ["same", "shared term", "shared alias"],
        }),
        dictionary("same", "Not the term", { aliases: ["same"] }),
        dictionary("term-one", "Shared Term", { aliases: ["shared term"] }),
        dictionary("term-two", "shared term"),
        dictionary("alias-one", "Alias One", { aliases: ["shared alias"] }),
        dictionary("alias-two", "Alias Two", { aliases: ["shared alias"] }),
      ],
    }),
  );

  assert.ok(edgeFor(index, "dictionary", "source", "dictionary", "same"));
  assert.equal(
    index.diagnostics.filter((item) => item.source.id === "source").length,
    2,
  );
  assert.equal(index.edges.length, 1);
});

test("Teaching related resolves a unique authored data.id", () => {
  const index = buildRelationshipIndex(
    collections({
      teachings: [
        teaching("topic/source", "source", ["target-authored-id"]),
        teaching("topic/target", "target-authored-id"),
      ],
    }),
  );

  assert.ok(
    edgeFor(index, "teachings", "topic/source", "teachings", "topic/target"),
  );
  assert.equal(index.diagnostics.length, 0);
});

test("Teaching route-id compatibility resolves and is diagnosed", () => {
  const index = buildRelationshipIndex(
    collections({
      teachings: [
        teaching("topic/source", "source", ["topic/target"]),
        teaching("topic/target", "different-authored-id"),
      ],
    }),
  );

  assert.ok(
    edgeFor(index, "teachings", "topic/source", "teachings", "topic/target"),
  );
  assert.ok(
    index.diagnostics.some(
      (item) => item.reason === "route-id-compatibility",
    ),
  );
});

test("Duplicate Teaching data.id is ambiguous and never falls back to route ID", () => {
  const index = buildRelationshipIndex(
    collections({
      teachings: [
        teaching("source", "source", ["topic/duplicate"]),
        teaching("topic/duplicate", "topic/duplicate"),
        teaching("other/duplicate", "topic/duplicate"),
      ],
    }),
  );

  assert.equal(index.edges.length, 0);
  assert.ok(
    index.diagnostics.some(
      (item) => item.reason === "duplicate-id" && item.authoredValue === "topic/duplicate",
    ),
  );
});

test("Prophecy related resolves exact Prophecy entry.id", () => {
  const index = buildRelationshipIndex(
    collections({
      prophecy: [
        prophecy("events/source", { related: ["symbols/target"] }),
        prophecy("symbols/target"),
      ],
    }),
  );

  assert.ok(
    edgeFor(index, "prophecy", "events/source", "prophecy", "symbols/target"),
  );
});

test("Number related resolves exact Number entry.id", () => {
  const index = buildRelationshipIndex(
    collections({
      numbers: [numberEntry("7", 7, ["40"]), numberEntry("40", 40)],
    }),
  );

  assert.ok(edgeFor(index, "numbers", "7", "numbers", "40"));
});

test("Prophecy numbers resolves Number.data.number and retains edge direction", () => {
  const index = buildRelationshipIndex(
    collections({
      prophecy: [prophecy("events/seven", { numbers: [7] })],
      numbers: [numberEntry("seven-route", 7)],
    }),
  );
  const edge = edgeFor(
    index,
    "prophecy",
    "events/seven",
    "numbers",
    "seven-route",
  );
  const result = getStudyMoreResult(index, {
    kind: "numbers",
    id: "seven-route",
  });

  assert.ok(edge);
  assert.equal(edge.strength, "strong");
  assert.equal(edge.evidence[0]?.provenance.kind, "explicit-prophecy-number");
  assert.equal(edge.source.kind, "prophecy");
  assert.equal(edge.target.kind, "numbers");
  assert.equal(result.groups[0]?.items[0]?.kind, "prophecy");
  assert.equal(result.groups[0]?.items[0]?.relationship, edge);
});

test("Draft Prophecy cannot be a relationship target", () => {
  const index = buildRelationshipIndex(
    collections({
      prophecy: [
        prophecy("events/source", { related: ["events/draft"] }),
        prophecy("events/draft", { draft: true }),
      ],
    }),
  );

  assert.equal(index.edges.length, 0);
  assert.ok(index.diagnostics.some((item) => item.reason === "draft-target"));
});

test("Draft Prophecy cannot be a relationship source", () => {
  const index = buildRelationshipIndex(
    collections({
      prophecy: [
        prophecy("events/draft", {
          draft: true,
          related: ["events/live"],
          numbers: [7],
        }),
        prophecy("events/live"),
      ],
      numbers: [numberEntry("7", 7)],
    }),
  );

  assert.equal(index.edges.length, 0);
  assert.equal(
    index.diagnostics.filter((item) => item.reason === "draft-source").length,
    2,
  );
});

test("Self-links are omitted after canonical identity resolution", () => {
  const index = buildRelationshipIndex(
    collections({
      dictionary: [
        dictionary("faith", "Faith", {
          related: ["Faith alias"],
          aliases: ["Faith alias"],
        }),
      ],
    }),
  );

  assert.equal(index.edges.length, 0);
  assert.ok(index.diagnostics.some((item) => item.reason === "self-reference"));
});

test("Duplicate relationship values create one edge and one evidence record", () => {
  const index = buildRelationshipIndex(
    collections({
      dictionary: [
        dictionary("source", "Source", {
          related: ["target", "target"],
        }),
        dictionary("target", "Target"),
      ],
    }),
  );

  assert.equal(index.edges.length, 1);
  assert.equal(index.edges[0]?.evidence.length, 1);
});

test("Multiple explicit fields merge while preserving provenance", () => {
  const index = buildRelationshipIndex(
    collections({
      dictionary: [
        dictionary("source", "Source", {
          related: ["target"],
          seeAlso: ["Target term"],
        }),
        dictionary("target", "Target Term"),
      ],
    }),
  );
  const edge = edgeFor(index, "dictionary", "source", "dictionary", "target");

  assert.equal(index.edges.length, 1);
  assert.deepEqual(
    edge?.evidence.map((item) => item.provenance.kind),
    ["explicit-related", "explicit-see-also"],
  );
  assert.ok(edge?.evidence.every((item) => item.strength === "strong"));
});

test("Relationship ordering is deterministic and preserves authored list order", () => {
  const source = dictionary("source", "Source", {
    related: ["target-b", "target-a"],
  });
  const targetA = dictionary("target-a", "A");
  const targetB = dictionary("target-b", "B");
  const first = buildRelationshipIndex(
    collections({ dictionary: [source, targetA, targetB] }),
  );
  const second = buildRelationshipIndex(
    collections({ dictionary: [targetB, source, targetA] }),
  );

  assert.deepEqual(first, second);
  assert.deepEqual(
    getStudyMoreResult(first, { kind: "dictionary", id: "source" })
      .groups[0]?.items.map((item) => item.id),
    ["target-b", "target-a"],
  );
});

test("Unresolved references never produce broken hrefs", () => {
  const index = buildRelationshipIndex(
    collections({
      prophecy: [prophecy("events/source", { related: ["missing/target"] })],
    }),
  );
  const result = getStudyMoreResult(index, {
    kind: "prophecy",
    id: "events/source",
  });

  assert.deepEqual(result.groups, []);
  assert.equal(index.edges.length, 0);
});