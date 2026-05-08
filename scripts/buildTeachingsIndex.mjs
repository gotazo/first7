import fs from "fs";
import path from "path";
import matter from "gray-matter";

const teachingsDir = path.resolve("src/content/teachings");
const outputFile = path.resolve("src/indexes/teachings-index.json");

function getAllFiles(dir) {
  let results = [];

  const list = fs.readdirSync(dir);

  list.forEach((file) => {

    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath));
    } else if (file.endsWith(".md")) {
      results.push(fullPath);
    }

  });

  return results;
}

const files = getAllFiles(teachingsDir);

const teachings = files.map((file) => {

  const raw = fs.readFileSync(file, "utf-8");

  const { data } = matter(raw);

  return {
    id: data.id || "",
    title: data.title || "",
    summary: data.summary || "",
    topics: data.topics || [],
    keywords: data.keywords || [],
    scripture: data.scripture || {},
  };

});

fs.writeFileSync(
  outputFile,
  JSON.stringify(teachings, null, 2)
);

console.log(`✅ Indexed ${teachings.length} teachings`);