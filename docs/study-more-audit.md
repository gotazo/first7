# First7 Cross-Content Study More — Schema & Architecture Audit

Inspection scope: the live collection definitions, representative Markdown frontmatter, Astro routes/components, relationship helpers, search/index code, and build scripts. No source code, schemas, configuration, package files, or existing documentation were changed. The only added file is this report.

## 1. Dictionary schema

The collection is defined in [src/content.config.ts](../src/content.config.ts) as Markdown/MDX under `src/content/dictionary`. Every schema key below is in `data`; Astro also supplies an implicit `entry.id` from the content path.

| Field | Type / requiredness | Relationship relevance |
|---|---|---|
| `title` | `string`, required | Display name; not the route key. |
| `term` | `string`, required | Canonical lexical term. Current pages often compare it case-insensitively to other collections' `terms` or `keywords`. |
| `shortMeaning` | `string`, required | Display/search description, not a link. |
| `biblicalUsage` | `string`, optional | Descriptive content; no structured links. |
| `reference` | `{ ref: string; text: string }`, optional | One reference and quote. |
| `featuredVerse` | `{ ref: string; text: string }`, optional | One featured reference and quote. |
| `scriptures` | `string[]`, default `[]` | Scripture reference strings. |
| `related` | `string[]`, default `[]` | Authored dictionary cross-references; observed values are slug-like term strings. |
| `aliases` | `string[]`, default `[]` | Alternate spellings/forms; not guaranteed to equal an entry ID. |
| `seeAlso` | `string[]`, default `[]` | Authored secondary cross-references, similar in shape to term/slug labels. |
| `tags` | `string[]`, default `[]` | Broad subject/descriptive labels, not IDs by schema. |
| `hebrew` | `{ word: string; transliteration: string; meaning?: string }`, optional | Lexical metadata. |
| `greek` | `{ word: string; transliteration: string; meaning?: string }`, optional | Lexical metadata. |

There is **no Dictionary `id`, `terms`, `topics`, `keywords`, `category`, or `subcategory` field** in this schema. Dictionary files are flat and lower-case kebab/word slugs (for example `altar.md`), so observed Astro IDs correspond to extensionless filenames such as `altar`. The declared `term` is also lower-case in the inspected examples, but the schema does not enforce a slug or equality between `term` and `entry.id`.

## 2. Teaching schema

The collection is defined in [src/content.config.ts](../src/content.config.ts) as Markdown under `src/content/teachings`, including nested topic directories.

| Field | Type / requiredness | Relationship relevance |
|---|---|---|
| `id` | `string`, required | Authored ID in frontmatter; inspected examples use lower-case kebab-case. It is separate from Astro's implicit path-derived `entry.id`. |
| `title` | `string`, required | Display name. |
| `summary` | `string`, required | Description/search text. |
| `topics` | `string[]`, required | Topic IDs/labels; values vary in capitalization and some correspond to registered topic slugs. |
| `terms` | `string[]`, default `[]` | Authored lexical/concept terms. |
| `related` | `string[]`, default `[]` | Authored teaching relationship values; inspected examples use teaching-like IDs, but the schema does not constrain or resolve them. |
| `keywords` | `string[]`, default `[]` | Search/association phrases, including multiword phrases. |
| `scripture` | `{ ref: string; text: string }`, required | Primary passage. |
| `scriptures` | `string[]`, default `[]` | Additional reference strings; examples include whole-chapter strings. |
| `truth` | `string`, required | Editorial content. |
| `insight` | `string[]`, required | Editorial content. |
| `application` | `string[]`, required | Editorial content. |
| `prayer` | `string`, optional | Editorial content. |
| `featured` | `boolean`, default `false` | Presentation flag, not a relationship. |
| `order` | `number`, optional | Ordering for teaching navigation. |

There is an important identity split: `src/content/teachings/altar/ancient-foundations.md` declares `data.id: ancient-foundations`, while Astro's content `entry.id` is path-derived (`altar/ancient-foundations`). Current teaching static routes and search use `entry.id`, whereas `scripts/buildTeachingsIndex.mjs` writes `data.id`. For example, an authored `related: [ancient-foundations]` value is not necessarily the route/content ID currently used by Astro. A future resolver must choose one canonical identity and explicitly map both forms (or validate and migrate content); it must not assume these are interchangeable.

## 3. Prophecy schema

The collection is defined in [src/content.config.ts](../src/content.config.ts) as Markdown/MDX under nested `src/content/prophecy` category directories.

| Field | Type / requiredness | Relationship relevance |
|---|---|---|
| `title` | `string`, required | Display name. |
| `description` | `string`, required | Description. |
| `category` | enum `symbols \| people \| nations \| places \| events \| timeline`, required | Controlled category. The directory/ID commonly carries the same category prefix. |
| `tags` | `string[]`, default `[]` | Broad labels such as `prophecy`, `daniel`, `revelation`; not IDs by schema. |
| `scriptures` | `string[]`, default `[]` | Scripture reference strings. |
| `related` | `string[]`, default `[]` | Authored Prophecy links. Examples use category-qualified path-like IDs such as `symbols/abomination`. |
| `terms` | `string[]`, default `[]` | Terms which current routes resolve against Dictionary `term` values. |
| `order` | `number`, optional | Ordering metadata. |
| `numbers` | `number[]`, default `[]` | Numeric values for reverse links from a Number entry. |
| `notes` | `string[]`, default `[]` | Editorial notes, not structured relationships. |
| `draft` | `boolean`, default `false` | Publication filter in the Prophecy route. |
| `featuredVerse` | `{ ref: string; text: string }`, optional | One featured reference and quote. |

There is **no frontmatter `id` field**. The implicit Astro ID comes from the nested relative path, for example `events/abomination-of-desolation`; `src/pages/prophecy/[...slug].astro` uses that ID for routes and resolves `related` by exact equality against `item.id`.

## 4. Numbers schema

The collection is defined in [src/content.config.ts](../src/content.config.ts) as Markdown/MDX under flat `src/content/numbers`.

| Field | Type / requiredness | Relationship relevance |
|---|---|---|
| `title` | `string`, required | Display name. |
| `number` | `number`, required | Numeric identity/value. |
| `shortMeaning` | `string`, required | Description. |
| `category` | optional enum `symbolic \| prophetic \| historical` | Controlled category. |
| `featuredVerse` | `{ ref: string; text: string }`, optional | Featured reference and quote. |
| `scriptures` | `string[]`, default `[]` | Scripture reference strings. |
| `related` | `string[]`, default `[]` | Authored Number links; examples quote numeric IDs as strings (`"7"`, `"12"`). |
| `terms` | `string[]`, default `[]` | Terms currently compared to Dictionary canonical `term`. |
| `aliases` | `string[]`, default `[]` | Alternate numeric names, e.g. `seven`, `forty`, `number of the beast`. |
| `notes` | `string[]`, default `[]` | Editorial notes. |

There is **no declared frontmatter `id`, `tags`, `topics`, `keywords`, or `scripture` field**. Observed files are numeric filenames (`7.md`, `666.md`), so the Astro ID and route segment are filename-derived strings such as `7`; `number` is a separate numeric data value. The route currently resolves `related` against `item.id` and reverse Prophecy links through `numbers.includes(entry.data.number)`.

## 5. Representative content examples

These are selected real records; only relationship-relevant frontmatter is summarized.

| Collection / path | Important values | Identity and relationship form |
|---|---|---|
| Dictionary — `src/content/dictionary/altar.md` | `title: Altar`; `term: altar`; scriptures include `Genesis 8:20`, `Genesis 12:7`; `related: sacrifice, offering, covenant, worship`; alias `altar of the Lord`; `seeAlso: tabernacle, temple`; tags `worship, sacrifice, covenant, offering`. | Astro ID/route slug is `altar`. `related` values are bare slug-like terms; Scripture values are human-readable references. |
| Dictionary — `src/content/dictionary/faith.md` | `term: faith`; scriptures include `Hebrews 11:1-6`; `related: belief, trust, hope, righteousness`; `aliases: []`; `seeAlso: grace, salvation, obedience`; tags `faith, belief, trust, salvation`. | ID `faith`; aliases and tags overlap conceptually but are distinct fields. |
| Dictionary — `src/content/dictionary/beast.md` | `term: beast`; scriptures include `Daniel 7:3-7`, `Revelation 13:1-8`; related `animal, cattle, creature, dragon`; alias `beasts`; see-also `lion, lamb, serpent`; tags `animals, creation, prophecy, symbolism`. | ID `beast`; same canonical term appears in Prophecy content, but `related` and `seeAlso` are not declared cross-collection IDs. |
| Dictionary — `src/content/dictionary/covenant.md` | `term: covenant`; related `promise, testament, law, oath`; alias `covenants`; see-also `ark, passover, sacrifice`; tags `covenant, promise, agreement, law`. | ID `covenant`; illustrates that related and see-also lists differ. |
| Teaching — `src/content/teachings/altar/ancient-foundations.md` | `data.id: ancient-foundations`; topics `altar, foundations`; terms `altar, covenant, obedience`; keywords include `spiritual growth`; related `prayer, covenant`; primary scripture `Isaiah 58:12`; additional scriptures include whole chapters `Isaiah 58`, `Matthew 7`, `1 Corinthians 3`. | Astro route/content ID is path-derived `altar/ancient-foundations`; authored `data.id` is basename-like `ancient-foundations`. `related` here contains plain strings, not typed references. |
| Teaching — `src/content/teachings/altar/built-on-the-rock.md` | `data.id: built-on-the-rock`; topics `altar, faith`; terms/keywords include `foundation, rock, obedience, wisdom, faith`; related `ancient-foundations`; primary `Matthew 7:24`; other references include `Matthew 7`, `Luke 6`, `1 Corinthians 3`. | Related value points to the custom ID of a nested Teaching, not its Astro path ID. |
| Teaching — `src/content/teachings/assurance/secure-in-the-shepherd.md` | `data.id: secure-in-the-shepherd`; topics `Assurance, Security, Shepherd`; terms `Shepherd, Assurance, Eternal Life`; related values include `jesus-our-shepherd`, `security-in-christ`; scripture `John 10:28-29`; additional references are specific verse ranges. | Demonstrates mixed topic/term casing and the same authored custom-ID form. |
| Teaching — `src/content/teachings/christ/jesus-at-the-center.md` | `data.id: jesus-at-the-center`; topics `Christ, Surrender, Christian Living`; terms `Christ, Surrender, Worship`; related `jesus-must-be-the-center`, `embracing-the-cross`; keywords include phrases; scripture `Colossians 1:18`. | Shows phrase keywords and related custom IDs. |
| Prophecy — `src/content/prophecy/events/abomination-of-desolation.md` | Category `events`; tags `prophecy, daniel, matthew`; scriptures `Daniel 9:27`, `Daniel 11:31`, `Daniel 12:11`, `Matthew 24:15`, `Mark 13:14`; related `symbols/abomination`, `timeline/great-tribulation`, `nations/jerusalem`; terms `abomination, desolation, sanctuary`. | Astro ID/route key is `events/abomination-of-desolation`; related values use category-qualified IDs. |
| Prophecy — `src/content/prophecy/events/armageddon.md` | Category `events`; tags `prophecy, revelation, battle`; scriptures `Revelation 16:16`, `Revelation 19`; related `timeline/day-of-the-lord`, `nations/gog`, `nations/magog`; terms `armageddon, battle, gathering`. | ID is path-derived; related strings appear designed to match other Prophecy IDs. |
| Prophecy — `src/content/prophecy/symbols/beast.md` | Category `symbols`; tags `revelation, daniel, prophecy`; scriptures `Daniel 7`, `Revelation 13`, `Revelation 17`; related `people/antichrist`, `symbols/horn`, `nations/babylon`; terms `beast, horn, perdition`. | ID is `symbols/beast`; scripture references here are chapter-level. |
| Prophecy — `src/content/prophecy/people/antichrist.md` | Category `people`; scriptures `1 John 2:18`, `1 John 2:22`, `1 John 4:3`, `2 John 1:7`; related `people/man-of-sin`, `symbols/beast`; terms `antichrist, deception, perdition`. | Confirms category-qualified target IDs and verse-specific strings. |
| Number — `src/content/numbers/7.md` | `number: 7`; category `symbolic`; scriptures `Genesis 2`, `Joshua 6`, `Revelation 1`, `Revelation 5`; related `"12"`, `"40"`; terms `creation, sabbath`; alias `seven`. | Astro ID `7`, numeric field `7`, related values are strings. Scripture refs are chapters. |
| Number — `src/content/numbers/666.md` | `number: 666`; category `prophetic`; scripture `Revelation 13`; related `"7"`; terms `beast, antichrist`; alias `number of the beast`. | ID `666`; useful cross-content terms, but no explicit Prophecy IDs here. |
| Number — `src/content/numbers/40.md` | `number: 40`; category `symbolic`; scriptures include `Genesis 7`, `Exodus 24`, `Numbers 14`, `Matthew 4`; related `"7"`, `"70"`; terms `flood, moses, wilderness`; alias `forty`. | Demonstrates chapter-level references and numeric strings in explicit links. |
| Number — `src/content/numbers/490.md` | `number: 490`; category `prophetic`; scripture `Daniel 9`; related `"70"`; terms `daniel, messiah, prophecy`; alias `seventy weeks`. | A single chapter-level passage and direct numeric link. |

Frontmatter examples are from the exact paths in the first column. Content body text is omitted. Reference strings vary among book/chapter, verse, and verse range; equality of raw strings is not equivalent to Scripture overlap.

## 6. Existing relationship/index systems

| Path | Current behavior | Study More implication |
|---|---|---|
| [src/pages/teachings/[...slug].astro](../src/pages/teachings/%5B...slug%5D.astro) | Loads all Prophecy and Dictionary entries. Displays Prophecy entries with exact shared values between Prophecy `scriptures` and Teaching `scriptures`; displays Dictionary entries where lower-cased Teaching `keywords` exactly equal Dictionary `term`. It does not currently display Teaching `related` values. | Reusable matching ideas, not a general system. Uses only one signal for each direction, has no shared scoring/normalization, and the Scripture comparison excludes the Teaching primary `scripture.ref`. |
| [src/pages/prophecy/[...slug].astro](../src/pages/prophecy/%5B...slug%5D.astro) | Resolves authored Prophecy `related` with exact `entry.id` equality; resolves Prophecy `terms` against lower-cased Dictionary `term`; renders Scripture links, Dictionary term cards, and related Prophecy cards. Draft entries are excluded from static routes. | Strong precedent for preserving authored edges and rendering only non-empty groups. Its identity convention matches the observed Prophecy related values. |
| [src/pages/number/[...slug].astro](../src/pages/number/%5B...slug%5D.astro) | Resolves Number `related` against Number `entry.id`; resolves Number `terms` against Dictionary `term`; finds Prophecy pages whose numeric `numbers` contains the current numeric `number`. Renders those groups and Scriptures. | Useful cross-content behaviors already exist, but code is route-local and not shared. Reverse number edges have a real schema field in Prophecy. |
| [src/lib/relationships/getRelatedDictionary.ts](../src/lib/relationships/getRelatedDictionary.ts), [src/lib/relationships/getRelatedProphecy.ts](../src/lib/relationships/getRelatedProphecy.ts), [src/lib/relationships/getRelatedTeachings.ts](../src/lib/relationships/getRelatedTeachings.ts) | Each calls `getCollection()` and filters entries whose `scriptures` array contains the input string exactly. Bible chapter pages invoke all three. | Reuse the concept of central relationship queries, but not necessarily these exact equality implementations. Exact chapter-key equality misses ranges, single verses, book/chapter normalization, and references that semantically overlap without identical strings. Each helper independently loads/scans its collection. |
| [src/pages/bible/[book]/[chapter].astro](../src/pages/bible/%5Bbook%5D/%5Bchapter%5D.astro) | Builds a key like `${data.book} ${chapterNumber}` then passes it to the three Scripture helpers; passes results into `BibleLayout`. | Demonstrates current Scripture-related sections on Bible pages and a future reuse target. Current matching is exact and only sees the three collections above, not Numbers. |
| [src/components/prophecy/RelatedScriptures.astro](../src/components/prophecy/RelatedScriptures.astro) | Parses a reference shaped like `Book chapter[:verse]` into a `/bible/{book}/{chapter}#v{verse}` link. It does not parse ranges; unrecognized values produce no link. | Existing Scripture display/link behavior may be reused after reference parsing is made consistent. |
| [src/components/prophecy/RelatedTopics.astro](../src/components/prophecy/RelatedTopics.astro), [src/components/prophecy/StudyTerms.astro](../src/components/prophecy/StudyTerms.astro) | Render Prophecy cards and Dictionary cards, respectively, with route links based on `entry.id`. | Possible presentation patterns, but these names/components are Prophecy-specific and their `any[]` props are not a reusable cross-collection contract. |
| [src/lib/search/collections/dictionary.ts](../src/lib/search/collections/dictionary.ts), [src/lib/search/collections/teachings.ts](../src/lib/search/collections/teachings.ts), [src/lib/search/builder.ts](../src/lib/search/builder.ts) | Convert Dictionary and Teaching collections into a shared static `SearchItem` list. Dictionary maps tags to `topics` and related/alias/see-also strings to keywords/tags; Teaching maps topics and keywords. The search builder combines registered collection builders. | Reuse the `getCollection()`-based build-time extraction pattern, not the resulting search index as-is: `SearchItem` discards authored relationship fields and has no Prophecy or Numbers builder. Search relevance is not editorial relationship approval. |
| [src/pages/search-index.json.ts](../src/pages/search-index.json.ts), [src/lib/search/README.md](../src/lib/search/README.md) | Exposes the static search index JSON for client-side search. README lists its collection flow; it is separate from Study More. | Keep recommendation generation separate from user query search. The JSON endpoint could be unrelated to recommendation data. |
| [scripts/buildTeachingsIndex.mjs](../scripts/buildTeachingsIndex.mjs), [src/indexes/teachings-index.json](../src/indexes/teachings-index.json) | Build script reads Teaching Markdown with `gray-matter` and writes a JSON index containing `id`, title, summary, topics, keywords, and primary scripture. It omits `terms`, `related`, and additional `scriptures`; the checked-in JSON has the same limited shape. `npm run build` runs this script before `astro build`. | Not sufficient as the cross-content relationship index. It is Teaching-only, duplicates a subset of the Astro collection API, and its `data.id` identity differs from page/search `entry.id`. Prefer one canonical Astro collection-based relationship index, unless this generated file has another required consumer. |
| [src/lib/build-search.ts](../src/lib/build-search.ts) | Contains another `buildSearchIndex()` implementation for Teachings only. In the inspected source there are no imports of this module; the live JSON route imports `src/lib/search`. | Appears legacy/duplicate rather than an appropriate foundation. Avoid extending both builders. |
| [src/content/schemas.ts](../src/content/schemas.ts) | Exports small `scriptureSchema` and `featuredVerseSchema` helpers with a `{ reference, text }` shape. The main collection declarations use inline schemas with `{ ref, text }`. | Not the controlling schema source for these four collections; its current shape is not directly interchangeable. |

The relationship helper modules are used by Bible chapter routes. Other detected relationship code is route-local. Broad search-index assembly currently excludes Prophecy and Numbers. No shared Study More candidate/scoring index was found.

## 7. DictionaryStudyMore audit

[src/components/tools/dictionary/DictionaryStudyMore.astro](../src/components/tools/dictionary/DictionaryStudyMore.astro) is included by [src/components/tools/dictionary/DictionaryLayout.astro](../src/components/tools/dictionary/DictionaryLayout.astro); the Dictionary route passes all four collections from `getCollection()` through the layout.

- The visible component currently displays a `Study More` heading and explanatory sentence, a `Scriptures` list, a `Related Terms` group, and a `Study Topics` group.
- `scriptures` is assigned from Dictionary `entry.data.scriptures` and rendered as plain text, not Bible links.
- `related` is assigned from Dictionary `entry.data.related` and rendered directly as links to `/dictionary/${item}`. This is the currently functioning authored Dictionary relationship display; its values must correspond to resolvable Dictionary slugs.
- `tags` in the Dictionary schema are not used by this component. In inspected content they are broad concepts/categories that can overlap other tags or canonical terms, but are not typed IDs.
- `terms` is assigned from `entry.data.terms` and rendered as “Study Topics”. **Dictionary does not define a `terms` field** in `src/content.config.ts`. This is an actual schema/type mismatch and may be one of the current TypeScript diagnostics. It should not be mistaken for existing Dictionary data. The component likely intended to show a different field such as tags, but that should be decided editorially, not inferred.
- `relatedDictionary` filters the passed Dictionary list by checking whether the current Dictionary's explicit `related` strings include each candidate `item.id`. It is computed but never rendered. It partially resolves authored links but does not validate missing targets, include `seeAlso`, or use a canonical term resolver.
- `relatedTeachings` tries exact case-insensitive equality between current Dictionary `term` and each Teaching `terms` item. It is computed but never rendered. It cannot account for aliases, `keywords`, or the Teaching `data.id` vs path `entry.id` distinction, nor does it score/filter ambiguous matches.
- `relatedProphecy` does the same exact case-insensitive term comparison against Prophecy `terms`. It is computed but never rendered. It is a reasonable candidate-extraction idea but currently has no evidence threshold or display path.
- `relatedNumbers` does exact case-insensitive matching against Number `terms`. It is computed but never rendered. Number `terms` exists and the comparison is valid for exact canonical vocabulary, but omits Number aliases and broader aliases on the Dictionary side.

Reuse: Dictionary `scriptures` and explicit `related` output as curated input signals; current Astro collection props are available at the route; the component provides a location for the eventual UI. Replace the unused ad hoc cross-collection filters with a shared relationship result contract and resolver. Preserve authored Dictionary related/see-also links with validation and clear precedence. Replace the invalid `entry.data.terms` read with an explicitly chosen schema-supported field or remove the group. Do not render every tag/keyword overlap as a recommendation.

## 8. Relationship signals

“Strong” means an authored, resolvable edge that editorially names its target; it should not be overridden by an automatic score. “Medium” means a constrained candidate signal that still needs normalization and relevance filtering. “Weak” means a discovery hint, not enough alone for a Scripture-first recommendation.

| Signal | Suggested strength | Notes / guardrails |
|---|---|---|
| Explicit `related` with successfully resolved target | **Strong** | Preserve for Dictionary, Teaching, Prophecy, and Numbers. Validate IDs using collection-specific adapters. Teaching `related` requires resolving authored `data.id` values to entries and then using actual Astro route IDs; Prophecy and Number examples more directly match `entry.id`. Unresolved values should be omitted/reported, never turned into guessed URLs. |
| Dictionary `seeAlso` with exact, resolved Dictionary term/ID | **Strong** | Explicit editorial cross-reference. Resolve labels through a canonical Dictionary lookup rather than assuming every value is already an ID. |
| Exact Dictionary canonical `term` match to a Teaching/Prophecy/Number `terms` item | **Medium** | High precision when exact after normalization, but case/spacing/aliases and generic words still require review. Avoid fuzzy matching. |
| Exact Dictionary `aliases` match to a target `terms` item or title | **Medium** | Useful synonym signal only after the alias resolves to one canonical Dictionary record. Multiple matches should not create multiple recommendations automatically. |
| Shared controlled Teaching `topics` | **Medium** | Topic identifiers can be meaningful, but values currently show case variation. Normalize through the topic registry where possible; do not compare display labels blindly. |
| Shared Prophecy `category` or shared controlled Number category | **Weak** | Categories are broad and create many false positives. Use only as tie-break/filter context, not a relationship on their own. |
| Shared Dictionary/Prophecy `tags` | **Weak** | Tags describe broad subjects and are not schema-constrained IDs. Exact overlap alone is not sufficient. |
| Teaching `keywords` overlap with Dictionary `term` | **Weak to medium** | Existing routes use exact keyword-to-term matching. A unique exact canonical term may be useful; phrase/keyword overlap generally should only support, not establish, an edge. |
| Scripture overlap | **Medium** | Scripture is a valuable Scripture-first signal, but raw strings differ in granularity and format (book/chapter, verse, range). Parse and normalize references first; chapter-level overlap is broad. Exact same verse/range is stronger evidence than the same book/chapter but should still be checked against relevance. |
| Title/name string or fuzzy-text similarity | **Weak** | Can discover candidates, but title wording alone risks irrelevant or misleading association. Do not let it create displayed recommendations without another signal or explicit editorial approval. |
| Number `aliases` / numeric value and Prophecy `numbers` | **Medium** | Prophecy `numbers` provides a direct reverse edge from number value; validate numeric identity and retain the direction/source. Number aliases are lexical hints, not IDs. |

Recommended principles: keep explicit authored links visibly distinct internally from inferred candidates; require a concrete supporting signal; apply minimum relevance/quality thresholds; de-duplicate equivalent edges; exclude self-links, drafts, missing targets, and links with no valid route; cap candidates per group only after deterministic ordering; omit empty groups. Do not infer doctrine or prophetic interpretation from word co-occurrence.

## 9. Proposed architecture

```text
Astro content collections (Dictionary, Teachings, Prophecy, Numbers; later Bible)
                         ↓
Collection-specific identity/reference adapters
                         ↓
One build-time relationship extraction/index pass
                         ↓
Resolve explicit edges + generate signal-backed candidates
                         ↓
Score/filter/deduplicate while preserving editorial precedence
                         ↓
Typed StudyMore data keyed by canonical content identity
                         ↓
Astro static routes pass data to a presentation-only UI component
```

Suggested responsibilities:

1. Read each relevant collection once through Astro's `getCollection()` API in a shared build-time module. Normalize records into a small internal type containing collection kind, Astro route ID, canonical identifier, title, terms/aliases/topics/tags/keywords, parsed Scripture references, and explicit related values. Preserve both the authored Teaching `data.id` and Astro `entry.id` until that discrepancy is deliberately resolved.
2. Build lookup maps once per pass: Astro ID to record, Teaching `data.id` to record, normalized Dictionary `term`/alias to Dictionary record, Number numeric value/string ID to record, and normalized Scripture reference to records. Maintain source field and explicit-vs-inferred provenance on each edge.
3. Resolve explicit `related` and `seeAlso` first. Add inferred edges only from available concrete fields and the signal policy above. Normalize Scripture references for book/chapter/verse/range intersection rather than raw string equality. Filter unresolved/draft/self targets and use deterministic tie-break rules without inventing targets.
4. Expose a pure function such as “build relationship index” and a query function such as “get Study More data for this record”. Keep that logic in `src/lib/relationships/` or a new focused `src/lib/study-more/` module. Astro components should receive already-resolved grouped records, not scan collections or understand scoring rules.
5. At present, Astro static routes call `getCollection()` inside route page code, and Dictionary passes full collection arrays into a layout. That is sufficient for the current small implementation, but it repeats filtering and loads unrelated entries per route. Prefer computing a shared index once during static path/data preparation, or memoize a single build-scoped promise in the shared module and pass compact per-route results in `getStaticPaths` props. Verify Astro build behavior and serialization before choosing the precise mechanism.
6. Keep the reusable UI presentational: accept optional groups for Dictionary, Teaching, Prophecy, and Number, render only non-empty groups, and construct links from resolved Astro IDs/routes. This shape can later accept Bible-page results while preserving static generation and avoiding client JavaScript.

The current search index is not the recommendation index: it is built from a separate `SearchItem` shape for search, and currently has no Prophecy/Number builders or explicit edge provenance. Avoid coupling recommendations to client-side search or making per-page client requests.

## 10. Recommended next implementation steps

1. Decide and document canonical identity rules, especially Teaching `data.id` versus Astro path-derived `entry.id`; audit all Teaching `related` values against the selected resolver before changing route behavior.
2. Define normalized Scripture parsing/matching rules for whole chapters, single verses, and ranges. Keep parsing separate from rendering and define how malformed references are handled.
3. Specify a typed relationship edge/result shape with source field, explicit/inferred provenance, target collection/route ID, signal, and score or tier. Decide minimum acceptance thresholds and maximum entries per group without choosing specific recommendations in this audit.
4. Implement the shared collection adapter/index and pure resolver in one module, retaining explicit relationships and logging or testing unresolved authored values. Add focused tests for identity resolution, normalized references, alias ambiguity, drafts, empty groups, self-links, and determinism.
5. Replace route-local relationship filters incrementally, beginning with Dictionary Study More and the existing Teaching/Prophecy/Number pages. Keep UI components unaware of collection matching/scoring.
6. Reuse compatible Scripture/link/card presentation patterns where appropriate; make the reusable Study More component support optional groups and empty-state omission.
7. Decide whether `src/indexes/teachings-index.json` remains necessary. If retained, align its identity and fields deliberately; do not silently use it as the source of truth while it omits relationship fields and differs from Astro IDs.
8. Verify `astro check`/build and static output after implementation. Do not expand into schema changes until the data contract and field semantics are agreed.

### Key findings

- The four collections have distinct relationship contracts; there is no universal `id`, `topics`, `keywords`, or `tags` field shared across all four.
- DictionaryStudyMore currently renders authored Dictionary links, but its attempted automatic cross-links are unused, and its displayed `entry.data.terms` field is not declared by the Dictionary schema.
- Existing relationship behavior already appears on Teaching, Prophecy, Number, and Bible pages, but is implemented in route-local filters and three exact-string Scripture helpers rather than one shared, normalized system.
- Teaching has the most important identity hazard: explicit frontmatter IDs differ from nested Astro route IDs, while current code uses both conventions in different places.
- Search and the generated Teaching JSON index are not suitable relationship indexes as-is: they omit relevant fields and do not cover all four collections.

### Files that would likely need modification

- [src/lib/relationships/](../src/lib/relationships/) — consolidate or extend relationship extraction, identity resolution, Scripture normalization, and candidate filtering; preserve clear separation from UI.
- [src/components/tools/dictionary/DictionaryStudyMore.astro](../src/components/tools/dictionary/DictionaryStudyMore.astro) — replace unused local filters and the schema-invalid `terms` display with presentation of resolved optional groups.
- [src/components/tools/dictionary/DictionaryLayout.astro](../src/components/tools/dictionary/DictionaryLayout.astro) and [src/pages/dictionary/[...slug].astro](../src/pages/dictionary/%5B...slug%5D.astro) — pass resolved compact Study More data rather than whole collections if the shared index is moved upstream.
- [src/pages/teachings/[...slug].astro](../src/pages/teachings/%5B...slug%5D.astro), [src/pages/prophecy/[...slug].astro](../src/pages/prophecy/%5B...slug%5D.astro), and [src/pages/number/[...slug].astro](../src/pages/number/%5B...slug%5D.astro) — replace their duplicated route-local matching with the shared result API.
- [src/pages/bible/[book]/[chapter].astro](../src/pages/bible/%5Bbook%5D/%5Bchapter%5D.astro) and potentially [src/layouts/BibleLayout.astro](../src/layouts/BibleLayout.astro) — reuse normalized Scripture relationships for Bible-page recommendations when that collection/page is included.
- [src/content.config.ts](../src/content.config.ts) — only if the agreed data contract requires schema changes; current schemas should first be treated as authoritative.
- [scripts/buildTeachingsIndex.mjs](../scripts/buildTeachingsIndex.mjs) and [src/indexes/teachings-index.json](../src/indexes/teachings-index.json) — only if the separate generated index remains a required build artifact and must be aligned with canonical IDs/relationship fields.
- A focused relationship test location (not currently identified in this audit) — cover the ID mismatch, Scripture normalization, unresolved references, and deterministic filtering before wiring recommendations into all page types.