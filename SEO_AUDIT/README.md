# Personal Entity / GEO / SEO Programme — Simone Mattioli

> **Generated:** 2026-08-08 · **Method:** live crawl of 10 web properties + 3 off-site surface clusters (14 parallel agents, 276 fetches)
> **Evidence:** [`2026-08-08-entity-audit-evidence.md`](./2026-08-08-entity-audit-evidence.md) — every claim below traces to a verified fetch there
> **Supersedes:** [`2026-06-30-audit-archived.md`](./2026-06-30-audit-archived.md) (largely executed; checkboxes never ticked)

---

## The goal

When Google, ChatGPT, Perplexity or Copilot is asked **"who is Simone Mattioli?"**, return *him* — with correct facts.

**Canonical positioning sentence.** Every surface in this programme must agree with this string:

> Italian CS engineer and AI researcher who ships. Co-author of a BDCC/MDPI paper on LLMs for tourist-mobility prediction; EIT Digital Master's at KTH & ELTE; six iOS apps on the App Store; founder-track, building toward his own company.

**Locked decisions** (settled 2026-08-08; do not re-litigate):

| Branch | Decision |
|---|---|
| Domain | Stay on `simo-hue.github.io`. **No domain will be purchased.** |
| Entity model | One canonical Person `@id`; ventures as `Organization` with `founder →` him; apps as `SoftwareApplication` |
| DeepSafe | Is the failed startup — name it, don't hide it |
| Language | Full EN + IT parity; professional pages first |
| Content | Claude drafts from Simone's facts, Simone edits; all thin posts → 600+ words |
| Wikidata | Scholarly-article item first, then author item (WikiCite route) |
| Authorship | **Second author of four.** Never state or imply sole authorship. |

**The canonical Person URI — memorise it, it must be byte-identical everywhere:**

```
https://simo-hue.github.io/#person
```

---

## Situation in one paragraph

The entity is fragmented into roughly **24 nodes where there should be 1**. The canonical `@id` appears on **2 of 10 properties**. Meanwhile three surfaces publish *false facts* about him — Google Scholar credits him with a paper by two other researchers, Semantic Scholar has fused him with the author of a 2015 Bitcoin study, and SciProfiles calls him "Dr." He has no doctorate. Two properties canonicalise to domains he does not own, two publish fabricated star ratings, and two are blank pages to every AI crawler this programme targets. Separately, his social surfaces contain **zero** occurrences of `AI researcher`, `KTH`, `ELTE`, `EIT Digital`, `LLM` or `founder` — so an LLM crawling them reconstructs an Italian mountain-wildlife vlogger.

---

## 🚨 P0 — do these first, in this order

These are not optimisations. Three are false facts about a real person; two are policy violations; one hands a domain squatter his link equity.

| # | ID | What | Why it is P0 | Owner |
|---|----|------|--------------|-------|
| 1 | **ENT-04** | Delete the RoBERTa-CSS paper from Google Scholar, then set updates to *"Don't automatically update"* | **Verified:** his profile lists *"An AI-driven framework for continuous tourist sentiment scoring (RoBERTa-CSS)"*, Tourism Review 81(1) 167-187, bylined **T Yang, CHC Hsu**. He is not an author. It supplies **all 3 of his citations and his entire h-index**. Real metrics are 0/0/0. Adding this profile to `sameAs` before cleaning would make a false authorship claim *more* machine-resolvable. | Simone |
| 2 | **ENT-15** | Claim Semantic Scholar author `2429558651` **via ORCID**, then remove the 2015 paper | **Verified:** `externalIds: {}` (no ORCID), 2 papers — the second *"Consumatori, fiducia e Bitcoin"* (2015). He was ~12. S2 feeds many LLM retrieval corpora; this merge is a live, direct cause of the confusion this programme exists to fix. | Simone |
| 3 | **ENT-18** | Remove the `Dr.` honorific from SciProfiles | **Verified:** `"Dr. Simone Mattioli"` is the `schema.org Person.name` value, not page chrome. Highest qualification is a BSc (2025-10-17). The single most quotable wrong fact in his footprint, and it is machine-readable. | Simone |
| 4 | **ENT-01** | CampFlow `metadataBase` → `https://simo-hue.github.io/CampFlow/` | **Verified:** `<link rel="canonical" href="https://campflow.app/w"/>` — a GoDaddy parking lander. He is instructing Google to treat a squatter's page as authoritative and consolidate all link equity there. | Claude |
| 5 | **ENT-12** | Strip `aggregateRating` from DeepSafe and CampFlow | **Verified:** CampFlow publishes `ratingValue 5 / ratingCount 12`; DeepSafe `4.8 / 1250` — neither backed by any review. Breaches Google's review-snippet policy, a documented cause of **site-wide** manual actions. Must land **before** `founder → #person` ties either property to the canonical entity. | Claude |
| 6 | **ENT-02** | Set the Vercel production site-URL env var for Mountain Fauna Lover | **Verified: 76 occurrences of `localhost:3000`** on `/en` alone, zero of the real host — canonical, hreflang, og:url, og:image, every `@id`, robots `Host`/`Sitemap`, 18 sitemap `<loc>`, 10 llms.txt links. Also the default IRI any misconfigured Next.js app mints, so it risks *merging unrelated sites* onto one bogus node. | Simone (Vercel) + Claude (code) |
| 7 | **SAT-05** | Read the LinkedIn headline while logged in | **UNVERIFIED — needs him.** Two independent searches returned the result title `"simone mattioli - TikTok | LinkedIn"`. LinkedIn titles follow `Name - Company`, so the indexed employer may read **TikTok**. Page is HTTP-999 walled; never read. If real, his highest-authority profile tells Google his employer is TikTok. | Simone |
| 8 | **ENT-21a** | Reconcile the publications page against the DOI | `/blog/publications/` lists the paper **dated Dec 15 2024, no DOI**; the real record is BDCC 10(4) 117, **published 2026-04-11**. **Blocks ENT-22** — seeding Wikidata from a mismatched title propagates a bad item. | Simone + Claude |

---

## Phase 1 — Entity consolidation

Mechanical, high-leverage, no writing required. This phase delivers the goal; everything after it corroborates.

| ID | Surface | Change | Verify |
|----|---------|--------|--------|
| ENT-03 | ORCID → Names | `simone` → **`Simone`**; set `credit-name` = `Simone Mattioli`. **Blocks later tasks.** | API: `given-names == "Simone"` |
| ENT-05 | Hub Person `@graph` | Rebuild canonical node: full `sameAs` union; ORCID `identifier` PropertyValue; **remove `worksFor`** (asserts *employment* by UniVR — false); `alumniOf` = UniVR + ELTE + KTH; `@id` on the `WebSite` node | `worksFor` absent; `#website` present |
| ENT-06 | Hub `/links/` | TikTok `@mountainfaunalove` → **`@mountainfaunalover`**. Both handles are live; the hub is the only source pointing at the first, and 3 self-controlled sources corroborate the second. A resolving wrong link is worse than a 404 — it asserts a false identity about a stranger's account. | Only the with-*r* form |
| ENT-07 | `static/robots.txt` | Add **`ClaudeBot`** (currently absent — only the retired `Claude-Web`), `Claude-User`, `Claude-SearchBot`, `OAI-SearchBot`, `Applebot-Extended`, `meta-externalagent`, `Amazonbot`, `Bytespider`, `cohere-ai`, `Perplexity-User`. Delete the misplaced `Crawl-delay`. Narrow `Disallow: /*.json$` (it blocks the PWA manifest). Add 7 more `Sitemap:` lines. | `grep -c '^Sitemap:'` → 8 |
| ENT-08 | `static/llms.txt` | **Fix 3 of 7 links that 404** (`tech-project`→`tech-projects`, `publication`→`publications`, `experience`→`experiences`). Add `## Apps`, `## Projects`, `## Research`. State the canonical Person URI. Add CI that curls every URL and fails on non-200. | CI green |
| ENT-09 | Evolve | `#simone-mattioli` → canonical `@id` (4 refs). **Merge Evolve's 7 `sameAs` up into the hub — don't delete.** | 0 hits for `#simone-mattioli` |
| ENT-10 | Ping-Pong-Counter | `#author` → canonical `@id`; `url` → his site, not GitHub | grep deployed HTML |
| ENT-11 | Local-File-Diet (8 pages), SafeSpotter, CampFlow | Add the canonical `@id` to anonymous author nodes. **Byte-identical — no trailing slash, no locale prefix, no `#author` variant.** | grep all 10 pages |
| ENT-13 | Hugo `baseof.html` | Person stub on **every** page. `/links/` → `ProfilePage`; `/blog/` → `Blog` node. Currently `/links/`, `/blog/` and `/blog/publications/` carry only a BreadcrumbList. | `#person` on all pages |
| ENT-14 | GitHub `simo-hue` | Name `Mattioli Simone` → **`Simone Mattioli`**. Add a crawlable `# Simone Mattioli` H1 + bio sentence to the profile README (name currently appears only inside a badge image URL). | API `"name"` |
| ENT-16 | mattioli.OS, DeepSafe | Emit **static, server-rendered** `@graph`. Not `next/script`, not React-injected. | `grep` raw HTML ≥ 1 |
| ENT-17 | mattioli.OS | Per-route canonicals — all 7 routes emit the homepage canonical, deindexing `/creator/`, the only page carrying his identity | `/creator/` self-canonical |
| ENT-19 | ORCID | 60–100 word bio; 8–10 specific keywords (replacing `LLM`, `AI`); fix `University of verona` **via typeahead** so ROR attaches; add ELTE/KTH; date the employment entry; add researcher-urls | API reflects all |
| ENT-20 | Hub `@graph` | Give University of Verona **one** `@id` + Wikidata `sameAs`; replace the other 3 anonymous occurrences with references | 1 UniVR node, not 3 |
| ENT-21 | `/blog/publications/` | `ScholarlyArticle` with DOI, correct 4-author order, `author → #person`. Rewrite the 39-char meta description. **After ENT-21a.** | Rich Results Test |
| ENT-22 | Wikidata | Article item first (DOI `10.3390/bdcc10040117`), then author item with P496/P2037/P1960/P10283. **Second of four.** | Both resolve |
| SAT-09 | GSC + Bing Webmaster | Verify; submit all 8 sitemaps. **Promoted into Phase 1** — GitHub Pages has no sitemap ping, so this is the only discovery lever for ~54 orphaned URLs, and Bing's index feeds Copilot. | Sitemaps "Success" |

### The consolidated `sameAs` set

Verified-live only. `mailto:` belongs in `email`, not `sameAs`. Self-URL belongs in `url`.

```json
"@id": "https://simo-hue.github.io/#person",
"url": "https://simo-hue.github.io/",
"identifier": {
  "@type": "PropertyValue",
  "propertyID": "ORCID",
  "value": "https://orcid.org/0009-0006-5047-8004"
},
"sameAs": [
  "https://orcid.org/0009-0006-5047-8004",
  "https://scholar.google.com/citations?user=uLGrDbIAAAAJ",
  "https://openalex.org/A5133501663",
  "https://sciprofiles.com/profile/Mattioli-simone",
  "https://github.com/simo-hue",
  "https://www.linkedin.com/in/simonemattioli2003/",
  "https://apps.apple.com/us/developer/simone-mattioli/id1896746638",
  "https://www.youtube.com/@SimosDiary2003",
  "https://www.youtube.com/@mountainfaunalover",
  "https://www.youtube.com/@Deep-Safe",
  "https://www.instagram.com/simo___one/",
  "https://www.instagram.com/mountainfaunalover/",
  "https://www.instagram.com/deepsafe_/",
  "https://www.tiktok.com/@mountainfaunalover",
  "https://mountain-fauna-lover.vercel.app/",
  "https://deep-safe.github.io/DeepSafe/"
]
```

**Normalisation rules** (the estate currently violates all four): one Instagram form (`www.` + trailing slash); one SciProfiles host; strip tracking params (`?si=`, `?_t=`); drop `hl=en` from Scholar.

**Held back pending action:** Semantic Scholar (until ENT-15), `tiktok.com/@deepsafe` (ownership unverified), `github.com/deep-safe` (a *User* account, not an org; nothing names him), `mountainfaunalover.github.io` (purpose unclear).

---

## Phase 2 — Content depth

| ID | Surface | Change |
|----|---------|--------|
| CON-01 | Hub FAQPage | **Rewrite all 3 answers.** They say *"Simone Mattioli is a Computer Science student at the University of Verona"* while the same page's meta description says *"CS graduate and EIT Digital Master's student."* FAQPage is the most extractable structure on the site and it is serving the wrong answer. Highest leverage-per-minute item in the audit. |
| CON-03 | `data/entity.yaml` (new) | **One source of truth.** Render Person JSON-LD, FAQ answers, meta descriptions and llms.txt from one file so they can never drift again. Structural fix behind CON-01 and ENT-08. |
| CON-04 | 16 thin posts → 600+ words | KTH (55w), ELTE (47w), TalTech (43w), GDG AI Hackathon (45w), Warranties Vault (53w), Evolve (66w), Ping Pong Counter (67w), 3 book notes (23–27w), Budapest, GISEP, Sicily, Poland, MFL, Italy Trip. **Professional posts first.** Bullets from Simone → draft from Claude. |
| CON-05 | Taxonomy template | `noindex` on `/tags/` + drop from sitemap. **41 of 118 sitemap URLs (35%) are tag archives** while ~54 real URLs sit outside every discoverable sitemap. 20-minute change, reclaims a third of crawl allocation. |
| CON-06 | mattioli.OS | **Prerender.** 7 routes serve a byte-identical 2,304-byte `<div id="root"></div>` shell. |
| CON-07 | 4 App Store descriptions | Append `Made by Simone Mattioli — https://simo-hue.github.io/`. The only author-editable part of that surface; **none currently contains "Simone" or "Mattioli"**. |
| CON-08/09 | 59 GitHub repos | **0 of 59 link to the App Store.** 26 have no `homepage`, 3 no description. |
| CON-10 | 7 properties | Ship `llms.txt` — **clone Evolve's `tools/llms.js` generator** rather than writing from scratch (see "copy inward" below). |
| CON-11 | Evolve H1 | Contains no brand, no category keyword. Reseat entity + category. |
| CON-12 | App nodes | Add `image`, `screenshot`, `installUrl`, `softwareVersion`, App Store `identifier`. LFD needs `offers` — currently ineligible for app rich results. **Never synthesise `aggregateRating`.** |
| CON-13 | Assets | Hub `og-image.png` 507 KB → <200 KB; mattioli.OS `logo.png` **4.38 MB / 2560×1440** → 1200×630; favicon 692 KB → <10 KB. |

---

## Phase 3 — Italian parity

| ID | Change |
|----|--------|
| ITA-01 | Switch Hugo to **native multilingual** (`languages` block) so `.Translations` drives hreflang. **Abandon the `_it` filename-suffix pattern** — it orphaned `/passion/technology_it/`. Prerequisite, not optional. |
| ITA-02 | Self-referential + reciprocal hreflang (`en`, `it`, `x-default`) on every translated page. **No hreflang exists anywhere today.** Copy the Local-File-Diet head pattern. |
| ITA-03 | Pilot on the existing orphaned `/passion/technology_it/` pair before scaling. |
| **ITA-04** | **`@id` values stay language-neutral.** `https://simo-hue.github.io/#person` on Italian pages too — never `/it/#person`. Getting this wrong re-fragments the entity Phase 1 just consolidated. Evolve already does this right across 5 locales. |
| ITA-05 | `/about/`, `/blog/publications/`, `/blog/tech-projects/` translated **before** lifestyle content. |
| ITA-06 | Fix Local-File-Diet `og:locale` bare codes → `en_US`/`it_IT`/`de_DE`/`es_ES`. **It is the i18n template — fix it before copying it.** |

---

## Phase 4 — Satellites

`SAT-01` MFL entity repoint (post-ENT-02) · `SAT-02` DeepSafe author credit + `lang="it"` + canonical (post-ENT-12/16) · `SAT-03` three YouTube Abouts — **highest leverage on `@mountainfaunalover`**, the 12K-follower persona and the only channel with no JSON-LD, so its About text is the sole machine-readable signal · `SAT-04` Instagram display names (`Simone mattioli` → `Simone Mattioli`; `Magic Mountain` → `Mountain & Fauna Lover`) · `SAT-06` interview video description · `SAT-07` DeepSafe repo split across two accounts with a wrong clone URL · `SAT-08` rename `Mobl` → `warranties-vault`; fix "Warranty"/"Warranties" drift · `SAT-10` **hub links out to zero of its own apps** while Evolve links back twice — the link graph runs one-directional in the wrong direction.

---

## Two findings that change how the work should be done

**Copy inward, don't write from scratch.** The estate's best assets are on its weakest properties. The best AI-crawler robots.txt (15 agents incl. `ClaudeBot`) is on Mountain Fauna Lover, whose sitemap points at localhost. The best `llms.txt` — 15 KB, spec-shaped, *build-generated so it cannot drift* — is on Evolve, absent from every discoverable sitemap. Ping-Pong-Counter ships an `llms-full.txt` with a "What it does not do" section, which is rare and highly citable. The hub's own is 1.5 KB with 43% dead links. This materially reduces the effort on ENT-08 and CON-10.

**He cannot win the name contest on the name alone.** Against `SimoneMattioli98` (Bologna, computer vision) he wins every volume metric — 59 repos vs 24, 20 stars vs 5, daily vs dormant since Aug 2024 — and loses **both** string-matching signals: that account's name field reads `Simone Mattioli` while his reads `Mattioli Simone`, and it has a name-matching domain. Fixing the name field contests the string but cannot resolve it, since both accounts would then hold the same one. **The differentiator must be attributes — institution (Verona/KTH/ELTE vs Bologna) and domain (AI/LLM/HPC/iOS vs computer vision) — written explicitly into the bio, not implied.**

---

## Progress tracker

| Phase | Tasks | Done |
|---|---|---|
| 🚨 P0 | 8 | **4 code fixes done (awaiting deploy)** · 4 owner-actions open |
| Phase 1 — Entity | 17 | ☐ |
| Phase 2 — Content | 13 | ☐ |
| Phase 3 — Italian | 8 | ☐ |
| Phase 4 — Satellites | 10 | ☐ |

### Completed 2026-08-08

**DeepSafe is committed and pushed** (`simo-hue/DeepSafe` @ `4dbf289`, 85 commits) and deploying via GitHub Actions.
**CampFlow and Mountain Fauna Lover are written and verified but NOT committed** — they sit in the working tree for review.

| ID | Repo / branch | Change | Verification |
|----|---------------|--------|--------------|
| ENT-01 | `CampFlow` @ `website-only` + `main` | canonical `campflow.app/w` (GoDaddy parking lander) → `https://simo-hue.github.io/CampFlow/` | built `out/index.html` emits the correct canonical |
| ENT-12a | `CampFlow` @ `website-only` + `main` | removed fabricated `aggregateRating` 5.0/12 | 0 occurrences in build output |
| ENT-11a | `CampFlow` @ `website-only` + `main` | author `Person` given canonical `@id` (folded in — same JSON-LD block, same deploy) | canonical `@id` present in build output |
| ENT-12b | `DeepSafe` @ `main` | removed fabricated `aggregateRating` 4.8/1250 | 0 occurrences in `out/index.html` |
| SAT-02 | `DeepSafe` @ `main` | fast-forwarded the fork 84 commits; canonical home → `https://simo-hue.github.io/DeepSafe`; **added the missing canonical** (there was none); `og:url`/`og:image` off the dead `deepsafe.app`; `html lang` en→it; author `DeepSafe Team` → `Simone Mattioli`; `Organization` with `founder` → canonical Person | canonical + og on the live host; 0 `deepsafe.app` refs; graph parses, `founder` → `#person` |
| ENT-16 | `DeepSafe` @ `main` | JSON-LD moved from `next/script` (client-injected) to a plain server-rendered `<script>` — it was invisible to every non-JS AI crawler | raw `application/ld+json` tags in static HTML: **1** (was 0) |
| ENT-02 | `Mountain-Fauna-Lover` @ `main` | production builds now refuse a loopback origin; wrong fallback host corrected | prod build with the bad env var **still set**: 0 `localhost`, 84 correct-host refs |

Also fixed in passing on `CampFlow` `main`: `metadataBase` no longer falls back to localhost in production; `robots.ts`/`sitemap.ts` no longer emit the parked `campflow.app`.

**Correction to §4 of the evidence doc:** DeepSafe's fabricated rating *is* present in the served bytes, as an escaped RSC flight payload (`\"aggregateRating\"`), not absent as first reported. A plain-text grep misses it. Net effect is unchanged for non-rendering AI crawlers, but Googlebot renders JS and would have seen `4.8 / 1250` — so the manual-action exposure was real, not theoretical.

**Still open in P0** — all owner-actions: ENT-04 (Scholar), ENT-15 (Semantic Scholar), ENT-18 (SciProfiles), SAT-05 (LinkedIn). ENT-21a is **resolved**: the publications entry and DOI `10.3390/bdcc10040117` are the same artefact, so the page's Dec-2024 date is stale and must become 2026-04-11. **ENT-22 (Wikidata) is unblocked.**

**Ordering constraints that must not be violated:**
`ENT-04` → `ENT-05` (don't consolidate onto a contaminated Scholar profile) · `ENT-12` → `SAT-02` (don't attach `founder` to a policy violation) · `ENT-02` → `SAT-01` · `ENT-21a` → `ENT-22` (don't seed Wikidata from a mismatched title) · `ENT-15` → adding S2 to `sameAs` · `ITA-01` → all other ITA tasks.
