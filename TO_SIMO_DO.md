- evitare doppioni delle call che si sovrappongono
- provare ad implementare metodo immediato- Salva l'immagine che hai allegato in chat nel percorso: `static/images/profile_connect.png` per renderla visibile nella pagina Linktree.

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

## SEO-14 + SEO-25 batch (2026-06-30) — branch `seo-meta-profilepage`

### Deploy
```
git checkout master && git merge seo-meta-profilepage && git push
```

### Manual test after deploy
1. View-source `https://simo-hue.github.io/` → `<meta name="description">` is the new 148-char text (no longer 297; no SERP truncation).
2. View-source `https://simo-hue.github.io/about/` → description is the new 155-char text (NOT "this is meta description").
3. Google Rich Results Test on `/about/` → detects **ProfilePage** with `mainEntity` Person `@id = …/#person`, no errors. Homepage still shows WebSite + Person + FAQ.
4. (Optional) Request re-indexing of `/about/` in Search Console so the old placeholder snippet is replaced faster.

### ⚠️ Follow-up — bio now inconsistent with the new descriptions (needs your decision)
The new descriptions say "CS graduate, EIT Digital Master's student (ELTE → KTH)", but these still say current Verona undergrad / omit the master's:
- ✅ DONE (2026-06-30) — `data/about.yml` → `education`: added "AUSIR EIT Digital Master School" (ELTE and KTH) above the Bachelor's; dropped the graduated Bachelor's `active: true`.
- ⏳ `content/english/_index.md` → "University Life" feature: "Computer Science student at University of Verona…".
- `layouts/partials/seo/schema-person.html` → `jobTitle` "Computer Science Student & AI Researcher"; `worksFor` University of Verona; `hasCredential.educationalLevel` "Undergraduate". (`alumniOf` Verona is now correct.)
Out of scope for SEO-14/25. Say the word and I'll do a follow-up batch to make these consistent.
- (Optional) Add a `lastmod:` to `/about` front matter if you want the ProfilePage to carry a `dateModified`.

---

## SEO-20 DONE (2026-06-30) — removed dead deploy configs (on master)
Deleted (GitHub Pages ignores them; all pinned the stale Hugo 0.147.3 while the real deploy `.github/workflows/hugo.yml` uses 0.163.3): `netlify.toml`, `vercel.json`, `vercel-build.sh`, `amplify.yml`, `.gitlab-ci.yml`, root `_redirects`, `static/_headers`.

### ⚠️ Security headers are NOT active on GitHub Pages (only HSTS is sent)
`static/_headers` is gone but its intended policy is preserved below. To actually serve these, put the site behind **Cloudflare** (free, via Transform Rules) OR deliver a partial CSP via a `<meta http-equiv>` tag (test GTM/inline scripts first). Intended headers:

    X-Frame-Options: SAMEORIGIN
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: interest-cohort=()
    Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;

Plus long-cache immutable for `/images/*`, `/css/*`, `/js/*`, `/fonts/*`, `*.webp` (max-age=31536000) — GitHub Pages forces max-age=600 and can't override without a CDN.
