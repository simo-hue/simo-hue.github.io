# Spotlight command center

Implemented October 14, 2026. Replaces the legacy blog-only search modal with a shared interface for the header's command center and `/search/`.

## Experience

- Open with the header search button, **⌘K** on Mac, or **Ctrl+K** elsewhere. The shortcut also toggles the panel closed.
- The opening view shows Projects, About, Blog, and Download résumé. Up to three recent selections appear above remaining suggestions, without duplicates.
- **All, Pages, Writing, Actions** filters are available by click/tap or **Alt+1–4** (shown as ⌥ on Mac). Hold Alt/Option to reveal the shortcut hints without shifting the layout. These avoid the browser's reserved numbered-tab shortcuts.
- Up/down arrows select results; Enter activates; Escape closes and restores the original focus. Tab and Shift+Tab stay within the modal. Filter buttons also support left/right arrows and Home/End.
- Opening suggestions use compact, uniform rows and unboxed icons. Inline excerpts appear after typing a query or navigating with up/down arrows. Pointer hover only highlights a row, keeping its position stable. Clearing the query or reopening the modal restores the compact opening state.
- Writing includes section, publication date, and reading time. Search highlights literal matches and tolerates a single typo in title/alias words of at least four characters. The footer contains navigation guidance and the suggestion/result count; action aliases appear with Alt/Option or the selected preview.
- Exact titles and command aliases rank above partial title matches, metadata, descriptions, and article text. All query terms must match. Results are grouped with a top hit and loaded into the interface in batches of twelve.
- Everyday phrases are supported with small, deterministic rules: `find projects`, `contact Simone`, `latest articles`, `recent posts`, and `latest articles about AI`. Recent-writing queries sort by publication date; explicit category filters still apply. `AI projects` limits results to project content and favors individual build stories over broad collections. `AI` and `artificial intelligence` are equivalent; short terms require whole words so `AI` cannot match `trail`. Other unknown words still need to match.
- Expanded previews include existing local imagery where available. Exact-title searches prefer the concise description. Thumbnails load only when their result is selected for preview, with reserved dimensions and a text-only fallback. The initial suggestions remain compact.
- Phone layouts sit near the top of the visual viewport, with independently scrolling results. Native keyboard viewport resize events adjust the available height. Reduced-motion and reduced-transparency preferences have dedicated styles.
- `/search/?s=CampFlow&view=writing` supports shareable searches. Updating this page preserves unrelated URL parameters and fragments; typing in the modal does not change the page URL.

## Actions

Type a short command and press Enter, or select an action from the Actions filter.

| Command | Action | Behavior |
| --- | --- | --- |
| `cv` | Download résumé | Downloads the configured résumé PDF |
| `th` | Switch theme | Uses the existing theme control and browser preference |
| `cl` | Copy page link | Copies the current URL, including query and fragment |
| `ce` | Copy email address | Uses the address in `data/entity.yml` |
| `em` | Write an email | Opens a `mailto:` draft; does not send anything |
| `gh` | Open GitHub | Opens the existing profile in a new tab |
| `li` | Open LinkedIn | Opens the existing profile in a new tab |
| `ch` | Clear recent selections | Clears only this command center's history |

The résumé destination comes from `navigation_button.link`; social destinations come from `data/social.json`. Missing résumé/profile destinations are omitted instead of producing broken commands.

## Content and maintenance

- `layouts/_default/list.searchindex.json` builds `/searchindex.json` using structured JSON serialization. The current index has **80 entries: 22 pages and 58 writings**.
- The index includes home, public pages, section listings, and the curated Passions hub. Drafts, explicit `ignoreSearch`/`noindex` opt-outs, internal `/sections/`, the offline shell, and tag taxonomy archives are excluded.
- `layouts/partials/search-page-content.html` supplements custom pages with shared portfolio, biography, timeline, contact, and globe data, which Hugo's `.Plain` alone cannot capture. Extend this partial when adding another data-driven page.
- `assets/js/spotlight-engine.mjs` contains pure normalization, ranking, excerpt, and history-validation helpers. `assets/js/search.js` handles the interface and actions. Hugo `js.Build` bundles these into the existing deferred script pipeline; no runtime dependency or external search service was added.
- `layouts/partials/components/command-panel.html` is shared by the native modal dialog and the standalone Search page. Their IDs and state remain separate.
- `assets/css/spotlight.css` uses existing Geist, copper, and light/dark design tokens. Obsolete search overrides were removed from `ds.css`.
- `layouts/partials/search-thumbnail.html` creates local WebP previews within 240×160px, using page-bundle or asset images and honoring rotation metadata. Remote/SVG/missing images retain text-only previews. Currently 57 entries have thumbnails, all below 13KB. The index adds `topics` and `thumbnail`; its `?v=2` URL and HTTP revalidation prevent old cached metadata from hiding project results during rollout.
- Existing pages with the shared header get the command dialog. The separate `/connect/` profile retains its existing standalone shell; it is searchable as a destination.

## Resilience and privacy

- The index is requested on first open or initial trigger hover, with a shared in-flight request, in-memory caching, and a ten-second timeout. Actions remain usable if loading fails; the interface exposes Retry.
- Rendered titles, descriptions, and excerpts are inserted as text nodes, with literal query highlighting. User input never becomes an unescaped regular expression or HTML.
- Recent history stores at most six entry IDs and timestamps under `simo:spotlight:recent:v1`, with a thirty-day expiry. Search queries and visited pages outside the command center are not added to history. No new analytics events were added.
- Invalid history is discarded. Denied local storage falls back to session memory, and the existing theme switcher now tolerates storage denial too.
- Clipboard denial presents a selected, read-only value for manual copying. Social links use `noopener noreferrer`.
- Result accessible names include the title and publication metadata. Only an expanded selected result references its preview description. Result-count announcements include the query and displayed batch size, and inactive panels do not announce updates. Composition input waits until completion, mobile keyboards receive a Go hint, and pointer-opened dialogs restore focus to their actual trigger.

## Verification

Run after building:

```sh
npm run build
npm run test:search
```

The 18 automated tests cover ranking, aliases, accents, typo tolerance, filtering, full-content search, literal punctuation, bounded input, excerpts, history expiry/corruption, unique generated destinations, index coverage, independent accessible IDs, everyday query intent, recency ordering, short-term boundaries, and generated thumbnail availability/size. Set `SEARCH_BUILD_DIR` to validate a different build destination.

Browser checks on October 14, 2026 covered:

- Desktop light/dark appearance; dark layouts at 320, 390, 600, 768, 1024, and 1440px; light mode at 320px; short landscape at 844×390; reduced available height at 390×360. No horizontal overflow; the input and scrolling results remained inside the viewport.
- ⌘K/Ctrl+K, Alt+4, arrow selection, Enter navigation, Escape focus restoration, and twelve consecutive Tab steps staying inside the dialog after tightening the focus loop.
- Typo query `campflwo`, empty/no-match states, literal punctuation, Writing pagination from twelve to twenty-four rows, persisted recent selections, and clearing history.
- Independent modal and Search-page queries, including safe URL encoding and preserving an unrelated parameter and fragment.
- Successful theme and clipboard actions; exact résumé, GitHub, LinkedIn, and email destinations verified by intercepting navigation in an isolated local test fixture. No email was sent or social account modified.
- Simulated index failure followed by a successful retry; blocked local storage; denied clipboard with selectable fallback.
- Production build passed (602 Hugo pages), JavaScript syntax and whitespace checks passed, and the normal preview reported no browser warnings/errors. Existing Hugo deprecation warnings remain.

Refinement checks on October 15, 2026 covered:

- The four-suggestion desktop opening panel shrank from approximately 532px to 393px tall, with uniform rows and no initial preview. Arrow navigation and typed queries reveal the selected excerpt; clearing and reopening restore the compact state.
- Holding and releasing Alt/Option reveals and hides filter shortcuts without changing panel height. Pointer hover is confined to CSS background styling and does not select or expand results.
- Mobile at 390×844 and 320×568, light/dark mobile and desktop appearance, all eight action results, theme switching, recent-history clearing, and shareable `/search/?s=CampFlow&view=writing` previews. No horizontal overflow was observed.
- Production build, all 13 regression tests, JavaScript syntax, and whitespace checks passed. The normal browser preview reported no warnings/errors.

Additional discovery/accessibility checks on October 15, 2026:

- Production build and all 18 tests passed. Browser checks confirmed contact, recent-writing and AI-project queries, shared Search-page query links, loaded thumbnail dimensions, zero initial preview descriptions, and exactly one expanded option description.
- Verified dark/light desktop previews, dark 390×844 mobile previews, 320×360 constrained-height scrolling without horizontal overflow, ten Tab steps contained within the dialog, arrow selection retaining input focus, and Escape restoring the clicked trigger. No browser warnings/errors were observed.
- Reviewed semantics against the [WAI-ARIA combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/). This is a code and accessibility-tree check, not an audible screen-reader test.

Limits: responsive checks use the desktop browser's viewport emulation, not physical iOS/Android keyboards. Native Safari automation was attempted but computer-use permissions were unavailable. Physical mobile keyboard, native Safari and audible VoiceOver checks remain in `TO_SIMO_DO.md`; no claim of a complete screen-reader audit or cross-browser certification is made.

No API keys, configuration steps, migrations, or other manual setup are required. Changes are local and unpublished.
