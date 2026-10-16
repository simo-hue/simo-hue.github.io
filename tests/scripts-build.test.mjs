import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const output = path.resolve(process.env.SCRIPT_BUILD_DIR || "public");
function pages(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const location = path.join(directory, entry.name);
    return entry.isDirectory() ? pages(location) : entry.name.endsWith(".html") ? [location] : [];
  });
}

test("each generated page loads optional libraries only for its rendered widgets", () => {
  let count = 0;
  const coreUrls = new Set();
  for (const file of pages(output)) {
    const html = fs.readFileSync(file, "utf8");
    if (/http-equiv=["']?refresh/i.test(html)) continue;
    const classes = [...html.matchAll(/\sclass\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)]
      .flatMap((match) => (match[1] || match[2] || match[3]).split(/\s+/));
    const tags = [...html.matchAll(/<script\b[^>]*\bsrc=(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>/g)]
      .map((match) => match[1] || match[2] || match[3]);
    const feature = tags.find((src) => src.includes("/js/script-features-"));
    const swiper = classes.includes("gallery-slider") || classes.includes("testimonial-slider");
    const lightbox = classes.includes("glightbox");
    assert.equal(Boolean(feature), swiper || lightbox, file);
    if (feature) assert.ok(feature.includes(`script-features-${swiper}-${lightbox}.`), file);
    const lazy = tags.find((src) => src.includes("/js/script-lazy-"));
    const gallery = classes.includes("gallery") || classes.includes("gallery-slider");
    const youtube = /<lite-youtube[\s>]/.test(html);
    assert.ok(lazy?.includes(`script-lazy-${gallery}-${youtube}.`), file);
    const core = tags.find((src) => /\/js\/script\./.test(src));
    assert.ok(core, file);
    coreUrls.add(core);
    if (feature) assert.ok(tags.indexOf(feature) < tags.indexOf(core), file);
    assert.ok(tags.indexOf(core) < tags.indexOf(lazy), file);
    count++;
  }
  assert.ok(count > 300, "audit must inspect the complete production site");
  assert.equal(coreUrls.size, 1, "navigation and Spotlight should remain one shared cached bundle");
});
