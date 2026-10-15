// Run after npm run build. Override SEARCH_BUILD_DIR to inspect an isolated build.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { prepareEntry, rankEntries } from "../assets/js/spotlight-engine.mjs";

const output = path.resolve(process.env.SEARCH_BUILD_DIR || "public");
const index = JSON.parse(
  fs.readFileSync(path.join(output, "searchindex.json"), "utf8"),
);

test("every search entry has a unique, generated destination and structured text", () => {
  assert.equal(new Set(index.map((entry) => entry.id)).size, index.length);
  for (const entry of index) {
    assert.ok(entry.title.trim(), entry.href);
    assert.ok(["pages", "writing"].includes(entry.kind));
    assert.ok(Array.isArray(entry.aliases));
    assert.ok(Array.isArray(entry.tags));
    assert.ok(
      fs.existsSync(
        path.join(output, decodeURIComponent(entry.href), "index.html"),
      ),
      entry.href,
    );
  }
});
test("all primary destinations are indexed; shells, taxonomy noise and drafts are excluded", () => {
  for (const href of [
    "/",
    "/about/",
    "/projects/",
    "/passion/",
    "/blog/",
    "/globe/",
    "/call/",
    "/links/",
  ]) {
    assert.ok(
      index.some((entry) => entry.href === href),
      `Missing ${href}`,
    );
  }
  assert.ok(
    !index.some((entry) =>
      /^\/(tags|sections|offline|search)\//.test(entry.href),
    ),
  );
  assert.ok(
    !index.some((entry) => entry.href === "/blog/tech-projects/evolve/"),
  );
  assert.ok(index.filter((entry) => entry.kind === "writing").length > 50);
});
test("data-backed portfolio and biography content is searchable", () => {
  const entries = index.map(prepareEntry);
  assert.ok(
    rankEntries(entries, "Evolve", "pages").some(
      (entry) => entry.href === "/projects/",
    ),
  );
  assert.ok(
    rankEntries(entries, "ELTE", "pages").some(
      (entry) => entry.href === "/about/",
    ),
  );
  assert.equal(rankEntries(entries, "Projects")[0].href, "/projects/");
  assert.ok(
    rankEntries(entries, "campflwo").some((entry) =>
      entry.title.toLowerCase().includes("campflow"),
    ),
  );
});
test("the search page keeps both command instances with unique accessible IDs", () => {
  const html = fs.readFileSync(path.join(output, "search/index.html"), "utf8");
  for (const id of [
    "spotlight-input",
    "spotlight-results",
    "site-search-input",
    "site-search-results",
  ]) {
    const occurrences = [
      ...html.matchAll(new RegExp(`\\bid=["']?${id}(?=["' >])`, "g")),
    ];
    assert.equal(occurrences.length, 1, id);
  }
  assert.ok(!html.includes("search-result-item-template"));
  assert.ok(html.includes("Search pages, writing, and actions"));
});

test("everyday queries resolve real contact, recent writing and AI project destinations", () => {
  const entries = index.map(prepareEntry);
  for (const query of [
    "contact Simone",
    "contact Simone Mattioli",
    "get in touch",
  ]) {
    assert.equal(rankEntries(entries, query)[0].href, "/links/");
  }
  assert.equal(rankEntries(entries, "find projects")[0].href, "/projects/");
  const recent = rankEntries(entries, "latest articles");
  assert.equal(
    recent.length,
    entries.filter((x) => x.kind === "writing").length,
  );
  assert.ok(
    recent.every(
      (entry, i) => i === 0 || recent[i - 1].timestamp >= entry.timestamp,
    ),
  );
  const projects = rankEntries(entries, "AI projects");
  assert.ok(projects.length >= 3);
  assert.equal(projects[0].kind, "writing");
  assert.ok(projects.every((entry) => entry.topics.includes("projects")));
  assert.ok(projects.some((entry) => entry.title.includes("DeepSafe")));
});

test("thumbnail previews are small generated local assets with a text-only fallback", () => {
  const illustrated = index.filter((entry) => entry.thumbnail);
  assert.ok(illustrated.length > 30);
  assert.ok(
    index.some((entry) => entry.title === "CampFlow" && entry.thumbnail),
  );
  assert.ok(index.some((entry) => !entry.thumbnail));
  for (const entry of illustrated) {
    assert.ok(
      entry.thumbnail.startsWith("/") && !entry.thumbnail.startsWith("//"),
    );
    assert.ok(entry.thumbnail.endsWith(".webp"));
    const image = path.join(output, decodeURIComponent(entry.thumbnail));
    assert.ok(fs.existsSync(image), entry.thumbnail);
    assert.ok(fs.statSync(image).size < 40_000, entry.thumbnail);
  }
});
