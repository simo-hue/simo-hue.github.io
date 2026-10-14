# Personal hub UI refresh

Implemented October 12, 2026.

## Structure

The homepage now leads into selected work and personal stories. Three journey milestones link to the full About timeline. The existing typography, copper accent, and light/dark themes remain.

- Homepage layout: `layouts/index.html`. Curated selections: `data/selected_work.yml`, rendered by `layouts/partials/components/project-card.html`. The ordered projects are Wealth Compass Tracker, Evolve (the app evolution of Mattioli.OS), Mountain Fauna Lover, and CampFlow. The two apps link directly to their product sites; the other projects link to their existing articles. Evolve’s unfinished blog article remains unpublished. The featured story links to the existing Brazil volunteering article.
- Recent notes: the latest three published Experiences, Thoughts, or Books entries, ordered by date.
- Homepage milestones: entries with `homepage: true` in `data/timeline.yml`. Three are currently selected.
- Full journey: `layouts/partials/components/timeline.html`, rendered on About. Entries with extended text, achievements, or links use native details/summary; short entries stay static. `upcoming: true` provides the future-entry label. No timeline JavaScript is needed.
- Shared cards: `layouts/partials/components/blog-card.html`. One keyboard link per card, distinct treatment for posts without a cover, and a minimum displayed reading time of one minute.
- External resources: labeled links before the article body, populated from the existing `links` front matter.
- Styles: `assets/css/hub.css`; contrast tokens: `data/theme.json`. Existing article-image styles are unchanged.

## Verification

- Production build: 601 pages, passed. Existing imaging.quality deprecation warning only.
- JavaScript syntax and Git whitespace checks: passed.
- 35 responsive page/theme checks: no page-level horizontal overflow, including 320px phones and 1440px desktops. The publication code block keeps its intended internal horizontal scrolling.
- Five generated page types: 285 local link and image references resolve.
- Four homepage project cards, three milestones, and all 13 About timeline entries confirmed.
- Browser checks: mobile menu and Escape close, keyboard journey expansion, theme toggle, homepage section links, search results, and labeled article resource links.

## Review and rollback

The changes are local and uncommitted. Preview at http://localhost:1313/ while the preview server is running.

A change-only patch is saved outside the repository at `/Users/simo/.codex/visualizations/2026/10/12/01a130aa-409a-70d2-b277-165e45a69ed9/ui-refresh.patch`. This is a historical snapshot of the initial refresh and CTA-priority tweak; later refinements are not included. Its reverse application was checked when created. Do not apply it blindly to the current files; review and re-check it against subsequent edits first.

No manual configuration, credentials, or migration is required.

## Follow-up adjustments

“Find me online” is the primary connection action. Homepage selected work is constrained to one visible row: one card below 640px, two cards from 640–1023px, and three from 1024–1199px, and four at 1200px or wider. Other grids are unchanged. Each visible project links to its app site or article, with “More projects” linking to the dedicated portfolio. Verified at both sides of each breakpoint and on 320px/390px phones, 768px tablets, and 1440px desktops.

## Project selection and background refinement — October 13

The contact section now uses the standard page background in both themes, with “Find me online” retaining primary styling. Ten viewport checks from 320px through 1440px confirmed the single-row layout. All four project images load; a clean build confirms the Evolve draft is excluded.

Local app logo sources: [Wealth Compass](https://simo-hue.github.io/wealth-compass/images/logo.png) and [Evolve](https://simo-hue.github.io/evolve/logo.png?v=5abd3006). These assets are served locally through Hugo image processing, so visitor page loads do not depend on the product sites for images.

## Blog discovery — October 13

The main Blog's first page now introduces three curated articles: Brazil volunteering, “Don't Brag,” and CampFlow. Edit their source page paths and short labels in `data/blog.yml`. All three remain in the chronological archive so browsing by date is complete. The section is absent from category pages and subsequent archive pages.

The existing large-card grids remain. Featured cards align to equal heights within each row; the grid adapts from one to two to three columns. A “Jump to latest posts” link skips the introduction, and the archive shows the current post range plus Newer/Older and numbered navigation. Pagination targets the posts section directly. The current page alone is marked for assistive technology.

Verification: clean 601-page production build; all 58 unique archive posts preserved in descending date order across six pages; five category pages checked; 737 local link/image/anchor references resolve. Browser coverage includes 320–1440px, both themes, featured images, category navigation, archive navigation, and no page-level horizontal overflow. No manual setup is needed.

## Find me online — October 13

The `/links/` page now prioritizes Email, LinkedIn, and GitHub. Email has a copper border and appears first. Personal channels, Mountain Fauna Lover, and research profiles follow as grouped lists; all destinations remain available. Résumé/education and certificates use native collapsed disclosures with PDF counts and labels. The résumé is first within its group, and in-page shortcuts lead to channels or documents.

`data/links.yml` remains the directory source: section `kind` selects `primary`, `channels`, or `documents`; `order` controls primary destinations and channel groups. Document order follows the data. No JavaScript or setup is needed for disclosures. Verified 24 retained destinations, 12 resolving PDFs, keyboard interaction, light/dark layouts, and no horizontal overflow at five widths from 320px to 1440px.

## Projects portfolio — October 13

Projects now points to `/projects/`, a dedicated portfolio. The homepage “More projects” link follows it. `/blog/tech-projects/` remains the complete chronological technical-writing archive, accessible from Blog and “All build stories.” The portfolio shows all four chosen projects in a two-column grid, stacking below 768px; homepage single-row visibility remains unchanged.

Featured project names, descriptions, and images remain shared through `data/selected_work.yml`. Each entry's `portfolio` fields provide its external product destination and published story. Evolve uses the published Mattioli.OS origin article, not the Evolve draft. Wealth Compass labels its article as the web-app story. Four other apps come from `data/entity.yml`, followed by the latest three published technical posts.

Validation: clean 602-page build, 50 resolving local link/image/anchor references, preserved homepage cards and archive pagination, Evolve draft exclusion, loaded images, responsive checks at five widths from 320px to 1440px, both themes, and desktop/mobile navigation. No manual setup required.

## Article reading — October 13

Articles with at least 600 words and three rendered TOC entries receive a native “On this page” disclosure before the body. It starts collapsed, works without JavaScript, and links to existing heading anchors. Eighteen currently published articles qualify; short reflections remain simple. Category and back-to-top links close each article.

“Keep reading” now consistently offers three distinct published articles: related matches first, then recent posts from the same section, then other recent writing. The current article is always excluded. All 58 published articles have three resolving suggestions; all generated guide anchors were checked. Verified keyboard behavior, header clearance, light/dark styling, and mobile/desktop layouts. Content and article-image layouts were preserved; no manual setup is needed.
