import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

test("Hugo selects dependencies from HTML class tokens and template opt-ins", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "site-script-features-"));
  try {
    fs.mkdirSync(path.join(directory, "layouts/partials/essentials"), { recursive: true });
    fs.mkdirSync(path.join(directory, "data"));
    fs.writeFileSync(path.join(directory, "hugo.toml"), 'baseURL = "https://example.org/"\ndisableKinds = ["taxonomy", "term", "RSS", "sitemap"]\n');
    fs.copyFileSync(new URL("../layouts/partials/essentials/script-features.html", import.meta.url), path.join(directory, "layouts/partials/essentials/script-features.html"));
    fs.writeFileSync(path.join(directory, "layouts/index.html"), '{{ $result := slice }}{{ range hugo.Data.fixtures }}{{ $result = $result | append (partial "essentials/script-features.html" (dict "Content" .html "Params" (dict "script_features" .explicit))) }}{{ end }}{{ $result | jsonify | safeHTML }}');
    const fixtures = [
      { html: '<a class="photo glightbox extra">', explicit: [] },
      { html: "<div class='swiper\ngallery-slider'>", explicit: [] },
      { html: '<a class=glightbox>', explicit: [] },
      { html: '<div data-class="gallery glightbox"><pre>&lt;a class="glightbox"&gt;</pre>', explicit: [] },
      { html: '<div class="gallery"><img></div><lite-youtube videoid="abc">', explicit: [] },
      { html: '', explicit: ['swiper', 'lightbox', 'gallery', 'youtube'] },
    ];
    fs.writeFileSync(path.join(directory, "data/fixtures.json"), JSON.stringify(fixtures));
    execFileSync(process.env.HUGO_BIN || "hugo", ["--source", directory, "--quiet"], { stdio: "pipe" });
    const result = JSON.parse(fs.readFileSync(path.join(directory, "public/index.html"), "utf8"));
    const flags = (swiper, lightbox, gallery, youtube) => ({ swiper, lightbox, gallery, youtube });
    assert.deepEqual(result, [
      flags(false, true, false, false),
      flags(true, false, true, false),
      flags(false, true, false, false),
      flags(false, false, false, false),
      flags(false, false, true, true),
      flags(true, true, true, true),
    ]);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
