# Azioni Manuali Necessarie - Phase 2 Optimization

## Deploy e Test

### 1. Deploy su GitHub Pages

```bash
cd /Users/simo/Downloads/simo-hue.github.io

# Verifica lo stato dei file modificati
git status

# Aggiungi le modifiche
git add layouts/partials/image.html
git add themes/hugoplate/layouts/blog/single.html

# Commit con messaggio descrittivo
git commit -m "perf: Phase 2 - optimize LCP with priority image loading

- Modified image.html partial to support Priority parameter
- Added loading='eager' + fetchpriority='high' for priority images
- Applied Priority=true to blog post cover images (LCP candidates)
- Blog cards remain lazy-loaded (below-fold)

Expected impact: LCP 6.8s → <2.5s, Performance 63 → 80+"

# Push su GitHub
git push origin main
```

### 2. Attendi GitHub Actions

- Vai su: https://github.com/simo-hue/simo-hue.github.io/actions
- Verifica che il workflow di deploy completi con successo
- Tempo stimato: ~2-3 minuti

### 3. Test su PageSpeed Insights

1. Apri: https://pagespeed.web.dev/
2. Inserisci URL: `https://simo-hue.github.io` (homepage)
3. **IMPORTANTE**: Testa anche un blog post specifico, es. `https://simo-hue.github.io/blog/...`
4. Seleziona tab "Dispositivi mobili"
5. Clicca "Analizza"
6. Attendi i risultati (~30-60 secondi)

### 4. Documenta i Risultati

Prendi nota di **ENTRAMBI** i test (homepage + blog post):

**Homepage**:
- **Performance**: __ /100 (era 63-71)
- **FCP**: __s (era 2.9s)
- **LCP**: __s (era 6.8s - CRITICO DA MIGLIORARE)
- **Speed Index**: __s (era 2.9s)
- **TBT**: __ms (era 90ms)
- **CLS**: __ (era 0.001)

**Blog Post**:
- **Performance**: __ /100
- **LCP**: __s (dovrebbe essere molto migliorato qui!)

### 5. Validazione Funzionale

Testa su mobile real device o Chrome DevTools mobile emulation:

- [ ] Homepage si carica correttamente
- [ ] Blog post cover images si caricano immediatamente (no lazy load delay)
- [ ] Verifica Network tab: cover images dovrebbero avere `fetchpriority: high`
- [ ] Immagini below-fold hanno ancora lazy loading
- [ ] Nessuna regressione su navigazione, search, etc.

### 6. Verifica Network Tab (DevTools)

- Apri un blog post
- Apri Chrome DevTools (F12)
- Tab "Network"
- Filtra per "Img"
- Ricarica la pagina
- Verifica che la cover image:
  - ✅ Ha `Priority: High` (nella colonna Priority)
  - ✅ Si carica subito (non attende scroll)
- Verifica che le altre immagini:
  - ✅ Hanno `Priority: Low` o normale
  - ✅ Si caricano solo quando entrano nel viewport

## Risultati Attesi

**Scenario Migliore (Blog Post)**:
- LCP: 6.8s → < 2.5s (-63%)
- Performance: 63 → 85+ (+22 punti)

**Scenario Realista**:
- LCP: 6.8s → ~3.5s (-48%)
- Performance: 63 → 75-80 (+12-17 punti)

**Homepage**:
- Potrebbe avere miglioramento meno drammatico se LCP non è un'immagine
- Ma FCP e Speed Index dovrebbero rimanere buoni (~2.9s)

## Prossimi Passi Dopo il Test

**Se LCP < 2.5s e Performance > 80**:
- ✅ **SUCCESSO!** Obiettivo raggiunto
- Considerare Phase 3 (JS optimization) solo se vogliamo andare oltre 85

**Se LCP 3-4s e Performance 75-80**:
- Buon miglioramento ma c'è margine
- Investigare:
  - Quale elemento è LCP su homepage?
  - Ci sono altre immagini hero da marcare Priority=true?
  - Preload esplicito nella head potrebbe aiutare?

**Se LCP > 5s ancora**:
- Problema diverso da image loading
- Potrebbe essere:
  - Dimensione dell'immagine troppo grande (compressione?)
  - Server response time lento
  - Verificare Chrome DevTools Performance timeline

## Note

- Il miglioramento sarà più evidente sui blog post che sulla homepage
- Test multipli (2-3) per ottenere una media affidabile
- Confronta sempre Mobile vs Desktop per perspective
