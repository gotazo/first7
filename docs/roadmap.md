# First7 Product Roadmap

**Status:** Active
**Last updated:** 2026-09-28

---

## 1. Product Vision

First7 helps people **discover, understand, remember, and live out Scripture through a simple, connected Bible-learning environment.**

First7 is not intended to be an endless-content platform.

Its purpose is to help a person make meaningful progress in studying Scripture and to make the next useful step easier to find.

The long-term experience should feel like a connected learning environment:

```text
Discover
   ↓
Understand
   ↓
Connect
   ↓
Remember
   ↓
Practice
   ↓
Progress
   ↓
Continue Learning
   ↺
```

A person should return to First7 because there is something **genuinely valuable to continue learning**, not because the product is designed to maximize attention.

---

## 2. Product Philosophy

### 2.1 Value Before Engagement

First7 should optimize for **meaningful learning**, not raw engagement.

A successful session is not simply:

> "The person spent more time on First7."

A successful session is:

> "The person understood, connected, remembered, or practiced something from Scripture."

Returning to First7 should happen naturally because the previous learning experience creates a meaningful next step.

---

### 2.2 Learning Over Consumption

First7 should not become an endless stream of Bible-related content.

The system should encourage:

- reading
- understanding
- connecting
- reflection
- remembering
- practice
- completion
- continued learning

The goal is not to maximize the number of pages visited.

---

### 2.3 Scripture First

Scripture remains the foundation of the system.

The supporting content exists to help people understand and study Scripture.

The Content Graph should therefore prioritize relationships that can be explained through:

- Scripture references
- explicit editorial relationships
- canonical terms
- aliases
- clearly defined topics
- other documented content relationships

---

### 2.4 Human-Authored Content

First7's core learning content should remain human-authored and editorially controlled.

AI may assist development workflows where appropriate, but the First7 website should not depend on AI-generated answers to provide its core Bible-learning experience.

The Content Graph should not depend on:

- semantic AI matching
- opaque recommendation models
- generated relationships
- user engagement signals

---

## 3. The First7 Learning Model

The long-term First7 learning model has several connected layers.

```text
SCRIPTURE
   ↓
CONTENT GRAPH
   ↓
STUDY MORE
   ↓
STUDY JOURNEYS
   ↓
PROGRESS
   ↓
PASSPORT
   ↓
PRACTICE / REINFORCEMENT
   ↓
CONTINUED LEARNING
```

Each layer should have a distinct purpose.

### Scripture

The source material being studied.

### Content Graph

Defines meaningful relationships between First7 content.

### Study More

Helps the reader discover related material without requiring an opaque recommendation system.

### Study Journeys

Turns related content into intentional learning paths, including 7-day studies.

### Progress

Records meaningful learning activity and completion.

### Passport

Provides a visible representation of the person's learning journey.

### Practice and Reinforcement

Games and review activities help people remember what they have studied.

### Continued Learning

The system provides meaningful next steps based on available content and, eventually, the person's learning history.

---

# 4. Content Graph and User Learning Graph

These are intentionally separate systems.

## Content Graph

The Content Graph answers:

> **What is meaningfully related to what?**

It is based on the content itself.

```text
Dictionary
    ↕
Teachings
    ↕
Prophecy
    ↕
Numbers
    ↕
Scripture
```

The graph should be:

- deterministic
- explainable
- editorially grounded
- Scripture-aware
- static-first
- independent of user behavior

It should not rank content according to:

- clicks
- popularity
- advertising value
- session length
- engagement scores

---

## User Learning Graph

The User Learning Graph answers:

> **What has this person studied, completed, reviewed, or practiced?**

It belongs to the learning/progression layer rather than the Content Graph.

Eventually it may contain information such as:

- studies started
- studies completed
- journeys completed
- Scripture reviewed
- games played as reinforcement
- milestones achieved
- Passport progress

The separation is important:

```text
CONTENT GRAPH
"What belongs together?"

        ↓

LEARNING EXPERIENCE
"What can I study?"

        ↓

USER LEARNING GRAPH
"What have I studied?"

        ↓

PROGRESSION
"Where am I in my learning journey?"
```

---

# 5. Learning Principles

First7 should borrow proven learning principles from successful learning platforms while avoiding engagement mechanics that do not serve learning.

## 5.1 Progressive Learning

Learning should be possible in small steps while allowing deeper study.

A person should be able to move from:

```text
Simple
  ↓
Related
  ↓
Deeper
  ↓
Structured
  ↓
Practice
```

---

## 5.2 Clear Learning Paths

People should not have to figure everything out themselves.

Study Journeys and 7-day plans should eventually provide clear paths through related material.

---

## 5.3 Small Sessions

A useful First7 session does not need to be long.

The system should support:

- short studies
- individual Scripture exploration
- one concept at a time
- short review sessions
- daily learning plans

---

## 5.4 Review and Reinforcement

Understanding something once is not the same as remembering it.

First7 should eventually support meaningful review through:

- Scripture review
- revisiting related studies
- games
- memory activities
- repeated exposure to important concepts

---

## 5.5 Visible Progress

People should be able to see meaningful progress through:

- completed studies
- completed journeys
- milestones
- Passport progression
- other meaningful learning records

Progress should represent **real learning activity**, not arbitrary app usage.

---

## 5.6 Completion

Completion should matter.

A person should be able to finish:

- an individual study
- a 7-day plan
- a Study Journey
- a learning milestone

Completion creates a natural reason to continue into the next meaningful area.

---

## 5.7 Gentle Continuation

First7 may eventually encourage people to continue learning, but continuation should remain gentle.

Avoid:

- punitive streak systems
- guilt-based notifications
- artificial scarcity
- forced daily engagement
- manipulative reminders

If streaks are ever used, they should support learning rather than become the objective.

---

# 6. What First7 Is Not Building

To keep the product focused, the following are not part of the current roadmap:

- an endless social feed
- an engagement-maximization system
- an opaque recommendation engine
- an AI Bible-answer system
- a generic chatbot
- popularity-based content ranking
- social-media-style interaction
- unnecessary notifications
- gamification for its own sake
- features added simply because another platform has them

New ideas should be evaluated against the core question:

> **Does this help a person discover, understand, remember, practice, or continue learning Scripture?**

If not, it should not automatically enter the roadmap unless a clear future purpose emerges.

---

# 7. Current Engineering Roadmap

## Phase 0 — Content Graph Audit

**Status: Complete**

Objectives:

- inspect existing collections
- inspect relationship fields
- identify identity problems
- identify duplicate IDs
- identify unresolved relationships
- document schema limitations
- establish relationship rules

Result:

The existing content was audited and the relationship architecture was defined without modifying existing content merely to make the audit pass.

---

## Phase 1 — Relationship Foundation

**Status: Complete**

Implemented:

- shared relationship types
- canonical content identity
- identity lookup maps
- explicit relationship resolution
- relationship provenance
- relationship strength
- ambiguity handling
- unresolved relationship handling
- draft filtering
- self-link prevention
- deduplication
- deterministic ordering
- Prophecy → Numbers relationships

Verification:

- 20 relationship tests passing
- Astro check: 0 errors
- implementation committed to Git

---

## Phase 2 — Scripture Relationship Layer

**Status: Next**

Purpose:

Build the canonical Scripture-reference layer used by the Content Graph.

This phase should establish deterministic handling for references such as:

```text
John 3:16
John 3:16–18
John 3
```

The layer should support:

- book normalization
- explicit book aliases
- chapter normalization
- inclusive verse ranges
- chapter-only references
- Scripture identity
- Scripture overlap detection
- deterministic relationship evidence

Initial relationship rule:

```text
Same chapter + overlapping verse intervals
        ↓
Medium relationship evidence
```

Same-book-only relationships remain weak and should not be displayed as Study More relationships.

This phase must not introduce:

- fuzzy matching
- semantic matching
- AI matching
- guessed Scripture references
- broad keyword matching

The Scripture layer should be implemented and tested as a pure, deterministic system before it is connected to routes or UI.

---

## Phase 3 — Complete Study More Index

**Status: Planned**

Combine:

- explicit relationships
- Scripture relationships
- canonical identity
- relationship provenance
- relationship strength
- deterministic ordering

into the complete Study More index.

The result should provide compact, resolved content items for the UI without exposing raw collection entries or internal lookup maps.

---

## Phase 4 — Connect the Index to Existing Content

**Status: Planned**

Connect the completed relationship index to existing First7 content routes.

Initial targets include:

- Dictionary
- Teachings
- Prophecy
- Numbers
- Bible-related pages where appropriate

Existing local relationship logic should be migrated carefully rather than duplicated indefinitely.

---

## Phase 5 — Study More UI

**Status: Planned**

Build the user-facing Study More experience.

The UI should make relationships understandable and useful.

It should answer:

> **"What else can I study that is meaningfully connected to this?"**

The UI should not become an infinite recommendation feed.

---

## Phase 6 — Real-Content Testing

**Status: Planned**

Test the completed system against the actual First7 content.

Verify:

- relationship correctness
- duplicate handling
- ambiguous references
- Scripture ranges
- missing relationships
- ordering
- performance
- route correctness
- real-world usefulness

---

## Phase 7 — Cleanup and Documentation

**Status: Planned**

After the Content Graph is working:

- remove obsolete relationship logic
- resolve documentation drift
- update architecture documentation
- update implementation documentation
- add final tests
- create a clean Git checkpoint

---

# 8. Next Product Layer — Study Journeys

After Study More is stable, the next major learning layer is:

> **Study Journeys / 7-Day Learning**

Study Journeys should turn connected content into intentional learning experiences.

Possible structure:

```text
Journey
  ↓
Day 1
  ↓
Day 2
  ↓
Day 3
  ↓
...
  ↓
Day 7
  ↓
Completion
```

The exact journey system should be designed after the Content Graph is stable.

---

# 9. Later Layer — Progress and Passport

Progression comes after meaningful learning experiences exist.

The future system may include:

- study completion
- journey completion
- milestones
- Passport progression
- meaningful rewards

Rewards should represent learning accomplishments rather than encourage arbitrary usage.

---

# 10. Later Layer — Play Integration

`play.first7.org` remains a separate project.

Its deeper integration with First7 should happen after the learning model and progression model are established.

The role of Play is primarily:

> **Practice and reinforcement.**

Games should reinforce learning rather than become a separate engagement system competing with the Bible-learning experience.

---

# 11. Future Product Tracks

Some ideas are intentionally kept separate from the current engineering roadmap.

These may include:

- physical Bible verse cards
- 7-day journals
- useful merchandise
- gift products
- other physical or digital products

These can become separate product tracks without interrupting the core First7 learning architecture.

---

# 12. Privacy and Local-First Principles

Where practical, user learning progress should be designed with a local-first approach.

The system should minimize unnecessary collection of personal learning behavior.

Progression should not require an advertising-driven behavioral profile.

The long-term goal is:

> **Useful personalization without unnecessary surveillance.**

---

# 13. Decision Rule for New Features

Before adding a major feature, ask:

### Does it help people:

1. Discover Scripture?
2. Understand Scripture?
3. Connect related Scripture and learning?
4. Remember what they learned?
5. Practice what they learned?
6. Make meaningful progress?
7. Continue into another useful learning experience?

If the answer is no, the feature should not automatically enter the roadmap.

If the answer is yes, determine **which layer it belongs to** before implementation begins.

---

# 14. Current Position

First7 has completed the initial Content Graph foundation.

Current state:

```text
Content Audit                 ✅
Relationship Foundation       ✅
Scripture Relationship Layer  ← NEXT
Complete Content Graph        ⏳
Study More Integration        ⏳
Study More UI                 ⏳
Study Journeys                ⏳
Progress                      ⏳
Passport                      ⏳
Play Integration              ⏳
```

The immediate priority is therefore:

> **Build the Scripture Relationship Layer before adding another major product feature.**

---

# 15. Guiding Principle

First7 should become valuable enough that people naturally want to come back because their learning can continue.

Not:

> "Come back because we want another visit."

But:

> **"Come back because there is something meaningful here to learn next."**

The product should make that next step easier while keeping Scripture, learning, clarity, and trust at the center.
