# Page-specific scripts and metadata consistency — 2026-10-16

## Outcome

This pass preserves the visible site while eliminating unused gallery/slider JavaScript from ordinary pages and correcting remaining metadata inconsistencies. Three focused audits covered crawl/feed correctness, identity metadata, and loading behavior. Implementation and browser verification of the script changes were delegated separately after the earlier agent session ended.

## Measured script reduction

Previously every normal HTML page loaded the same main and secondary bundles, including Swiper, GLightbox and unused gallery/YouTube widget code. Only 11 generated pages contain lightbox links; none currently uses a slider or lite-youtube widget.

| Shared site scripts per page | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| 329 ordinary pages, including homepage/About | 233,892 bytes | 26,249 bytes | 88.8% |
| 11 lightbox pages | 233,892 bytes | 82,500 bytes | 64.7% |

These values count the site's generated core/widget bundles, not every script a specialized page or external embed might load. Estimated gzip size for ordinary-page bundles falls from 67,467 to 9,444 bytes; this is a local compression calculation, not a measurement of hosting transfer bytes or field performance. No ranking, traffic, chatbot-citation or Core Web Vitals improvement is claimed.

An uncached per-page wrapper identifies features in rendered content, including shortcodes, and selects cached bundles. Optional libraries load before the shared core; widgets load afterward. Every bundle remains deferred, fingerprinted and checked with subresource integrity. Core functionality stays in one reusable URL, so visiting a gallery does not download a second copy of Spotlight/navigation.

Initializers now require the corresponding markup and library. GLightbox initializes once; gallery layout no longer registers global listeners on pages without galleries. Existing features are preserved, including future slider/YouTube shortcodes. Template-only controls can explicitly declare `script_features: [swiper, lightbox, gallery, youtube]` with only their required features. No such declarations are necessary for current pages.

## Metadata corrections

- Decode character references once in the shared metadata helper. Six generic WebPage records previously exposed literal `&rsquo;`, `&ldquo;` or `&hellip;` while HTML and article metadata showed real punctuation. All page/article descriptions now agree.
- Reuse the confirmed entity description as the fallback. This removes the obsolete “AI and HPC” study description inherited by 250 noindex pages. It is consistency maintenance, not expanded search eligibility.
- Frame the existing NEET reflection as an April 2026 historical article in head metadata and its schema headline. Its visible title/body and Spotlight entry remain unchanged. Search metadata no longer advertises its stale “20-year-old/currently a NEET” claim as current personal positioning.

The renewed crawl audit found no further substantive defects: all 261 feeds parse, all 523 feed items resolve, and 90 embedded summary URLs are absolute/root-relative and valid. Local resource checks and singleton metadata checks passed. Live hosting returned HTTP 200 for the homepage, text/plain for llms.txt, and a real HTTP 404 for a nonexistent route.

## Validation and regression protection

- Production builds passed with local Hugo **0.167.0** and deployment-pinned **0.163.3**.
- **18 SEO checks**, **18 Spotlight tests**, and **7 script tests** passed.
- All **340 nonredirect pages** retain their visible bodies, stylesheet fingerprints and Spotlight JSON. Comparison normalizes only existing image scheduling attributes and the intentionally changed site-bundle tags; bundle resolution, integrity, deferred order and behavior are checked separately. Other inline scripts and external script tags remain part of the strict comparison.
- Comparisons use the same compiler on each side: Hugo versions differ in some reading-time estimates, independent of these changes. No test was relaxed to hide that difference.
- Script tests cover every generated page, missing optional libraries, single lightbox initialization, slider settings, gallery layout and isolated Hugo fixtures for quoted/unquoted/multiline class attributes, escaped examples, false-positive attributes and explicit feature declarations.
- Isolated Chrome checks passed for homepage Spotlight search, Escape dismissal, theme switching and mobile navigation, plus opening and closing the lightbox on **all 11 relevant pages**. No browser page errors occurred. External requests were blocked to isolate local functionality; external video playback was not tested.
- CI now runs the existing search tests and new script tests before deployment, alongside SEO checks.
- Whitespace checks passed. Existing Hugo deprecation warnings remain. No dependencies were added or upgraded.

Outputs: `.tmp/seo-deep-local-final` (local version) and `.tmp/seo-deep-final` (deployment version). Baselines: `.tmp/seo-combined-final` and `.tmp/seo-ci-compatible`, respectively. Script metrics: `.tmp/seo-script-metrics.json`. Browser smoke: `.tmp/scripts-browser-smoke.cjs` using `.tmp/seo-script-after`.

```sh
npm run build
npm run test:seo
npm run test:search
npm run test:scripts
```

For a preserved local before/after comparison:

```sh
SEO_BUILD_DIR=.tmp/seo-deep-local-final SEO_BASELINE_DIR=.tmp/seo-combined-final npm run test:seo
SEARCH_BUILD_DIR=.tmp/seo-deep-local-final npm run test:search
SCRIPT_BUILD_DIR=.tmp/seo-deep-local-final npm run test:scripts
```

No new manual actions are required. Changes remain local and unpublished; existing publication and Google/Bing measurement instructions in `TO_SIMO_DO.md` still apply.

## Primary guidance

- [Chrome: remove unused JavaScript](https://developer.chrome.com/docs/lighthouse/performance/unused-javascript) explains why unused deferred code still consumes download and execution resources.
- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) confirms that normal search fundamentals and accurate visible-content-aligned metadata apply; special AI files or extra schema do not guarantee inclusion.
