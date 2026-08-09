# Simone Mattioli — Entity/GEO Audit Synthesis

**Scope:** 10 web properties + 3 off-site surface clusters (academic, social/video, app-store/code-hosting), all fetched live.
**Convention used throughout:** **[V]** = verified in the supplied live data. **[I]** = inferred by cross-referencing two verified datasets; not directly fetched. **[BLOCKED]** = fetch failed or was walled; stated as unknown, never guessed.

---

## 1. The entity graph as it actually exists today

### 1.1 Person `@id` emitted, per property

| # | Property | Person `@id` emitted **[V]** | Person name string | Status |
|---|---|---|---|---|
| 1 | `simo-hue.github.io/` (hub) | `https://simo-hue.github.io/#person` | Simone Mattioli | **CANONICAL** — but only on `/` and `/about/` |
| 1b | `simo-hue.github.io/links/` | *(no Person node)* | — | BreadcrumbList only |
| 1c | `simo-hue.github.io/blog/` | *(no Person node)* | — | BreadcrumbList only |
| 1d | `simo-hue.github.io/blog/publications/` | *(no Person node)* | — | BreadcrumbList only |
| 2 | `mountain-fauna-lover.vercel.app` | `http://localhost:3000/#person` | Mattioli Simone (alt: Simone Mattioli) | **FORK — non-resolvable loopback IRI** |
| 3 | `deep-safe.github.io/DeepSafe/` | *(none — zero Person node anywhere)* | — | **ABSENT** + JSON-LD is JS-injected, absent from served HTML |
| 4 | `simo-hue.github.io/evolve/` (×5 locales) | `https://simo-hue.github.io/evolve/#simone-mattioli` | Simone Mattioli | **FORK — stable but wrong** |
| 5 | `simo-hue.github.io/wealth-compass/` (×6 pages) | `https://simo-hue.github.io/#person` | Simone Mattioli | **CORRECT** |
| 6 | `simo-hue.github.io/Ping-Pong-Counter/` | `https://simo-hue.github.io/Ping-Pong-Counter/#author` | Simone Mattioli | **FORK** |
| 7 | `simo-hue.github.io/Local-File-Diet/` (×4 locales + support pages) | `NO_ID` | Simone Mattioli | **ANONYMOUS BLANK NODE** |
| 8 | `simo-hue.github.io/SafeSpotter/` | `NO_ID` | Simone Mattioli | **ANONYMOUS BLANK NODE** |
| 9 | `simo-hue.github.io/mattioli.OS/` (×7 routes) | *(none — zero JSON-LD in HTML, in DOM, or in any of 3 JS bundles)* | — | **ABSENT** |
| 10 | `simo-hue.github.io/CampFlow/` | `NO_ID` | Simone Mattioli | **ANONYMOUS BLANK NODE** |

**Off-site Person-typed nodes:**

| Surface | `@id` **[V]** | Name string |
|---|---|---|
| SciProfiles | `https://sciprofiles.com/profile/Mattioli-simone#person` | **"Dr. Simone Mattioli"** |
| MDPI article `10.3390/bdcc10040117` | `NO_ID` (all 4 author nodes) | Simone Mattioli |
| Apple Developer + 4 app listings | `NO_ID` — and typed **`Organization`**, not `Person` | Simone Mattioli |
| YouTube `@simosDiary2003` | `NO_ID` | **"Simo's Diary"** |
| YouTube `@Deep-Safe` | `NO_ID` | **"DeepSafe"** |
| YouTube `@mountainfaunalover` | *(zero JSON-LD blocks, verified over 3 fetches)* | — |
| YouTube video `U9V8CkewXEY` | *(zero JSON-LD blocks)* | — |
| LinkedIn `/in/simonemattioli2003/` | **[BLOCKED — HTTP 999]** | — |

### 1.2 Fragmentation, quantified

- **5 distinct named Person URIs** are live right now for one human: `#person`, `localhost:3000/#person`, `evolve/#simone-mattioli`, `Ping-Pong-Counter/#author`, `sciprofiles…#person`.
- **≥19 additional anonymous blank Person nodes** that no resolver can merge with anything: Local-File-Diet (4 locale homepages + 4 support pages), SafeSpotter, CampFlow, MDPI (his + 3 co-authors), Apple (6 nodes, all mistyped as `Organization`), YouTube (2).
- **~24 entities where there should be 1.**
- The canonical `@id` appears on **2 of 10 properties (20%)**. The other 8 emit a fork, a blank node, or nothing.
- **`http://localhost:3000/#person` is the single most dangerous value in the estate.** It is not merely wrong — it is the default IRI *any* misconfigured Next.js deployment mints. If any other property ever ships with the same bug, the graph will actively **merge unrelated sites onto one bogus node**. It is currently on all Mountain Fauna Lover pages (`/en`, `/it`, `/en/founder`).

### 1.3 Organization layer — the agreed model is 0% implemented

The strategy calls for DeepSafe and Mountain Fauna Lover as `Organization` nodes with `founder → #person`. Live state **[V]**:

- **DeepSafe:** no `Organization` node at all. Node inventory is exactly `SoftwareApplication` / `Offer` / `AggregateRating`, every one `@id`-less. `"simone"`, `"mattioli"`, `"simo-hue"`, `"Person"`, `"sameAs"`, `"@id"` — **0 occurrences each** in full-byte grep of both pages.
- **Mountain Fauna Lover:** an Organization exists but `@id` is `http://localhost:3000/#organization`, and its `founder` points at `http://localhost:3000/#person`.
- **University of Verona** appears three times in one graph on the hub (`alumniOf`, `hasCredential[0].recognizedBy`, `worksFor`), plus `worksFor.department` — **all four `@id`-less**, so it resolves as three separate anonymous organisations.
- The hub's own `WebSite` node also has **no `@id`**, so satellites have no `isPartOf` target to point at.
- **Zero** `Organization` nodes anywhere carry an `@id`. Not one.

---

## 2. The consolidated `sameAs` set

### 2.1 Recommended canonical `sameAs` — verified-live only

`sameAs` asserts *"this URL is the same entity."* Self-URLs (`https://simo-hue.github.io/`) belong in `url`, not `sameAs`. The paper belongs in `subjectOf`/`author-of`, not `sameAs` — a person is not a paper.

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
  "https://deep-safe.github.io/DeepSafe/",
  "mailto:mattioli.simone.10@gmail.com"
]
```

**Normalisation rules this list applies** (the estate currently violates all four):
1. **One Instagram form.** Hub uses `https://instagram.com/simo___one`; Evolve uses `https://www.instagram.com/simo___one/`. Two strings = no match. Use `www.` + trailing slash.
2. **One SciProfiles host.** Evolve uses `sciprofiles.com`, Wealth Compass uses `www.sciprofiles.com`. The page canonicalises to the slug form on the bare host — use `https://sciprofiles.com/profile/Mattioli-simone`. Never `/profile/5198726` (it 301s to the slug).
3. **Strip tracking params.** `@simosDiary2003`'s own `sameAs` carries `?si=NXpVuvGfRkJ-kJhE`; the YouTube channel link list carries `?_t=ZN-8w0y6Meb4ze&_r=1`. Bare canonical URLs only.
4. **Drop `hl=en`** from the Scholar URL (hub `/links/` uses `?hl=en&user=…`, Evolve uses `?user=…`).

### 2.2 Held back pending action — do NOT add yet

| URL | Why held |
|---|---|
| `https://www.semanticscholar.org/author/2429558651` | **[V]** Record contains a false merge: a 2015 Italian consumer-psychology paper on Bitcoin (`441da9d4b69188e86a5efa0e4b8f140f732074b1`) he did not write — he was ~12. Adding `sameAs` before claiming and cleaning makes the false attribution *more* machine-resolvable. Add after ENT-11. |
| `https://www.tiktok.com/@deepsafe` | **[V]** Handle exists, ownership **UNVERIFIED**. Nothing links it to him; `deep-safe.github.io/DeepSafe` carries zero social links. Confirm by logging in. |
| `https://github.com/deep-safe` | **[V]** A *User* account (id 247392125, `api.github.com/orgs/deep-safe` → 404), 1 repo, 0 followers. Almost certainly his alt **[I]**, but nothing on the account names him. Confirm ownership. |
| `https://mountainfaunalover.github.io/` | **[V]** returns 200 (found via mattioli.OS `/creator/` outbound links); a repo of that name exists under `simo-hue`. Ownership/purpose unclear. Verify before asserting. |

### 2.3 Dead edges to fix or remove

| Broken URL | Status **[V]** | Action |
|---|---|---|
| `https://www.tiktok.com/@mountainfaunalove` (no *r*) | HTTP 200 — **but a different account** | **Remove from hub `/links/`.** See 2.4. |
| `http://localhost:3000/*` | Connection refused | 76 occurrences on MFL `/en` alone; 0 occurrences of the real host |
| `http://localhost:3000/images/og/og-image.jpg` | curl exit 7, HTTP 000 | Asset exists at the real host (200, image/jpeg, 80,787 B) |
| `https://deepsafe.app/` and `/landing/assets/og-youth.jpg` | **Port 443 times out** (3× verified). Port 80 → 302 to Namecheap URL Forward, which also times out | Parked. Repoint `og:url`/`og:image`/sitemap/robots to the live host |
| `https://campflow.app/w` | 200, 114-byte body redirecting to `/lander` → **GoDaddy parking page** (`window._trfd.push({ap:"parking"})`) | CampFlow's `rel=canonical` points here |
| `https://simo-hue.github.io/blog/tech-project/` | 404 (real: `/blog/tech-projects/`) | In hub `llms.txt` |
| `https://simo-hue.github.io/blog/publication/` | 404 (real: `/blog/publications/`) | In hub `llms.txt` |
| `https://simo-hue.github.io/blog/experience/` | 404 (real: `/blog/experiences/`) | In hub `llms.txt` |
| `https://simo-hue.github.io/CampFlow/CampFlow/opengraph-image.png` | 404 — `/CampFlow/` duplicated | Single-segment path returns 200 |
| `http://simo-hue.github.io/` (http) | 301 → https | On mattioli.OS `/creator/`; the single most important link in the graph takes an extra hop |
| `https://simo-hue.github.io/blog/publication/llm-tourism-mobility-predictor/` | **[I] likely 404** — the `/blog/publication/` prefix is a confirmed 404 | Homepage field of the `LLM-Tourism-Mobility-Predictor-HPC-A100` repo. **Needs a curl.** |

**Non-200 that are NOT dead — keep in `sameAs`:**
- `linkedin.com/in/simonemattioli2003/` → **HTTP 999** (LinkedIn's standard bot block, both curl and WebFetch). Routine.
- `sciprofiles.com/profile/Mattioli-simone` → **HTTP 403** via curl (Akamai `bm-verify`); loads fine in a real browser.

### 2.4 TikTok handle discrepancy — RESOLVED

The brief expected one handle to 404. **Neither does** — both are live accounts, validated against a 3-handle negative control (fake handles return HTTP 400; both these return 200 with distinct `author_name`):

| Handle | oembed `author_name` | Evidence |
|---|---|---|
| `@mountainfaunalove` (no *r*) | `"mountain & fauna lover"` | Linked from **`simo-hue.github.io` only** |
| `@mountainfaunalover` (with *r*) | `"Mountain and fauna lover"` | Linked from **3 self-controlled sources** |

The three corroborating sources **[V]**: (1) the `@mountainfaunalover` YouTube channel's external link list; (2) that channel's own About copy, verbatim `"TikTok: @mountainfaunalover"`; (3) `mountain-fauna-lover.vercel.app`.

**Verdict:** the with-*r* handle is his. The hub — the exact page an LLM treats as the identity hub — is the single outlier and points at what is almost certainly a third party's account. **This is worse than a broken link:** a 404 breaks a `sameAs` edge harmlessly; a resolving link makes a false identity assertion about a real stranger's account. Fix on the hub, and confirm ownership by reading the handle off the logged-in profile before publishing.

---

## 3. Contradictions across surfaces

### 3.1 Name form — 7 distinct human-name strings, plus 3 brands-as-person

| String **[V]** | Where |
|---|---|
| `Simone Mattioli` | Hub, Evolve, Wealth Compass, SafeSpotter, LFD, CampFlow, MDPI, Crossref, OpenAlex, Semantic Scholar, Apple (all 5 pages), **and `SimoneMattioli98`** |
| `Mattioli Simone` | **GitHub `simo-hue` name field**; Google Scholar (`<title>` reads `Mattioli Simone - Google Scholar`); MFL JSON-LD `Person.name`; YouTube `@mountainfaunalover` About: `"Sono Mattioli Simone"`; MFL `llms.txt` |
| `simone Mattioli` | **ORCID** — `given-names.value = "simone"`, lowercase; `credit-name` is `null`, `other-names` empty |
| `Dr. Simone Mattioli` | **SciProfiles** — and it is the `schema.org Person.name` value, plus `<title>`, `og:title`, meta description |
| `Simone mattioli` | Instagram `@simo___one` `og:title` |
| `simone mattioli` | LinkedIn, as rendered in search results |
| `mattioli.simone.10` | Public gmail on ORCID |
| `Simo's Diary` | YouTube `@simosDiary2003` JSON-LD `Person.name` |
| `Mountain & Fauna Lover` / `Magic Mountain` | YouTube brand vs Instagram display name — **the same persona uses two different brand names** |
| `DeepSafe` | YouTube `@Deep-Safe` JSON-LD `Person.name` |

Across all nine social profiles, the exact string `"Simone Mattioli"` appears in structured markup **exactly once** — as `<meta property="og:video:tag">` on `@simosDiary2003`. That is one of the weakest signals in the Open Graph spec.

### 3.2 Education / status — 7 mutually incompatible claims

| Surface | Verbatim string **[V]** |
|---|---|
| Hub `Person.jobTitle` | `"Computer Science Student & AI Researcher"` |
| Hub `Person.worksFor` | `EducationalOrganization` `"University of Verona"` — **asserts employment** |
| Hub meta description (all pages) | `"CS graduate and EIT Digital Master's student (ELTE, then KTH)"` |
| **Hub FAQPage answers** | `"Simone Mattioli is a Computer Science student at the University of Verona"` and `"Simone Mattioli studies at the University of Verona"` |
| Hub `llms.txt` | `"Computer Science student (University of Verona; Master's at KTH Royal Institute of Technology)"` — **ELTE missing** |
| GitHub bio | `"CS UniVR grad Enrolled in AUSIR path of EIT Digital Master School."` |
| GitHub `company` field | `"UniVR, ELTE, KTH"` |
| GitHub profile README | `"🎓 Computer Science student at the University of Verona"` |
| ORCID employment | org `"University of Verona"`, dept `"computer science"`, role `"student"`, **no start date, no end date** |
| ORCID education | org **`"University of verona"`** (lowercase v), role `"Bachelor Degree in Computer Science"`, `2022-10-05 → 2025-10-17` |
| SciProfiles | `"Dr. Simone Mattioli"` — **asserts a doctorate**; no affiliation shown at all |
| LinkedIn (indexed) | Search-result title `"simone mattioli - TikTok | LinkedIn"` — **[BLOCKED]**, see §8.6 |

Same page, opposite answers: the hub's own meta description says *"CS graduate"* while its own FAQPage says *"is a Computer Science student at the University of Verona."* The FAQPage is the more extractable format.

### 3.3 Positioning tokens — absent from every social surface

Grepped across all 5 social/video surfaces **[V]**: `"CS engineer"`, `"AI researcher"`, `"KTH"`, `"ELTE"`, `"EIT Digital"`, `"BDCC"`, `"MDPI"`, `"LLM"`, `"tourist mobility"`, `"founder"` — **zero hits on all ten tokens, on all five surfaces.**

What those surfaces say instead: personal-growth vlogging (`@simosDiary2003`), alpine wildlife and digiscoping (`@mountainfaunalover`, 12K IG followers), and gamified cybersecurity (`@Deep-Safe`). An LLM asked *"who is Simone Mattioli"* and crawling social reconstructs **an Italian mountain-wildlife vlogger**. The CS/AI/research identity exists on one self-hosted page that exactly one social surface links back to.

### 3.4 `sameAs` disagreement between his own properties

| Node | Entries | Unique holdings |
|---|---|---|
| Hub `#person` | 5 | YouTube `@simosdiary2003`, `mailto:` |
| Evolve `#simone-mattioli` | 7 | **ORCID, Google Scholar, SciProfiles** |
| Wealth Compass (correct `@id`) | 8 | + Apple developer page, App Store app URL, repo URL |
| Ping-Pong-Counter | **1** (`github.com/simo-hue`) | — |
| Local-File-Diet / SafeSpotter / CampFlow / DeepSafe / mattioli.OS | **0** | — |

Only GitHub and LinkedIn are byte-identical across the hub and Evolve. **The satellite is richer than the canonical node.** ORCID — the strongest cross-domain reconciliation signal available to an academic entity — is on Evolve and Wealth Compass but **not on the hub's `#person`**, even though the hub's own `/links/` page links it in HTML.

Additional asymmetry **[V]**: the `@simosDiary2003` YouTube channel's `sameAs` asserts the cross-persona link (`simo-hue.github.io` + IG `@simo___one` + IG `@mountainfaunalover` + YouTube `@mountainfaunalover`) that **his own site does not**.

### 3.5 Product-name drift

- **Warranties Vault:** store name is plural; the description body says **"Warranty Vault"** (singular) throughout — *"Warranty Vault keeps receipts…"*, *"Why Warranty Vault:"*, *"Warranty Vault is not an expense tracker…"*. Support URL is `simo-hue.github.io/Mobl/` — an opaque slug.
- **DeepSafe handle asymmetry:** IG `deepsafe_` (underscore), TikTok `deepsafe`, YouTube `Deep-Safe` (hyphen) — three handle forms for one brand.
- **DeepSafe titles:** `<title>` `"DeepSafe - Impara la Sicurezza Digitale Giocando (Gratis)"`, `og:title` `"DeepSafe - Il Tuo Coach di Vita Digitale"`, `twitter:title` `"DeepSafe - Competenze Digitali per Tutti"` — three titles for one page.
- **CampFlow:** three titles likewise (`<title>` / `og:title` / `twitter:title` all differ).
- **Mountain Fauna Lover:** YouTube brand `"Mountain & Fauna Lover"` vs Instagram display name `"Magic Mountain"`.

---

## 4. Schema defects, per property

| Property | JSON valid | Double-enc. | Person `@id` | Org node | SoftwareApp | `og:image` | Headline defect |
|---|---|---|---|---|---|---|---|
| Hub | ✅ 8 blocks, 0 errors | ✅ false | canonical, but only 2/5 pages | 4 anonymous UniVR nodes | n/a | 200 (507 KB — heavy) | `worksFor` asserts **employment**; FAQPage answers are stale; no `ScholarlyArticle` on `/blog/publications/` |
| MFL vercel | ✅ 1 block | ✅ false | `localhost:3000/#person` | `localhost:3000/#organization` | n/a | **UNREACHABLE** | Whole deployment emits `localhost:3000` — 76 occurrences, 0 of the real host |
| DeepSafe | ✅ (once decoded) | ✅ false | **none** | **none** | ✅ but JS-only | **404** (`deepsafe.app`, dead domain) | **JSON-LD is `next/script` client-injected — 0 `application/ld+json` in served HTML** |
| Evolve | ✅ 1 block, 5 nodes | ✅ false | fork `#simone-mattioli` | none (deliberate) | ✅ rich | 200, 1200×630 | No `image`/`screenshot`/`aggregateRating` on the app node |
| Wealth Compass | ✅ 1 block | ✅ false | **canonical ✅** | none | ✅ very complete | 200 | Restates the full Person on satellites; `Person.image` diverges from the hub |
| Ping-Pong-Counter | ✅ 1 block, 10 types | ✅ false | fork `#author` | none | ✅ | 200 | Person node has 4 keys; `sameAs` has 1 entry; `url` → GitHub, not his site |
| Local-File-Diet | ✅ 1 block | ✅ false | **`NO_ID`** | none | ✅ but **no `offers`** | 200 (one EN image for 4 locales) | Author is `{"@type":"Person","name":"Simone Mattioli"}` — literally that, on 8 pages |
| SafeSpotter | ✅ 1 block, 3 nodes | ✅ false | **`NO_ID`** | none | ✅ thin (15 keys) | 200 | **No `@id` on any node**; no `@graph`; no `WebPage`; 3 of 4 URLs carry zero JSON-LD |
| mattioli.OS | n/a — **0 blocks** | n/a | **none** | none | none | 200 but **4.38 MB** | Zero JSON-LD in HTML, in DOM, and in all 3 JS bundles (grep: 0 hits for `ld+json`, `schema.org`, `@type`, `sameAs`, `#person`) |
| CampFlow | ✅ 1 block | ✅ false | **`NO_ID`** | none | ✅ | **404** (path segment duplicated) | Self-serving `aggregateRating` 5.0/12; `sameAs` and `Organization` appear **0 times** in 62,420 bytes |

**Estate-wide facts:**
- **JSON-LD validity is not a problem.** Every block that exists parses cleanly. Double-encoding scan across every property and every off-site surface: **zero candidates. `doubleEncoded: false` everywhere.** Reporting this negative explicitly since it was a named audit object.
- **Two properties are structurally invisible to non-rendering crawlers.** DeepSafe injects JSON-LD via `next/script` (present only in the RSC flight payload as `dangerouslySetInnerHTML`); mattioli.OS serves a **2,304-byte shell whose entire body is `<div id="root"></div>`**, byte-identical across all 7 routes. GPTBot, ClaudeBot, CCBot and PerplexityBot do not execute JavaScript. For the exact audience this programme targets, 2 of 10 properties are blank pages.
- **Two fabricated-rating blocks are live.** DeepSafe: `ratingValue "4.8" / ratingCount "1250"` with no reviews in 1,906 chars of visible text. CampFlow: `ratingValue "5" / ratingCount "12"`, no review UI on the page. Both breach Google's review-snippet policy and are a documented cause of **site-wide** structured-data manual actions.
- **Apple types a human as a company.** All 6 App Store nodes emit `author: {"@type": "Organization", "name": "Simone Mattioli", @id: NO_ID}`, no `sameAs`. Not editable — must be mirrored from a surface he controls.
- **`aggregateRating 0 / reviewCount 0`** is published explicitly on all 6 apps (Apple-generated, not suppressible).

---

## 5. Technical SEO defects

### 5.1 robots.txt — one file governs eight properties

`https://simo-hue.github.io/robots.txt` (754 bytes) is the **only** operative robots file for the hub and all 7 github.io project properties. Six **inert** copies exist at subdirectory paths (`/evolve/`, `/wealth-compass/`, `/Ping-Pong-Counter/`, `/Local-File-Diet/`, `/SafeSpotter/`, `/mattioli.OS/`) plus one on DeepSafe. Per RFC 9309 none is ever fetched. Their real effect is to **mislead audits** — the Ping-Pong-Counter file contains an excellent modern agent list that no crawler will ever read.

**AI-crawler coverage gap in the operative file:**

| Agent | Named? | Notes |
|---|---|---|
| GPTBot, ChatGPT-User, Google-Extended, CCBot, Bingbot, Googlebot, PerplexityBot, YouBot | ✅ | |
| `anthropic-ai`, `Claude-Web` | ✅ | **Both legacy/retired tokens** |
| **`ClaudeBot`** | ❌ | **Anthropic's current production crawler — absent** |
| `Claude-User`, `Claude-SearchBot` | ❌ | |
| `OAI-SearchBot` | ❌ | Distinct from GPTBot; feeds ChatGPT search |
| `Applebot-Extended` | ❌ | Notable for an App Store developer |
| `meta-externalagent`, `Amazonbot`, `Bytespider`, `cohere-ai`, `Perplexity-User`, `DuckDuckBot`, `Applebot` | ❌ | |

Access is **not** blocked — `User-agent: * / Allow: /` catches everything, and a live fetch with a ClaudeBot UA returned 200. The cost is that a file advertising itself as *"Optimized for search engines and AI crawlers"* omits the most relevant crawler, and the allowlist will not survive any future tightening of the wildcard group.

**Two further defects in the same file:**
- `Crawl-delay: 1` sits after the `User-agent: YouBot` group, so it binds to **YouBot alone**, not site-wide as its comment claims. Googlebot ignores it regardless; GitHub Pages is CDN-fronted and needs no throttle.
- `Disallow: /*.json$` in the wildcard group **blocks `/mattioli.OS/manifest.json`**, the PWA manifest.

**The best robots.txt in the estate is on the broken property.** MFL's names **15 agents** including `ClaudeBot`, `OAI-SearchBot`, `Applebot-Extended`, `Meta-ExternalAgent`, `Amazonbot`, `Bytespider`, `cohere-ai`, `Perplexity-User`. Copy that agent list to the hub root rather than writing one from scratch. (MFL's own file has `Host: http://localhost:3000` and `Sitemap: http://localhost:3000/sitemap.xml` — and the `Host` directive is malformed regardless, since it takes a bare hostname.)

### 5.2 Sitemaps — 54+ real URLs are undiscoverable

Root robots.txt declares **exactly one** sitemap: `https://simo-hue.github.io/sitemap.xml` (118 `<url>`, not a sitemapindex).

Grep results against that file **[V]**: `evolve` = 0, `wealth-compass` = 0 property URLs (only the blog post `/blog/tech-projects/wealth-compass/`), `Ping-Pong-Counter` = 0, `Local-File-Diet` = 0, `SafeSpotter` = 0, the live `mattioli.OS/` app URL = 0 (only the blog post), CampFlow demo = 0 (only the blog post).

| Property | Own sitemap | URLs | Declared anywhere a crawler reads? |
|---|---|---|---|
| Evolve | ✅ 25 URLs, 150 `xhtml:link`, x-default on all | 25 | ❌ |
| Local-File-Diet | ✅ | 10 | ❌ |
| mattioli.OS | ✅ | 7 | ❌ |
| Wealth Compass | ✅ | 6 | ❌ |
| SafeSpotter | ✅ | 4 | ❌ |
| Ping-Pong-Counter | ✅ | 1 | ❌ |
| CampFlow | ❌ 404 | 0 | ❌ |
| DeepSafe | ✅ 200 — **but all 6 `<loc>` are `deepsafe.app`** | 0 usable | ❌ |
| MFL | ✅ 18 URLs — **all 18 `<loc>` are `localhost:3000`** | 0 usable | Declared, but 100% invalid |

**~54 real URLs sit outside every discoverable sitemap.** Meanwhile the one discoverable sitemap spends **41 of its 118 entries (35%) on `/tags/` archives** and includes `/offline/`, a service-worker fallback shell. Composition: 41 tags, 60 blog, 9 passion, 8 other.

**Sitemap quality defects:** Evolve's 25 entries carry **zero `<lastmod>`** (though the server exposes `last-modified: Sun, 02 Aug 2026 14:50:12 GMT`); mattioli.OS hardcodes `2026-01-20` on every entry while the live index was modified `2026-07-16`; mattioli.OS lists 6 URLs without trailing slashes that all **301**.

### 5.3 Canonicals

| Property | `rel=canonical` **[V]** | Verdict |
|---|---|---|
| CampFlow | `https://campflow.app/w` → **GoDaddy parking lander** | **P0 — existential** |
| MFL (all pages) | `http://localhost:3000/en` etc. | **P0** |
| DeepSafe | **absent on both pages**; `og:url` = `https://deepsafe.app` (dead) | **P0** |
| mattioli.OS | **all 7 routes** → `https://simo-hue.github.io/mattioli.OS/` | **P1 — self-deindexes `/creator/`**, the only page carrying his identity |
| CampFlow (secondary) | 3 conflicting self-URLs: real `/CampFlow/`, canonical `campflow.app/w`, `og:url` `/CampFlow` (301s) | P2 |
| Hub, Evolve, Wealth Compass, PPC, LFD, SafeSpotter | Self-referential and correct | ✅ |

### 5.4 hreflang — Local-File-Diet as the i18n template

LFD's **HTML head is correct and is the template to copy**: 5 reciprocal tags, `en / it / es / de / x-default`, x-default → the English root, self-referential canonicals per locale, 4 real localised H1s.

Three defects to fix *before* it becomes the template:
1. **`og:locale` uses bare language codes** — `en`, `it`, `de`, `es`. The Open Graph spec requires `language_TERRITORY`: `en_US`, `it_IT`, `de_DE`, `es_ES`. Also no `og:locale:alternate` anywhere.
2. **Sitemap `xhtml:link` blocks omit `x-default`** though the HTML includes it — the two clusters disagree in shape.
3. **One English `og.png` serves all four locales** (verified 200, 1200×630, 32,439 B) — Italian, German and Spanish pages share an English creative.

**Evolve's *sitemap* is the better half of the template**: 25 entries, 150 `xhtml:link` alternates, `x-default` on all 25. **Composite template = LFD's head + Evolve's sitemap + `og:locale` fix.**

Elsewhere: MFL has *two contradicting hreflang clusters* — a **correct** one in the HTTP `Link` header on the real host, and a localhost one in the HTML, with `x-default` disagreeing (`/` vs `/it`). The hub has **zero hreflang tags and zero `og:locale:alternate`**, yet already ships `https://simo-hue.github.io/passion/technology_it/` in its sitemap — an orphaned Italian variant with no reciprocal pair, which search engines will read as thin/near-duplicate content rather than a locale alternate.

### 5.5 Dead demo domains

- **`deepsafe.app`** — DNS 192.64.119.242 (Namecheap). **Port 443 times out**, verified 3× (connect time 0.000000, never established). Port 80 → `HTTP/1.1 302, Location: http://www.deepsafe.app/, X-Served-By: Namecheap URL Forward`; that also times out. All 6 sitemap `<loc>`s, `og:url`, `og:image` and the robots `Sitemap:` line point here.
- **`campflow.app`** — GoDaddy parking. CampFlow's `rel=canonical` points here.
- **`localhost:3000`** — 76 occurrences on MFL `/en`, 0 of the real host.

---

## 6. GEO-specific gaps

### 6.1 llms.txt coverage matrix

| Property | `llms.txt` | Size | Quality |
|---|---|---|---|
| **Evolve** | ✅ 200 | 15,452 B | **Best in estate.** Spec-shaped; build-generated by `tools/llms.js` from the same content that builds the site, so it cannot drift. Names Simone Mattioli, lists 8 verified profiles incl. ORCID/Scholar/SciProfiles, 25 per-locale page links, 8 Q&A mirroring the FAQPage, states the AI-coach data-retention caveat openly. |
| **Ping-Pong-Counter** | ✅ 200 + `llms-full.txt` | 3,087 / 14,987 B | Excellent. Includes a *"What it does not do"* negative-scope section — rare and highly citable. |
| **MFL** | ✅ 200 | 2,274 B | Strong prose, **all 10 links `localhost:3000`**, zero mention of `simo-hue.github.io`. |
| **Hub** | ⚠️ 200 | 1,562 B | **3 of 7 Key-pages links are hard 404s (43%)**, including Publications. |
| Wealth Compass | ❌ 404 | | |
| Local-File-Diet | ❌ 404 | | |
| SafeSpotter | ❌ 404 | | |
| mattioli.OS | ❌ 404 | | Worst case — the property serves nothing to non-rendering agents, so llms.txt is the *only* channel |
| CampFlow | ❌ 404 | | |
| DeepSafe | ❌ 404 at both roots | | Same problem: JSON-LD is JS-only |
| Hub `llms-full.txt` | ❌ 404 | | |

**The hub `llms.txt` — the identity file — mentions none of:** Evolve, Wealth Compass, Ping Pong Counter, SafeSpotter, Local File Diet, Warranties Vault, mattioli.OS, CampFlow, DeepSafe, Mountain Fauna Lover, the App Store developer page, ORCID, Google Scholar, or the DOI. Verified by grep: `"wealth"` = 0, `"ping"` = 0, `"evolve"` = 0, `"Local File Diet"` = 0, `"SafeSpotter"` = 0, `"campflow"` = 0, `"Mattioli.OS"` = 0.

**Its Contact block lists 4 URLs** (GitHub, LinkedIn, YouTube, email) — it is **thinner than the JSON-LD it should mirror**, which itself is thinner than `/links/`.

### 6.2 The entity is never stated as an extractable fact

**No file anywhere in the estate states the canonical Person URI in plain text.** Not one `llms.txt` contains the line `Canonical Person entity: https://simo-hue.github.io/#person`. Nowhere is `"Simone Mattioli is a co-author of DOI 10.3390/bdcc10040117"` written as a plain-text sentence. Nowhere is `"Simone Mattioli founded DeepSafe"` or `"Simone Mattioli founded Mountain Fauna Lover"` written at all.

The GitHub profile README is the clearest example: the name appears **exactly once**, URL-encoded inside a third-party badge image src — `lines=Hi%2C+I'm+Mattioli+Simone;…` — and nowhere as crawlable page text. The README is otherwise almost entirely shields.io / streak-stats / trophy / activity-graph images.

Likewise: **none of the four App Store descriptions contains the string `"Simone"` or `"Mattioli"`.** Only Evolve contains a URL at all, and only in the legal footer.

### 6.3 FAQ / QAPage inventory

| Property | Visible FAQ | `FAQPage` markup | Note |
|---|---|---|---|
| Evolve | 8 Q&A | ✅ + mirrored in `llms.txt` | The house standard |
| Ping-Pong-Counter | 12 Q&A | ✅ | |
| Hub homepage | 3 Q&A | ✅ | **Answers assert the stale fact** — see §8.5 |
| **SafeSpotter** | **8 questions in `<details>/<summary>`** | ❌ **none** | **Highest-value quick win in the estate** |
| Wealth Compass | `/faq/` page exists | ❌ not reported | Verify and mark up |
| MFL | ✅ FAQPage | ⚠️ on the localhost graph | Fixed by the metadataBase change |
| LFD, CampFlow, mattioli.OS, DeepSafe | — | ❌ | |

SafeSpotter's 8 verbatim questions are exactly the extractable passages AI answer engines cite: *"Does SafeSpotter track my location?"*, *"Can you see what I store?"*, *"Do I need iCloud?"*, *"What happens if I lose my iPhone?"*, *"Is it really free?"*, *"What is Discreet Mode?"*, *"Does it work offline?"*, *"Which devices does it run on?"*

### 6.4 Citability of the academic asset

`/blog/publications/` — the highest-authority content on the entire estate — carries **exactly one JSON-LD block, a `BreadcrumbList`**. Grep for `ScholarlyArticle`, `Dataset`, `doi.org`, `arxiv`: **zero matches**. The publication exists as visible prose only. Meta description: `"Academic publications and research articles."` — 39 characters, no entity name, no topic, no institution.

MDPI compounds this: the article page's JSON-LD carries only `headline`, `author`, `datePublished`, `publisher`; all four author `Person` nodes are `NO_ID` with no `sameAs`, no `identifier`, no `affiliation`. His node is literally `{"@type": "Person", "name": "Simone Mattioli"}`. **His ORCID exists on that page only as an HTML `<a href>` — deliberately omitted from the structured data.** Not fixable by him; the compensation is on the hub.

**Content depth (context, not fully audited):** the 16 thin posts named in the strategy were **not enumerated in the supplied data**. What is verified: 60 of 118 sitemap URLs are `/blog/`, 41 are `/tags/`.

---

## 7. Prioritised remediation plan

Ordered strictly by leverage-per-effort within each phase. **Effort** is a rough hours estimate.

### Phase 1 — Entity consolidation

| ID | Surface / file | Change | Verify | Effort |
|---|---|---|---|---|
| **ENT-01** | CampFlow Next.js `app/layout.tsx` metadata | `metadataBase = new URL('https://simo-hue.github.io/CampFlow/')`; `alternates.canonical = '/'`. **Removes the canonical pointing at a GoDaddy parking page.** Also fixes `og:url` and the `/CampFlow/CampFlow/` og:image duplication in the same change. | `curl -sSL https://simo-hue.github.io/CampFlow/ \| grep -Eo '(canonical\|og:url\|og:image)[^>]*'` — all three must read `https://simo-hue.github.io/CampFlow/`; then `curl -sSI` the og:image → 200 `image/png` | 0.5 |
| **ENT-02** | Vercel → Project Settings → Environment Variables (Production) | Set the site-URL env var to `https://mountain-fauna-lover.vercel.app`; wire into `metadataBase` and the robots/sitemap/llms.txt/JSON-LD generators; redeploy. **One change fixes 76 broken values**: canonical, 3 hreflang, og:url, og:image, twitter:image, every `@id`, robots `Host`+`Sitemap`, 18 sitemap `<loc>`, 10 llms.txt links. Add a build assertion that fails if the resolved base URL contains `localhost`. | `curl -sSL https://mountain-fauna-lover.vercel.app/en \| grep -c localhost` → **0** | 1 |
| **ENT-03** | ORCID → Names | Given names `simone` → **`Simone`**; set **`credit-name` = `Simone Mattioli`** explicitly (downstream systems prefer credit-name when present). **Blocks several later tasks.** | Public API: `person.name.given-names.value == "Simone"`, `credit-name.value == "Simone Mattioli"` | 0.2 |
| **ENT-04** | Google Scholar → profile | **Delete the RoBERTa-CSS paper** (`10.1108/tr-05-2025-0550`, Tourism Review 81(1) 167-187, by T Yang & CHC Hsu). Then Settings → change article updates from *"Apply updates automatically"* to *"Don't automatically update"*. Also change display name `Mattioli Simone` → `Simone Mattioli`. | Profile shows 1 article, 0 citations, h-index 0, name `Simone Mattioli` | 0.2 |
| **ENT-05** | Hub — Hugo template emitting the homepage `@graph` | **Rebuild the canonical Person node.** Add the full `sameAs` union from §2.1; add the ORCID `identifier` PropertyValue; **remove `worksFor`** (he is not employed by UniVR); `alumniOf` = UniVR (BSc, completed 2025-10-17) + ELTE + KTH as separate `EducationalOrganization` nodes with the EIT Digital programme; `jobTitle` per the agreed positioning. Give the `WebSite` node `@id https://simo-hue.github.io/#website` (it currently has none). | Parse the block; assert `sameAs.length == 17`, `worksFor` absent, `#website` present | 2 |
| **ENT-06** | Hub `/links/` | **Change the TikTok href** from `https://www.tiktok.com/@mountainfaunalove` to `.../@mountainfaunalover`. Confirm ownership on the logged-in profile first. | `curl \| grep tiktok` → only the with-*r* form | 0.1 |
| **ENT-07** | Hub `static/robots.txt` | Add explicit `Allow: /` groups for **`ClaudeBot`**, `Claude-User`, `Claude-SearchBot`, `OAI-SearchBot`, `Applebot-Extended`, `Applebot`, `meta-externalagent`, `Amazonbot`, `Bytespider`, `cohere-ai`, `Perplexity-User`, `DuckDuckBot` — copy the 15-agent list already working on MFL. Keep `anthropic-ai`/`Claude-Web` as legacy aliases. **Delete `Crawl-delay: 1`.** Narrow `Disallow: /*.json$` → `Disallow: /searchindex.json` so the PWA manifest is crawlable. Add **7 extra `Sitemap:` lines** (evolve, wealth-compass, Ping-Pong-Counter, Local-File-Diet, SafeSpotter, mattioli.OS, and CampFlow once it emits one). | `curl https://simo-hue.github.io/robots.txt \| grep -c '^Sitemap:'` → 8; `grep -c '^User-agent: ClaudeBot$'` → 1 | 0.5 |
| **ENT-08** | Hub `static/llms.txt` | Fix the 3 404 links (`tech-project` → `tech-projects`, `publication` → `publications`, `experience` → `experiences`). Add `## Apps` (6 App Store URLs + the developer page `id1896746638`), `## Projects` (mattioli.OS, CampFlow, DeepSafe, Mountain Fauna Lover), `## Research` (ORCID, Scholar, OpenAlex, SciProfiles, DOI `10.3390/bdcc10040117`). Add near the top: `Canonical Person entity: https://simo-hue.github.io/#person`. Align the bio to the one canonical sentence. **Add a CI step that curls every URL in llms.txt and fails the build on non-200.** | CI green; `grep -c 'apps.apple.com'` > 0 | 1.5 |
| **ENT-09** | Evolve `content/*/index.json` → `build.js` | Change Person `@id` `https://simo-hue.github.io/evolve/#simone-mattioli` → `https://simo-hue.github.io/#person`; update the 4 references (`SoftwareApplication.author/creator/publisher`, `WebSite.publisher`). **Merge Evolve's 7 `sameAs` up into the hub node — do not delete them.** Rebuild all 5 locales; keep the `@id` **language-neutral** (Evolve already does this correctly). | All 5 locales grep-match the canonical string; 0 hits for `#simone-mattioli` | 0.5 |
| **ENT-10** | Ping-Pong-Counter source | `#author` → `https://simo-hue.github.io/#person`. Set `url` to `https://simo-hue.github.io/`. Add `isPartOf: {"@id":"https://simo-hue.github.io/#website"}` to the property `WebSite` node. | grep the deployed HTML | 0.3 |
| **ENT-11** | Local-File-Diet (4 locale homepages + 4 support pages) & SafeSpotter & CampFlow | Add `"@id": "https://simo-hue.github.io/#person"` to the author node. SafeSpotter additionally: restructure to `@graph` with `#app` / `#website` / `#webpage` ids. **The `@id` must be byte-identical everywhere — no trailing slash before the fragment, no locale prefix, no `#author` variant.** | grep all 10 pages for the exact 34-char string | 1 |
| **ENT-12** | DeepSafe & CampFlow JSON-LD | **Remove `aggregateRating` from both** (DeepSafe 4.8/1250; CampFlow 5/12). Neither is backed by visible reviews; both risk a site-wide manual action. **Do this before ENT-16 attaches `founder → #person`.** | grep `aggregateRating` → 0 on both | 0.2 |
| **ENT-13** | Hub Hugo `baseof.html` | Emit a Person stub `{"@type":"Person","@id":"https://simo-hue.github.io/#person"}` on every page. Wrap `/links/` as a `ProfilePage` with `mainEntity → #person`; add a `Blog` node on `/blog/` with `author → #person`. | `#person` present on all 5 hub pages | 1 |
| **ENT-14** | GitHub `simo-hue` profile | Name field `Mattioli Simone` → **`Simone Mattioli`**. Add ORCID + Verona/KTH/ELTE + "iOS developer" to the bio. Add a plain-text `# Simone Mattioli` H1 and one crawlable bio sentence to the profile README (currently the name appears only inside a badge image URL). | `api.github.com/users/simo-hue` → `"name": "Simone Mattioli"` | 0.5 |
| **ENT-15** | Semantic Scholar author `2429558651` | Claim the page **via ORCID** (this writes the ORCID into `externalIds`, which is what holds the identity apart). Then remove the 2015 Bitcoin paper (`441da9d4b69188e86a5efa0e4b8f140f732074b1`). Fallback: `feedback@semanticscholar.org`. **Only then** add the S2 URL to `sameAs`. | `externalIds.ORCID` populated; `paperCount == 1` | 0.5 + wait |
| **ENT-16** | mattioli.OS `index.html` `<head>`; DeepSafe `app/layout.tsx` | Emit a **static, server-rendered** `@graph` — not `next/script`, not React-injected. `SoftwareApplication` + `Organization` (`@id .../#organization`, `founder: {"@id":"https://simo-hue.github.io/#person"}`) + a Person reference. For DeepSafe use a literal `<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />` in the Server Component. | `curl -sSL <url> \| grep -c 'application/ld+json'` ≥ 1 **against the raw HTML** | 1.5 |
| **ENT-17** | mattioli.OS | **Per-route canonicals.** All 7 routes currently emit the homepage canonical, which deindexes `/creator/` — the only page carrying his identity. Ship this even before prerendering (CON-06). | `curl` `/creator/` → `canonical` = `…/mattioli.OS/creator/` | 0.5 |
| **ENT-18** | SciProfiles → profile settings | Remove the **`Dr.`** honorific (it is the `schema.org Person.name` value). If the field is not user-editable, email `sciprofiles.com/contact` — lead with this, mention the dangling `isPartOf` node as a secondary. Also add bio + affiliation. | Page `<title>` and JSON-LD `Person.name` == `Simone Mattioli` | 0.3 + wait |
| **ENT-19** | ORCID | Biography 60–100 words (Verona CS, BSc 2025, next-POI recommendation, spatio-temporal reasoning, tourist mobility, open-source LLMs, HPC, the Verona 2014-2023 dataset). Replace keywords `LLM`, `AI` with 8–10 specific terms. Fix education org `University of verona` → `University of Verona` **via the typeahead** so ROR `039bp8j42` attaches. Date the employment entry. Add researcher-urls: SciProfiles, OpenAlex `A5133501663`, Semantic Scholar. Rename `Git-Hub` → `GitHub`. Enable Crossref auto-update. | Public API reflects all of the above | 1 |
| **ENT-20** | Hub `@graph` | Give **University of Verona one `@id`** — `{"@type":"CollegeOrUniversity","@id":"https://www.univr.it/#organization","sameAs":["https://www.univr.it/","https://en.wikipedia.org/wiki/University_of_Verona","https://www.wikidata.org/wiki/Q1148037"]}` — and replace the other 3 occurrences with a bare `{"@id": …}` reference. | Graph contains 1 UniVR node, not 3 | 0.3 |
| **ENT-21** | Hub `/blog/publications/` | **Reconcile the paper first (see §8.9).** Then add an `ItemList` of `ScholarlyArticle` with `headline`, `datePublished`, `abstract`, `identifier` = the DOI, `author: {"@id":"…/#person"}`, `sameAs` to the MDPI/Scholar records, and co-author names in correct order. Mirror into `Person.subjectOf`. Rewrite the 39-char meta description. | Rich Results Test parses the ScholarlyArticle; DOI present | 1.5 |
| **ENT-22** | Wikidata | Create the **scholarly-article item first** (DOI `10.3390/bdcc10040117`, 4 authors, corresponding Migliorini), then the author item with `ORCID iD (P496) = 0009-0006-5047-8004`, `GitHub (P2037) = simo-hue`, `Google Scholar (P1960)`, `OpenAlex (P10283) = A5133501663`, official website. **He is second of four — model it that way; never as sole author.** | Both items resolve; add the Wikidata URI to `sameAs` afterwards | 2 |

### Phase 2 — Content depth

| ID | Surface | Change | Verify | Effort |
|---|---|---|---|---|
| **CON-01** | Hub homepage FAQPage | **Rewrite all 3 answers.** They currently say *"Simone Mattioli is a Computer Science student at the University of Verona"* and *"Simone Mattioli studies at the University of Verona"* — the most extractable structure on the site, serving the wrong answer. Replace with graduate + current EIT Digital master's (ELTE → KTH). | Fetch and read the `Answer.text` values | 0.3 |
| **CON-02** | SafeSpotter | Add `FAQPage` `@id .../#faq` with the **8 existing visible questions**, `mainEntity` Q&A text matching the rendered copy verbatim, `isPartOf → #webpage`, `about → #app`. Zero new content needed. | Rich Results Test | 0.5 |
| **CON-03** | Hugo `data/entity.yaml` (new) | **One source of truth.** Render Person JSON-LD, FAQ answers, meta descriptions and llms.txt from the same data file so the four can never drift again. This is the structural fix behind CON-01 and ENT-08. | Change one value; confirm it propagates to all four outputs | 2 |
| **CON-04** | 16 thin posts | Expand to 600+ words each. **[Note: the 16 posts were not enumerated in the audit data — identify them first.]** Prioritise `/blog/tech-projects/*` and `/blog/publications/*` for the professional entity. | Word count per post | high |
| **CON-05** | Hugo taxonomy term template + sitemap | `<meta name="robots" content="noindex, follow">` on `/tags/`; drop from sitemap. **41 of 118 URLs (35%) recovered** for the 54 real URLs currently outside sitemap discovery. Also exclude `/offline/`. | Sitemap count drops to ~77; tag pages return `noindex` | 0.3 |
| **CON-06** | mattioli.OS build | **Prerender.** `vite-plugin-prerender` / `vite-react-ssg`, or move the marketing shell to Astro. One static HTML per route with its own H1, title, description, canonical and the ENT-16 JSON-LD. Currently 7 routes serve a byte-identical 2,304-byte shell. | `curl -sSL <url> \| grep -o '<h1[^>]*>'` returns a match on each route | 3 |
| **CON-07** | 4 App Store descriptions | Append `Made by Simone Mattioli — https://simo-hue.github.io/`. **This is the only author-editable part of the App Store surface** and turns 4 indexed pages into 4 explicit name+URL corroborations. None currently contains `"Simone"` or `"Mattioli"`. | Read back the live listing | 0.3 |
| **CON-08** | 6 shipped-app GitHub repos | Add the `apps.apple.com` URL to each repo description and README. **Currently 0 of 59 repos link to the App Store.** Add an "App Store apps" section to the profile README. Standardise all repo descriptions on English; close the unterminated quote in `evolve`. | `gh api` scan for `apps.apple.com` across repos | 1 |
| **CON-09** | 26 repos with no `homepage`; 3 with no description | Set `homepage`; where nothing is deployed, point at the relevant blog post. Extend the `simonemattioli`/`mattiolisimone` topic pair beyond the current 5 repos. | `gh api users/simo-hue/repos` audit | 1 |
| **CON-10** | Evolve, Wealth Compass, LFD, SafeSpotter, mattioli.OS, CampFlow, DeepSafe | Ship `llms.txt` per property, **cloning the Evolve generator (`tools/llms.js`)** so the file is build-generated and cannot drift. Each must state the canonical Person URI. | All 10 properties return 200 on `/llms.txt` | 2 |
| **CON-11** | Evolve H1 | `"Migliora ogni giorno, diventa chi sei destinato ad essere."` contains no brand, no `abitudini`, no `obiettivi`. Reseat the entity+category: `"Evolve: migliora ogni giorno. Il tracker di abitudini e obiettivi per iPhone, iPad e Mac."` Edit the 5 locale JSON files. | Fetch the H1 | 0.3 |
| **CON-12** | Evolve / SafeSpotter / LFD app nodes | Add `image`, `screenshot`, `installUrl`, `datePublished`/`dateModified`, `softwareVersion`, `identifier` (App Store id), `sameAs` to the App Store listing. LFD needs `offers` (`price 0`) — currently ineligible for app rich results. **Add `aggregateRating` only from real App Store data; never synthesise.** | Rich Results Test | 1 |
| **CON-13** | Assets | Compress hub `og-image.png` (507 KB → <200 KB); mattioli.OS `logo.png` **4.38 MB / 2560×1440** → 1200×630 <300 KB; mattioli.OS `favicon.png` 692 KB → <10 KB. Add `og:image:alt` sitewide; fix `/about/` `og:title` (currently `"Hey There!"`); `/links/` `og:type` `article` → `profile`. | `curl -sSI` content-length | 0.5 |

### Phase 3 — Italian parity

| ID | Surface | Change | Verify | Effort |
|---|---|---|---|---|
| **ITA-01** | Hugo `config.toml` | Switch to **native multilingual** (`defaultContentLanguage` + `languages` block) so `.Translations` drives hreflang automatically. **Abandon the `_it` filename-suffix pattern** — it is what orphaned `/passion/technology_it/`. | `hugo --printI18nWarnings` clean | 1 |
| **ITA-02** | Hugo `head.html` partial | Emit self-referential + reciprocal hreflang on every translated page: `en`, `it`, `x-default` → the EN URL. **Copy the Local-File-Diet head pattern.** | Both variants carry a matching 3-tag cluster | 0.5 |
| **ITA-03** | `/passion/technology_it/` | Pilot: pair it with `/passion/technology/`. It is currently in the sitemap with **no reciprocal hreflang** — read as near-duplicate/thin. | hreflang validator on the pair | 0.3 |
| **ITA-04** | All properties, all locales | **`@id` values must stay language-neutral.** `https://simo-hue.github.io/#person` on the Italian pages too — never `/it/#person`. Evolve already does this right across 5 locales; Local-File-Diet's 4 locales are being given an `@id` for the first time in ENT-11, which is exactly where it can go wrong. | grep the IT pages for the canonical 34-char string | — |
| **ITA-05** | Professional pages first | `/about/`, `/blog/publications/`, `/blog/tech-projects/` → IT before the lifestyle content. | Both locales resolve 200 with matching schema | high |
| **ITA-06** | Local-File-Diet | Fix `og:locale` bare codes → `en_US` / `it_IT` / `de_DE` / `es_ES`; add `og:locale:alternate`; add `x-default` to the sitemap `xhtml:link` blocks; produce `og-it.png` / `og-de.png` / `og-es.png`. **This is the i18n template — fix it before copying it.** | Facebook Sharing Debugger per locale | 1 |
| **ITA-07** | Evolve sitemap | Add `<lastmod>` per URL from the git commit date of each source content file (currently zero across 25 entries). **Do not stamp every URL with the build timestamp** — uniform always-fresh values get discounted. | `grep -c lastmod` → 25 | 0.5 |
| **ITA-08** | Wealth Compass | **No hreflang today is CORRECT** — the site is English-only. But the app declares `inLanguage` for **35 locales** including `it`. If localised landing pages ever ship, start with `/it/`. **Do not add hreflang before the pages exist.** | — | — |

### Phase 4 — Satellites

| ID | Surface | Change | Verify | Effort |
|---|---|---|---|---|
| **SAT-01** | MFL (post-ENT-02) | Person `@id` → `https://simo-hue.github.io/#person`; Organization `@id` → `https://mountain-fauna-lover.vercel.app/#organization` with `founder: {"@id":"…/#person"}`; repoint `WebSite.creator`, `Person.worksFor`, `ProfilePage.mainEntity`. Add to llms.txt: `Founder's canonical profile: https://simo-hue.github.io/ (Person entity: https://simo-hue.github.io/#person)`. | grep for `localhost` → 0; grep for the canonical `@id` → present on `/en`, `/it`, `/en/founder` | 1 |
| **SAT-02** | DeepSafe (post-ENT-12, ENT-16) | Visible footer credit `Creato da Simone Mattioli` with `rel="author"` → `https://simo-hue.github.io/`. Change `<meta name="author">` from `"DeepSafe Team"` to `"Simone Mattioli"`. Organization with `founder → #person`. Fix `<html lang="en">` → `it` (all content is Italian, `og:locale` is `it_IT`). Add a canonical (currently absent on both pages). Repoint `og:url`/`og:image`/sitemap off the dead `deepsafe.app`. `noindex` or fill `/dashboard` (currently 14 chars of visible text, zero headings). Remove the `keywords` meta. | grep `Mattioli` → >0; canonical present; og:image 200 | 1.5 |
| **SAT-03** | YouTube channel Abouts ×3 | Add one positioning line each carrying `Simone Mattioli`, `AI researcher`, `KTH / ELTE EIT Digital`, and `simo-hue.github.io`. **Highest leverage on `@mountainfaunalover`** — the 12K-follower persona, and the only channel with no JSON-LD at all, so its About text is the sole machine-readable signal. | Fetch each channel's About | 0.5 |
| **SAT-04** | Instagram | Set `@simo___one` display name to **`Simone Mattioli`** (currently `Simone mattioli`). Align `@mountainfaunalover` display name `"Magic Mountain"` → `"Mountain & Fauna Lover"` to match YouTube. **Decide on `@simo___one`: it has 0 posts** — populate it or drop it from `sameAs`. | `facebookexternalhit` UA fetch of `og:title` | 0.3 |
| **SAT-05** | LinkedIn | **He must read his own headline while logged in** — the page is HTTP-999 walled and was not read. If a self-employed "TikTok" position is what Google indexes as his employer, retitle or reorder it. Fix the all-lowercase name. | Google `site:linkedin.com/in/simonemattioli2003` result title | 0.3 |
| **SAT-06** | Interview video `U9V8CkewXEY` | Ask Valerio Basilio to add `Simone Mattioli` + the site URL to the description. Currently `"Mattioli"` appears in neither title nor description and the description contains **zero URLs**. Fallback: a pinned comment from `@SimosDiary2003`. Then embed on the hub with `VideoObject` JSON-LD to claim the citation from a property he controls. | Substring test on the live description | 0.3 |
| **SAT-07** | GitHub `deep-safe` / `simo-hue/DeepSafe` | The project is **split across two accounts with two Pages sites**, and `deep-safe/DeepSafe`'s README clone URL points at `simo-hue/DeepSafe` — the wrong owner. Pick one home, archive the other with a redirect. Replace `"Built with 💙 by the Deepsafe Team"` with `Created by Simone Mattioli (https://simo-hue.github.io/)`. Add topics and a licence. | One live repo; clone URL matches its owner | 0.5 |
| **SAT-08** | `Mobl` repo + Warranties Vault | Rename repo `Mobl` → `warranties-vault` (GitHub auto-redirects); republish Pages; update the App Store support/privacy URLs. Fix the singular/plural drift — the description says "Warranty Vault" throughout while the store name is "Warranties Vault". | `simo-hue.github.io/warranties-vault/` → 200 | 0.5 |
| **SAT-09** | Google Search Console + Bing Webmaster | Verify `simo-hue.github.io`; **submit all 8 sitemaps directly.** GitHub Pages offers no ping mechanism, so GSC submission is the only lever for the ~54 orphaned URLs. Add `mountain-fauna-lover.vercel.app` and `deep-safe.github.io` as separate properties. | Sitemaps show "Success" with the expected URL counts | 0.5 |
| **SAT-10** | Hub | **Link out to the satellites.** The hub currently has `grep -c 'href="[^"]*evolve'` = **0** — zero outbound links and zero brand mentions for Evolve, and the same for the other apps. Evolve links *back* twice. The link graph is one-directional in exactly the wrong direction. | grep the hub HTML for each property URL | 0.5 |

---

## 8. What the strategy misses — adversarial reading

### 8.1 The Google Scholar profile is a research-integrity exposure, and it inverts the plan's ordering **[V]**

His Scholar profile lists 2 articles. The top one — *"An AI-driven framework for continuous tourist sentiment scoring… (RoBERTa-CSS)"*, Tourism Review 81(1), 167-187 — carries the byline **"T Yang, CHC Hsu"** on his own profile. OpenAlex confirms DOI `10.1108/tr-05-2025-0550` has exactly two authors: Tong Yang and Cathy H.C. Hsu. **He is not one of them.** That paper supplies **all 3 of his citations and his entire h-index of 1.** Strip it and his real metrics are 0 / 0 / 0.

This is almost certainly Scholar's auto-update misfiring on tourism+LLM topic overlap with his real paper. The cause does not matter. The consequence does: **consolidating `sameAs` to that profile makes a false authorship claim more machine-resolvable, not less.** Every model that reads it learns *"Simone Mattioli co-authored with Tong Yang and Cathy H.C. Hsu at Hong Kong PolyU."* ENT-04 must land before ENT-05.

### 8.2 Two properties currently canonicalise themselves to domains he does not own **[V]**

CampFlow's `rel=canonical` is `https://campflow.app/w` — a **GoDaddy parking lander for sale** (`window._trfd.push({ap:"parking"})`). MFL's is `http://localhost:3000/en`. The strategy correctly says no domain will be bought — but CampFlow is right now instructing Google to treat a domain squatter's page as its authoritative version, and to consolidate all its link equity there. This outranks everything in the entity model in urgency and takes half an hour to fix.

### 8.3 "Founder-track" has **zero** supporting evidence on any surface, and attaching it naively imports a policy violation **[V]**

The strategy positions DeepSafe as "his failed startup." Live state: `"simone"`, `"mattioli"`, `"simo-hue"`, `"Person"`, `"sameAs"` all return **0 occurrences** across both DeepSafe pages. `<meta name="author" content="DeepSafe Team">`. The YouTube channel and Instagram name no human. `deep-safe.github.io/DeepSafe` contains **zero social links**. The word `"founder"` appears on **none** of the five social surfaces.

Worse: DeepSafe publishes `aggregateRating 4.8 / ratingCount 1250` with no reviews in 1,906 characters of visible text, and CampFlow publishes `5.0 / 12`. **Attaching `founder → #person` to those properties before stripping the fake ratings would tie a Google structured-data policy violation — a documented cause of site-wide manual actions — directly to the canonical entity.** ENT-12 must precede SAT-02.

### 8.4 The best assets in the estate already exist — on the wrong properties **[V]**

- The estate's **best AI-crawler robots.txt** names 15 agents including `ClaudeBot`, `OAI-SearchBot`, `Applebot-Extended`, `Meta-ExternalAgent`, `Amazonbot`, `cohere-ai`. It is on **Mountain Fauna Lover**, whose `Sitemap:` and `Host:` lines point at localhost.
- The estate's **best `llms.txt`** is 15,452 bytes, spec-shaped, and **generated by `tools/llms.js` from the same content that builds the site so it cannot drift**. It is on **Evolve**, a property absent from every discoverable sitemap.
- The **second-best** ships an `llms-full.txt` and a *"What it does not do"* negative-scope section — rare, highly citable. It is on **Ping-Pong-Counter**, a property with exactly 1 sitemap URL, orphaned from all discovery.
- Meanwhile the **hub** — the identity file that everything is supposed to consolidate onto — is 1,562 bytes with **43% dead links**.

None of this needs to be written from scratch. It needs to be copied inward. That materially changes the effort estimate on ENT-08 and CON-10.

### 8.5 The hub's own FAQPage serves the wrong answer to the positioning question **[V]**

`FAQPage` answers on the homepage: *"Simone Mattioli is a Computer Science student at the University of Verona"* and *"Simone Mattioli studies at the University of Verona."* The same page's meta description says *"CS graduate and EIT Digital Master's student (ELTE, then KTH)."*

`FAQPage` is the single most extraction-friendly structure available. An LLM asked *"where does Simone Mattioli study?"* reads the FAQ, not the meta description, and answers **Verona**. This is not a gap to fill. It is a wrong answer being served in the most citable format on the site, and it directly contradicts the agreed positioning. It is a 20-minute fix and it is arguably the highest leverage-per-minute item in the whole audit.

### 8.6 LinkedIn may be indexed as an employee of TikTok — **[BLOCKED, unverified]**

Two independent WebSearch queries returned the result title `"simone mattioli - TikTok | LinkedIn"`. LinkedIn search titles follow `Name - Company | LinkedIn`, so **the indexed current-company field appears to read TikTok** — most plausibly because he listed his own TikTok creator activity as a position. **The page itself returned HTTP 999 to both curl and WebFetch and was never read.** No login or bypass was attempted.

I am flagging this as unverified because it cannot be confirmed without him. But if it is real, the highest-authority professional profile in the estate is telling Google his employer is TikTok — and that is a worse positioning signal than anything else found. It is not in the strategy and nobody anticipated it. **He should check it before anything else in Phase 4.**

### 8.7 He is losing the name contest on the only signal that matters, and cannot win it by name alone **[V]**

| | `simo-hue` (him) | `SimoneMattioli98` (Bologna, computer vision) |
|---|---|---|
| Name field | `Mattioli Simone` | **`Simone Mattioli`** ✅ |
| Name in crawlable README text | ❌ (only inside a badge image URL parameter) | ✅ (`name='Simone'`, `surname='Mattioli'`) |
| Name-matching personal domain | ❌ | ✅ `simonemattioli.vercel.app`, `<h1>Simone Mattioli` |
| Repos | 59 | 24 |
| Stars / followers | 20 / 21 | 5 / 6 |
| Recency | daily | dormant since Aug 2024 |

He wins every volume metric and loses **both** string-matching signals. Fixing the name field (ENT-14) contests the string with the stronger account — but name alone will not resolve it, because both accounts will then hold the identical string. **The differentiator has to be attributes: institution (Verona/KTH/ELTE vs Bologna) and domain (AI/LLM/HPC/iOS vs computer vision).** That has to be written into the bio, not just implied.

### 8.8 The academic-surface damage is worse than a naming problem, and one item is a false credential **[V]**

Three items nobody would have predicted:
- **SciProfiles asserts a doctorate.** `"Dr. Simone Mattioli"` is the `schema.org Person.name` value, not just page chrome. His ORCID shows his highest qualification is a BSc completed 2025-10-17. This is the **single most quotable wrong fact in his entire footprint**, it is machine-readable, and an LLM ingesting it will state it confidently.
- **Semantic Scholar has fused him with a stranger.** Author `2429558651` has `externalIds: {}` — no ORCID at all — and 2 papers, the second a 2015 Italian consumer-psychology study on Bitcoin and trust. His ORCID shows he was in high school from 2017. **He was roughly twelve.** S2 feeds a large number of LLM retrieval corpora; this specific merge is a **live, direct cause** of the confusion the programme exists to fix.
- **ORCID — the designated ground truth — spells his given name `simone`, lowercase,** with `credit-name` null and `other-names` empty, so there is no correctly-cased alternative anywhere in the record. Every record he sources himself renders `"simone Mattioli"`.

### 8.9 The publications page may be describing a different artefact than the DOI in the strategy **[V] + [I]**

The hub's `/blog/publications/` lists, in visible text only: *"Understanding and Predicting Tourist Behavior through Large Language Models"*, **dated Dec 15 2024**, with no DOI. The strategy names **DOI `10.3390/bdcc10040117`**, a BDCC/MDPI paper with 4 authors (Dalla Vecchia, **Mattioli**, Migliorini *corresponding*, Quintarelli). Those are not obviously the same artefact, and the dates do not align with the MDPI record's context.

**[I]** — this may be an earlier preprint, a thesis title, or a stale entry. Either way: **do not create the Wikidata scholarly-article item until this is reconciled.** Seeding Wikidata from a title that does not match the DOI's title creates a bad item that then propagates. Verify the DOI's actual `headline` against the page copy first.

### 8.10 The flagship research repo's homepage is probably a 404 **[I]**

`LLM-Tourism-Mobility-Predictor-HPC-A100` sets its homepage to `https://simo-hue.github.io/blog/publication/llm-tourism-mobility-predictor/` — **singular `publication`**, which is one of the three confirmed-404 path prefixes from the `llms.txt` audit (real section: `/blog/publications/`). Two verified datasets combine to imply this; **the deep path itself was not curled.** Check it. The GitHub repo for his one real paper pointing at a 404 is a particularly bad edge to leave in place.

### 8.11 A sixth property was never audited **[V]**

Six apps ship. Five landing pages were audited. **`https://simo-hue.github.io/Mobl/` (Warranties Vault) was not.** It is also the only paid app ($3.99), has 0 ratings, its slug carries no entity signal, and its own store listing calls it "Warranty Vault" (singular) throughout while the store name is plural. **Audit it before Phase 4 estimates are trusted.**

### 8.12 `worksFor` puts a false fact on the canonical node **[V]**

The hub's Person node declares `worksFor: {"@type":"EducationalOrganization","name":"University of Verona", department: Department of Computer Science}`. `schema.org/worksFor` means *employed by*. The same organisation is simultaneously `alumniOf` and `hasCredential.recognizedBy`. This asserts employment where the relationship is enrolment, on the one node the whole programme is consolidating onto — and it sits oddly next to a "founder-track" positioning.

### 8.13 Two of ten properties are literally blank to the crawlers this programme targets **[V]**

mattioli.OS serves a **2,304-byte shell** whose entire body is `<div id="root"></div>`, byte-identical across all 7 routes, with 0 JSON-LD in the HTML, 0 in the rendered DOM, and 0 hits for `ld+json` / `schema.org` / `@type` / `sameAs` / `#person` across all three JS bundles (1.77 MB + 164 KB + 23 KB). DeepSafe's JSON-LD exists only inside the RSC flight payload as a `next/script` client component. **GPTBot, ClaudeBot, CCBot and PerplexityBot do not execute JavaScript.** The permissive robots.txt on those two properties is worth nothing. Any future JSON-LD injected client-side will be equally invisible.

### 8.14 The Italian rollout does not start from zero — it starts from one broken artefact **[V]**

`https://simo-hue.github.io/passion/technology_it/` is **already in the sitemap**, with no hreflang pair, no `og:locale:alternate`, and `<html lang="en-us">`. It will be read as thin or near-duplicate content. The `_it` filename-suffix pattern that produced it will replicate the same orphaning at scale. ITA-01 (native Hugo multilingual) is a prerequisite, not a nice-to-have.

### 8.15 Crawl budget is allocated exactly backwards **[V]**

The one discoverable sitemap spends **41 of 118 entries (35%) on `/tags/` auto-generated near-duplicate archives** — the second-largest URL class on the property — plus `/offline/`, a service-worker shell. Meanwhile ~54 real URLs across 7 properties sit outside every sitemap a crawler can find. CON-05 is a 20-minute change that reclaims a third of the crawl allocation.

### 8.16 Nothing is being measured **[V]**

There is no mention anywhere in the data of Search Console or Bing Webmaster verification. GitHub Pages has no sitemap-ping mechanism, so **direct GSC/BWT submission is the only discovery lever available** for the orphaned URLs — and Bing's index is what feeds Microsoft Copilot citations. SAT-09 is 30 minutes and gates the measurability of every other task in this plan. It arguably belongs in Phase 1.

### 8.17 Instagram `@simo___one` has **0 posts** — and it is in the canonical `sameAs` **[V]**

1,052 followers, 115 following, **0 posts**. An empty profile bearing his real name is a weak-to-negative entity signal, and it is currently one of only five entries on the canonical node. Either populate it or drop it. Related: `@mountainfaunalover` — his largest audience at 12K followers — displays as `"Magic Mountain"`, a third brand name for the same persona.

---

**Files referenced in this analysis are all remote URLs; no local files were written.**