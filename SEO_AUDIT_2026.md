
### 🎯 PRIORITÀ 3: Title Tag con Brand Consistency

**Attuale:** `title = "Mattioli Simone - Adventures in Technology & Humanity"`

**PROBLEMA:** "Mattioli Simone" non è la forma più cercata

**SOLUZIONE:**

```toml
# hugo.toml
title = "Simone Mattioli - Adventures in Technology & Humanity"
# ↑ Forma più naturale italiana
```

**E per ogni pagina:**
```html
<title>{{ .Title }} | Simone Mattioli</title>
<!-- Esempio output: "My Blog Post | Simone Mattioli" -->
```

**Template consigliato:**
```go
{{- if .IsHome -}}
  <title>{{ .Site.Title }}</title>
{{- else -}}
  <title>{{ .Title }} | Simone Mattioli</title>
{{- end -}}
```

**Impatto SEO:** ⭐⭐⭐⭐⭐
- "Simone Mattioli" in OGNI title tag
- Brand consistency
- Keyword reinforcement

**Tempo:** 5 minuti  
**Difficoltà:** Facile

---

### 🎯 PRIORITÀ 4: Immagini - Conversione Completa a WebP

**Attuale:** Solo 5 WebP trovati, 1 PNG in `static/images/`

**PROBLEMA:** PNG/JPG sono 30-50% più pesanti di WebP

**AZIONE:**

```bash
# Converti tutte le immagini esistenti
cd /Users/simo/Downloads/DEV/simo-hue.github.io

# Trova tutti PNG/JPG
find static -name "*.png" -o -name "*.jpg" -o -name "*.jpeg"

# Converti con ImageMagick o script
# Opzione 1: ImageMagick (se installato)
for img in static/images/*.{png,jpg,jpeg}; do
  magick "$img" "${img%.*}.webp"
done

# Opzione 2: Online tool + manual replace
# - Upload su squoosh.app
# - Scarica WebP
# - Sostituisci file
```

**Hugo Config già OK:**
```toml
[imaging]
quality = 80  # ✅ Già ottimizzato
```

**Impatto SEO:** ⭐⭐⭐⭐
- LCP (Largest Contentful Paint) miglior di 30-40%
- Core Web Vitals "Good" garantito
- Ranking boost mobile

**Tempo:** 30 minuti  
**Difficoltà:** Media

---

### 🎯 PRIORITÀ 5: FAQ Schema per Homepage

**Attuale:** Manca FAQ schema

**PERCHÉ È IMPORTANTE:**
- Featured Snippets per "Chi è Simone Mattioli?"
- Google SGE/AI Overviews
- Knowledge Panel candidacy

**IMPLEMENTA:**

Crea: `layouts/partials/seo/schema-faq.html`

```html
{{- /* Schema.org FAQPage for homepage */ -}}
{{- if .IsHome -}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Chi è Simone Mattioli?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simone Mattioli è uno studente di Computer Science presso l'Università di Verona, specializzato in Intelligenza Artificiale e Large Language Models. Appassionato di tecnologia, viaggi e fotografia."
      }
    },
    {
      "@type": "Question",
      "name": "Cosa fa Mattioli?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Mattioli studia Computer Science con focus su AI e sviluppa progetti innovativi nel campo del machine learning. Sul suo blog condivide riflessioni su tecnologia, viaggi e crescita personale."
      }
    },
    {
      "@type": "Question",
      "name": "Dove studia Simone Mattioli?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simone Mattioli studia presso l'Università di Verona, Dipartimento di Computer Science, con specializzazione in Artificial Intelligence e High-Performance Computing."
      }
    }
  ]
}
</script>
{{- end -}}
```

**Includi in head:**
```html
<!-- layouts/partials/essentials/head.html -->
{{ partial "seo/schema-faq.html" . }}
```

**Impatto SEO:** ⭐⭐⭐⭐⭐
- Featured Snippet per query brand
- AI search optimization (Gemini, ChatGPT search)
- Knowledge Graph signals

**Tempo:** 20 minuti  
**Difficoltà:** Facile

---

### 🎯 PRIORITÀ 6: Canonical URLs

**Verifica se presente:**

```html
<!-- Dovrebbe essere in head.html -->
<link rel="canonical" href="{{ .Permalink }}">
```

**Se manca, AGGIUNGI** in `layouts/partials/essentials/head.html`:

```html
{{- /* Canonical URL */ -}}
<link rel="canonical" href="{{ .Permalink }}">
```

**Impatto SEO:** ⭐⭐⭐⭐
- Previene duplicate content
- Consolida ranking signals
- Best practice essenziale

**Tempo:** 2 minuti  
**Difficoltà:** Triviale

---

### 🎯 PRIORITÀ 7: Robots Meta Tag Strategico

**AGGIUNGI** logica condizionale:

```html
{{- if or .Params.noindex (eq .Kind "404") -}}
  <meta name="robots" content="noindex, nofollow">
{{- else -}}
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
{{- end -}}
```

**Perché:**
- `max-snippet:-1` = snippet illimitati (Featured Snippets!)
- `max-image-preview:large` = immagini grandi in SERP
- Control granulare su indicizzazione

**Impatto SEO:** ⭐⭐⭐
- Featured Snippets eligibility
- Rich results optimization

**Tempo:** 5 minuti  
**Difficoltà:** Facile

---

## 🔥 OTTIMIZZAZIONI TECNICHE AVANZATE

### 8. Preconnect a Risorse Esterne

**AGGIUNGI in `<head>`:**

```html
<!-- Preconnect per performance -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://www.google-analytics.com">
<link rel="dns-prefetch" href="https://www.google-analytics.com">
```

**Impatto:** LCP -100-200ms → Core Web Vitals boost

---

### 9. Lazy Loading Nativo su Immagini

**Verifica template immagini:**

```html
<img src="..." alt="..." loading="lazy" decoding="async">
```

**Hugo shortcode:**
```go
{{- /* layouts/shortcodes/img.html */ -}}
<img src="{{ .Get "src" }}" 
     alt="{{ .Get "alt" }}" 
     loading="lazy" 
     decoding="async"
     width="{{ .Get "width" }}" 
     height="{{ .Get "height" }}">
```

**Uso:**
```markdown
{{< img src="/images/photo.webp" alt="Descrizione" width="800" height="600" >}}
```

---

### 10. Open Graph Immagini Ottimizzate

**CREA:** OG image 1200x630px per ogni post

**Template:**
```html
<meta property="og:image" content="{{ if .Params.image }}{{ .Params.image | absURL }}{{ else }}{{ .Site.Params.metadata.image | absURL }}{{ end }}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```

**Perché:** LinkedIn, Facebook, Twitter condivisioni → +CTR social

---

### 11. Sitemap Personalizzata

**Crea:** `layouts/sitemap.xml`

```xml
{{ printf "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>" | safeHTML }}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  {{ range .Data.Pages }}
  <url>
    <loc>{{ .Permalink }}</loc>
    {{ if not .Lastmod.IsZero }}
    <lastmod>{{ .Lastmod.Format "2006-01-02T15:04:05-07:00" }}</lastmod>
    {{ end }}
    {{ with .Sitemap.ChangeFreq }}
    <changefreq>{{ . }}</changefreq>
    {{ end }}
    {{ if ge .Sitemap.Priority 0.0 }}
    <priority>{{ .Sitemap.Priority }}</priority>
    {{ end }}
    {{- range .Resources.ByType "image" }}
    <image:image>
      <image:loc>{{ .Permalink }}</image:loc>
      <image:title>{{ .Title }}</image:title>
    </image:image>
    {{- end }}
  </url>
  {{ end }}
</urlset>
```

**Front Matter articoli:**
```yaml
---
sitemap:
  changefreq: monthly
  priority: 0.8
---
```

---

### 12. hreflang per Futuro Multilingua

**Se pianifichi inglese:**

```html
<link rel="alternate" hreflang="it" href="{{ .Permalink }}">
<link rel="alternate" hreflang="en" href="{{ .Permalink | replaceRE "^https://simo-hue.github.io" "https://simo-hue.github.io/en" }}">
<link rel="alternate" hreflang="x-default" href="{{ .Permalink }}">
```

---

## 📊 CONTENT OPTIMIZATION

### 13. Internal Linking Strategico

**Regola:** Ogni articolo deve linkare a:
- 2-3 articoli correlati (footer "Leggi anche")
- 1 pillar page (se esiste)
- Homepage con anchor "Simone Mattioli"

**Template consigliato:**
```markdown
<!-- In ogni post -->
---
Scopri di più sul [portfolio di Simone Mattioli](/) o leggi altri articoli su [AI](/tags/ai).
```

---

### 14. Alt Text Pattern

**SISTEMA ATTUALE:** Verifica che tutte le immagini abbiano alt

**BEST PRACTICE:**
```html
<!-- ❌ NON FARE -->
<img src="photo.jpg" alt="photo">

<!-- ✅ FARE -->
<img src="verona-university.jpg" alt="Simone Mattioli presso l'Università di Verona, Dipartimento Computer Science">
```

**Include "Simone Mattioli" o "Mattioli" in alt se pertinente!**

---

### 15. Header Hierarchy Check

**Verifica ogni pagina:**
```
H1: Solo UNO per pagina (titolo principale)
 └─ H2: Sezioni principali
     └─ H3: Sottosezioni
         └─ H4: Dettagli
```

**NO skip levels:** H1 → H3 (sbagliato!)

---

## 🎯 KEYWORDS & CONTENT STRATEGY

### 16. Keyword Research per "Mattioli"

**Target primari:**
1. `simone mattioli` (exact match)
2. `mattioli simone` (reversed)
3. `mattioli student` (long-tail)
4. `mattioli verona computer science`
5. `mattioli ai researcher`
6. `mattioli blog`

**Secondary:**
- `[Topic] mattioli opinion`
- `simone mattioli portfolio`
- `simone mattioli projects`

**Strategia:**
- Homepage: "Simone Mattioli" almeno 5-7 volte
- About page: 10-12 volte
- Ogni blog post: 2-3 menzioni

---

### 17. Content Calendar (Minimo)

**Posizionamento brand richiede VOLUME + CONSISTENZA**

**Piano minimo:**
- 2 blog post/mese (1000+ parole)
- 1 project showcase/mese
- Update pillar page ogni 3 mesi

**Calendario editoriale template:**
```markdown
## Gennaio 2026
- [ ] 15/01: Post su [Topic A]
- [ ] 30/01: Post su [Topic B]

## Febbraio 2026
- [ ] 10/02: Project showcase [X]
- [ ] 25/02: Post su [Topic C]
```

---

## 🔧 TECHNICAL SEO CHECKLIST

### Pre-Deploy Checklist

Prima di ogni deploy, verifica:

- [ ] Tutte le immagini hanno alt text
- [ ] Nessun broken link (usa `hugo check`)
- [ ] Title < 60 caratteri
- [ ] Description 130-155 caratteri
- [ ] H1 presente e unico
- [ ] Schema markup valido (Rich Results Test)
- [ ] Canonical URL presente
- [ ] Open Graph tags completi
- [ ] Mobile responsive (test su device fisico)

---

## 📈 MONITORING & ANALYTICS

### 18. Google Search Console Setup Avanzato

**CONFIGURA:**

1. **Email Alerts**
   - Errori critici di indicizzazione
   - Penalizzazioni manuali
   - Core Web Vitals issues

2. **Weekly Reports**
   - Query performance ("mattioli", "simone mattioli")
   - Click-through rate
   - Average position
   - Impressions trend

3. **URL Inspection Tool**
   - Testa ogni nuovo post pubblicato
   - Request indexing manuale
   - Verifica mobile usability

---

### 19. Google Analytics 4 - Custom Events

**TRACCIA:**

```javascript
// Esempio eventi personalizzati
gtag('event', 'social_click', {
  'platform': 'linkedin',
  'user': 'simone_mattioli'
});

gtag('event', 'project_view', {
  'project_name': 'AI Project X'
});
```

**Conversion Goals:**
- Contact form submit
- Social profile click
- Project page view > 30s
- Newsletter signup

---

### 20. Rank Tracking Setup

**Tools gratuiti:**
- Google Search Console (position moyenne)
- Manual searches (Incognito mode)
- SerpRobot.com (10 query/day free)

**Track keywords:**
1. `simone mattioli` (primary)
2. `mattioli simone`
3. `mattioli` (aspirational)
4. `simone mattioli verona`
5. `mattioli blog`
6. Long-tail del tuo settore

**Frequenza:** Weekly check every Monday

---

## 🎯 TIMELINE IMPLEMENTAZIONE

### Settimana 1 (Immediate)
- [x] Fix breadcrumb (FATTO!)
- [ ] Aggiungi alternateName a schema-person
- [ ] Fix title tag order
- [ ] Aggiungi canonical URLs
- [ ] Robots meta tag

**Tempo totale:** 2-3 ore

### Settimana 2
- [ ] Schema FAQ
- [ ] Meta descriptions personalizzate (primi 10 post)
- [ ] Conversione immagini WebP
- [ ] Preconnect resources

**Tempo totale:** 4-5 ore

### Settimana 3-4
- [ ] Internal linking audit
- [ ] Alt text optimization
- [ ] Primo pillar article
- [ ] Sitemap personalizzata

**Tempo totale:** 6-8 ore

### Ongoing
- [ ] Blog posts 2x/mese
- [ ] Weekly GSC monitoring
- [ ] Monthly SEO report
- [ ] Backlink outreach

---

## 🏆 EXPECTED RESULTS

### 1 Mese
- ✅ Tutti technical issues risolti
- ✅ Schema markup perfetto
- ✅ Core Web Vitals "Good"
- 📈 Posizione "simone mattioli": Top 10-20

### 3 Mesi
- ✅ 6-8 blog posts pubblicati
- ✅ 10-15 backlink acquisiti
- 📈 Posizione "simone mattioli": Top 5
- 📈 Posizione "mattioli": Top 30

### 6 Mesi
- ✅ 15+ blog posts
- ✅ 30+ backlink
- ✅ Featured snippet su 1-2 query
- 📈 Posizione "simone mattioli": #1-3
- 📈 Posizione "mattioli": Top 15

### 12 Mesi
- ✅ 30+ blog posts
- ✅ 50+ backlink
- ✅ Knowledge Panel (possibile)
- 📈 Posizione "simone mattioli": **#1**
- 📈 Posizione "mattioli": **Top 5-10**

---

## 📝 NEXT STEPS IMMEDIATI

**Oggi (15 Gen 2026):**
1. Deploy fix breadcrumb
2. Backup sito attuale
3. Leggere questo audit completamente

**Domani:**
1. Implementare PRIORITÀ 1-3 (2 ore)
2. Test con Rich Results Test
3. Commit changes

**Questa Settimana:**
1. Completare PRIORITÀ 1-7
2. Scrivere primo blog post con keywords
3. Setup Google Search Console alerts

---

## 🎓 RISORSE FINALI

### Learning
- [Google SEO Starter Guide 2026](https://developers.google.com/search/docs)
- [Schema.org Full Documentation](https://schema.org/docs/full.html)
- [Hugo SEO Best Practices](https://gohugo.io/templates/internal/)

### Tools
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev)
- [Schema Validator](https://validator.schema.org)
- [GT Metrix](https://gtmetrix.com)

---

**Domande? Dubbi? Fammi sapere e ti aiuto con l'implementazione! 🚀**

---

*Audit creato: 15 Gennaio 2026*  
*Prossimo review: 15 Febbraio 2026*
