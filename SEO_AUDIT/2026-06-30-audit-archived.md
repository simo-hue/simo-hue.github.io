# SEO Audit & Remediation Plan — simo-hue.github.io

> **Generated:** 2026-06-30 · **Site:** Personal portfolio & blog (Hugo `0.144.0` + `hugoplate`, GitHub Pages)
> **Current SEO Health Score:** **64 / 100**
> **Purpose:** This is an execution-ready task list for a coding agent. Work **top-down** (P0 → P3). Each task is self-contained: it states the file(s), the root cause, the exact **before/after** code, and how to **verify**. Check the box when a task is done *and verified*.

---

## How to use this document

- **Order matters.** P0 tasks unblock the biggest wins (structured data + social previews). Do them first.
- Every code block marked **BEFORE** is the *current* content; **AFTER** is the replacement. Match whitespace; Hugo templates are whitespace-sensitive (`{{- -}}` trims).
- After each task, run the **Verify** step. Do not mark a task complete on an unverified edit.
- A **global verification** pass (build + validate all schema + re-run Lighthouse) is at the bottom. Run it once all P0/P1 are done.
- The live site `== HEAD` of `master` (deploy is automatic via `.github/workflows/hugo.yml`). There is **no** stale-deploy gap; what you fix in source is what ships.

### Project facts the agent needs
- **Content language:** English only (`en-us`). `it`, `fr`, `es` are disabled in `hugo.toml`.
- **Main section:** `blog` only (`config/_default/params.toml` → `mainSections = ["blog"]`).
- **Build command (production, mirrors CI):**
  ```bash
  npm ci
  hugo --gc --minify --baseURL "https://simo-hue.github.io/"
  ```
  Output goes to `./public`. **You must build with `--minify`** to reproduce/validate the structured-data bugs — they only manifest in the minified production output.
- **Local preview:** `npm run dev` (or `hugo server`).
- **Schema validation:** after building, paste the rendered `<script type="application/ld+json">` blocks into:
  - Google Rich Results Test → https://search.google.com/test/rich-results
  - Schema.org validator → https://validator.schema.org/

### Progress tracker

| ID | Severity | Task | Done |
|----|----------|------|------|
| SEO-01 | 🔴 P0 | Fix double-encoded JSON-LD (WebSite) | ☐ |
| SEO-02 | 🔴 P0 | Fix double-encoded JSON-LD (Person) | ☐ |
| SEO-03 | 🔴 P0 | Fix double-encoded JSON-LD (Breadcrumb) | ☐ |
| SEO-04 | 🔴 P0 | Fix double-encoded JSON-LD (Video) | ☐ |
| SEO-05 | 🔴 P0 | Render `BlogPosting` on posts + fix encoding | ☐ |
| SEO-06 | 🔴 P0 | Stop `partialCached` schema leaking sitewide | ☐ |
| SEO-07 | 🔴 P0 | Fix `og:image` 404 (move to `static/`, 1200×630) | ☐ |
| SEO-08 | 🟠 P1 | Translate homepage FAQ to English | ☐ |
| SEO-09 | 🟠 P1 | Fix homepage LCP (fonts/render-blocking) | ☐ |
| SEO-10 | 🟠 P1 | Compress oversized images (4.3 MB profile, etc.) | ☐ |
| SEO-11 | 🟠 P1 | Fix/expand thin & stub posts | ☐ |
| SEO-12 | 🟠 P1 | Reduce tag-page index bloat | ☐ |
| SEO-13 | 🟠 P1 | Remove/replace `john-doe` author page | ☐ |
| SEO-14 | 🟡 P2 | Fix meta-description lengths | ☐ |
| SEO-15 | 🟡 P2 | Fix or remove broken `SearchAction` (`/search/`) | ☐ |
| SEO-16 | 🟡 P2 | Convert fonts to WOFF2 + preload | ☐ |
| SEO-17 | 🟡 P2 | Add `/llms.txt` | ☐ |
| SEO-18 | 🟡 P2 | Defer GTM / lazy-load FontAwesome | ☐ |
| SEO-19 | ⚪ P3 | Name consistency + empty `<h2>` + viewport | ☐ |
| SEO-20 | ⚪ P3 | Decide on dead deploy-config files | ☐ |
| SEO-21 | 🟠 P1 | Article hero: fix `Context`+`Priority` (LCP) | ☐ |
| SEO-22 | 🟠 P1 | Broken `/images/` refs (og-image, simo, simo_lovable) | ☐ |
| SEO-23 | 🟠 P1 | Sitemap must exclude `noindex` (blocks SEO-11/12) | ☐ |
| SEO-24 | 🟠 P1 | Add author byline + link (E-E-A-T/GEO) | ☐ |
| SEO-25 | 🟡 P2 | GEO: Person `@id` consolidation + `ProfilePage` | ☐ |
| SEO-26 | 🟡 P2 | Related posts / internal linking | ☐ |
| SEO-27 | 🟡 P2 | RSS `<link rel="alternate">` in head | ☐ |
| SEO-28 | 🟡 P2 | GEO: richer schema types (optional) | ☐ |
| SEO-29 | ⚪ P3 | Theme-demo leftovers (logo alt, theme-name) | ☐ |
| SEO-30 | ⚪ P3 | Malformed `<time datetime>` + `og:locale` | ☐ |
| SEO-31 | ⚪ P3 | PWA manifest icon/screenshot polish | ☐ |

> Tasks **SEO-21 → SEO-31** are the round-2 (source-code) findings — full detail in the **Addendum** section near the end.

---

## Background: the structured-data bug (read before SEO-01–05)

In production (`hugo --minify`), **every JSON-LD value produced by `{{ X | jsonify }}` is double-encoded** — the value is wrapped in literal quotes, and arrays/objects become JSON *strings*. Plain string literals in the same blocks render correctly. Verified on the live homepage:

```json
"name":"\"Simone Mattioli - Adventures in Technology \\u0026 Humanity\""   ← string wrapped in quotes
"url":"\"https://simo-hue.github.io/\""                                     ← double-quoted
"knowsAbout":"[\"Travel \\u0026 Volunteering\",\"Tech \\u0026 AI\"]"        ← whole ARRAY is a string
"sameAs":"[\"https://instagram.com/...\",\"https://github.com/...\"]"        ← social links unparseable
"image":"\"https://simo-hue.github.io//images/og-image.png\""               ← quotes + double slash
```

**Root cause / the fix pattern:** hand-writing JSON and interpolating per-value `jsonify` is fragile under the minify pipeline. The robust, idiomatic Hugo fix is to **build the whole schema as a `dict` and `jsonify` the entire object exactly once.** This is applied in SEO-01 through SEO-05.

> **Note on `&`:** Hugo's `jsonify` escapes `&`, `<`, `>` to `&`, `<`, `>`. **This is valid JSON, parsed correctly by Google, and *desirable*** inside `<script>` (prevents tag-breakout). Do **not** try to "fix" the `&` — only the wrapping-quotes/array-as-string problem is the bug.
> **Note on key order:** `jsonify` of a `dict` emits keys **alphabetically**. That is semantically irrelevant for JSON-LD — do not be alarmed that `@context` is no longer first.

---

## 🔴 SEO-01 — Fix WebSite JSON-LD (double-encoding)

**File:** `layouts/partials/seo/schema-website.html`
**Effort:** S

**BEFORE** (entire file):
```go-html-template
{{- /* Schema.org WebSite structured data */ -}}
{{- if .IsHome -}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": {{ .Site.Title | jsonify }},
  "url": {{ .Site.BaseURL | jsonify }},
  "description": {{ site.Params.metadata.description | jsonify }},
  "inLanguage": "en-US",
  "author": {
    "@type": "Person",
    "name": {{ site.Params.metadata.author | jsonify }}
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": {{ printf "%ssearch/?q={search_term_string}" .Site.BaseURL | jsonify }}
    },
    "query-input": "required name=search_term_string"
  }
}
</script>
{{- end -}}
```

**AFTER** (entire file):
```go-html-template
{{- /* Schema.org WebSite structured data */ -}}
{{- if .IsHome -}}
{{- $schema := dict
  "@context" "https://schema.org"
  "@type" "WebSite"
  "name" site.Title
  "url" site.BaseURL
  "description" site.Params.metadata.description
  "inLanguage" "en-US"
  "author" (dict "@type" "Person" "name" site.Params.metadata.author)
  "potentialAction" (dict
    "@type" "SearchAction"
    "target" (dict
      "@type" "EntryPoint"
      "urlTemplate" (printf "%ssearch/?q={search_term_string}" site.BaseURL))
    "query-input" "required name=search_term_string")
-}}
<script type="application/ld+json">
{{ $schema | jsonify }}
</script>
{{- end -}}
```

> The `potentialAction` points at `/search/`, which currently 404s — that's handled separately in **SEO-15**. Leaving it here is harmless for now.

**Verify:** `hugo --minify` → open `public/index.html` → the WebSite block's `"name"` must be `"Simone Mattioli - Adventures in Technology & Humanity"` (one set of quotes), **not** `"\"...\""`.

---

## 🔴 SEO-02 — Fix Person JSON-LD (double-encoding + double-slash image)

**File:** `layouts/partials/seo/schema-person.html`
**Effort:** M

This is the most complex schema. It also has a **double-slash bug** in `image` (`printf "%s%s" .Site.BaseURL ...` produces `https://...//images/...` because `BaseURL` ends in `/`). The fix uses `absURL`.

**AFTER** (entire file — replaces the whole file):
```go-html-template
{{- /* Schema.org Person structured data for homepage */ -}}
{{- if .IsHome -}}
{{- $social := slice -}}
{{- range site.Data.about.socials -}}
  {{- $social = $social | append .link -}}
{{- end -}}
{{- $knowsAbout := slice -}}
{{- range site.Data.about.passions -}}
  {{- $knowsAbout = $knowsAbout | append .name -}}
{{- end -}}
{{- $knowsAbout = $knowsAbout | append "Computer Science" | append "Artificial Intelligence" | append "Large Language Models" | append "High-Performance Computing" -}}
{{- $person := dict
  "@context" "https://schema.org"
  "@type" "Person"
  "name" site.Data.about.profile.name
  "alternateName" "Mattioli Simone"
  "givenName" "Simone"
  "familyName" "Mattioli"
  "url" site.BaseURL
  "image" (site.Params.metadata.image | absURL)
  "jobTitle" "Computer Science Student & AI Researcher"
  "description" (site.Data.about.vision.content | default site.Params.metadata.description)
  "address" (dict "@type" "PostalAddress" "addressLocality" "Verona" "addressRegion" "Veneto" "addressCountry" "IT")
  "nationality" (dict "@type" "Country" "name" "Italy")
  "knowsLanguage" (slice
    (dict "@type" "Language" "name" "Italian" "alternateName" "it")
    (dict "@type" "Language" "name" "English" "alternateName" "en"))
  "worksFor" (dict
    "@type" "EducationalOrganization"
    "name" "University of Verona"
    "department" (dict "@type" "Organization" "name" "Department of Computer Science")
    "address" (dict "@type" "PostalAddress" "addressLocality" "Verona" "addressCountry" "IT"))
  "alumniOf" (dict "@type" "EducationalOrganization" "name" "University of Verona" "department" "Computer Science")
  "hasCredential" (slice (dict
    "@type" "EducationalOccupationalCredential"
    "credentialCategory" "degree"
    "educationalLevel" "Undergraduate"
    "about" (dict
      "@type" "EducationalOccupationalProgram"
      "name" "Computer Science"
      "description" "Bachelor's degree in Computer Science with specialization in Artificial Intelligence")
    "recognizedBy" (dict "@type" "Organization" "name" "University of Verona")))
  "knowsAbout" $knowsAbout
  "sameAs" $social
  "mainEntityOfPage" (dict "@type" "WebPage" "@id" site.BaseURL)
-}}
<script type="application/ld+json">
{{ $person | jsonify }}
</script>
{{- end -}}
```

**Verify:** in `public/index.html` the Person block must show `"sameAs":["https://instagram.com/...","https://github.com/..."]` (a real **array**, not a quoted string) and `"image":"https://simo-hue.github.io/images/og-image.png"` (single slash, single quotes).

---

## 🔴 SEO-03 — Fix Breadcrumb JSON-LD (double-encoding)

**File:** `layouts/partials/seo/schema-breadcrumb.html`
**Effort:** S

**AFTER** (entire file):
```go-html-template
{{- /* Schema.org BreadcrumbList structured data */ -}}
{{- if not .IsHome -}}
{{- /* Build ancestor chain by walking up through .Parent */ -}}
{{- $ancestors := slice -}}
{{- $current := . -}}
{{- range seq 10 -}}
  {{- if $current.Parent -}}
    {{- $ancestors = $ancestors | append $current -}}
    {{- $current = $current.Parent -}}
  {{- end -}}
{{- end -}}
{{- /* Reverse to root-first order and prepend Home */ -}}
{{- $crumbs := slice (dict "name" "Home" "item" site.BaseURL) -}}
{{- range $ancestors | collections.Reverse -}}
  {{- $crumbs = $crumbs | append (dict "name" .Title "item" .Permalink) -}}
{{- end -}}
{{- $items := slice -}}
{{- range $i, $el := $crumbs -}}
  {{- $items = $items | append (dict "@type" "ListItem" "position" (add $i 1) "name" $el.name "item" $el.item) -}}
{{- end -}}
{{- $schema := dict "@context" "https://schema.org" "@type" "BreadcrumbList" "itemListElement" $items -}}
<script type="application/ld+json">
{{ $schema | jsonify }}
</script>
{{- end -}}
```

**Verify:** on `public/blog/tech-project/deepsafe/index.html`, breadcrumb `"name"` values are plain strings (`"DeepSafe"`, not `"\"DeepSafe\""`).

---

## 🔴 SEO-04 — Fix Video JSON-LD (double-encoding)

**File:** `layouts/partials/seo/schema-video.html`
**Effort:** S
The YouTube-ID extraction logic is correct; only the JSON output needs the dict pattern.

**AFTER** (entire file):
```go-html-template
{{- /* Schema.org VideoObject structured data for pages with YouTube embeds */ -}}
{{- $content := .RawContent -}}
{{- $youtubeRegex := `\{\{<\s*youtube\s+([a-zA-Z0-9_-]+)\s*>}}` -}}
{{- $match := findRE $youtubeRegex $content 1 -}}
{{- if $match -}}
  {{- $fullMatch := index $match 0 -}}
  {{- $videoId := replaceRE `\{\{<\s*youtube\s+` "" $fullMatch -}}
  {{- $videoId = replaceRE `\s*>}}` "" $videoId -}}
  {{- $videoId = trim $videoId " " -}}
  {{- if $videoId -}}
    {{- $desc := or .Description .Summary | plainify | truncate 200 -}}
    {{- $schema := dict
      "@context" "https://schema.org"
      "@type" "VideoObject"
      "name" .Title
      "description" $desc
      "thumbnailUrl" (printf "https://img.youtube.com/vi/%s/maxresdefault.jpg" $videoId)
      "uploadDate" (.Date.Format "2006-01-02")
      "contentUrl" (printf "https://www.youtube.com/watch?v=%s" $videoId)
      "embedUrl" (printf "https://www.youtube.com/embed/%s" $videoId)
    -}}
<script type="application/ld+json">
{{ $schema | jsonify }}
</script>
  {{- end -}}
{{- end -}}
```

**Verify:** find a post with a `{{</* youtube ID */>}}` shortcode (there are ~12 in the sitemap's video entries) and confirm its VideoObject `"contentUrl"` is a clean URL string.

---

## 🔴 SEO-05 — Render `BlogPosting` on blog posts (currently missing) + fix encoding

**Files:** `layouts/partials/seo/schema-blog.html` **and** `layouts/partials/essentials/head.html`
**Effort:** M

**Problem (two bugs):**
1. **It never renders.** `head.html:33` calls `partialCached "seo/schema-blog.html" . .Section`. The `/blog/` *list* page (where `.IsPage` is false → empty output) gets cached under the `blog` section key and reused for **every** post → no post has `BlogPosting`. Fix is the `partial` change in **SEO-06**.
2. **It's double-encoded.** Same `jsonify`-per-value issue. Fix the template below.

**`schema-blog.html` AFTER** (entire file):
```go-html-template
{{- /* Schema.org BlogPosting structured data for blog posts */ -}}
{{- if and .IsPage (in site.Params.mainSections .Section) -}}
{{- $desc := "" -}}
{{- with .Description -}}
  {{- $desc = . -}}
{{- else -}}
  {{- $desc = .Summary | plainify | truncate 160 -}}
{{- end -}}
{{- $author := site.Params.metadata.author -}}
{{- with .Params.author -}}
  {{- $author = . -}}
{{- end -}}
{{- $schema := dict
  "@context" "https://schema.org"
  "@type" "BlogPosting"
  "headline" .Title
  "description" $desc
  "author" (dict "@type" "Person" "name" $author)
  "datePublished" (.Date.Format "2006-01-02T15:04:05-07:00")
  "dateModified" (.Lastmod.Format "2006-01-02T15:04:05-07:00")
  "publisher" (dict "@type" "Person" "name" site.Params.metadata.author "url" site.BaseURL)
  "mainEntityOfPage" (dict "@type" "WebPage" "@id" .Permalink)
  "wordCount" .WordCount
  "inLanguage" "en-US"
-}}
{{- with .Params.image -}}
  {{- $schema = merge $schema (dict "image" (dict "@type" "ImageObject" "url" (. | absURL))) -}}
{{- end -}}
{{- with .Params.categories -}}
  {{- $schema = merge $schema (dict "articleSection" (index . 0)) -}}
{{- end -}}
{{- with .Params.tags -}}
  {{- $schema = merge $schema (dict "keywords" (delimit . ", ")) -}}
{{- end -}}
<script type="application/ld+json">
{{ $schema | jsonify }}
</script>
{{- end -}}
```

The `head.html` half of this fix is in **SEO-06** (change `partialCached … .Section` → `partial`).

**Verify:** after SEO-06, `public/blog/tech-project/deepsafe/index.html` must contain a `BlogPosting` block whose `"headline"` is `"DeepSafe"` and `"wordCount"` matches that post (not some other post's data).

---

## 🔴 SEO-06 — Stop home-only schema leaking onto every page

**File:** `layouts/partials/essentials/head.html`
**Effort:** S

`partialCached` caches a partial's output across pages keyed only by the variant args. With no per-page variant, the homepage's `WebSite`/`Person`/`FAQPage` output is cached and re-emitted on **all 343 URLs**; and `schema-blog` keyed on `.Section` breaks as described in SEO-05. The schemas already guard themselves with `if .IsHome` / `if .IsPage`, so plain `partial` is correct and the perf cost is negligible.

**Lines 30–35 — BEFORE:**
```go-html-template
<!-- Schema.org Structured Data for SEO & LLMs -->
{{ partialCached "seo/schema-website.html" . }}
{{ partialCached "seo/schema-person.html" . }}
{{ partialCached "seo/schema-blog.html" . .Section }}
{{ partial "seo/schema-breadcrumb.html" . }}
{{ partial "seo/schema-video.html" . }}
```
**Lines 30–35 — AFTER:**
```go-html-template
<!-- Schema.org Structured Data for SEO & LLMs -->
{{ partial "seo/schema-website.html" . }}
{{ partial "seo/schema-person.html" . }}
{{ partial "seo/schema-blog.html" . }}
{{ partial "seo/schema-breadcrumb.html" . }}
{{ partial "seo/schema-video.html" . }}
```

**Line 79 — BEFORE** (FAQ is jammed onto the Mermaid line with `partialCached`):
```go-html-template
{{ partial "mermaid/assets/js" . }}{{ partialCached "seo/schema-faq.html" . }}
```
**Line 79 — AFTER:**
```go-html-template
{{ partial "mermaid/assets/js" . }}
{{ partial "seo/schema-faq.html" . }}
```

**Verify:** build, then confirm `WebSite`, `Person`, and `FAQPage` appear **only** in `public/index.html` and are **absent** from `public/blog/tech-project/deepsafe/index.html`. `BreadcrumbList` + `BlogPosting` should now appear on the post.

---

## 🔴 SEO-07 — Fix `og:image` 404 (broken social previews sitewide)

**Files:** add `static/images/og-image.png`; optionally `layouts/partials/basic-seo.html`
**Effort:** S

> **See also SEO-22** — `og-image.png` is one of **three** images broken this way (`og-image.png`, `simo.png`, `simo_lovable.png` all live in `assets/images/` but are referenced as literal `/images/…` URLs). Fix them together.

**Problem:** `config/_default/params.toml` sets `[metadata].image = "/images/og-image.png"`, but the file lives in `assets/images/og-image.png` (Hugo Pipes) and is **never emitted to `/images/`** → `https://simo-hue.github.io/images/og-image.png` returns **HTTP 404**. The homepage OG/Twitter card and the Person `image` are broken. (Individual posts set their own `image:` and are unaffected.)

**Extra bug:** the existing file is **900×630… actually 900×600**, but `basic-seo.html` hardcodes `og:image:width=1200` / `og:image:height=630`. Produce a real **1200×630** asset so the declared dimensions are truthful.

**Fix (pick one):**

```bash
# Preferred: generate a correctly-sized 1200x630 OG image into static/
# Using ImageMagick:
magick assets/images/og-image.png -resize 1200x630^ -gravity center -extent 1200x630 -strip static/images/og-image.png

# …or with macOS sips (no crop control; pads/stretches to 1200x630):
# sips -z 630 1200 assets/images/og-image.png --out static/images/og-image.png
```

If you keep the existing 900×600 image instead, edit `layouts/partials/basic-seo.html` and change the two lines:
```html
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```
to `900` / `600` so they match. **Preferred path is the 1200×630 image.**

**Verify:** `curl -I https://simo-hue.github.io/images/og-image.png` returns `200` after deploy; locally confirm `public/images/og-image.png` exists. Then test with the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) / [Twitter Card Validator] or LinkedIn Post Inspector.

---

## 🟠 SEO-08 — Translate the homepage FAQ to English

**File:** `layouts/partials/seo/schema-faq.html`
**Effort:** S

The FAQ is **entirely in Italian** on an `en-us` page (language-mismatch signal). This block uses plain string literals (no `jsonify`), so it is **not** double-encoded — only the language needs fixing.

> **Important context:** Google **retired FAQ rich results for all sites on 2026-05-07.** This markup no longer produces a SERP feature. **Keep it anyway** — it remains valuable for AI/LLM citation (ChatGPT/Perplexity/AI Overviews). Do **not** delete it, and do **not** add new `FAQPage` expecting Google rich results.

**AFTER** (entire file):
```go-html-template
{{- /* Schema.org FAQPage for homepage (LLM/AI citation value; Google FAQ rich results retired 2026-05) */ -}}
{{- if .IsHome -}}
{{- $faq := dict
  "@context" "https://schema.org"
  "@type" "FAQPage"
  "mainEntity" (slice
    (dict "@type" "Question"
      "name" "Who is Simone Mattioli?"
      "acceptedAnswer" (dict "@type" "Answer"
        "text" "Simone Mattioli is a Computer Science student at the University of Verona, specializing in Artificial Intelligence and Large Language Models. He combines technical skills with international volunteering, travel, and content creation."))
    (dict "@type" "Question"
      "name" "What does Simone Mattioli do?"
      "acceptedAnswer" (dict "@type" "Answer"
        "text" "Simone studies Computer Science with a focus on AI and builds projects in machine learning and High-Performance Computing. On his blog he shares reflections on technology, travel experiences, and personal growth, documenting his academic journey and passions."))
    (dict "@type" "Question"
      "name" "Where does Simone Mattioli study?"
      "acceptedAnswer" (dict "@type" "Answer"
        "text" "Simone Mattioli studies at the University of Verona, Department of Computer Science, specializing in Artificial Intelligence and High-Performance Computing. The university is located in Verona, Italy.")))
-}}
<script type="application/ld+json">
{{ $faq | jsonify }}
</script>
{{- end -}}
```

**Verify:** `public/index.html` FAQ block is English and valid JSON.

---

## 🟠 SEO-09 — Fix homepage LCP (9.0s)

**Effort:** M · **Measured:** homepage LCP **9.0s** (mobile, Lighthouse 13), FCP 4.8s, CLS 0.001 ✅, TBT 0ms ✅, TTFB ~20ms ✅.

**Diagnosis:** The homepage hero has **no `<img>`** — it's CSS blobs + an animated SVG + a large gradient headline ("Mattioli Simone") rendered in the **Signika** display font. So the LCP element is **text gated behind render-blocking CSS + a late-loading web font**, not an image. (Lighthouse's "largest image" hint of `favicon.png` is a red herring here.)

**Actions (in order of impact):**
1. **Confirm the LCP element first:** run `npx lighthouse https://simo-hue.github.io/ --only-categories=performance --view` and read the "Largest Contentful Paint element". Optimize *that* element specifically.
2. **Preload + WOFF2 the display font** (see **SEO-16**). Signika (the headline font) is a 106 KB TTF with `font-display:swap` and **no preload** → the hero headline can't paint final text until it loads. Preloading + WOFF2 is the single biggest LCP lever here.
3. **Reduce render-blocking CSS:** the head loads `style.<hash>.css` (259 KB raw / 33 KB gzip) render-blocking. Consider inlining critical CSS for the hero or ensuring Tailwind purging is on (`hugo_stats.json` cachebuster is configured — verify unused utilities are purged in production).
4. **Lighten the animated SVG hero** (the yellow spiral) if it is the LCP/paint bottleneck — it has many vector elements; simplify or defer its animation until after first paint.
5. Re-measure; target LCP < 2.5s.

**Verify:** Lighthouse homepage LCP < 2.5s (good) or at least < 4s; PageSpeed Insights field/CrUX "good LCP" share trends up over the following weeks.

---

## 🟠 SEO-10 — Compress oversized images

**Effort:** M

Concrete offenders found in the repo / live:

| File | Size | Issue | Target |
|------|------|-------|--------|
| `static/images/simo_lovable.png` | **4.3 MB** | Profile image (`/about`, `data/about.yml`→`profile.image`); 4.3 MB PNG | Resize ≤ 800px, WebP, **< 100 KB** |
| `static/images/favicon.png` | 235 KB, 1024×1024 | Favicon **source** is fine at 1024, but don't serve it raw anywhere | Keep as source only; serve generated sizes |
| article `home.webp` (DeepSafe hero) | **609 KB** | Drives the article LCP (5.9s) | Re-encode WebP/AVIF **< 120 KB** |
| `static/images/avatar_calls.png` / `profile_connect.png` | 355 KB each | Heavy PNGs | WebP, < 80 KB |

Prefer routing display images through Hugo image processing (`.Resize`/`.Process`) so they're auto-sized and WebP'd, and always emit explicit `width`/`height` to protect CLS.

**Verify:** none of these exceed the targets; `npx lighthouse` "Properly size images" / "Efficiently encode images" audits pass; article LCP < 2.5s.

---

## 🟠 SEO-11 — Fix or de-index thin & stub posts

**Effort:** M · 15 posts are < 150 words; ~10 are near-empty stubs. They dilute quality/E-E-A-T signals and are all indexed.

**Worst offenders (expand to 150+ words, or set `draft: true` / `noindex`):**
```
1 word    content/english/blog/experience/GDG AI Hackathon/index.md
4 words   content/english/blog/books/Pensieri lenti pensieri veloci/index.md
4 words   content/english/blog/books/guadagna con la mente/index.md
4 words   content/english/blog/books/insegna al cuore a vedere/index.md
5 words   content/english/blog/experience/TalTech/index.md
6 words   content/english/blog/experience/ELTE/index.md
9 words   content/english/blog/experience/KTH/index.md
10 words  content/english/blog/tech-project/Warranties Vault/index.md
23 words  content/english/blog/tech-project/Ping Pong Counter/index.md
25 words  content/english/blog/tech-project/Evolve/index.md
```
For any post you choose **not** to expand now, add to its front matter:
```yaml
noindex: true   # honored by layouts/partials/basic-seo.html → <meta name="robots" content="noindex, nofollow">
```
(The `basic-seo.html` partial already supports `.Params.noindex`.)

**Also:** 4 posts are written in **Italian** on the `en-us` site (`experience/Sicily/index.md`, and the `it.md` variants under `thought/The Star Counter`, `thought/degree`, `thought/live the dream`). Either translate to English, or set `noindex`. The `*_it.md` / `it.md` files target the disabled `it` language — confirm they aren't producing orphan URLs (`hugo --printPathWarnings`).

> ⚠️ **Depends on SEO-23:** the custom sitemap does **not** currently exclude `noindex` pages, so de-indexed stubs will stay in `sitemap.xml` (mixed signal) until SEO-23 is applied. Do them together.

**Verify:** `hugo` build + check the sitemap no longer lists de-indexed stubs; or the posts now exceed 150 words.

---

## 🟠 SEO-12 — Reduce tag-page index bloat

**Effort:** S–M · **250 indexable `/tags/` pages vs 69 posts** (73% of the sitemap). Many tag pages list only 2–3 posts → thin taxonomy pages competing for crawl budget.

**Options (choose one):**
- **A (recommended): `noindex` thin tag pages.** Create `layouts/_default/terms.html` / `taxonomy.html` override (or set in the existing one) to emit `noindex` when the term has few entries, e.g.:
  ```go-html-template
  {{ if and (eq .Kind "term") (lt (len .Pages) 3) }}<meta name="robots" content="noindex, follow">{{ end }}
  ```
  Keep `/categories/` indexable (only 7, useful).
- **B: consolidate tags.** 256 distinct tags is high-cardinality; merge near-duplicates (e.g. `intelligence`/`AI`, `university`/`UniVR`) down to a curated set and let fewer, richer tag pages remain indexable.

> ⚠️ **Depends on SEO-23:** noindexed tag pages must also be removed from `sitemap.xml` (the template currently includes them). Apply SEO-23 in the same change.

**Verify:** rebuilt sitemap shows materially fewer indexable `/tags/` URLs; Search Console "Indexed, not submitted in sitemap" / crawl stats improve over time.

---

## 🟠 SEO-13 — Remove or replace the `john-doe` author page

**Files:** `content/english/Author/john-doe.md`, `content/english/Author/_index.md`
**Effort:** S

`https://simo-hue.github.io/author/john-doe/` is an indexed theme leftover (slug literally `john-doe`, ~70 words, in the sitemap). Either:
- **Rename/replace** with a real author at `content/english/Author/simone-mattioli.md` (set `title`, bio, `image`, socials), and update any author references; **or**
- **Remove** `john-doe.md` and add `noindex` to the author taxonomy if you don't want author archive pages.

**Verify:** `/author/john-doe/` returns 404 (or 301 to the real author) after deploy and is gone from the sitemap.

---

## 🟡 SEO-14 — Fix meta-description lengths

**Files:** `config/_default/params.toml`; per-page front matter
**Effort:** S

- **Homepage description is 297 chars** (truncates ~155–160 in SERPs). Trim `[metadata].description` to ~150–155 chars, front-loading the key phrase. Current value is keyword-rich but too long — tighten, don't gut.
- **`/about/` description is 24 chars** (effectively missing). Add a real `description:` to `content/english/about/_index.md` front matter (~140 chars).
- Spot-check other section index pages (`/passion/`, `/links/`, `/globe/`, `/call/`, `/connect/`) for missing/short descriptions.

**Verify:** rendered `<meta name="description">` on `/` and `/about/` is 140–160 chars and unique.

---

## 🟡 SEO-15 — Fix or remove the broken `SearchAction` target

**Effort:** S · The `WebSite` schema's `potentialAction` (SEO-01) points to `/search/?q=…`, but **`/search/` returns 404** — search is a JS overlay, not a page. A `SearchAction` pointing at a 404 is an invalid sitelinks-searchbox reference.

**Pick one:**
- **Remove** the `potentialAction` block from `schema-website.html` (simplest), **or**
- **Render a real `/search/` page.** Add `content/english/search.md` (with a layout that hosts the existing search UI) so `/search/?q=` resolves, then keep the `SearchAction`.

**Verify:** either the schema no longer references `/search/`, or `curl -I https://simo-hue.github.io/search/` returns 200.

---

## 🟡 SEO-16 — Convert fonts to WOFF2 + preload

**Files:** `static/fonts/*`, `layouts/partials/essentials/style.html` (or wherever `@font-face` is defined)
**Effort:** M · Fonts are self-hosted **TTF**: `Signika-Medium.ttf` (~106 KB transfer) and `Heebo-Regular.ttf` (~26 KB), `font-display:swap`, **no preload**.

1. Convert TTF → **WOFF2** (`woff2_compress`, or `fonttools`/`glyphhanger` for subsetting). Expected: Signika ~106 KB → ~50–60 KB.
2. Update `@font-face` `src` to load `.woff2` first (keep `.ttf` fallback if desired).
3. **Preload** the headline font (Signika — the LCP-critical one) and Heebo in `<head>`:
   ```html
   <link rel="preload" href="/fonts/Signika-Medium.woff2" as="font" type="font/woff2" crossorigin>
   <link rel="preload" href="/fonts/Heebo-Regular.woff2" as="font" type="font/woff2" crossorigin>
   ```
4. Consider subsetting to Latin to cut size further.

**Verify:** network panel shows `.woff2` served; Lighthouse "Ensure text remains visible during webfont load" passes; homepage LCP improves (ties into SEO-09).

---

## 🟡 SEO-17 — Add `/llms.txt`

**Files:** `static/llms.txt` (or generate via a template + output format)
**Effort:** S · No `/llms.txt` exists (`/llms.txt` → 404). The repo's `AI.md` is a **CLAUDE.md dev doc**, not an llms.txt — don't reuse it. Your robots.txt already welcomes AI crawlers; an `llms.txt` gives them a curated map.

Create `static/llms.txt`:
```markdown
# Simone Mattioli — Adventures in Technology & Humanity
> Personal portfolio & blog of Simone Mattioli, Computer Science student (University of Verona) specializing in AI, LLMs and HPC; international volunteer; mountain & outdoor enthusiast.

## Key pages
- [About](https://simo-hue.github.io/about/): bio, education, vision
- [Blog](https://simo-hue.github.io/blog/): projects, experiences, thoughts, book notes
- [Tech projects](https://simo-hue.github.io/blog/tech-project/): software & AI projects
- [Publications](https://simo-hue.github.io/blog/publication/): research (e.g. LLM tourism mobility predictor)
- [Links](https://simo-hue.github.io/links/): all social & contact links

## Contact
- GitHub: https://github.com/simo-hue
- LinkedIn: https://www.linkedin.com/in/simonemattioli2003/
```

**Verify:** `curl -I https://simo-hue.github.io/llms.txt` → 200 after deploy.

---

## 🟡 SEO-18 — Defer GTM / lazy-load FontAwesome

**Effort:** M · GTM + `gtag/js` ≈ **283 KB / 161 ms** main-thread; FontAwesome icon webfonts ≈ **271 KB**, loaded from `use.fontawesome.com`.

- Keep GTM but ensure it loads **async** (the snippet already should — verify it's not blocking). Move heavy tags inside GTM to fire on interaction/`window.load` where possible.
- FontAwesome icons aren't LCP-critical: self-host a **subset** of only the icons used, or lazy-load the icon CSS (`media="print" onload="this.media='all'"` trick, already used for `style-lazy.css`).

**Verify:** Lighthouse "Reduce unused JavaScript" / "Reduce the impact of third-party code" improve; TBT stays low.

---

## ⚪ SEO-19 — Polish: name consistency, empty heading, viewport

**Effort:** S
- **Name order:** the hero H1 renders "**Mattioli Simone**" while `<title>`, OG, and schema use "**Simone Mattioli**". Pick one canonical form (recommend "Simone Mattioli") in the hero template/`_index.md`.
- **Empty `<h2></h2>`** exists on the homepage — remove it or give it content (don't ship empty headings).
- **Viewport:** `maximum-scale=5` is acceptable, but for accessibility consider dropping `maximum-scale`/`user-scalable` restrictions so users can fully zoom.

---

## ⚪ SEO-20 — Decide on dead deploy-config files

**Effort:** S · The repo ships `static/_headers`, `_redirects`, `netlify.toml`, `vercel.json`, `amplify.yml` — **GitHub Pages ignores all of them.** Consequences:
- Your intended **security headers** (CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) are **not active** (only `HSTS` is sent by GitHub/Fastly).
- Content-hashed assets get `cache-control: max-age=600` (no long cache), which you can't override on GitHub Pages.

**Choose:**
- **A:** Accept the limitation, and **delete** the misleading multi-host config files (or move them to a `deploy-configs/` folder with a README noting they're inactive).
- **B:** Put the site behind **Cloudflare** (free) to inject security headers + long-cache immutable assets via Transform Rules / `_headers` equivalents. This also unlocks Brotli and edge caching.

> This is a decision task — surface it to the site owner rather than silently deleting files.

---

## 🔬 Addendum — deeper source-code findings (round 2)

> These were found by reading the **templates, data files, and front matter** — they are **not visible from a single rendered URL**. Several interact with the P0–P3 tasks above (cross-references noted). Re-verify these during implementation.

### 🟠 SEO-21 — Article hero image is unprocessed **and** lazy-loaded (wrong partial params) → article LCP

**File:** `layouts/blog/single.html` (line ~68) · **Effort:** S · **Impact:** article LCP (measured 5.9s)

The hero passes **two wrong/missing params** to the image partial:
1. `"Loading" "eager"` — but `layouts/partials/image.html` has **no `Loading` param**; it uses `Priority`. So the hint is ignored and the hero renders `loading="lazy"` (bad for the LCP element).
2. **No `Context`** — so `$context.Resources.GetMatch` can't find the post's bundled image; it falls through to the "external/missing" branch and emits the **raw, unprocessed** `<img src>` (no WebP, no responsive `srcset`, **no `width`/`height`**). This is why the DeepSafe hero ships as a 609 KB raw `home.webp`.

**BEFORE:**
```go-html-template
        {{ partial "image" (dict "Src" .Params.image "Alt" .Title "Class" "w-full" "Loading" "eager") }}
```
**AFTER:**
```go-html-template
        {{ partial "image" (dict "Src" .Params.image "Context" . "Alt" .Title "Class" "w-full" "Priority" true) }}
```

**Verify:** rebuilt article hero is `<img ... fetchpriority="high" srcset="… 480w, … 800w, … 1200w" width=… height=…>` (WebP, dimensions present, **not** `loading="lazy"`). Article LCP drops materially. (The same `image` partial is already called correctly with `"Priority"` in `layouts/partials/components/blog-card.html`.)

---

### 🟠 SEO-22 — Broken `/images/` references (generalizes SEO-07)

**Effort:** S · The `og:image` 404 (SEO-07) is **not the only one**. Audit of every `/images/*` literal reference vs what actually ships:

| Reference | Lives in | Served at `/images/…`? |
|---|---|---|
| `/images/avatar_calls.png` | `static/images/` | ✅ 200 |
| `/images/og-image.png` | `assets/images/` | ❌ **404** (og:image + Person schema) |
| `/images/simo.png` | `assets/images/` | ❌ **404** |
| `/images/simo_lovable.png` | `assets/images/` | ❌ **404** at the literal URL (the `/about` profile **does** render because `about/list.html` runs it through the `image` partial / Hugo Pipes, which resolves `assets/`; but any literal-URL use 404s) |

**Rule going forward:**
- Images referenced as **literal URLs** in meta tags / schema / `srcset` (OG images, social cards) **must** live in `static/images/` → handled for OG by **SEO-07**; do the same for `simo.png` if it's used in any meta/schema.
- Images consumed through the **`image` partial** can stay in `assets/images/` (Hugo Pipes processes them) — but **optimize the 4.3 MB `simo_lovable.png` source** (see SEO-10) since it's resized at build from a huge original.

**Verify:** `for f in og-image simo simo_lovable; do curl -s -o /dev/null -w "%{http_code} $f\n" https://simo-hue.github.io/images/$f.png; done` — none should be 404 if referenced as a literal URL anywhere.

---

### 🟠 SEO-23 — Custom sitemap does **not** exclude `noindex` pages (blocks SEO-11 & SEO-12)

**File:** `layouts/sitemap.xml` (line ~20) · **Effort:** S

The sitemap ranges all pages filtering only `.Draft` and `home`. So any page you `noindex` in **SEO-11** (thin posts) or **SEO-12** (thin tag pages) **stays in the sitemap** → a contradictory "noindex but submitted" signal. Fix the filter:

**BEFORE:**
```go-html-template
    {{- if and (not .Draft) (ne .Kind "home") .Permalink }}
```
**AFTER:**
```go-html-template
    {{- if and (not .Draft) (not .Params.noindex) (ne .Kind "home") .Permalink }}
```

> Also note: `<priority>` and `<changefreq>` in this sitemap are **ignored by Google** (kept is harmless — no action needed). The video-sitemap block is a nice touch and is fine.

**Verify:** after SEO-11/12, build and confirm `noindex` URLs are absent from `public/sitemap.xml`. **Do SEO-23 together with SEO-11 and SEO-12.**

---

### 🟠 SEO-24 — No author byline on any article (E-E-A-T / GEO authorship gap)

**File:** `layouts/blog/single.html` (lines ~46–51) · **Effort:** S

**0 of 66 posts** set an `author` front-matter field, and the byline is gated `{{ if .Params.author }}` → **no article ever shows an author**. For E-E-A-T and AI/LLM attribution, a visible, linked author is a core signal. Default it to the site author and link it.

**BEFORE:**
```go-html-template
        {{ if .Params.author }}
        <div class="flex items-center gap-2">
          <i class="far fa-user"></i>
          <span>{{ .Params.author }}</span>
        </div>
        {{ end }}
```
**AFTER:**
```go-html-template
        <div class="flex items-center gap-2">
          <i class="far fa-user"></i>
          <a href="/about/" rel="author">{{ .Params.author | default site.Params.metadata.author }}</a>
        </div>
```

**Verify:** every post shows "Simone Mattioli" as a linked byline; the visible author matches the `BlogPosting.author` in schema.

---

### 🟡 SEO-25 — GEO: consolidate the Person entity (`@id`) + `ProfilePage` on `/about`

**Effort:** M · **Why:** Google and LLMs build a stronger person/creator entity when every page references **one** Person via a stable `@id`, and when `/about` is explicitly a `ProfilePage`. Two related issues:

1. **After SEO-06, only the homepage has `Person`.** `/about` — the natural home of the person entity — will have none. Add a `Person` (wrapped in `ProfilePage`) to the about page.
2. **`BlogPosting.author` is a bare name**, not linked to the entity.

**Do:**
- In `schema-person.html`, add a stable id: `"@id" (printf "%s#person" site.BaseURL)` (alongside `url`).
- In `schema-blog.html` (SEO-05), set `"author" (dict "@id" (printf "%s#person" site.BaseURL))` and the same for `publisher`, so articles point at the one Person entity.
- Add a `ProfilePage` + `mainEntity` Person on `/about` (new `layouts/partials/seo/schema-profilepage.html`, gated to the about page), e.g.:
  ```go-html-template
  {{- if eq .RelPermalink "/about/" -}}
  {{- $schema := dict
    "@context" "https://schema.org" "@type" "ProfilePage"
    "dateModified" (.Lastmod.Format "2006-01-02T15:04:05-07:00")
    "mainEntity" (dict "@type" "Person" "@id" (printf "%s#person" site.BaseURL) "name" site.Data.about.profile.name)
  -}}
  <script type="application/ld+json">{{ $schema | jsonify }}</script>
  {{- end -}}
  ```

**Verify:** Rich Results Test on `/about/` shows `ProfilePage`; articles' `author`/`publisher` reference `…#person`.

---

### 🟡 SEO-26 — Add related posts / internal linking on articles

**File:** `layouts/blog/single.html` · **Effort:** S–M

The custom single template has **no related-posts section** (the theme even ships an i18n string `related_posts: "Related Posts"` that's unused). Related posts deepen internal linking, spread crawl equity to the thin/buried posts, and improve dwell time. Add a block using Hugo's `site.RegularPages.Related .` (configure a `[related]` block in `hugo.toml` keyed on `tags`/`categories`), rendering 3–4 `blog-card.html` items before the footer.

**Verify:** each post links to 3–4 related posts; orphan posts now receive inbound internal links.

---

### 🟡 SEO-27 — RSS feeds aren't discoverable (no `<link rel="alternate">`)

**Files:** `layouts/partials/basic-seo.html` (or a new head partial) · **Effort:** S

Feeds exist (`/index.xml`, per-section RSS) but **no `<link rel="alternate" type="application/rss+xml">`** is in `<head>`, so feed readers and some crawlers can't find them. Add:
```go-html-template
{{ with .OutputFormats.Get "RSS" -}}
<link rel="alternate" type="application/rss+xml" href="{{ .Permalink }}" title="{{ $.Site.Title }}">
{{- end }}
```

**Verify:** `<head>` on home + section pages contains the RSS alternate link; feed validators discover it.

---

### 🟡 SEO-28 — GEO (optional/advanced): richer schema types per content type

**Effort:** L · Currently every post is a generic `BlogPosting`. More specific types help AI engines classify and cite content. Optional, do post-by-post or via category mapping in `schema-blog.html`:

| Section / category | Better `@type` |
|---|---|
| `tech-project` | `SoftwareApplication` (or `CreativeWork`) + `applicationCategory` |
| `publication` | `ScholarlyArticle` / `Article` |
| `books` (reviews) | `Review` with `itemReviewed` = `Book` |
| `experience`, `thought` | keep `BlogPosting` |

**Verify:** Rich Results Test shows the specialized type with no errors. Mark done when at least `tech-project` and `publication` are mapped.

---

### ⚪ SEO-29 — Theme-demo leftovers (brand & a11y)

**Files:** `config/_default/params.toml`, `layouts/partials/essentials/head.html` · **Effort:** S
- `logo_text = "Hugoplate"` → the navbar logo renders **`alt="Hugoplate"`** on every page (via theme `partials/logo`). Change to `logo_text = "Simone Mattioli"` (and confirm the rendered logo `alt`).
- `head.html:12` ships `<meta name="theme-name" content="hugoplate" />` — unnecessary; remove it (don't advertise the theme).
- `params.toml` still contains the theme's placeholder `announcement.content` ("You must replace the **baseURL**…") — it's disabled (`enable = false`) but delete the demo text.

**Verify:** no "hugoplate"/"Hugoplate" strings in rendered `public/**/*.html` (`grep -ri hugoplate public | grep -v 'theme-name'`).

---

### ⚪ SEO-30 — Malformed `<time datetime>` + missing `og:locale`

**Files:** `layouts/blog/single.html` (line ~41), `layouts/partials/basic-seo.html` · **Effort:** S
- `datetime="{{ .PublishDate }}"` emits a Go time string (`2026-01-19 00:00:00 +0000 UTC`) — **not a valid `datetime` value**. Use `datetime="{{ .PublishDate.Format "2006-01-02" }}"`.
- Add `<meta property="og:locale" content="en_US">` to `basic-seo.html` for OG completeness. (`twitter:site`/`creator` are **N/A** — no X/Twitter account in `data/about.yml`; skip.)

---

### ⚪ SEO-31 — PWA manifest polish

**Effort:** S · The generated `manifest.webmanifest`:
- Uses the single **1024×1024 `favicon.png`** for both the `192×192` and `512×512` icons (browser downscales; not ideal). Provide correctly-sized 192/512 PNGs (and a properly-padded `maskable` icon).
- Lists `images/og-image.png` as its `screenshots` source — currently **404** (resolved once **SEO-07** ships the file to `static/images/`).

**Verify:** Lighthouse PWA / "Installable" audit passes; manifest icons + screenshot load (200).

---

### ✔️ Verified **not** a problem (don't waste time "fixing" these)

- **`layouts/partials/image.html`** is well-built: responsive WebP `srcset`, `width`/`height` (CLS-safe), and `Priority` (eager + `fetchpriority`) support. The bugs are in *callers* (SEO-21), not the partial.
- **No GA double-tracking** — Hugo's internal GA template is disabled; analytics flow only through GTM (`GTM-T3VMWGJP`).
- **`unused_content/` is a top-level folder** (not under `content/`) → Hugo ignores it; it does not build.
- **PDFs are not in the sitemap** (0 found); the 57 repo PDFs aren't a sitemap-bloat issue.
- **All 66 posts have `description`**, none are `draft`, none use `aliases`, all have `date`.
- **`/connect`'s custom `baseof.html` includes the SEO `<head>`** (meta + schema are present; it just omits nav/footer by design).
- **UI strings are English** (`i18n/en.yaml`); the 404 page is `noindex` + has nav/search.

---

## ✅ Global verification (run after P0 + P1)

```bash
# 1) Clean production build (must succeed with no template errors)
npm ci
hugo --gc --minify --baseURL "https://simo-hue.github.io/"

# 2) Validate every JSON-LD block parses as valid JSON (catches the encoding regressions)
python3 - <<'PY'
import glob, re, json, sys
bad = 0
for f in glob.glob("public/**/*.html", recursive=True):
    html = open(f, encoding="utf-8", errors="ignore").read()
    for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S):
        try:
            d = json.loads(b)
            # fail if any value is a quoted-string-wrapped scalar or an array-as-string
            def smell(v):
                return isinstance(v, str) and (v.startswith('"') or v.startswith('['))
            bads = [k for k, v in d.items() if smell(v)]
            if bads:
                print(f"[DOUBLE-ENCODED] {f}: {bads}"); bad += 1
        except Exception as e:
            print(f"[INVALID JSON] {f}: {e}"); bad += 1
print("RESULT:", "FAIL" if bad else "PASS — all JSON-LD valid & not double-encoded")
sys.exit(1 if bad else 0)
PY
```

Then manually:
- [ ] Homepage in Google **Rich Results Test** → `WebSite`, `Person`, `FAQPage` detected, no errors.
- [ ] A blog post in Rich Results Test → `BlogPosting` + `BreadcrumbList` detected with **that post's** data.
- [ ] `WebSite`/`Person`/`FAQPage` are **absent** from blog posts (no sitewide leak).
- [ ] `curl -I https://simo-hue.github.io/images/og-image.png` → 200; social card renders in FB/LinkedIn debuggers.
- [ ] `npx lighthouse` homepage + article: LCP < 2.5s, CLS < 0.1, no new regressions.
- [ ] Re-submit `sitemap.xml` in Google Search Console; watch "Enhancements" (Breadcrumbs, Merchant/Person) populate.

---

## Reference — measured baseline (2026-06-30)

| Metric | Homepage | Article (DeepSafe) |
|---|---|---|
| Lighthouse Perf (mobile) | 63 | 76 |
| **LCP** | **9.0s** 🔴 | 5.9s 🟠 |
| CLS | 0.001 🟢 | 0.098 🟢 |
| TBT | 0ms 🟢 | 70ms 🟢 |
| FCP | 4.8s 🔴 | 1.2s 🟢 |
| TTFB | ~20ms 🟢 | ~20ms 🟢 |
| Page weight | 1,201 KB | 1,805 KB |

| Category | Score | | Category | Score |
|---|---|---|---|---|
| Technical SEO | 72 | | Schema / Structured Data | **35** |
| Content / E-E-A-T | 68 | | Performance (CWV) | 62 |
| On-Page SEO | 70 | | AI Search Readiness | 62 |
| Images | 62 | | **Overall** | **64 / 100** |

**Tooling:** [Rich Results Test](https://search.google.com/test/rich-results) · [Schema validator](https://validator.schema.org/) · [PageSpeed Insights](https://pagespeed.web.dev/) · [Search Console](https://search.google.com/search-console)

*Most-severe-first. Re-run a full audit after P0+P1 land to refresh the score (expected: Schema 35 → ~85, Performance 62 → ~80, Overall 64 → ~80+).*
