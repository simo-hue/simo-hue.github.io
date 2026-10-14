# Responsive audit — 14 October 2026

## Result

All **340 rendered HTML pages** passed layout checks at **320, 390, 768, 1024, and 1440 CSS pixels**, with both global theme preferences: **3,400 page/width checks**. No horizontal page overflow, uncontained out-of-bounds content, missing main content, or broken completed images was detected in the final pass. The standalone `/connect/` page retains its own light design under either preference.

The [page-by-page results](responsive-audit-pages.csv) list every tested URL. The clean production build also includes **63 redirect pages**; their destinations all resolve. Drafts and stale output from earlier builds were excluded.

## Fixes

- **About portrait:** top-aligned the photo and retained enough height in the full-width phone/tablet layout to keep the face visible. Verified at 320, 390, 768, 1023, 1024, and 1440px.
- **Tag archives:** removed an outer row's negative gutters. All 247 individual tag pages previously extended beyond narrow and tablet viewports; the final checks pass.
- **Globe:** corrected the header selector so the globe starts below the current navigation. Short landscape country panels now scroll instead of reducing the story area to a few pixels, and the close button remains reachable.
- **Image galleries:** removed asynchronous execution from the deferred lazy bundle so GLightbox and Swiper load before their consumers. This fixes the observed `GLightbox is not defined` race. Gallery opening and closing were verified.

## Coverage

| Page group | Rendered pages |
| --- | ---: |
| Home | 1 |
| About | 1 |
| Projects | 1 |
| Blog articles, sections and pagination | 72 |
| Tag index and individual tags | 248 |
| Passions index and details | 9 |
| Call, Connect, Globe, Links, Search, Sections, Offline, 404 | 8 |
| **Total** | **340** |

A further **160 layout checks** covered 16 representative routes at 639, 640, 767, 768, 1023, 1024, 1100, 1199, 1200, and 1920px. Routes: `/`, `/about/`, `/projects/`, `/blog/`, `/blog/page/2/`, `/tags/`, `/tags/artificial-intelligence/`, `/call/`, `/connect/`, `/links/`, `/passion/`, `/passion/bikes/`, `/search/`, `/offline/`, `/404.html`, and `/blog/publications/llm-tourism-mobility-predictor/`.

Browser checks included:

- Visual review of the major page templates on phone, tablet, and desktop sizes, including both themes.
- Mobile navigation and its scrollable menu on a 667×375 landscape viewport; Escape dismissal.
- Search overlay results at 320×568 and 667×375, plus the standalone search results page.
- All nine About timeline disclosures expanded at 320px; expanded document groups on Links.
- Booking calendar, day/time selection and detail fields at 320px; tablet calendar layout. No booking was submitted.
- Article table-of-contents disclosure and image lightbox opening/closing.
- Globe portrait layout and 844×390 landscape country panel scrolling, including its empty-story state and fixed close control.
- A narrow-width text-clipping scan of every page; intentional code scrolling and line clamping were excluded.

## Validation and limits

- Clean production build passed: Hugo reports 602 pages across its generated outputs, with 340 non-redirect HTML routes in the audit inventory.
- All 2,058 local image, script, stylesheet, iframe and source references checked against generated output resolve. Every HTML page has a viewport meta tag.
- Shared JavaScript bundles and globe inline script pass syntax checks; `git diff --check` passes.
- Existing Hugo deprecation warnings remain. No dependencies or manual setup were added.
- Measurements use the Codex in-app browser with controlled CSS viewport sizes, primarily 900px high. Short-height interactions were checked separately. This is not certification across physical devices, Safari/Firefox, every zoom setting, or every dynamic state.
- Out-of-bounds checks ignore content intentionally contained by a scrolling/clipping ancestor. Completed-image checks do not prove availability of every offscreen lazy image or externally hosted media asset.
- Separately hosted apps, PDF interiors, external destinations and booking submission are outside this site's responsive-layout audit.

Changes are local and unpublished. The local preview is at `http://localhost:1313/`.
