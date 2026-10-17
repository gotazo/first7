#!/usr/bin/env node
/**
 * First7 source + generated-site audit.
 * Read-only: this script reports findings and never edits content or build output.
 * Run after a build for the fullest report: npm run build && npm run audit:site
 * Add --strict to exit non-zero when errors are found.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, 'src', 'content');
const DIST_ROOT = path.join(ROOT, 'dist');
const INDEX_FILE = path.join(ROOT, 'src', 'indexes', 'teachings-index.json');
const strict = process.argv.includes('--strict');
const findings = [];
const counts = new Map();

function report(level, code, message, file = '') {
  findings.push({ level, code, message, file });
}

function walk(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, predicate));
    else if (entry.isFile() && predicate(full)) out.push(full);
  }
  return out;
}

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join('/');
}

function parseFrontmatter(file) {
  const raw = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  const lines = raw.split(/\r?\n/);
  if (lines[0]?.trim() !== '---') {
    report('WARN', 'CONTENT_NO_FRONTMATTER', 'Markdown/MDX file has no recognizable frontmatter block.', rel(file));
    return null;
  }
  const closingIndex = lines.findIndex((line, index) => index > 0 && /^-{3,}\s*$/.test(line));
  if (closingIndex < 0) {
    report('ERROR', 'CONTENT_FRONTMATTER_UNCLOSED', 'Frontmatter opens with --- but has no closing dash delimiter.', rel(file));
    return null;
  }
  if (lines[closingIndex].trim() !== '---') {
    report('WARN', 'CONTENT_FRONTMATTER_NONSTANDARD_DELIMITER', `Frontmatter closes with "${lines[closingIndex].trim()}" instead of "---"; verify this file with Astro.`, rel(file));
  }
  const frontmatter = lines.slice(1, closingIndex).join('\n');

  // This intentionally extracts top-level keys only. Astro/Zod remains the authoritative
  // YAML/schema validator; this dependency-free pass checks common audit fields.
  const data = Object.create(null);
  for (const line of frontmatter.split(/\r?\n/)) {
    if (!line || /^\s/.test(line) || /^\s*#/.test(line)) continue;
    const pair = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*?)\s*$/);
    if (!pair) continue;
    let value = pair[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (value === '' || value === 'null' || value === '~') data[pair[1]] = value === '' ? true : null;
    else if (value === 'true') data[pair[1]] = true;
    else if (value === 'false') data[pair[1]] = false;
    else data[pair[1]] = value;
  }
  return data;
}

function normalizedRoutePath(value) {
  let pathname = value.split('#')[0].split('?')[0];
  try { pathname = decodeURIComponent(pathname); } catch { /* retain original path */ }
  if (!pathname.startsWith('/')) return null;
  if (pathname.startsWith('//')) return null;
  return pathname || '/';
}

function existsInDist(pathname) {
  const clean = pathname.replace(/^\/+/, '');
  const candidates = [];
  if (!clean || clean.endsWith('/')) candidates.push(path.join(DIST_ROOT, clean, 'index.html'));
  candidates.push(path.join(DIST_ROOT, clean));
  if (!path.extname(clean)) {
    candidates.push(path.join(DIST_ROOT, `${clean}.html`));
    candidates.push(path.join(DIST_ROOT, clean, 'index.html'));
  }
  return candidates.some((candidate) => {
    const resolved = path.resolve(candidate);
    return resolved.startsWith(path.resolve(DIST_ROOT) + path.sep) && fs.existsSync(resolved) && fs.statSync(resolved).isFile();
  });
}

function htmlAttribute(tag, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = tag.match(new RegExp(`\\b${escaped}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match?.[2]?.trim() ?? '';
}

function auditContent() {
  console.log('\nSOURCE CONTENT');
  if (!fs.existsSync(CONTENT_ROOT)) {
    report('ERROR', 'CONTENT_ROOT_MISSING', 'src/content directory was not found.');
    return;
  }
  const collections = fs.readdirSync(CONTENT_ROOT, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  for (const collection of collections) {
    const dir = path.join(CONTENT_ROOT, collection);
    const allFiles = walk(dir);
    for (const file of allFiles) {
      if (!/\.(md|mdx)$/i.test(file)) {
        report('WARN', 'CONTENT_UNSUPPORTED_EXTENSION', 'File inside a content collection does not end in .md or .mdx and is excluded from the content count.', rel(file));
      }
    }
    const files = allFiles.filter((file) => /\.(md|mdx)$/i.test(file));
    counts.set(collection, files.length);
    console.log(`  ${collection.padEnd(16)} ${String(files.length).padStart(4)} files`);
    const explicitIds = new Map();
    const explicitSlugs = new Map();
    for (const file of files) {
      const data = parseFrontmatter(file);
      if (!data) continue;
      const fileLabel = rel(file);
      if (Object.hasOwn(data, 'id') && data.id != null && String(data.id).trim()) {
        const id = String(data.id).trim();
        if (explicitIds.has(id)) report('ERROR', 'DUPLICATE_CONTENT_ID', `Duplicate explicit id "${id}"; first seen in ${explicitIds.get(id)}.`, fileLabel);
        else explicitIds.set(id, fileLabel);
      }
      if (Object.hasOwn(data, 'slug') && data.slug != null && String(data.slug).trim()) {
        const slug = String(data.slug).trim();
        if (explicitSlugs.has(slug)) report('WARN', 'DUPLICATE_EXPLICIT_SLUG', `Duplicate explicit slug "${slug}"; first seen in ${explicitSlugs.get(slug)}.`, fileLabel);
        else explicitSlugs.set(slug, fileLabel);
      }
      if (collection !== 'pages' && !String(data.title ?? '').trim()) {
        report('WARN', 'CONTENT_TITLE_MISSING', 'Content frontmatter has no non-empty title.', fileLabel);
      }
      if (collection === 'teachings') {
        for (const key of ['id', 'title', 'summary', 'topics', 'scripture']) {
          if (data[key] == null || data[key] === '') report('WARN', 'TEACHING_FIELD_MISSING', `Teaching frontmatter is missing "${key}".`, fileLabel);
        }
      }
    }
  }

  if (fs.existsSync(INDEX_FILE)) {
    try {
      const index = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
      if (!Array.isArray(index)) report('ERROR', 'TEACHING_INDEX_NOT_ARRAY', 'Teaching index JSON must contain an array.', rel(INDEX_FILE));
      else {
        const ids = new Set();
        let missingId = 0;
        let missingTitle = 0;
        for (const item of index) {
          if (!item?.id) missingId++;
          else if (ids.has(String(item.id))) report('ERROR', 'DUPLICATE_TEACHING_INDEX_ID', `Duplicate teaching index id "${item.id}".`, rel(INDEX_FILE));
          else ids.add(String(item.id));
          if (!String(item?.title ?? '').trim()) missingTitle++;
        }
        console.log(`\nTEACHING INDEX\n  entries: ${index.length}\n  unique non-empty IDs: ${ids.size}\n  missing IDs: ${missingId}\n  missing titles: ${missingTitle}`);
        const sourceCount = counts.get('teachings') ?? 0;
        if (sourceCount !== index.length) report('WARN', 'TEACHING_SOURCE_INDEX_COUNT_DIFF', `Teaching source files (${sourceCount}) differ from index entries (${index.length}); inspect draft/filtering and build timing.`, rel(INDEX_FILE));
        if (missingId) report('WARN', 'TEACHING_INDEX_MISSING_IDS', `${missingId} teaching index entries have no id.`, rel(INDEX_FILE));
        if (missingTitle) report('WARN', 'TEACHING_INDEX_MISSING_TITLES', `${missingTitle} teaching index entries have no title.`, rel(INDEX_FILE));
      }
    } catch (error) {
      report('ERROR', 'TEACHING_INDEX_INVALID_JSON', `Could not parse teaching index: ${error.message}`, rel(INDEX_FILE));
    }
  } else {
    report('INFO', 'TEACHING_INDEX_NOT_FOUND', 'Teaching index has not been generated yet; run npm run build:index.');
  }
}

function auditDist() {
  console.log('\nGENERATED SITE');
  if (!fs.existsSync(DIST_ROOT)) {
    report('INFO', 'DIST_NOT_FOUND', 'dist/ does not exist. Build first for generated HTML, SEO, and internal-link checks.');
    console.log('  dist/ not found — generated-site checks skipped.');
    return;
  }
  const htmlFiles = walk(DIST_ROOT, (file) => file.endsWith('.html'));
  console.log(`  HTML pages/files: ${htmlFiles.length}`);
  const titles = new Map();
  const canonicals = new Map();
  const generatedPaths = new Set(htmlFiles.map((file) => '/' + path.relative(DIST_ROOT, file).split(path.sep).join('/')));
  let missingTitle = 0;
  let missingDescription = 0;
  let missingCanonical = 0;
  let missingH1 = 0;
  let nonSingleMain = 0;
  let brokenInternalLinks = 0;

  for (const file of htmlFiles) {
    const fileLabel = rel(file);

  // Search-engine verification files are not normal HTML pages.
    if (path.basename(file) === 'yandex_d80301bb83c00be2.html') {
      continue;
    }

    const html = fs.readFileSync(file, 'utf8');
    const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim() ?? '';
    const descriptionTag = html.match(/<meta\b[^>]*\bname\s*=\s*(["'])description\1[^>]*>/i)?.[0] ?? '';
    const description = htmlAttribute(descriptionTag, 'content');
    const canonicalTag = html.match(/<link\b[^>]*\brel\s*=\s*(["'])canonical\1[^>]*>/i)?.[0] ?? '';
    const canonical = htmlAttribute(canonicalTag, 'href');
    const h1Count = (html.match(/<h1\b/gi) ?? []).length;
    const mainCount = (html.match(/<main\b/gi) ?? []).length;
    if (!title) { missingTitle++; report('WARN', 'HTML_TITLE_MISSING', 'Generated HTML has no title.', fileLabel); }
    else if (titles.has(title)) report('WARN', 'DUPLICATE_HTML_TITLE', `Duplicate title also used by ${titles.get(title)}.`, fileLabel);
    else titles.set(title, fileLabel);
    if (!description) {
      missingDescription++;
      report('WARN', 'HTML_DESCRIPTION_MISSING', 'Generated HTML has no meta description.', fileLabel);
    }

    const isOfflinePage =
      path.relative(DIST_ROOT, file).split(path.sep).join('/') ===
      'offline.html';

    if (!canonical && !isOfflinePage) {
      missingCanonical++;
      report('WARN', 'HTML_CANONICAL_MISSING', 'Generated HTML has no canonical link.', fileLabel);
    } else if (canonical) {
      if (canonicals.has(canonical)) {
        report('WARN', 'DUPLICATE_CANONICAL', `Canonical URL also used by ${canonicals.get(canonical)}.`, fileLabel);
      } else {
        canonicals.set(canonical, fileLabel);
      }
    }
    if (!h1Count) { missingH1++; report('WARN', 'HTML_H1_MISSING', 'Generated HTML has no h1 heading.', fileLabel); }
    if (mainCount !== 1) { nonSingleMain++; report('WARN', 'HTML_MAIN_COUNT', `Generated HTML contains ${mainCount} main landmarks; expected exactly one.`, fileLabel); }

    const hrefs = [...html.matchAll(/\bhref\s*=\s*(["'])(.*?)\1/gi)].map((match) => match[2].trim());
    for (const href of hrefs) {
      if (!href || href.startsWith("/") || /^(?:https?:|mailto:|tel:|javascript:|data:|#)/i.test(href)) continue;
      let target;
      try { target = new URL(href, `https://first7-audit.invalid/${path.relative(DIST_ROOT, file).split(path.sep).join('/')}`).pathname; }
      catch { continue; }
      if (!existsInDist(target)) {
        brokenInternalLinks++;
        report('WARN', 'HTML_INTERNAL_HREF_MISSING', `Relative link target "${href}" does not resolve to a generated file.`, fileLabel);
      }
    }
    for (const match of html.matchAll(/\bhref\s*=\s*(["'])(\/(?!\/)[^"']*)\1/gi)) {
      const pathname = normalizedRoutePath(match[2]);
      if (!pathname || existsInDist(pathname)) continue;
      // Skip likely dynamic or externalized routes only if the exact target is absent: report for review.
      brokenInternalLinks++;
      report('WARN', 'HTML_INTERNAL_HREF_MISSING', `Internal link target "${match[2]}" does not resolve to a generated file.`, fileLabel);
    }
  }
  console.log(`  Missing title: ${missingTitle}`);
  console.log(`  Missing meta description: ${missingDescription}`);
  console.log(`  Missing canonical: ${missingCanonical}`);
  console.log(`  Missing h1: ${missingH1}`);
  console.log(`  Pages with main landmark count != 1: ${nonSingleMain}`);
  console.log(`  Internal link findings: ${brokenInternalLinks}`);
  console.log(`  Dist HTML path samples: ${[...generatedPaths].slice(0, 3).join(', ') || '(none)'}`);
}

function printSummary() {
  const order = { ERROR: 0, WARN: 1, INFO: 2 };
  findings.sort((a, b) => order[a.level] - order[b.level] || a.code.localeCompare(b.code) || a.file.localeCompare(b.file));
  const totals = { ERROR: 0, WARN: 0, INFO: 0 };
  for (const item of findings) totals[item.level]++;
  console.log('\nAUDIT SUMMARY');
  console.log(`  Errors: ${totals.ERROR} | Warnings: ${totals.WARN} | Info: ${totals.INFO}`);
  if (findings.length) {
    for (const item of findings) {
      const location = item.file ? ` [${item.file}]` : '';
      console.log(`  ${item.level.padEnd(5)} ${item.code}${location}: ${item.message}`);
    }
  } else {
    console.log('  No findings detected by the enabled checks.');
  }
  console.log('\nNotes: this is a deterministic source/output audit, not a replacement for Astro schema validation, browser testing, accessibility review, or editorial review.');
  if (!fs.existsSync(DIST_ROOT)) console.log('Next: npm run build, then npm run audit:site -- --strict');
  if (strict && totals.ERROR > 0) process.exitCode = 1;
}

auditContent();
auditDist();
printSummary();
