import test from "node:test";
import assert from "node:assert/strict";
import {
  normalize,
  prepareEntry,
  rankEntries,
  isCloseWord,
  excerpt,
  readRecents,
} from "../assets/js/spotlight-engine.mjs";

const entries = [
  {
    id: "projects",
    title: "Projects",
    kind: "pages",
    description: "Apps and experiments.",
    content: "CampFlow and Evolve, a habit tracker.",
  },
  {
    id: "campflow",
    title: "Building CampFlow",
    kind: "writing",
    category: "Tech Projects",
    content: "A campsite management system.",
    tags: ["open-source"],
  },
  {
    id: "brazil",
    title: "Three weeks in Brazil",
    kind: "writing",
    description: "Volunteering and teaching.",
    content: "My projects brought a community together.",
  },
  {
    id: "resume",
    title: "Download résumé",
    kind: "actions",
    aliases: ["cv", "resume", "curriculum vitae"],
  },
  {
    id: "about",
    title: "About",
    kind: "pages",
    aliases: ["Simone Mattioli"],
    content: "Studying at ELTE University.",
  },
].map(prepareEntry);

test("exact titles outrank incidental body and category matches", () => {
  const ranked = rankEntries(entries, "projects");
  assert.equal(ranked[0].id, "projects");
  assert.ok(
    ranked.findIndex((x) => x.id === "campflow") <
      ranked.findIndex((x) => x.id === "brazil"),
  );
});
test("aliases, accents and case resolve the intended action", () => {
  for (const query of ["CV", "résumé", "resume", "curriculum vitae"]) {
    assert.equal(rankEntries(entries, query)[0].id, "resume");
  }
  assert.equal(normalize("  Héllo—WORLD!  "), "hello world");
});
test("whole-content search finds data-backed pages", () => {
  assert.equal(rankEntries(entries, "habit tracker")[0].id, "projects");
  assert.equal(rankEntries(entries, "ELTE")[0].id, "about");
});
test("all query words must match and filters are enforced", () => {
  assert.equal(rankEntries(entries, "projects", "writing").length, 2);
  assert.equal(rankEntries(entries, "resume", "pages").length, 0);
  assert.equal(rankEntries(entries, "brazil nonexistingword").length, 0);
  assert.equal(rankEntries(entries, "source", "writing")[0].id, "campflow");
});
test("typos allow one edit or transposition, not loose short acronyms", () => {
  for (const query of ["campflwo", "campflo", "camppflow", "campflov"]) {
    assert.equal(rankEntries(entries, query)[0].id, "campflow");
  }
  assert.equal(isCloseWord("cv", "cl"), false);
  assert.equal(isCloseWord("planet", "project"), false);
  assert.equal(isCloseWord("camp", "campsite"), false);
});
test("literal punctuation and malicious-looking input cannot become regular expressions", () => {
  for (const query of [
    "[",
    "(",
    ".*",
    "\\",
    "?",
    "a{9999999}",
    "<img src=x onerror=alert(1)>",
    "🙂",
  ]) {
    assert.doesNotThrow(() => rankEntries(entries, query));
  }
  assert.deepEqual(rankEntries(entries, ".*"), []);
  assert.deepEqual(rankEntries(entries, "   "), []);
});
test("long input is bounded and deterministic ties use title order", () => {
  assert.deepEqual(rankEntries(entries, "x".repeat(20000)), []);
  const same = ["Zebra", "Apple"].map((title) =>
    prepareEntry({ title, content: "test", kind: "pages" }),
  );
  assert.equal(rankEntries(same, "test")[0].title, "Apple");
});
test("preview shows a body match instead of an unrelated description", () => {
  const entry = {
    description: "An introduction.",
    content: `${"A useful story. ".repeat(35)}ELTE University is where I study. ${"More context. ".repeat(20)}`,
  };
  const preview = excerpt(entry, "ELTE");
  assert.ok(preview.includes("ELTE"));
  assert.ok(preview.length <= 192);
  assert.ok(preview.startsWith("…"));
  assert.equal(excerpt(entry, "introduction"), entry.description);
  assert.equal(excerpt({ ...entry, title: "ELTE" }, "ELTE"), entry.description);
});
test("recent selections discard invalid, duplicate, future and expired data", () => {
  const now = Date.UTC(2026, 9, 14);
  const value = JSON.stringify([
    { id: "projects", time: now },
    { id: "projects", time: now },
    { id: "old", time: now - 31 * 86400000 },
    { id: "future", time: now + 1 },
    null,
    42,
    { id: "bad", time: "yesterday" },
    { id: "about", time: now - 1, secret: "not retained" },
  ]);
  assert.deepEqual(readRecents(value, now), [
    { id: "projects", time: now },
    { id: "about", time: now - 1 },
  ]);
  for (const corrupt of [null, "{", "{}", '"text"'])
    assert.deepEqual(readRecents(corrupt, now), []);
  assert.equal(
    readRecents(
      JSON.stringify(
        Array.from({ length: 12 }, (_, i) => ({ id: String(i), time: now })),
      ),
      now,
    ).length,
    6,
  );
});

const intentEntries = [
  {
    id: "ai",
    title: "AI assistant",
    kind: "writing",
    topics: ["projects"],
    timestamp: 100,
  },
  {
    id: "new-ai",
    title: "A new experiment",
    description: "Artificial intelligence for nature",
    kind: "writing",
    topics: ["projects"],
    timestamp: 200,
  },
  {
    id: "travel",
    title: "Travel diary",
    content: "I said the trail was great",
    kind: "writing",
    timestamp: 300,
  },
  {
    id: "blog",
    title: "Blog",
    description: "Latest articles and AI projects",
    kind: "pages",
    timestamp: 400,
  },
].map(prepareEntry);

test("everyday search prefixes retain the intended title and unknown terms", () => {
  for (const query of [
    "find projects",
    "show me projects",
    "please show me projects",
    "search for projects",
  ]) {
    assert.equal(rankEntries(entries, query)[0].id, "projects");
  }
  assert.deepEqual(rankEntries(entries, "show me projects nonexistent"), []);
});
test("latest articles sort writings by date and respect explicit filters", () => {
  for (const query of [
    "latest articles",
    "recent posts",
    "show me newest writing",
  ]) {
    assert.deepEqual(
      rankEntries(intentEntries, query).map((x) => x.id),
      ["travel", "new-ai", "ai"],
    );
    assert.deepEqual(rankEntries(intentEntries, query, "pages"), []);
    assert.deepEqual(rankEntries(intentEntries, query, "actions"), []);
  }
  assert.deepEqual(
    rankEntries(intentEntries, "latest articles about AI").map((x) => x.id),
    ["new-ai", "ai"],
  );
});
test("AI searches match the acronym and expanded phrase without incidental short-word matches", () => {
  for (const query of ["AI projects", "artificial intelligence projects"]) {
    assert.deepEqual(
      rankEntries(intentEntries, query).map((x) => x.id),
      ["ai", "new-ai"],
    );
  }
  assert.ok(!rankEntries(intentEntries, "AI").some((x) => x.id === "travel"));
  assert.deepEqual(
    rankEntries(intentEntries, "latest projects").map((x) => x.id),
    ["new-ai", "ai"],
  );
});
