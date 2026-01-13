# DOCUMENTATION - Timeline Card Modal Implementation

**Data:** 13 Gennaio 2026  
**Funzionalità:** Card Timeline Cliccabili con Modale

---

## Panoramica

Implementata una funzionalità che rende le card della timeline della sezione "My Journey" cliccabili su dispositivi mobili, aprendo una modale con effetto glassmorphism per migliorare la leggibilità del contenuto.

## Problema Risolto

Le card della timeline erano troppo piccole su mobile, rendendo difficile la lettura completa del contenuto (testo troncato con `line-clamp-4`). La soluzione implementata permette di visualizzare tutti i dettagli in una modale elegante e moderna.

## File Modificati

### 1. `/layouts/partials/components/timeline.html`

#### Modifiche alle Card
- **Aggiunta classe:** `timeline-card` per la selezione JavaScript
- **Aggiunto cursore:** `cursor-pointer` per indicare cliccabilità
- **Aggiunti attributi data:**
  - `data-date`: data dell'evento
  - `data-title`: titolo
  - `data-organization`: organizzazione
  - `data-description`: descrizione completa
  - `data-icon`: classe icona FontAwesome
  - `data-tags`: tags separati da pipe `|`

#### Struttura Modale Aggiunta
- **Container modale:** posizionamento fisso full-screen con `z-50`
- **Backdrop:** sfondo nero semi-trasparente con `backdrop-blur-lg` (effetto glassmorphism)
- **Card modale:** 
  - Layout centrato, responsive (`max-w-2xl`)
  - Altezza massima `90vh` con scroll verticale
  - Background bianco/dark mode
  - Border radius `rounded-2xl`
  - Shadow elevata
- **Elementi UI:**
  - Pulsante chiusura (X) in alto a destra
  - Icona circolare centrata in alto
  - Header con data, titolo, organizzazione
  - Descrizione completa senza troncature
  - Tags in stile pill centrati
- **Animazioni:** opacity e scale per apertura/chiusura smooth

### 2. `/assets/js/main.js`

#### Funzionalità JavaScript Aggiunte

**Event Listener per Apertura Modale:**
- Click su `.timeline-card` apre la modale
- Estrazione dati dagli attributi `data-*`
- **Decodifica delle classi icona** con `decodeURIComponent()` per gestire gli spazi URL-encoded
- Popolamento dinamico degli elementi della modale
- Rendering dinamico dei tags
- **Applicazione effetto blur al contenuto di sfondo** (`filter: blur(3px)`) - applicato a tutti i figli diretti del body tranne la modale
- Animazione di apertura con fade-in e scale
- Blocco dello scroll del body quando la modale è aperta

### Modifiche CSS e HTML
1.  **Reset HTML/Body:**
    - Impostati `margin-bottom: 0` e `padding-bottom: 0` su `html` e `body`.
    - Impostata `min-height: 100vh`.
2.  **Footer Cleanup (Aggiornato):**
    - Padding inferiore azzerato: `pb-0`.
    - Container copyright modificato da `p` a `div` per evitare nesting invalido.
    - Reset forzato su eventuali paragrafi interni: `[&>p]:mb-0` e `[&>p]:leading-none`.
3.  **Safe-guard:**
    - Regola per nascondere div iniettati vuoti.

**Event Listener per Chiusura Modale:**
- Click sul pulsante X
- Click sul backdrop (area fuori dalla card)
- Pressione del tasto ESC
- **Rimozione effetto blur dal contenuto di sfondo**
- Animazione di chiusura con fade-out e scale
- Ripristino dello scroll del body

**Funzione `closeModal()`:**
- Gestisce l'animazione di chiusura
- Timeout di 300ms per completare l'animazione CSS
- Rimuove la classe `flex` e aggiunge `hidden` dopo l'animazione

---

## Campi Estesi nella Modale (NEW)

### Campi Opzionali Disponibili

La modale supporta tre campi aggiuntivi **opzionali** definibili in `data/timeline.yml`:

#### 1. Extended Description
```yaml
extended_description: |
  Testo multi-paragrafo più dettagliato.
  Supporta multiple righe e formattazione.
```
- Se presente, sostituisce la descrizione breve nella modale
- Supporta testo multi-paragrafo con `whitespace-pre-line`
- Ideale per fornire contesto e dettagli aggiuntivi

#### 2. Achievements
```yaml
achievements:
  - "Primo traguardo raggiunto"
  - "Secondo risultato importante"
  - "Terzo achievement"
```
- Array di stringhe rappresentanti i traguardi raggiunti
- Renderizzati come lista con icone checkmark verdi
- Background grigio chiaro per evidenziare ogni item
- Sezione con titolo "Key Achievements" e icona trofeo

#### 3. Links
```yaml
links:
  - label: "Nome Link"
    url: "https://example.com"
  - label: "Altro Link"
    url: "https://example2.com"
```
- Array di oggetti con `label` e `url`
- Renderizzati come bottoni styled con icona external link
- Apertura in nuova tab con `target="_blank"`
- Hover effects con cambio colore
- Sezione con titolo "Related Links" e icona link

### Rendering Condizionale

- Le sezioni sono **nascoste di default** con classe `hidden`
- JavaScript verifica la presenza di dati prima di renderizzare
- Se un campo non è presente o è vuoto, la sua sezione non viene mostrata
- Backward compatibility: card senza campi estesi funzionano normalmente

### Styling

- **Achievements**: cards con sfondo `bg-gray-50 dark:bg-darkmode-light`, icone `fa-check-circle` verdi
- **Links**: bottoni outlined blu con hover fill, icona `fa-arrow-up-right-from-square`
- **Dark mode**: supporto completo per tutti i nuovi elementi


## Design e UX

### Fix Stacking Context (Importante)
La modale viene automaticamente spostata nel `body` tramite JavaScript all'inizializzazione:
```javascript
document.body.appendChild(modal);
```
Questo risolve il problema dello stacking context, evitando che la modale rimanga dietro altri elementi della pagina. Senza questo fix, la modale resterebbe dentro il componente timeline con z-index limitato.

### Glassmorphism
L'effetto glassmorphism è ottenuto con:
- `backdrop-blur-lg`: sfocatura dello sfondo
- `bg-black/50`: overlay semi-trasparente
- Crea un effetto moderno e premium simile a iOS

### Responsive Design
- **Mobile:** padding ridotto (`p-4`), font size ottimizzato
- **Desktop:** padding aumentato (`md:p-8`), card più ampia

### Accessibilità
- Chiusura con tasto ESC
- Prevenzione scroll del body quando modale aperta
- Indicatore visivo del cursore pointer sulle card
- Hover effect sulle card (`hover:scale-[1.02]`)

### Animazioni
- **Apertura:** fade-in (opacity 0→1) + scale (95%→100%)
- **Chiusura:** fade-out (opacity 1→0) + scale (100%→95%)
- **Durata:** 300ms per transizioni fluide

## Dark Mode
Tutti gli elementi supportano automaticamente il dark mode con classi Tailwind:
- `dark:bg-darkmode-body`: background modale
- `dark:bg-darkmode-light`: background pulsante chiusura
- `dark:text-white`: testi
- `dark:bg-gray-700`: tags
- `dark:text-gray-300`: testi secondari

## Testing Raccomandato

1. **Desktop:** Verificare funzionalità su browser desktop (Chrome, Firefox, Safari)
2. **Mobile:** Testare su dispositivi reali o DevTools con emulazione mobile
3. **Dark Mode:** Verificare aspetto in entrambe le modalità
4. **Accessibilità:** Testare chiusura con ESC, click backdrop, scroll bloccato

## Note Tecniche

- Il componente è completamente autonomo e non richiede librerie esterne
- Utilizza Vanilla JavaScript ES6+
- Compatibile con Tailwind CSS v3+
- Supporta FontAwesome per le icone
- La modale viene renderizzata una sola volta nel DOM e riutilizzata

---

**Implementato da:** Antigravity AI Assistant  
**Versione Hugo:** Compatible with current setup

---

# DOCUMENTATION - Categories List View Implementation

**Data:** 13 Gennaio 2026  
**Funzionalità:** Visualizzazione Elenco Categorie

---

## Panoramica

Implementata una pagina di elenco categorie che visualizza tutte le categorie del blog con descrizioni, conteggi dei post e link. La pagina `/categories/` ora mostra un'interfaccia utile invece di essere vuota.

## Problema Risolto

La pagina `/categories/` era completamente vuota perché il template era progettato solo per mostrare i post all'interno di una categoria specifica, non per elencare tutte le categorie disponibili. Ora il template rileva automaticamente il contesto e mostra l'elenco appropriato.

## File Modificati

### `/layouts/categories/list.html`

#### Logica di Rilevamento Contesto
Il template utilizza la variabile Hugo `.Data.Terms` per rilevare se si sta visualizzando:
- **Pagina principale categorie** (`/categories/`): mostra tutte le categorie
- **Pagina categoria specifica** (es. `/categories/books/`): mostra i post di quella categoria

```go
{{ if .Data.Terms }}
  <!-- Mostra tutte le categorie -->
{{ else }}
  <!-- Mostra post della categoria specifica -->
{{ end }}
```

#### Layout Griglia Categorie
Quando si visualizza `/categories/`, il template genera:
- **Grid responsive**: 2 colonne su schermi medi+ (`md:col-6`)
- **Card per categoria** con:
  - Titolo cliccabile
  - Descrizione in italiano
  - Conteggio post (con pluralizzazione corretta: "articolo"/"articoli")
  - Link "Visualizza tutti →"
- **Ordinamento**: per conteggio (categorie con più post appaiono prima)

#### Descrizioni Categorie
Le seguenti descrizioni sono state aggiunte per ogni categoria:

| Categoria | Descrizione |
|-----------|------------|
| Books | Recensioni e riflessioni sui libri che ho letto |
| Thoughts | Pensieri e riflessioni personali sulla vita e la crescita personale |
| Passions | Le mie passioni: montagna, moto, sci e molto altro |
| Projects | Progetti creativi e personali che ho realizzato |
| Tech Projects | Progetti tecnici e di programmazione |
| Publications | Pubblicazioni scientifiche e articoli accademici |
| Experiences | Esperienze significative e viaggi memorabili |

#### Styling e UX
Il design è stato aggiornato per corrispondere allo stile delle card presenti nella pagina "About":

| Categoria | Colore | Icona | Classe Base |
|-----------|--------|-------|-------------|
| Books | Orange | 📚 | `bg-orange-50` |
| Thoughts | Purple | 💭 | `bg-purple-50` |
| Passions | Red | ❤️ | `bg-red-50` |
| Projects | Gray | 🛠️ | `bg-gray-50` |
| Tech Projects | Indigo | 💻 | `bg-indigo-50` |
| Publications | Yellow | 📄 | `bg-yellow-50` |
| Experiences | Green | 🌍 | `bg-green-50` |

Caratteristiche visuali:
- **Forma**: `rounded-3xl` per angoli molto arrotondati
- **Colori**: Sfondi colorati tenui (`-50`) che diventano più scuri (`-100`) all'hover
- **Dark Mode**: 
  - Standard: `dark:bg-{color}-900/10` (colori traslucidi scuri)
  - Projects (Gray): `dark:bg-white/5` (bianco/grigio molto trasparente per omogeneità)
- **Animazioni**: `transition-transform` e `translate-x-1` sul titolo all'hover
- **Icona Freccia**: Appare (`opacity-100`) solo all'hover

## Compatibilità

- **Backward compatible**: le pagine di categoria specifiche funzionano esattamente come prima
- **Nessuna modifica richiesta** ai file di contenuto esistenti
- **Responsive**: funziona correttamente su tutti i dispositivi
- **Multilingua ready**: le descrizioni possono essere facilmente tradotte

## Comportamento

### Pagina `/categories/`
1. Header "Categories" con breadcrumb
2. Grid di card categorie nel contenuto principale (col-8)
3. Widget categorie nella sidebar (col-4)
4. Ogni card è completamente cliccabile

### Pagina `/categories/[nome-categoria]/`
1. Header con nome categoria
2. Lista post in formato card (2 colonne)
3. Paginazione se necessaria
4. Widget categorie nella sidebar

## Testing Completato

✅ Pagina principale categorie visualizza tutte le categorie  
✅ Descrizioni visualizzate correttamente  
✅ Conteggi post accurati  
✅ Link funzionanti  
✅ Pagine categorie specifiche ancora funzionanti  
✅ Layout responsive  
✅ Dark mode supportato  

---

**Implementato da:** Antigravity AI Assistant  
**Versione Hugo:** Compatible with current setup

# DOCUMENTATION - Update Publication Article

**Data:** 13 Gennaio 2026
**Funzionalità:** Aggiornamento Articolo Pubblicazione "LLM Tourism Mobility Predictor"

---

## Panoramica

L'articolo "LLM Tourism Mobility Predictor" è stato aggiornato per riflettere fedelmente il contenuto del paper ufficiale "Understanding and Predicting Tourist Behavior through Large Language Models".

## Modifiche Apportate

### `/content/english/blog/publication/llm-tourism-mobility-predictor/index.md`

- **Titolo aggiornato:** "Understanding and Predicting Tourist Behavior through Large Language Models".
- **Abstract:** Sostituito con l'abstract originale del paper.
- **Sezioni:** Aggiunte sezioni dettagliate per "Methodology", "Experiments" (con setup e risultati specifici), e "Conclusion", estratte direttamente dal PDF.
- **Citazione:** Aggiornato il blocco BibTeX con i dettagli corretti del paper.
- **Autori:** Aggiunta lista autori nel testo (Anna Dalla Vecchia, Simone Mattioli, Sara Migliorini, Elisa Quintarelli).

---

**Implementato da:** Antigravity AI Assistant

---

# DOCUMENTATION - Image Optimization and Lightbox

**Data:** 13 Gennaio 2026
**Funzionalità:** Ottimizzazione Immagini e Lightbox Interattivo

---

## Panoramica

È stato implementato un sistema completo per la gestione delle immagini che modernizza l'intera esperienza visiva del sito. Le immagini sono ora caricate in modo più efficiente (WebP, Responsive Sizing) e quelle all'interno degli articoli sono cliccabili e visualizzabili in una lightbox.

## Descrizione Tecnica

### 1. Partial `layouts/partials/image.html`
Questo file sovrascrive il partial di default del tema e introduce:
- **Conversione WebP**: Genera automaticamente versioni WebP delle immagini caricate.
- **Responsive Images (`srcset`)**: Crea varianti a 480px, 800px e 1200px. Il browser scarica solo quella necessaria.
- **Lazy Loading**: Attributo `loading="lazy"` aggiunto di default.
- **Supporto Lightbox**: Opzione `Lightbox` (bool) che avvolge l'immagine in un anchor tag compatibile con `glightbox`.

### 2. Markdown Render Hook `layouts/_default/_markup/render-image.html`
Intercetta tutte le immagini inserite nei file Markdown (es. `![Alt](image.jpg "Title")`) e:
- Utilizza il nuovo partial `image.html`.
- Attiva automaticamente la **Lightbox** (`Lightbox: true`).
- Aggiunge classi CSS per **bordi arrotondati**, **ombreggiature** (`shadow-lg`), e un leggero effetto **zoom on hover**.
- Renderizza il Titolo dell'immagine come didascalia (`figcaption`).

### 3. Inizializzazione JavaScript (`assets/js/main.js`)
È stato aggiunto il codice per inizializzare `GLightbox` sulla classe `.glightbox`:
```javascript
const lightbox = GLightbox({
    selector: ".glightbox",
    touchNavigation: true,
    loop: true,
    autoplayVideos: true
});
```

## Esperienza Utente (UX)

- **Blog Cards**: Le immagini nelle card rimangono statiche (senza lightbox) per non interferire con il link all'articolo, ma beneficiano dell'ottimizzazione WebP/Srcset.
- **Articoli**: Le immagini nel contenuto sono presentate come "figure" con design curato. Cliccando su un'immagine, questa si apre a tutto schermo permettendo lo zoom.

## File Modificati/Creati
- `layouts/partials/image.html` (NEW)
- `layouts/_default/_markup/render-image.html` (NEW)
- `assets/js/main.js` (MODIFIED)
