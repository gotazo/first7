const fs = require("fs");
const path = require("path");

const inputDir = path.join(__dirname, "./raw-bible");

function normalizeFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");

  // Get book name
  const titleMatch = content.match(/title:\s*(.+)/i);
  if (!titleMatch) return;

  const book = titleMatch[1].trim().toUpperCase();

  // 🔥 Fix chapter format
  content = content.replace(/##\s*CHAPTER\s+(\d+)/gi, (_, num) => {
    return `## ${book} ${num}`;
  });

  // 🔥 Fix verse format (only lines starting with number)
  content = content.replace(/^(\d+)\s+/gm, (match, num) => {
    return `**${num}** `;
  });

  fs.writeFileSync(filePath, content, "utf-8");
  console.log("✅ Normalized:", path.basename(filePath));
}

function run() {
  const files = fs.readdirSync(inputDir);

  console.log("🚀 Normalizing Bible files...\n");

  files.forEach((file) => {
    if (!file.endsWith(".md")) return;

    const filePath = path.join(inputDir, file);
    normalizeFile(filePath);
  });

  console.log("\n✅ All files normalized!");
}

run();
