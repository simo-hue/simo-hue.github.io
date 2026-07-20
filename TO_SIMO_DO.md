- [ ] evitare doppioni delle call che si sovrappongono

- [ ] provare ad implementare metodo immediato- Salva l'immagine che hai allegato in chat nel percorso: `static/images/profile_connect.png` per renderla visibile nella pagina Linktree.

- [~] /grill-me — UI redesign. Design system agreed + ALL phases (P0–P3) built on branch `new-UI` and verified (prod build clean). Awaiting your review before merge. See `DESIGN_SYSTEM.md` and the "UI v2 redesign" section below.

---

## UI v2 redesign — Manual actions (2026-07-13)
All work is on the **`new-UI`** branch. Nothing is live: GitHub Pages only deploys on push to `master`.

1. **Preview it locally:** `hugo server` (or `npm run dev`), then open http://localhost:1313 — it opens in dark mode (new default). Toggle light mode with the sun/moon switch. Try ⌘K (search), resize to mobile for the nav sheet.
2. **Review & approve direction** before I build the remaining phases (P1 blog · P2 about/passions/links · P3 globe/call/connect/search/404). Tell me any tweaks (accent shade, headline copy, spacing).
3. **Decide the merge** when the whole redesign is approved: merging `new-UI` → `master` will deploy the new UI live. Do NOT merge mid-way (visitors would see a half-migrated site).
4. **Confirm the nav curation:** the top bar now shows 4 primary items (About · Blog · Passions · Globe). Links, Globe, Call, Tech, Connect are reachable via ⌘K search + the mobile menu + footer. Say if you want a different primary set.
5. **Note — `theme_default` changed to `dark`** in `config/_default/params.toml`. Change back to `system` if you'd rather respect the visitor's OS setting on first load.
6. (Bonus) This partially closes SEO audit item #12: Geist fonts are now WOFF2, self-hosted, and preloaded (Heebo/Signika no longer used by the new UI).

---

## SEO AUDIT — Manual actions (2026-06-30)
Full audit run on https://simo-hue.github.io. Health Score: 64/100. Fix top-down.
 
### P0 — Critical (this week)
1. **Fix malformed JSON-LD (double-encoding).** In `layouts/partials/seo/schema-website.html`, `schema-person.html`, `schema-breadcrumb.html`, every `{{ X | jsonify }}` renders as `"\"value\""` in production (arrays render as strings). Rebuild each schema as a Hugo `dict` and `jsonify` the WHOLE object once. Verify the output of `hugo --gc --minify` locally, then run each URL through Google Rich Results Test + schema.org validator.
2. **Add `BlogPosting` to posts.** `layouts/partials/essentials/head.html:33` uses `partialCached "seo/schema-blog.html" . .Section` → caches the empty `/blog/` list render and reuses it on every post → posts have NO article schema. Change to plain `{{ partial "seo/schema-blog.html" . }}`.
3. **Stop home-only schema leaking sitewide.** Same file, lines 31–32 and 79: change `partialCached` → `partial` for `schema-website`, `schema-person`, `schema-faq` so the `if .IsHome` guard works per page.
4. **Fix `og:image` 404.** `og-image.png` lives in `assets/images/` but is referenced as `/images/og-image.png`. Put a 1200×630 copy at `static/images/og-image.png` (and re-save it as optimized WebP/PNG ≤200 KB).

### P1 — High (this month)
5. **Fix homepage LCP (9.0s).** The hero uses `favicon.png` (230 KB). Replace with a resized WebP (≤40 KB) and add `<link rel="preload" as="image">`. Compress the article hero `home.webp` (609 KB → target <120 KB).
6. **Translate the homepage FAQ to English** (`schema-faq.html` is all Italian on an en-US page). Note: Google retired FAQ rich results May 2026 — keep it only for AI/LLM citation value.
7. **Fix the 4 thin Italian + ~10 stub posts** (e.g. `GDG AI Hackathon` = 1 word, `TalTech`/`ELTE`/`KTH` = 5–9 words, 3 book stubs = 4 words). Either expand to 150+ words or set `noindex` / `draft` in front matter so they leave the index.
8. **Reduce taxonomy bloat.** 250 indexable tag pages vs 69 posts. Add `noindex` to thin tag pages (or all `/tags/`), keep `/categories/`.
9. **Remove/replace the `john-doe` author page** (`content/english/Author/john-doe.md`) — it's an indexed theme leftover with the slug `john-doe`.

### P2 — Medium
10. **Shorten homepage meta description** (297 → ~155 chars; in `config/_default/params.toml` `[metadata].description`). Add a real description to `/about/` (currently 24 chars).
11. **Fix `SearchAction`**: it points to `/search/` which 404s (search is a JS overlay). Either remove the `potentialAction` or render a `/search/` page.
12. **Convert TTF fonts → WOFF2** and `preload` Signika + Heebo; set long-cache headers if you front GitHub Pages with Cloudflare (GitHub Pages forces `max-age=600` and ignores your `static/_headers`/`netlify.toml`/`vercel.json`).
13. **Add `/llms.txt`** (the repo `AI.md` is a CLAUDE.md dev doc, not an llms.txt).

### Round 2 — deeper source-code findings (added to SEO_AUDIT/README.md as SEO-21…SEO-31)
- **SEO-21 (P1):** `layouts/blog/single.html:68` passes wrong params to the image partial (`"Loading" "eager"` + no `Context`) → article hero is unprocessed (609 KB raw) **and** `loading="lazy"` → hurts article LCP. Use `"Context" . … "Priority" true`.
- **SEO-22 (P1):** 3 images broken (`og-image.png`, `simo.png`, `simo_lovable.png`) — all in `assets/images/` but referenced as literal `/images/…` URLs → 404.
- **SEO-23 (P1):** `layouts/sitemap.xml` does NOT exclude `noindex` pages → must fix together with the thin-post/tag de-indexing (SEO-11/12).
- **SEO-24 (P1):** 0/66 posts have a visible author byline (E-E-A-T/GEO) — default it to the site author, linked to `/about`.
- **SEO-25–28 (P2):** GEO — Person `@id` consolidation + `ProfilePage` on `/about`; related posts; RSS `<link rel=alternate>` in head; richer schema types.
- **SEO-29–31 (P3):** logo `alt="Hugoplate"` (`logo_text`) + `theme-name` meta; malformed `<time datetime>` + missing `og:locale`; PWA manifest icon polish.

### Notes
- Live == HEAD (deploy via `.github/workflows/hugo.yml`); no stale-deploy gap.
- `static/_headers`, `_redirects`, `netlify.toml`, `vercel.json`, `amplify.yml` are IGNORED on GitHub Pages — your CSP/security headers are NOT active.
---

## Blog IA restructure — Manual actions (2026-07-13)
Done on branch `new-UI` (nothing live until merged to `master`). The blog is now driven by **Hugo sections** (`/blog/experiences|tech-projects|thoughts|books|publications/`); the `categories` taxonomy is gone and all old URLs redirect. A few things need YOUR judgment (content, not code):

1. **Preview it:** `hugo server` → open http://localhost:1313/blog/ — check the chip row (All + 5 sections), open a section page (was a 404 before), and confirm the "Blog" nav dropdown lists the 5 sections with **no more "Tech" top-level and no duplicate "Projects"**.
2. **`Simo's Diary` is now `draft: true`** (`content/english/blog/thoughts/simo's Diary/index.md`) because the body is an unfinished stub ("…da completare"). Decide: (a) finish it and remove `draft`, or (b) surface it (with `Mountain Fauna Lover`) on the **Content-Creation passion** page and leave it out of the blog feed. It's a YouTube/IG promo, so (b) may fit better.
3. **`Mountain Fauna Lover`** was folded into **Experiences** as a pragmatic reversible home. It's really content-creation — say if you'd rather I link it from `/passion/content-creation/` and pull it from the blog.
4. **`GDG AI Hackathon` still has `description: "aaa"`** and a ~1-word body (it's one of the SEO-audit thin posts). Write a real description + a few paragraphs, or set `draft: true` until you do.
5. **Two old, ambiguous URLs could NOT be redirected 1:1** because they were slug collisions (each was silently overwriting another post): `/blog/experience/budapest-collegio-don-mazza/` now resolves to **Budapest Trip** (GDG moved to `/blog/experiences/gdg-ai-hackathon/` with no legacy alias); `/blog/thought/trap/` now resolves to **social traps** (Impostor Syndrome moved to `/blog/thoughts/impostor-syndrome/`). If GDG or Impostor had any inbound links, they won't forward — minor.
6. **After merging to `master`:** resubmit `sitemap.xml` in Google Search Console and expect the old `/categories/*` and singular-folder URLs to show as redirects. The `aliases` are meta-refresh stubs (fine for GitHub Pages, which has no server redirects).
7. **Italian translations preserved** in `unused_content/blog-it-translations/` (`degree`, `live-the-dream`, `the-star-counter`). If you re-enable Italian later, re-add them inside their bundles as `index.it.md` (the old `it.md` name never worked).
8. **Supersedes SEO-audit item #8** ("keep /categories/"): `/categories/` is intentionally retired now; the section pages + tags carry grouping. Thin-post items (#7) still stand.

---

## Production-readiness audit — remaining YOUR-judgment items (2026-07-13)
All code/link/UI bugs found in the audit are already fixed on branch `new-UI` (see DOCUMENTATION.md). These last items are **content decisions**, not bugs — nothing blocks shipping, but they'd raise polish:

1. **Thin "coming soon" stubs publish with `draft: false`.** Several posts are placeholders with ~1 sentence of body: `experiences/{ELTE, KTH, TalTech, GDG AI Hackathon}` ("Future article about…") and `tech-projects/{Evolve, Ping Pong Counter, Warranties Vault}` ("The complete article will be written here"). They render fine (no broken images anymore) but are visibly empty. **Decide per post:** write real content, or set `draft: true` until you do. (Thin content is also an SEO drag — ties into SEO-audit thin-post items.)
2. **Missing cover images.** I removed the broken `image:` refs from the 4 tech/experience stubs above, so their cards now show as text-only (clean, but less eye-catching than image cards). When you have screenshots/photos, drop a `home.webp`/`cover.webp` into each post's bundle and re-add `image:` — the card + hero will pick it up automatically.
3. **`CLab UNIRv` title** (`experiences/CLAB Univr/index.md`) reads "UNIRv" — looks like a typo for "UNIVr" (Univ. Verona). Left as-is (your branding call); fix the `title:` if unintended.
4. **CLAB study-materials zip** is now generated & committed (15 MB). If you'd rather not ship 15 MB in the repo, tell me and I'll instead remove the download line or host the archive externally (Drive/Releases) and link out.
5. **Optional dead-code cleanup (harmless):** the retired `categories` taxonomy still has orphan references — `layouts/_default/terms.html` (a `/categories/` block that never matches), `partials/widgets/{blog,tech}-categories.html` (guarded, not included anywhere). Safe to leave; say the word to prune.
6. **External project sites** `simo-hue.github.io/CampFlow/` and `/mattioli.OS/` are linked from project cards and are currently live (HTTP 200). They're separate repos — just keep them deployed so those links don't 404.
