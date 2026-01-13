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
