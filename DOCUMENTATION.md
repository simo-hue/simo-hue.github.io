# 📚 DOCUMENTAZIONE SEO & GEO - Strategia Posizionamento "Mattioli" 2026

## 🔧 ULTIMO AGGIORNAMENTO: Fix Hugo Build Recursion (15 Gen 2026)

### Problema Risolto
**Issue:** `hugo build` falliva su GitHub Actions con errore di timeout/ricorsione infinita in `basic-seo.html`.
**Causa:** La pagina "Live the dream" mancava di `description` nel frontmatter, costringendo Hugo a generare un summary accedendo al contenuto ricco (con shortcode YouTube) che causava loop/timeout nel rendering parziale.

### Soluzione
- Aggiunto `description` manuale al frontmatter di `content/english/blog/thought/live the dream/index.md`.
- Questo bypassa la generazione automatica del summary in `basic-seo.html`.

---

## 🔧 AGGIORNAMENTO PRECEDENTE: Creazione Articolo "Stelle" (15 Gen 2026)

### Nuova Contenuto
Creata una nuova voce nella categoria 'Thought' intitolata "Stelle".

**Dettagli:**
- **Path:** `content/english/blog/thought/stelle/index.md`
- **Frontmatter:** Configurati titolo, data, categoria, tag e placeholder immagine.
- **Contenuto:** Riflessione SEO-friendly su stelle, luce e oscurità.
- **Azione Richiesta:** L'utente deve caricare `cover.jpg` nella directory dell'articolo.

---

## 🔧 AGGIORNAMENTO PRECEDENTE: Fix Breadcrumb Schema (15 Gen 2026)

### Problema Risolto
**Issue Google Search Console:** "URL non valido nel campo 'id' (in 'itemListElement.item')"

**Causa:** Il campo `item` era presente anche nell'ultimo elemento del breadcrumb (pagina corrente), violando le linee guida Google.

**Soluzione Implementata:**
- ✅ Modificato `/layouts/partials/seo/schema-breadcrumb.html`
- ✅ Rimosso campo `item` dall'ultimo elemento della trail
- ✅ Mantenuto campo `name` su tutti gli elementi
- ✅ Conforme a [Google Breadcrumb Guidelines](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)

**Esempio Output (Prima - ❌ Errato):**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://simo-hue.github.io/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://simo-hue.github.io/blog/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Titolo Articolo",
      "item": "https://simo-hue.github.io/blog/titolo-articolo/"  ← PROBLEMA!
    }
  ]
}
```

**Esempio Output (Dopo - ✅ Corretto):**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://simo-hue.github.io/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://simo-hue.github.io/blog/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Titolo Articolo"  ← CORRETTO! Nessun campo 'item'
    }
  ]
}
```

**Prossimi Step:**
1. ✅ Codice corretto (FATTO)
2. ⏳ Deploy su GitHub Pages
3. ⏳ Attendere 1-2 settimane per re-crawl Google
4. ⏳ Validare su Google Search Console > Miglioramenti > Breadcrumb > "Convalida correzione"

---

## 🎯 Obiettivo del Progetto

Posizionare il sito personale e blog di **Simone Mattioli** come risultato #1 assoluto per le ricerche:
- "mattioli" 
- "simone mattioli"
- "mattioli simone"

Contesto: Studente universitario che vuole costruire una forte presenza digitale e personal brand.

---

## 📋 10 Step Strategici Implementati

### STEP 1: E-E-A-T Enhancement & Personal Branding

**Obiettivo:** Stabilire autorevolezza e affidabilità del brand personale secondo i criteri Google.

**Implementazione:**
1. **Biografia Autorevole**
   - Creare pagina "About" / "Chi Sono" dettagliata (800-1000 parole)
   - Includere: percorso accademico, competenze, progetti, obiettivi
   - Foto professionale ad alta qualità
   - Link a credenziali verificabili (università, certificazioni)

2. **Schema Markup Author/Person**
   ```json
   {
     "@context": "https://schema.org",
     "@type": "Person",
     "name": "Simone Mattioli",
     "alternateName": "Mattioli Simone",
     "url": "https://simo-hue.github.io",
     "image": "https://simo-hue.github.io/images/simone-mattioli.jpg",
     "sameAs": [
       "https://www.linkedin.com/in/simone-mattioli",
       "https://github.com/simo-hue",
       "https://twitter.com/username"
     ],
     "jobTitle": "Studente [Nome Corso]",
     "worksFor": {
       "@type": "EducationalOrganization",
       "name": "[Nome Università]"
     },
     "alumniOf": {
       "@type": "EducationalOrganization",
       "name": "[Scuola precedente se rilevante]"
     }
   }
   ```

3. **Knowledge Graph**
   - Creare profilo Wikidata (gratuito, open)
   - Collegare tutti i profili social con stesso nome/foto
   - Mantenere consistenza NAP (Name, Image, Bio) ovunque

4. **Credibilità Accademica**
   - Pubblicare progetti/tesi (anche parziali) su GitHub
   - Scrivere case studies dettagliati
   - Condividere learning journey su blog/LinkedIn

---

### STEP 2: AI Search Optimization (2026)

**Obiettivo:** Ottimizzare per motori di ricerca AI (Google SGE, Gemini, Perplexity, ChatGPT Search).

**Implementazione:**

1. **Featured Snippets Optimization**
   - Creare sezione FAQ su homepage con domande come:
     - "Chi è Simone Mattioli?"
     - "Cosa fa Mattioli?"
     - "Quali progetti ha realizzato Simone Mattioli?"
   - Strutturare risposte in paragrafi 40-60 parole
   - Usare liste puntate per step/processi

2. **Schema FAQ Markup**
   ```json
   {
     "@context": "https://schema.org",
     "@type": "FAQPage",
     "mainEntity": [{
       "@type": "Question",
       "name": "Chi è Simone Mattioli?",
       "acceptedAnswer": {
         "@type": "Answer",
         "text": "Simone Mattioli è uno studente di [Corso] presso [Università], specializzato in [competenze]. Nel suo percorso ha realizzato progetti come [esempio], dimostrando competenze in [tecnologie]."
       }
     }]
   }
   ```

3. **Contenuti Conversazionali**
   - Scrivere in tono naturale, come se rispondessi a domande
   - Usare "Io sono..." "Il mio lavoro consiste in..."
   - Evitare keyword stuffing, puntare su semantica

4. **Rich Media per AI**
   - Video introduttivo con trascrizione completa
   - Immagini con alt text descrittivi
   - Infografiche su progetti con testo alternativo

---

### STEP 3: Technical SEO Avanzato

**Obiettivo:** Performance tecnica perfetta per ranking massimo.

**Implementazione:**

1. **Core Web Vitals Target**
   - LCP (Largest Contentful Paint): < 1.5s
   - FID (First Input Delay): < 100ms
   - CLS (Cumulative Layout Shift): < 0.1
   
   **Azioni:**
   - Ottimizzare immagini: WebP/AVIF, lazy loading
   - Minimizzare CSS/JS, code splitting
   - Usare CDN per assets statici
   - Font loading ottimizzato (font-display: swap)

2. **Schema Markup Completo**
   - ✅ Person (già visto sopra)
   - ✅ WebSite con Sitelinks Search Box
   - ✅ BreadcrumbList per navigazione
   - ✅ Blog (se presente)
   - ✅ Article per ogni blog post

   **WebSite Schema:**
   ```json
   {
     "@context": "https://schema.org",
     "@type": "WebSite",
     "name": "Simone Mattioli - Portfolio & Blog",
     "alternateName": "Mattioli Blog",
     "url": "https://simo-hue.github.io",
     "potentialAction": {
       "@type": "SearchAction",
       "target": "https://simo-hue.github.io/search?q={search_term_string}",
       "query-input": "required name=search_term_string"
     }
   }
   ```

3. **Sitemap XML Dinamica**
   - Generare sitemap.xml automatica
   - Includere `<lastmod>` per ogni URL
   - Priorità: homepage (1.0), about (0.9), blog posts (0.8), altri (0.5)
   - Submit a Google Search Console + Bing Webmaster

4. **Robots.txt Ottimizzato**
   ```
   User-agent: *
   Allow: /
   Disallow: /admin/
   Disallow: /*.json$
   
   Sitemap: https://simo-hue.github.io/sitemap.xml
   ```

5. **Meta Tags Essenziali**
   ```html
   <!-- SEO Basics -->
   <title>Simone Mattioli - Studente, Developer & Blogger</title>
   <meta name="description" content="Portfolio e blog di Simone Mattioli, studente di [Corso]. Progetti, articoli e approfondimenti su [topics].">
   <link rel="canonical" href="https://simo-hue.github.io">
   
   <!-- Open Graph (Facebook, LinkedIn) -->
   <meta property="og:title" content="Simone Mattioli - Portfolio & Blog">
   <meta property="og:description" content="Portfolio e blog di Simone Mattioli">
   <meta property="og:image" content="https://simo-hue.github.io/og-image.jpg">
   <meta property="og:url" content="https://simo-hue.github.io">
   <meta property="og:type" content="website">
   
   <!-- Twitter Card -->
   <meta name="twitter:card" content="summary_large_image">
   <meta name="twitter:title" content="Simone Mattioli">
   <meta name="twitter:description" content="Portfolio e blog di Simone Mattioli">
   <meta name="twitter:image" content="https://simo-hue.github.io/twitter-card.jpg">
   ```

---

### STEP 4: Content Pillar Strategy

**Obiettivo:** Creare contenuti autorevoli che attraggono backlink e posizionamento.

**Strategia Hub & Spoke:**

```
                    [HOMEPAGE]
                        |
            +-----------+-----------+
            |           |           |
        [Pillar 1]  [Pillar 2]  [Pillar 3]
         /  |  \      /  |  \      /  |  \
       [S] [S] [S]  [S] [S] [S]  [S] [S] [S]
       
Pillar = Articolo guida 2000-3000 parole
S = Spoke article 800-1500 parole (link al pillar)
```

**Esempio Pillar per Studente Tech:**

1. **Pillar 1: "Guida Completa a [Tecnologia X]: Dalla Teoria alla Pratica"**
   - 2500 parole
   - Struttura: Intro, Fondamentali, Casi d'uso, Tutorial, Best Practices
   - Spokes: "Come installare X", "X vs Y confronto", "10 errori comuni con X"

2. **Pillar 2: "Il Mio Percorso da Studente a Developer: Progetti e Lezioni"**
   - Storytelling personale
   - Keyword brand "Simone Mattioli studente", "progetti Mattioli"
   - Spokes: Case study singoli progetti

3. **Pillar 3: "[Settore] in Italia nel 2026: Trend e Opportunità"**
   - Content autoritativo, dati, ricerche
   - Posizionamento come thought leader
   - Spokes: Deep dive su trend specifici

**Frequenza Pubblicazione:**
- Blog post: 1-2 a settimana (minimo)
- Aggiornamento pillar: ogni 3-6 mesi
- Lunghezza minima: 800 parole
- Keyword research prima di ogni articolo

---

### STEP 5: Local SEO & GEO Optimization

**Obiettivo:** Dominare risultati di ricerca in Italia e regione specifica.

**Implementazione:**

1. **Local Schema Markup**
   ```json
   {
     "@context": "https://schema.org",
     "@type": "Person",
     "name": "Simone Mattioli",
     "address": {
       "@type": "PostalAddress",
       "addressLocality": "[Città]",
       "addressRegion": "[Regione]",
       "addressCountry": "IT"
     },
     "areaServed": {
       "@type": "Place",
       "name": "Italia"
     }
   }
   ```

2. **Geo-Targeted Content**
   - Scrivere articoli su "[Topic] in [Città/Regione]"
   - Es: "Studiare Informatica nelle Marche: La mia esperienza"
   - Menzionare luoghi, università, community locali

3. **Hreflang (se multilingua futuro)**
   ```html
   <link rel="alternate" hreflang="it" href="https://simo-hue.github.io" />
   <link rel="alternate" hreflang="en" href="https://simo-hue.github.io/en" />
   ```

4. **Italian-First Approach**
   - Contenuto primario in italiano
   - Keyword research su Google.it
   - Backlink prioritari da .it domains
   - Partecipazione a community italiane

---

### STEP 6: Backlink Profile di Qualità

**Obiettivo:** Ottenere 50+ backlink da domini autorevoli (DA 40+) in 6-12 mesi.

**Strategia per Studenti (Budget Zero):**

1. **Guest Posting Strategico**
   - Target: blog tech italiani, blog università, community
   - Pitch: "Ciao, sono Simone Mattioli, studente di [X]. Ho scritto un articolo su [topic] che penso possa interessare i tuoi lettori..."
   - Fornire contenuto GRATIS, di alta qualità (1500+ parole)
   - Author bio con link al sito

2. **Progetti Open Source**
   - Creare repository GitHub di valore
   - Documentazione eccellente con link al sito
   - Contribuire a progetti esistenti
   - README con badge, link, presentazione

3. **Digital PR & Interviste**
   - Proporsi per interviste su blog/podcast del settore
   - "La vita da studente di [X] nel 2026"
   - Storytelling personale + competenza tecnica
   - Sempre richiedere link do-follow al sito

4. **Resource Link Building**
   - Creare risorse utili: checklist, template, tools
   - Promuovere su Reddit, forum, community
   - Es: "Ho creato una guida completa su X, è gratuita qui: [link]"

5. **HARO & Journalist Outreach**
   - Rispondere a richieste giornalisti (HARO, Qwoted)
   - Proporsi come fonte esperta su [topic]
   - Menzioni su testate → backlink autorevoli

6. **Unlinked Mentions**
   - Usare Google Alerts per "Simone Mattioli" "Mattioli"
   - Trovare menzioni senza link
   - Contattare: "Ciao, grazie per la menzione! Potreste linkare al mio sito?"

**Anchor Text Distribution (importante!):**
- 40% Brand: "Simone Mattioli", "Mattioli", "simo-hue"
- 30% Naked URL: "simo-hue.github.io"
- 20% Generic: "qui", "questo articolo", "scopri di più"
- 10% Keyword: "studente informatica", "developer italiano"

---

### STEP 7: Social Signals & Brand Mentions

**Obiettivo:** Amplificare presenza online e generare "buzz" attorno al brand.

**Piattaforme Prioritarie:**

1. **LinkedIn (Priorità #1 per studenti)**
   - Post 2-3 volte a settimana
   - Content mix:
     - Learning in public (50%): "Ho imparato X, ecco come..."
     - Progetti (30%): "Ho realizzato Y, tech stack: ..."
     - Insight/Opinioni (20%): "Perché penso che Z..."
   - Usare hashtag: #developer #student #[tecnologie]
   - Interagire con network: commentare post altri professionisti

2. **Twitter/X**
   - Thread tecnici su progetti
   - Live tweeting di learning
   - Retweet + commento di thought leader del settore
   - Bio: "Studente [X] | [Skills] | [Passion] → link"

3. **GitHub**
   - Commit regolari (green squares!)
   - README profilo personalizzato:
     ```markdown
     # 👋 Ciao, sono Simone Mattioli
     
     🎓 Studente di [Corso] presso [Università]
     💻 Appassionato di [tecnologie]
     🚀 Attualmente lavoro su [progetto]
     
     📫 Contattami: [link sito]
     ```
   - Pinned repositories ben documentati

4. **Dev.to / Medium**
   - Cross-posting articoli dal blog (con canonical link)
   - Serie tematiche
   - Community engagement

5. **Instagram (opzionale)**
   - Se visual: screenshot codice, design, progetti
   - Stories: behind the scenes studio/progetti
   - Bio con link sito

**Brand Mentions:**
- Obiettivo: essere citato anche senza link
- Google vede menzioni come segnale di autorevolezza
- Aumentare "branded search volume" → Google interpreta come brand autorevole

---

### STEP 8: Branded Search Optimization

**Obiettivo:** Dominare SERP per keyword brand "Mattioli" e varianti.

**Tattiche:**

1. **Title Tag Optimization**
   - Homepage: `Simone Mattioli - [Ruolo Principale] | Portfolio & Blog`
   - About: `Chi è Simone Mattioli | Studente, Developer, [Passion]`
   - Blog: `Blog di Simone Mattioli | [Topics]`
   - Ripetere "Mattioli" in modo naturale

2. **Meta Description**
   - Includere sempre "Simone Mattioli" o "Mattioli"
   - Call to action
   - Max 155 caratteri
   - Esempio: "Scopri il portfolio di Simone Mattioli, studente di [X]. Progetti, articoli e risorse su [topics]. Seguimi nel mio percorso!"

3. **Header Hierarchy**
   ```html
   <h1>Simone Mattioli - Studente & Developer</h1>
   <h2>Chi sono</h2>
   <h2>Progetti di Simone Mattioli</h2>
   <h3>Progetto 1: [Nome]</h3>
   ```

4. **Internal Linking**
   - Ogni pagina linka ad "About" con anchor "Simone Mattioli"
   - Footer: link a pagine principali
   - Breadcrumbs con schema markup
   - Blog posts linkano tra loro e a pillar pages

5. **Sitelinks Eligibility**
   - Google mostra sitelinks per brand emergenti
   - Requisiti:
     - Navigazione chiara
     - Pagine ben strutturate
     - Alto CTR su brand search
   - Suggerire sitelinks ideali con navigazione prominente:
     - About, Portfolio, Blog, Contatti

6. **Knowledge Panel**
   - Obiettivo a lungo termine: Google Knowledge Panel
   - Requisiti:
     - Presenza Wikipedia/Wikidata
     - Profili social linkati
     - Schema Person corretto
     - Alto volume branded search
   - Suggerisci modifiche via Google Search Console

---

### STEP 9: Performance & UX Excellence

**Obiettivo:** User experience perfetta = segnali positivi a Google (basso bounce rate, alto tempo su pagina).

**Implementazione:**

1. **Mobile-First Design**
   - 70%+ utenti da mobile
   - Test su Google Mobile-Friendly Test
   - Touch targets > 48x48px
   - Font size min 16px
   - Responsive images

2. **Navigation**
   - Menu chiaro max 7 voci
   - Mega menu se molte pagine
   - Search bar se > 20 pagine contenuti
   - Breadcrumbs su tutte le pagine interne

3. **Loading Performance**
   - Lazy loading immagini
   - Critical CSS inline
   - Defer non-critical JS
   - Preconnect a risorse esterne:
     ```html
     <link rel="preconnect" href="https://fonts.googleapis.com">
     ```

4. **Engagement Tactics**
   - Related posts a fine articolo
   - CTA chiari ("Leggi anche", "Scopri progetti")
   - Commenti su blog posts (Disqus/native)
   - Newsletter signup

5. **Accessibility (SEO bonus!)**
   - Alt text su tutte le immagini
   - ARIA labels dove necessario
   - Contrasto colori WCAG AA minimo
   - Keyboard navigation
   - Headings logici senza skip

**Metriche da Monitorare:**
- Bounce rate: < 50% (obiettivo)
- Tempo medio sessione: > 2 minuti
- Pagine per sessione: > 2
- Core Web Vitals: "Good" su tutti e 3

---

### STEP 10: Monitoring & Continuous Optimization

**Obiettivo:** Decisioni data-driven, ottimizzazione continua.

**Tools Setup:**

1. **Google Search Console** (Gratuito)
   - Verificare proprietà sito
   - Monitorare:
     - Posizione media keyword "mattioli", "simone mattioli"
     - Impressions & CTR
     - Core Web Vitals
     - Coverage issues
   - Weekly check: ogni lunedì mattina

2. **Google Analytics 4** (Gratuito)
   - Installare gtag.js
   - Eventi custom:
     - Click su progetti
     - Download CV/risorse
     - Scroll depth blog posts
   - Conversioni:
     - Contact form submission
     - Newsletter signup
     - Social click

3. **Google Tag Manager** (Opzionale)
   - Gestire tag senza modificare codice
   - Utile per: pixel, analytics, heatmaps

4. **Rank Tracking**
   - Free tools:
     - Google Search Console (ranking medio)
     - Manual search (incognito)
     - SerpRobot.com (10 query free)
   - Paid (se budget):
     - Ubersuggest (€12/mese)
     - SE Ranking (€20/mese student discount)
   - Tracciare:
     - "mattioli" [Città]
     - "simone mattioli"
     - "mattioli simone"
     - Long-tail keyword dei pillar

5. **Backlink Monitoring**
   - Google Search Console > Links
   - Ahrefs Webmaster Tools (FREE)
   - Monitor: nuovi backlink, lost backlink, anchor text

**Routine di Ottimizzazione:**

| Frequenza | Attività |
|-----------|----------|
| **Giornaliera** | - Check Google Alerts "Simone Mattioli"<br>- Rispondere commenti blog/social |
| **Settimanale** | - Pubblicare 1-2 blog post<br>- Review Search Console performance<br>- Outreach per guest post (2-3 pitch) |
| **Mensile** | - Report completo SEO (template sotto)<br>- Aggiornare contenuto vecchio<br>- Review backlink profile<br>- A/B test nuovi title/description |
| **Trimestrale** | - Audit SEO completo<br>- Competitor analysis<br>- Strategia contenuti next quarter |

**Monthly Report Template:**

```markdown
# SEO Report - [Mese] 2026

## Keyword Rankings
- "mattioli": Posizione [X] (prev: [Y]) [↑/↓]
- "simone mattioli": Posizione [X] (prev: [Y]) [↑/↓]

## Traffic
- Organic sessions: [X] (prev: [Y]) [+/- %]
- New users: [X]
- Avg. session duration: [X:XX]
- Bounce rate: [X%]

## Content Published
- [Titolo post 1] - [views]
- [Titolo post 2] - [views]

## Backlinks
- New backlinks: [X]
- Total backlinks: [Y]
- Top new source: [Domain] (DA [X])

## Action Items Next Month
- [ ] Azione 1
- [ ] Azione 2
```

---

## 🛠️ Implementazioni Tecniche Specifiche

### Configurazione Hugo (se usi Hugo per GitHub Pages)

1. **Config.toml SEO Ottimizzato**
```toml
baseURL = "https://simo-hue.github.io/"
languageCode = "it-IT"
title = "Simone Mattioli - Portfolio & Blog"
theme = "[tuo-theme]"

[params]
  description = "Portfolio e blog di Simone Mattioli, studente di [X]"
  author = "Simone Mattioli"
  
[params.social]
  linkedin = "simone-mattioli"
  github = "simo-hue"
  twitter = "username"

[sitemap]
  changefreq = "weekly"
  priority = 0.5
  filename = "sitemap.xml"
```

2. **Partial: head.html (meta tags)**
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary Meta Tags -->
  <title>{{ if .IsHome }}{{ .Site.Title }}{{ else }}{{ .Title }} | {{ .Site.Title }}{{ end }}</title>
  <meta name="title" content="{{ if .IsHome }}{{ .Site.Title }}{{ else }}{{ .Title }} | {{ .Site.Title }}{{ end }}">
  <meta name="description" content="{{ if .Description }}{{ .Description }}{{ else }}{{ .Site.Params.description }}{{ end }}">
  <link rel="canonical" href="{{ .Permalink }}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="{{ if .IsPage }}article{{ else }}website{{ end }}">
  <meta property="og:url" content="{{ .Permalink }}">
  <meta property="og:title" content="{{ if .IsHome }}{{ .Site.Title }}{{ else }}{{ .Title }}{{ end }}">
  <meta property="og:description" content="{{ if .Description }}{{ .Description }}{{ else }}{{ .Site.Params.description }}{{ end }}">
  <meta property="og:image" content="{{ .Site.BaseURL }}images/og-image.jpg">
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="{{ .Permalink }}">
  <meta property="twitter:title" content="{{ .Title }}">
  <meta property="twitter:description" content="{{ if .Description }}{{ .Description }}{{ else }}{{ .Site.Params.description }}{{ end }}">
  <meta property="twitter:image" content="{{ .Site.BaseURL }}images/twitter-card.jpg">
  
  <!-- Schema.org JSON-LD -->
  {{ partial "schema.html" . }}
</head>
```

3. **Partial: schema.html**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "{{ .Site.BaseURL }}#person",
      "name": "Simone Mattioli",
      "url": "{{ .Site.BaseURL }}",
      "image": "{{ .Site.BaseURL }}images/simone-mattioli.jpg",
      "sameAs": [
        "https://www.linkedin.com/in/{{ .Site.Params.social.linkedin }}",
        "https://github.com/{{ .Site.Params.social.github }}",
        "https://twitter.com/{{ .Site.Params.social.twitter }}"
      ],
      "jobTitle": "Studente",
      "description": "{{ .Site.Params.description }}"
    },
    {
      "@type": "WebSite",
      "@id": "{{ .Site.BaseURL }}#website",
      "url": "{{ .Site.BaseURL }}",
      "name": "{{ .Site.Title }}",
      "publisher": {
        "@id": "{{ .Site.BaseURL }}#person"
      }
    }
    {{ if .IsPage }}
    ,{
      "@type": "Article",
      "headline": "{{ .Title }}",
      "datePublished": "{{ .Date.Format "2006-01-02T15:04:05Z07:00" }}",
      {{ if .Lastmod }}"dateModified": "{{ .Lastmod.Format "2006-01-02T15:04:05Z07:00" }}",{{ end }}
      "author": {
        "@id": "{{ .Site.BaseURL }}#person"
      },
      "publisher": {
        "@id": "{{ .Site.BaseURL }}#person"
      },
      "description": "{{ if .Description }}{{ .Description }}{{ else }}{{ .Summary }}{{ end }}",
      "url": "{{ .Permalink }}"
    }
    {{ end }}
  ]
}
</script>
```

---

## 📊 Timeline & Aspettative Realistiche

### Mese 1-2: Foundation
- ✅ Setup tecnico completo
- ✅ Schema markup implementato
- ✅ Profili social ottimizzati
- ✅ Prime 8-10 blog posts pubblicati
- 📈 **Risultato atteso:** Indicizzazione completa, posizione 20-50 per "mattioli"

### Mese 3-4: Content & Outreach
- ✅ 15-20 backlink acquisiti
- ✅ 2 pillar articles pubblicati
- ✅ Guest post su 3-5 blog esterni
- ✅ LinkedIn engagement costante
- 📈 **Risultato atteso:** Posizione 10-20 per "simone mattioli", 15-30 per "mattioli"

### Mese 5-6: Momentum
- ✅ 30-40 backlink totali
- ✅ Featured snippet per 1-2 query
- ✅ Traffic organico 500-1000 visite/mese
- ✅ Brand mentions crescenti
- 📈 **Risultato atteso:** Top 10 per "simone mattioli", Top 15 per "mattioli"

### Mese 7-12: Dominio
- ✅ 50+ backlink di qualità
- ✅ Autorevolezza consolidata su topic
- ✅ Knowledge Panel (possibile)
- ✅ Traffic organico 1500-3000 visite/mese
- 📈 **Risultato atteso:** **#1 per "simone mattioli"**, Top 5-10 per "mattioli"

> ⚠️ **Nota:** Posizionamento #1 per keyword generica "mattioli" richiede superare:
> - Altre persone omonime con presenza consolidata
> - Aziende, luoghi, brand con questo nome
> - Autorità dominio più elevata
> 
> **È possibile ma richiede 12-18 mesi di lavoro costante.** Focus iniziale su "simone mattioli" (più realistico e veloce).

---

## 🎓 Best Practices per Studenti

### Content Ideas a Costo Zero

1. **Project Walkthroughs**
   - "Come ho costruito [progetto] con [tech stack]"
   - 2000 parole, screenshot, code snippets
   - Link GitHub repo
   - SEO: "tutorial [tech]", "[progetto] italiano"

2. **Learning in Public**
   - "30 giorni con [tecnologia]: cosa ho imparato"
   - Serie giornaliera su LinkedIn
   - Riassunto blog post settimanale
   - Engagement alto + backlink

3. **Resource Lists**
   - "50 risorse gratuite per imparare [X] nel 2026"
   - Linkable asset → backlinks naturali
   - Update ogni 6 mesi

4. **Opinion Pieces**
   - "Perché ogni studente dovrebbe imparare [X]"
   - Originale, con dati
   - Shareable → social signals

### Time Management (10h/settimana)

| Attività | Tempo/settimana |
|----------|-----------------|
| Scrivere blog post (1-2) | 4-5h |
| Guest post outreach | 1h |
| LinkedIn engagement | 1.5h |
| Social media posting | 1h |
| SEO monitoring | 0.5h |
| Learning/Research | 2h |
| **Totale** | **10h** |

**Tip:** Bloccare slot fissi calendario, es:
- Lunedì 20-22: Scrittura
- Mercoledì 19-20: LinkedIn + Social
- Domenica 15-18: Scrittura + Research

---

## 🚀 Quick Wins (Risultati Immediati)

1. **Aggiungere Schema Markup** → Fatto in 1h → Rich results in 1-2 settimane
2. **Ottimizzare Title/Meta** → 2h → CTR +20-50% in 1 mese
3. **Fix Core Web Vitals** → 4-6h → Ranking boost immediato
4. **Creare LinkedIn profile perfetto** → 2h → Visibility +200%
5. **Pubblicare su Dev.to** → Cross-post esistenti → Backlink immediato

---

## ❌ Errori da Evitare

1. **Keyword Stuffing** → Penalizzazione Google
   - ❌ "Mattioli Simone Mattioli studente Mattioli..."
   - ✅ Usa variazioni naturali, sinonimi

2. **Copiare Contenuti** → Duplicate content penalty
   - ✅ Sempre contenuto 100% originale
   - Se riutilizzi su altre piattaforme: canonical link

3. **Comprare Backlink** → Penalizzazione manuale
   - ✅ Solo backlink guadagnati organicamente

4. **Ignorare Mobile** → 70% traffico perso
   - ✅ Mobile-first sempre

5. **Content senza Strategia** → Spreco tempo
   - ✅ Keyword research prima di scrivere
   - ✅ Obiettivo chiaro per ogni articolo

6. **Non Monitorare Risultati** → Navigare al buio
   - ✅ Weekly check Google Search Console
   - ✅ Monthly report

---

## 📚 Risorse Gratuite Consigliate

### Tools SEO Free
- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics 4](https://analytics.google.com)
- [Google PageSpeed Insights](https://pagespeed.web.dev)
- [Ahrefs Webmaster Tools](https://ahrefs.com/webmaster-tools) - FREE!
- [Ubersuggest](https://neilpatel.com/ubersuggest/) - 3 search/day gratis
- [Answer The Public](https://answerthepublic.com) - Keyword ideas
- [Google Trends](https://trends.google.it) - Trend ricerche

### Learning Resources
- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Moz Beginner's Guide to SEO](https://moz.com/beginners-guide-to-seo)
- [Schema.org Docs](https://schema.org/docs/documents.html)
- [Ahrefs Blog](https://ahrefs.com/blog) - Tutorial gratuiti

### Communities Italiane
- [ItalianCoders Slack](https://italiancoders.it)
- r/ItalyInformatica su Reddit
- [DevMarche](https://devmarche.it) - se Marche
- LinkedIn groups: "Developer Italiani", "[Città] Tech"

---

## ✅ Checklist Launch SEO

Prima di considerare il sito "ottimizzato SEO", verifica:

**Technical:**
- [ ] HTTPS attivo
- [ ] Sitemap.xml generata e inviata
- [ ] Robots.txt corretto
- [ ] Core Web Vitals "Good"
- [ ] Mobile-friendly test passed
- [ ] Schema markup Person implementato
- [ ] Schema markup WebSite implementato
- [ ] Canonical tags su tutte le pagine
- [ ] Alt text su tutte le immagini
- [ ] Headings gerarchici corretti (H1 → H2 → H3)

**On-Page:**
- [ ] Title ottimizzati (<60 char)
- [ ] Meta descriptions (<155 char)
- [ ] URL strutturati e leggibili
- [ ] Internal linking strategico
- [ ] Breadcrumbs implementati
- [ ] Contenuto minimo 300 parole/pagina
- [ ] Keyword research per ogni pagina

**Off-Page:**
- [ ] Profilo LinkedIn 100% completo
- [ ] GitHub profile README creato
- [ ] Almeno 3 profili social attivi
- [ ] Google Search Console verificato
- [ ] Google Analytics installato
- [ ] Primi 5-10 backlink acquisiti

**Content:**
- [ ] Homepage con chiara value proposition
- [ ] Pagina About dettagliata (800+ parole)
- [ ] Almeno 5 blog posts pubblicati
- [ ] FAQ section con schema markup
- [ ] Portfolio/Progetti documentati

---

## 🎯 Conclusioni

Questa strategia SEO & GEO è **specificamente progettata per studenti** che vogliono costruire un personal brand forte senza budget.

**Pilastri del Successo:**
1. **Consistenza** → Meglio 1 post/settimana per 12 mesi che 10 post in 1 mese
2. **Qualità > Quantità** → 1 articolo eccellente > 5 mediocri
3. **Pazienza** → SEO richiede 6-12 mesi per risultati significativi
4. **Autenticità** → Contenuto genuino batte keyword stuffing

**Investimenti Richiesti:**
- 💰 Budget monetario: €0-50/mese (opzionale)
- ⏰ Tempo: 8-10 ore/settimana
- 🧠 Learning: Continuo (SEO evolve)
- 💪 Commitment: Minimo 12 mesi

**Remember:** Posizionarsi #1 per "mattioli" è una maratona, non uno sprint. Focus su "simone mattioli" nei primi 6 mesi, poi espandi verso keyword più competitive.

**Prossimi Passi Immediati:**
1. Leggi TO_SIMO_DO.md
2. Inizia da "Priorità Alta"
3. Pubblica prima versione "About" entro questa settimana
4. Scrivi e pubblica primo blog post entro 7 giorni

Buon lavoro! 🚀

---

*Documentazione creata il 15 Gennaio 2026*  
*Ultimo aggiornamento: 2026-01-15*
