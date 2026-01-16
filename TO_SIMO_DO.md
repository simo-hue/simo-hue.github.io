# Azioni Manuali Necessarie - Phase 1 Optimization

## Deploy e Test

### 1. Deploy su GitHub Pages

```bash
cd /Users/simo/Downloads/simo-hue.github.io

# Verifica lo stato dei file modificati
git status

# Aggiungi le modifiche
git add layouts/partials/essentials/style.html
git add layouts/partials/essentials/head.html
git add themes/hugoplate/layouts/partials/essentials/script.html
git add static/_headers

# Commit con messaggio descrittivo
git commit -m "perf: Phase 1 optimization - reduce render-blocking resources

- Add preconnect/dns-prefetch for external domains
- Preload critical fonts (Heebo, Signika)
- Make Google Analytics async (non-blocking)
- Add defer attribute to main script bundle
- Optimize lazy CSS loading with media print trick
- Add WebP-specific cache headers

Expected impact: FCP 5.3s → ~3.0s, LCP 6.3s → ~4.0s"

# Push su GitHub
git push origin main
```

### 2. Attendi GitHub Actions

- Vai su: https://github.com/simo-hue/simo-hue.github.io/actions
- Verifica che il workflow di deploy completi con successo
- Tempo stimato: ~2-3 minuti

### 3. Test su PageSpeed Insights

1. Apri: https://pagespeed.web.dev/
2. Inserisci URL: `https://simo-hue.github.io`
3. Seleziona tab "Dispositivi mobili"
4. Clicca "Analizza"
5. Attendi i risultati (~30-60 secondi)

### 4. Documenta i Risultati

Prendi nota di:
- **Performance**: __ /100 (era 64)
- **FCP**: __s (era 5.3s)
- **LCP**: __s (era 6.3s)
- **Speed Index**: __s (era 5.6s)
- **TBT**: __ms (era 0ms)
- **CLS**: __ (era 0)

### 5. Validazione Funzionale

Testa su mobile real device o Chrome DevTools mobile emulation:

- [ ] Homepage si carica correttamente
- [ ] Menu di navigazione funziona
- [ ] Search bar apre e trova risultati
- [ ] Immagini WebP si caricano
- [ ] Font si visualizzano correttamente (no FOUT/FOIT)
- [ ] Animazioni e transizioni sono smooth
- [ ] Links interni ed esterni funzionano

### 6. Verifica Google Analytics

- Apri il sito in una nuova finestra incognito
- Apri Chrome DevTools (F12)
- Tab "Network"
- Filtra per "gtag"
- Ricarica la pagina
- Verifica che gtag.js si carichi correttamente (status 200)
- Verifica che non blocchi il rendering iniziale

## Prossimi Passi Dopo il Test

**Se il miglioramento è significativo (Performance > 75)**:
- Procedere con Phase 2 o Phase 3 in base alle nuove raccomandazioni di PageSpeed

**Se il miglioramento è moderato (Performance 70-75)**:
- Analizzare quali ottimizzazioni hanno avuto più impatto
- Considerare di implementare multiple phase contemporaneamente

**Se il miglioramento è minimo (Performance < 70)**:
- Rivedere le modifiche
- Controllare se ci sono nuovi problemi introdotti
- Potrebbe essere necessario un approccio diverso (Critical CSS inline, code splitting più aggressivo)

## Note

- Assicurati di testare su una connessione mobile reale (non solo WiFi)
- Se possibile, usa anche il test "Computer" per confronto
- Considera di fare 2-3 test per ottenere una media (i risultati possono variare)
