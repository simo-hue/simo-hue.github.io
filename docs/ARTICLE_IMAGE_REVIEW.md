# Article image review — 12 October 2026

Completed the “Live the dream” pilot first, then reviewed every current English blog article. Disabled languages and archived content under `unused_content/` are outside the published site and were not migrated.

## Results

- 67 articles reviewed: 58 published and 9 drafts. Drafts remain drafts.
- All 67 received individual desktop (1440px) and mobile (390px) browser captures and visual review: 134 checks.
- 10 articles contain 54 body images. Seven articles now use selective wrapping (16 aligned figures); diagrams, groups, closing images, and photo sequences retain centered layouts.
- All article routes returned HTTP 200. No broken article images, horizontal overflow, image overflow, or heading/float collisions were found.
- Covers preserve aspect ratio at a maximum image height of 32rem. The initial review found 15 covers taller than 650px, including one at approximately 1481px; those oversized layouts are resolved.
- All four placement presets passed focused tests at 320, 390, 767, 768, 1024, and 1440px, including captions, heading clearance, the legacy inline fallback, and external image URLs.
- All 10 illustrated articles also passed narrow-screen (320px) and tablet (768px) overflow checks in dark mode.
- Verified the five corrected pilot photos and opening/closing the existing lightbox with Escape.
- Rechecked “Don’t Brag” in desktop/mobile browsers after adding the dark diagram backing; all four diagrams visually inspected.
- Final `npm run build` passed (601 pages) and `git diff --check` passed. Hugo reports its existing `imaging.quality` deprecation warning.

## Evidence and limits

The local [screenshot index](../.tmp/article-layout-review/index.html) links the individual full-page captures. [Browser measurements](../.tmp/article-layout-review/results.json), [focused verification output](../.tmp/article-layout-review/verify.log), and [build output](../.tmp/article-layout-review/build-final.log) are saved beside them. These local QA artifacts are ignored by Git and are not published.

Full-page captures use light mode; the pilot was also visually checked in dark mode. Automated checks use local resources and block third-party network requests, so external video playback and external links were not audited. This was an image-layout review, not an editorial/factual review of article prose. Existing empty articles and placeholder drafts were preserved.

## Per-article record

| Article | State | Desktop / mobile | Image decision |
| --- | --- | --- | --- |
| [28 Digital Master School: Kick-Off in Tallinn](https://simo-hue.github.io/blog/experiences/28-digital-master-school-kick-off-tallinn/) | Published | Pass / pass | No article images: text layout reviewed; no image placement needed. |
| [Crossing a country's border walking](https://simo-hue.github.io/blog/experiences/crossing-a-countrys-border-walking/) | Published | Pass / pass | No article images: text layout reviewed; no image placement needed. Existing empty article body preserved. |
| [Building Ping Pong Counter across iPhone, Watch and the Home Screen](https://simo-hue.github.io/blog/tech-projects/ping-pong-counter/) | Draft | Pass / pass | No article images: text layout reviewed; no image placement needed. |
| [Evolve: two backends, one UI, and a sync engine that kept lying about it](https://simo-hue.github.io/blog/tech-projects/evolve/) | Draft | Pass / pass | No article images: text layout reviewed; no image placement needed. |
| [Warranties Vault: a spec, a script-generated project, and a hand-written ZIP](https://simo-hue.github.io/blog/tech-projects/warranties-vault/) | Draft | Pass / pass | No article images: text layout reviewed; no image placement needed. |
| [ELTE University, Budapest](https://simo-hue.github.io/blog/experiences/elte-budapest/) | Draft | Pass / pass | No article images: text layout reviewed; no image placement needed. |
| [KTH, Stockholm](https://simo-hue.github.io/blog/experiences/kth-stockholm/) | Draft | Pass / pass | No article images: text layout reviewed; no image placement needed. |
| [Understanding and Predicting Tourist Behavior through Large Language Models](https://simo-hue.github.io/blog/publications/llm-tourism-mobility-predictor/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Confessions of a 20-Year-Old Tech NEET: Figuring Out the Next Step](https://simo-hue.github.io/blog/thoughts/neet/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [CampFlow](https://simo-hue.github.io/blog/tech-projects/campflow/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Resvo](https://simo-hue.github.io/blog/tech-projects/resvo/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [DeepSafe](https://simo-hue.github.io/blog/tech-projects/deepsafe/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Mattioli.OS](https://simo-hue.github.io/blog/tech-projects/mattioli-os/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Wealth Compass](https://simo-hue.github.io/blog/tech-projects/wealth-compass/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [The Power Of a Sentence](https://simo-hue.github.io/blog/thoughts/stelle/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Bachelor Degree...whats'next?](https://simo-hue.github.io/blog/thoughts/degree/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Live the dream](https://simo-hue.github.io/blog/thoughts/live-the-dream/) | Published | Pass / pass | Pilot: museum right, simulator left; five sideways photos corrected at render time; car sequence kept centered. |
| [The Star Counter](https://simo-hue.github.io/blog/thoughts/the-star-counter/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [CINECA FORTRAN COURSE](https://simo-hue.github.io/blog/experiences/fortran/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [First Lovable Vibe Coding Hackathon in Italy](https://simo-hue.github.io/blog/tech-projects/lobable-vibe-coding/) | Published | Pass / pass | Entrance and networking photos wrap; timer and Sophia use the small preset; captions stay attached; venue and stage photos remain centered. |
| [Impostor Syndrome OR Ignorance?](https://simo-hue.github.io/blog/thoughts/impostor-syndrome/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Machina Sapiens \| Nello Cristianini](https://simo-hue.github.io/blog/books/machina-sapiens/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Wheelchair Basketball](https://simo-hue.github.io/blog/experiences/basket-in-carrozzina/) | Published | Pass / pass | Portrait moved into its related section and aligned right-small; group cover preserved. |
| [Relationship Importance](https://simo-hue.github.io/blog/thoughts/relationship/) | Published | Pass / pass | Closing illustration stays centered because no following text needs to wrap. |
| [Venice: A Paradigm Shift in Urban Living](https://simo-hue.github.io/blog/experiences/venice-paradigm-shift/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [VecioBot - Telegram Bot in Dialetto Trentino](https://simo-hue.github.io/blog/tech-projects/ciacola-bot/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [NO MAFIA Sicily Tour](https://simo-hue.github.io/blog/experiences/sicily/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Spread Love wherever you go](https://simo-hue.github.io/blog/thoughts/love/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [The importance of being able to stay alone](https://simo-hue.github.io/blog/thoughts/alone/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Daniele Cassioli](https://simo-hue.github.io/blog/thoughts/cassioli/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Don't Brag](https://simo-hue.github.io/blog/thoughts/humility/) | Published | Pass / pass | Four diagrams remain centered with descriptive alternative text and a dark backing for their pale lettering. |
| [History importance](https://simo-hue.github.io/blog/thoughts/history/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [repetition is the mother of all skills](https://simo-hue.github.io/blog/thoughts/repetition/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Atomic Habits \| James Clear](https://simo-hue.github.io/blog/books/atomic-habits/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Guadagna con la mente \| Andrea Maurizio Gilardoni](https://simo-hue.github.io/blog/books/mente-guadagna/) | Draft | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [guida ai bias cognitivi, Capire le Trappole della Mente \| Raffaele Gaito](https://simo-hue.github.io/blog/books/bias-cognitivi/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [ignorance nowadays is a choice](https://simo-hue.github.io/blog/thoughts/ignorance-today/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [il grifone \| Nicola Gratteri](https://simo-hue.github.io/blog/books/gratteri/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [il vento contro \| Daniele Cassioli](https://simo-hue.github.io/blog/books/cassioli-cuore-a-vedere/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [insegna al cuore a vedere \| Daniele Cassioli](https://simo-hue.github.io/blog/books/cassioli-ventro-contro/) | Draft | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Life Appreciation](https://simo-hue.github.io/blog/thoughts/gratitude/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Pensieri lenti pensieri veloci](https://simo-hue.github.io/blog/books/pensieri-lenti-pensieri-veloci/) | Draft | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Rich and Poor Dad \| Robert Kiyosaki](https://simo-hue.github.io/blog/books/grow-rich/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [The 20th century Trap](https://simo-hue.github.io/blog/thoughts/social-traps/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [think and grow rich \| Napoleon Hill](https://simo-hue.github.io/blog/books/think/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Birdwatching Experience with SWAROVSKI OPTIK at Le Ali del Frassino Residence (Lake Frassino)](https://simo-hue.github.io/blog/experiences/frassino/) | Published | Pass / pass | Small logo and binocular images; duck photo right; migration and pool views remain centered. |
| [Don Mazza College](https://simo-hue.github.io/blog/experiences/mazza/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [EPICURE Hackathon GPU - October 2024](https://simo-hue.github.io/blog/tech-projects/epicure-hackathon-2024/) | Published | Pass / pass | Presentation photo moved beside the final reflection; classroom photo and schedules remain full-width. |
| [Budapest Trip with Collegio Don Mazza](https://simo-hue.github.io/blog/experiences/budapest-collegio-don-mazza/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [GDG AI Hackathon](https://simo-hue.github.io/blog/experiences/gdg-ai-hackathon/) | Draft | Pass / pass | No article images: text layout reviewed; no image placement needed. |
| [Automazione Traduzione Contenuti YouTube](https://simo-hue.github.io/blog/tech-projects/youtube-video-localization-script/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Configuratore Auto Java - Architettura MVC e Design Patterns](https://simo-hue.github.io/blog/tech-projects/java-car-configurator/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Corso Programmazione e Sicurezza delle Reti - Materiale Didattico Open Source](https://simo-hue.github.io/blog/tech-projects/network-programming-security-course/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [MyLang - Implementazione Completa di un Linguaggio di Programmazione](https://simo-hue.github.io/blog/tech-projects/programming-languages-implementation/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Rabbi E-Bike Management System - Sistema Completo per Noleggio E-Bike](https://simo-hue.github.io/blog/tech-projects/rabbi-ebike-management-system/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Smart Contract Ethereum per Sistema Raccolta Punti - DApp Completa](https://simo-hue.github.io/blog/tech-projects/ethereum-smart-contract-points/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [TextConverter Pro](https://simo-hue.github.io/blog/tech-projects/textconverter-pro/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [GISEP in Rimini](https://simo-hue.github.io/blog/experiences/gisep-rimini/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Volunteering Activity in Brazil: A Transformative Educational Journey](https://simo-hue.github.io/blog/experiences/brazil-volunteer-teaching-experience/) | Published | Pass / pass | Small introductory logo; food distribution and football photos wrap; group scenes and photo sequence remain centered. |
| [Italy Trip: Exploring Rome, the Eternal City](https://simo-hue.github.io/blog/experiences/italy-rome-eternal-city/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [21th birth Day in Brazil](https://simo-hue.github.io/blog/experiences/21th-birthday/) | Published | Pass / pass | Beach photo right and sunrise photo left; dinner and final group scene remain centered. |
| [United Kingdom Trip: London, Cambridge, and the South Coast](https://simo-hue.github.io/blog/experiences/uk-london-cambridge-south-coast/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Germany Trip: Exploring Stuttgart, Tübingen, and Heidelberg](https://simo-hue.github.io/blog/experiences/germany-stuttgart-tubingen-heidelberg/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Poland Trip: A Journey Through History](https://simo-hue.github.io/blog/experiences/poland-auschwitz-krakow/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [CLab UNIRv](https://simo-hue.github.io/blog/experiences/clab-univr/) | Published | Pass / pass | Team photo stays centered for faces to remain legible; cover height is bounded. |
| [Mountain Fauna Lover](https://simo-hue.github.io/blog/experiences/mountain-fauna-lover/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
| [Simo's Online & Digital Diary](https://simo-hue.github.io/blog/tech-projects/simos-diary/) | Published | Pass / pass | Cover-only article: centered, proportionate cover; readable text column retained. |
