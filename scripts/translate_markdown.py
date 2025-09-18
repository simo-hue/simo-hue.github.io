#!/usr/bin/env python3
"""
Hugo Automatic Translation Script
Traduce automaticamente i contenuti Markdown da inglese ad altre lingue
"""

import os
import re
import hashlib
import frontmatter
import shutil
from pathlib import Path
from typing import Dict, Tuple, Optional
import logging

# Configurazione logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

try:
    from googletrans import Translator
    from langdetect import detect, DetectorFactory
    DetectorFactory.seed = 0  # Per risultati consistenti
    TRANSLATION_AVAILABLE = True
except ImportError:
    logger.warning("googletrans e/o langdetect non disponibili. Installare con: pip install googletrans==4.0.0-rc1 langdetect")
    TRANSLATION_AVAILABLE = False

# Configurazione
SUPPORTED_LANGUAGES = {
    'en': 'english',
    'it': 'italian',
    'fr': 'french',
    'es': 'spanish'
}

SOURCE_LANG = 'en'
SOURCE_DIR = 'english'
BASE_PATH = Path('content')

class HugoTranslator:
    def __init__(self):
        if TRANSLATION_AVAILABLE:
            self.translator = Translator()
        self.processed_files = set()

    def get_content_hash(self, content: str) -> str:
        """Genera hash del contenuto per evitare ritraduzioni inutili"""
        return hashlib.sha256(content.encode('utf-8')).hexdigest()[:12]

    def mask_protected_content(self, text: str) -> Tuple[str, Dict[str, str]]:
        """Protegge elementi che non devono essere tradotti"""
        placeholders = {}
        placeholder_id = 0

        def create_placeholder(match):
            nonlocal placeholder_id
            placeholder = f"PROTECTED{placeholder_id:04d}PROTECTED"
            placeholders[placeholder] = match.group(0)
            placeholder_id += 1
            return placeholder

        # Protegge code blocks
        text = re.sub(r'```[\s\S]*?```', create_placeholder, text)

        # Protegge codice inline
        text = re.sub(r'`[^`\n]+`', create_placeholder, text)

        # Protegge shortcodes Hugo
        text = re.sub(r'{{[^}]+}}', create_placeholder, text)

        # Protegge link markdown completi
        text = re.sub(r'!\[[^\]]*\]\([^)]+\)', create_placeholder, text)
        text = re.sub(r'\[[^\]]+\]\([^)]+\)', create_placeholder, text)

        # Protegge URL standalone
        text = re.sub(r'https?://[^\s]+', create_placeholder, text)

        # Protegge tag HTML
        text = re.sub(r'<[^>]+>', create_placeholder, text)

        return text, placeholders

    def unmask_protected_content(self, text: str, placeholders: Dict[str, str]) -> str:
        """Ripristina gli elementi protetti"""
        for placeholder, original in placeholders.items():
            text = text.replace(placeholder, original)
        return text

    def translate_text(self, text: str, target_lang: str) -> Optional[str]:
        """Traduce il testo preservando elementi protetti"""
        if not TRANSLATION_AVAILABLE:
            logger.warning(f"Traduzione non disponibile. Restituendo testo originale.")
            return text

        if not text.strip():
            return text

        try:
            # Protegge contenuto speciale
            masked_text, placeholders = self.mask_protected_content(text)

            # Traduce solo se c'è contenuto significativo
            if len(masked_text.strip()) < 10:
                return text

            # Esegue traduzione
            result = self.translator.translate(masked_text, src=SOURCE_LANG, dest=target_lang)
            translated = result.text if result and result.text else masked_text

            # Ripristina contenuto protetto
            translated = self.unmask_protected_content(translated, placeholders)

            logger.info(f"✓ Tradotto in {target_lang}: {len(text)} → {len(translated)} caratteri")
            return translated

        except Exception as e:
            logger.error(f"Errore nella traduzione in {target_lang}: {e}")
            return text

    def translate_frontmatter(self, fm_data: dict, target_lang: str) -> dict:
        """Traduce selettivamente i campi del frontmatter"""
        translatable_fields = ['title', 'description', 'meta_title', 'meta_description']
        translated_data = fm_data.copy()

        for field in translatable_fields:
            if field in fm_data and fm_data[field]:
                original_value = str(fm_data[field])
                translated_value = self.translate_text(original_value, target_lang)
                if translated_value and translated_value != original_value:
                    translated_data[field] = translated_value
                    logger.info(f"✓ Tradotto campo '{field}' in {target_lang}")

        return translated_data

    def should_translate_file(self, source_file: Path, target_file: Path, content_hash: str) -> bool:
        """Determina se il file deve essere tradotto"""
        if not target_file.exists():
            return True

        try:
            # Controlla hash nel file esistente
            with open(target_file, 'r', encoding='utf-8') as f:
                existing_content = f.read()
                if f'<!-- hash: {content_hash} -->' in existing_content:
                    logger.info(f"⏭️  File già aggiornato: {target_file.relative_to(BASE_PATH)}")
                    return False
        except Exception:
            pass

        return True

    def process_markdown_file(self, source_file: Path):
        """Processa un singolo file Markdown"""
        logger.info(f"🔍 Processando: {source_file.relative_to(BASE_PATH)}")

        try:
            # Legge il file sorgente
            with open(source_file, 'r', encoding='utf-8') as f:
                post = frontmatter.load(f)

            content_hash = self.get_content_hash(str(post.content))

            # Determina percorso relativo dalla directory inglese
            relative_path = source_file.relative_to(BASE_PATH / SOURCE_DIR)

            # Traduce in ogni lingua target
            for lang_code, lang_dir in SUPPORTED_LANGUAGES.items():
                if lang_code == SOURCE_LANG:
                    continue

                target_file = BASE_PATH / lang_dir / relative_path

                if not self.should_translate_file(source_file, target_file, content_hash):
                    continue

                # Crea directory se necessaria
                target_file.parent.mkdir(parents=True, exist_ok=True)

                logger.info(f"🌐 Traducendo in {lang_code}: {target_file.relative_to(BASE_PATH)}")

                # Traduce frontmatter
                translated_metadata = self.translate_frontmatter(post.metadata, lang_code)

                # Traduce contenuto
                translated_content = self.translate_text(post.content, lang_code)

                # Aggiunge hash per tracking
                hash_comment = f"<!-- hash: {content_hash} -->\n"
                translated_content = hash_comment + translated_content

                # Salva file tradotto
                translated_post = frontmatter.Post(translated_content, **translated_metadata)

                with open(target_file, 'w', encoding='utf-8') as f:
                    f.write(frontmatter.dumps(translated_post))

                logger.info(f"✅ Salvato: {target_file.relative_to(BASE_PATH)}")

        except Exception as e:
            logger.error(f"❌ Errore processando {source_file}: {e}")

    def process_directory(self):
        """Processa tutti i file Markdown nella directory inglese"""
        source_path = BASE_PATH / SOURCE_DIR

        if not source_path.exists():
            logger.error(f"❌ Directory sorgente non trovata: {source_path}")
            return

        markdown_files = list(source_path.rglob('*.md'))
        logger.info(f"🚀 Trovati {len(markdown_files)} file Markdown da processare")

        for md_file in markdown_files:
            # Salta file di configurazione
            if md_file.name.startswith('_'):
                continue

            self.process_markdown_file(md_file)

        logger.info(f"🎉 Traduzione completata! Processati {len(markdown_files)} file")

def main():
    """Funzione principale"""
    logger.info("🌍 Avvio traduzione automatica Hugo...")

    if not TRANSLATION_AVAILABLE:
        logger.error("❌ Librerie di traduzione non disponibili!")
        logger.info("💡 Installa con: pip install googletrans==4.0.0-rc1 langdetect")
        return

    # Cambia alla directory del progetto se necessario
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    if project_root.exists():
        os.chdir(project_root)
        logger.info(f"📁 Directory di lavoro: {project_root}")

    translator = HugoTranslator()
    translator.process_directory()

if __name__ == '__main__':
    main()