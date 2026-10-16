# Deeper SEO and GEO optimization — 2026-10-16

## Scope

Continue improving discovery and accurate identification of Simone Mattioli as a software developer and AI enthusiast, preserving the visible website and Spotlight. Three requested subagents audited crawl/feed behavior, identity/schema, and performance/language. Their changes were integrated and tested together. All changes in this pass are local and unpublished.

## Implemented improvements

### Language and translation discovery

The existing English and Italian technology and content-creation pages now identify their actual language in HTML, Open Graph and WebPage schema. Each pair supplies reciprocal, self-inclusive `hreflang` links while retaining its existing URL and self-canonical. Italian head titles and descriptions use Italian; the English descriptions now reflect the actual essays. Explicit `translation_peer` declarations are validated at build time. No new translated pages or visible language controls were created.

The separate head-only `seo_title` and `seo_description` fields preserve display titles, visible excerpts and Spotlight. The completed Collegio Don Mazza article previously advertised the placeholder “to do”; its head and article schema now contain a factual description based on the existing article.

### Smaller crawler and social previews

A shared, cached image helper creates JPEG metadata previews within 1200×1200 pixels without cropping or upscaling. Open Graph, Twitter and article schema reference the same rendition; dimensions are checked against the actual encoded files. Person schema uses a smaller rendition of the existing portrait. Visible image sources are unchanged.

| Measurement | Before | After |
| --- | ---: | ---: |
| 57 unique sized Open Graph previews | 15,645,932 bytes | 7,445,871 bytes |
| Person portrait in structured data | 836,233 bytes | 69,616 bytes |

The reductions are **52.4% overall** and **91.7% for the portrait**. Ten already-small source images become somewhat larger as JPEGs; the overall reduction is the relevant measurement. These are crawler/social-preview payload savings, not measured visitor loading-time or Core Web Vitals gains. The visible homepage already uses responsive WebP imagery.

### Feed and crawler correctness

The default main blog feed was empty because the articles live in nested sections. A local RSS template now includes recursive section articles and filters drafts, headless components, empty destinations and externally excluded pages. Unknown dates are omitted instead of emitted as year 0001. Original article summaries and titles remain intact.

- Main blog feed: **0 → 56 articles**.
- Homepage feed: **71 → 66 valid entries**.
- All **261 feed URLs** remain available.
- All **523 feed item references** resolve to indexable local pages.
- No invalid dates or empty item destinations remain.

The RSS template avoids the HTML metadata helper because that helper initializes blog pagination. Calling it while rendering RSS creates unwanted paginated feed routes.

Named search and AI crawlers now share the wildcard group's three intended exclusions (`/admin/`, `/private/`, `/searchindex.json`). Public pages, project sites and rendering assets remain crawlable. All existing named crawler tokens and sitemap declarations are retained. Robots rules are crawl instructions, not access protection.

### Accurate article metadata and loading hints

The DOI-identified paper now links its existing issue 4 and volume 10 to its journal. Its schema no longer presents the local summary's word count as the paper's word count. Author order, DOI, publication date, publisher and Crossref's pagination value remain intact. All 58 article records use consistent head/schema descriptions and actual image dimensions.

Blog image priority is now passed explicitly per card render. Featured cards and the first archive row receive eager/high priority; lower cards and related stories remain lazy. This removes the previous shared-state render-order race without changing the card markup, images or layout. Unused connection hints to the externally hosted FontAwesome origin were removed; the site's icon assets are local.

A stylesheet-minification experiment was rejected and reverted: it changed a valid `scrollbar-color` declaration into an invalid value. Browser `CSS.supports` checks confirmed the difference. The stylesheet pipeline and output fingerprints remain unchanged.

## Validation

Combined production output: `.tmp/seo-combined-final`. Baseline: `.tmp/seo-third-before`. Metrics: `.tmp/seo-combined-metrics.json`.

- Production build passed: 602 Hugo output pages, 8 pagination pages, 63 aliases.
- **16 SEO checks passed**, including full before/after presentation comparison.
- **18 Spotlight tests passed**.
- All **340 non-redirect HTML bodies** match the baseline after normalizing only the intentional image loading/priority attributes; those attributes have their own checks.
- Stylesheet URLs/fingerprints and Spotlight JSON match exactly.
- All 63 aliases resolve directly to real canonical destinations.
- Translation reciprocity, JPEG dimensions, article metadata, feed destinations/dates and positive/negative crawler access are covered by regression checks.
- Whitespace checks passed. Existing Hugo imaging-quality and `.Site.Data` deprecation warnings remain.

Reproduce with:

```sh
npm run build -- --destination .tmp/seo-combined-final
SEO_BUILD_DIR=.tmp/seo-combined-final SEO_BASELINE_DIR=.tmp/seo-third-before npm run test:seo
SEARCH_BUILD_DIR=.tmp/seo-combined-final npm run test:search
```

The presentation comparison requires the preserved local baseline. Normal deployment validation runs all other SEO checks. No dependencies, credentials or external services were added. No new manual actions were identified; the existing publication and Google/Bing measurement instructions in `TO_SIMO_DO.md` still apply.

## Guidance and limits

- [Google localized-version guidance](https://developers.google.com/search/docs/specialty/international/localized-versions): reciprocal links with fully qualified URLs; HTML annotations are sufficient without duplicating them in every supported mechanism.
- [Google robots group selection](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec): named groups do not inherit wildcard rules.
- [Hugo RSS templates](https://gohugo.io/templates/rss/): feeds can use a local template and page collections.
- [Crossref publication record](https://api.crossref.org/works/10.3390/bdcc10040117): bibliography checked by the identity auditor.
- [Schema.org wordCount](https://schema.org/wordCount): the value describes the actual identified work.
- [Google AI features guidance](https://developers.google.com/search/docs/appearance/ai-features): ordinary search fundamentals apply; special AI markup is not required and inclusion is not guaranteed.

No ranking, traffic, chatbot citation or field performance increase has been measured. Search dashboard reports were not accessed in this pass. Scholarly citation tags were not added to imply that the local summary is the complete paper. The remaining publication and measurement work is already recorded; this implementation is ready for review and publication.
