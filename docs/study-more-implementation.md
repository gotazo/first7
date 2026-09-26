# First7 Study More — Implementation Specification

**Status:** Phase 1 implemented and verified (20 tests pass; Astro check: 0 errors)
**Version:** 0.2
**Last inspected:** 2026-09-26
**Scope:** Build-time relationship engine for Dictionary, Teachings, Prophecy, and Numbers, with future content-graph compatibility.

This is the living technical implementation document. Update the status, decisions log, phase checklist, and risks as implementation progresses. The authoritative collection schemas remain in `src/content.config.ts`; this specification does not authorize schema redesign.

### Content Graph principle

The Content Graph describes relationships between First7 content. It must be deterministic, explainable, editorially grounded, resolved at build time where practical, static-first, and independent of user state, rewards, and engagement optimization. It is not a recommendation algorithm based on popularity, clicks, or user behavior.

## 1. Current implementation status

### Implemented today

- Astro content collections exist for Dictionary, Teachings, Prophecy, and Numbers in `src/content.config.ts`.
- Existing routes have local relationship behavior: Teaching, Prophecy, and Number pages calculate subsets from collection arrays; Bible chapter pages call three helpers from `src/lib/relationships/`.
- The Dictionary route loads all four collections and passes them through `DictionaryLayout` into `DictionaryStudyMore`.
- `DictionaryStudyMore` currently renders Dictionary `scriptures`, authored `related` links, and `tags`. The `collections` prop is declared but unused. It has no cross-collection matching logic today.
- `src/types/study.ts` has presentation-level `StudyMoreItem` (`title`, `href`) and `StudyMoreSection` (`title`, `items`, optional `href`) types. There is no relationship-engine model, provenance contract, or typed content identity there.
- `src/content/schemas.ts` exports small scripture shape helpers using `{ reference, text }`; the four target collection schemas are declared inline in `src/content.config.ts` and use `{ ref, text }` where applicable. `src/types/global.d.ts` contains only browser globals.

### Missing today

- Shared content identity adapters, relationship graph/index, provenance, strength tiering, resolver, cross-collection Study More query, and common draft/self-link/deduplication policy.
- A shared Scripture reference parser/overlap service. Current Bible relationship helpers use exact raw string inclusion.
- A test suite or test script: no test files, `vitest`, `jest`, or `test` package script were found. Node's built-in test runner and type stripping are available at the minimum supported Node version with constraints described in §15; no test dependency is needed for Phase 1.
- Common presentation integration across Dictionary, Teaching, Prophecy, Number, and Bible routes.

### Documentation drift to keep visible

`docs/study-more-architecture.md` §36 says the current Dictionary component calculates relationships locally; this is not true of the inspected component now. `docs/study-more-audit.md` describes an earlier component version that calculated unused `relatedDictionary`, `relatedTeachings`, `relatedProphecy`, and `relatedNumbers`, and referred to `entry.data.terms`. The current component has none of those computations and correctly reads Dictionary `tags` instead. Treat current code as source of truth and revise the older documents when their maintenance is in scope.

The architecture document calls Prophecy `numbers` a strong signal in §11, but §12 lists “explicit number relationships” as medium. Phase 0 resolves this conflict: authored `Prophecy.numbers` is **strong**, with provenance `explicit-prophecy-number`. A reverse query from a Number page retains the original Prophecy-to-Number edge direction and provenance.

## 2. Canonical identity

Every graph node must have a collection-qualified canonical key. The canonical key used for target equality and deduplication is `(kind, routeId)`. Route IDs are Astro's `entry.id`, because recommendations must link to the route that Astro actually generates. Other authored identifiers remain lookup keys, not alternate output identities.

| Collection | Canonical route identity | Additional lookup identity / caveat |
|---|---|---|
| Dictionary | `entry.id` (currently path-derived from the flat filename, e.g. `altar`) | `data.term` is the canonical lexical label; aliases and `seeAlso`/`related` values must resolve through an exact normalized term/alias/ID lookup. Do not assume term always equals ID. |
| Teachings | `entry.id` (nested path, e.g. `altar/ancient-foundations`) | Required authored `data.id` (e.g. `ancient-foundations`) is the identifier used by existing authored Teaching `related` values and the generated teaching index. Build a unique `data.id -> entry` map, resolve to `entry.id`, and report duplicate or unresolved authored IDs. Do not change the existing content IDs or routes as part of the engine. |
| Prophecy | `entry.id` (category path, e.g. `events/armageddon`) | No frontmatter ID exists in the schema. Existing `related` values use category-qualified Astro IDs. |
| Numbers | `entry.id` (numeric filename string, e.g. `7`) | Required `data.number` is numeric and must remain distinct from string route ID. Use a numeric-value lookup for `Prophecy.numbers` and a route-ID lookup for Number `related`. |

All lookups are collection-scoped. An ID such as `7` in Numbers is not interchangeable with an ID `7` in another collection. Output URLs are generated from the resolved entry's canonical route identity, never by interpolating unresolved authored strings.

## 3. Current reference formats

The content uses human-readable reference strings at more than one granularity. They are not a normalized key format yet.

| Collection | Schema locations used as references | Observed forms |
|---|---|---|
| Dictionary | `scriptures: string[]`; `reference.ref`; `featuredVerse.ref` | Book/chapter (`Genesis 8`), verse (`Genesis 8:20`), and ranges (`Hebrews 11:1-6`, `John 1:14-17`). |
| Teachings | `scripture.ref`; `scriptures: string[]` | Primary specific verse/range (`Isaiah 58:12`, `John 10:28-29`) and additional chapter (`Isaiah 58`, `Matthew 7`) or verse/range strings. |
| Prophecy | `scriptures: string[]`; `featuredVerse.ref` | Chapter (`Revelation 13`), verse (`Matthew 24:15`), and ranges (`Daniel 7:3-7`). |
| Numbers | `scriptures: string[]`; `featuredVerse.ref` | Primarily chapters (`Genesis 2`, `Revelation 13`), with schema permitting any string and featured refs potentially verse-level. |

A future normalized reference should represent a canonical book key, chapter, and either whole-chapter scope or an inclusive verse interval. Parse content references independently of UI link generation. Initial overlap rules: same chapter with intersecting intervals is eligible medium evidence; exact verse/range overlap is more specific; same-book-only overlap is weak and not sufficient to display. Invalid or unsupported references produce no inferred relationship and should be visible in test/build diagnostics. Book-name aliases and punctuation rules must be explicit; do not silently use fuzzy parsing.

Current code limitations: `getRelatedDictionary`, `getRelatedProphecy`, and `getRelatedTeachings` compare the requested chapter string against raw array values exactly. Teaching route overlap omits the primary `scripture.ref`. `RelatedScriptures.astro` parses a book/chapter and optional single verse for a URL, but does not implement interval overlap or range handling.

## 4. Proposed shared TypeScript relationship model

Keep the engine model separate from Astro rendering types and content-schema types. The following is a contract sketch, not code already present:

```ts
type ContentKind = "dictionary" | "teachings" | "prophecy" | "numbers";

type ContentKey = {
  kind: ContentKind;
  id: string; // canonical Astro entry.id
};

type RelationshipStrength = "strong" | "medium" | "weak";

type RelationshipEvidence = {
  provenance: RelationshipProvenance;
  strength: RelationshipStrength;
  matchedValue?: string;
};

type RelationshipEdge = {
  source: ContentKey;
  target: ContentKey;
  evidence: RelationshipEvidence[];
  strength: RelationshipStrength; // strongest evidence tier on this edge
};

type ResolvedContent = {
  key: ContentKey;
  title: string;
  href: string;
  // normalized lookup data and source entry remain internal to the engine
};

type StudyMoreContentItem = {
  kind: ContentKind;
  title: string;
  href: string;
};

type StudyMoreGroup = {
  kind: ContentKind;
  title: string;
  items: StudyMoreContentItem[];
};

type StudyMoreResult = {
  groups: StudyMoreGroup[]; // empty groups omitted
};
```

Model requirements:

- Keep relationship edges directed. A source's `related` value does not automatically create the reverse authored edge. The index may support reverse lookup, but it must retain actual edge direction and evidence.
- Use a discriminated provenance union (see §5), not free-form text or only a numeric score.
- A target key always uses the resolved canonical Astro ID, even where a frontmatter alias was used to find it.
- Keep Astro `CollectionEntry` and raw collection contents inside adapters/build logic. UI result types should contain only stable display fields and ready-to-use `href` values.
- `src/types/study.ts` already exports the presentation-level `StudyMoreItem`. Keep that separate; use the distinct engine projection name `StudyMoreContentItem` (or another non-conflicting name) and do not put graph extraction or scoring into the presentation type.
- Do not use floating scores or fuzzy match values in the initial system. Strength tier and deterministic rule priority are sufficient and explainable.

## 5. Relationship provenance model

Every edge must preserve why it exists, with source field and matched value where useful. Suggested discriminants:

```ts
type RelationshipProvenance =
  | { kind: "explicit-related"; sourceField: "related" }
  | { kind: "explicit-see-also"; sourceField: "seeAlso" }
  | { kind: "explicit-prophecy-number"; sourceField: "numbers" }
  | { kind: "canonical-term-match"; sourceField: "term" | "terms" }
  | { kind: "alias-match"; sourceField: "aliases" }
  | { kind: "topic-match"; sourceField: "topics" }
  | { kind: "scripture-overlap"; sourceField: "scriptures" | "scripture.ref" | "reference.ref" | "featuredVerse.ref" };
```

`explicit-prophecy-number` has strength `strong`. The source and target remain Prophecy and Number even when a Number page asks for reverse relationships; do not synthesize a Number-authored edge. The source field means the authored field that supplied the evidence; preserve direction when querying in reverse. Consider including normalized matched references or terms in internal diagnostics, but do not expose raw evidence as UI copy initially.

Multiple evidence records may support one edge. Keep their stable order and exact provenance; the edge's effective strength is the strongest supported tier. Do not discard explicit provenance merely because another signal was also found.

## 6. Relationship strength model

Use three named tiers from the architecture. Do not invent an opaque score.

- **Strong:** resolved explicit editorial `related`; resolved Dictionary `seeAlso`; Teaching `related` after identity resolution; Prophecy `related`; Numbers `related`; authored Prophecy `numbers` with provenance `explicit-prophecy-number`. The latter is strong because it is an explicit editorial relationship in the schema, not inferred number occurrence in text.
- **Medium:** exact canonical term matches; exact alias matches after unique resolution; explicitly controlled/meaningful topic matches only where a stable topic ID is confirmed; normalized same-chapter Scripture overlap with meaningful verse intersection. These are deterministic but inferred and must pass candidate relevance rules.
- **Weak:** broad tags/categories, generic keyword overlap, same-book-only scripture overlap, title similarity, or broad textual overlap. Weak evidence alone never creates a displayed item. Initial implementation should not use weak signals for recommendations; provenance may reserve them for future discovery tooling.

“Explicit number relationship” should not be interpreted as number occurrence in text. Only the authored `Prophecy.numbers` field (and authored Number `related`) can make number edges. No inference from prose or arbitrary Scripture numerals.

## 7. Relationship resolution strategy

1. Adapt collection entries into normalized internal records, retaining `entry.id` and the source fields needed for provenance. Keep raw source entries available only inside the engine boundary.
2. Build deterministic maps: `(kind, entry.id) -> record`; Teaching `data.id -> Teaching record`; Dictionary normalized exact `term`/alias -> Dictionary record; Numbers `data.number -> Number record`; and parsed Scripture chapter/interval -> records. Detect ambiguous keys instead of taking the first match.
3. Resolve explicit edges first:
  - Dictionary `related` and `seeAlso` values use this exact precedence: (1) exact canonical Astro `entry.id` match, only if unique; (2) exact normalized Dictionary `term`, only if unique; (3) exact normalized Dictionary `aliases`, only if unique; (4) unresolved. If a higher-precedence key is ambiguous, omit it with a diagnostic and do not fall through to a lower-precedence key. In particular, duplicate canonical Dictionary terms are ambiguous and must not resolve to an arbitrary entry.
  - For normalized term/alias comparisons, trim surrounding whitespace, case-fold, and collapse repeated internal whitespace to one space. Do not change punctuation, singular/plural forms, or spelling. Do not use fuzzy matching, edit distance, semantic/AI matching, or guessed URLs. Alias collisions are ambiguous and omitted.
  - Teaching `related` resolves through a unique authored `data.id` first. If no authored ID matches, an exact unique Astro route ID may resolve as a legacy route-ID reference because Phase 0 found this form in current content; emit a diagnostic identifying that form. If the authored ID is duplicated, treat it as ambiguous and do not fall back to a route ID or select a duplicate.
   - Prophecy `related` resolves to Prophecy `entry.id`.
   - Number `related` resolves from numeric strings to Number `entry.id` (validate against canonical numeric route ID; do not use fuzzy numeric parsing).
   - Prophecy `numbers` resolves numeric values through `Number.data.number` and is retained as authored Prophecy-to-Number evidence; reverse discovery can query that directed edge.
4. Add eligible structured inferred evidence using exact normalized equality for term/alias/topic and interval intersection for Scripture. Do not split phrases into words, use edit distance, tokenize broad prose, or invoke AI/semantic matching.
5. Filter unresolved targets, unpublished Prophecy, self-links, invalid routes, and weak-only candidates. Keep data errors in build/test diagnostics; missing optional recommendations should not break static rendering.
6. Merge evidence for the same target key (see §9), then sort and project to Study More groups (see §8 and §10).

Normalization is deliberately conservative: trim and case-fold exact text keys, and collapse repeated internal whitespace to one space. Do not strip meaningful punctuation or equate singular/plural terms automatically. Alias resolution must be unique; ambiguous aliases do not generate a candidate.

### Fail-safe resolution principle

The relationship engine must fail safely rather than guess:

| Resolution state | Behavior |
|---|---|
| Known and unique | Resolve to the canonical collection-qualified route key. |
| Known but ambiguous | Omit the relationship and emit a diagnostic. This includes duplicate canonical Dictionary terms, colliding aliases, and ambiguous canonical IDs; never choose the first match or fall through to a lower-precedence Dictionary lookup. |
| Unknown | Omit the relationship and emit an unresolved-target diagnostic. |
| Draft/unpublished | Omit the relationship and emit an unavailable-target diagnostic. |
| Self-reference | Omit the relationship. |

No unresolved or unavailable relationship may generate a broken or guessed URL. Diagnostics should be deterministic and useful for editorial cleanup; they do not modify content.

## 8. Deterministic ordering rules

Identical collection inputs and configuration must produce byte-for-byte equivalent relationship results regardless of file enumeration order.

Recommended ordering within a result:

1. Content-kind group order is fixed and documented, e.g. Dictionary, Teachings, Prophecy, Numbers. The UI may choose a different fixed order but must not derive it from runtime enumeration.
2. Within a group, explicit editorial edges precede medium inferred edges; weak-only edges are absent.
3. Preserve explicit author order within each field (`related` in listed order, then `seeAlso` in listed order) where one field supplies a list. Define a fixed field precedence for relationships from multiple explicit fields.
4. For inferred items, use a fixed provenance priority (for example canonical term, alias, topic, Scripture) and then a stable case-insensitive title order, with canonical `(kind, id)` as final tie-breaker.
5. If a target has both explicit and inferred evidence, place it using its strongest/explicit tier and retain all provenance. It appears only once.

No randomization, timestamps, build traversal order, locale-dependent sorting without a fixed locale, or unstable score ties. If a per-group cap is later introduced, apply it only after deterministic ordering and document it; the initial engine should not truncate explicit editorial edges.

## 9. Deduplication rules

- Deduplicate by canonical target key `(kind, entry.id)` within a source's result, not title, URL text, term, or alias.
- Merge all evidence for the same edge and preserve each distinct provenance/matched value deterministically.
- Effective edge strength is the strongest evidence tier. Explicit evidence always remains marked and cannot be hidden by inferred evidence.
- An item linked by both a term and Scripture overlap is rendered once with both reasons retained internally.
- Different target records with the same title remain distinct; identity, not title similarity, controls deduplication.
- Duplicate authored values resolving to the same target render once; preserve first authored position and optionally report duplicate source values during validation.

## 10. Self-link prevention

Before projecting any edge, compare source and target collection-qualified canonical keys. If both kind and Astro `entry.id` match, omit the edge even if it arose through an alias, explicit relationship, Scripture overlap, or reverse lookup. This also prevents Dictionary aliases from resolving back to the current Dictionary entry. Self-link checks happen after resolution to canonical identity, not before.

## 11. Draft-content handling

Prophecy has `draft: boolean` with default `false`; its route excludes drafts from static paths. The relationship engine must use that same publication rule:

- Draft Prophecy entries are neither eligible Study More targets nor sources for published recommendations.
- Explicit references to a draft resolve to a known-but-unavailable target and are omitted with an optional validation diagnostic; do not expose its title or generate its route.
- Other collections have no `draft` field in their current schemas. Do not invent draft filtering there.
- Any future publish/visibility model for other collections belongs in the content adapter and must be based on real schema/route rules.

## 12. Collection loading and build-time strategy

Keep the engine static-first and browser-JavaScript-free. Astro `getCollection()` is the source of truth; do not use the Teaching search JSON or client search index as relationship data.

- Load each target collection once per relationship-index build, then normalize and make lookup maps once. Avoid “for each generated route, load all collections and linearly scan every collection” behavior.
- The likely first implementation is a shared build-scoped loader in `src/lib/study-more/` that calls `getCollection()` for the four collections and builds an in-memory index. A memoized promise can prevent repeated work when multiple prerendered pages import/query the same module, but verify Astro build/module lifetime rather than assuming process-wide caching.
- Keep pure identity/resolution functions independent of Astro imports so tests can exercise them with fixtures. Put `getCollection()` calls in the Astro-facing adapter/builder.
- Routes should request only compact per-source `StudyMoreResult` data. Do not pass all collections through component props once integration is migrated. Do not serialize Maps, raw collection entries, or the whole graph to the browser.
- No generated JSON is required initially. If profiling later shows a persistent generated index is useful, make that a separate decision and preserve build determinism.
- Continue Astro static prerendering; gracefully return an empty result where no eligible relationships exist.

## 13. Proposed source-code structure

The architecture document recommends the following boundary; implementation may combine tiny modules if it preserves that boundary:

```text
src/lib/study-more/
├── index.ts                 # public API
├── types.ts                 # keys, evidence, edges, groups/results
├── buildStudyMoreIndex.ts   # load once and build lookup/index data
├── resolveRelationships.ts # explicit resolution, inferred evidence, filters/dedupe/order
├── dictionary.ts            # Dictionary adapter and lookup rules
├── teachings.ts             # Teaching adapter, authored-ID map
├── prophecy.ts              # Prophecy adapter and draft handling
├── numbers.ts               # Number route/numeric identity adapter
└── scripture.ts             # normalized parser/overlap; introduced in Scripture phase
```

Keep route components and Astro templates as consumers. Do not expand `src/types/study.ts` into engine logic; if a bridge type is needed, define a small projection from the engine's result to the existing presentation types. Do not modify `src/content.config.ts` or `src/content/schemas.ts` in the initial phases unless a concrete schema defect blocks a required behavior and is recorded first.

## 14. Exact implementation phases

Phases preserve the order in `docs/study-more-architecture.md` while making their deliverables testable. The current task creates only this specification; no implementation phase has begun.

### Phase 0 — Specification and decisions (completed)

- Confirmed Dictionary explicit-target precedence and conservative normalization; see D2/D5.
- Confirmed authored `Prophecy.numbers` is Strong and reverse queries retain the original direction/provenance; see D4.
- Audited Teaching authored IDs and explicit relationship targets, Dictionary `related`/`seeAlso`/terms/aliases, Prophecy `related`/`numbers`, and Number `related` without editing content; results are recorded below and in D14.
- Confirmed duplicate or ambiguous identities are invalid until explicitly resolved; no automatic first-match behavior.
- Confirmed Node's built-in test runner with built-in TypeScript type stripping is adequate for constrained, pure relationship tests at Node `>=22.12.0`; no dependency installation or package-file change is needed for this decision; see D9.
- Confirmed the engine projection uses a name distinct from `src/types/study.ts`'s presentation `StudyMoreItem`; see D12.
- Kept Scripture normalization policy and test scope open for Phase 3. No implementation work has started.

#### Read-only content audit results

Counts below are authored reference occurrences (not unique graph edges). Frontmatter was parsed with the already-installed `gray-matter` dependency; no content was edited.

| Audit | Result |
|---|---|
| Teachings scanned | 326 entries. |
| Duplicate Teaching `data.id` | 8 duplicated identifier groups: `ancient-foundations`, `built-on-the-rock`, `secure-in-the-shepherd`, `breaking-generational-patterns`, `encourage-yourself-in-the-lord`, `praying-from-victory-not-defeat`, `the-cost-of-spiritual-sacrifice`, and `guard-your-heart`. All remain unresolved/invalid until editorially resolved. |
| Teaching `related` | 765 values: 130 unresolved; 32 resolve to duplicated authored IDs and are ambiguous; 38 match an Astro route ID but not an authored ID; remaining values resolve to one authored ID. The 38 route-ID forms may resolve only by exact unique route ID and must be diagnosed. A duplicated authored ID is always ambiguous and cannot be bypassed with route-ID fallback. |
| Dictionary scanned | 516 entries. Three duplicate normalized canonical terms: `haran`, `zipporah`, and `priest`. |
| Dictionary `related` | 2,372 values: 1,185 exact IDs; 408 normalized terms; 56 unique aliases; 6 ambiguous terms; 1 ambiguous alias; 716 unresolved. |
| Dictionary `seeAlso` | 1,730 values: 765 exact IDs; 366 normalized terms; 32 unique aliases; 3 ambiguous terms; 564 unresolved. |
| Dictionary aliases | Three alias keys collide across entries: `lampstand`, `candlestick`, and `grain offering`. One authored relationship occurrence is ambiguous by alias. Do not select a record for these collisions. |
| Prophecy scanned | 158 entries. Of 346 `related` values, 133 do not match a Prophecy route ID. The `numbers` field currently has zero authored values, so there are zero invalid `numbers` targets to report; absence of authored values is not evidence that every possible value was tested. |
| Numbers scanned | 35 entries. Of 56 `related` values, 6 do not match a Number route ID; some are category-prefixed cross-content-looking strings such as `people/gideon`, which the Number route does not resolve as Number IDs. |

These findings are audit-only. Do not edit content to repair them as part of Phase 0 or Phase 1. The engine must omit invalid/ambiguous edges and emit deterministic diagnostics until an editorial content change is separately authorized.

Phase 0 audit checklist (completed, read-only):

- [x] Duplicate Teaching `data.id` values.
- [x] Unresolved Teaching `related` values.
- [x] Teaching `related` values that match route IDs instead of authored IDs.
- [x] Unresolved Dictionary `related` values.
- [x] Unresolved Dictionary `seeAlso` values.
- [x] Duplicate/ambiguous Dictionary aliases and duplicate canonical terms.
- [x] Invalid Prophecy `related` targets.
- [x] Invalid Prophecy `numbers` values (none authored; zero invalid values to compare).
- [x] Invalid Number `related` targets.

### Phase 1 — Relationship foundation (no route migration)

- Implement **only** shared relationship types; collection identity adapters; identity lookup maps; explicit relationship resolution; provenance; strong relationship classification; missing/ambiguous target handling; draft filtering; self-link prevention; deduplication; deterministic ordering; and pure tests.
- Dictionary canonical term/alias indexes in this phase exist only to resolve explicit `related`/`seeAlso` values using D2 precedence. They must not generate inferred term/alias edges.
- Include authored Prophecy `numbers` as a strong, directed explicit edge with provenance `explicit-prophecy-number`; reverse queries retain the original edge.
- Apply the fail-safe table above: unknown, ambiguous, and draft targets are omitted with diagnostics; self-links are omitted; unresolved strings never become hrefs.
- Phase 1 must **not** implement fuzzy, semantic, or AI matching; Scripture parsing/overlap; broad tag matching; general keyword matching; Study More UI integration; route migration; schema changes; content changes; search changes; package changes; or dependency installation.
- Add pure tests for identity resolution and explicit edges. Do not change existing schemas, content, routes, helpers, UI, search indexes, or search code.

### Phase 2 — Deterministic inferred relationships

- Add exact canonical term and alias matches and only approved controlled topic matches. Prophecy-to-Number explicit edges are already covered in Phase 1.
- Enforce that weak signals never display alone. No fuzzy, semantic, broad tag, or general keyword matching.
- Test exact matching, casing/whitespace policy, ambiguous alias rejection, duplicate evidence, and absence of fuzzy matches.

### Phase 3 — Scripture normalization

- Add a pure Scripture reference parser and chapter/range overlap service covering observed chapter, verse, and inclusive range formats.
- Include each collection's actual Scripture sources, including Teaching primary `scripture.ref`, Dictionary `reference.ref`/featured reference, and featured references where configured.
- Test boundaries, same/different books, chapter-vs-range, intersecting/nonintersecting ranges, malformed references, and stable normalization.

### Phase 4 — Dictionary Study More integration

- Pass engine results from the Dictionary route to a presentational `DictionaryStudyMore` prop.
- Show only non-empty groups and preserve current explicit Dictionary `related` display behavior, now through resolved targets.
- Do not redesign styling or re-label tags as relationships. Treat Scripture links/sections as presentation work distinct from edge resolution.

### Phase 5 — Existing page migration

- Migrate Teaching, Prophecy, and Number route-local collection scans to the shared index without behavior regressions.
- Migrate Bible chapter relationship helper consumers to normalized Scripture query results when Bible pages enter scope.
- Keep existing helper exports as compatibility wrappers during transition; delete/replace them only after all callers are migrated and tests/build validate equivalent intended behavior.

### Phase 6 — Study Plans and Devotional Plans

- Define plan-to-content references using canonical collection-qualified keys. Editorially authored plan sequences remain authoritative; relationship discovery may assist authoring but must not silently generate plan order.

### Phase 7 — Progression integrations

- Connect user completion history to the public content graph for Learning Progress, Passport milestones, and Rewards. Keep user activity data separate from the public relationship index and avoid rewarding page opens alone.

### Phase 8 — Personalization and Games

- Consider transparent, local-first personalization based on explicit user study history only. Define an external, versioned content reference contract for any future Games integration; do not couple this engine to the separate game project now.

## 15. Testing strategy

### Existing repository baseline and runner decision

No test files or test script were found. `package.json` has no test dependency. The project is ESM (`"type": "module"`) and requires Node `>=22.12.0`. Node v22.12.0 provides the built-in `node:test` runner and experimental TypeScript type stripping with `--experimental-strip-types`, which is sufficient for the planned pure relationship tests without a dependency. Invoke `.test.ts` files explicitly, use ESM and explicit `.ts` import extensions, and restrict testable engine TypeScript to erasable syntax. Node's strip-types mode does not type-check, read `tsconfig.json`, support TSX, or transform enums/namespaces/parameter properties; use Astro/type-check validation separately where applicable. The currently installed Node 24.4 also accepts `node --experimental-strip-types --test`. No package script or package-file edit is required by this decision. Do not claim tests pass until actual test files are implemented and run.

### Unit coverage

- Identity: flat Dictionary route ID vs term; Teaching `data.id` to nested route `entry.id`; Prophecy path ID; Number string ID vs numeric `number`; duplicate authored IDs and ambiguous lookup keys. Run pure `.test.ts` files explicitly with Node's built-in runner and type stripping, using explicit `.ts` imports and no non-erasable TypeScript syntax.
- Explicit edges: each collection's `related`; Dictionary `seeAlso`; Prophecy `numbers`; valid, missing, ambiguous, and draft targets; direction preservation; self-link rejection.
- Inferred edges: exact term, unique alias, approved topic, no fuzzy match, weak-only rejection.
- Scripture: chapter/verse/range parsing, inclusive overlap, chapter-wide overlap, disjoint ranges, alternate book formatting rules, malformed input.
- Graph behavior: provenance merge, strongest tier retention, deduplication, deterministic ordering independent of input order, empty results, no mutation of source records.

### Integration gates

- Astro type/content validation (`npx astro check`) after route/UI phases.
- Production static build and assertions against generated routes/markup after integration. Existing `npm run build` first runs `build:index`, which writes `src/indexes/teachings-index.json`; account for that generated-file side effect when running validation and do not overwrite unrelated user changes.
- Verify no client-side relationship request/runtime logic was introduced and draft Prophecy URLs remain excluded.

## 16. Migration strategy from existing relationship helpers

Current files and behaviors:

- `src/lib/relationships/getRelatedDictionary.ts`: exact `entry.data.scriptures.includes(scripture)`.
- `src/lib/relationships/getRelatedProphecy.ts`: same exact-array match.
- `src/lib/relationships/getRelatedTeachings.ts`: same exact-array match.
- `src/pages/bible/[book]/[chapter].astro`: builds one chapter string and calls the three helpers; no Number helper is currently used.
- Teaching page: shared raw Scripture values between Teaching `scriptures` and Prophecy `scriptures`; Dictionary matching from lower-case Teaching keywords to Dictionary terms. Does not include Teaching primary scripture in that Scripture filter.
- Prophecy page: exact authored Prophecy `related` ID lookup and exact term-to-Dictionary-term matching; draft routes are already excluded.
- Number page: exact Number `related` ID lookup, term-to-Dictionary-term match, and reverse Prophecy numeric field lookup.

Migration rules:

1. Leave all these files untouched in Phase 1 and Phase 2; test the new engine independently.
2. During Phase 4, route Dictionary recommendations through the engine while preserving resolved editorial links and output URL behavior.
3. During Phase 5, migrate one route family at a time; use compatibility wrapper functions around the new index if existing page/layout APIs make that safest. Keep names/signatures temporarily where external callers depend on them.
4. For Bible routes, replace raw exact matching only after the normalizer is tested. Add Numbers as a new relationship result only as an intentional scope extension.
5. Remove old helper implementations only after repo-wide caller search, equivalent/approved behavior tests, and successful Astro check/build.
6. Search/index builders remain separate. `src/indexes/teachings-index.json` is a generated search/teaching artifact, not a relationship authority; do not repurpose it.

## 17. Study More UI boundary

`DictionaryStudyMore.astro` should become a renderer, not a relationship resolver. Its future public input should be a compact `StudyMoreResult`/group list with display title and pre-resolved `href`; the component may decide visual markup and omit empty groups but must not:

- call `getCollection()` or scan collection props;
- resolve authored IDs or aliases;
- compare terms, tags, topics, or Scriptures;
- parse Scripture references;
- determine strength, provenance, ordering, drafts, or deduplication.

The route/page or a thin Astro-facing service requests the result from `src/lib/study-more/`, then passes it to the component. UI labels and style stay independent from edge-generation logic. Current Scriptures and tags are existing content display, not yet resolved Study More relationships; preserve or change their display only in an explicitly scoped UI phase.

## 18. Future compatibility with First7 learning features

The relationship engine is the public, deterministic **Content Graph**. It must not contain user-specific state, completion status, rewards, or personalization.

- **Study Plans / Devotional Plans:** reference stable, collection-qualified content keys and Scripture ranges. Authored day/order is canonical. Plans may consume edge queries as authoring support but should not automatically change their curated sequence.
- **Learning Progress:** store user completion and review activity separately, keyed by content identity. The graph provides possible relationships; user state records what a person studied.
- **Passport:** derive progress/milestones from meaningful completion records and curated journeys, not from merely opening recommended pages.
- **Rewards:** consume verified learning events as a separate layer; never alter relationship ranking or put rewards logic in content adapters.
- **Games:** remain a separate project/integration boundary. Later exchange stable content keys or curated activity references through an explicit contract; do not make the content relationship engine depend on game code or game runtime.
- **Broader First7 Content Graph:** add new content kinds through adapters and typed keys while preserving the same identity, provenance, deterministic ordering, and no-fuzzy rules. Bible can be added as a Scripture-reference node/model later without making the first release depend on a Bible collection.

Keep public/static content edges distinct from private/local-first User Learning Graph state. This separation protects static generation, privacy, offline use, testability, and future optional synchronization.

## 19. Decisions Log

Update this table when a decision is confirmed. “Proposed” entries are not irreversible schema decisions.

| ID | Decision / question | Current status | Resolution required before |
|---|---|---|---|
| D1 | Canonical target identity is collection kind + Astro `entry.id`; Teaching `data.id` and Number `data.number` are lookup keys, not route identities. | **Confirmed.** | Phase 1. |
| D2 | Dictionary `related`/`seeAlso` precedence: exact unique `entry.id`, exact normalized `term` only if unique, exact normalized alias only if unique, otherwise unresolved. An ambiguous match is omitted with a diagnostic and does not fall through. Trim/case-fold/collapse repeated whitespace only. | **Confirmed.** | Phase 1. |
| D3 | Teaching `related` resolves through a unique authored `data.id`; if none exists, an exact unique `entry.id` may resolve as a route-ID reference with a diagnostic. Duplicated authored IDs are ambiguous and never fall back. | **Confirmed from audit.** | Phase 1. |
| D4 | Authored Prophecy `numbers` is Strong with provenance `explicit-prophecy-number`; reverse Number queries retain Prophecy-to-Number direction. | **Confirmed;** resolves the architecture conflict. | Phase 1. |
| D5 | Text normalization trims, case-folds, and collapses repeated whitespace. No punctuation guessing, singular/plural conversion, fuzzy, semantic, or AI matching. | **Confirmed for explicit target resolution.** | Phase 1; review before any later inferred matching. |
| D6 | Meaningful controlled Teaching topic matches need a stable topic-registry contract; broad Prophecy/Number categories do not qualify alone. | Open; topic values show case variation. | Phase 2. |
| D7 | Scripture parser supports book/chapter, single verse, and inclusive verse range; whole chapter covers all verses. Book aliases and malformed-reference policy require explicit rules. | Open. | Phase 3. |
| D8 | Explicit author list order is preserved; inferred ordering is fixed provenance priority then title and canonical ID. | Proposed. | Before inferred matching/UI integration. |
| D9 | Use Node's built-in `node:test` and `--experimental-strip-types` for pure TypeScript tests; no dependency or package-file changes. Explicitly invoke `.test.ts` files and limit syntax to Node's erasable TS subset; Node does not type-check. | **Confirmed for Node `>=22.12.0`;** no test files yet. | Phase 1. |
| D10 | Build-scoped memoized index vs per-route static path construction. | Open pending Astro build verification. | Engine integration. |
| D11 | Older architecture/audit component descriptions differ from current `DictionaryStudyMore`. | Confirmed drift; current source is authoritative. | When those docs are next maintained. |
| D12 | Engine-level projected item must have a name distinct from presentation `StudyMoreItem` in `src/types/study.ts`. | **Confirmed:** use `StudyMoreContentItem` in the engine contract. | Phase 1. |
| D13 | Fail safely: unique known target resolves; ambiguous/unknown/draft target is omitted with diagnostic; self-reference is omitted; unresolved values never produce URLs. | **Confirmed.** | Phase 1. |
| D14 | Phase 0 performs read-only audits of Teaching IDs/related values, Dictionary `related`/`seeAlso`/terms/aliases, Prophecy `related`/`numbers`, and Number `related`. | **Completed;** counts and findings recorded in §14. | Before Phase 1; no content edits. |
| D15 | Content Graph is deterministic, explainable, editorially grounded, build-time/static-first, independent of user state/rewards/engagement optimization. | **Confirmed principle.** | All phases. |

## 20. Future Improvements

Only consider these after deterministic core behavior is shipped and measured:

- Build-time diagnostics/report for unresolved explicit edges, duplicate Teaching authored IDs, duplicate Dictionary aliases/terms, malformed Scripture references, and links to drafts.
- Editorial tooling or a graph visualization powered by retained provenance; no runtime algorithm changes required.
- Curated relationship overrides or edge suppression if real content review reveals a false positive, with decisions represented explicitly rather than hidden score adjustments.
- Explicit, tested book-name aliases and additional reference formats if authored content demonstrates the need.
- Controlled topic taxonomy normalization if a maintained registry becomes authoritative for all relevant collections.
- Performance measurement at realistic collection sizes before introducing generated graph artifacts or more complex caching.
- Versioned stable content keys for Study Plans and external consumers if route slugs may change in future.
- Transparent local-first personalization as a separate consumer of the Content Graph and User Learning Graph.

Do not add fuzzy matching, AI recommendations, popularity-based ranking, user tracking, or graph persistence as “improvements” to this deterministic relationship engine.

## A. What already exists

- Four Astro collections and authored relationship/reference fields, including a real Teaching frontmatter ID distinct from its route ID.
- Route-local explicit and inferred relationships on Teaching, Prophecy, and Number pages.
- Three Bible Scripture helpers using exact array-string inclusion.
- A Dictionary Study More location that currently displays Scriptures, authored Dictionary `related` values, and tags; no engine integration.
- Search builders and a generated Teaching index, both separate from relationship generation.

## B. What is missing

- Shared canonical identity maps and a resolved, collection-qualified edge type.
- Provenance-preserving relationship indexing, strength policy, deterministic merge/order, self/draft checks, and a common result API.
- Scripture normalization/overlap and tests for graph behavior.
- Any existing test runner or test script.
- Migration from route-local scans to a reusable static build-time service.

## C. What should be implemented first

Resolve Phase 0 decisions, audit existing authored IDs/explicit relationship targets for collisions or missing targets, then build the Phase 1 pure identity and explicit-edge foundation. Do not begin UI or route migration before those identity and provenance rules are covered by tests.

## D. Exact files to create or modify in Phase 1

Phase 1 should add only the engine foundation and focused pure tests; it should not modify existing content, schemas, routes, helpers, UI, search code, package files, or generated indexes.

**Create:**

- `src/lib/study-more/types.ts` — collection-qualified keys, provenance, strength, edges, and result contracts.
- `src/lib/study-more/dictionary.ts` — Dictionary route/term/alias adapter and explicit target resolution.
- `src/lib/study-more/teachings.ts` — Teaching route ID and authored `data.id` mapping.
- `src/lib/study-more/prophecy.ts` — Prophecy route IDs and draft eligibility.
- `src/lib/study-more/numbers.ts` — Number route ID/string relationship and numeric lookup adapter.
- `src/lib/study-more/resolveRelationships.ts` — explicit-edge resolution, fail-safe missing/ambiguous target diagnostics, draft/self filters, deduplication, and deterministic order.
- `src/lib/study-more/buildStudyMoreIndex.ts` — Astro collection loading and identity-map construction; explicit relationships only, no inferred term/Scripture matching in Phase 1.
- `src/lib/study-more/index.ts` — narrow public API.
- `src/lib/study-more/__tests__/explicit-relationships.test.ts` — pure fixture-based tests for all explicit link forms, Teaching authored-ID and exact route-ID compatibility resolution, invalid/ambiguous/draft/self edges, merge, diagnostics, and determinism.

**No tooling changes in Phase 1:**

- Do not modify `package.json` or `package-lock.json`, and do not install a test dependency. Explicitly invoke the built-in runner for the test file using the `--experimental-strip-types` flag and keep the pure test modules within Node's type-stripping limits. Revisit only if the minimum-supported Node runtime cannot execute the implemented tests as specified.

**Do not modify in Phase 1:**

- `src/content.config.ts`, `src/content/schemas.ts`, any `src/content/**` content, `src/types/**`, existing `src/lib/relationships/**`, the four content routes, `DictionaryStudyMore.astro`, `DictionaryLayout.astro`, `BibleLayout.astro`, search/index files, `package.json`, `package-lock.json`, dependencies, or docs other than updating this living spec/Decisions Log.

## E. Architectural risks and questions before implementation

- **Teaching identity collisions:** basename-like `data.id` values can collide across topic folders; measure duplicates before relying on a unique map. Existing authored `related` strings may refer to authored IDs that do not resolve or may use a route ID instead.
- **Dictionary explicit values are not typed foreign keys:** `related` and `seeAlso` appear slug-like, while schema only says `string[]`. Exact resolution precedence and ambiguous aliases must be documented; unresolved values must not produce broken links.
- **Architecture strength conflict:** Prophecy `numbers` is explicitly listed both as strong and medium. Confirm the tier before tests encode it.
- **Scripture formats and scope:** raw strings include whole chapters and ranges; a partial parser can silently miss relationships or over-link. Specify book aliases, verse intervals, malformed values, and which nested ref fields count before Phase 3.
- **Topic taxonomy inconsistency:** Teaching topics have case variation and may represent IDs or labels; topic matching needs an actual controlled source, not casual lower-casing assumptions.
- **No test infrastructure:** ensure the chosen test command is valid for the Node versions allowed by `engines`; avoid silently adding dependencies or relying only on a production build for pure relationship behavior.
- **Build cache lifetime:** memoization may be per module instance/build worker rather than whole build. Verify with an instrumented build before claiming one collection load globally; correctness must not depend on caching.
- **Behavioral drift in existing routes:** some current filters are directional and omit primary/featured references; migration should intentionally preserve, improve, or retire each behavior rather than accidentally changing output.
- **Doc drift:** architecture and audit currently describe a previous component version. Keep this spec grounded in current source and update older docs when explicitly authorized.
- **Future plan references:** choose stable collection-qualified keys before Study Plans and external Games contracts consume the graph; do not conflate public edges with private user progress.
