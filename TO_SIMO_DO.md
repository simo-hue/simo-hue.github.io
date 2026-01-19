# Azioni Manuali Post-Implementazione GTM

## Data: 2026-01-16

---

## 🚀 Deployment su GitHub Pages

### 1. Commit e Push delle Modifiche
```bash
cd /Users/simo/Downloads/simo-hue.github.io
git add layouts/partials/gtm.html layouts/partials/gtm-noscript.html layouts/partials/essentials/head.html
git commit -m "feat: implement Google Tag Manager (GTM-T3VMWGJP)"
git push origin main
```

### 2. Verifica Deployment GitHub Actions
- Aprire: https://github.com/simo-hue/simo-hue.github.io/actions
- Attendere completamento workflow
- Verificare che il deploy sia andato a buon fine ✅

---

## 🏷️ Configurazione Google Tag Manager

### 1. Accedere a Google Tag Manager
- URL: https://tagmanager.google.com
- Container: **GTM-T3VMWGJP** (già implementato nel codice)

### 2. Configurare Google Analytics 4 (GA4)

> [!IMPORTANT]  
> **AZIONE CRITICA**: Google Analytics diretto è stato disattivato per evitare duplicate tracking.  
> **DEVI configurare GA4 tramite GTM**, altrimenti perderai il tracciamento analytics!

**Retrieval Measurement ID**:
1. Aprire file [`hugo.toml`](file:///Users/simo/Downloads/simo-hue.github.io/hugo.toml)
2. Cercare: `[services.googleAnalytics]`
3. Copiare il valore di `ID` (es. `G-XXXXXXXXXX`)

**a) Creare Tag GA4 in GTM:**
- Tags → New → Google Analytics: GA4 Configuration
- Configuration Tag → inserire Measurement ID copiato da `hugo.toml`
- Triggering: All Pages
- Save

**b) Nome tag:** "GA4 - All Pages"

### 3. Configurare Eventi Personalizzati

#### Scroll Tracking
- **Tag**: GA4 Event
- **Event Name**: `scroll`
- **Trigger**: Scroll Depth (25%, 50%, 75%, 90%)

#### Outbound Link Clicks
- **Tag**: GA4 Event
- **Event Name**: `click_outbound`
- **Trigger**: Click - Just Links → matches RegEx `^https?://(?!simo-hue\.github\.io)`

#### File Downloads (PDF, documenti)
- **Tag**: GA4 Event
- **Event Name**: `file_download`
- **Trigger**: Click → URL contains `.pdf`, `.doc`, `.zip`

### 4. Testare con Preview Mode
- Workspace → Preview
- Inserire URL: https://simo-hue.github.io
- Verificare che tutti i tag funzionino correttamente
- **Submit** quando tutto è OK

### 5. Pubblicare il Container
- Submit → Version Name: "Initial GTM Setup"
- Version Description: "GA4 + basic event tracking"
- **Publish**

---

## ✅ Verifica Post-Deploy

### 1. Test Tag Assistant (Chrome Extension)
- Installare: [Tag Assistant Legacy](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
- Visitare: https://simo-hue.github.io
- Verificare che GTM-T3VMWGJP sia rilevato ✅

### 2. Verifica Browser DevTools
Aprire https://simo-hue.github.io con DevTools:

**Network Tab:**
- Cercare richieste a `googletagmanager.com/gtm.js?id=GTM-T3VMWGJP` ✅

**Console:**
```javascript
// Verificare che dataLayer esista
console.log(window.dataLayer);
// Dovrebbe mostrare un array con eventi GTM
```

### 3. Google Analytics Real-Time Report
- Aprire: https://analytics.google.com
- Reports → Realtime
- Navigare su https://simo-hue.github.io
- Verificare che la visita venga tracciata in tempo reale ✅

---

## 📊 Configurazioni Avanzate (Opzionali)

### A. Microsoft Clarity / Hotjar
Se vuoi aggiungere heatmaps e session recordings:
- Creare account su Microsoft Clarity
- Ottenere Tracking Code
- GTM → New Tag → Custom HTML → incollare codice Clarity
- Trigger: All Pages
- Publish

### B. Facebook Pixel (per remarketing)
- Ottenere Pixel ID da Facebook Business Manager
- GTM → New Tag → Custom HTML
- Tag template:
```html
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{...}
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
```
- Trigger: All Pages

### C. LinkedIn Insight Tag
Simile a Facebook Pixel, se necessario per B2B marketing

---

## 🔄 Manutenzione Periodica

### Ogni 3 Mesi:
- [ ] Rivedere eventi tracciati
- [ ] Aggiungere nuovi tag se necessario
- [ ] Verificare che tutti i tag funzionino
- [ ] Cleanup di tag obsoleti

### Ogni 6 Mesi:
- [ ] Audit completo di GTM
- [ ] Verifica GDPR compliance (se applicabile)
- [ ] Review dataLayer structure

---

## 📝 Note Importanti

- ⚠️ **Privacy**: Se il sito riceve traffico EU, considera Cookie Consent Banner (es. OneTrust, Cookiebot)
- 🎯 **Performance**: Non aggiungere troppi tag, potrebbero rallentare il sito
- 🔒 **Permissions**: Solo tu (admin GTM) puoi pubblicare modifiche
- 📈 **Analytics**: Dai tempo (7-14 giorni) per raccogliere dati significativi prima di analizzare

---

## ✅ Checklist Finale

- [ ] Deploy su GitHub Pages completato
- [ ] GTM container pubblicato con GA4
- [ ] Tag Assistant rileva GTM correttamente
- [ ] Google Analytics traccia visite in real-time
- [ ] Eventi personalizzati testati in Preview mode
- [ ] DOCUMENTATION.md aggiornato con dettagli implementazione

---

## 📝 Verifica Blog Post Mattioli.OS
### Data: 2026-01-19

### 1. Verifica Contenuto
- [ ] Controllare che l'articolo "Mattioli.OS" sia visibile nella sezione Blog/Tech Projects.
- [ ] Verificare che i link a GitHub repository e Live Demo funzionino.
- [ ] Leggere l'articolo per assicurarsi che la formattazione (grassetti, liste, citazioni) sia corretta.

### 2. Immagini
- [ ] Verificare che l'immagine di copertina `cover.webp` sia visualizzata correttamente (assumendo sia già presente nella cartella). Se manca, aggiungerne una.

