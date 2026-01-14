# To Do List

## Deploy GitHub Actions Fix

**Data:** 14 Gennaio 2026

### Azioni Manuali Richieste

1. **Commit e Push delle Modifiche**
   
   Esegui i seguenti comandi per committare e pushare tutti i fix:
   
   ```bash
   # Stage tutti i file modificati
   git add layouts/partials/essentials/head.html
   git add content/english/blog/experience/Volunteering\ Activity\ in\ Brazil/index.md
   git add content/english/blog/thought/live\ the\ dream/index.md
   git add content/english/blog/thought/gratitude/index.md
   git add content/english/blog/thought/The\ Star\ Counter/index.md
   git add content/english/blog/thought/The\ Star\ Counter/it.md
   git add content/english/blog/project/mountainfaunalover/index.md
   git add content/english/blog/thought/Daniele\ Cassioli/index.md
   git add content/english/blog/project/simo\'s\ Diary/index.md
   git add content/english/blog/experience/Sicily/index.md
   git add content/english/blog/passions/car/index.md
   git add content/english/blog/experience/Basket\ in\ Carrozzina/index.md
   git add content/english/blog/tech-project/hackathonEPICURE2024/index.md
   
   # Commit con messaggio descrittivo
   git commit -m "fix: resolve GitHub Actions build errors (SEO recursion + YouTube shortcodes)"
   
   # Push su GitHub
   git push origin main
   ```

2. **Monitorare la Build su GitHub Actions**
   
   - Vai su: `https://github.com/simo-hue/simo-hue.github.io/actions`
   - Verifica che la build completi con successo
   - Tempo stimato: ~2-3 minuti
   - **Successo atteso**: Build completata senza timeout

3. **Verificare il Deploy**
   
   - Vai su: `https://simo-hue.github.io/`
   - Verifica che il sito si carichi correttamente
   - Testa alcune pagine con video YouTube (es. Brazil article, Sicily, etc.)
   - Verifica che i video si carichino correttamente

### Riepilogo Fix Applicati

✅ **Fix 1**: Comentato partial `basic-seo.html` problematico  
✅ **Fix 2**: Corretti 12 file con shortcode YouTube malformati  
✅ **Verifica locale**: Build completata in 1.8s con 471 pagine  

### Note Importanti

- **Build locale testata**: ✅ 471 pagine in 1.8 secondi
- **Entrambi i fix sono necessari** per il successo della build
- **Nessun impatto SEO negativo** - Schema.org structured data già completi
