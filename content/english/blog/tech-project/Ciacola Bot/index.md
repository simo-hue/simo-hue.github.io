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
---

**VecioBot** (formerly CiacolaBot) is an innovative project that combines modern artificial intelligence with local cultural tradition. This Telegram bot is designed to converse in authentic **Trentino dialect**, simulating conversations with an elderly Trentino mountain resident.

The project represents a bridge between advanced technology and cultural preservation, using large-scale linguistic models (LLMs) to preserve the richness of the local dialect.

## 🎯 Project Goal

VecioBot's main goal is to:
- **Preserve the Trentino dialect** through modern technology
- **Create an authentic conversational experience** that reflects the warmth and wisdom of Trentino elders
- **Demonstrate the application of local AI** for cultural and linguistic purposes
- **Provide an open-source implementation example** for similar projects

## 🛠️ Technical Architecture

### Technology Stack

The project uses a combination of modern technologies:

- **Python 3.8+**: Main programming language
- **python-telegram-bot**: Library for Telegram integration
- **Ollama**: Platform for running LLM locally
- **LLaMA 3**: Meta's large language model
- **Docker** (optional): For containerization

### Architecture System

```
┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐
│ Telegram │ │ VecioBot │ │ Ollama │
│ (Frontend) │◄──►│ (Middleware) │◄──►│ + LLaMA 3 │
│ │ │ │ │ (AI Engine) │
└─────────────────┘ └──────────────────┘ └────────────────┘
```

1. **Telegram Interface**: Receives messages from users
2. **VecioBot Middleware**: Processes messages and manages the logic
3. **Ollama + LLaMA 3**: Generates responses in the Trentino dialect

## 🚀 Main Features

### Authentic Conversation
The bot is programmed to respond like an elderly Trentino resident, using:
- **Typical expressions** of the local dialect
- **Cultural references** to mountain life
- **Warm and familiar tone** typical of local conversations

### Sample Conversation

**User**: "What are you doing today?"

**VecioBot**: *"No big deal, I swept out the stable and now I'm left to chat with Rita. The weather is really nice, isn't it? Do you want to come up and get a glass of wine?"*

### Customization
- **Customizable prompt** to adapt the bot's tone
- **Expandable CSV dictionary** to add new dialect terms
- **Flexible configuration** for different use cases

## 🔧 Installation and Setup

### Prerequisites

1. **Operating System**: Linux, macOS, or Windows
2. **Python 3.8+** installed
3. **Git** to clone the repository
4. **Telegram Bot Token** (obtainable from @BotFather)

### Installation Procedure

#### 1. Cloning Repository
```bash
git clone https://github.com/simo-hue/CiacolaBot_Nonno_Trentino_Virtuale_su_Telegram.git
cd CiacolaBot_Nonno_Trentino_Virtuale_su_Telegram
```

#### 2. Creating the Virtual Environment
```bash
python -m venv venv
source venv/bin/activate # On Linux/macOS
# or
venv\Scripts\activate # On Windows
```

#### 3. Installing Dependencies
```bash
pip install -r requirements.txt
```

#### 4. Configuring Ollama
```bash
# Installing Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Download the LLaMA 3 template
ollama pull llama3
```

#### 5. Bot Configuration
```bash
# Create a .env file with the bot token
echo "TELEGRAM_BOT_TOKEN=your_bot_token_here" > .env
```

#### 6. Starting the Bot
```bash
python bot.py
```

## 💡 Innovative Features

### Local AI and Privacy
- **No data sent to external services**: Everything runs locally
- **Privacy guaranteed**: Conversations remain on the device
- **Complete control**: Ability to modify and customize behavior

### Cultural Preservation
- **Computational linguistics**: Applying AI to preserve dialects
- **Cultural education**: Tool for learning and practicing dialects
- **Living Documentation**: Collection of expressions and idioms

### Scalability and Extensibility
- **Modular**: Easy to extend with new features
- **Adaptable**: Can be modified for other dialects
- **Open Source**: Community contributions welcome

## 📊 Performance and Requirements

### Minimum Hardware Requirements
- **RAM**: 8GB (16GB recommended for optimal performance)
- **Storage**: 10GB of free space for the LLaMA 3 model
- **CPU**: Modern multi-core processor
- **GPU** (optional): For hardware acceleration

### Performance
- **Response Time**: 2-5 seconds per response
- **Throughput**: Handles multiple simultaneous conversations
- **Efficiency**: Optimized for resource-constrained environments

## 🔮 Future Developments

### Planned Features
1. **Web Interface**: Dashboard for configuration and monitoringio
2. **Voice Mode**: Integration with speech-to-text and text-to-speech
3. **Storytelling**: Narration of Trentino legends and traditions
4. **Dialect Games**: Mini-games for learning dialect
5. **Multimodal Integration**: Support for images and multimedia content

### Technical Improvements
1. **Model Fine-tuning**: Specific training on dialect corpuses
2. **Performance Optimization**: Reduction of response times
3. **Multi-dialect Support**: Extension to other Italian dialects
4. **Analytics**: Usage metrics and sentiment analysis

## 🌟 Impact and Awards

### Cultural Impact
- **Digital preservation** of the Trentino linguistic heritage
- **Generational bridge** between tradition and technological innovation
- **Educational tool** for new generations

### Technical Awards
- **Open Source**: Contribution to the free software community
- **Innovation**: Creative application of AI for cultural purposes
- **Documentation**: Example of best practices for local AI projects

## 🤝 Contributions and Community

### How to Contribute
1. **Bug Report**: Use GitHub Issues
2. **New Features**: Propose improvements via Pull Request
3. **Dialect Expansion**: Contribute new terms and expressions
4. **Documentation**: Improve existing documentation

### Community
- **Discord/Telegram**: Discussion group for developers
- **Workshop**: Events for sharing knowledge
- **Collaborations**: Partnerships with local cultural institutions

## 📝 Conclusions

VecioBot is an excellent example of how modern technology can be used to preserve and celebrate local culture. The project demonstrates that artificial intelligence doesn't have to be centralized or commercial, but can be a powerful tool for cultural preservation and local innovation.

Using local LLMs like LLaMA 3 through Ollama offers a privacy-friendly and fully controllable solution, while the open-source implementation guarantees transparency and the possibility of community contributions.

**VecioBot is not just a bot: it's a digital guardian of Trentino's tradition.**

---

*This project is developed with a passion for Trentino culture and technological innovation. Every contribution is welcome to keep this tradition alive in the digital world.*