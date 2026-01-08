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

## Fix: About Page Template Error (Jan 08, 2026)
- **Problem**: The server failed to start with `Error: template: about/list.html:28: unterminated quoted string`.
- **Cause**: A string inside a Go template action `{{ ... }}` was split across two lines, which is not supported in this context.
- **Solution**: Joined the split string in `layouts/about/list.html` (line 28) into a single line.
- **Verification**: Ran `npm run dev` and confirmed the server starts successfully.
