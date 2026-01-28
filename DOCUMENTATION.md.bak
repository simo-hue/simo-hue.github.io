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
