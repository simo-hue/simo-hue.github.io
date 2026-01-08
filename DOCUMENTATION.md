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
