- [ ] evitare doppioni delle call che si sovrappongono

- [ ] provare ad implementare metodo immediato- Salva l'immagine che hai allegato in chat nel percorso: `static/images/profile_connect.png` per renderla visibile nella pagina Linktree.

---

## [2026-10-15] SEO/GEO — measurement after metadata improvements

You confirmed access to Google Search Console and Bing Webmaster Tools. This supersedes the older instruction to create those accounts or supply a Bing verification token for this task. No new credentials or setup are needed.

1. Before publishing, save/export a 28-day baseline from both dashboards: indexed-page coverage, clicks and impressions for “Simone Mattioli” / “Mattioli Simone”, and relevant non-name software-development/AI queries where data exists. Do not interpret missing query rows as proof that no searches occurred.
2. After the changes are published, submit or recheck `https://simo-hue.github.io/sitemap.xml` in both dashboards. Inspect the homepage, `/about/`, `/projects/`, and `/blog/publications/llm-tourism-mobility-predictor/`; request re-crawling where the dashboard supports it. The local sitemap has 78 entries, up from 76. Keep the existing satellite sitemap submissions; all eight advertised sitemap URLs returned HTTP 200 during this audit.
3. Compare equivalent reporting periods after recrawling, separating name searches from non-name discovery. For chatbot spot checks, record the exact prompt, service, search enabled/disabled, date, factual accuracy and cited sources. Ranking or chatbot inclusion is not guaranteed.

Changes are local and unpublished at handover. Details and verification: `SEO_AUDIT/2026-10-15-metadata-optimization.md`. No visible content edits are required for this release.
