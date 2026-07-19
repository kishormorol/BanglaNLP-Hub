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

## Dataset sizes and years

Audited 2026-07-19. These fields came from the original design prototype and had
never been checked. `sizeN` drives the table sort on `/tasks/[id]`, so a wrong value
is a silently wrong UI.

Where a source states a figure, the entry was corrected to match it exactly. Where no
source states one, the existing value was **left alone and listed below** rather than
replaced with a guess.

### Corrected in this pass

| id | was | now | source |
| --- | --- | --- | --- |
| `udbru` | ~7,340 tokens, 2023, "UD v2.13" | 320 tokens / 56 sentences, 2021 | treebank page: "contains 56 sentences and 320 tokens", "part of Universal Dependencies since the UD v2.9 release" |
| `squadbn` | ~130k QA pairs | 132,777 | HF card splits: 127,771 + 2,502 + 2,504 |
| `banglaparaphrase` | 466k pairs | 466,630 | HF datasets-server: 419,967 + 23,332 + 23,331 |
| `globalmmlu` | 14k questions | 14,327 | HF datasets-server, `bn` config: test 14,042 + dev 285 |
| `wikiann` | 10,000 sentences | 12,000 | HF datasets-server, `bn` config: train 10,000 + val 1,000 + test 1,000 — the old value counted only the train split |
| `megaverse` | year 2023 | 2024 | README: NAACL 2024 |
| `bemoc` | year 2021 | 2022 | README bibtex: SN Computer Science vol. 3 no. 2, `year={2022}` |

### Confirmed correct against the source

`bard` (376,226 articles), `banglanmt` (2.75M pairs), `banglarqa` (14,889 QA pairs),
`bnmmlu` (134,375 pairs), `xlsum` (10,126 articles, 2021), `bdshs` (README: "more
than 50,200"), `benqa` (README: "approximately 5K"), `banfakenews` (README: "~50K").

### Known wrong, correct value unknown

| id | our value | problem |
| --- | --- | --- |
| `bhs` | 30,000 documents | Unsupported by the source. The README documents 3,418 labelled hate statements in v1.0 plus "an additional 3,000" in v2.0, and states no 30,000 figure for any quantity. Needs the paper. |

### Still unverified

No source consulted states a figure, so these remain as inherited from the prototype:

| id | field(s) | why |
| --- | --- | --- |
| `sentnob` | 15,728 comments | not stated in README |
| `absa` | 5,038 comments | not stated in README |
| `tbolid` | 5,000 comments | README not readable via fetch |
| `tydiqa` | ~10k questions | README gives only the 200k all-language total, no Bengali split |
| `flores` | 3,001 sentences | README gives no per-language split sizes |
| `breaso` | 13,497 questions | HF viewer fails to parse the files; card states no count |
| `bner`, `bansdata` | sizes | hosted on Kaggle — not machine-checkable |
| `samanantar`, `snltr`, `openslr53`, `commonvoice`, `oodspeech`, `potrika`, `multiconer` | sizes | hosted off-platform — not machine-checkable |

### Unit inconsistency in `sizeN`

`sizeN` sorts within a task, so units only need to agree among datasets sharing a
task. One violation remains: `megaverse` is `22` (datasets in the suite) while every
other `llm` dataset counts questions, so it always sorts last. Speech datasets are
internally consistent (all hours).
