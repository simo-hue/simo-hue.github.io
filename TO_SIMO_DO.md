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

---

# 🚨 2026-08-08 — Personal Entity / GEO Programme: MANUAL ACTIONS

> Full plan: [`SEO_AUDIT/README.md`](./SEO_AUDIT/README.md) · Evidence: [`SEO_AUDIT/2026-08-08-entity-audit-evidence.md`](./SEO_AUDIT/2026-08-08-entity-audit-evidence.md)
> Everything below needs **your login**. I cannot do any of it. Text is copy-paste ready.

## The one sentence everything must agree with

```
Italian CS engineer and AI researcher who ships. Co-author of a BDCC/MDPI paper on
LLMs for tourist-mobility prediction; EIT Digital Master's at KTH & ELTE; six iOS
apps on the App Store; founder-track, building toward his own company.
```

**You are SECOND author of four.** Never write anything implying sole authorship.

---

## 🔴 P0 — false facts about you, live right now

### 1. Google Scholar — a paper you did not write (~5 min)

Your profile lists **"An AI-driven framework for continuous tourist sentiment scoring using longitudinal and group-level insights with pre-trained language models (RoBERTa-CSS)"**, Tourism Review 81(1) 167-187 — bylined **T Yang, CHC Hsu**. Verified: you are not an author. It supplies **all 3 of your citations and your entire h-index of 1.** Your real metrics are 0/0/0.

1. Open <https://scholar.google.com/citations?user=uLGrDbIAAAAJ> (logged in)
2. Tick that paper → **Delete**
3. ⚙️ Settings → Article updates → **"Don't automatically update my profile"** (this is what added it)
4. Edit display name: `Mattioli Simone` → **`Simone Mattioli`**
5. Add affiliation + verified `@studenti.univr.it` email + photo

> Do this **before** I add Scholar to your `sameAs` — otherwise I make a false authorship claim machine-resolvable.

### 2. Semantic Scholar — fused with a stranger (~10 min + wait)

Author `2429558651` has `externalIds: {}` (no ORCID) and **2 papers** — the second *"Consumatori, fiducia e Bitcoin: uno studio comparativo Italia-Gran Bretagna"* (**2015**). You were about twelve. Semantic Scholar feeds many LLM retrieval corpora, so this is a live cause of the confusion we're fixing.

1. <https://www.semanticscholar.org/author/2429558651> → **Claim Author Page**
2. **Claim via ORCID** (this writes your ORCID into `externalIds`, which is what holds you apart from other Simone Mattiolis)
3. Remove paper `441da9d4b69188e86a5efa0e4b8f140f732074b1`
4. Fallback: <feedback@semanticscholar.org>

### 3. SciProfiles — it calls you "Dr." (~5 min + wait)

`"Dr. Simone Mattioli"` is the `schema.org Person.name` value, not just page decoration. Your highest qualification is a BSc (2025-10-17). **This is the most quotable wrong fact in your entire footprint and it is machine-readable.**

1. <https://sciprofiles.com/profile/Mattioli-simone> → Edit profile → remove the `Dr.` title
2. If the field isn't editable, email via <https://sciprofiles.com/contact> — lead with the false-doctorate correction
3. While there, add affiliation + this bio:

```
Computer Science engineer and AI researcher. BSc in Computer Science, University of
Verona (2025). Currently an EIT Digital Master's student (AUSIR) at ELTE and KTH Royal
Institute of Technology. Co-author of "Understanding and Predicting Tourist Behavior
Through Large Language Models" (Big Data and Cognitive Computing, 2026). Research
interests: large language models, spatio-temporal reasoning, human-mobility prediction,
high-performance computing. Also ships iOS applications on the App Store.
```

### 4. Vercel — Mountain Fauna Lover leaks `localhost:3000` (~5 min)

**76 occurrences** of `http://localhost:3000` on `/en` alone; zero of the real host. Canonical, hreflang, og:image, every schema `@id`, robots, all 18 sitemap URLs.

Vercel → `mountain-fauna-lover` → Settings → Environment Variables → **Production**:

```
NEXT_PUBLIC_SITE_URL = https://mountain-fauna-lover.vercel.app
```

(check the repo for the exact variable name — I'll wire the code side) → **Redeploy**.

### 5. LinkedIn — check your own headline (~5 min) ⚠️ UNVERIFIED

Two searches returned the result title **`"simone mattioli - TikTok | LinkedIn"`**. LinkedIn formats these as `Name - Company`, so Google may be indexing your employer as **TikTok** — probably a self-employed "TikTok" position. The page is bot-walled (HTTP 999); I could not read it.

1. Open your profile logged in. If a TikTok/creator position is set as current, retitle or reorder it.
2. Fix the all-lowercase name → **`Simone Mattioli`**
3. New headline:

```
AI Researcher & iOS Developer | EIT Digital Master's @ KTH & ELTE | CS @ University of Verona | Published on LLMs for Human Mobility
```

4. New About:

```
I build things that ship, and I research why they work.

I'm an Italian Computer Science engineer currently on the EIT Digital Master's
(AUSIR) at ELTE and KTH Royal Institute of Technology, after a BSc at the University
of Verona. I co-authored "Understanding and Predicting Tourist Behavior Through Large
Language Models" (Big Data and Cognitive Computing, MDPI, 2026), which uses LLMs to
interpret and predict tourist movement in Verona.

Alongside the research I ship production software: six iOS apps on the App Store,
including Evolve (habits and goals) and Wealth Compass (personal finance). I founded
DeepSafe, a cybersecurity-gamification startup — it didn't make it, and I learned more
from that than from anything that worked.

I care about real-world impact over credentials, and I'm building toward my own company.

Interests: large language models, spatio-temporal reasoning, high-performance
computing, iOS development, entrepreneurship.

Portfolio: https://simo-hue.github.io
ORCID: https://orcid.org/0009-0006-5047-8004
```

### 6. Publications page vs the DOI — reconcile (~5 min)

`/blog/publications/` lists the paper **dated Dec 15 2024 with no DOI**. The real record is **BDCC 10(4) 117, published 2026-04-11**. Are these the same artefact, or is the page describing an earlier preprint/thesis? **Tell me which** — this blocks the Wikidata item, because seeding it from a mismatched title creates a bad item that then propagates.

---

## 🟠 Phase 1 — identity surfaces

### 7. ORCID (~15 min) — your single strongest disambiguator

<https://orcid.org/my-orcid> — currently your given name is lowercase `simone`, bio empty, keywords just `LLM`/`AI`, and **KTH/ELTE are missing entirely**.

- **Names:** Given `simone` → **`Simone`**. Published name → **`Simone Mattioli`**
- **Biography:**

```
Computer Science engineer and AI researcher. BSc in Computer Science from the
University of Verona (2022-2025), currently an EIT Digital Master's student (AUSIR
programme) at ELTE and KTH Royal Institute of Technology. My research applies large
language models to spatio-temporal reasoning and human-mobility prediction; I
co-authored "Understanding and Predicting Tourist Behavior Through Large Language
Models" (Big Data and Cognitive Computing, 2026), which models tourist trajectories
in Verona from a 2014-2023 dataset. I also develop and publish iOS applications, and
work with high-performance computing (CINECA).
```

- **Keywords** (replace `LLM`, `AI`): `Large Language Models` · `Human Mobility Prediction` · `Spatio-Temporal Reasoning` · `Tourist Behavior Modeling` · `Next-POI Recommendation` · `High-Performance Computing` · `Natural Language Processing` · `iOS Development` · `Machine Learning` · `Trajectory Prediction`
- **Education:** fix `University of verona` → **`University of Verona`** *using the typeahead dropdown* (this attaches ROR `039bp8j42` — typing it manually does not). Add **ELTE** and **KTH Royal Institute of Technology** with the EIT Digital programme.
- **Employment:** the undated UniVR "student" entry either gets dates or gets deleted — it currently reads as employment.
- **Websites:** rename `Git-Hub` → `GitHub`; add SciProfiles, OpenAlex (`A5133501663`), Semantic Scholar
- Enable **Crossref auto-update**

### 8. GitHub profile (~10 min)

Name field currently `Mattioli Simone`. The competing `SimoneMattioli98` account has it as `Simone Mattioli` — you're losing the string match.

- Name → **`Simone Mattioli`**
- Bio:

```
AI researcher & iOS dev · EIT Digital MSc @ KTH & ELTE · CS @ UniVR · LLMs for human mobility (BDCC 2026) · 6 apps on the App Store
```

- Profile README: your name currently appears **only inside a badge image URL** — invisible as text. Add at the top:

```markdown
# Simone Mattioli

Italian CS engineer and AI researcher. EIT Digital Master's student at **KTH Royal
Institute of Technology** and **ELTE**; BSc in Computer Science, **University of Verona**.
Co-author of *"Understanding and Predicting Tourist Behavior Through Large Language
Models"* ([BDCC 2026](https://doi.org/10.3390/bdcc10040117)). I ship iOS apps and
build toward my own company.

🌐 [simo-hue.github.io](https://simo-hue.github.io) · 🎓 [ORCID](https://orcid.org/0009-0006-5047-8004) · 💼 [LinkedIn](https://www.linkedin.com/in/simonemattioli2003/)
```

> Note the institution names are load-bearing: they're what distinguishes you from the *other* Simone Mattioli in Italian CS (Bologna, computer vision).

### 9. Search Console + Bing Webmaster (~30 min) — nothing is measured today

GitHub Pages has no sitemap-ping, so direct submission is your **only** discovery lever for ~54 orphaned URLs. Bing's index feeds Microsoft Copilot.

1. <https://search.google.com/search-console> → add `simo-hue.github.io` (verify via your existing GA4 `G-5TJVJY8EZ2`)
2. Submit all 8 sitemaps (I'll list them once ENT-07 ships)
3. <https://www.bing.com/webmasters> → same, then **import from GSC**
4. Add `mountain-fauna-lover.vercel.app` and `deep-safe.github.io` as separate properties
5. Send me the Bing verification code for `config/_default/params.toml` (`bing = ""` is currently empty)

### 10. TikTok — confirm which account is yours (~2 min)

**Both** `@mountainfaunalove` and `@mountainfaunalover` are live accounts. Three of your own sources point at the **with-r** one; only your portfolio points at the without-r one — which is probably a stranger's. Log in, read your actual handle, tell me. A resolving wrong link is worse than a dead one: it asserts a false identity about someone else's account.

Also confirm you own `tiktok.com/@deepsafe` and the `github.com/deep-safe` account (it's a *User*, not an org, and nothing on it names you).

---

## 🟡 Phase 4 — social + store surfaces

### 11. App Store descriptions (~15 min)

**None of your four listings contains the string "Simone" or "Mattioli".** Apple also types you as an `Organization`, not a `Person`. The description is the only part you control. Append to each:

```
Made by Simone Mattioli — https://simo-hue.github.io/
```

Also fix **Warranties Vault**: the store name is plural but the description says "Warranty Vault" throughout.

### 12. YouTube — three channel Abouts (~15 min)

Grep across all your social surfaces found **zero** occurrences of `AI researcher`, `KTH`, `ELTE`, `EIT Digital`, `LLM`, `BDCC` or `founder`. An LLM crawling your socials concludes you're a mountain-wildlife vlogger.

**@simosDiary2003:**
```
Simone Mattioli — Italian CS engineer and AI researcher (EIT Digital Master's @ KTH & ELTE).
Personal vlogs about growth, travel and building things.
Portfolio → https://simo-hue.github.io
```

**@mountainfaunalover** — *highest leverage: 12K followers and the only channel with no structured data at all, so this text is its sole machine-readable signal:*
```
Mountain & Fauna Lover — alpine wildlife and nature storytelling.
Founded by Simone Mattioli, Italian CS engineer and AI researcher (EIT Digital Master's
@ KTH & ELTE). Portfolio → https://simo-hue.github.io
```

**@Deep-Safe:**
```
DeepSafe — learn digital security by playing.
Founded by Simone Mattioli, Italian CS engineer and AI researcher.
Portfolio → https://simo-hue.github.io
```

### 13. Instagram (~5 min)

- `@simo___one`: display name `Simone mattioli` → **`Simone Mattioli`**. ⚠️ **It has 0 posts and 1,052 followers.** An empty profile bearing your real name is a weak-to-negative signal — either post, or tell me to drop it from `sameAs`.
- `@mountainfaunalover`: display name is **`Magic Mountain`** but YouTube says `Mountain & Fauna Lover` — a third brand name for one persona. Pick one; I'd align to `Mountain & Fauna Lover`.

### 14. Interview video (~5 min)

`youtube.com/watch?v=U9V8CkewXEY` — `"Mattioli"` appears in **neither** the title nor the description, and the description contains **zero URLs**. Ask the channel owner to add your name + `https://simo-hue.github.io`. Fallback: pinned comment from `@SimosDiary2003`. I'll then embed it on your site with `VideoObject` schema so you own the citation.

### 15. Wikidata (~30 min, after item 6) 🆕

Nothing exists — no item for the paper, no item with your ORCID, no person named Simone Mattioli at all. Create an account, then **the article item first** (DOI `10.3390/bdcc10040117`, four authors, Migliorini corresponding), **then** your author item with `P496` ORCID, `P2037` GitHub, `P1960` Scholar, `P10283` OpenAlex, official website. I'll give you exact QuickStatements once item 6 is settled.

---

## What I need back from you

| # | Need | Blocks |
|---|------|--------|
| A | Is the Dec-2024 publications entry the same artefact as DOI `10.3390/bdcc10040117`? | Wikidata (ENT-22) |
| B | Which TikTok handle is yours? Do you own `@deepsafe` and `github.com/deep-safe`? | `sameAs` (ENT-05) |
| C | What does your LinkedIn headline actually say? | SAT-05 |
| D | Bing verification code | `params.toml` |
| E | Exact Vercel env var name in the MFL repo | ENT-02 |
| F | Keep or drop the empty `@simo___one` from `sameAs`? | ENT-05 |
| G | Bullet points for the 16 thin posts (esp. KTH, ELTE, TalTech, GDG hackathon) | CON-04 |
| H | DeepSafe: founding year, what it did, why it failed | Organization schema + founder narrative |

---

## [2026-08-08] P0 code fixes — what needs YOU to land them

Four P0 code fixes are written and verified but **nothing is committed or deployed**. Review, then ship:

### 1. CampFlow (two branches)
Working-tree changes on `main`, plus the `website-only` branch (which is what actually publishes).
The `website-only` edit is in a worktree at:
`/private/tmp/claude-502/.../scratchpad/campflow-website` — or just re-apply the same two edits to `src/app/page.tsx` on that branch.
Publish with `./deploy.sh` from a clean `website-only` checkout.

### 2. Mountain Fauna Lover
Working-tree changes on `main`. Commit + push; Vercel redeploys. Also fix the env var (see the entry above).

### 3. DeepSafe — needs a clone
You have **no local DeepSafe checkout**. I cloned it to a scratchpad and produced a patch:

```
PROGETTI_SIMO/deepsafe-ENT-12-remove-fake-rating.patch
```

Apply with:

```bash
git clone https://github.com/deep-safe/DeepSafe.git && cd DeepSafe && git apply ../deepsafe-ENT-12-remove-fake-rating.patch
```

Then rebuild and redeploy (`deploy_gh_pages.sh`, then push `out/` to `gh-pages`).
⚠️ Its build needs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` set, or it fails on `Error: supabaseUrl is required` — that's pre-existing, not from this change.

### ❓ One decision I need — DeepSafe's dead domain

`deepsafe.app` **times out on HTTPS** and 302s on HTTP. DeepSafe's `metadataBase`, `og:url` and `og:image` all still point at it. Since you said the project is no longer active:

- **Do you still own `deepsafe.app`?** If it has lapsed, this is the CampFlow problem again — your og:url points at a domain anyone can now buy.
- Shall I repoint everything to `https://deep-safe.github.io/DeepSafe`? I'd recommend yes: DeepSafe stays live as evidence for the founder narrative, just canonicalised somewhere that actually resolves.

I did **not** change this — it's a judgement call about a domain you may still hold, not a bug fix.

---

## [2026-08-08] DeepSafe upstream PR — blocked on account permissions

`simo-hue/DeepSafe` is **pushed and deployed** (commit `4dbf289`) — the live site at
`https://simo-hue.github.io/DeepSafe/` is verified correct.

The matching PR to `deep-safe/DeepSafe` could **not** be opened: pushing was rejected with
`permission denied`. The credential in your keychain has write access to `simo-hue` but not to
`deep-safe` — that's a separate GitHub **user** account (not an org), so it needs its own login.

Everything is prepared. Pick whichever is easier:

**Option A — push the branch yourself.** The branch already exists locally in
`PROGETTI_SIMO/DeepSafe`, built on top of `deep-safe/main`:

```bash
cd ~/Developer/PROGETTI_SIMO/DeepSafe && git push deepsafe-org seo/canonical-entity-and-rating-fix
```

Authenticate as the `deep-safe` account when prompted, then open the PR from the link GitHub prints.

**Option B — apply the patch** in a fresh clone:

```bash
git clone https://github.com/deep-safe/DeepSafe.git && cd DeepSafe && git am ../deepsafe-UPSTREAM-canonical-and-rating-fix.patch
```

### Why this matters — a policy risk is still live

`https://deep-safe.github.io/DeepSafe/` is still serving `aggregateRating 4.8 / ratingCount 1250`
with no reviews behind it, and still emits **no canonical**. Until it rebuilds:

- the fabricated-rating exposure remains on a site you own, and
- the cross-canonical is incomplete, so that copy keeps competing with your canonical URL as duplicate content.

---

## [2026-08-08] CampFlow push blocked — `simo-iite` is not a collaborator on that repo

Mountain Fauna Lover pushed fine (`1827dc7`, Vercel redeploying). **CampFlow did not:**

```
remote: Permission to simo-hue/CampFlow.git denied to simo-iite.
```

Your git credential authenticates as **`simo-iite`** (your IITE account), which *is* a collaborator on
`simo-hue/DeepSafe` and `simo-hue/Mountain-Fauna-Lover` — both pushed successfully today — but has
never been added to `simo-hue/CampFlow`. All three repos are otherwise identical (public, owned by
`simo-hue`, not forks), so this is purely a collaborator-list gap.

**Both commits are ready locally, nothing is lost:**

| Branch | Commit | What it does |
|---|---|---|
| `main` | `e7305fe` | canonical + rating fix, localhost-proof `metadataBase`, `robots.ts`/`sitemap.ts` off `campflow.app` |
| `website-only` | `1956be7` | the same canonical + rating fix — **this is the branch that publishes the live site** |

### To land them — pick one

**A. Add `simo-iite` as a collaborator** (30 seconds, and it makes every future push work):
GitHub → `simo-hue/CampFlow` → Settings → Collaborators → add `simo-iite` with Write.
Then:

```bash
cd ~/Developer/PROGETTI_SIMO/CampFlow && git push origin main && git push origin website-only
```

**B. Push as `simo-hue`** — re-authenticate with that account and run the same two pushes.

### Then deploy the public site

Pushing `website-only` does **not** update the live site — it is published from `gh-pages`:

```bash
cd ~/Developer/PROGETTI_SIMO/CampFlow && git checkout website-only && ./deploy.sh
```

⚠️ `deploy.sh` runs `git stash`, `git checkout gh-pages`, `git rm -rf .` and force-pushes `gh-pages`.
Run it from a clean tree, on the `website-only` branch, and nowhere else.

**Until that deploy runs, `https://simo-hue.github.io/CampFlow/` still tells Google that a GoDaddy
parking page is its canonical, and still publishes the fabricated 5.0/12 rating.**

---

## [2026-08-08] 🔴 SECURITY — rotate two passwords that were published in DeepSafe's JS

Found while fixing DeepSafe. **Code is fixed and deployed; the credentials still need rotating.**

`src/app/admin/layout.tsx` and `src/app/admin/dev/page.tsx` gated access by comparing user input
against `NEXT_PUBLIC_ADMIN_PASSWORD` and `NEXT_PUBLIC_DEV_PASSWORD`. Both are `'use client'`
components, and **Next.js replaces every `NEXT_PUBLIC_*` reference with its literal value at build
time** — so both passwords were compiled into the public JavaScript of a static site on GitHub
Pages. Readable by anyone who opened the bundle.

**Do now:**
1. Change the admin password and the dev password wherever they are used or reused.
2. Delete both secrets from Settings → Secrets → Actions on **both** `simo-hue/DeepSafe` and
   `deep-safe/DeepSafe`. The workflow no longer references them.
3. Verify row-level security is enabled on every table the admin panel touches. With the password
   gate gone, RLS is the only thing between the public anon key and your data.

**Rule to carry forward:** `NEXT_PUBLIC_` literally means "ship this to the browser". It can never
hold a secret. This is worth checking in your other Next.js projects — Mountain Fauna Lover and
CampFlow both use `NEXT_PUBLIC_*` vars, though neither currently puts a credential in one.

**Not a leak, for the record:** the PostHog key `phc_rr8SnKrn…` in DeepSafe's `LANDING PAGE/` files
predates all of this work (committed in `8e2d4a2`). PostHog `phc_` project keys are public by
design — they are meant to sit in client-side page source. I deleted the directory anyway since it
was orphaned dead code. Rotate only if you mind junk events.

## [2026-08-08] Phase 1 shipped — two follow-ups for you

1. **`/blog/publications/` still shows the wrong date.** The page lists the paper as *Dec 15 2024*; the real record is BDCC 10(4) 117, published **2026-04-11**. You confirmed it is the same artefact, so the page date is simply stale. It also has no DOI on it. (Task ENT-21 — I can do this, it needs a content edit.)
2. **The copy I wrote you earlier said KTH too early.** The LinkedIn headline and ORCID bio in the entries above claim you are at KTH now. Use the corrected wording from `data/entity.yml` → `status`:
   *"BSc Computer Science, University of Verona (2022–2025). Incoming EIT Digital Master's student (AUSIR) — ELTE from September 2026, KTH Royal Institute of Technology from August 2027."*

Once you finish ENT-04 (Scholar) and ENT-15 (Semantic Scholar), set `same_as: true` on those two entries in `data/entity.yml` and rebuild — that is the whole change.

## [2026-08-08] Three build stories are drafted and waiting on you

`content/english/blog/tech-projects/{Evolve, Ping Pong Counter, Warranties Vault}/index.md` each
hold a ~1,000-word engineering case study, `draft: true`, with **7 `[SIMONE: ...]` markers** apiece.

Each marker is a question the repo genuinely cannot answer — it documents WHAT you built, almost
never WHY. Answer them inline, delete the marker, set `draft: false`. **Do not publish with the
markers still in the text.**

The questions worth thinking about before you write:
- Why Flutter for Evolve but native SwiftUI for Ping Pong Counter?
- Why a full parallel local store in private mode, rather than an offline cache over Supabase?
- Was iCloud the only multi-device option you considered for private mode?
- Are the `ICLOUD_SYNC_PLAN.md` documents history or spec? The mobile plan lists seven synced
  tables where the code has nine, and specifies a `keycheck` record that was never built.
- Why no Xcode on the dev machine — deliberate, or just how it ended up?

### Two things I noticed in your code, unrelated to SEO

Both come from your own documentation, read closely. I have not independently verified either.

1. **`is_pro` is in the synced column set.** A pulled `is_pro = 1` would be an in-app-purchase
   bypass. `ICLOUD_SYNC_STATE.md` notes the guarantee holds only because every *current* sender
   strips it — which is a property of today's clients, not of the protocol.
2. **HealthKit measurements (`goal_logs.value`) sync** rather than sitting in `localOnlyColumns`.
   Your notes record this as an accepted risk against App Store guideline **5.1.3(ii)** and mark
   it an owner decision.

### Also fixed

- ELTE, KTH and TalTech unpublished until those events actually happen.
- All three app posts had the same copy-pasted description ("A premium Flutter application…"),
  wrong for the two Swift apps. Rewritten per app.
- Warranties Vault's GitHub link pointed at `simo-hue/Warranties-Vault`, which **404s**. Corrected
  to `simo-hue/Mobl`. Consider renaming that repo to `warranties-vault` (GitHub auto-redirects) —
  the opaque slug is also its App Store support URL.

## [2026-08-08] Your published site is large — one decision left

The site is now 553 MB (down from 750 MB). GitHub Pages' published-site limit is **1 GB**, so you
have headroom, but the remaining bulk is all in one post and it is yours to judge:

`content/english/blog/experiences/CLAB Univr/` carries roughly 70 MB of course material —

- `materiali-di-study.zip` — 14 MB, **linked from the post**
- `materiali-di-studio.zip` — 14 MB, **not linked from anywhere**
- `Business Plan.pdf` (5 MB), `Business Plan.docx` (9 MB), two `.pptx` files (10 MB each)

The two ZIPs have **different checksums**, so they are not identical copies — one may contain
material the other does not. I did not delete either. Worth checking which is current: if
`materiali-di-studio.zip` is a superseded rename, that is 14 MB for nothing.

Longer term, hosting the large binaries outside the repo (GitHub Releases, or Drive) and linking
out would take ~70 MB off every clone and every deploy.

**Note on the images:** I removed 124 image originals that each had a `.webp` twin and were
referenced by nothing. They are still in git history — `git show HEAD~1:<path> > <path>` restores
any of them.

---

## [2026-08-08] Thin posts — what I did, and the five that need you

### Unpublished (nothing there to expand)

Four more posts were live while advertising themselves as unwritten:

- `experiences/GDG AI Hackathon` — body was a bare `## Introduction`, zero words of prose
- `books/Pensieri lenti pensieri veloci`, `books/guadagna con la mente`,
  `books/insegna al cuore a vedere` — all three read **"COMMING SOON, Still Reading"** (sic),
  dated **November 2024**. Live for about 21 months.

All now `draft: true` with a comment saying why. Write them and flip the flag.

### Fixed

- **`mountainfaunalover` expanded, 138 → 471 words**, and it stays live. Everything added is
  verifiable — the locations, what digiscoping is, the four channels — nothing invented about
  your experience. Description was the placeholder "A brief description of Mountain Fauna Lover
  presence on Social media Platforms"; tags gained digiscoping/trentino/stelvio; the website
  link was missing entirely.
- **Another wrong TikTok handle.** This post linked `@mountainfaunalove` (no *r*) — the
  stranger's account again. It was rendering on **9+ pages** through post cards.

### Four questions that would make the MFL post yours

I stripped these out rather than publishing a live page with markers in it. Answer them and
I will work them in:

- What scope and camera do you actually shoot with, and why that combination?
- Which channel works best, and did that match what you expected?
- Is there a specific encounter that changed how you approach not disturbing the animals?
  A concrete story lands far harder than the principle.
- The embedded YouTube video has no context — what is it, and why that one?

### The five I am not going to write

`Budapest Trip` (105 words of prose) · `GISEP Rimini` (125) · `Sicily` (137) ·
`Poland Trip` (143) · `Italy Trip` (210)

These are not stubs — they are **finished, just short**. The reason I have stopped rather than
padding them: the only honest way to reach 600 words is your memories, and the alternative is
filling them with generic travel-guide copy about the Danube or the Colosseum. That would make
them *worse*. Undifferentiated encyclopedia content is exactly what search engines and LLMs
discard, and the entire value of these posts is that they are first-hand.

For each, three or four sentences from you is enough for me to draft:

| Post | What I need |
|---|---|
| Budapest Trip | Which year, who went, one thing that surprised you, one thing that went wrong |
| GISEP Rimini | What GISEP is, why you attended, one session or conversation worth recounting |
| Sicily | You have **7 photos** in this post and reference the mafia in the tags — what was the trip actually about? |
| Poland Trip | Auschwitz-Birkenau is in the description. What you want to say about it, in your words |
| Italy Trip | Where exactly, when, and what made it worth a post |
