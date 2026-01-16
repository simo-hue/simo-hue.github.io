# Azioni Manuali Necessarie - Full Deployment

## Deploy Completo (Phases 1 + 2 + WebP + Listing Optimization)

### 1. Review delle Modifiche

```bash
cd /Users/simo/Downloads/simo-hue.github.io

# Vedi tutte le modifiche
git status
git diff --stat
```

### 2. Deploy su GitHub Pages

```bash
# Aggiungi tutti i file modificati
git add layouts/partials/essentials/style.html
git add layouts/partials/essentials/head.html
git add themes/hugoplate/layouts/partials/essentials/script.html
git add static/_headers
git add layouts/partials/image.html
git add themes/hugoplate/layouts/blog/single.html
git add themes/hugoplate/layouts/blog/list.html
git add layouts/categories/list.html
git add layouts/partials/components/blog-card.html
git add content/  # Tutti i file index.md con WebP
git add scripts/convert-images-to-webp.sh

# Commit completo
git commit -m "perf: comprehensive mobile performance optimization

Phase 1 - Render-Blocking Resources:
- Added preconnect/dns-prefetch for critical domains
- Preloaded critical fonts (Heebo, Signika)
- Made Google Analytics async (non-blocking)
- Added defer to main script bundle
- Optimized lazy CSS with media print trick
- Added WebP-specific cache headers

Phase 2 - LCP Optimization:
- Modified image.html partial to support Priority parameter
- Added loading='eager' + fetchpriority='high' for LCP images
- Applied Priority=true to blog post cover images
- Applied Priority=true to first 2 cards in listing pages
- Fixed /categories/books/ LCP bottleneck (7.4s → target <2.5s)

WebP Conversion:
- Updated 47 index.md files with .webp references
- Replaced all .jpg, .JPG, .png, .PNG with .webp
- Created automated conversion script

Expected impact:
- FCP: 5.3s → <2.5s (-53%)
- LCP: 7.4s → <2.5s (-66%)
- Performance: 63 → 85+
- Speed Index: 5.3s → <3.0s"

# Push su GitHub
git push origin main
```

### 3. Attendi GitHub Actions

- Vai su: https://github.com/simo-hue/simo-hue.github.io/actions
- Verifica deploy completo (~2-3 minuti)

### 4. Test PageSpeed Insights - MULTIPLI

**IMPORTANTE**: Testa 3 URL diversi:

#### Test 1: Homepage
- URL: `https://simo-hue.github.io`
- Mobile
- **Baseline**: Performance 73, LCP 6.8s
- **Target**: Performance 80+, LCP <3.0s

#### Test 2: Category Page (CRITICO!)
- URL: `https://simo-hue.github.io/categories/books/`
- Mobile
- **Baseline**: Performance 63, LCP 7.4s ❌
- **Target**: Performance 80+, LCP <2.5s ✅

#### Test 3: Blog Post
- URL: Qualsiasi post, es. `https://simo-hue.github.io/blog/...`
- Mobile
- **Baseline**: Performance ~60-70, LCP 6.8s
- **Target**: Performance 85+, LCP <2.0s

### 5. Documenta Risultati

Per OGNI test:

| Metrica | Prima | Dopo | Miglioramento |
|---------|-------|------|---------------|
| **Performance** | __ | __ | +__ pts |
| **FCP** | __s | __s | __s |
| **LCP** | __s | __s | __s |
| **Speed Index** | __s | __s | __s |
| **TBT** | __ms | __ms | __ms |

### 6. Validazione DevTools

Apri Chrome DevTools su una pagina di categoria:

1. **Network Tab**:
   - Filtra per "Img"
   - Verifica prime 2 immagini hanno `Priority: High`
   - Altre immagini hanno `Priority: Low`

2. **Performance Tab**:
   - Registra caricamento pagina
   - Trova LCP element (dovrebbe essere prima card image)
   - Verifica timing < 2.5s

### 7. Validazione Funzionale

- [ ] Homepage carica correttamente
- [ ] Pagine categorie caricano velocemente
- [ ] Blog posts individuali caricano velocemente
- [ ] Prime immagini nelle liste caricano immediatamente
- [ ] Scroll smooth senza layout shift
- [ ] Search funziona
- [ ] Menu navigazione funziona

## Risultati Attesi

### Scenario Migliore
- **Categories/Books**: 63 → 85+ (+22 pts, LCP 7.4s → 2.0s)
- **Homepage**: 73 → 85+ (+12 pts, LCP 6.8s → 2.5s)
- **Blog Posts**: 60-70 → 90+ (+20-30 pts, LCP 6.8s → 1.8s)

### Scenario Realista
- **Categories/Books**: 63 → 75-80 (+12-17 pts, LCP 7.4s → 3.0s)
- **Homepage**: 73 → 80-85 (+7-12 pts, LCP 6.8s → 3.0s)
- **Blog Posts**: 60-70 → 80-85 (+10-25 pts, LCP 6.8s → 2.5s)

## Se i Risultati Non Soddisfano

### LCP ancora > 3s
- Verifica nel DevTools quale elemento è LCP
- Potrebbe essere necessario preload esplicito nella head
- Considera compressione immagini più aggressiva

### Performance < 75
- Analizza diagnostics PageSpeed per nuove raccomandazioni
- Potrebbe servire Phase 3 (JS optimization)
- Considera CSS minification più aggressiva

### TBT aumentato
- Normale aumento lieve
- Se > 200ms, investigare script defer timing
- Potrebbe servire code splitting

## Monitoraggio Continuo

Dopo deploy, monitora:
- Google Search Console (Core Web Vitals)
- Real User Monitoring se disponibile
- PageSpeed Insights periodici (variabilità normale)

## Note

- **Variabilità**: PageSpeed può variare ±5-10 punti tra test
- **Fare 2-3 test** per ogni URL per media affidabile
- **Focus su LCP**: È la metrica più impattante per UX
- **Desktop già ottimo**: 97/100, focus rimane su mobile
