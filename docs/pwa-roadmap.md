# First7 PWA Roadmap

> **Mission**
>
> Build a fast, reliable, installable Bible study app that allows people to continue reading Scripture and biblical resources—even without an internet connection.

---

# Core Principles

The PWA should always prioritize the reading experience.

Every feature should support one or more of these goals:

- Read anywhere.
- Load quickly.
- Update automatically.
- Work reliably.
- Stay simple.

When deciding whether something should be cached, always ask:

> Does this help someone continue reading God's Word?

---

# Caching Philosophy

Because First7 contains mostly evergreen biblical content, aggressive caching is encouraged.

## Cache

✅ Bible studies

✅ Devotionals

✅ Dictionary entries

✅ Reading plans

✅ Guides

✅ Bible pages

✅ Verse collections

✅ Images

✅ CSS

✅ JavaScript

✅ Fonts

✅ Icons

---

## Do Not Cache

❌ Analytics

❌ Temporary API responses

❌ Third-party tracking

❌ Browser extension requests

---

## Cache Only If It Improves Reading

- Search API (future)
- Daily verse API (future)
- User preferences
- Recently viewed pages

---

# Resource Strategy

| Resource | Strategy | Reason |
|----------|----------|--------|
| HTML Pages | Network First | Always try to fetch updated content while allowing offline reading. |
| Bible Studies | Network First | Keep teachings updated but available offline once visited. |
| Dictionary | Network First | Evergreen content with offline support. |
| Devotionals | Network First | Update when online, readable offline. |
| Reading Plans | Network First | Keep plans current while supporting offline use. |
| CSS | Stale While Revalidate | Fast loading with automatic updates. |
| JavaScript | Stale While Revalidate | Immediate startup with background updates. |
| Images | Cache First | Rarely change and should always display. |
| Fonts | Cache First | Improve performance and offline reading. |
| Icons | Cache First | Static assets. |
| Manifest | Network First | Detect updates. |
| Service Worker | Network Only | Always install the newest version. |
| Future APIs | Network First | Fresh data when online. |

---

# Cache Organization

first7-pages-v1

Contains:

- Homepage
- Bible studies
- Dictionary
- Reading plans
- Guides
- Devotionals

Strategy:

Network First

---

first7-assets-v1

Contains:

- CSS
- JavaScript
- Fonts
- Manifest

Strategy:

Stale While Revalidate

---

first7-images-v1

Contains:

- Logos
- Icons
- Illustrations
- OG images

Strategy:

Cache First

---

# Offline Experience

If a requested page has already been visited:

Show the cached version.

If it has never been visited:

Display the offline page.

The user should never see the browser's default offline error page.

---

# Automatic Updates

The application should:

- Detect new deployments.
- Update caches in the background.
- Notify the user when a new version is available.
- Remove outdated caches automatically.

---

# Development Phases

## ✅ Phase 1 — Installable PWA

Completed.

- Manifest
- Icons
- Install prompt
- Service Worker
- Offline page
- Basic caching

---

## 🚧 Phase 2 — Intelligent Offline Experience

### Phase 2.1

- Multiple cache groups
- Cleaner service worker architecture
- Helper functions

### Phase 2.2

- Intelligent caching strategies
- Offline improvements

### Phase 2.3

- Automatic cache cleanup
- Versioned caches

---

## Phase 3 — Reading Experience

- Recently viewed
- Continue reading
- Offline Bible studies
- Offline dictionary
- Offline reading plans
- Favorites

---

## Phase 4 — App Experience

- Update notification
- Better install experience
- Better offline page
- App shortcuts
- Share improvements

---

## Phase 5 — Advanced Features

- Background sync (where supported)
- Periodic updates (where supported)
- Smarter storage management

---

# Success Criteria

The First7 PWA should feel like a native Bible study application.

Users should be able to:

- Install it easily.
- Read previously visited content without internet.
- Receive updates automatically.
- Enjoy fast page loads.
- Trust that biblical resources remain available wherever they are.