export const prerender = false;

import type { APIRoute } from "astro";
import teachings from "../../indexes/teachings-index.json";
import fs from "fs";
import path from "path";

/* ------------------ 🧠 SYNONYMS ------------------ */
const synonyms: Record<string, string[]> = {
  anxious: ["worry", "fear", "stress", "overthinking"],
  worry: ["anxious", "fear"],
  stuck: ["delay", "waiting", "blocked"],
  lost: ["direction", "confused", "purpose"],
  sad: ["down", "heavy", "depressed"],
  fear: ["afraid", "anxious"],
};

/* ------------------ 🧠 LOGGING ------------------ */
const logSearch = (query: string) => {
  try {
    const filePath = path.resolve("logs/searches.json");

    let data: any[] = [];

    if (fs.existsSync(filePath)) {
      const file = fs.readFileSync(filePath, "utf-8");
      data = file ? JSON.parse(file) : [];
    }

    const existing = data.find((d) => d.query === query);

    if (existing) {
      existing.count = (existing.count || 1) + 1;
      existing.lastSearched = new Date().toISOString();
    } else {
      data.push({
        query,
        count: 1,
        lastSearched: new Date().toISOString(),
      });
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("❌ Log write failed:", err);
  }
};

/* ------------------ 🧠 SCORING ------------------ */
function scoreTeaching(teaching: any, words: string[]) {
  let score = 0;

  const topics = teaching.topics || [];
  const keywords = teaching.keywords || [];

  words.forEach((word) => {
    if (topics.includes(word)) score += 4;
    if (keywords.includes(word)) score += 3;

    Object.entries(synonyms).forEach(([key, values]) => {
      if (values.includes(word)) {
        if (topics.includes(key)) score += 2;
        if (keywords.includes(key)) score += 1;
      }
    });
  });

  return score;
}

/* ------------------ 🚀 API ------------------ */
export const POST: APIRoute = async ({ request }) => {
  try {
    // 🧠 Safe body parsing
    let body;
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const question: string = body?.question?.trim() || "";

    if (!question) {
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // 🧠 Save search
    logSearch(question);

  

    // 🧠 Normalize input
    const words = question
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(" ")
      .filter(Boolean);

    // 🧠 Score
    const scored = teachings.map((t) => ({
      teaching: t,
      score: scoreTeaching(t, words),
    }));

    // 🧠 Rank
    const sorted = scored
      .filter((t) => t.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const finalResults =
      sorted.length > 0
        ? sorted.map((t) => t.teaching)
        : teachings.slice(0, 2);

    return new Response(
      JSON.stringify({
        results: finalResults.map((t) => ({
  slug: t.id,
  title: t.title || "",
  summary: t.summary || "",
})),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ API ERROR:", error);

    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};