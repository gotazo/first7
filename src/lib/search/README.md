# Search Engine

The First7 search engine is fully static.

Each content collection is responsible for converting its own data into a shared `SearchItem` format.

The builder combines all collections into a single search index.

## Flow

Teachings
Dictionary
Verse Jar
Plans
Resources
Guides
Reflections

↓

SearchItem[]

↓

search-index.json

↓

Client-side search