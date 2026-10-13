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

“Find me online” is the primary connection action. Homepage selected work is constrained to one visible row: one card below 640px, two cards from 640–1023px, and three from 1024–1199px, and four at 1200px or wider. Other grids are unchanged. Each visible project links to its app site or article, with “More projects” linking to the technical project collection. Verified at both sides of each breakpoint and on 320px/390px phones, 768px tablets, and 1440px desktops.

## Project selection and background refinement — October 13

The contact section now uses the standard page background in both themes, with “Find me online” retaining primary styling. Ten viewport checks from 320px through 1440px confirmed the single-row layout. All four project images load; a clean build confirms the Evolve draft is excluded.

Local app logo sources: [Wealth Compass](https://simo-hue.github.io/wealth-compass/images/logo.png) and [Evolve](https://simo-hue.github.io/evolve/logo.png?v=5abd3006). These assets are served locally through Hugo image processing, so visitor page loads do not depend on the product sites for images.
