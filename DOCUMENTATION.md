# Phase 1 Optimization - Render-Blocking Resources  

## Data: 2026-01-16

## Modifiche Implementate

### 1. Resource Hints e Preconnect
**File**: `layouts/partials/essentials/style.html`

Aggiunte direttive per ridurre il tempo di connessione ai domini esterni:
```html
<link rel="preconnect" href="https://www.googletagmanager.com" crossorigin />
<link rel="dns-prefetch" href="https://www.googletagmanager.com" />
<link rel="preconnect" href="https://use.fontawesome.com" crossorigin />
<link rel="dns-prefetch" href="https://use.fontawesome.com" />
```

**Impatto atteso**: Riduzione di ~100-200ms sul FCP per connessioni anticipate.

---

### 2. Preload Font Critici
**File**: `layouts/partials/essentials/style.html`

Preload dei font utilizzati above-the-fold:
```html
<link rel="preload" href="/fonts/Heebo-Regular.ttf" as="font" type="font/ttf" crossorigin />
<link rel="preload" href="/fonts/Signika-Medium.ttf" as="font" type="font/ttf" crossorigin />
```

**Impatto atteso**: Eliminazione di flash di text non stilizzato (FOUT), riduzione ~30ms perceived performance.

---

### 3. Google Analytics Asincrono
**File**: `layouts/partials/essentials/head.html`

**Prima** (render-blocking):
```html
{{ template "_internal/google_analytics.html" . }}
```

**Dopo** (async):
```html
<script async src="https://www.googletagmanager.com/gtag/js?id={{ site.Config.Services.GoogleAnalytics.ID }}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '{{ site.Config.Services.GoogleAnalytics.ID }}');
</script>
```

**Impatto atteso**: Riduzione di ~300-500ms sul FCP eliminando il render-blocking di Google Analytics.

---

### 4. Defer JavaScript Principale
**File**: `themes/hugoplate/layouts/partials/essentials/script.html`

Aggiunto attributo `defer` allo script bundle principale:
```html
<script
  defer
  crossorigin="anonymous"
  integrity="{{ $scripts.Data.Integrity }}"
  src="{{ $scripts.RelPermalink }}"></script>
```

Anche gli script esterni ora usano `defer`:
```html
<script
  defer
  src="{{ .link | relURL }}"
  type="application/javascript"
  {{ .attributes | safeHTMLAttr }}></script>
```

**Impatto atteso**: Riduzione di ~400-600ms sul FCP permettendo al parsing HTML di non essere bloccato dagli script.

---

### 5. Lazy CSS Non Critico
**File**: `layouts/partials/essentials/style.html`

Utilizzato il "media print trick" per caricare CSS non critico senza blocking:
```html
<link rel="stylesheet" href="{{ $stylesLazy.RelPermalink }}" 
      integrity="{{ $stylesLazy.Data.Integrity }}" 
      media="print"
      onload="this.media='all'; this.onload=null;" />
```

**Impatto atteso**: CSS lazy (Font Awesome, Swiper, Glightbox) non blocca più il rendering.

---

### 6. Cache Headers Ottimizzati
**File**: `static/_headers`

Aggiunta cache rule per immagini WebP:
```
/*.webp
  Cache-Control: public, max-age=31536000, immutable
```

**Impatto atteso**: Migliore punteggio caching su PageSpeed Insights, ~280 KiB risparmiati su repeat visits.

---

## Build Status

✅ **Build completato con successo**
- Tempo di build: 1797 ms
- Pagine generate: 484
- Immagini processate: 365
- Nessun errore o warning

## Metriche Attese vs Precedenti

| Metrica | Prima | Target Phase 1 | Miglioramento Atteso |
|---------|-------|----------------|---------------------|
| **FCP (First Contentful Paint)** | 5.3s | ~3.0s | ↓ 2.3s (-43%) |
| **LCP (Largest Contentful Paint)** | 6.3s | ~4.0s | ↓ 2.3s (-37%) |
| **Speed Index** | 5.6s | ~4.5s | ↓ 1.1s (-20%) |
| **Performance Score** | 64 | ~75-80 | ↑ 11-16 punti |

## File Modificati

1. `/layouts/partials/essentials/style.html` - Nuova creazione con resource hints
2. `/layouts/partials/essentials/head.html` - Nuova creazione con GA async
3. `/themes/hugoplate/layouts/partials/essentials/script.html` - Nuova creazione con defer
4. `/static/_headers` - Aggiunta cache rule per WebP

## Prossimi Passi

1. **Deploy su GitHub Pages**
   - Committare le modifiche
   - Push su repository
   - Attendere completion GitHub Actions

2. **Test PageSpeed Insights**
   - Aprire https://pagespeed.web.dev/
   - Testare https://simo-hue.github.io
   - Modalità: Mobile
   - Documentare nuovi punteggi

3. **Validazione Funzionale**
   - Verificare che il sito funzioni correttamente
   - Testare navigazione, search, immagini
   - Verificare tracking Analytics (console browser)

4. **Se Phase 1 ha successo**: Procedere con Phase 2 (Font Optimization) o Phase 3 (JavaScript Optimization) in base ai risultati ottenuti.

## Note Tecniche

- Tutti i font avevano già `font-display: swap` ✅
- Gli script lazy avevano già `defer` e `async` ✅
- Cache headers erano già ben configurati, aggiunto solo WebP specifico
- Google Tag Manager partial non esisteva (era referenziato ma mancante)

---

# Phase 2 Optimization - LCP Priority Image Loading

## Data: 2026-01-16

## Problema da Phase 1
- ❌ LCP: 6.3s → 6.8s (peggiorato)
- Root Cause: `loading="lazy"` su TUTTE le immagini, incluse quelle LCP

## Modifiche

### 1. Image Partial - Priority Support
**File**: `layouts/partials/image.html`

Aggiunto parametro `Priority`:
- `Priority=true` → `loading="eager" fetchpriority="high"`
- `Priority=false` → `loading="lazy"` (default)

### 2. Blog Cover Images
**File**: `themes/hugoplate/layouts/blog/single.html`

```html
{{ partial "image" (dict ... "Priority" true) }}
```

Cover images ora si caricano immediatamente con massima priorità.

## Build: ✅ 1564 ms

## Target: LCP 6.8s → < 2.5s (-63%)

