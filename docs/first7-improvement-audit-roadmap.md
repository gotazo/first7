# First7 Improvement Audit and Implementation Roadmap

**Status:** Initial audit complete; Phase 1 approved and first bounded changes implemented; full build/browser verification pending
**Last audited:** 2026-10-13
**Audit scope:** Uploaded source archive; static source inspection and Study More unit tests
**Project:** First7 Bible-learning library
**Purpose:** Maintain one reviewed, evolving record of findings, decisions, priorities, implementation work, and verification.

> This document is a working plan, not a claim that the listed issues already exist. Findings must be verified against the actual source code, content, build output, and user experience.

## 1. Project direction

First7 is a static-first Astro and Markdown KJV Bible-learning library. The project prioritizes Scripture-centered content, free access, fast pages, maintainable architecture, and minimal backend complexity.

Recent project milestone reported by the developer:
- 2,798 generated static pages
- 321 indexed teachings
- Target milestone: 500 teachings and 500 Bible Dictionary entries

The uploaded source archive contains 563 Dictionary files and 336 Teaching files. These are file counts, not a production build or index count. The previously reported 2,798 generated pages and 321 indexed teachings have not been reproduced from this archive; the 336-versus-321 difference is an open verification item.

### Product vision

Build a connected Bible-learning ecosystem in which readers can move naturally between:
- Bible books, chapters, and passages
- Bible Dictionary entries
- Teachings
- Prophecy and biblical numbers
- Prayers, verse collections, and other study resources
- First7 Play games and learning activities
- Guided Bible Journey lessons
- First7 Passport progress and continuation

### Architectural principles to preserve

- KJV-first and Scripture-centered.
- Static-first Astro pages and Markdown content wherever practical.
- No unnecessary database, account system, or backend.
- Deterministic, explainable relationships rather than opaque or fuzzy recommendations.
- Reuse existing components and metadata where sound.
- Keep First7 Play technically separate while allowing clear conceptual links.
- Avoid large rewrites unless the audit demonstrates a compelling reason.
- Measure actual problems before optimizing.
- Build features to help people understand Scripture, not merely maximize time on site.

## 2. Audit rules

For each potential improvement, record:
1. **Finding:** What was observed.
2. **Evidence:** Relevant files, code paths, build results, or reproducible user experience.
3. **Impact:** Why it matters to readers, maintainers, performance, accessibility, or discoverability.
4. **Recommendation:** The smallest sound change that addresses it.
5. **Dependencies:** What must be done first.
6. **Verification:** How we will know the change works.
7. **Status:** Proposed, verified, approved, in progress, blocked, or complete.

Clearly label conclusions as:
- **Verified:** Directly supported by source inspection or a reproducible test.
- **Inferred:** A reasonable interpretation that still needs confirmation.
- **Open question:** Requires more evidence or a project decision.

Do not mark a suspected issue as a verified defect without evidence.

## 3. Audit workstreams

### A. Architecture and content model

- [ ] Map the current Astro application, routes, layouts, components, scripts, and content collections.
- [ ] Review `package.json`, Astro configuration, content configuration, TypeScript configuration, and build scripts.
- [ ] Identify duplicated logic, tight coupling, unused code, and unnecessary complexity.
- [ ] Document current static-generation and deployment assumptions.
- [ ] Confirm which changes can be made incrementally without a rewrite.

**Findings and evidence:** _Pending source audit._

### B. Study More — resource connection layer

Goal: make Study More a consistent, useful way to discover genuinely relevant First7 resources.

- [ ] Trace how Study More data is collected, matched, ranked, and rendered.
- [ ] Inspect its current architecture documentation and compare documentation with implementation.
- [ ] Review relationships between Bible passages, Dictionary entries, Teachings, Prophecy, Numbers, and other collections.
- [ ] Check link construction, canonical identifiers, slugs, aliases, and missing-target handling.
- [ ] Check for duplicate, irrelevant, or misleading recommendations.
- [ ] Prefer explicit and deterministic relationships where suitable.
- [ ] Keep relationship logic separate from Astro presentation components.
- [ ] Establish validation or reports for broken and unresolved internal relationships.
- [ ] Define a documented way for future content authors to add connections.

**Desired outcome:** Study More consistently helps readers discover the next useful resource without requiring manual one-off logic for every page.

**Findings and evidence:** _Pending source audit._

### C. Bible Journey — guided learning layer

Goal: transform the existing library into a clear, progressive learning experience.

- [ ] Review existing reading plans, study tools, games, Passport-related work, and relevant content metadata.
- [ ] Decide what a Journey lesson contains and how it references existing resources.
- [ ] Define a consistent lesson structure, such as Scripture, explanation, connected study, reflection, question, and optional prayer.
- [ ] Design a progressive route through Scripture and themes without forcing every resource into a single rigid sequence.
- [ ] Use existing content wherever appropriate instead of creating duplicate articles.
- [ ] Define lesson order, prerequisites (if needed), completion rules, and links to related content.
- [ ] Keep lesson content editable in Markdown or another repository-friendly content format where practical.
- [ ] Prototype a small end-to-end journey before authoring a large curriculum.
- [ ] Test the journey with a first-time visitor and a returning reader.

**Desired outcome:** A reader can begin easily, understand what to do next, and continue a meaningful Bible-learning path.

**Findings and evidence:** _Pending source audit._

### D. First7 Passport — personal progress layer

Goal: help readers resume study and recognize progress while respecting privacy and keeping the system simple.

- [ ] Inspect existing Passport, local storage, favorites, recently viewed, and PWA code before designing a new implementation.
- [ ] Define the minimum useful progress model: completed lessons, current journey, last activity, and milestones.
- [ ] Evaluate local-first persistence before considering accounts or a database.
- [ ] Define data versioning, migration, reset, and error-recovery behavior.
- [ ] Decide how progress works offline and after the service worker updates.
- [ ] Make progress indicators accessible and understandable.
- [ ] Avoid streaks or rewards that pressure users or distract from Scripture.
- [ ] If backup or cross-device sync is considered later, treat it as a separate, explicit decision.

**Desired outcome:** Users can resume their journey without being required to register or send personal study data to a server.

**Findings and evidence:** _Pending source audit._

### E. PWA, offline behavior, and performance

- [ ] Inspect manifest, service worker, cache versioning, cache strategies, offline fallback, and update flow.
- [ ] Check whether core reading and journey experiences work offline as intended.
- [ ] Inspect repeated collection loading, route-level work, generated indexes, and cross-collection calculations.
- [ ] Establish reproducible build-time measurements and compare them before and after changes.
- [ ] Identify bottlenecks before attempting optimization.
- [ ] Review image/font loading, client-side JavaScript, and unnecessary dependencies.
- [ ] Test cache cleanup and application updates.
- [ ] Preserve reliable behavior on low-memory hardware where feasible.

**Desired outcome:** A fast, dependable static site and PWA that remains useful on limited hardware and unreliable connections.

**Findings and evidence:** _Pending source audit._

### F. Navigation, accessibility, and reader experience

- [ ] Review main navigation and whether a new visitor understands where to begin.
- [ ] Review mobile layouts, keyboard navigation, focus states, semantic headings, contrast, and accessible names.
- [ ] Check whether content pages provide useful next steps rather than dead ends.
- [ ] Check search, category navigation, breadcrumbs, previous/next navigation, and related resources.
- [ ] Review loading, empty, offline, and error states for interactive tools.
- [ ] Evaluate whether Study More and Journey calls to action are helpful rather than intrusive.
- [ ] Keep the main purpose—Bible learning—clear across the site.

**Desired outcome:** Visitors can find a resource, understand it, and continue naturally, on desktop or mobile.

**Findings and evidence:** _Pending source audit._

### G. SEO and content quality

- [ ] Review canonical URLs, titles, descriptions, sitemap output, robots directives, and indexability.
- [ ] Check internal links and whether important pages are discoverable from other pages.
- [ ] Assess whether content pages have distinct, useful purposes rather than merely increasing page count.
- [ ] Review Scripture references and consistency of metadata.
- [ ] Use Search Console or analytics evidence if the project owner supplies it.
- [ ] Separate verified technical SEO issues from hypotheses about low traffic.
- [ ] Prioritize useful content and reader navigation over manipulative backlink or mass-page tactics.

**Desired outcome:** Search engines can understand the site and readers can find genuinely useful pages, while traffic expectations remain evidence-based.

**Findings and evidence:** _Pending source audit._

### H. First7 Play integration

- [ ] Confirm the technical boundary between `first7.org` and `play.first7.org`.
- [ ] Identify useful links from Journey lessons to relevant games.
- [ ] Define optional learning reinforcement after a lesson.
- [ ] Avoid unnecessary shared runtime or backend coupling between repositories.
- [ ] Decide whether progress sharing is needed; do not assume it is required for the first release.

**Desired outcome:** Games reinforce learning while the main site and games site remain maintainable independently.

**Findings and evidence:** _Pending source audit._

### I. Future gifts section

This is a later product opportunity, not a prerequisite for Bible Journey.

- [ ] Keep the core Bible-learning library free and clearly primary.
- [ ] Evaluate a small Markdown-driven catalogue of physical Scripture cards, journals, and encouragement gifts.
- [ ] Prefer a static product page with a suitable external order/payment flow for an initial version.
- [ ] Avoid building a cart, customer database, or custom payment backend unless justified.
- [ ] Treat “sponsor a gift for someone in need” as a separate operational and legal decision.
- [ ] Before accepting donations or making charitable/tax-deductibility claims, obtain appropriate India-specific legal and accounting advice.

**Desired outcome:** Any gift offering supports the mission without distracting from the free study library or creating premature operational complexity.

**Findings and evidence:** _Pending source audit._

### J. Steward promotion and sustainable discovery

- [ ] Review Steward's current functionality, audience, and relationship to First7 before making promotion recommendations.
- [ ] Keep Steward's identity clear rather than turning First7 into a marketing site.
- [ ] Consider useful, standalone answers on relevant community platforms such as Quora; avoid spam or link-first promotion.
- [ ] Establish a baseline for traffic, search impressions, and engagement if analytics are available.
- [ ] Recommend promotion based on audience fit and evidence, not page count alone.

**Desired outcome:** People who would genuinely benefit can discover First7 and Steward without compromising trust.

**Findings and evidence:** _Pending source audit._

## 4. Proposed implementation phases

These phases are provisional and must be reordered if the source audit reveals dependencies or critical defects.

### Phase 0 — Source audit and baseline
- [ ] Inventory architecture and relevant documentation.
- [ ] Record the current build, content counts, routes, and known limitations.
- [ ] Identify high-risk areas and quick wins.
- [ ] Review the audit with the project owner before major implementation.

### Phase 1 — Stabilize the foundations
- [x] Add keyboard focus support to desktop navigation dropdown visibility.
- [x] Harden the existing Continue Reading persistence helper and route/card usage.
- [x] Expose the current unit tests through `npm test` without adding a test dependency.
- [ ] Resolve the shared-layout/page-template main-landmark ownership consistently after route sampling.
- [ ] Establish a reproducible production build and generated-count baseline after these small fixes.
- [ ] Browser-check keyboard navigation, Continue Reading behavior, and storage-denied behavior.

### Phase 2 — Strengthen Study More
- [ ] Improve relationship data and resolution.
- [ ] Separate and document relationship logic.
- [ ] Add internal-link/relationship validation where practical.
- [ ] Verify results across representative content collections.

### Phase 3 — Prototype Bible Journey
- [ ] Define the lesson schema and a small initial journey.
- [ ] Reuse existing Scripture, teaching, and Dictionary content.
- [ ] Build and test one complete learner flow.
- [ ] Review the experience before expanding the curriculum.

### Phase 4 — Build First7 Passport
- [ ] Define and implement local-first progress.
- [ ] Add resume, completion, and a small set of meaningful milestones.
- [ ] Test refreshes, offline use, storage errors, and service-worker updates.
- [ ] Confirm that the feature works without registration.

### Phase 5 — Connect the ecosystem
- [ ] Connect Journey lessons to Study More resources and optional First7 Play activities.
- [ ] Add helpful next-step navigation across the library.
- [ ] Verify that connections remain relevant and correct.

### Phase 6 — Measure and refine
- [ ] Review user experience, search/discovery signals, build time, and reported issues.
- [ ] Fix observed friction before expanding features.
- [ ] Decide whether and when to launch a gift section or undertake broader Steward promotion.

## 5. Decision log

Record important decisions with date, reason, and consequences.

| Date | Decision | Reason / evidence | Revisit when |
|---|---|---|---|
| Pending | Use this file as the ongoing audit and roadmap | Keep project decisions reviewable across work sessions | As the audit develops |
| Pending | Preserve static-first architecture unless evidence justifies otherwise | Simplicity, performance, maintainability, and offline-friendly content | If a requirement cannot be met well statically |

## 6. Progress log

Append dated notes after each audit or implementation session.

| Date | Work completed | Verification | Follow-up |
|---|---|---|---|

## 7. Definition of done

A feature or improvement is complete only when:
- Its intended behavior is documented.
- The implementation is consistent with the agreed architecture.
- Relevant build checks or tests pass.
- Links, offline behavior, and accessibility are checked where applicable.
- Any new content/schema requirements are documented.
- The roadmap and decision log are updated.
- No success is claimed solely because code was written.

## 8. Current next actions

1. Finish Phase 1 verification: browser-check desktop keyboard dropdowns and Continue Reading, including storage-disabled behavior.
2. Inspect representative route output and settle the single-main-landmark ownership model before changing the shared shell.
3. Run the official Teaching index and Astro production build in the normal project environment; record source, index, and generated-route counts separately.
4. Keep the relationship resolver deterministic and explicit. Scripture matching must use a dedicated parser and exact interval overlap only; no fuzzy or AI matching.
5. Before Study More migration, capture existing visible relationships and preserve correct output during route-by-route integration.


---

## 9. Initial source audit — 2026-10-13

### 9.1 Audit scope and limits

**Inspected:** `package.json`, `astro.config.mjs`, `src/content.config.ts`, the Study More engine/adapters/test file, Dictionary/Teaching/Prophecy/Number routes and related components, `src/layouts/BaseLayout.astro`, `src/layouts/BibleLayout.astro`, `src/components/Navbar.astro`, continue-reading code, `src/lib/bible/normalizeBibleReference.ts`, `public/sw.js`, `public/manifest.webmanifest`, and the existing Study More/PWA/product roadmap documents.

**Executable verification:** `node --experimental-strip-types --test src/lib/study-more/__tests__/*.test.ts` ran against the uploaded source; all 20 tests passed. Node reported that type stripping is experimental. This verifies the isolated relationship unit suite only.

**Not verified:** a complete Astro production build, generated page count, browser-level mobile/keyboard/accessibility behavior, real offline navigation/update behavior, Lighthouse/Core Web Vitals, Search Console status, or deployed asset responses. The archive does not contain `node_modules` or a package lockfile, so a clean, reproducible dependency install and full build were not performed.

### 9.2 Architecture map (source-based)

| Area | Current location | Verified role |
|---|---|---|
| Static build | `astro.config.mjs` | `output: "static"`, site set to `https://first7.org`, Tailwind Vite plugin, MDX and sitemap integrations. |
| Content schemas | `src/content.config.ts` | Defines pages, reflections, blog, resources, books, plans, guides, verses, prayers, tools, teachings, prophecy, dictionary, numbers, and verse-jar collections. |
| Main shell / SEO / PWA registration | `src/layouts/BaseLayout.astro` | Global document, title/description/canonical/Open Graph/Twitter metadata, Navbar/Footer, analytics scripts, service-worker registration, and a global `<main>` wrapper. |
| Bible reader | `src/pages/bible/`, `src/layouts/BibleLayout.astro`, `src/data/bible/*.json` | Static Bible book/chapter navigation and chapter reader. The layout eagerly imports the Bible JSON files at build time. |
| Study More relationship engine | `src/lib/study-more/` | Typed records/adapters, deterministic explicit relationship resolver, diagnostics, grouping, and query result API. |
| Existing resource relationships | `src/lib/relationships/`, collection routes and `src/components/tools/dictionary/` | Older/local per-route relationship matching still exists and is used by some current pages. |
| Search | `src/lib/search/`, `src/pages/search-index.json.ts`, `src/lib/build-search.ts`, `scripts/buildTeachingsIndex.mjs` | Search index and a separate generated Teaching index build script. |
| Local continuation | `src/lib/reading/continueReading.ts`, `src/components/reading/ContinueReadingCard.astro`, Teaching page inline script | A `continue-reading` localStorage record is read/written by multiple implementations. |
| PWA | `public/sw.js`, `public/offline.html`, `public/manifest.webmanifest`, `src/layouts/BaseLayout.astro` | Versioned caches, precache, network-first page handling, stale-while-revalidate assets, cache-first images, and registration. |
| Product documentation | `docs/roadmap.md`, `docs/study-more-architecture.md`, `docs/study-more-audit.md`, `docs/study-more-implementation.md`, `docs/pwa-roadmap.md` | Multiple related plans exist; status and current-code descriptions are not fully synchronized. |

### 9.3 Verified findings and recommendations

#### F1 — Study More engine is not connected to the rendered pages

**Status:** Verified architectural gap.
**Evidence:** `buildStudyMoreIndex` is referenced only in its definition and the public export; `getStudyMoreResult` is referenced by the resolver, export, and unit tests. No page or UI component calls the engine. `src/components/tools/dictionary/DictionaryStudyMore.astro` renders local Dictionary relationships and tags, while `src/pages/teachings/[...slug].astro`, `src/pages/prophecy/[...slug].astro`, and `src/pages/number/[...slug].astro` calculate their own related subsets.

**Impact:** The shared engine's identity handling, provenance, ambiguity checks, and diagnostics currently do not govern the reader-facing relationship experience. Improving the engine alone will not improve Study More on the live pages.

**Recommendation:** After owner approval, integrate the existing engine first into one representative route (Dictionary is the natural starting point because its layout already has a Study More component). Preserve the current output as a comparison during review. Then integrate other collections incrementally and remove duplicated logic only after parity is verified.

**Priority:** P1 — core ecosystem goal.
**Verification:** Unit tests; real-content relationship report; compare old/new output on a small set of Dictionary entries; verify every generated href maps to a static route; review relevance manually.

#### F2 — Relationship engine currently resolves explicit links, not the full documented graph

**Status:** Verified scope/documentation mismatch.
**Evidence:** `src/lib/study-more/types.ts` includes provenance types for `canonical-term-match`, `alias-match`, `topic-match`, and `scripture-overlap`, but the current content record interfaces/adapters do not carry Scripture references, terms, or topics. The current resolver constructs edges from explicit Dictionary `related`/`seeAlso`, Teaching `related`, Prophecy `related`/`numbers`, and Number `related` fields. `src/lib/bible/normalizeBibleReference.ts` is used by `BibleLayout.astro` but is a separate helper; it handles a single chapter or single verse reference and does not parse ranges.

**Impact:** The types and architecture language imply future evidence types that are not yet implemented in the resolver. Scripture overlap and topic/term relationships should not be assumed to exist merely because their provenance types are declared.

**Recommendation:** Keep the current explicit relationship behavior as the stable baseline. Add the Scripture-reference parser/overlap layer as a separate, pure, tested module before adding edges from Scripture overlap. Extend adapters and types only when the relevant rule is implemented and tested. Do not add fuzzy or AI matching.

**Priority:** P1 — prerequisite to the planned complete graph.
**Verification:** Tests for book aliases, chapter-only references, single verses, inclusive ranges, malformed references, and overlap/no-overlap cases; deterministic test fixtures; real-content diagnostic report.

#### F3 — Teaching identity has two distinct identifiers

**Status:** Verified schema/route design constraint; impact on specific authored references requires content-level validation.
**Evidence:** Teaching schema in `src/content.config.ts` requires `data.id`; Astro's `entry.id` is path-derived, and nested Teaching files produce route IDs such as `altar/ancient-foundations`. The adapter in `src/lib/study-more/teachings.ts` preserves both as `id` and `authoredId`. The resolver first resolves authored IDs and treats route-ID fallback as compatibility behavior with a diagnostic.

**Impact:** Code that assumes authored `data.id` equals the route ID can create unresolved or incorrect links, particularly for nested Teaching content.

**Recommendation:** Retain `entry.id` as the canonical route identity and `data.id` as a lookup identity. Add a real-content audit for duplicate authored IDs, unresolved `related` values, and route-ID compatibility cases before attempting content migration.

**Priority:** P1 for relationship integration; no mass content migration now.
**Verification:** Report duplicate/ambiguous authored IDs and unresolved edges from all actual entries.

#### F4 — Relationship test coverage exists, but normal project scripts do not expose it

**Status:** Verified.
**Evidence:** `src/lib/study-more/__tests__/explicit-relationships.test.ts` contains 20 Node test cases and passes when run with Node's experimental type-stripping flag. `package.json` has no `test` script and no declared test runner dependency.

**Impact:** The relationship suite can be overlooked during routine development or CI, and the invocation is not discoverable from package scripts.

**Recommendation:** Add a small documented `test` script using the supported Node runtime only if the project’s chosen Node range is confirmed to support the invocation consistently; otherwise choose a compatible runner deliberately. Avoid adding a large test dependency without need.

**Priority:** P1 before further relationship-engine changes.
**Verification:** Documented command runs from a clean checkout and returns non-zero on a failing test.

#### F5 — Global layout wraps content in `<main>`, while page templates also declare `<main>`

**Status:** Verified markup structure in inspected routes; breadth should be confirmed by route sampling.
**Evidence:** `src/layouts/BaseLayout.astro` wraps its slot in a `<main>`. `src/pages/teachings/[...slug].astro`, `src/pages/prophecy/[...slug].astro`, `src/pages/number/[...slug].astro`, and `src/pages/bible/index.astro` also contain their own `<main>` elements.

**Impact:** Nested main landmarks are invalid/ambiguous for assistive technology and can impair navigation by landmark.

**Recommendation:** Choose one ownership model: either the shared layout provides the main landmark and page templates use sections/articles, or the layout provides a neutral wrapper and each route owns its single main landmark. Prefer the smallest consistent correction and inspect special layouts before changing the shared shell.

**Priority:** P1 — accessibility baseline.
**Verification:** Render representative routes and assert exactly one main landmark per document; keyboard and screen-reader spot checks.

#### F6 — Global shell references two image assets absent from the uploaded archive

**Status:** Verified within the archive; deployed 404s not verified.
**Evidence:** `src/layouts/BaseLayout.astro` references `/favicon-32.png` and `/og-image.png`. Neither path exists in the uploaded archive. Other icon files such as `public/favicon.svg`, `public/favicon.ico`, and the PWA icons do exist.

**Impact:** The 32px PNG favicon and shared Open Graph/Twitter preview image may return 404 unless these assets are supplied outside the archive or generated during deployment.

**Recommendation:** Confirm production responses before changing metadata. If missing in deployment, point to existing assets or add the intended files; avoid fabricating a new brand image without approval.

**Priority:** P2 — quick SEO/polish fix after production check.
**Verification:** Request both URLs from the deployed site and check social-preview metadata with a crawler/debugger.

#### F7 — Desktop dropdowns rely on hover visibility

**Status:** Verified implementation pattern; user impact needs keyboard/browser test.
**Evidence:** `src/components/Navbar.astro` uses dropdown panels with `invisible`/`opacity-0` and `group-hover:visible`/`group-hover:opacity-100`; the inspected trigger markup does not show corresponding `focus-within` behavior or a button-controlled disclosure state.

**Impact:** Keyboard users may not be able to reveal submenu links reliably; touch behavior also needs testing.

**Recommendation:** Add a keyboard-accessible disclosure pattern with visible focus, without redesigning the navigation. Test mobile navigation separately because its markup differs from the desktop menu.

**Priority:** P1 — accessibility.
**Verification:** Tab/Shift+Tab through every menu, Enter/Space activation where appropriate, Escape/return behavior if a scripted disclosure is used, and narrow viewport testing.

#### F8 — Continue-reading storage logic is duplicated and not consistently guarded

**Status:** Verified code risk; browser storage-denial scenario not reproduced.
**Evidence:** `src/lib/reading/continueReading.ts` provides `saveContinueReading`, `getContinueReading`, and `clearContinueReading`, but the Teaching route writes directly to `localStorage` and `ContinueReadingCard.astro` reads it directly. These direct calls are not wrapped in `try/catch`; the helper also guards server execution but does not guard storage access itself.

**Impact:** If browser storage access throws, the inline script may fail. Multiple implementations can drift in key shape and error handling. This is especially relevant to the local-first Passport direction.

**Recommendation:** Consolidate current continuation reads/writes through the existing helper or a small shared browser-safe utility. Catch storage access/parse errors, validate the stored shape and URL before rendering a link, and keep progress local by default.

**Priority:** P1 for robustness; a small isolated phase.
**Verification:** Test empty storage, malformed JSON, malformed shape, denied storage, valid saved reading, and clearing the record.

#### F9 — Existing relationship matching differs by route

**Status:** Verified.
**Evidence:** Teaching pages match Prophecy by exact string inclusion between `scriptures` arrays and match Dictionary terms by lowercased `keywords` versus `term`. Prophecy and Number pages match terms using lowercased equality and use their own related-ID logic. Dictionary Study More directly constructs `/dictionary/${item}` links from authored values.

**Impact:** Equivalent Scripture references with different formatting may not match; relationships have different rules depending on the page; direct URL interpolation bypasses the resolver’s ambiguity and unresolved-target safeguards.

**Recommendation:** Do not replace all local behavior at once. Capture current output and content exceptions, integrate the shared engine route-by-route, and only migrate matching rules that have an explicit, tested replacement.

**Priority:** P1, coupled to F1/F2.
**Verification:** Representative output comparison plus automated link-target validation.

#### F10 — PWA foundations exist; production behavior is not yet verified

**Status:** Verified implementation; runtime behavior open.
**Evidence:** `public/sw.js` defines versioned page/asset/image caches, precaches `/`, `/offline.html`, the manifest and three icons, deletes cache names outside its allowlist, uses network-first for non-assets, stale-while-revalidate for styles/scripts/fonts, and cache-first for images. `BaseLayout.astro` registers `/sw.js`. All three precached icon paths exist in the archive.

**Risks / open checks:** The current fetch handler routes every same-origin GET that is not classified as an image/style/script/font through `networkFirst`, not only HTML documents. Cache growth limits and behavior for query-string URLs have not been measured. The activation handler removes every origin cache not in this app's allowlist; that is safe only if the origin is dedicated to this application and does not host other independently managed apps/caches. The source has no explicit update notification flow despite the PWA roadmap describing it as a future feature.

**Recommendation:** First run browser-level offline/update tests and inspect the actual deployment topology. Do not rewrite the service worker based on source inspection alone. If needed, tighten request classification and cache ownership in a separate, testable change.

**Priority:** P1 verification; implementation only if a reproducible failure or clear risk is confirmed.
**Verification:** Fresh install, previously visited route offline, never-visited route offline, failed precache behavior, update from one cache version to the next, query URLs, and cache cleanup.

#### F11 — Canonical and social metadata are centralized, but asset and URL checks remain

**Status:** Partly verified.
**Evidence:** `BaseLayout.astro` emits title, description, canonical, Open Graph and Twitter tags and uses `https://first7.org${Astro.url.pathname}` as the default canonical. Bible chapters override canonical explicitly. The Astro sitemap integration is configured. The shared Open Graph image path is absent from the uploaded archive (F6).

**Impact:** The metadata foundation exists; there is not enough evidence to claim a broad SEO failure. Query/trailing-slash behavior, generated sitemap contents, duplicate descriptions, and actual crawler responses have not been checked.

**Recommendation:** Run a generated-output audit for canonical URLs, missing titles/descriptions, route uniqueness, sitemap coverage, and internal link targets before altering SEO architecture.

**Priority:** P2 after accessibility and relationship integration.
**Verification:** Inspect generated HTML and sitemap after a full build; compare sampled production URLs.

#### F12 — Current source milestone is not fully reconciled with reported counts

**Status:** Verified discrepancy; explanation open.
**Evidence:** The uploaded source contains 563 Dictionary files and 336 Teaching files. The conversation’s reported milestone is 2,798 generated pages and 321 indexed teachings. The archive contains `scripts/buildTeachingsIndex.mjs`, but no generated production output was supplied to verify the page count or indexed result.

**Impact:** We need a reliable baseline to assess build performance and confirm which content is published/indexed.

**Recommendation:** Establish a repeatable count report that separately records source files, draft-filtered/published entries, index entries, and generated routes. Do not treat source file count as index count.

**Priority:** P1 baseline item.
**Verification:** Run the official index and Astro build in the project’s normal environment; record command output and count definitions.

### 9.4 Current collection counts

Counts below are files under the corresponding source directories in the uploaded archive. They do not prove that every file passes schema validation or produces a route.

| Collection | Files |
|---|---:|
| Dictionary | 563 |
| Teachings | 336 |
| Prophecy | 158 |
| Numbers | 35 |
| Verse Jar | 365 |
| Plans | 49 |
| Resources | 19 |
| Reflections | 11 |
| Prayers | 11 |
| Guides | 7 |
| Blog | 6 |
| Tools | 4 |
| Books | 1 |

### 9.5 Recommended priority order for discussion

1. **P1 — Accessibility and resilience:** keyboard dropdown visibility and Continue Reading storage are the first bounded changes; resolve the shared main-landmark ownership after route sampling.
2. **P1 — Test discoverability and baseline:** expose the unit tests through a project command; reconcile source/index/build counts after the small fixes.
3. **P1 — Study More integration:** use the existing engine on one route and prove it against real content before broad migration.
4. **P1 — Relationship correctness:** generate diagnostics for duplicate identities, unresolved authored relationships, route-ID compatibility, and dead hrefs.
5. **P1 — Scripture relationship layer:** implement and test parsing/overlap as a pure module before generating Scripture-based edges.
6. **P1 verification — PWA:** test offline and update behavior in a browser before deciding whether code changes are warranted.
7. **P2 — SEO assets/output audit:** confirm deployed favicon/OG image responses and audit generated metadata/sitemap.
8. **Later — Bible Journey and Passport:** define a small journey prototype only after reusable content relationships and the continuation storage boundary are stable.
9. **Later — Play, gifts, and Steward promotion:** preserve as separate tracks; do not let them delay core reading, discovery, or accessibility work.

This ordering is a recommendation for owner discussion, not authorization to begin implementation.

### 9.6 Decisions and assumptions

| Item | Current position | Status |
|---|---|---|
| Canonical relationship identity | Use collection-qualified Astro route identity `(kind, entry.id)`; keep authored Teaching `data.id` as a lookup key. | Existing documented decision; preserve. |
| Relationship resolution | Explicit, deterministic, explainable; ambiguity must not create arbitrary links. | Existing design and 20 passing unit tests. |
| Scripture matching | Strict deterministic parsing and exact overlap only; no fuzzy or AI matching. | Owner-approved 2026-10-13. |
| Study More migration | Integrate route-by-route and compare existing output before removing local logic. Preserve correct current relationships. | Owner-approved 2026-10-13. |
| Local progress | Local-first, no account/backend prerequisite; robust storage error handling. | Existing product direction; implementation details pending. |
| PWA rewrite | No rewrite until browser tests establish a defect or meaningful risk. | Recommended; test evidence pending. |
| Generated counts | Distinguish source-file count, index count, and generated route count. | Required baseline clarification. |
| Full build | Not run because the archive lacks installed dependencies and a lockfile. | Open verification item. |

### 9.7 Decision log updates

| Date | Decision | Reason / evidence | Revisit when |
|---|---|---|---|
| 2026-10-13 | Keep this roadmap as the ongoing audit record and update it with source evidence. | User explicitly selected this file for continuing review and implementation tracking. | Ongoing |
| 2026-10-13 | Do not begin a major rewrite during the audit. | Existing static-first architecture is coherent; source shows reusable relationship and PWA foundations. | Only if verified requirements cannot be met incrementally |
| 2026-10-13 | Treat Study More as an integration gap before treating it as a missing feature. | Relationship engine and tests exist, but current route/UI code does not consume the engine. | After first route integration is reviewed |
| 2026-10-13 | Treat reported page/index counts as unverified until reproduced. | Source archive file counts differ from the reported Teaching index count; generated output is absent. | After normal build environment is available |
| 2026-10-13 | Phase 1 starts with accessibility, local-storage resilience, and test discoverability. | Explicit owner decision. Keep the work small and testable; defer unrelated features. | After Phase 1 verification |
| 2026-10-13 | Scripture matching must be strict and deterministic, with no fuzzy matching. | Explicit owner decision; relationship edges must be explainable and repeatable. | Only if owner changes the policy |
| 2026-10-13 | Preserve correct existing relationship displays during Study More migration. | Explicit owner decision; avoid regressions while migrating route by route. | After representative parity checks |
| 2026-10-13 | Reproduce build/index counts after initial small fixes. | Explicit owner decision; source counts are not equivalent to generated/indexed counts. | After Phase 1 changes are ready for verification |

### 9.8 Progress log updates

| Date | Work completed | Verification | Follow-up |
|---|---|---|---|
| 2026-10-13 | Inspected core configuration, schemas, routes, Study More engine/adapters/UI, relationship docs/tests, BaseLayout, navigation, continuation storage, Bible reference helper, service worker, manifest, and PWA docs. | 20/20 Study More unit tests passed under Node 22.16.0 with `--experimental-strip-types`. Full Astro build and browser checks not run. | Owner decisions received; begin bounded Phase 1. |
| 2026-10-13 | Implemented keyboard-focus visibility for desktop Navbar dropdowns; consolidated Teaching continuation writes and Continue Reading card reads through the guarded helper; added stored-record validation and storage-error handling; added five continuation tests and an `npm test` script. | `npm test`: 25/25 tests pass (20 existing Study More tests + 5 Continue Reading tests). Node prints the expected experimental type-stripping warning. `npm run build` not run because the archive has no `node_modules` or lockfile. | Browser-check keyboard and storage behavior; audit main-landmark ownership before changing layout; reproduce counts after these small fixes. |

### 9.9 Owner decisions and remaining verification

The owner confirmed these decisions on 2026-10-13:

1. **Phase 1 scope:** Accessibility, local-storage resilience, and test discoverability first. Do not start unrelated major changes.
2. **Scripture matching:** Strict deterministic parsing only; no fuzzy matching.
3. **Relationship migration:** Preserve correct existing relationship displays during migration.
4. **Build baseline:** Verify generated/index counts after the initial small fixes.

Remaining verification (not a request to expand scope):
- Browser-test dropdown keyboard access and mobile navigation separately.
- Test Continue Reading with storage enabled, empty, malformed, and blocked; unit coverage currently covers the storage helper, but not a browser DOM.
- Review route templates to decide the smallest consistent fix for nested or missing `<main>` landmarks. This has not yet been changed because the shared layout and page templates need a route-wide ownership decision.
- Run `npm run build` in the normal environment when dependencies and the lockfile are available; do not claim the reported page/index counts until reproduced.

### 9.10 Phase 1 change record — 2026-10-13

**Changed files:**
- `package.json` — added `npm test` using Node's built-in test runner and the existing experimental TypeScript stripping support; no dependency added.
- `src/components/Navbar.astro` — desktop dropdown panels now become visible on `:focus-within` as well as hover, and their chevrons reflect keyboard focus.
- `src/lib/reading/continueReading.ts` — validates persisted records, restricts saved URLs to site-relative paths, and catches storage access/write/remove failures.
- `src/components/reading/ContinueReadingCard.astro` — reads continuation through the shared helper and no longer directly accesses localStorage.
- `src/pages/teachings/[...slug].astro` — saves continuation through the shared helper; failure to persist does not prevent reading.
- `src/lib/reading/continueReading.test.ts` — adds tests for valid/malformed records, save/read/clear, malformed JSON, and blocked storage.

**Verification:** `npm test` passed 25/25 tests (20 existing Study More tests and 5 new continuation tests). The expected Node experimental type-stripping warning remains. A full Astro build, route-level accessibility scan, and browser tests were not run because this source archive has neither installed dependencies nor a lockfile.

**Boundaries:** No Scripture matching, Study More rendering, authored relationships, schemas, PWA cache behavior, or generated content was changed in this phase. Existing relationship displays remain untouched pending parity testing.

### 9.11 Whole-site audit script — 2026-10-14

**Owner direction:** Add an automated site audit so future work can be checked consistently, then continue to the next bounded improvement. Keep this diagnostic and incremental; do not start a rewrite.

**Added:** `scripts/auditSite.mjs`

**Package commands:**
- `npm run audit:site` — read-only source audit and, when `dist/` exists, generated-output audit.
- `npm run audit:site -- --strict` — same audit, but exits non-zero when errors are found.
- `npm run check:site` — runs the existing production build and then the strict audit.

**Checks currently included:**
- Recursive Markdown/MDX counts by top-level content collection.
- Frontmatter presence and common top-level fields; non-standard dash delimiters are reported for review.
- Duplicate explicit IDs and slugs within each collection.
- Teaching index JSON validity, duplicate IDs, missing IDs/titles, and source/index count differences.
- If `dist/` exists: generated HTML count; title, description, canonical, h1 and main-landmark checks; duplicate titles/canonicals; and local/relative link targets against generated files.
- The script adds no dependency and does not edit source files, content, or generated output. It uses a small dependency-free frontmatter field extractor for diagnostics; Astro's own build/schema validation remains authoritative.

**First run against the supplied Phase 1 archive:**
- Source content counts: 563 Dictionary files; 336 Teaching files; 158 Prophecy files; 35 Numbers files; 364 recognized Verse Jar `.md` files; 49 Plans; 19 Resources; 11 Reflections; 11 Prayers; 7 Guides; 6 Blog; 4 Tools; 1 Book; 2 Pages; 12 Verses.
- Teaching index: 336 entries, 328 unique non-empty IDs, no missing IDs or titles. Source file count and index entry count agree, but duplicate IDs mean they do not represent 336 unique teaching IDs.
- Audit findings: 17 errors, 4 warnings, and 1 informational result. The errors consist of eight duplicate Teaching IDs, eight corresponding duplicate IDs in `src/indexes/teachings-index.json`, and one duplicate Verse Jar ID (`F7-021` appears in both the Faith and Hope folders). The warnings include three non-standard frontmatter closing delimiters and one content file with an unsupported filename extension. (The exact summary is emitted by the script; review the full output before fixing individual records.)
- `src/content/verse-jar/guidance/F7-340md` is excluded from the `.md` count because the filename lacks a dot before `md`; this likely explains why the earlier Verse Jar count differs by one. Confirm intended filename and route before renaming.
- `dist/` was absent, so generated HTML, metadata, main-landmark, and internal-link checks were skipped. The production build has not been run; reported page counts remain unverified.

**Evidence caution:** Duplicate explicit IDs are source-verified collisions, but their intended editorial resolution is not yet decided. Do not rename or merge content automatically. First inspect whether each pair is a genuine duplicate, an intentional alternate, or a stale copied entry, then preserve/repair authored relationship targets deliberately. Non-standard frontmatter delimiters are source-verified but their effect on the real Astro build remains unverified.

**Next bounded phase:** Use the audit's findings to triage content-integrity warnings without automatic content edits; then finish the remaining Phase 1 accessibility work by reviewing main-landmark ownership and running the generated-site checks when dependencies/build environment are available. Do not begin Study More migration until the existing relationship data and build baseline have been reviewed.

**Progress log — 2026-10-14:** Added the read-only site audit script and package commands. `node --check scripts/auditSite.mjs` passed. Running `node scripts/auditSite.mjs` against the archive completed without runtime errors and surfaced the findings above. Full generated-site checks remain blocked by the absent `dist/` and dependencies/lockfile in the supplied archive.


## 10. Central Library and current audit follow-up — 2026-10-14

### 10.1 Owner decision

**Decision:** `/library/` is the central landing page for all First7 Bible-study resources, not a page limited to downloadable journals and study guides.

**Reason:** It should help readers discover existing resources and choose a next step while remaining useful before future ecosystem features are implemented.

### 10.2 Central Library implementation

**New route:** `src/pages/library/index.astro`

**Implementation approach:**
- Reuse `BaseLayout.astro` for shared document metadata, navigation, footer, and the single outer `<main>` landmark.
- Keep the page static and content-light; no new dependency, database, search engine, or relationship engine.
- Group existing routes into Read, Study, Explore, Grow and Reflect, and Guides and Resources.
- Link only to routes already present in `src/pages/`.
- Provide a clear “Begin with the Bible” path, section jump links, semantic headings/lists, visible keyboard focus, and responsive cards.
- Do not advertise Bible Journey, Passport, or a unified Study More graph as working features until they are implemented and verified.
- The existing `/resources/` and `/resources/journals/` routes remain the destination for practical and downloadable materials.

**Verification required:** production build; inspect `/library/` generated title, description, canonical, H1 and main landmark; verify every Library link resolves; test keyboard navigation and mobile layout.

### 10.3 Current local production audit results supplied by owner

The owner reports a successful Astro production build on 2026-10-14:
- Astro reported 2,794 generated pages; build completed in 837.06 seconds.
- The site audit counted 2,796 HTML files under `dist/`. This counter difference remains unexplained and should be investigated before treating either count as wrong.
- The regenerated Teaching index reports 330 teachings. The latest strict audit output should be used to confirm whether source/index counts now agree.
- The latest audit output shows repeated `HTML_MAIN_COUNT` warnings on Teaching and Verse routes, missing titles on `/library/` and `/unlock/`, and zero main landmarks on the Yandex verification document.

These are user-reported terminal results, not independently rerun in this patch environment.

### 10.4 Recommended bounded fixes

1. Keep `BaseLayout.astro` as the owner of the page-level `<main>` landmark. Convert redundant inner `<main>` wrappers to neutral containers on templates that use `BaseLayout`, preserving classes, data attributes, and scripts. For the Teaching route, update its Continue Reading selector if the data-bearing wrapper is no longer a `<main>`.
2. Give `/unlock/` a title/description through `BaseLayout` and ensure its content is inside the shared main landmark. The existing email form is still a placeholder (`action="#"`); this audit fix does not implement email collection or access control.
3. Exclude only `yandex_d80301bb83c00be2.html` from ordinary page SEO/landmark assertions in `scripts/auditSite.mjs`; preserve the verification file and URL.
4. Inspect `/library/` and make sure the central landing page has metadata through `BaseLayout`.
5. Rebuild and rerun `npm run audit:site -- --strict`; inspect all remaining findings rather than hiding broad classes of warnings.

**Caution:** Several route templates also declare their own `<main>` elements (including Books, Dictionary, Numbers, Prophecy, Plans, Prayers, Resources/Journals, Share, and Teachings). Fix shared templates, not generated `dist/` files. Do not globally exclude pages or suppress all landmark warnings.

### 10.5 Progress log

| Date | Work completed | Verification | Follow-up |
|---|---|---|---|
| 2026-10-14 | Owner approved `/library/` as the central landing page for all Bible-study resources. | Source archive shows `/library/index.astro` exists but is empty; current route inventory confirms destinations for Bible, Dictionary, Teachings, Prophecy, Numbers, Plans, Prayers, Reflections, Verses, Verse Jar, Guides, Resources, Journals, and Search. | Add the landing page; run build and strict audit in the owner’s current checkout. |
| 2026-10-14 | Owner reported successful build: 2,794 Astro pages in 837.06 seconds; audit counted 2,796 HTML files and emitted main-landmark/title warnings. | Reported terminal output. | Reconcile counts and finish shared-template fixes. |

### 10.6 Decision log update

| Date | Decision | Reason / evidence | Revisit when |
|---|---|---|---|
| 2026-10-14 | `/library/` is the central landing page for all First7 Bible-study resources. | Owner-approved direction; gives the existing static library one clear discovery entry point and leaves journals under `/resources/`. | Revisit after observing real reader navigation and the Study More integration. |


### 10.7 Latest strict audit verification — 2026-10-17

The latest `npm run audit:site -- --strict` run completed with zero errors, warnings, or informational findings.

- Generated HTML files: 2,800.
- Teaching source files: 330.
- Teaching index entries: 330, with 330 unique non-empty IDs and no missing titles.
- Missing HTML titles, meta descriptions, canonicals, and H1 headings: zero.
- Pages with a main-landmark count other than one: zero.
- Internal-link findings: zero.

The earlier findings in sections 10.3–10.5 record the historical state and should not be read as the current audit result.

**Scope:** This confirms the checks implemented by `scripts/auditSite.mjs` against the current checkout and generated `dist/`. It does not independently verify browser accessibility, mobile layout, or every interactive feature. A fresh production build should precede the final release verification.
