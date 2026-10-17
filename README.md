# First7 Central Library — Small, Isolated Patch

This bundle is intentionally a patch, not a replacement source archive. It avoids overwriting the user's newer local work.

## Included

- `src/pages/library/index.astro` — new central landing page for First7 Bible-study resources.
- `src/pages/unlock.astro` — gives the current unlock page the shared layout, page title, description, and main landmark while preserving its existing content/download query behavior.
- `scripts/patches/audit-yandex.patch` — excludes only the exact Yandex verification HTML file from ordinary generated-page SEO/landmark checks.
- `scripts/patches/teaching-landmark.patch` — removes the redundant inner Teaching `<main>` and updates the Continue Reading selector.
- `scripts/patches/verse-landmark-change.txt` — two focused manual changes for the Verse page; avoids line-ending churn.
- `docs/first7-improvement-audit-roadmap-addendum.md` — append to the current roadmap; do not replace the roadmap with an older archive copy.

## Apply in the current checkout

1. Copy `src/pages/library/index.astro` to the same path in the project. This fills the currently empty route.
2. Review `src/pages/unlock.astro`, then copy the supplied file to that path. The form still has `action="#"` as a placeholder; this change does not implement email collection or access control.
3. Copy the patch files to a temporary directory, then run from the project root:

```bash
git apply --check /path/to/audit-yandex.patch
git apply /path/to/audit-yandex.patch
git apply --check /path/to/teaching-landmark.patch
git apply /path/to/teaching-landmark.patch
```

4. Apply the two focused edits in `verse-landmark-change.txt` manually.
5. Append the roadmap addendum to the current `docs/first7-improvement-audit-roadmap.md`. Keep one authoritative roadmap and preserve all local edits.

If either patch fails because local files differ from the supplied source, do not force it. Apply the described changes manually after reviewing the current file.

## Important scope note

The latest audit output shows duplicate main landmarks across more templates than Teaching and Verse. The Teaching and Verse edits address those two templates only; other templates that declare their own `<main>` while using `BaseLayout` still need the same careful, route-specific review. `BibleLayout.astro` owns a separate reading layout and should not be changed blindly. Do not suppress all main-landmark warnings or edit generated `dist/` files.

## Verify in the current checkout

```bash
npm run build
npm run audit:site -- --strict
echo "Exit code: $?"
```

Then check `/library/` in a browser, confirm its links resolve, test keyboard section links, and verify Continue Reading on a Teaching page. This patch has not been run through the user's current local Astro build; only source routes in the supplied archive were checked.
