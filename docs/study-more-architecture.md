# First7 Study More — Architecture

**Status:** Architecture defined  
**Version:** 1.0  
**Scope:** Study More, content relationships, and future First7 learning progression  
**Primary goal:** Turn First7's growing Bible content library into a connected, useful, Scripture-first learning experience.

---

# 1. Purpose

First7 is growing beyond a collection of individual Bible pages.

The project now contains multiple forms of Bible-learning content:

- Scripture
- Bible Dictionary
- Teachings
- Prophecy
- Biblical Numbers
- Devotional material
- Study plans
- Games
- Future progression and Passport features

As the content library grows, simply adding more pages is not enough.

The user must be able to move naturally from one piece of useful content to another.

The immediate feature for this is:

> **Study More**

Study More should help a reader answer:

> "I have finished this study. What useful First7 resource should I explore next?"

The longer-term purpose is to establish a reusable content relationship layer that can later support:

- Study More
- guided study paths
- devotional plans
- 7-day plans
- personalized study journeys
- review and reinforcement
- Passport progression
- digital rewards
- games connected to study
- topic exploration
- Scripture discovery
- learning history

The relationship system is therefore a foundational First7 capability.

---

# 2. Product Vision

First7 should become more than a static collection of Bible articles.

The long-term direction is:

```text
                         SCRIPTURE
                             │
                             ↓
                      First7 Content
                             │
             ┌───────────────┼───────────────┐
             ↓               ↓               ↓
        Dictionary       Teachings        Prophecy
             │               │               │
             └───────────────┼───────────────┘
                             ↓
                          Numbers
                             │
                             ↓
                   Content Relationships
                             │
                 ┌───────────┼───────────┐
                 ↓           ↓           ↓
             Study More  Study Plans  Discovery
                 │           │           │
                 ↓           ↓           ↓
              Progress   Completion   Passport
                 │           │           │
                 └───────────┼───────────┘
                             ↓
                       Continued Study
```

The purpose of this system is not to maximize clicks.

The purpose is to increase the value of each visit by helping the user make meaningful progress.

A successful First7 experience should make a user think:

> "I learned something useful here. I know what I can study next. I can come back tomorrow and continue where I left off."

---

# 3. Product Principles

## 3.1 Scripture-first

Scripture remains the foundation.

Study More must not become an interpretive recommendation engine.

Relationships should be based on:

- explicit editorial relationships
- structured content relationships
- Scripture references
- clearly defined terms
- controlled metadata

The system must not invent theological connections.

## 3.2 Useful before engaging

First7 should optimize for usefulness, not raw engagement.

A user should never be pushed toward more content merely to increase session length.

A recommendation should exist because it provides a meaningful next step.

## 3.3 Explainable relationships

Every automatic relationship should have a concrete reason.

Examples:

- "This teaching explicitly relates to this term."
- "Both entries reference this passage."
- "This prophecy explicitly references this number."
- "This dictionary entry lists this term under See Also."

Avoid opaque recommendation logic.

## 3.4 Static-first

Where practical, relationships should be resolved at build time.

The final page should contain usable HTML links without requiring:

- an API
- a database
- client-side recommendation requests
- a recommendation service

This preserves First7's static-first architecture.

## 3.5 Editorial control

Automatic discovery must never override an explicit editorial relationship.

If the author declares:

```yaml
related:
  - offering
  - covenant
```

those relationships are authoritative.

Automatic matching supplements editorial relationships.

It does not replace them.

## 3.6 Gentle progression

Future progression features should encourage consistency without using manipulative engagement mechanics.

Examples of useful progression:

- completed studies
- study plans
- learning milestones
- Passport progress
- review suggestions
- earned badges/rewards
- returning to an unfinished plan

Avoid:

- artificial urgency
- excessive notifications
- punishment for missed days
- deceptive streak mechanics
- endless scrolling
- engagement loops with no learning value

The user's spiritual and learning goals come before engagement metrics.

---

# 4. Initial Scope

The first Study More implementation covers:

- Dictionary
- Teachings
- Prophecy
- Numbers

Bible pages are a future integration target.

The first implementation must not attempt to build the entire First7 learning platform.

The immediate goal is:

> Build a reliable relationship layer that can later support larger learning features.

---

# 5. Current Content Collections

The existing collection schemas are authoritative.

Do not change schemas merely to make Study More easier.

The relevant collections currently contain different relationship fields.

---

# 6. Dictionary Schema

Relevant fields:

- `title`
- `term`
- `shortMeaning`
- `biblicalUsage`
- `reference`
- `featuredVerse`
- `scriptures`
- `related`
- `aliases`
- `seeAlso`
- `tags`
- `hebrew`
- `greek`

There is no declared:

- `id`
- `terms`
- `topics`
- `keywords`
- `category`
- `subcategory`

field in the Dictionary schema.

Dictionary files are generally flat filename-derived Astro IDs.

Example:

```text
src/content/dictionary/altar.md
```

produces an Astro ID similar to:

```text
altar
```

The canonical lexical term is:

```ts
entry.data.term
```

The relationship layer must not blindly assume that term and entry.id are always identical.

---

# 7. Teaching Schema

Relevant fields:

- `id`
- `title`
- `summary`
- `topics`
- `terms`
- `related`
- `keywords`
- `scripture`
- `scriptures`
- `truth`
- `insight`
- `application`
- `prayer`
- `featured`
- `order`

Teaching has an important identity distinction.

For example:

```text
src/content/teachings/altar/ancient-foundations.md
```

may contain:

```yaml
id: ancient-foundations
```

while Astro's path-derived ID is:

```text
altar/ancient-foundations
```

These are different identifiers.

For routing:

```ts
entry.id
```

is the canonical route identity.

For existing authored Teaching relationships:

```ts
entry.data.id
```

must be resolvable to the corresponding Astro entry.

Do not change existing Teaching IDs as part of Study More.

---

# 8. Prophecy Schema

Relevant fields:

- `title`
- `description`
- `category`
- `tags`
- `scriptures`
- `related`
- `terms`
- `order`
- `numbers`
- `notes`
- `draft`
- `featuredVerse`

Prophecy entries use path-derived IDs.

Example:

```text
events/armageddon
```

The `related` field commonly contains category-qualified Prophecy IDs.

The canonical route identity is:

```ts
entry.id
```

Draft entries must not appear in published Study More results.

---

# 9. Numbers Schema

Relevant fields:

- `title`
- `number`
- `shortMeaning`
- `category`
- `featuredVerse`
- `scriptures`
- `related`
- `terms`
- `aliases`
- `notes`

Number entries generally use numeric filenames.

Example:

```text
src/content/numbers/7.md
```

produces:

```ts
entry.id = "7"
```

while:

```yaml
number: 7
```

is the numeric data value.

Both identities must be retained.

---

# 10. Relationship Philosophy

Relationships are divided into three tiers.

### Strong

Explicit editorial relationships.

### Medium

Deterministic structured relationships.

### Weak

Broad discovery signals.

The initial system must never display a weak signal by itself.

---

# 11. Strong Relationship Signals

Strong relationships include:

- Dictionary `related`
- Dictionary `seeAlso`
- Teaching `related`
- Prophecy `related`
- Numbers `related`
- Prophecy `numbers`

Strong relationships are editorially intentional.

They should take precedence over automatically inferred relationships.

---

# 12. Medium Relationship Signals

Medium relationships include:

- exact canonical term matches
- exact alias matches
- meaningful topic matches
- normalized Scripture overlap
- explicit number relationships

These can produce visible Study More recommendations when they satisfy relevance rules.

---

# 13. Weak Relationship Signals

Weak signals include:

- broad tags
- broad categories
- generic keywords
- title similarity
- broad text overlap

Weak signals should not independently create a visible recommendation.

They may later support candidate discovery.

---

# 14. No Fuzzy Recommendation Engine

The initial system must not use:

- fuzzy text similarity
- embeddings
- semantic similarity
- AI-generated recommendations
- arbitrary word-frequency matching

The core Study More system must remain:

- deterministic
- testable
- explainable
- editorially controllable

Future experiments may exist outside the core relationship system.

---

# 15. Relationship Provenance

Every relationship should retain its source internally.

Conceptually:

```ts
type RelationshipSource =
  | "explicit-related"
  | "explicit-see-also"
  | "term-match"
  | "alias-match"
  | "topic-match"
  | "scripture-match"
  | "number-match";
```

The exact implementation may vary.

The important requirement is that the relationship engine knows:

> Why does this relationship exist?

This will help with:

- testing
- debugging
- future editorial tools
- deterministic filtering
- future administration interfaces

The UI does not initially need to display the reason.

---

# 16. Dictionary Relationships

## Dictionary → Dictionary

Strong:

- `related`
- `seeAlso`

Medium:

- aliases
- canonical term resolution

Explicit relationships must resolve to real Dictionary entries.

Unresolved references must not become broken URLs.

## Dictionary → Teaching

Primary signal:

```text
Dictionary.term
        ↕
Teaching.terms
```

Secondary signal:

```text
Dictionary.aliases
        ↕
Teaching.terms
```

Teaching keywords may support discovery but should not independently generate large recommendation lists.

## Dictionary → Prophecy

Primary:

```text
Dictionary.term
        ↕
Prophecy.terms
```

Secondary:

```text
Dictionary.aliases
```

Prophecy tags alone are insufficient.

## Dictionary → Numbers

Primary:

```text
Dictionary.term
        ↕
Number.terms
```

Secondary:

```text
Number.aliases
```

---

# 17. Teaching Relationships

## Teaching → Teaching

Strong:

```text
Teaching.related
```

The resolver must convert authored Teaching IDs to Astro route IDs.

## Teaching → Dictionary

Primary:

```text
Teaching.terms
        ↕
Dictionary.term
```

Secondary:

```text
Teaching.terms
        ↕
Dictionary.aliases
```

## Teaching → Prophecy

Possible signals:

- explicit relationships
- exact meaningful terms
- normalized Scripture overlap

Because Prophecy content can be interpretive and topic-heavy, matching should remain conservative.

## Teaching → Numbers

Possible signals:

- explicit relationships
- meaningful exact terms
- normalized Scripture relationships

Do not infer numeric significance merely because a number occurs in prose.

---

# 18. Prophecy Relationships

## Prophecy → Prophecy

Strong:

```text
Prophecy.related
```

Resolve against canonical Prophecy IDs.

## Prophecy → Dictionary

Primary:

```text
Prophecy.terms
        ↕
Dictionary.term
```

Secondary:

```text
Dictionary.aliases
```

## Prophecy → Numbers

Prophecy has a structured numeric relationship:

```text
Prophecy.numbers
```

This should be treated as a strong structured signal.

Do not infer numeric relationships from arbitrary text.

---

# 19. Numbers Relationships

## Number → Number

Strong:

```text
Number.related
```

## Number → Dictionary

Primary:

```text
Number.terms
        ↕
Dictionary.term
```

Secondary:

```text
Number.aliases
```

## Number → Prophecy

Use:

```text
Prophecy.numbers
```

for reverse discovery.

This is preferable to inferring a relationship from shared tags or text.

---

# 20. Scripture Relationship System

Scripture relationships should eventually become a reusable First7 capability.

Raw string equality is insufficient.

For example:

```text
Daniel 7
```

and:

```text
Daniel 7:3-7
```

represent overlapping Scripture.

The future Scripture normalization layer should represent:

- book
- chapter
- verseStart
- verseEnd

A whole chapter should represent all verses within that chapter.

A range should represent the specified verse interval.

---

# 21. Scripture Relationship Strength

Strongest:

- same verse/range

Medium:

- same chapter with meaningful overlap

Weak:

- same book only

Same-book overlap should not normally produce a Study More recommendation.

Scripture parsing must be independent of the UI.

---

# 22. Relationship Direction

Relationships are directed unless explicitly represented in both directions.

For example:

```text
A.related → B
```

does not automatically rewrite:

```text
B.related → A
```

The relationship index may maintain reverse lookup information internally.

However, authored direction must remain intact.

---

# 23. Identity Resolution

The relationship system should build lookup maps for:

- Astro entry ID
- Authored content ID
- Canonical Dictionary term
- Dictionary aliases
- Number numeric value
- Normalized Scripture reference

The most important special case is Teaching:

```text
Teaching.data.id
        ↓
Teaching entry
        ↓
Teaching.entry.id
```

The resolver must handle this explicitly.

---

# 24. Relationship Index

The core system should build a relationship index at build time.

Conceptually:

```text
Collections
    ↓
Normalize identities
    ↓
Build lookup maps
    ↓
Resolve explicit relationships
    ↓
Generate structured candidates
    ↓
Normalize Scripture
    ↓
Filter invalid/self/draft targets
    ↓
Deduplicate
    ↓
Produce Study More results
```

The index should be reusable by multiple routes.

---

# 25. Recommended Module Structure

Recommended initial structure:

```text
src/lib/study-more/
├── index.ts
├── types.ts
├── buildStudyMoreIndex.ts
├── resolveRelationships.ts
├── dictionary.ts
├── teachings.ts
├── prophecy.ts
├── numbers.ts
└── scripture.ts
```

The exact file breakdown may be simplified during implementation.

The architectural boundary is more important than the exact filenames.

---

# 26. UI Boundary

Astro components should receive resolved data.

They should not:

- scan collections
- resolve IDs
- calculate relationship strength
- parse Scripture
- decide recommendation relevance

Instead:

```text
Relationship Engine
        ↓
Study More result
        ↓
Astro component
        ↓
HTML
```

---

# 27. Study More Result Model

Conceptually:

```ts
interface StudyMoreGroup {
  type:
    | "dictionary"
    | "teachings"
    | "prophecy"
    | "numbers";
  items: StudyMoreItem[];
}

interface StudyMoreItem {
  title: string;
  href: string;
}
```

The UI should receive already-resolved route URLs.

The UI should not know how the relationship was discovered.

---

# 28. Empty Groups

Empty groups should not render.

Example:

```text
Dictionary: 4
Teachings: 3
Prophecy: 0
Numbers: 0
```

should display:

```text
Dictionary
Teachings
```

and omit the empty groups.

---

# 29. Deterministic Ordering

Study More results must always appear in deterministic order.

Recommended priority:

```text
Explicit relationship
        ↓
Structured medium relationship
        ↓
Supporting relationship
        ↓
Stable alphabetical/ID ordering
```

Never randomize Study More results.

This is important for:

- static builds
- testing
- predictable UX
- caching
- future progression systems

---

# 30. Deduplication

If multiple signals identify the same target:

```text
term-match
+
scripture-match
+
explicit-related
```

the UI should display the target once.

The internal relationship should retain its strongest/provenance information.

---

# 31. Self Links

The current content item must never appear as its own recommendation.

---

# 32. Draft Content

Draft Prophecy entries must not appear in published Study More results.

The relationship system must respect existing publication rules.

---

# 33. Existing Relationship Code

The following existing systems should be reviewed and gradually migrated:

```text
src/pages/teachings/[...slug].astro

src/pages/prophecy/[...slug].astro

src/pages/number/[...slug].astro

src/pages/bible/[book]/[chapter].astro

src/lib/relationships/getRelatedDictionary.ts

src/lib/relationships/getRelatedProphecy.ts

src/lib/relationships/getRelatedTeachings.ts
```

Existing behavior must be preserved before expanding functionality.

The new Study More engine should eventually become the common relationship layer rather than leaving multiple independent matching implementations.

---

# 34. Search Is Separate

Search and Study More solve different problems.

Search asks:

> "What did the user search for?"

Study More asks:

> "What First7 content is meaningfully connected to this content?"

The systems may share normalization utilities.

They should not share recommendation responsibility.

The client-side search index must not become the Study More source of truth.

---

# 35. Teaching Search Index

The generated:

```text
src/indexes/teachings-index.json
```

is not the authoritative relationship index.

It currently omits important relationship fields.

The Astro content collections remain the source of truth.

The existing Teaching index should only be modified later if there is an independent reason to do so.

---

# 36. Current DictionaryStudyMore

The existing:

```text
src/components/tools/dictionary/DictionaryStudyMore.astro
```

already provides the correct conceptual UI location.

However, it currently calculates relationships locally.

That should eventually change to:

```text
Dictionary route
      ↓
Study More relationship service
      ↓
resolved Study More data
      ↓
DictionaryStudyMore
```

The invalid:

```ts
entry.data.terms
```

must not be treated as an existing Dictionary field.

The component should eventually receive actual relationship groups rather than simply dumping Dictionary tags.

---

# 37. Future First7 Learning Layer

Study More should be designed as the first consumer of a broader First7 learning graph.

The long-term architecture is:

```text
                 First7 Content Graph
                         │
         ┌───────────────┼───────────────┐
         ↓               ↓               ↓
     Discovery        Learning        Progress
         │               │               │
         ↓               ↓               ↓
    Study More       Study Plans     Passport
                         │               │
                         ↓               ↓
                    Completion       Rewards
```

Study More provides the content connections.

A future learning system can use those connections to create structured journeys.

---

# 38. From Content Library to Learning Journey

As the First7 library grows, the user should not have to decide what to do next every time.

For example:

```text
Day 1

Introduction to Faith
        ↓
Dictionary: Faith
        ↓
Teaching: Walking by Faith
        ↓
Scripture: Hebrews 11
        ↓
Reflection
        ↓
Completion
```

The next day:

```text
Day 2

Faithfulness
        ↓
Dictionary: Faithful
        ↓
Teaching: Faith That Endures
        ↓
Scripture
        ↓
Reflection
```

The relationship engine makes this possible.

The system can therefore evolve from:

```text
page → related pages
```

into:

```text
study → next meaningful study
```

without changing the underlying content model.

---

# 39. Study Plans

Future First7 Study Plans should be able to reference existing content.

A plan should not require duplicate copies of teaching or dictionary content.

Conceptually:

```text
Study Plan
    ↓
Day 1 → Teaching ID
Day 2 → Dictionary ID
Day 3 → Scripture
Day 4 → Teaching ID
Day 5 → Reflection
Day 6 → Related Study
Day 7 → Review
```

This allows existing First7 content to become reusable learning material.

---

# 40. Devotional Plans

First7's original vision includes devotional use.

The future system should support devotional journeys such as:

- 7-Day Faith Journey
- 7-Day Prayer Journey
- 7-Day Hope Journey
- 7-Day Wisdom Journey

Each day can combine:

- Scripture
- a Teaching
- Dictionary context
- reflection
- prayer
- optional activity
- completion

The relationship system can help generate or suggest appropriate supporting material.

Editorially authored plans should remain the highest-confidence experience.

Automatic plans should remain conservative.

---

# 41. Learning Progress

A future First7 progression layer may track:

- studies completed
- plans started
- plans completed
- topics explored
- dictionary terms studied
- teachings completed
- Scripture passages explored
- review items
- milestones

This should initially remain local-first where practical.

First7 does not need a large backend merely to know that a user completed a study on their device.

---

# 42. Passport Integration

The future First7 Passport can use Study More relationships to represent learning progress.

For example:

```text
Passport
   │
   ├── Bible Foundations
   │      ├── Creation
   │      ├── Faith
   │      ├── Prayer
   │      └── Salvation
   │
   ├── Bible Dictionary
   │      ├── Terms explored
   │      └── Terms completed
   │
   ├── Teachings
   │      └── Studies completed
   │
   └── Study Plans
          └── Journeys completed
```

The relationship graph can help identify what the user has already explored and what remains available.

---

# 43. Progression Should Represent Real Learning

Progress should not reward arbitrary clicking.

Examples of meaningful progress:

- completing a study
- finishing a devotional day
- completing a 7-day plan
- reviewing a previously studied term
- completing a Scripture reading
- completing a learning path

A user should not gain meaningful progression merely by opening hundreds of pages.

---

# 44. Rewards

Future digital rewards may include:

- Passport stamps
- badges
- completion certificates
- visual milestones
- unlocked study themes
- game content connected to completed studies

Rewards should reinforce learning rather than replace it.

The reward system should remain secondary to Scripture and study.

---

# 45. Games Integration

`play.first7.org` is a separate project.

The relationship system should not immediately couple the two projects.

However, the architecture should allow a future relationship such as:

```text
Teaching
    ↓
Dictionary
    ↓
Study completed
    ↓
Related game
```

For example:

```text
Study: Biblical Numbers
        ↓
Dictionary: Seven
        ↓
Number: 7
        ↓
Game: Biblical Numbers Challenge
```

The game should reinforce learning rather than distract from it.

---

# 46. Return Value

The reason for building this ecosystem is not simply to increase page views.

First7 should give users a reason to return because:

- there is more useful material to discover
- their study journey continues
- they can resume a plan
- they can review what they learned
- they can see meaningful progress
- new content becomes relevant to previous study
- they can build a personal history of learning

The ideal loop is:

```text
Learn
  ↓
Understand
  ↓
Explore
  ↓
Practice / Reflect
  ↓
Complete
  ↓
See Progress
  ↓
Return when ready
  ↓
Continue
```

This is a learning loop, not an engagement trap.

---

# 47. Inspiration from Successful Learning Platforms

First7 may learn from successful learning products in areas such as:

- progressive learning
- daily plans
- small achievable steps
- visible progress
- review
- completion
- personalized continuation
- badges
- milestones
- structured journeys
- game-assisted reinforcement

However, First7 should develop its own identity.

The goal is not to copy another platform.

The goal is to apply proven learning principles to Bible study.

First7's differentiator should remain:

```text
Scripture
+
Structured learning
+
Connected Bible content
+
Gentle progression
+
Personal study history
```

---

# 48. Personalization

Future personalization should be based primarily on the user's own study history and explicit choices.

Examples:

```text
Recently studied:
Faith
Prayer
Grace

Suggested continuation:
Faithfulness
Trust
Prayer
```

Personalization should remain transparent.

The system should not pretend to know the user's spiritual condition.

It should simply say:

> "Because you studied these topics, here are some related resources."

---

# 49. Local-First Progression

First7 should prefer local-first storage for early progression features.

Potential local data:

- completed studies
- completed plan days
- current plan
- progress
- Passport milestones
- review history
- preferences

This fits First7's:

- static-first architecture
- privacy-conscious approach
- low infrastructure requirements
- offline/PWA goals

Cloud synchronization can be considered later if there is a real need.

---

# 50. Content Graph vs User Graph

There are two separate graphs.

## Content Graph

What First7's content is connected to.

```text
Faith
 ├── Dictionary
 ├── Teaching
 ├── Scripture
 └── Study Plan
```

## User Learning Graph

What the user has studied.

```text
User
 ├── completed Faith
 ├── completed Prayer
 ├── started Grace
 └── current plan: Foundations
```

These must remain separate.

The content graph is public/static.

The user graph is private/personal.

The Study More engine belongs primarily to the content graph.

---

# 51. Privacy

Early progression features should not require an account.

Local-first progress is preferred.

Do not collect personal data merely to provide basic study progression.

If cloud synchronization is introduced later, it should be an explicit product decision.

---

# 52. Performance

The relationship system must avoid:

```text
every page
    ↓
scan every collection
    ↓
scan every item
for every generated page
```

Prefer:

```text
build
  ↓
load collections
  ↓
build relationship index
  ↓
routes query index
```

This is particularly important as First7 grows from hundreds to thousands of pages.

---

# 53. Scalability

The architecture should work when First7 has:

- 500 Dictionary entries
- 1,000 Dictionary entries
- 5,000 Dictionary entries

and hundreds or thousands of Teachings.

The implementation should therefore:

- build lookup maps
- normalize once
- avoid repeated linear scans where practical
- keep UI rendering simple
- keep generated data deterministic

Do not over-engineer the system before the current content volume requires it.

---

# 54. Testing

The relationship engine must have focused tests.

Test:

## Identity

- Dictionary ID
- Dictionary aliases
- Teaching authored ID
- Teaching Astro ID
- Prophecy path ID
- Number ID
- Number numeric value

## Explicit relationships

- valid target
- unresolved target
- self-link
- draft target

## Term relationships

- exact term
- case normalization
- alias
- duplicate target
- no fuzzy match

## Scripture

- chapter
- verse
- range
- overlapping ranges
- malformed references
- different books

## Numbers

- Number → Number
- Prophecy → Number
- Number → Dictionary

## Determinism

Identical input must always produce identical output.

---

# 55. Migration Strategy

## Phase 1 — Relationship foundation

Create:

```text
src/lib/study-more/
```

Implement:

- types
- collection adapters
- identity resolution
- explicit relationships

Do not migrate every page yet.

## Phase 2 — Deterministic inferred relationships

Add:

- term matching
- alias matching
- controlled topic relationships
- number relationships

## Phase 3 — Scripture normalization

Create reusable Scripture reference parsing and overlap logic.

## Phase 4 — Dictionary Study More

Replace the current local filtering in:

```text
DictionaryStudyMore.astro
```

with resolved Study More data.

## Phase 5 — Existing page migration

Gradually migrate:

- Teachings
- Prophecy
- Numbers
- Bible

to the common relationship system.

## Phase 6 — Study Plans

Use the content graph to build manually authored:

- 7-Day Plans
- Devotional Plans
- Topic Journeys

## Phase 7 — Progression

Connect completed studies to:

- Passport
- Progress
- Milestones
- Rewards

## Phase 8 — Personalization

Use local study history to provide:

- Continue Studying
- Review
- Recommended Next
- Recently Studied

without requiring a backend.

---

# 56. Schema Changes

Do not change schemas during the initial implementation unless a concrete requirement is discovered.

If a schema change becomes necessary:

1. document the reason
2. identify affected content
3. define migration rules
4. update schema
5. migrate content
6. validate content
7. test
8. run `astro check`
9. run production build

---

# 57. Success Criteria

Study More succeeds when:

- explicit relationships are preserved
- automatic relationships are explainable
- broken links are not generated
- Teaching IDs are resolved correctly
- Scripture relationships can be normalized
- empty groups disappear
- draft content is excluded
- results are deterministic
- relationship logic is separate from UI
- pages remain static
- existing behavior is preserved
- tests cover the relationship engine
- `npx astro check` passes
- production build passes

The larger First7 learning system succeeds when:

- users can discover connected content
- users can follow meaningful study paths
- users can complete devotional plans
- users can resume unfinished journeys
- users can see genuine progress
- Passport reflects meaningful learning activity
- games can reinforce study
- the system remains useful without requiring an account
- progression remains secondary to Scripture

---

# 58. Final Architecture

```text
                         FIRST7
                           │
                           ↓
                    CONTENT GRAPH
                           │
       ┌───────────────────┼───────────────────┐
       ↓                   ↓                   ↓
   Dictionary          Teachings           Prophecy
       │                   │                   │
       └───────────────────┼───────────────────┘
                           ↓
                        Numbers
                           │
                           ↓
                 RELATIONSHIP ENGINE
                           │
       ┌───────────────────┼───────────────────┐
       ↓                   ↓                   ↓
   Explicit           Structured          Scripture
 relationships          matches             matches
       │                   │                   │
       └───────────────────┼───────────────────┘
                           ↓
                      STUDY MORE
                           │
              ┌────────────┼────────────┐
              ↓            ↓            ↓
         Discovery    Study Plans   Devotionals
              │            │            │
              └────────────┼────────────┘
                           ↓
                    USER PROGRESS
                           │
              ┌────────────┼────────────┐
              ↓            ↓            ↓
          Continue      Passport      Rewards
          Studying
              │
              ↓
            RETURN
              │
              ↓
       CONTINUE LEARNING
```

The central principle is:

> Connect people to useful Scripture-based learning because the content itself establishes a meaningful relationship—not because an opaque engagement algorithm wants another click.

First7 should help people discover, understand, remember, and continue studying Scripture.

**Study More is the first layer of that system.**
