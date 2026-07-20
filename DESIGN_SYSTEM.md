# simo-hue — UI v2 Design System

> Outcome of the design brainstorm (2026-07-13). Direction: **Swiss / editorial tech** — "engineer with taste." Built on the `new-UI` branch via *restyle-in-place* (SEO/schema untouched).

## 1. Direction
Monochrome discipline · hairline grids · generous whitespace · grotesk↔mono contrast · **one** warm accent used as a signal (never decoration). Reference feel: Linear / Vercel / Rauno.

## 2. Mode
- **Dark-first** (refined true near-black), **light mode first-class**, toggle kept.
- `theme_default = "dark"`.

## 3. Color tokens (`data/theme.json`)
| Token | Dark (primary) | Light |
|---|---|---|
| `body` (canvas) | `#0a0a0a` | `#fafaf8` |
| `light` (surface) | `#141414` | `#ffffff` |
| `border` (hairline) | `#262626` | `#e6e4df` |
| `primary` (emphasis) | `#fafafa` | `#0a0a0a` |
| `text-dark` (strong) | `#fafafa` | `#0a0a0a` |
| `text` (body) | `#a3a3a3` | `#52525b` |
| `text-light` (muted) | `#6b6b6b` | `#78716c` |
| **`accent` (copper)** | `#d9823f` | `#a85a2a` |

Accent usage: links, active nav, focus ring, one key mark per view. Nowhere else.

## 4. Typography (self-hosted, no external calls)
- **Geist Sans** — display + body (`--font-primary`, `--font-secondary`). Weights 400/500/600/700.
- **Geist Mono** — eyebrows, dates, tags, section numbers (`01 / JOURNEY`), ⌘K hints, code (`--font-mono`). Weights 400/500.
- Display: tight tracking (−0.02→−0.03em). Mono labels: uppercase, +0.08em, ~12–13px.
- Body line-height 1.6; headings 1.05–1.15.

## 5. Layout
- Container ~1200px; reading column ~680px.
- Big vertical rhythm; full-bleed hairline rules between sections.
- Left-aligned mono eyebrow + heading (drops the centered gradient-underline device).

## 6. Surfaces
1px hairline borders · radius ~3px · flat (no shadows). Ghost/outline buttons; accent-fill on primary hover.

## 7. Navigation
Fixed top bar, hairline underline, mono wordmark · ~4 primary items · **⌘K command palette** (jump to any section / latest post) · theme toggle · ghost Résumé. Mobile → sheet.

## 8. Hero
Mono eyebrow → restrained ink/white Geist headline (no gradient) → one sentence → two ghost CTAs, on a hairline grid. Optional single-line mono "kindness → digital innovation" nod.

## 9. Motion
Micro-interactions + short section fade-ins + **one** signature (hairline grid draws in / eyebrow types). Blobs + infinite gradient removed. All `prefers-reduced-motion`-gated.

## 10. Imagery
Natural color against monochrome chrome — photos are the only color; framed in 1px.

## 11. Approach & rollout
- **Restyle in place**: change only `data/theme.json`, `assets/css/*`, self-hosted Geist fonts, and presentational markup in `layouts/*`. Tailwind v4 stays. All SEO/schema partials untouched.
- Phases (branch `new-UI`, merge to `master` once fully approved):
  - **P0** — tokens + Geist fonts + global shell (header/footer + ⌘K) + homepage.
  - **P1** — blog list + single + categories (reading experience).
  - **P2** — about + passions (+sub) + links.
  - **P3** — globe + call + connect + search + 404.

## 12. Guardrails
Preserve SEO/schema/sitemap · keep light+dark · keep every feature (search, theme toggle, résumé, Globe, booking) · keep perf (self-hosted fonts, no external font calls, minimal JS, reduced-motion).
