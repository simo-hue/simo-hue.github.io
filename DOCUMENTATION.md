# DOCUMENTATION

## Implementation Logs

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
