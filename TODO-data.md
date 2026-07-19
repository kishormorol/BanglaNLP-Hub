# TODO: data gaps

Known gaps, deliberately left empty rather than filled with invented values.
Contributions welcome — see CONTRIBUTING.md.

## Leaderboards with no curated rows

Each has a real dataset and metric but zero score rows, and renders an empty state
until rows are added with a citation to the paper the score comes from.

| Task | Benchmark |
| --- | --- |
| `hate` | BD-SHS |
| `llm` | BEnQA (bn) |
| `mt` | FLORES-200 bn→en |
| `ner` | B-NER |
| `pos` | UD Bengali-BRU |
| `qa` | BanglaRQA |
| `sentiment` | SentNoB |
| `sentiment` | BEmoC |
| `summ` | XL-Sum (bn) |
| `textcls` | BanFakeNews |

## Datasets missing BibTeX

The BibTeX copy button is hidden for these. Add a `bibtex:` field copied from the ACL
Anthology or publisher page — do not hand-write one.

| Task | Dataset | id |
| --- | --- | --- |
| `hate` | BD-SHS | `bdshs` |
| `hate` | Bengali Hate Speech | `bhs` |
| `hate` | TB-OLID | `tbolid` |
| `llm` | Global-MMLU (bn) | `globalmmlu` |
| `llm` | MEGAVERSE (bn subset) | `megaverse` |
| `llm` | BnMMLU | `bnmmlu` |
| `mt` | FLORES-200 (bn) | `flores` |
| `mt` | BanglaParaphrase | `banglaparaphrase` |
| `mt` | Samanantar (bn–en) | `samanantar` |
| `ner` | MultiCoNER (bn) | `multiconer` |
| `ner` | B-NER | `bner` |
| `ner` | WikiANN (bn) | `wikiann` |
| `pos` | UD Bengali-BRU Treebank | `udbru` |
| `pos` | SNLTR POS Corpus | `snltr` |
| `qa` | SQuAD_bn | `squadbn` |
| `qa` | TyDi QA (bn) | `tydiqa` |
| `sentiment` | BEmoC | `bemoc` |
| `sentiment` | ABSA Cricket & Restaurant | `absa` |
| `speech` | OpenSLR SLR53 (Large Bengali ASR) | `openslr53` |
| `speech` | Common Voice (bn) | `commonvoice` |
| `speech` | OOD-Speech | `oodspeech` |
| `summ` | BANSData | `bansdata` |
| `textcls` | BanFakeNews | `banfakenews` |
| `textcls` | Potrika | `potrika` |
| `textcls` | BARD | `bard` |
