const fs = require("fs");
const path = require("path");

const inputDir = path.join(__dirname, "../src/content/bible");
const outputDir = path.join(__dirname, "../src/data/bible");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function extractVerses(content) {
  const regex = /<p[^>]*><span[^>]*>\d+<\/span>(.*?)<\/p>/g;
  const verses = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    verses.push(match[1].trim());
  }

  return verses;
}

function processFiles() {
  const files = fs.readdirSync(inputDir);

  const books = {};

  files.forEach(file => {
    const filePath = path.join(inputDir, file);
    const content = fs.readFileSync(filePath, "utf-8");

    // Extract book + chapter
    const bookMatch = content.match(/book:\s*"(.*?)"/);
    const chapterMatch = content.match(/chapter:\s*(\d+)/);

    if (!bookMatch || !chapterMatch) return;

    const book = bookMatch[1];
    const chapter = chapterMatch[1];

    const verses = extractVerses(content);

    if (!books[book]) {
      books[book] = {
        book,
        chapters: {}
      };
    }

    books[book].chapters[chapter] = verses;
  });

  // Save each book
  Object.keys(books).forEach(book => {
    const safeName = book.replace(/\s+/g, "-");
    const filePath = path.join(outputDir, `${safeName}.json`);

    fs.writeFileSync(filePath, JSON.stringify(books[book], null, 2));
  });

  console.log("✅ Bible converted successfully!");
}

processFiles();