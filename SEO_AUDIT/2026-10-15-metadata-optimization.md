# SEO and AI discoverability — 15 October 2026

## Agreed scope

Prioritize accurate results for **Simone Mattioli**, then discovery for software-development and applied-AI employment or internships. Simone confirmed the positioning **software developer and AI enthusiast**, with interests in machine learning, deep learning and neural networks. He currently studies Autonomous Systems and Intelligent Robots at ELTE through EIT Digital; KTH is planned for August 2027. Research experience is supported by his co-authored paper, without presenting “AI researcher” as his job title.

Preserve all visible website copy, layouts, links, images, interactions and internal search results. Metadata, structured data, indexing rules and the optional AI orientation file are in scope. Changes to public profiles, repository biographies, app sites, article prose, translations and a custom domain are outside this implementation. These current decisions supersede the older audit's proposed positioning and content-expansion programme for this task.

## Evidence and changes

The audit inspected repository source and fetched the published homepage, About, Projects, Links, robots.txt, llms.txt and sitemap.xml on 2026-10-15. Published output confirmed stale study-status instructions, hidden FAQ markup and year-0001 article dates on non-article pages. All eight sitemap URLs advertised in robots.txt returned HTTP 200. The initial Python HTTPS request failed because the local Python trust store lacked the issuer certificate; verification was completed using curl with normal certificate verification.

| Finding | Implemented response |
| --- | --- |
| AI-facing biography called Simone an AI researcher and incoming ELTE student; llms.txt explicitly denied current enrolment | User-confirmed identity and status in `data/entity.yml`; regenerated metadata and llms.txt; KTH remains planned |
| Identity facts had no meaningful review timestamp | Added an explicit facts-review date; removed the misleading build-time freshness date from llms.txt |
| Homepage search title was broad and About title only said “About” | Added descriptive, head-only titles and descriptions; social previews use the same titles |
| About only carried an identity stub | Full canonical Person data now appears on both homepage and About, with the same `https://simo-hue.github.io/#person` identifier |
| Person used the general sharing card as its portrait and a potentially outdated residential location | Uses the existing About portrait; omits the residential-address assertion |
| Homepage emitted an FAQ visitors could not read | Removed the FAQ script and its unused data; did not add visible content |
| Homepage emitted a separate scholarly record with disconnected author names | Full scholarly metadata lives on the actual publication page; Simone's author entry uses his canonical Person ID |
| Scholarly article presented the website owner as the journal publisher | Publisher is MDPI; four-author order and DOI are retained |
| All 16 technical blog stories were classified as software applications | Technical stories now use BlogPosting; the publication remains ScholarlyArticle |
| Projects lacked a machine-readable account of its portfolio | Added CollectionPage/ItemList markup for the eight products already visible on the page, attributed to Simone |
| Non-article pages emitted article dates, including invalid year 0001 | Article metadata is restricted to blog posts; absent dates are omitted |
| Every sharing image claimed 1200×630 dimensions | Page-resource images use their actual dimensions; unmeasured fallback dimensions are omitted |
| Posts under 130 words were automatically excluded from search | Removed the word-count rule; restored eligibility for Tallinn kick-off and Budapest trip pages |
| Empty border-crossing page and unfinished Sicily notes still need exclusion | Explicit `seo_noindex` flags preserve external exclusion without changing Spotlight discovery |
| Every generic page asserted that its subject was Simone | Generic pages use author attribution; personal profile/portfolio pages retain an explicit subject link |
| No deployment guard for SEO regressions | Added standard-library Python output checks and a workflow step before upload/deployment |

The main sitemap grows from **76 to 78 URLs**. This is eligibility and discovery metadata, not confirmation that a search engine has indexed those pages.

## Verification

- Production build passed using the project's build command and an isolated output directory, `.tmp/seo-final` (Hugo reports 602 pages across output formats).
- **9 SEO tests passed**, including the optional comparison against `.tmp/seo-before`.
- **18 existing Spotlight tests passed** against the final output.
- Inspected **403 HTML files**, comprising **340 non-redirect pages** and **63 alias redirects**.
- All 340 page bodies match the baseline after normalizing only `loading` and `fetchpriority` attributes. These image-scheduling hints already vary with concurrent render order; page text, images, links, classes, controls and scripts are unchanged.
- Stylesheet URLs/fingerprints and the generated internal-search JSON are identical to baseline.
- Pages with invalid date metadata: **12 → 0**. Hidden FAQ graphs: **1 → 0**. Misclassified software-app stories: **16 → 0**.
- All sitemap entries resolve to generated, indexable pages with matching canonical URLs. Local metadata image URLs resolve to actual files.
- Checks cover current identity, canonical Person references, publication author order and publisher identity, portfolio links, optional AI-file key links and crawler access rules.
- Existing Hugo deprecation warnings for imaging configuration and `.Site.Data` remain. No dependencies, credentials or external services were added.

Reproduce after a normal build:

```sh
npm run build
npm run test:seo
npm run test:search
```

For the preserved before/after output:

```sh
SEO_BUILD_DIR=.tmp/seo-final SEO_BASELINE_DIR=.tmp/seo-before npm run test:seo
SEARCH_BUILD_DIR=.tmp/seo-final npm run test:search
```

The baseline comparison is optional in CI because the old local build is not committed. All other SEO checks run before the Pages artifact is uploaded.

## Measurement and limits

Simone confirmed access to **both Google Search Console and Bing Webmaster Tools**. The empty Bing meta-token field is not evidence that his property is unverified; alternate verification methods exist. No new account setup or verification code is required by this implementation. Account reports were not accessed, so there is no measured ranking, traffic, coverage or chatbot-citation improvement to report yet.

Follow-up steps are appended to `TO_SIMO_DO.md`: capture a pre-deployment baseline, submit the main sitemap after publication, inspect priority URLs, and compare name queries and relevant non-name queries over comparable periods. Record the specific query, date, service, search mode and cited sources when evaluating chatbot answers; a single answer is not a stable ranking metric.

Current search results also surfaced an outdated University of Verona student biography in the public GitHub repository. That external inconsistency is documented, not rewritten in this website-only task. The older audit's assertions about other profiles were not independently re-audited here and should not be treated as fresh findings.

The website changes improve accuracy, eligibility and machine-readable connections. Search engines decide when to crawl/index and what to show. Metadata alone cannot establish broad expertise or guarantee recommendations in chatbot conversations. The existing llms.txt is maintained as an optional orientation aid, not a required ranking signal.

## Primary guidance consulted

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) — ordinary SEO fundamentals apply; no special AI file or schema is required; inclusion is not guaranteed.
- [Google: structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) — markup should accurately represent the content available to visitors.
- [Google: helpful, reliable content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) — no preferred word count; first-hand usefulness and clear authorship matter.
- [Google: Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article) — author identification and article metadata.
- [Google: robots.txt interpretation](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec) — crawler access controls.

## Current status

Implementation and local validation are complete. Changes are uncommitted and unpublished. Immediate next step: review and publish the changes, then use the existing search dashboards for re-crawl and measurement. No visible-page rewrite is required.

## Follow-up: archive discovery and verified video metadata

A second pass found eight paginated archives whose canonical URL and WebPage identity pointed to their first page. They now use their own `/page/N/` URLs in canonical links, social metadata and WebPage/CollectionPage identities. Head titles include the page number. The existing `/page/1/` aliases continue to resolve to the first page. A shared paginator initializer keeps the exact existing post selection, sorting and page size when Hugo renders the head before the body.

The video sitemap previously advertised **12 entries**, including **three playlists** as individual videos and **one `VIDEO_ID` code example**. It now contains the **eight actual individual embeds on indexable pages**. The site's nine embedded videos (including the excluded Sicily page) have verified titles, uploaders, thumbnails and upload timestamps saved in `data/videos.json`, with source links and a review date. Metadata was checked against YouTube's oEmbed responses and the corresponding watch-page player metadata on 2026-10-15. Builds do not contact YouTube.

A shared helper supplies both video JSON-LD and the sitemap from real rendered iframe embeds. It does not mistake prose, code examples or playlist URLs for individual videos. Video titles and dates now refer to the videos themselves; article publication dates are no longer substituted. JSON-LD uses `embedUrl`, and no longer incorrectly uses a YouTube watch page as a direct-media `contentUrl`. Descriptions identify the video, uploader and surrounding article without inventing a synopsis. Unverified new embeds are omitted from video metadata until their record is added; their visible player still works normally. Inclusion in a video sitemap does not itself establish eligibility for a Google video result.

During the comparison, Hugo's implicit CINECA tag title changed case depending on render order. An explicit taxonomy title now preserves the existing visible **Cineca** label. No article prose, display labels, layout, navigation, stylesheets or Spotlight results changed relative to the baseline.

Validation: production Hugo build passed (602 output pages); **11 SEO checks and 18 Spotlight tests passed**. The comparison covers all 340 non-redirect HTML bodies, with only the previously documented image scheduling attributes normalized; stylesheet fingerprints and the internal-search JSON match. Eight later archive pages now self-canonicalize, while the root sitemap retains 78 page URLs. The new checks cover paginated canonical/schema identity and agreement between the video sitemap, JSON-LD, verified records and real embeds.

Preserved output: `.tmp/seo-followup-before` and `.tmp/seo-followup-after`. Changes from this follow-up are local and uncommitted. No additional manual setup is required; the existing publication and dashboard measurement instructions still apply.

References:

- [Google pagination guidance](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading): pages in a sequence should have their own canonical URLs.
- [Hugo pagination](https://gohugo.io/templates/pagination/): the first pagination invocation is cached, so head and body must use the same collection.
- [Google video sitemap reference](https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps): metadata describes individual videos, and publication dates refer to their first publication.
- [Google VideoObject guidance](https://developers.google.com/search/docs/appearance/structured-data/video): video-specific name, thumbnail, upload date and player URL; a watch page is not a raw-media content URL.
