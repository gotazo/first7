// script/convert-bible.cjs

const fs = require("fs");
const path = require("path");

// Paths (your structure)
const inputDir = path.join(__dirname, "./raw-bible");
const outputDir = path.join(__dirname, "../src/data/bible");

// Ensure output folder exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// ---------- PARSE MARKDOWN ----------
function parseMarkdown(content) {
  // Get book name
  const bookMatch = content.match(/title:\s*(.+)/i);
  if (!bookMatch) return null;

  const book = bookMatch[1].trim();
  const chapters = {};

  // ✅ Supports: GENESIS 1, 1 JOHN 1, 2 KINGS 3, etc.
  const chapterRegex = /##\s*[A-Z0-9 ]+\s+(\d+)/gi;

  let match;
  const positions = [];

  while ((match = chapterRegex.exec(content)) !== null) {
    positions.push({
      chapter: match[1],
      index: match.index,
    });
  }

  // Extract each chapter block safely
  for (let i = 0; i < positions.length; i++) {
    const start = positions[i].index;
    const end = positions[i + 1]?.index || content.length;

    const block = content.slice(start, end);
    const chapterNum = positions[i].chapter;

    const verses = [];

    // ✅ Handles normalized format: **1** verse
    const verseRegex = /\*\*(\d+)\*\*\s*(.+)/g;

    let v;
    while ((v = verseRegex.exec(block)) !== null) {
      verses.push(v[2].trim());
    }

    if (verses.length > 0) {
      chapters[chapterNum] = verses;
    }
  }

  // If no chapters found → treat as invalid
  if (Object.keys(chapters).length === 0) return null;

  return { book, chapters };
}

// ---------- MAIN ----------
function processFiles() {
  const files = fs.readdirSync(inputDir);
  const books = {};

  console.log("🚀 Starting Bible conversion...\n");

  files.forEach((file) => {
    if (!file.endsWith(".md")) return;

    const filePath = path.join(inputDir, file);
    const content = fs.readFileSync(filePath, "utf-8");

    const result = parseMarkdown(content);

    if (!result) {
      console.log("❌ Skipped (invalid format):", file);
      return;
    }

    books[result.book] = result;
    console.log("✅ Processed:", result.book);
  });

  // Save JSON files
  Object.keys(books).forEach((book) => {
    const sortedChapters = Object.fromEntries(
      Object.entries(books[book].chapters).sort(
        (a, b) => Number(a[0]) - Number(b[0]),
      ),
    );

    books[book].chapters = sortedChapters;

    const safeName = book.toLowerCase().replace(/\s+/g, "-");
    const filePath = path.join(outputDir, `${safeName}.json`);

    fs.writeFileSync(filePath, JSON.stringify(books[book], null, 2));
  });

  console.log("\n📚 Total books:", Object.keys(books).length);
  console.log("✅ Done! Files saved in src/data/bible/");
}

processFiles();
