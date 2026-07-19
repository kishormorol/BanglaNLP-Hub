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

## Dataset licenses needing verification

Audited 2026-07-19 against GitHub and Hugging Face. A repo `LICENSE` file usually
covers *code*, not the dataset, so a mismatch below is a prompt to check the paper
or contact the authors — **not** proof our value is wrong. Nothing here was
overwritten on the strength of an automated lookup alone.

Verified correct and not listed: `breaso` (MIT), `xlsum` (cc-by-nc-sa-4.0),
and the remainder that matched their source exactly.

Corrected in this pass: `globalmmlu` — HF card states apache-2.0, not CC BY 4.0.

| id | our license | what the source says |
| --- | --- | --- |
| `bdshs` | CC BY-NC 4.0 | repo LICENSE is MIT (may cover code only; README silent) |
| `tbolid` | CC BY 4.0 | repo LICENSE is AGPL-3.0 (may cover code only; README silent) |
| `megaverse` | Mixed | repo LICENSE is MIT |
| `wikiann` | ODC-BY | HF card says "unknown" |
| `flores` | CC BY-SA 4.0 | GitHub cannot classify the LICENSE file |
| `bnmmlu` | CC BY-SA 4.0 | LICENSE file text says CC BY-SA 4.0; GitHub reports NOASSERTION — ours is probably right |
| `benqa` | CC BY-NC-SA 4.0 | repo declares no LICENSE |
| `banglanmt` | Research only | repo declares no LICENSE |
| `banglarqa` | CC BY-NC 4.0 | repo declares no LICENSE |
| `sentnob` | CC BY-NC-SA 4.0 | repo declares no LICENSE |
| `bemoc` | Research only | repo declares no LICENSE |
| `absa` | Research only | repo declares no LICENSE |
| `banfakenews` | CC BY-NC 4.0 | repo declares no LICENSE |
| `bard` | Research only | repo declares no LICENSE |
| `samanantar` | CC0 | hosted at indicnlp.ai4bharat.org — not machine-checkable |
| `multiconer` | CC BY 4.0 | hosted at registry.opendata.aws — not machine-checkable |
| `bner` | MIT | hosted on Kaggle — not machine-checkable |
| `udbru` | CC BY-SA 4.0 | hosted at universaldependencies.org — not machine-checkable |
| `snltr` | Research only | hosted at nltr.org — not machine-checkable |
| `openslr53` | CC BY-SA 4.0 | hosted at openslr.org — not machine-checkable |
| `commonvoice` | CC0 | hosted at commonvoice.mozilla.org — not machine-checkable |
| `oodspeech` | CC BY-NC 4.0 | hosted at bengaliai.github.io — not machine-checkable |
| `bansdata` | Research only | hosted on Kaggle — not machine-checkable |
| `potrika` | CC BY 4.0 | hosted at doi.org — not machine-checkable |

### Sizes and years

No dataset `size`, `sizeN`, or `year` field has been verified against its source.
These came from the original design prototype. `sizeN` drives the table sort, so a
wrong value is a silently wrong UI.
