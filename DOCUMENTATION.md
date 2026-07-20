# HPC and Quantum Computing Certificate Update
## Data: 2026-04-16
## Modifiche
Aggiunto il nuovo certificato CINECA riguardante l'HPC e il Quantum Computing alla sezione "Certificates" della pagina dei links.

### File Modificati
- [`data/links.yml`](file:///Users/simo/Downloads/DEV/simo-hue.github.io/data/links.yml): Aggiunto l'item "HPC and Quantum Computing".

## Tech Notes
- Icona utilizzata: `fas fa-microchip`.
- Colore: `bg-sky-50` (Azzurro per distinguersi dagli altri certificati CINECA).

---

- [2026-06-16 17:33:01 CEST]: Globe Page Immersive Redesign
- *Details*: Rebuilt `/globe/` as a cinematic, realistic Earth experience while preserving the existing country-to-article workflow. Countries with mapped articles now render with transparent green fills, the page has a minimal atlas overlay with live story/country stats, and country clicks open a full story panel with a redesigned D3 country map, article imagery, category pills, stats, and polished empty states.
- *Tech Notes*: Updated `layouts/globe/list.html` and `layouts/partials/globe-point.html`. Globe.gl and D3 are now loaded from pinned jsDelivr URLs. The globe uses realistic Earth, bump, starfield, atmosphere, and delayed non-interactive cloud texture assets from `three-globe`. Article point data now includes categories. Added accessible HTML hit targets over globe markers so direct marker clicks open articles while country clicks open the story panel. Verified with `npm run build` and browser checks for `/globe/`, no-article country panel, populated United Kingdom panel, article cards, D3 pins, direct globe marker navigation, D3 pin article navigation, and mobile panel layout.

---

- [2026-06-16 19:57:02 CEST]: Globe Country Panel Scroll and Marker Density Fix
- *Details*: Fixed the `/globe/` country panel layout so the left D3 country outline keeps a stable render area and the right story rail scrolls vertically when a country has many articles. Reworked the main globe markers around country-level exploration: country clicks, country markers, and tiny close-range location dots now open the country story panel, while exact article navigation remains available only from the panel cards and panel map pins.
- *Tech Notes*: Updated `layouts/globe/list.html`. The panel shell now uses fixed viewport-height grid constraints with `min-height: 0`, contained overflow, and an independently scrollable `.story-list`. Country map rendering is deferred/retried after panel open and observed for resize changes. Main globe article-level HTML markers were replaced by compact country markers with hover-only counts; article point dots are hidden until close zoom and no longer navigate directly to article URLs. Verified with `npm run build`, generated inline script syntax compilation, and local `/globe/` HTTP `200` check. In-app browser navigation to localhost was blocked by Browser Use policy during visual verification.

---

- [2026-06-16 20:06:47 CEST]: Globe Visited Country Ping Removal
- *Details*: Removed the main globe's visited-country ping/marker treatment so explored countries are represented by the green country fill only. Preserved the pulsing pins inside each country's D3 story map, where exact article locations remain interactive.
- *Tech Notes*: Updated `layouts/globe/list.html`. Removed the Globe.gl country marker HTML layer and ring layer from the main Earth view, while keeping polygon hover/click behavior and tiny close-zoom detail points that open the country panel. Verified with `npm run build`, generated globe script syntax compilation, and `git diff --check`.

---

- [2026-06-16 20:14:04 CEST]: Globe Spotlight Statistics Bar
- *Details*: Replaced the old top-left Personal Atlas statistics card with a centered bottom macOS Spotlight-inspired glass stats bar. The overlay now contains only compact counters for countries, continents, and stories, stays centered on mobile, and fades out when the country story panel opens.
- *Tech Notes*: Updated `layouts/globe/list.html`. Added the `globe-continent-count` statistic and compute it from the Natural Earth `CONTINENT` metadata in the same fetched country GeoJSON used by the globe polygons. Updated the loading badge offset to avoid overlapping the new bottom bar. Verified with `npm run build`, generated globe script syntax compilation, local `/globe/` HTTP `200`, and `git diff --check`.

---

- [2026-06-16 20:15:25 CEST]: Globe Spotlight Stats Vertical Alignment Fix
- *Details*: Centered the Spotlight stats text vertically inside the bottom glass bar so the counters and labels sit in the visual middle of the capsule on desktop and mobile.
- *Tech Notes*: Updated `layouts/globe/list.html`. Replaced baseline alignment with centered flex/grid alignment for `.globe-stats` and `.globe-stat`, tightened label line-height, and prevented label wrapping. Verified with `npm run build`, generated globe script syntax compilation, and `git diff --check`.

---

# Academic Profiles Links Update

## Data: 2026-04-16
## Modifiche
Aggiunta una nuova sezione "Academic Profiles" nella pagina dei links per includere i profili accademici di ricerca.

### File Modificati
- [`data/links.yml`](file:///Users/simo/Downloads/DEV/simo-hue.github.io/data/links.yml): Inserita la sezione "Academic Profiles" con i seguenti link:
    - **Google Scholar**: Profilo per pubblicazioni scientifiche e citazioni.
    - **ORCID**: Identificativo ufficiale per la ricerca accademica.
    - **SciProfile**: Profilo accademico su SciProfiles.

## Tech Notes
- Icone utilizzate: `fas fa-graduation-cap` (Google Scholar), `fab fa-orcid` (ORCID), `fas fa-user-graduate` (SciProfile).
- Colori armonizzati con il design system esistente (blue, lime, emerald).

---

# Bug Fix - Bachelor Degree PDF 404


## Data: 2026-04-09

## Problema
Il file `/docs/Bachelor.pdf` restituiva un errore 404 nonostante fosse presente nella cartella `assets/docs/`.

## Causa
Hugo non serve automaticamente i file presenti nella cartella `assets/` a meno che non siano processati via Hugo Pipes. Per essere serviti come file statici all'indirizzo `/docs/...`, devono trovarsi nella cartella `static/docs/`.

## Soluzione
Copiato il file `assets/docs/Bachelor.pdf` in `static/docs/Bachelor.pdf`.

---

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



---

# WebP Image References Update

## Data: 2026-01-16

## Problema
Alcuni file index.md contenevano riferimenti a immagini in formati non ottimizzati (.jpg, .JPG, .png, .PNG) invece di usare le versioni .webp già esistenti.

## Soluzione
Creato script automatico `scripts/convert-images-to-webp.sh` che:
1. Cerca tutti i riferimenti a immagini non-WebP nei file index.md
2. Verifica l'esistenza delle versioni .webp
3. Aggiorna i riferimenti nel frontmatter e contenuto

## Risultati
- **47 file index.md aggiornati**
- **49 riferimenti a immagini corretti**
- Tutte le versioni .webp già esistevano (da conversione precedente)
- Build: ✅ 5.7s senza errori

## Categorie Aggiornate
- Blog: thought, books, experience, project
- Tech-project, publication, passions

## Impatto
Garantisce che TUTTE le immagini mostrate usino il formato WebP ottimizzato, completando l'ottimizzazione delle immagini.


---

# Phase 2.5: Priority Loading for Listing Pages

## Data: 2026-01-16

## Problema Identificato
Test post-Phase 2 mostrarono:
- **Categories/Books**: LCP 7.4s (PEGGIORE!)
- **Homepage**: LCP 6.8s (nessun miglioramento)
- Root cause: Prime blog card images nelle pagine di listing erano ancora lazy-loaded

## File Modificati

### 1. Blog Card Partial
**File**: `layouts/partials/components/blog-card.html`

Aggiunto parametro Priority dalla parent page:
```html
{{ $priority := .Params.Priority | default false }}
{{ partial "image" (dict ... "Priority" $priority) }}
```

### 2. Blog List
**File**: `themes/hugoplate/layouts/blog/list.html`

First 2 cards con Priority=true:
```html
{{ range $index, $page := $paginator.Pages }}
  {{ $isPriority := lt $index 2 }}
  {{ partial "components/blog-card" (dict "Page" $page "Params" (merge $page.Params (dict "Priority" $isPriority))) }}
{{ end }}
```

### 3. Categories List
**File**: `layouts/categories/list.html`

Stessa logica per pagine categorie (books, thought, etc.):
```html
{{ range $index, $page := $paginator.Pages }}
  {{ $isPriority := lt $index 2 }}
  {{ partial "components/blog-card" (dict "Page" $page "Params" (dict "Priority" $isPriority)) }}
{{ end }}
```

## Build: ✅ 1.4s (fastest yet!)

## Target LCP
- Categories/Books: 7.4s → < 2.5s (-66%)
- Homepage: 6.8s → < 3.0s (-56%)
- Blog List: simile a categories

## Strategia
Solo **prime 2 immagini** hanno Priority=high:
- Optimization mirata (non tutte le immagini)
- Rispetta best practice fetchpriority
- Massimo impatto su LCP con minimo overhead

---

# Google Tag Manager Implementation

## Data: 2026-01-16

## Obiettivo
Implementare Google Tag Manager (GTM) per centralizzare la gestione di tutti i tag di tracciamento e migliorare le capacità di analytics del sito.

## File Creati

### 1. GTM Script Partial
**File**: [`layouts/partials/gtm.html`](file:///Users/simo/Downloads/simo-hue.github.io/layouts/partials/gtm.html)

Script GTM inserito nel `<head>`:
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T3VMWGJP');</script>
<!-- End Google Tag Manager -->
```

**Container ID**: `GTM-T3VMWGJP`

### 2. GTM NoScript Partial
**File**: [`layouts/partials/gtm-noscript.html`](file:///Users/simo/Downloads/simo-hue.github.io/layouts/partials/gtm-noscript.html)

Fallback per browser senza JavaScript, inserito dopo `<body>`:
```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T3VMWGJP"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

## File Modificati

### 3. Head Template - SEO Optimized Positioning
**File**: [`layouts/partials/essentials/head.html`](file:///Users/simo/Downloads/simo-hue.github.io/layouts/partials/essentials/head.html)

#### Ottimizzazione 1: GTM Posizionato il Più in Alto Possibile
**Best Practice Google**: GTM deve essere inserito quanto più in alto possibile nel `<head>`.

**Implementazione** (linee 6-9):
```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

<!-- google tag manager - MUST BE AS HIGH AS POSSIBLE FOR SEO -->
{{ partialCached "gtm.html" . }}
```

**Posizione**: Subito dopo i meta tag essenziali (charset e viewport), **prima** di:
- Favicon
- Manifest
- SEO tags
- Structured data
- Tutti gli altri script

**Beneficio SEO**: 
- ✅ Caricamento anticipato del dataLayer
- ✅ Tracking più accurato di eventi early-page
- ✅ Riduzione time-to-interactive per analytics
- ✅ Conformità alle linee guida Google Tag Manager

#### Ottimizzazione 2: Disattivazione Google Analytics Diretto
**Problema identificato**: Conflitto tra implementazione diretta GA e GTM.

**Prima** (linee 36-45 - rimosso):
```html
<!-- google analytics - OPTIMIZED: defer loading -->
<script async src="https://www.googletagmanager.com/gtag/js?id=..."></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-MEASUREMENT_ID');
</script>
```

**Dopo** (linee 41-51 - commentato):
```html
<!-- google analytics - DISABLED: now managed through GTM (see TO_SIMO_DO.md) -->
{{/* ... codice GA commentato ... */}}
```

**Motivazione**:
- ⚠️ **Duplicate Tracking**: Avere sia GA diretto che GTM causa tracciamento duplicato
- ⚠️ **Conflitti dataLayer**: Entrambi usano `window.dataLayer`
- ⚠️ **Performance**: Due script analytics inutili rallentano il sito

**Best Practice**:
- ✅ Un solo sistema di tracking attivo
- ✅ GTM gestisce TUTTI i tag (incluso GA4)
- ✅ Configurazione centralizzata nel dashboard GTM
- ✅ Maggiore flessibilità senza modifiche al codice

**Azione Richiesta**: Configurare Google Analytics 4 tramite interfaccia GTM (vedi `TO_SIMO_DO.md`).

## Integrazione con Template Esistente

Il template [`baseof.html`](file:///Users/simo/Downloads/simo-hue.github.io/themes/hugoplate/layouts/_default/baseof.html) già includeva il placeholder per `gtm-noscript.html` alla linea 23:
```html
{{ partialCached "gtm-noscript.html" . }}
```

Quindi l'integrazione era già prevista nell'architettura del tema, bastava creare i file corrispondenti.

## Build Status

✅ **Build completato con successo**
- Tempo di build: 1712 ms
- Pagine generate: 484
- Immagini processate: 361
- Nessun errore o warning
- Server Hugo funzionante su http://localhost:1313/

## Benefici di Google Tag Manager

### 1. **Gestione Centralizzata**
- Un'unica interfaccia per gestire tutti i tag (Analytics, Ads, remarketing, ecc.)
- Non serve più modificare il codice sorgente per ogni modifica

### 2. **Performance**
- Caricamento asincrono dei tag
- Riduce il numero di snippet di codice nel source HTML
- GTM ottimizza automaticamente l'ordine di caricamento

### 3. **Tracciamento Eventi Avanzato**
Da configurare nell'interfaccia GTM:
- Click sui bottoni e link esterni
- Submit dei form
- Scroll depth tracking
- Video engagement
- Download di file
- Tempo di permanenza sulla pagina

### 4. **A/B Testing e Remarketing**
- Facile integrazione con Google Optimize
- Facebook Pixel, LinkedIn Insight Tag
- Custom audiences per remarketing

### 5. **Tag Assistant e Debug**
- Preview mode per testare modifiche
- Debug console integrato
- Versioning e rollback delle modifiche

## Prossimi Passi Consigliati

### 1. Configurazione Tag di Base in GTM
Accedere a https://tagmanager.google.com e configurare:

#### a) Google Analytics 4
- Tag Type: Google Analytics: GA4 Configuration
- Measurement ID: `G-MEASUREMENT_ID` (già presente in hugo.toml)
- Trigger: All Pages

#### b) Google Analytics Events
Tags personalizzati per eventi:
- **Scroll Tracking**: Trigger al 25%, 50%, 75%, 90% scroll
- **Outbound Links**: Click su link esterni
- **File Downloads**: Click su PDF, documenti
- **Social Shares**: Click sui bottoni social

#### c) Facebook Pixel (se necessario)
- Tag Type: Custom HTML
- Pixel ID da Facebook Business Manager
- Trigger: All Pages

### 2. Enhanced Ecommerce (se applicabile)
Se il sito venderà prodotti/servizi in futuro:
- Product impressions
- Add to cart events
- Purchase tracking

### 3. Conversion Tracking
Setup conversioni per obiettivi chiave:
- Iscrizione newsletter
- Richieste di contatto
- Download risorse
- Tempo di lettura articoli

### 4. User ID Tracking (opzionale)
Per tracciare utenti registrati cross-device:
- User ID implementation
- Cross-domain tracking se necessario

## Verifica Implementazione

### Test Locale
1. Aprire http://localhost:1313/ con browser DevTools
2. Aprire **Network tab** → cercare richieste a `googletagmanager.com`
3. Verificare presenza di:
   - `gtm.js?id=GTM-T3VMWGJP`
   - dataLayer inizializzato in console: `window.dataLayer`

### Test su Produzione (dopo deploy)
1. Installare [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk) (Chrome Extension)
2. Visitare https://simo-hue.github.io
3. Verificare che GTM container sia rilevato
4. Usare GTM Preview Mode per debug avanzato

## Note Tecniche

- **Cache**: GTM usa `partialCached` per ottimizzare le performance Hugo
- **DataLayer**: Disponibile globalmente come `window.dataLayer`
- **NoScript Fallback**: Assicura tracking basico anche senza JavaScript
- **Async Loading**: Lo script GTM usa caricamento asincrono per non bloccare rendering

## Compatibilità

✅ Google Analytics 4 (già presente)  
✅ Facebook Pixel  
✅ LinkedIn Insight Tag  
✅ Hotjar/Microsoft Clarity  
✅ Google Optimize  
✅ Custom scripts e tracciamenti

---

# Mattioli.OS Blog Post Creation

## Data: 2026-01-19

## Obiettivo
Creare un articolo blog in italiano per presentare "Mattioli.OS" (Habit Tracker), descrivendone filosofia, feature e stack tecnologico.

## Modifiche
### 1. Sovrascrittura Articolo Esistente
**File**: `content/english/blog/tech-project/mattioliOS/index.md`

Il file è stato aggiornato con:
- **Nuovo Frontmatter**: Titolo "Mattioli.OS: Come ho Costruito il mio Secondo Cervello Digitale", data odierna, tag aggiornati.
- **Contenuto**: Introduzione al problema (produttività vs complessità), Filosofia (Attrito, Privacy, Estetica), Feature (AI Coach, Gamification, Heatmaps), Tech Stack (React, Supabase, Tailwind) e Link al repo/demo.

## Stato
## Stato
✅ **Articolo Creato**: Contenuto in italiano professionale, pronto per la pubblicazione.

### Update (Traduzione)
**Data**: 2026-01-19
**Azione**: Tradotto l'articolo da Italiano a Inglese su richiesta dell'utente.
- Mantenuto tono "professionale ma personale".
- Integrata correzione manuale dell'utente riguardante le pagine delle statistiche.
✅ **Stato Finale**: Articolo in Inglese.


---

# Connect "Passions & Interests" to Blog Articles

## Data: 2026-01-19

## Obiettivo
Collegare le card della sezione "Passions & Interests" nella pagina About ai rispettivi articoli del blog per migliorare la navigazione e l'interconnessione dei contenuti.

## Modifiche

### 1. Data Update
**File**: [`data/about.yml`](file:///Users/simo/Downloads/DEV/simo-hue.github.io/data/about.yml)
- Aggiunta la proprietà `link` per ogni item nella lista `passions`.
- Mappatura definita:
    - Travel & Volounteering -> `brazil-volunteer-teaching-experience`
    - Content Creation -> `simo's diary`
    - Cars & Bikes -> `/passion/cars/`
    - Tech & AI -> `technology`
    - Mountain Nature -> `mountain-fauna-lover`
    - Outdoor Sports -> `sport`

### 2. Layout Update
**File**: [`layouts/about/list.html`](file:///Users/simo/Downloads/DEV/simo-hue.github.io/layouts/about/list.html)
- Modificato il loop delle passioni per rendere le card cliccabili.
- Avvolto il contenuto della card in un tag `<a>` se la proprietà `link` è presente.
- Mantenuto lo stile esistente e gli effetti hover.

# Hugo Build Timeout & Recursion Issue

## Data: 2026-01-28

## Problema
Il build di Hugo falliva con un errore di timeout dovuto a recursione infinita:
`error calling partial: partial "basic-seo.html" timed out after 30s. This is most likely due to infinite recursion.`

L'errore si verificava durante il rendering del post `content/english/blog/thought/being humble/index.md`.

## Causa
La partial `layouts/partials/basic-seo.html` tenta di generare una descrizione automatica se non presente nel frontmatter, accedendo a `.Summary`.
In alcuni contesti, l'accesso a `.Summary` può innescare un loop di rendering se il contenuto stesso richiede rendering complesso o chiama altre partial che a loro volta richiamano `basic-seo.html` (o simili).

## Soluzione
È stato aggiunto un campo `description` esplicito nel frontmatter del file markdown problematico.

**File**: `content/english/blog/thought/being humble/index.md`
```yaml
description: "Reflections on the importance of humility without losing self-confidence."
```

Questo bypassa la logica di generazione automatica del summary all'interno della partial SEO, risolvendo il problema di recursione.

## Nuova Regola
Assicurarsi che tutti i nuovi post abbiano un campo `description` compilato nel frontmatter per evitare problemi simili e migliorare la SEO.

---

# CampFlow Blog Post Translation

## Data: 2026-02-03

## Modification
**File**: `content/english/blog/tech-project/CampFlow/index.md`

- **Action**: Translated the entire blog post from Italian to English.
- **Details**: 
    - Preserved all markdown structure and frontmatter keys.
    - Translated title keys in `links` section.
    - Maintained the original tone and concepts as requested.

- [2026-02-03T10:24:00+01:00]: Cards Improvements
  - *Details*: Made the image area of blog cards clickable (linking to the post) by allowing clicks to pass through the image container to the underlying full-card link.
  - *Tech Notes*: Added `pointer-events-none` to `.blog-card-image` in `layouts/partials/components/blog-card.html`. External links inside the container retain `pointer-events-auto`.

- [2026-02-15]: 3D Globe Feature
  - *Details*: Implemented a new "Globe" page featuring a 3D interactive globe using `globe.gl`. The globe displays pins for visited locations based on `lat` and `lon` frontmatter in blog posts. Clicking a pin reveals a card with the post's title and image.
  - *Tech Notes*:
    - Added `Globe` menu item in `config/_default/menus.en.toml`.
    - Created `content/english/globe/_index.md`.
    - Created `layouts/globe/list.html` with `globe.gl` integration.
    - Implemented logic to fetch posts with coordinates and resolve their images correctly.
    - Optimized zoom controls: `minDistance` (120), `maxDistance` (600), slowed `zoomSpeed` (0.6) for smoother navigation.
    - Added event listeners to `globeViz` container to prevent default browser zoom (Ctrl+Wheel / Pinch / Gesture), ensuring only the globe zooms.
    - Switch to **Vector/Polygon Globe**: Replaced satellite texture with GeoJSON countries (`ne_110m_admin_0_countries.geojson`).
    - **Hybrid Visualization**: Restored `earth-blue-marble.jpg` (Satellite) as base texture.
    - **Transparent Polygons**: Styled country polygons to be transparent by default, showing borders and highlighting on hover.
    - Updated markers to be small, non-interactive red dots.
    - **Interaction Fixes**: Switched container to `fixed` positioning to ensuring perfect alignment with mouse coordinates (solving the offset issue). Disabled auto-rotation.
    - **Modern Modal Redesign**: Implemented a glassmorphic UI (`backdrop-blur`, `z-[100]`) with a responsive vertical layout.
    - **Header-Aware Layout**: Implemented dynamic header height detection in JS to offset the globe viewport, ensuring both the globe and modal start below the header and fill the remaining screen space.
    - **Default POV**: Set initial camera to center on Italy with an increased altitude for better framing.
    - **Data Audit**: Added coordinates to 4 additional blog posts (Brazil, Bologna, Lake Garda).

- [2026-02-15 19:21]: Add Val di Rabbi to Globe & Adjust Zoom
  - *Details*: Added coordinates for Val di Rabbi to the "Mountain Fauna Lover" project frontmatter. Adjusted the globe's default `pointOfView` altitude from 3.5 to 1.5 to focus more closely on Italy as requested.
  - *Tech Notes*: Modified `content/english/blog/project/mountainfaunalover/index.md` and `layouts/globe/list.html`.

- [2026-02-15 19:25]: Support Multiple Coordinates per Post
  - *Details*: Implemented support for multiple geographic locations per blog post. One article can now appear in multiple locations on the interactive globe.
  - *Tech Notes*:
    - Created `layouts/partials/globe-point.html` helper partial.
    - Updated `layouts/globe/list.html` to process the new `locations` frontmatter array.
    - Updated "Volunteering Activity in Brazil" with 4 distinct locations (Recife, João Pessoa, Olinda, Zumbi).
    - Refined titles in modal to show the original **Blog Post Title** instead of location labels, ensuring correct grouping and display when multiple pins belong to one post.


- [2026-02-15 19:45]: Add Margin to Globe Popup
  - *Details*: Added a margin between the navigation bar and the country detail popup on the globe page to improve visual spacing.
  - *Tech Notes*:
    - Updated `layouts/globe/list.html` with Tailwind padding classes (`pt-8`, `lg:pt-16`) and adjusted flex alignment to `items-start` on mobile to ensure consistent top spacing.

- [2026-02-15 19:48]: Modern Floating Globe Layout
  - *Details*: Transformed the globe viewport into a modern "floating" element with margins from the navbar and screen edges, rounded corners, and a subtle border.
  - *Tech Notes*:
    - Modified `layouts/globe/list.html` to add padding/margins to `#globe-viewport`.
    - Updated JavaScript `updateLayout` to dynamically calculate top margin based on header height + 24px offset.

- [2026-02-15 19:48]: Symmetrical Margin for Globe Popup
  - *Details*: Adjusted padding to provide symmetrical top and bottom margins for the country detail popup.
  - *Tech Notes*: Updated `layouts/globe/list.html` with `py-8` (mobile) and `lg:py-16` (desktop) on the modal container.

- [2026-02-15 19:51]: Symmetrical Spacing for Globe Popup
  - *Details*: Adjusted the globe popup padding to be symmetrical at the top and bottom.
  - *Tech Notes*:
    - Simplified Tailwind classes in `layouts/globe/list.html` to `p-8 lg:p-16` to ensure equal spacing from both the navigation bar and the bottom of the viewport.

- [2026-02-15 19:55]: Symmetric Pop-up Margins on Globe Page
  - *Details*: Applied symmetric margins (top, bottom, sides) to the country detail popup on the globe page.
  - *Tech Notes*:
    - Updated `layouts/globe/list.html`: Changed container to use uniform padding (`p-6` mobile, `p-20` desktop) and set inner modal height to `h-full` to ensure it consistently fills the available space with equal margins.

- [2026-02-15 19:54]: Refined Globe Pop-up Margins
  - *Details*: Reduced the globe pop-up margins significantly to a "tiny" symmetric gap.
  - *Tech Notes*:
    - Updated `layouts/globe/list.html`: Changed container padding to `p-1 lg:p-2`.

- [2026-02-15 20:10]: Focus Globe on Italy by Default
  - *Details*: Increased the initial zoom level on the globe page to focus closely on Italy upon loading.
  - *Tech Notes*:
    - Updated `.pointOfView({ altitude: 0.5 })` in `layouts/globe/list.html` to provide a much closer initial view of Italy.

- [2026-02-15 20:25]: Premium Mobile Optimization for Globe Modal
  - *Details*: Redesigned the country detail modal to provide a professional, responsive experience on mobile. Fixed issues where the modal was covered by the navbar or was not responsive to orientation changes.
  - *Tech Notes*:
    - **Stacking Context Fix**: Moved the modal out of the globe viewport container to prevent it from being trapped under the navbar.
    - **Responsive Layout**: Implemented a vertical layout for mobile (40% map, 60% list) and horizontal for desktop.
    - **Visual Enhancements**: Added premium glassmorphism (`backdrop-blur-md`), smooth entry animations (`translate-y`), and high-quality shadow effects.
    - **Dynamic Resizing**: Added a window resize listener to re-render the D3 map automatically, ensuring it fits the new container dimensions (e.g., on orientation change).
    - **UI Polish**: Refined the close button with hover rotations and better touch targets. Added a pulsing status indicator for the article count.

- [2026-02-15 20:30]: Robust Country Map & Title Layout Fix
  - *Details*: Resolved overlapping issues between the country name and the D3 map visualization. 
  - *Tech Notes*:
    - **Self-Correcting Layout**: Moved the country title from `absolute` to standard flex-col flow, ensuring the map container always starts below the text.
    - **Smart Projections**: Switched from `fitSize` to `fitExtent` in D3, implementing a 15% dynamic padding that automatically scales based on the available container dimensions.
    - **Header Protection**: Added responsive right-padding to the title container to prevent collisions with the fixed close button on narrow screens.

- [2026-02-22]: Add Poland Locations to Globe
  - *Details*: Added new points for "Auschwitz Birkenau" and "Kraków" on the interactive globe by creating a new experience article for the Poland trip.
  - *Tech Notes*: Created `content/english/blog/experience/Poland Trip/index.md` containing the `locations` frontmatter with latitude and longitude for both destinations.

- [2026-02-22]: Add Germany Locations to Globe
  - *Details*: Added new points for "Stuttgart", "Tübingen", and "Heidelberg" on the interactive globe by creating a new experience article for the Germany trip.
  - *Tech Notes*: Created `content/english/blog/experience/Germany Trip/index.md` containing the `locations` frontmatter with latitude and longitude for all three destinations.

- [2026-02-22]: Add UK Locations to Globe
  - *Details*: Added new points for "London", "Cambridge", "Seven Sisters", "Lewes", and "Brighton" on the interactive globe by creating a new experience article for the UK trip.
  - *Tech Notes*: Created `content/english/blog/experience/UK Trip/index.md` containing the `locations` frontmatter with latitude and longitude for the five destinations.

- [2026-02-22]: Add Italy Locations to Globe
  - *Details*: Added a new point for "Rome", the capital, on the interactive globe by creating a new experience article for the Italy trip.
  - *Tech Notes*: Created `content/english/blog/experience/Italy Trip/index.md` containing the `locations` frontmatter with latitude and longitude for Rome.

- [2026-02-22]: Add Rimini (GISEP) Location to Globe
  - *Details*: Added a new point for "Rimini (GISEP)" on the interactive globe by creating a new experience article for the GISEP event.
  - *Tech Notes*: Created `content/english/blog/experience/GISEP Rimini/index.md` containing the `locations` frontmatter with latitude and longitude for Rimini.

- [2026-02-22]: Add Budapest Location to Globe
  - *Details*: Added a new point for "Budapest" on the interactive globe by creating a new experience article for the trip with Collegio Don Mazza.
  - *Tech Notes*: Created `content/english/blog/experience/Budapest Trip/index.md` containing the `locations` frontmatter with latitude and longitude for Budapest.

- [2026-02-22]: Add Milan Location to Globe
  - *Details*: Bound Milan to the existing Vibe Coding Hackathon article and translated its title into English.
  - *Tech Notes*: Updated `content/english/blog/tech-project/Lobable-Vibe-Coding/index.md` to include `locations` frontmatter for Milan and changed the title to "First Lovable Vibe Coding Hackathon in Italy".

- [2026-02-22]: Add Venice Location to Globe
  - *Details*: Added a new point for "Venice" on the interactive globe by creating a new experience article detailing the paradigm shift of Venice.
  - *Tech Notes*: Created `content/english/blog/experience/Venice Trip/index.md` containing the `locations` frontmatter with latitude and longitude for Venice.

- [2026-02-28]: Add "Python for Scientific Computing" Certificate
  - *Details*: Added the CINECA attendance certificate for the "Python for Scientific Computing" course to the Certificates section of the links page.
  - *Tech Notes*: PDF already existed at `static/docs/Python for Scientific Computing.pdf`. Added new entry in `data/links.yml` under the "Certificates" section, placed after the "Introduction To Python" entry. Uses teal color scheme and the `fab fa-python` icon.

---

# UX Polish + PWA Enhancement

## Date: 2026-03-30

## Features Implemented

### 1. Reading Time Indicator
**Files**: `layouts/partials/components/blog-card.html`, `themes/hugoplate/layouts/blog/single.html`
- Added `{{ .ReadingTime }} min read` to blog cards (next to date, separated by ·)
- Added reading time to single post header (uses proper `fa-calendar` for date, `fa-clock` for reading time)
- Uses Hugo's built-in `.ReadingTime` variable (zero dependencies)

### 2. Sticky Sidebar Table of Contents
**File**: `themes/hugoplate/layouts/blog/single.html` (complete rewrite)
- Added 2-column layout: article (lg:col-8) + sticky TOC sidebar (lg:col-4)
- Glassmorphic TOC sidebar with `backdrop-blur`, `border`, `box-shadow`
- **Reading Progress Bar** inside the TOC — a gradient bar fills as you scroll through the article
- **Active Link Highlighting** — TOC link for the current section highlights in primary color on scroll
- Sidebar is hidden on mobile (visible only lg+)
- CSS: `.sticky-toc-sidebar`, `.reading-progress-bar`, `.sticky-toc-nav a.toc-active` in `custom.css`

### 3. Image Zoom Enhancements
**Files**: `themes/hugoplate/layouts/blog/single.html` (JS), `assets/css/custom.css`
- All inline markdown `<img>` within `.content-with-zoom` are automatically wrapped in GLightbox `<a>` tags on DOMContentLoaded
- Uses existing GLightbox library (already loaded via hugo plugin system)
- CSS: `cursor: zoom-in`, hover scale + shadow on content images

### 4. Enhanced PWA Service Worker
**File**: `static/service-worker.js` (new/override of vendor file)
- **Images**: `NetworkFirst` — always try network first, cache for 30 days
- **CSS/JS**: `StaleWhileRevalidate` — instant load from cache, refresh in background
- **Fonts**: `CacheFirst` — fonts cached for 1 year (they never change)
- **HTML Pages**: `NetworkFirst` with 5s timeout — graceful offline fallback
- Uses Workbox 6 (CDN-loaded, same as the module's version)

### 5. Offline Fallback Page
**Files**: `content/english/offline.md`, `layouts/offline/single.html`
- Premium offline page with floating animated emoji, clear messaging, and action buttons
- Service worker serves this page when network is unavailable

### 6. Enhanced Web App Manifest
**File**: `layouts/index.webmanifest`
- Added: `description`, `scope`, `orientation`, `lang`, `screenshots[]`
- Proper icon `purpose: "any maskable"` for Android adaptive icons
- Makes the site more installable as a PWA on Chrome/Android/iOS

## Build Status
✅ **Build: 585 pages, 0 errors, 2317ms**



## Data: 2026-03-23

## Problema
Google Search Console segnalava errori multipli: "Dati strutturati Breadcrumb problemi rilevati" con dettaglio "URL non valido nel campo 'id' (in itemListElement.item)" su molte pagine del sito.

## Cause Identificate
1. **Missing `item` URL** sul ultimo `ListItem` — il template ometteva il campo `item` (URL) sul breadcrumb finale
2. **`partialCached` con `.Section`** — tutte le pagine della stessa sezione condividevano lo stesso breadcrumb (sbagliato)
3. **Traversal parent limitato** — il template risaliva solo un livello di parent

## File Modificati

### 1. `layouts/partials/seo/schema-breadcrumb.html`
- Riscritto completamente il template
- Traversal completo della catena `.Parent` fino alla root
- Campo `item` (URL) presente su **tutti** i `ListItem`, incluso l'ultimo
- JSON-LD valido e conforme allo schema BreadcrumbList

### 2. `layouts/partials/essentials/head.html`
- Cambiato `partialCached` → `partial` per il breadcrumb (ogni pagina ha breadcrumb unico)

## Verifica
- ✅ Hugo build: 584 pagine, 0 errori
- ✅ JSON-LD verificato su 6 pagine (about, tags, passion, globe): tutti i ListItem hanno URL validi

---

# Fix Google Search Console Sitemap Fetch Errors

## Data: 2026-03-23

## Problema
Google Search Console mostra "Impossibile recuperare" per 3 sitemap inviate.

## Analisi
- `/sitemap.xml` — **funziona**: è accessibile e contiene XML valido
- `/mattioli.OS/sitemap.xml` — **non esiste**: path errato da un altro progetto
- `/layouts/sitemap.xml` — **non esiste**: path di directory sorgente, non URL pubblico

## Bug Trovato e Risolto
### `layouts/sitemap.xml`
- Una entry aveva `<loc/>` vuoto (pagina senza Permalink)
- Aggiunto guard `.Permalink` al filtro per escludere pagine invalid

## Azione Manuale Richiesta
Rimuovere da GSC le sitemap errate `/mattioli.OS/sitemap.xml` e `/layouts/sitemap.xml`, poi re-inviare `/sitemap.xml`.

---

# Fix Google Search Console Video Indexing Errors

## Data: 2026-03-23

## Problema
GSC segnala "Video non si trova su una pagina di visualizzazione" per 3 pagine con embed YouTube.

## Causa
Le pagine avevano iframe YouTube nel HTML ma nessun markup strutturato VideoObject per aiutare Google a identificare e indicizzare i video.

## Soluzione
### Nuovo file: `layouts/partials/seo/schema-video.html`
- Rileva automaticamente video YouTube dal contenuto delle pagine (shortcode `{{< youtube ID >}}`)
- Genera JSON-LD `VideoObject` con: nome, descrizione, thumbnail, uploadDate, contentUrl, embedUrl
- Integrato in `layouts/partials/essentials/head.html`

### Pagine interessate (12 totali):
- `blog/tech-project/epicure-hackathon-2024/`
- `blog/thought/gratitude/`
- `blog/thought/cassioli/`
- `blog/project/simo's-diary/`
- `blog/project/mountainfaunalover/`
- `blog/thought/live-the-dream/`
- `blog/passions/car/`
- `blog/experience/sicily/`
- `blog/experience/brazil-volunteer-teaching-experience/`
- `blog/experience/basket-in-carrozzina/`
- e altre

## Build: ✅ 584 pagine, 0 errori

---

# Professional Sitemap Overhaul

## Data: 2026-03-26

## Problema
La sitemap aveva 3 problemi: (1) URL duplicati dalla sezione tassonomie separata, (2) mancanza di `<lastmod>` sulle pagine tassonomia/sezione, (3) nessun supporto `video:video` per le pagine con embed YouTube — causa degli errori di indicizzazione video in GSC.

## Soluzione
### File modificato: `layouts/sitemap.xml`
Riscrittura completa del template:
- **Loop unificato**: Rimossa la sezione tassonomie separata (righe 61-70 vecchie). Tutte le pagine sono gestite da un unico `range .Site.Pages` con filtro `ne .Kind "home"`.
- **Lastmod fallback**: Per pagine tassonomia/sezione senza `.Lastmod`, usa la data più recente tra le pagine figlie (`sort .Pages ".Lastmod" "desc"`).
- **Priorità per Kind**: Aggiunta distinzione tra `section` (0.55), `taxonomy`/`term` (0.50), oltre alle categorie di contenuto esistenti.
- **Video sitemap (`xmlns:video`)**: Aggiunto namespace `video` e blocchi `<video:video>` per pagine con embed YouTube. Usa `findRE` su `.Content` per rilevare automaticamente video individuali e playlist. Include: `thumbnail_loc`, `title`, `description`, `player_loc`, `publication_date`, `family_friendly`.

## Risultati
- **316 URL** (da 554 → 238 duplicati rimossi)
- **13 video** con metadati completi
- **Tutte le entry** hanno `<lastmod>` o fallback
- Build: ✅ 1710ms, 0 errori

---

# Add IELTS Certificate to Links Page

## Date: 2026-03-30
## Modifications
**File**: `data/links.yml`
- Added the IELTS Academic exam (score 7.5) to the "Certificates" section.
- Configured the link to point to `/docs/IELTS.pdf` which should be placed in the `static/docs/` directory.

---

# Professional Markdown Styling for Blog Posts

## Date: 2026-03-30
## Modifications
Implemented a premium, rich styling upgrade for all markdown-rendered elements in blog posts using pure CSS and Vanilla JS.
- **CSS (`assets/css/custom.css`)**: Added `.blog-prose` rule block. Includes:
  - Drop cap for the first paragraph.
  - Gradient headings with left borders.
  - Redesigned blockquotes with quote icons and subtle backgrounds.
  - Styled inline code pills and dark-themed code blocks.
  - Custom gradient bullets and numbered list markers.
  - Alternating colored tables and gradient horizontal rules.
- **Layout (`layouts/blog/single.html`)**: Added the `.blog-prose` class to the main `<article>` tag.
- **JS (`assets/js/main.js`)**:
  - Implemented an IntersectionObserver to apply scroll-reveal animations (`.blog-prose-reveal`) to headings, quotes, and images.
  - Added logic to generate a "Copy" button (`.copy-code-btn`) for all `<pre>` code blocks.

---

# Bug Fix: Invisible Future-Dated Blog Post

## Date: 2026-04-01
## Modifications
- **Fix**: Changed the date of the blog post "Confessions of a 20-Year-Old Tech NEET" from a future time (`2026-04-01T19:36:00+01:00`) to a past/current time (`2026-04-01T09:36:00+02:00`).
- **Tech Notes**: Hugo by default ignores markdown files with a `date` in the future during local builds unless run with the `--buildFuture` flag. Updating the frontmatter resolved the post invisibility issue.

---

# Git Sync - Remote Override
## Data: 2026-04-11
## Problema
Errore durante il push dovuto alla divergenza tra branch locale e remoto (16 commit mancanti in locale). L'utente desiderava mantenere la versione del repository remoto come "verità".

## Soluzione
1. Creato branch di backup `backup-before-reset` per preservare l'unico commit locale divergente (`update pubblication`).
2. Eseguito `git reset --hard origin/master` per allineare perfettamente il branch locale `master` con il remoto.

## Stato
✅ **Branch sincronizzato**: Il repository locale è ora identico a quello remoto.

---

# Timeline Update - Scientific Publication
## Data: 2026-04-11
## Modifiche
1. Aggiornata la card "Scientific Publication" in `data/timeline.yml` con i dettagli reali dell'articolo pubblicato su MDPI.
2. Aggiunti link all'articolo online, al PDF ufficiale e alla copia locale.
3. Risolto errore di permessi su `public/service-worker.js` eliminando la cartella `public` e riavviando il server.

## Stato
✅ **Timeline aggiornata**: La pubblicazione è ora visibile con descrizione estesa e link funzionanti.
✅ **Server ripristinato**: `npm run dev` funzionante.

- [2026-04-15 12:00]: Grammar Fix: Collegio Don Mazza Blog Post
  - *Details*: Performed a comprehensive grammar and punctuation check on the "Collegio Don Mazza" experience post (lines 20-105). Fixed spelling errors (e.g., "roommate," "weird," "accommodation"), capitalized proper nouns (Verona, Don Mazza, Val di Rabbi), and improved phrasing while maintaining the author's original voice and meaning.
  - *Tech Notes*: Modified `content/english/blog/experience/Collegio don mazza/index.md`. No architectural changes.


---

# Call System (Calendly-like)
## Date: 2026-04-30
## Features Implemented
- **Frontend**: Aggiunta la nuova pagina `/call` per prenotare incontri su Google Meet. Interfaccia utente premium con calendario navigabile integrato nel tema esistente.
- **Backend (Serverless)**: Poiché il sito è hostato staticamente su GitHub Pages, è stato predisposto un backend su **Google Apps Script** (da configurare manualmente, vedi `TO_SIMO_DO.md`). Il backend accetta richieste POST, crea l'evento su Google Calendar e invia una mail di conferma tramite GmailApp.
- **Data Configuration**: Creazione del file `data/booking.yaml` per gestire i giorni della settimana in cui si è disponibili, gli orari, le date bloccate e le informazioni del profilo, senza dover modificare il codice HTML.
## Tech Notes
- File creati: `content/english/call/_index.md`, `layouts/call/list.html`, `data/booking.yaml`, `.env.example`.
- Modifiche ai menu: Inserita voce "Call" nel file `menus.en.toml`.
- **Avatar Update**: Impostata l'immagine `avatar_calls.png` come avatar nella pagina di booking. Copiato il file da `assets/images/` a `static/images/` per garantirne la corretta visualizzazione.
- **Security**: Aggiunto `.env` al file `.gitignore` per prevenire il caricamento accidentale di credenziali sensibili su GitHub.

- [2026-05-26 14:00]: Linktree-style Connect Page
  - *Details*: Created a mobile-optimized, distraction-free Linktree-style page at `/connect` for sharing social links and contact info when meeting new people.
  - *Tech Notes*: 
    - Added new Hugo section `/connect` with `_index.md`.
    - Created custom `baseof.html` and `list.html` layouts inside `layouts/connect/` to remove standard site navigation/footer while inheriting Tailwind styling.
    - Implemented a "Save Contact" feature by generating and serving `static/simone-mattioli.vcf`.
    - Integrated with existing `data/social.json` to dynamically render social buttons using Glassmorphism UI.

- [2026-05-26 14:02]: Update Linktree Profile Image
  - *Details*: Changed profile image path to `/images/profile_connect.png` per user request.
  - *Tech Notes*: Manual image save required by user.

- [2026-05-26 14:07]: Added Linktree Categories
  - *Details*: Grouped links into 'Personal & Professional' and 'Mountain Fauna Lover' sections for a more organized view.
  - *Tech Notes*: Created `data/connect.yml` and updated `layouts/connect/list.html` loop.

- [2026-05-26 14:07]: Reorder Linktree Sections
  - *Details*: Split Personal and Professional into distinct sections and reordered them as Professional, Mountain Fauna Lover, and Personal per user request.

- [2026-06-08 23:00]: Globe Map New University Locations
  - *Details*: Added pins for future articles regarding TalTech in Tallinn, Estonia, KTH Royal Institute of Technology in Stockholm, Sweden, and ELTE University in Budapest. Also updated the Budapest trip pin to point to Gellért Thermal Bath.
  - *Tech Notes*: 
    - Created placeholder articles in `content/english/blog/experience/TalTech/index.md`, `content/english/blog/experience/KTH/index.md`, and `content/english/blog/experience/ELTE/index.md`.
    - Modified `content/english/blog/experience/Budapest Trip/index.md` to point specifically to Gellért Thermal Bath coordinates (47.4837, 19.0550).

- [2026-06-17 17:55]: Added Mountain Fauna Lover Website Link
  - *Details*: Added the website link for the Mountain Fauna Lover project to the linktree (/connect) page and the main links page.
  - *Tech Notes*:
    - Modified `data/connect.yml` to include the website link under the "Mountain Fauna Lover" section.
    - Modified `data/links.yml` to include the website link under the "Mountain Fauna Lover Content" section.

- [2026-06-30]: SEO/GEO Remediation — Batch 1 (structured data, article template, OG share image)
  - *Details*: Fixed the production structured-data layer, the article-template LCP/E-E-A-T issues, and the broken social-share images per `SEO_AUDIT/README.md` (covers SEO-01..08, 21, 22, 24, 25, 30). Implemented on branch `seo-fixes` (3 commits) and verified with local production builds (`hugo_extended 0.144.0 --gc --minify`): 426 JSON-LD blocks parse with 0 double-encoded, 350/350 pages' og:image resolve.
  - *Tech Notes*:
    - **Schema partials** (`layouts/partials/seo/schema-{website,person,blog,breadcrumb,video,faq}.html`): each rebuilt as a single `dict` piped through `jsonify | safeJS`. Root cause of the prior double-encoding (every value a quoted string / array-as-string) was Go `html/template` JS-context escaping inside `<script type="application/ld+json">`; `safeJS` (template.JS) emits the JSON verbatim. `safeHTML` does NOT work here.
    - **`head.html`**: `partialCached` → `partial` for website/person/blog/faq so the `IsHome`/`IsPage` guards evaluate per page — `BlogPosting` now renders on posts (cache key was `.Section`, which had cached the empty `/blog/` list render for all posts), and WebSite/Person/FAQ no longer leak onto every page.
    - Person entity consolidated via `@id` (`#person`), referenced by `BlogPosting` author/publisher. Homepage FAQ translated to English.
    - **`layouts/blog/single.html`**: hero image now passes `Context` + `Priority` to the image partial (was `"Loading" "eager"`, an unsupported key, with no `Context` → the hero rendered unprocessed + `loading="lazy"`). Linked author byline now always renders (defaults to the site author). `<time datetime>` now emits ISO 8601.
    - **`layouts/partials/basic-seo.html`**: real 1200×630 branded OG card at `static/images/og-image.png` (replaces the Hugoplate demo image that 404'd from `assets/`). OG image resolution made robust: page-bundle resource → global asset via `resources.Get` → absolute path/URL → graceful fallback to the site card. Added `og:locale=en_US`.
    - **Local-build tooling**: `hugo_extended 0.144.0` (modules vendored in `_vendor/`; Tailwind v4 CLI already in `node_modules`). OG card generated with Playwright (`scratchpad/make_og.py`).
  - *Current Status*: Batch 1 done on `seo-fixes`, not yet merged/deployed. **Immediate next step**: review/merge `seo-fixes` → `master` to deploy. Remaining audit tasks (not in this batch): SEO-09/10 (perf/image compression), SEO-11/12/23 (thin content + tag bloat + sitemap noindex), SEO-13/15/16/17/18/26/27/28/29/31.

- [2026-06-30 13:51]: Hugo Deprecation Warnings Fixes
  - *Details*: Fixed a series of Hugo deprecation warnings that were being printed in the terminal during development.
  - *Tech Notes*:
    - Replaced `keepConditionalComments` with `keepSpecialComments` in `hugo.toml`.
    - Replaced `languageName` with `label` and `languageCode` with `locale` in `config/_default/languages.toml`.
    - Replaced `site.LanguageCode` with `site.Language.Locale` globally in baseof layouts and overridden the pwa index.webmanifest.
    - Replaced `site.Data` and `.Site.Data` with `hugo.Data` globally across multiple layout and component files.

- [2026-06-30]: SEO/GEO Remediation — Batch 2 (index hygiene) + CI Hugo bump
  - *Details*: Cut index bloat and removed demo content per `SEO_AUDIT/README.md` (SEO-11/12/13/23); bumped the deploy Hugo version so CI builds after the 0.163 deprecation migration.
  - *Tech Notes*:
    - New `layouts/partials/seo/noindex.html` — single source of truth for "should this page be noindexed?", consumed by both `basic-seo.html` (robots meta) and `sitemap.xml` so they never diverge.
    - Auto-`noindex` blog posts under 130 words (self-maintaining) and single-post tag pages (redundant with the post); categories/passions and multi-post tags stay indexed.
    - Deleted the Hugoplate demo `content/english/Author/` section (john-doe); authorship lives on `/about`.
    - CI: bumped `.github/workflows/hugo.yml` `HUGO_VERSION` 0.144.0 → 0.163.3 (the deprecation migration's `site.Language.Locale` needs newer Hugo; 0.144 built 0 pages).
    - Verified on hugo 0.163.3: sitemap 343 → 120 URLs; 11 thin posts + 207 single-post tag pages `noindex`ed; `/author/` removed; 0 noindexed URLs in the sitemap.

- [2026-06-30]: SEO/GEO Remediation — Batch 3 (quick wins)
  - *Details*: Six smaller SEO/GEO improvements (SEO-15/17/26/27/29/31).
  - *Tech Notes*:
    - SEO-15: real `/search/` page (theme `search-page.html` partial, `noindex`) + WebSite `SearchAction` pointed at `/search/?s={query}` to match `search.js` (reads the `s` URL param) — the sitelinks searchbox now resolves and runs end-to-end.
    - SEO-17: `static/llms.txt` (curated site map for AI crawlers).
    - SEO-26: "Related Posts" (3, via `.Related` on tags/categories) on blog single pages + a `[related]` block in `hugo.toml`.
    - SEO-27: RSS discovery `<link rel="alternate" type="application/rss+xml">` in `<head>`.
    - SEO-29: `logo_text` Hugoplate → Simone Mattioli (fixes the sitewide logo `alt`); removed `<meta name="theme-name">`; cleared the demo announcement placeholder.
    - SEO-31: manifest polish — `display: standalone`, added `description`, dropped the unpadded `maskable` purpose.
  - *Current Status*: Batches 1–3 + the CI fix are merged to `master` (fast-forward, 9 commits) and verified on hugo 0.163.3; **awaiting `git push` to deploy**. Remaining audit work: SEO-09/10 (performance), SEO-16/18 (fonts / 3rd-party deferral), SEO-20/25/28 (dead-config cleanup, ProfilePage, richer schema types).

---

- [2026-06-30 16:56:54 CEST]: SEO-14 (meta descriptions) + SEO-25 (ProfilePage on /about)
- *Details*: Batch on branch `seo-meta-profilepage`. (1) SEO-14 — replaced the live placeholder `description: "this is meta description"` on `/about` with a real 155-char description, and trimmed the homepage `[metadata].description` 297 → 148 chars (front-loaded "Simone Mattioli"). Both reflect the corrected bio: CS graduate (University of Verona), current EIT Digital Master's student (year 1 ELTE → year 2 KTH), AI/LLMs/HPC, Brazil volunteering, mountains. (2) SEO-25 — added a `ProfilePage` JSON-LD block on `/about` whose `mainEntity` references the canonical Person (`#person`) by `@id` for entity consolidation (the full Person stays on the homepage and is already referenced by `schema-blog.html` author/publisher).
- *Tech Notes*: New partial `layouts/partials/seo/schema-profilepage.html`, gated `if eq .Type "about"`, wired into `layouts/partials/essentials/head.html` after `schema-person`. Uses `hugo.Data.about.*` (not `site.Data`) and `jsonify | safeJS` (safeHTML double-encodes). `dateModified` guarded with `if not .Lastmod.IsZero` because `/about` has no `date`/`lastmod` front matter (otherwise it emitted `0001-01-01`). Verified: `hugo --gc --minify` clean on 0.163.3; all 428 JSON-LD blocks parse via `json.loads` with no double-encoding; ProfilePage present ONLY in `public/about/index.html`; rendered `<meta name=description>` = 148 (/) and 155 (/about). Commits: `f5db54c5` (SEO-14), `85cb0df1` (SEO-25).
- *Current Status*: SEO-14 + SEO-25 done on `seo-meta-profilepage`, build-verified, **NOT yet merged/pushed** (user pushes). Follow-up in TO_SIMO_DO.md: `data/about.yml` education + `schema-person.html` jobTitle are now stale vs the corrected bio. Remaining audit: SEO-19 (polish), SEO-20 (dead configs), SEO-28 (richer schema) + `assets/css/custom.css.backup` cleanup + "GDG AI Hackathon" thin post.

---

- [2026-06-30 17:05 CEST]: About page — add master's to Education box
- *Details*: Added "AUSIR EIT Digital Master School" (place "ELTE and KTH") as the top entry of the `/about` Education box, above the Bachelor's, per request. Removed the now-incorrect `active: true` from the graduated Bachelor's. This addresses the `data/about.yml` part of the bio-consistency follow-up flagged for SEO-14/25.
- *Tech Notes*: Edited `data/about.yml` `education` list only — `layouts/about/list.html` renders `.title`+`.place` per entry; `icon`/`active` are unused/cosmetic. Verified `hugo --gc --minify` clean; rendered Education box order = AUSIR (ELTE and KTH) → Bachelor's (Verona) → Diploma (Marconi). Commit `1cf0363d`, branch `seo-meta-profilepage`.

---

- [2026-06-30 17:21:07 CEST]: SEO-19 — polish (hero name order + viewport a11y)
- *Details*: Fixed the hero rendering "Mattioli Simone" reversed — the H1 subtitle in `layouts/index.html` fell back to a hardcoded reversed default (the homepage banner sets no `subtitle`); changed the default to "Simone Mattioli" to match `<title>`, OG, and the Person schema. Dropped `maximum-scale=5` from the viewport meta in `essentials/head.html` so users can fully pinch-zoom (accessibility). The audit's third SEO-19 item — an "empty `<h2>`" — was verified a FALSE POSITIVE: it is `#modalTitle` in `partials/components/timeline.html`, a JS-populated dialog title inside a `hidden` (display:none) modal, not a content heading; left unchanged.
- *Tech Notes*: Edited `layouts/index.html` (hero subtitle default) and `layouts/partials/essentials/head.html` (viewport). Verified `hugo --gc --minify` clean; rendered `/` shows `Simone Mattioli` and `viewport content="width=device-width,initial-scale=1"`. The single remaining "Mattioli Simone" on the homepage is the Person schema `alternateName` (intentional). Committed on `master`.

---

- [2026-06-30 17:22:09 CEST]: SEO-20 — remove dead deploy-config files
- *Details*: Deleted deploy configs that GitHub Pages ignores and that pinned a stale Hugo (0.147.3) while the real CI (`.github/workflows/hugo.yml`) uses 0.163.3: `netlify.toml`, `vercel.json`, `vercel-build.sh`, `amplify.yml`, `.gitlab-ci.yml`, root `_redirects`, and `static/_headers`. Confirmed via `git grep` that nothing tracked references them. The intended security headers/CSP from `static/_headers` (inactive on GitHub Pages) were preserved in `TO_SIMO_DO.md` with the Cloudflare/meta-CSP activation paths.
- *Tech Notes*: `package.json` build scripts and the GH Actions workflow are untouched. Build artifact `public/_headers` is no longer generated. Verified `hugo --gc --minify` clean. Committed on `master`.

---

- [2026-06-30 17:24:34 CEST]: SEO-28 — richer schema types per content type
- *Details*: Rewrote `layouts/partials/seo/schema-blog.html` to choose @type from the blog subsection (2nd permalink segment): `tech-project` -> SoftwareApplication (18 posts), `publication` -> ScholarlyArticle (1); everything else (experience/thought/project/books, 45) stays BlogPosting. Per-post override via front-matter `schema_type`. Type-correct props: SoftwareApplication gets `name` + `applicationCategory` (default "DeveloperApplication", override via `app_category`; optional `operating_system`); article types get `headline` + `wordCount` + `articleSection`. Common props (author/publisher @id `#person`, dates, url, image, keywords, inLanguage) are shared. `books` -> Review was deferred (needs per-book ratings).
- *Tech Notes*: subsection = `index (split (strings.Trim .RelPermalink "/") "/") 1`. Still `jsonify | safeJS`, gated to mainSections blog pages (no sitewide leak). Verified `hugo --gc --minify` clean; @type tally BlogPosting 45 / SoftwareApplication 18 / ScholarlyArticle 1; SoftwareApplication carries name+applicationCategory and NOT headline/wordCount; ScholarlyArticle carries headline+wordCount; all 428 JSON-LD blocks valid & not double-encoded; homepage and /blog/ carry no article type. Committed on master.

---

- [2026-06-30 17:35:15 CEST]: Globe — Safari trackpad pinch-to-zoom parity
- *Details*: The globe page (`layouts/globe/list.html`) zoomed fine on Chrome/Firefox but not on Safari with the MacBook trackpad pinch. Root cause: globe.gl's camera zoom (three.js OrbitControls) only zooms on `wheel` events. Chrome/Firefox translate a trackpad pinch into a synthetic `ctrlKey` wheel event (which OrbitControls zooms on), but Safari is the lone holdout that emits the legacy WebKit `gesturestart`/`gesturechange`/`gestureend` events instead. The page was `preventDefault()`-ing those gesture events (needed, to stop Safari zooming the whole page) but never forwarding them to the globe — so in Safari a pinch was intercepted, neutralized, and dropped, and nothing zoomed. (Orthogonal to the SEO-19 viewport `maximum-scale` change: that was page-level pinch-zoom; this is the globe's 3D camera zoom.) Fix: normalize Safari by translating its pinch into the *same* synthetic `ctrlKey` wheel event Chrome/Firefox already emit, so zoom routes through one identical code path across all browsers (and matches two-finger scroll). Chosen over a separate globe.gl `pointOfView()` re-implementation specifically to avoid a second zoom path that could drift / feel different.
- *Tech Notes*: In the `.then()` init block, replaced the three no-op gesture handlers with: a `PINCH_ZOOM_SENSITIVITY` constant (= 2400; the single tuning knob) + a `lastGestureScale` tracker; `gesturestart` → `preventDefault()`, reset `lastGestureScale = event.scale`, `pauseAutoRotate()`; `gesturechange` → `preventDefault()`, compute per-event `scale` delta and `canvas.dispatchEvent(new WheelEvent('wheel', { deltaY: -scaleDelta * SENS, clientX, clientY, ctrlKey: true, bubbles: true, cancelable: true }))` on `globeContainer.querySelector('canvas')` (spreading fingers ⇒ negative deltaY ⇒ dolly in); `gestureend` → `preventDefault()`. Inherits the existing OrbitControls tuning for free (zoomSpeed 0.55, minDistance 145 / maxDistance 520, damping). No new dependencies — `gesture*` and `WheelEvent` are native; the new path is Safari-only (gesture events are WebKit-only) so Chrome/Firefox/scroll are untouched. Verified `hugo --gc --minify` clean (627 pages, exit 0) and the minified handler is present in `public/globe/index.html`. NOT committed — awaiting a manual Safari trackpad test (see `TO_SIMO_DO.md`) to confirm feel and tune `PINCH_ZOOM_SENSITIVITY` if needed.

---

- [2026-06-30 17:50:45 CEST]: Globe — Safari pinch zoom feel fix (too fast + jerky)
- *Details*: First Safari test showed the pinch zoom worked but was "really fast" and not fluid. Read the actual bundled `globe.gl@2.46.1` control code to find the cause instead of guessing again. Two findings: (1) zoom scales with the wheel's `deltaY` *magnitude* — `_getZoomScale(e) = Math.pow(0.95, zoomSpeed * |0.01*e|)` — so the sensitivity constant is the correct lever; (2) **the controls internally multiply ctrlKey ("pinch") wheel events by 10**: `return e.ctrlKey && !this._controlActive && (n.deltaY *= 10), n`. So the old `PINCH_ZOOM_SENSITIVITY = 2400` was effectively ~24000 → each pinch step was a ~13% dolly jump that raced to the min/max distance clamp = fast AND coarse/jerky. Chrome felt fine only because its *native* pinch `deltaY` is already small. Fix: dropped the default to 150 (~16× smaller → ~1% steps = smooth, Chrome-like) and made it live-tunable via `window.globePinchSensitivity` so the exact feel can be matched from the Safari console with no rebuild.
- *Tech Notes*: `layouts/globe/list.html` — `PINCH_ZOOM_SENSITIVITY` 2400 → 150; on init, seed `window.globePinchSensitivity` if unset; `gesturechange` now reads `const sensitivity = Number(window.globePinchSensitivity) || PINCH_ZOOM_SENSITIVITY` (coerced, so a bad/zero console value safely falls back) and dispatches the synthetic wheel with that. No structural change to the event path (still one ctrlKey wheel per gesturechange = identical to Chrome); no easing added, since the magnitude fix alone restores smoothness. `controls.zoomSpeed` (0.55) deliberately left untouched so Chrome/Firefox and two-finger scroll are unaffected. Verified `hugo --gc --minify` clean (exit 0); `public/globe/index.html` carries `=150`, the `globePinchSensitivity` seed + coerced read, and no remaining `2400`. Still NOT committed — pending your Safari re-test to lock the final sensitivity.

---

- [2026-07-01 11:46:00 CEST]: Added App Store profile link to Connect page
  - *Details*: Added a new entry for the Apple App Store profile link to the "Professional" section of the `/connect` Linktree page.
  - *Tech Notes*: Updated `data/connect.yml` by inserting the link (`https://apps.apple.com/us/developer/simone-mattioli/id1896746638`) and using the icon `fab fa-app-store-ios`.

---

- [2026-07-13]: UI v2 redesign — Design system + Phase 0 (branch `new-UI`)
  - *Details*: Started a full visual redesign toward a "Swiss / editorial tech" language (monochrome + hairline grids + grotesk↔mono contrast + a single copper accent), dark-first with a first-class light mode. Approach is **restyle-in-place**: only design tokens, CSS, fonts and presentational markup change — all SEO/schema/sitemap partials are untouched. Full spec lives in `DESIGN_SYSTEM.md`. Phase 0 delivered: new global tokens, self-hosted Geist fonts, redesigned global shell (header + footer), and the homepage (hero, meta strip, journey, explore cards). Remaining phases: P1 blog, P2 about/passions/links, P3 globe/call/connect/search/404.
  - *Tech Notes*:
    - `data/theme.json`: recolored to dark-first refined palette (canvas `#0a0a0a`/light `#fafaf8`), added an `accent` color key (copper `#d9823f` dark / `#a85a2a` light) and a `mono` font key. The `tailwind-plugin/tw-theme.js` plugin auto-generates `--color-accent`, `text-accent`, `border-accent`, `font-mono`, etc. from these keys — no plugin change needed.
    - Fonts: **Geist Sans** (400/500/600/700) + **Geist Mono** (400/500), self-hosted in `static/fonts/` (sourced via `@fontsource/geist-sans` / `@fontsource/geist-mono`, copied as woff2, no runtime npm dependency). `assets/css/fonts.css` and the critical inline `@font-face`/preloads in `layouts/partials/essentials/style.html` updated from Heebo/Signika → Geist.
    - New `assets/css/ds.css` holds the entire v2 layer (base, header, buttons, hero + hairline-grid signature, meta strip, cards, footer, mobile sheet, motion). New local `assets/css/main.css` overrides the theme's to `@import "ds.css"` last (project assets override theme assets in Hugo).
    - `layouts/index.html`, `layouts/partials/essentials/header.html` and `footer.html` rewritten to the new system. `config/_default/params.toml`: `theme_default` → `dark`.
    - ⌘K: reused the theme's existing full-text search modal (already bound to Cmd/Ctrl-K in `_vendor/.../search.js`) instead of a custom palette, to avoid a double-open collision. The "Search… ⌘K" pill opens it via `data-target="search-modal"`.
    - Motion: removed the old animated blobs + infinite gradient (also LCP-positive); added a one-time hero hairline-grid draw-in + short section reveals, all gated behind `prefers-reduced-motion`.
    - Verified: `hugo` build clean (627 pages); homepage hero/meta/journey/cards + header + footer + mobile nav sheet confirmed in dark + light + responsive. GitHub Pages deploy only fires on push to `master`, so `new-UI` is safe to preview.

- [2026-07-13]: UI v2 — Phases P1–P3 complete (branch `new-UI`)
  - *Details*: Rolled the design system across every remaining page type. The redesign now covers the whole site.
  - *Tech Notes*:
    - **P1 Blog**: rewrote `layouts/partials/components/blog-card.html` (hairline card, framed natural-color image, mono meta, copper category), `layouts/blog/list.html` (mono eyebrow header + monospace category chip-row + full-width `.ds-post-grid`), `layouts/blog/single.html` (back-link, mono category eyebrow, Geist title, byline, framed hero image, centered ~720px `.ds-read` prose column, related-posts grid), `layouts/categories/list.html` (both the terms index as hairline cards and per-category post grids). Added `.blog-prose` overrides to align typography (Geist body, copper drop-cap + heading tick-marks — overriding the theme's blue/purple gradient which used `-webkit-text-fill-color:transparent`, copper links, mono code, clean blockquote).
    - **P2**: `layouts/about/list.html` (hairline bento: framed portrait with overlaid socials, copper-iconed Life/Vision/Goal cards, education with copper active-marker, 4-cell meta strip incl. writings count, mono passion chips, monochrome CTA cards), `layouts/passion/list.html` (mono-indexed hairline cards), `layouts/links/list.html` (mono section eyebrows + hairline link cards with copper icons + external-link affordance).
    - **P3**: `layouts/connect/list.html` (rebuilt link-in-bio: framed avatar, mono section dividers, hairline link rows; added a dark-first theme-init to `connect/baseof.html` since that page has its own baseof with no toggle), `layouts/call/list.html` (added a ds header; retinted the whole blue family → copper via arbitrary Tailwind values `text-[#d9823f]` etc., flattened radius), `layouts/globe/list.html` (fixed the fixed-viewport top offset 80px→65px for the new 64px header, aligned `.globe-eyebrow` to mono+copper; left the immersive globe canvas otherwise intact by design), `layouts/_default/search.html` (ds header), new `layouts/404.html` (mono "404" + hairline-grid signature).
    - Note: the ⌘K search bundle is served via `partialCached` — after editing `ds.css` the running `hugo server` can serve a **stale** CSS bundle to pages using their own baseof (connect); a dev-server restart fixes it. Production build is unaffected (verified).
    - Verified: production build (`hugo --gc --minify`) clean; the fingerprinted main CSS contains every `ds-*` class and the copper arbitrary values (call page). All page types confirmed visually in dark; light + responsive spot-checked.
    - **Current Status**: FULL redesign complete on `new-UI` (P0–P3), not committed, awaiting Simone's review. *Immediate next step*: on approval, commit `new-UI`; merge to `master` only when the whole thing is signed off (that triggers the live deploy).

- [2026-07-13]: UI v2 — Search modal + /search page restyle (branch `new-UI`)
  - *Details*: The theme's stock search modal clashed with the new UI. Rebuilt it (and the /search page results, which share the same classes) to the design system: hairline panel, borderless mono input with bottom-divider, mono "no results"/empty states, mono group eyebrows, hairline result cards with framed thumbnails, Geist titles, copper-tinted highlights, and a mono kbd footer — dark + light + mobile.
  - *Tech Notes*:
    - Deleted the obsolete ~300-line "Spotlight-Style Search Modal" block from `assets/css/custom.css` (targeted the wrong markup — `ul>li a`, `input[type=search]` — hid the overlay via `display:none !important`, and `!important`-fought the new rules). custom.css 1521→1218 lines.
    - Added a full "SEARCH" override section to `assets/css/ds.css` (the vendored `_vendor/.../search` module is regenerated by `hugo mod`, so it's overridden via CSS, not edited; ds.css is imported last so equal-or-higher-specificity selectors win).
    - Ran a 4-lens adversarial review workflow (cascade / coverage / coherence / a11y) → 3 high, 9 medium, 12 low defects, all fixed: /search input had no frame (broken field); the keyboard focus ring was suppressed (WCAG 2.4.7) — restored; the hover/selected fill was invisible on 3 of 4 surfaces (token == surface) → switched to a copper-tint that reads on any surface; the title match `<u>` (search.js:233) rendered muted-grey on hover → forced copper; the no-results SVG slash hardcodes `stroke="black"` → `stroke: currentColor`; plus /search grid padding/margin/info/thumbnail, dark `<mark>` hue, mobile thumbnail shrink.
    - Verified in-browser (dark + light): modal empty / no-results / results / selected / mark / taxonomies / footer, and the /search page framed input + grid + result count. Production build clean; all `search-*` rules present in the fingerprinted CSS; old spotlight block gone.
    - **Current Status**: search restyle complete on `new-UI`, uncommitted (on top of commit c2555c43). Whole redesign still awaiting review before merge to master.

- [2026-07-13]: UI v2 — Globe stat box restyle (branch `new-UI`)
  - *Details*: The "9 COUNTRIES · 2 CONTINENTS · 18 STORIES" pill over the globe was still the old glassy blue-grey "spotlight" panel. Restyled it (inline `<style>` in `layouts/globe/list.html`: `.globe-stats`, its `strong`/`span`, and the `.globe-stat + .globe-stat::before` divider) to echo the homepage meta strip: near-black translucent surface (`color-mix(#0a0a0a 74%)`), 1px hairline border, 4px radius, subtle blur/shadow; numbers in Geist (`--font-secondary`, 600, #fafafa); labels in Geist Mono uppercase with letter-spacing, muted; hairline dividers. Since the box always floats over the black globe viewport, values are fixed dark-context (no light-mode variant needed). Verified in-browser; build clean.

- [2026-07-13]: UI v2 — Timeline card modal restyle (branch `new-UI`)
  - *Details*: The detail popup that opens when a homepage "My Journey" timeline card is clicked was still the old rounded/gray/blue modal. Restyled it coherently: hairline near-black/paper panel (4px radius), `.ds-iconbtn` close, copper icon in a hairline square, copper mono date eyebrow, Geist title, mono muted organization, mono section eyebrows (copper trophy/link icons), hairline achievement rows with copper checks, ghost link buttons, and hairline mono tag chips — left-aligned editorial, dark + light.
  - *Tech Notes*:
    - Markup: rewrote the `#timelineModal` block in `layouts/partials/components/timeline.html` with `ds-tlmodal-*` classes (IDs preserved for the JS contract; kept the JS-toggled `hidden`/`opacity-0`/`flex`/`scale-95` utilities and the `.timeline-modal-content` class).
    - JS: `assets/js/main.js` injects the tags/achievements/links/icon — swapped its hardcoded class strings (`rounded-full bg-gray-100`, `border-2 border-blue-500`, green check-circle, etc.) for `ds-tl-tag` / `ds-tl-achv` / `ds-tl-link` / `ds-tlmodal-icon`.
    - Styles: new "Timeline detail modal" section in `assets/css/ds.css` (`.ds-tlmodal-*`, `.ds-tl-tag/achv/link`).
    - Verified in-browser (dark + light) with a card that has achievements + links + tags; production build clean; all `ds-tl*` classes present in the fingerprinted CSS and the minified JS emits the new classes (old gray/blue classes gone).

- [2026-07-13]: UI v2 — Fuller header nav restored (branch `new-UI`)
  - *Details*: The condensed 4-item header felt empty vs the previous site. Restored the full navigation in the new style: Home · About · Blog▾ · Passions · Globe · Links · Tech▾ · Call, with hairline dropdowns for Blog (Books/Projects/Thoughts/Experiences) and Tech (Publications/Projects).
  - *Tech Notes*:
    - `layouts/partials/essentials/header.html`: desktop nav now renders `site.Menus.main` (data-driven) with a `.ds-navdrop` dropdown for items that `.HasChildren`; active-state via prefix match (Home via `.IsHome`).
    - `config/_default/menus.en.toml`: cleaned weights for deterministic order, fixed child-label typos (Thougths→Thoughts, Expriences→Experiences, "Books Readed"→Books, trailing-space Projects), and added explicit `identifier`s to the two "Projects" children (Blog vs Tech) — Hugo was deduping them by name, dropping Blog's "Projects".
    - `assets/css/ds.css`: added `.ds-navdrop*` dropdown styles (hairline panel, hover/focus-within reveal, invisible hover-bridge); tightened `.ds-nav`/`.ds-nav-link` spacing to fit 8 items; the ⌘K "Search…" pill now shows only ≥1280px and collapses to a search icon (`.ds-search-icon`) below that so the nav fits at 1024–1280.
    - Verified: fits with no overflow at 1280 (pill) and 1024 (icon); Blog/Tech dropdowns open on hover + keyboard focus; mobile sheet lists all 8 in order; production build clean; dropdown CSS + all children present in the fingerprinted bundle.

- [2026-07-13]: UI v2 — Unified header actions (branch `new-UI`)
  - *Details*: The three controls in the header's right cluster had mismatched heights/shapes (search pill 36px, theme toggle ~16px rounded switch, Résumé ~48px). Unified them to one clean 36px height with consistent spacing.
  - *Tech Notes*:
    - Replaced the theme switcher: new local override `layouts/partials/components/theme-switcher.html` renders a `.ds-iconbtn` (36×36) sun/moon icon button (instead of the theme's rounded toggle-track), preserving the init + click-to-toggle JS (`[data-theme-switcher]`, localStorage).
    - `assets/css/ds.css`: `.ds-header-actions .ds-btn { height: 2.25rem; padding: 0 0.9rem; font-size: 0.85rem }` shrinks the Résumé button to match the ⌘K pill; `.ds-theme-sun/.ds-theme-moon` visibility toggles by `.dark`. Note: FontAwesome ships in the *lazy* CSS bundle (loads after ds.css), so `.fa-solid{display:inline-block}` out-ordered the plain `.ds-theme-moon{display:none}` — fixed by scoping the rules under `.ds-theme-toggle` to raise specificity above `.fa-solid`.
    - Verified: search pill / theme toggle / Résumé all render at exactly 36px, top-aligned, 8px gap; toggle flips sun↔moon and persists; production build clean.

- [2026-07-13]: UI v2 — Minimal footer (branch `new-UI`)
  - *Details*: Simplified the site footer on every page to just a horizontally-centered "© <year> Simone Mattioli" (mono, with the existing top hairline). Removed the colophon eyebrow, vision quote, social-icon row, "Verona → Stockholm", and "Hugo · Geist · hosted on GitHub Pages".
  - *Tech Notes*: `layouts/partials/essentials/footer.html` reduced to a single centered `.ds-mono` line. Also included the footer partial in `layouts/connect/baseof.html` (which has its own bare baseof) so the link-in-bio page shows it too; its `<main>` min-height changed from `min-h-screen` to `calc(100vh - 7rem)` so the footer fits in view. Verified: exactly one `© 2026 Simone Mattioli` per page across home/about/blog/globe/call/connect; old footer content gone; production build clean.

- [2026-07-13]: UI v2 — Header nav order (branch `new-UI`)
  - *Details*: Reordered the top nav to Home · About · Links · Passions · Blog · Globe · Call · Tech (per request) by adjusting the `weight`s in `config/_default/menus.en.toml` (Links→3, Passions→4, Blog→5, Globe→6, Call→7, Tech→8). Dropdown children unaffected. Verified rendered order + build clean.

- [2026-07-13]: Blog information architecture — sections-as-truth restructure (branch `new-UI`)
  - *Details*: The blog had TWO parallel grouping systems for the same 66 posts: physical folders (which set the URL but had no `_index.md`, so every `/blog/<folder>/` landing 404'd) and a `categories` taxonomy (which powered nav + the `/blog` filter chips, under different plural names). Navigation compounded it: the blog was split across a "Blog" dropdown AND a separate top-level "Tech", with "Projects" appearing twice pointing at two different pages. Grilled the requirements and rebuilt the IA around Hugo **sections** as the single source of truth. Also surfaced + fixed latent copy-paste slug collisions that were silently overwriting posts on every build.
  - *Tech Notes*:
    - **Sections (5):** renamed folders to plural slugs and added a landing `_index.md` (with hero description) to each — `experiences`, `tech-projects`, `thoughts`, `books`, `publications`. The old `project/` section (3 posts) was dissolved: `CLAB Univr` + `mountainfaunalover` → `experiences/`; `simo's Diary` → `thoughts/` set `draft: true` (unfinished "da completare" stub).
    - **Taxonomy retired:** removed `category = "categories"` from `[taxonomies]` in `hugo.toml` and dropped the `categories` index from `[related]` (now tags + date). Deleted the redundant `categories:` field from all 66 posts (it was the source of every spelling inconsistency: `Experiences` vs `"Experiences"`, `tech projects` vs `tech-projects`, singular folders vs plural terms). Deleted dead `layouts/categories/list.html`.
    - **Label source:** cards (`components/blog-card.html`) and the post header (`blog/single.html`) now derive the group label from `.CurrentSection` (linked to the section page) instead of `categories[0]`.
    - **Hub + section template:** rewrote `layouts/blog/list.html` to serve BOTH the hub (`/blog/` → `.RegularPagesRecursive`, all posts) and each section (`/blog/<section>/` → `.RegularPages`). Chip row is built from `site.GetPage "/blog"`'s sub-sections in an explicit order and links to the real section pages. (Needed because once sub-folders became real sections, `/blog`'s `.RegularPages` no longer returns nested posts.)
    - **Redirects (github.io has no server redirects → Hugo `aliases` stubs):** injected `aliases` into 55 posts preserving `/blog/<old-singular>/<slug>/`; added `/categories/<x>/` → `/blog/<x>/` aliases on each section `_index.md`; `/categories/` + `/categories/projects/` → `/blog/` on the blog `_index.md`. Build reports the stubs generated; verified live (HTTP 200 + meta-refresh target) for category, post, and folded-project URLs.
    - **Slug-collision fixes (pre-existing bugs):** `GDG AI Hackathon` had `slug: budapest-collegio-don-mazza` (collided with `Budapest Trip`) → `gdg-ai-hackathon`; `Impostor syndrome` had `slug: trap` (collided with `social traps`) → `impostor-syndrome`; `social traps` `trap` → `social-traps`; `CLAB Univr` nonsense `slug: think` → `clab-univr` (kept `/blog/project/think/` alias). Both collisions meant one post was silently overwritten in every build; `hugo list all` now reports zero duplicate permalinks.
    - **Downstream template fixes** (all `.Params.categories` readers repointed to sections): `layouts/sitemap.xml` priorities now keyed off `.CurrentSection.Title`/`.Section`; `partials/globe-point.html` label from `.CurrentSection`; `partials/basic-seo.html` + `seo/schema-blog.html` `article:section`/`articleSection` from `.CurrentSection`; `about/list.html` "Go deeper" CTAs now link `/blog/<section>/` directly.
    - **Nav:** rewrote `config/_default/menus.en.toml` to a single unified "Blog" dropdown (Experiences · Tech Projects · Thoughts · Books · Publications); removed the separate top-level "Tech" and both duplicate "Projects" entries.
    - **Cleanup:** moved 3 orphan `it.md` files (Italian, but Italian is disabled and they were mis-named — should be `index.it.md`) to `unused_content/blog-it-translations/` (preserved, not deleted).
    - **Verification:** clean `hugo --gc` build (no warnings, 0 duplicate permalinks); ran `hugo server` and confirmed via HTTP — `/blog/` 200 (65 published posts), all 5 section pages 200 (were 404), collision-fixed posts 200, and category/post/folded-project old URLs all redirect to the new locations.

---
STATUS: blog restructure COMPLETED & VERIFIED on branch `new-UI` (not committed).
NEXT: review locally, then a few content TODOs logged in TO_SIMO_DO.md.

- [2026-07-13]: Call page — fit the whole booking flow in one viewport (branch `new-UI`)
  - *Details*: The `/call/` page required scrolling — the tall `.ds-hero`, the container's `py-16`, the footer's `5rem`+`py-8` gap, and the card padding pushed total height past the viewport (and the step-3 details form was the tallest step). Compacted everything so all three steps (calendar / time slots / details form) render with **zero page scroll**, footer included.
  - *Tech Notes*: `layouts/call/list.html` — wrapped content in `.call-page`; scoped `<style>` shrinks the hero (`padding-top: clamp(0.75rem,3vh,1.75rem)`, smaller title/lead), the container (`.call-wrap` small py), and — via `body:has(.call-page)` — removes the footer's `margin-top:5rem` and trims its `py-8` → `~0.85rem`. Card padding `p-8/p-10`→`p-6/md:p-8`; profile block tightened (avatar `w-16`, smaller margins); calendar `gap-2`→`gap-1`, day cells `w-10 h-10`→`w-9 h-9`; details form `space-y-4`→`space-y-3`, datetime box `p-4 mb-6`→`p-3 mb-4`, textarea `rows=3`→`2`, submit `py-3`→`py-2.5`, back-btn `mb-4`→`mb-2`. Verified live via `hugo server` + browser at 1280×800: `document.scrollHeight − innerHeight === 0` on all three steps (calendar, times, form); production build clean.

---

- [2026-07-13 21:00]: Production-readiness audit + fixes (branch `new-UI`)
  - *Details*: Full shippability pass (UI + logic). Wrote a Python internal-link crawler over the clean `public/` build (parses every `<a href>`/`<img src>`/`srcset`/`<link>` across all 413 HTML pages) — it surfaced 26 broken internal targets; after fixes, **0 real broken links remain** (the only 2 flagged are `/CampFlow/` and `/mattioli.OS/`, which are legit external GitHub-Pages project sites — verified live HTTP 200 — mis-classified as internal by the crawler because they share the apex domain). Fixes:
    - **4 stub posts referenced non-existent cover images** (`home.webp`/`cover.webp` were never committed) → broke `<img>` on the posts + every list/tag/related/pagination card that showed them. Removed the dangling `image:` front matter from `tech-projects/{Evolve,Ping Pong Counter,Warranties Vault}` and `experiences/GDG AI Hackathon`; cards now render clean text-only (blog-card wraps media in `{{ if $image }}`). Also fixed `GDG AI Hackathon` `description: "aaa"` → real description (closes TO_SIMO_DO note #4).
    - **Stale singular-section links** (folders were renamed `experience→experiences`, `project→tech-projects/experiences`, `thought→thoughts`): homepage `content/english/_index.md` (5 feature links + Mattioli.pdf), `data/about.yml`, `data/timeline.yml`, `21th Birthday` card link — all repointed to canonical section URLs. (Alias stubs still redirect the old URLs; these were canonicalised to avoid the extra redirect hop.)
    - **Broken download links:** Brazil `attendance.pdf` pointed to `/docs/attendance.pdf` (not in `static/`) → repointed to the page-bundle resource path (`data/timeline.yml` too). `data/{about,timeline}.yml` linked `/blog/project/simos-diary/` (a `draft:true` page that never builds) → about → YouTube channel, timeline → dropped the dead "Article" link (kept YouTube). CLAB advertised `materiali-di-study.zip` that was never created → **generated the 15 MB zip** from the bundle's `materiali di studio/` (23 files) so the promised download works; corrected the "Over 40 files" claim.
    - **Image partial hardening** (`layouts/partials/image.html`): the missing-resource fallback used to emit `<img src="{{ $src }}">` even for bare relative filenames that failed both page- and global-resource lookup (guaranteed 404). Now the fallback only renders when `$src` is a real external URL or an absolute path; otherwise it `warnf`s at build time. This makes a future missing-image regression a loud build warning instead of a silent broken thumbnail.
    - **Duplicated/SEO-stuffed titles:** `blog/_index.md` `title` was a long keyword string used as BOTH the visible `<h1>` and the base for `<title>` (which re-appended "| Simone Mattioli" → duplicated brand). Set blog title → "Blog" (clean H1) and wired the previously-dead `meta_title` front matter into `basic-seo.html`: `<title>` now prefers `meta_title`, appends " | Simone Mattioli" **only when the brand isn't already present** (handles the inconsistent meta_title values across the 8 pages that had them). All page titles verified clean/branded, no duplication.
  - *Tech Notes*: New tracked binary `content/english/blog/experiences/CLAB Univr/materiali-di-study.zip` (15 MB, not gitignored → deploys via CI). No new deps. Verified: clean `hugo --gc --minify` build (606 pages, 0 warnings/errors), link crawler 0 real breakages, all fixed URLs + aliases return 200 on `hugo server`, and browser UI spot-check (home, blog hub, section, single post, about, globe, call — desktop + 375px mobile incl. hamburger nav — + light/dark toggle) with **no console errors** on any page.

---
STATUS: Production-readiness audit COMPLETED & VERIFIED on branch `new-UI` (not committed).
NEXT: review the remaining content-judgment items in TO_SIMO_DO.md (thin "Future article…" stubs, missing cover images).

---

- [2026-07-13 21:30]: About-page portrait re-centered on the subject (branch `new-UI`)
  - *Details*: The About portrait (`assets/images/simo_lovable.png`, used only by `data/about.yml` → `layouts/about/list.html`'s `.ds-about-portrait`) showed Simone pushed to the far left with empty door/wall on the right. Root cause: the source was a near-square 1178×1200 with the subject occupying only the left ~25%; `object-cover` + default `object-position:50%` centred the crop on the middle (the door), and `object-position` alone couldn't fix it because the desktop container (360×507, aspect 0.71) yields a crop window ~926px wide — even `object-position:left` only reached ~35% (still left-of-centre), and the container aspect varies by breakpoint (desktop 0.71 / mobile ~0.82 / tablet landscape) so no single object-position centres him everywhere.
  - *Fix*: Cropped the source to `600×857` (`box=(0,0,600,857)`, aspect 0.70 ≈ the desktop container) so the subject is **horizontally centred at 50%**. Because he's now centred in the asset, `object-cover` keeps him centred at every breakpoint (symmetric side/top-bottom cropping). Verified in-browser at 1280px desktop and 375px mobile — centred, head-to-torso framing, no shoulder clipping, no console errors; clean production build. The original uncropped image remains recoverable from git (`git show HEAD:assets/images/simo_lovable.png`) if a wider shot with the venue context is ever preferred.
  - *Tech Notes*: No template/CSS change needed — pure asset re-crop. Pillow was used for the crop (dev-only; not a project dependency). Image is 600px wide, ample for the ≤375px display.

- [2026-07-14]: Revert `/connect` page to `master` branch version
  - *Details*: Reverted the connect page to its previous look from the master branch per user request.
  - *Tech Notes*: Restored `layouts/connect/baseof.html` and `layouts/connect/list.html` from `master` branch.
