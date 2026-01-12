# DOCUMENTATION

## Implementation Logs

### [2026-01-08] Interactive Timeline Implementation
- **Objective**: Replace static features list with a dynamic, responsive vertical timeline.
- **Changes**:
  - **New Data File**: Created `data/timeline.yml` to store journey events (Education, Work, Volunteering).
  - **New Component**: Created `layouts/partials/components/timeline.html` using TailwindCSS.
    - Features alternating left/right layout on desktop.
    - Collapses to single column on mobile.
    - Uses FontAwesome icons and color-coded tags.
  - **Layout Update**: Modified `layouts/index.html` to replace the "Features" loop with `{{ partial "components/timeline.html" . }}`.
- **Technical Details**:
  - Uses Tailwind's `order-1`, `md:flex-row-reverse` for the zigzag effect.
  - Responsive design with `md:` breakpoints.

### [2026-01-08] Timeline Content Update
- **Objective**: Add specific content creation milestones to the timeline.
- **Changes**:
  - **Added Entries**:
    - **Simo's Diary (2023)**: YouTube channel for vlogs and memories.
    - **Mountain Fauna Lover (2023)**: Photography/Nature project.
    - **Downhill World Cup Staff (2021)**: Volunteering at Val di Sole (Transponders & Safety).

### [2026-01-08] Fix Mobile Timeline Layout
- **Objective**: Enforce zigzag layout on mobile screens (instead of linear).
- **Changes**:
  - **CSS Layout**: Removed desktop-only logic for flex direction. Now uses `flex-row` / `flex-row-reverse` on all screens.
  - **Sizing**: Set content and spacers to `w-[45%]` to fit side-by-side on mobile.
  - **Centering**: Absolute positioning for icons and central line (`left-1/2 -translate-x-1/2`).

### [2026-01-08] Timeline Layout Critical Fix
- **Objective**: Resolve layout regression where content was overlapping and unreadable on both mobile and desktop.
- **Changes**:
  - **Grid System**: Enforced `w-5/12` width for both content and spacers on ALL screens. This preserves exactly 1/6th (16.6%) of width in the center for the axis/icon.
  - **Typography**: Implemented responsive font sizing (`text-[10px]` on mobile, `text-sm` on desktop) to ensure text fits inside the zigzag boxes.
  - **Z-Index**: Fixed layering to ensure text doesn't overlap icons.
  
### [2026-01-08] Timeline Animations
- **Objective**: Add "fade-in on scroll" effect for a premium feel.
- **Changes**:
  - **JS**: Added `IntersectionObserver` in `assets/js/main.js` to detect when timeline items enter the viewport.
  - **CSS**: Added utility classes (`opacity-0`, `translate-y-8`, `transition-all`, `duration-700`) to `layouts/partials/components/timeline.html`.
  - **JS**: Added `IntersectionObserver` in `assets/js/main.js` to detect when timeline items enter the viewport.
  - **CSS**: Added utility classes (`opacity-0`, `translate-y-8`, `transition-all`, `duration-700`) to `layouts/partials/components/timeline.html`.
  - **Behavior**: Items start hidden and slightly lower; when scrolled to, they smoothly fade in and float up.

### [2026-01-08] About Page - Bento Grid Redesign
- **Objective**: Transform the About page from text-heavy to a visual, modular layout.
- **Changes**:
  - **New Layout**: Created `layouts/about/list.html` implementing a responsive Grid layout (CSS Grid).
  - **Structured Data**: Migrated content to `data/about.yml` (Vision, Goal, Stats, Passions).
  - **Visuals**: Added stats, icons, and a large profile card with overlay bio.
  - **Refinement**: Consolidated content from previous About page (Bio details, Education history, Quote). Modified layout to handle nested quotes correctly in `aria-label`.
  - **Debugging**: Investigated CORS errors referencing port 53314. Confirmed no hardcoded references in code. Identified cause as stale Service Worker from VS Code Live Server.
  - **Re-design**: Redesigned the "Links" page to match the "About" page Bento Grid style. Created `data/links.yml` for unified content management and `layouts/links/list.html` for the grid layout.
  - **Styling**: Diversified color palettes for link categories (Slate, Orange, Rose, Emerald, Violet) to avoid repetition. Refined transparency of buttons (`bg-white/30`) for a cohesive "glass" effect.
  - **Bugfix**: Forced removal of leading spaces in "About" page links using `sed` to resolve persistent 404 errors caused by `%20` encoding.

### [2026-01-08] Enhance Carousel UX
- **Objective**: Improve the "Some Insight" carousel usability by adding navigation arrows and autoplay.
- **Changes**:
  - Created `assets/js/main.js` (overriding theme default) to update Swiper configuration:
    - Enabled `autoplay` (delay: 5000ms).
    - Enabled `navigation` (next/prev buttons).
  - Modified `layouts/index.html` to include the HTML elements for Swiper navigation arrows (`.swiper-button-next`, `.swiper-button-prev`).
  - **Styles Applied**:
    - Circular buttons (`!w-12 !h-12 !rounded-full`) with shadow (`shadow-lg`).
    - Background: White (Light Mode) / Dark Gray (Dark Mode).
    - Icons: FontAwesome chevron icons (`fa-chevron-right/left`) instead of default text.
    - Hover Effect: Primary background color with white icon.

### [2026-01-08] Refine Links Page Styling
- **Objective**: Fix spacing issues and enhance icon styling on the Links page.
- **Changes**:
  - Refactored `content/english/links.md` (from Education section downwards):
    - Fixed HTML nesting and removed extra new lines.
    - Assigned semantic classes to icons (`icon-diploma`, `icon-bachelor`, `icon-fortran`, `icon-python`, `icon-bioinformatics`, `icon-college`, `icon-english`).
  - Updated `assets/css/custom.css`:
    - Defined distinct gradient styles for each new icon class to increase visual appeal and professionalism:
      - **Diploma**: Amber/Orange.
      - **Bachelor**: Red/Dark Red.
      - **Fortran**: Purple/Dark Purple.
      - **Python**: Blue/Yellow.
      - **Bioinformatics**: Emerald/Teal.
      - **College**: Indigo/Blue.
      - **English**: Blue gradient.
      - **Coursera**: Brand Blue Gradient.

### [2026-01-08] Add Coursera Certificate
- **Action**: Added "Supervised Machine Learning" certificate to the Links page.
- **Details**:
  - Added new `.link-icon.icon-coursera` class in `assets/css/custom.css` (Coursera Blue).
  - Added new link card in `content/english/links.md` under "Certificates" section.
  - **Required Action**: User must upload `Coursera_ML.pdf` to `static/docs/`.

### [2026-01-08] Repository Cleanup
- **Objective**: Remove unused files and backup directories to reduce repository size and improve organization.
- **Changes**:
  - **Deleted Directory**: `backup-images-20251015-195634/` (contained ~90 unused files).
  - **Deleted Unused Images**:
    - `assets/images/banner_prova.png`
    - `assets/images/banner_old.png`
    - `assets/images/service-2.png`
    - `assets/images/service-3.png`
    - `assets/images/banner_black.jpg`
    - `assets/images/banner.jpg`
    - `assets/images/banner intero.png`
    - `assets/logo/black_logo.png`
    - `assets/logo/white_logo.png`
  - **Verification**: Ran `npm run build` to ensure no broken references (Build successful).

### [2026-01-08] Fix: About Page Template Error
- **Problem**: The server failed to start with `Error: template: about/list.html:28: unterminated quoted string`.
- **Cause**: A string inside a Go template action `{{ ... }}` was split across two lines, which is not supported in this context.
- **Solution**: Joined the split string in `layouts/about/list.html` (line 28) into a single line.
- **Verification**: Ran `npm run dev` and confirmed the server starts successfully.

### [2026-01-08] Eliminate Tags Section
- **Objective**: Completely remove the "Tags" section from the visible website.
- **Changes**:
  - **Templates**:
    - `layouts/categories/list.html`: Removed `widgets/tech-tags` and `widgets/blog-tags` partial references.
    - `layouts/blog/single.html`: Removed the HTML block attempting to render tags at the bottom of posts.
  - **Configuration**:
    - `config/_default/params.toml`: Set `search.show_tags` to `false` to prevent tags from appearing in search results.

### [2026-01-09] Reduce Logo Size
- **Objective**: Reduce the visual size of the website logo.
- **Changes**:
  - **Configuration**:
    - `config/_default/params.toml`: Reduced `logo_width` from `160px` to `120px` and `logo_height` from `32px` to `24px`.

### [2026-01-09] Security Audit & Leak Remediation
- **Objective**: Remediate a leaked Google API Key associated with a GitHub Secret Scanning alert.
- **Changes**:
  - **Configuration**:
    - `config/_default/params.toml`: Completely removed the `[google_map]` section. Use of Google Maps has been discontinued on the site.
    - `themes/hugoplate/layouts/contact/list.html`: Removed the map container and associated scripts.
  - **Scanning**:
    - Performed a grep scan of the codebase for other potential leaks. Found a false positive in `swiper-bundle.css` (likely base64 noise), confirmed no other active constraints.
  - **Documentation**:
    - Updated `TO_SIMO_DO.md` with immediate instructions to revoke the compromised key. Removed instruction to generate a new key.

### [2026-01-09] Workflow Cleanup
- **Objective**: Eliminate redundant and failing workflows.
- **Changes**:
  - `github/workflows/translate-deploy.yml`: Deleted this file. The "Auto-translate" logic was experimental and no longer needed. Deployment is now handled exclusively by the standard `hugo.yml` workflow.

### [2026-01-12] Create New Thought Articles
- **Objective**: Create two new articles in the "thoughts" category.
- **Changes**:
  - Created `content/italian/blog/thought/the-star-counter/index.md`
  - Created `content/italian/blog/thought/live-the-dream/index.md`
  - set `draft: true` initially.

### [2026-01-12] Fix: Mobile Search Bar Responsiveness
- **Objective**: Adapt the search bar modal for mobile users as it was previously overflowing the screen and unusable.
- **Changes**:
  - **CSS**: Added a media query `@media (max-width: 768px)` in `assets/css/custom.css`.
  - **Layout**: Adjusted `.search-modal > div` to have `width: 95%`, `max-width: 95vw`, and `max-height: 80vh`. 
  - **Styling**: Tweaked padding and font sizes for better touch usability on smaller screens.
  - **Verification**: Manually verified that the modal acts as a proper overlay on mobile viewports.

  - **Verification**: Manually verified that the modal acts as a proper overlay on mobile viewports.

### [2026-01-12] Enhance Blog Card UX
- **Objective**: Make the entire blog card clickable and fix a template syntax error.
- **Changes**:
  - **Template**: Refactored `layouts/partials/components/blog-card.html`.
  - **Logic**: Changed the outer `div` to an `a` tag linking to `.RelPermalink`.
  - **Fix**: Replaced nested `<a>` tags with `<span>` elements to maintain valid HTML. Verified syntax of `partial "image"` call.
- **Result**: Users can click anywhere on the card to navigate to the article.

### [2026-01-12] Add External Links to Blog Cards
- **Objective**: Display external social/project links directly on the blog card for quick access.
- **Changes**:
  - **Template**: `layouts/partials/components/blog-card.html`.
  - **Logic**: Refactored card to use an absolute link mask (`z-0`) for the article click, and a separate `z-20` layer for external link icons.
  - **Data source**: Uses the `links` list in frontmatter (title, website).
  - **Icons**: Auto-assigns FontAwesome icons based on URL keywords (instagram/youtube/tiktok/github).
  - **Dark Mode**: Fixed visibility issue by enforcing `dark:bg-black/90` and `dark:text-white` for external link buttons.

### [2026-01-12] SEO & GEO Optimization (Generative Engine Optimization)
- **Objective**: Optimize the site and data structure for visibility in LLM answers (GEO - Generative Engine Optimization).
- **Changes**:
  - **Data Unification**:
    - **Refactor**: Deprecated `data/social.json`. Migrated all social link rendering logic (e.g., in `footer.html`) to use `data/about.yml` as the Single Source of Truth.
  - **Schema.org (JSON-LD)**:
    - **Dynamic Data**: Refactored `layouts/partials/seo/schema-person.html` to pull `passions`, `vision`, and `socials` directly from `about.yml`.
    - **Entity Enforcement**: Added hardcoded "KnowsAbout" entries for "Computer Science", "Artificial Intelligence", "Large Language Models", and "High-Performance Computing" to reinforce entity expertise.
  - **Semantics**:
    - **About Page**: Added `id="profile-bio"` to the main biographical paragraph in `layouts/about/list.html` to assist with semantic anchoring.
