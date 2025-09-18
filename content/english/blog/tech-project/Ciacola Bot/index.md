---
title: "VecioBot - Telegram Bot in Dialetto Trentino"
description: "Un bot Telegram che conversa in autentico dialetto trentino, simulando un nonno virtuale della montagna usando LLaMA 3 e Ollama"
slug: ciacola-bot
date: 2024-11-15
image: cover.jpg
draft: false
categories: ["tech projects"]
tags:
    - Telegram Bot
    - Large Language Models
    - LLaMA 3
    - Ollama
    - Dialetto Trentino
    - Python
    - Natural Language Processing
    - Local AI
    - Cultural Preservation

comments: false

links:
  - title: GitHub Repository
    description: Accedi al codice sorgente completo e alla documentazione
    website: https://github.com/simo-hue/CiacolaBot_Nonno_Trentino_Virtuale_su_Telegram.git
  - title: Telegram Bot Demo
    description: Prova il bot direttamente su Telegram
    website: #
  - title: Ollama Documentation
    description: Documentazione per l'installazione di Ollama
    website: https://ollama.ai
  - title: LLaMA 3 Model
    description: Informazioni sul modello LLaMA 3 utilizzato
    website: https://ai.meta.com/blog/meta-llama-3/
---

**VecioBot** (precedentemente CiacolaBot) è un innovativo progetto che combina intelligenza artificiale moderna con tradizione culturale locale. Questo bot Telegram è progettato per conversare in autentico **dialetto trentino**, simulando le conversazioni con un anziano abitante della montagna trentina.

Il progetto rappresenta un ponte tra tecnologia avanzata e preservazione culturale, utilizzando modelli linguistici di grandi dimensioni (LLM) per mantenere viva la ricchezza del dialetto locale.

## 🎯 Obiettivo del Progetto

L'obiettivo principale di VecioBot è quello di:
- **Preservare il dialetto trentino** attraverso la tecnologia moderna
- **Creare un'esperienza conversazionale autentica** che rifletta il calore e la saggezza degli anziani trentini
- **Dimostrare l'applicazione dell'AI locale** per scopi culturali e linguistici
- **Fornire un esempio di implementazione open-source** per progetti simili

## 🛠️ Architettura Tecnica

### Stack Tecnologico

Il progetto utilizza una combinazione di tecnologie moderne:

- **Python 3.8+**: Linguaggio di programmazione principale
- **python-telegram-bot**: Libreria per l'integrazione con Telegram
- **Ollama**: Piattaforma per eseguire LLM in locale
- **LLaMA 3**: Modello linguistico di grandi dimensioni di Meta
- **Docker** (opzionale): Per la containerizzazione

### Architettura del Sistema

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Telegram      │    │   VecioBot       │    │    Ollama       │
│   (Frontend)    │◄──►│   (Middleware)   │◄──►│   + LLaMA 3     │
│                 │    │                  │    │   (AI Engine)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

1. **Telegram Interface**: Riceve messaggi dagli utenti
2. **VecioBot Middleware**: Processa i messaggi e gestisce la logica
3. **Ollama + LLaMA 3**: Genera risposte in dialetto trentino

## 🚀 Funzionalità Principali

### Conversazione Autentica
Il bot è programmato per rispondere come un anziano trentino, utilizzando:
- **Espressioni tipiche** del dialetto locale
- **Riferimenti culturali** alla vita di montagna
- **Tono caloroso e familiare** tipico delle conversazioni locali

### Esempio di Conversazione

**Utente**: "Cosa fai oggi?"

**VecioBot**: *"Gnente de che, ho spazzà fora la stala e po' son restà a ciacolar co' la Rita. El tempo l'è proprio bel, no? Te völ vegnir sù a tor un goto de vin?"*

### Personalizzazione
- **Prompt personalizzabile** per adattare il tono del bot
- **Dizionario CSV espandibile** per aggiungere nuovi termini dialettali
- **Configurazione flessibile** per diversi contesti d'uso

## 🔧 Installazione e Setup

### Prerequisiti

1. **Sistema operativo**: Linux, macOS, o Windows
2. **Python 3.8+** installato
3. **Git** per clonare il repository
4. **Telegram Bot Token** (ottenibile da @BotFather)

### Procedura di Installazione

#### 1. Clonazione del Repository
```bash
git clone https://github.com/simo-hue/CiacolaBot_Nonno_Trentino_Virtuale_su_Telegram.git
cd CiacolaBot_Nonno_Trentino_Virtuale_su_Telegram
```

#### 2. Creazione dell'Ambiente Virtuale
```bash
python -m venv venv
source venv/bin/activate  # Su Linux/macOS
# oppure
venv\Scripts\activate     # Su Windows
```

#### 3. Installazione delle Dipendenze
```bash
pip install -r requirements.txt
```

#### 4. Configurazione di Ollama
```bash
# Installazione di Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Download del modello LLaMA 3
ollama pull llama3
```

#### 5. Configurazione del Bot
```bash
# Crea un file .env con il token del bot
echo "TELEGRAM_BOT_TOKEN=your_bot_token_here" > .env
```

#### 6. Avvio del Bot
```bash
python bot.py
```

## 💡 Caratteristiche Innovative

### AI Locale e Privacy
- **Nessun dato inviato a servizi esterni**: Tutto funziona localmente
- **Privacy garantita**: Le conversazioni rimangono sul dispositivo
- **Controllo completo**: Possibilità di modificare e personalizzare il comportamento

### Preservazione Culturale
- **Linguistica computazionale**: Applicazione dell'AI per preservare dialetti
- **Educazione culturale**: Strumento per imparare e praticare il dialetto
- **Documentazione vivente**: Raccolta di espressioni e modi di dire

### Scalabilità e Estensibilità
- **Modulare**: Facile da estendere con nuove funzionalità
- **Adattabile**: Può essere modificato per altri dialetti
- **Open Source**: Contributi della comunità benvenuti

## 📊 Performance e Requisiti

### Requisiti Hardware Minimi
- **RAM**: 8GB (consigliati 16GB per performance ottimali)
- **Storage**: 10GB di spazio libero per il modello LLaMA 3
- **CPU**: Processore moderno multi-core
- **GPU** (opzionale): Per accelerazione hardware

### Performance
- **Tempo di risposta**: 2-5 secondi per risposta
- **Throughput**: Gestione di multiple conversazioni simultanee
- **Efficienza**: Ottimizzato per ambienti con risorse limitate

## 🔮 Sviluppi Futuri

### Funzionalità Pianificate
1. **Interfaccia Web**: Dashboard per configurazione e monitoraggio
2. **Modalità Vocale**: Integrazione con speech-to-text e text-to-speech
3. **Racconto di Storie**: Narrazione di leggende e tradizioni trentine
4. **Giochi Dialettali**: Mini-giochi per imparare il dialetto
5. **Integrazione Multimodale**: Supporto per immagini e contenuti multimediali

### Miglioramenti Tecnici
1. **Fine-tuning del Modello**: Training specifico su corpus dialettali
2. **Ottimizzazione Performance**: Riduzione dei tempi di risposta
3. **Supporto Multi-dialetto**: Estensione ad altri dialetti italiani
4. **Analytics**: Metriche di utilizzo e sentiment analysis

## 🌟 Impatto e Riconoscimenti

### Impatto Culturale
- **Preservazione digitale** del patrimonio linguistico trentino
- **Ponte generazionale** tra tradizione e innovazione tecnologica
- **Strumento educativo** per le nuove generazioni

### Riconoscimenti Tecnici
- **Open Source**: Contributo alla comunità del software libero
- **Innovazione**: Applicazione creativa dell'AI per scopi culturali
- **Documentazione**: Esempio di best practices per progetti AI locali

## 🤝 Contributi e Community

### Come Contribuire
1. **Segnalazione Bug**: Utilizza le GitHub Issues
2. **Nuove Funzionalità**: Proponi miglioramenti tramite Pull Request
3. **Espansione Dialettale**: Contribuisci con nuovi termini e espressioni
4. **Documentazione**: Migliora la documentazione esistente

### Community
- **Discord/Telegram**: Gruppo di discussione per sviluppatori
- **Workshop**: Eventi per condividere conoscenze
- **Collaborazioni**: Partnership con istituzioni culturali locali

## 📝 Conclusioni

VecioBot rappresenta un esempio eccellente di come la tecnologia moderna possa essere utilizzata per preservare e celebrare la cultura locale. Il progetto dimostra che l'intelligenza artificiale non deve necessariamente essere centralizzata o commerciale, ma può essere un strumento potente per la preservazione culturale e l'innovazione locale.

L'utilizzo di LLM locali come LLaMA 3 attraverso Ollama offre una soluzione privacy-friendly e completamente controllabile, mentre l'implementazione open-source garantisce trasparenza e possibilità di contributi dalla comunità.

**VecioBot non è solo un bot: è un custode digitale della tradizione trentina.**

---

*Questo progetto è sviluppato con passione per la cultura trentina e l'innovazione tecnologica. Ogni contributo è benvenuto per mantenere viva questa tradizione nel mondo digitale.*