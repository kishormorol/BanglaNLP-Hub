# TODO: data gaps

Known gaps, deliberately left empty rather than filled with invented values.
Contributions welcome — see CONTRIBUTING.md.

## Dataset metadata audit (2026-09-08)

Checked the following five entries against primary GitHub/Hugging Face metadata
and release files. Counts below are records, not unique texts. Existing dataset
ids and links are unchanged; version and split scope are explicit in the entries.

| id | result | pinned evidence |
| --- | --- | --- |
| `bhs` | Corrected 30,000 documents to 3,418 labelled statements in v1.0. Kept 2020 and identified the version in `source`. Each record has one of five labels, not multiple labels. | [v1.0 file](https://github.com/rezacsedu/Bengali-Hate-Speech-Dataset/blob/9e1ce5b6b46f8353c20a179abdbcd35077fdda1c/bengali_%20hate_v1.0.csv), [README](https://github.com/rezacsedu/Bengali-Hate-Speech-Dataset/blob/9e1ce5b6b46f8353c20a179abdbcd35077fdda1c/README.md) |
| `sentnob` | Confirmed 15,728 comments: Train 12,575 + Val 1,567 + Test 1,586. Corrected the license to CC BY-ND 4.0, as declared on the author's HF card. Kept 2021. | [release files](https://huggingface.co/datasets/khondoker/SentNoB/tree/7f9ab8ccd02457b79cd15d300fc1f0eece47b81b), [card](https://huggingface.co/datasets/khondoker/SentNoB/blob/7f9ab8ccd02457b79cd15d300fc1f0eece47b81b/README.md), [author's GitHub README](https://github.com/KhondokerIslam/SentNoB/blob/fd6fd0bb7163b5e713cb36ec4442628f84a257e0/README.md) |
| `flores` | Corrected the public Bengali count to 2,009: dev 997 + devtest 1,012. The documented 3,001 total includes the hidden test split. Confirmed CC BY-SA 4.0 and the 2022 release year. | [ben_Beng split metadata via HF API](https://huggingface.co/api/datasets/facebook/flores/revision/71abf77d8b7beb5cfef59898d6b24d92ab7654fc), [composition](https://github.com/facebookresearch/flores/blob/a6c830c6e1051fb4ac1a44b32358f00463f332bd/flores200/README.md), [dataset license and release date](https://github.com/facebookresearch/flores/blob/a6c830c6e1051fb4ac1a44b32358f00463f332bd/README.md) |
| `tydiqa` | Corrected ~10k to 11,096 Bengali primary-task questions: train 10,768 + dev 328. Identified v1.0 and excluded the separate GoldP task. Kept Apache 2.0 and 2020. | [primary-task release files](https://huggingface.co/datasets/google-research-datasets/tydiqa/tree/da78f23f9119363459acbaf46bf89426ff26c259/primary_task), [card](https://huggingface.co/datasets/google-research-datasets/tydiqa/blob/da78f23f9119363459acbaf46bf89426ff26c259/README.md), [task/version definitions](https://github.com/google-research-datasets/tydiqa/blob/43cde6d598c1cf88c1a8b9ed32e89263ffb5e03b/README.md) |
| `wikiann` | Confirmed 12,000 sentences: train 10,000 + validation 1,000 + test 1,000. Corrected `source` to the Rahimi et al. 2019 balanced splits distributed at the existing link. Kept 2019. | [Bengali release files](https://huggingface.co/datasets/unimelb-nlp/wikiann/tree/f0a3be6dc5564c0cc4150bb660144800a1f539d4/bn), [version and split documentation](https://huggingface.co/datasets/unimelb-nlp/wikiann/blob/f0a3be6dc5564c0cc4150bb660144800a1f539d4/README.md) |

BHS v1.0 was parsed as tab-separated data despite its `.csv` extension. Its 3,418
records contain 3,185 distinct text strings. Label counts are geopolitical 1,379,
religious 502, personal 629, gender abusive 316, and political 592. The README's
per-class table disagrees with the file, so the audit uses the file counts.
The v1.0 file has Git blob `a42e09559b2a6e9fe6a4fe2b08a3246952387259`, identical to
the [2020 file under its previous name](https://github.com/rezacsedu/Bengali-Hate-Speech-Dataset/blob/7916f1fd141dcf97555ab5e0b7f188fa1b757f2f/Bengali_%20Hate_Speech_Dataset_Subset.csv).
The [v2.0 file](https://github.com/rezacsedu/Bengali-Hate-Speech-Dataset/blob/9e1ce5b6b46f8353c20a179abdbcd35077fdda1c/bengali_hate_v2.0.csv)
has 5,698 records. Neither version supports 30,000, and v2.0 was not substituted
for the catalog's 2020 resource.

SentNoB counts exclude each CSV header. WikiANN counts were checked by reading
all three Bengali Parquet files. TyDi QA counts came from reading the `language`
column in all 12 primary-task train shards and the validation shard, selecting
`bengali`; HF calls the original dev split `validation`. FLORES counts came from
the publisher's `ben_Beng` card metadata through the revision-pinned HF API.
FLORES was not recounted locally because its HF files require access approval
and returned HTTP 401 without authentication.

Two license questions remain unresolved, and their catalog values are unchanged.
BHS has an [MIT LICENSE](https://github.com/rezacsedu/Bengali-Hate-Speech-Dataset/blob/9e1ce5b6b46f8353c20a179abdbcd35077fdda1c/LICENSE),
but the README says the dataset is available "only for research purposes".
WikiANN's HF card declares `unknown` and leaves its licensing section unfilled;
it does not establish the inherited ODC-BY value. Neither a paper license nor a
repository software license resolves dataset permissions by itself.

## Bengali-Loop ASR corpus filed (2026-08-10)

From issue #86. Every field is sourced from the Bengali-Loop paper
(arXiv:2602.14291) — 191 recordings, 158.6 hours, 792k words, 11 YouTube
channels — and the `link` is the paper's own hyperlink target. Two caveats:

- **`license: Mixed` is an interpretation, not a quoted value.** The paper's
  "Release, Licensing, and Reproducibility" section assigns no license: audio is
  drawn from publicly accessible Bengali media, annotations rather than raw media
  are released where redistribution is constrained, and users are asked to
  "respect original source licenses". `Mixed` is the closest true label the
  schema allows (precedent: `megaverse`), but the real state is *unspecified and
  source-dependent*. Worth revisiting if the authors ever declare one.
- **The link is a Kaggle *competition* data tab.** It returns 200, but competition
  data commonly requires accepting the rules to download, and that has not been
  confirmed for a closed competition. If it turns out to be gated, this should be
  repointed at a more open canonical location.

The **Bengali-Loop paper** (`arxiv-2602-14291`) is now filed under `speech`.

**Still unfiled: the Bengali-Loop diarization corpus.** Issue #86 was closed with
this outstanding, so the verified figures are kept here rather than lost with it.
All of the following are confirmed against the paper's own abstract
(arXiv:2602.14291) and need no re-derivation:

- 24 recordings, 22 hours, 5,744 manually annotated speaker-turn segments
- baseline 40.08% DER (pyannote), against 34.07% WER for the ASR half
- task would be `speaker` (Speaker ID / Diarization)
- link candidate: `kaggle.com/competitions/dl-sprint-4-0-bengali-speaker-diarization-challenge/data`

What blocks it is the same pair of unknowns as the ASR corpus, neither of which
could be resolved without Kaggle credentials:

- **`license`** — the paper's "Release, Licensing, and Reproducibility" section
  assigns none, deferring to original source licenses (the audio is third-party
  media). The ASR entry uses `Mixed` for this reason; the same choice would apply.
- **availability** — the link is a Kaggle *competition* data tab, and whether it is
  downloadable now that DL Sprint 4.0 has closed is unconfirmed.

Competition-system papers reporting DER on this corpus (arXiv `2602.21741`,
`2603.19256`, `2603.03158`, `2602.21183`) were all verified to exist and would be
citable for a `speaker` leaderboard once the dataset entry lands. Note their
public/private DER split is a leaderboard artifact, so the metric needs stating
precisely.

## VQA task added (2026-08-10)

`vqa` — Visual Question Answering — is the catalog's first **vision-language** task,
added from issue #85. It ships with one paper (BanglaProtha, WACV 2026) and no
datasets, models, or leaderboard; those empty states are correct output.

Outstanding:

- **BanglaProtha dataset not filed.** The Kaggle release
  (`kaggle.com/datasets/sourove/bangla-culturally-relevant-vqa`) resolves, but its
  `license` and `size` could not be read without Kaggle credentials — the page is
  JS-rendered and the only `License-Identifier` strings in its HTML belong to bundled
  JS libraries, not the dataset. Both fields are schema-required, so the dataset is
  deliberately absent rather than guessed. Needs a human with a Kaggle account, or
  the figures from the paper.
- **Scope.** Admitting vision-language work invites image captioning, OCR-VQA, and
  document VQA. Whether those belong is still open.

Resolved:

- **`bn` label confirmed.** `চিত্রভিত্তিক প্রশ্নোত্তর` was reviewed by the maintainer
  on 2026-08-10 and kept. It keeps the `qa` root `প্রশ্নোত্তর` and modifies it with
  `চিত্র`, matching the native-compound pattern the other task labels use.

## Speech taxonomy split: SER + Speaker tasks (2026-07-23)

The single `speech` ("ASR / TTS") task was silently acting as a catch-all for all
audio work. Two tasks were split out so the resources are findable:

- **`ser` — Speech Emotion Recognition.** Emotion *from the acoustic signal*, which
  is not the same task as text emotion under `sentiment`.
- **`speaker` — Speaker ID / Diarization.**

**Root cause fixed.** Both classifiers (`classify()` in `scripts/promote.ts` and
`guessTask()` in `scripts/discover.ts`) tested the `emotion → sentiment` rule
*before* `speech`, so every "**Speech** Emotion Recognition" title was misrouted to
`sentiment` (you can still see the fossil `suggestedTask: sentiment` on the held
candidates). Tight `ser`/`speaker` guards were added ahead of the keyword rules;
bare "emotion" still routes text papers to `sentiment`, and "speaker adaptation" (an
ASR technique) still routes to `speech`.

**Promoted from the inbox:**

- `ser`: 11 papers (incl. the SUBESCO and BanSpEmo dataset papers) + 2 datasets —
  **SUBESCO** (CC BY 4.0, Zenodo `10.5281/zenodo.4526477`; 7,000 utt / 7.7 hrs / 20
  actors / 7 emotions) and **BANSpEmo** (CC BY 4.0, Mendeley `rdwn4bs5ky`; 792 utt /
  22 speakers / 6 emotions). Both licenses/sizes read from the dataset's own card.
- `speaker`: 4 papers — the 3 long-form ASR+diarization arXiv papers moved out of
  `speech` (`arxiv-2602-23070`, `arxiv-2602-21741`, `arxiv-2603-19256`), plus the
  VQ/GMM text-independent speaker-ID paper. *The 3 moved papers are joint
  ASR+diarization; diarization is the novel axis. Reviewers may rebalance.*

**Still held (not promoted), with reasons:**

- **Multimodal.** "Smart reception … speech, speaker, and face recognition"
  (*Engineering Applications of AI*, 2024) — audio + vision, held the same way other
  multimodal work is.
- **Music, not speech.** "Attention-based CNN-BiGRU for Bengali Music Emotion
  Classification", "Verse-Based Emotion Analysis of Bengali Music" — song/lyrics
  emotion, outside the speech taxonomy.
- **Clinical / pathological speech — no in-scope task yet.** A "Dysarthric Bengali
  speech" dataset and "Connected Speech … Alzheimer's Disease" / dementia
  connected-speech papers. Promoting them is the prerequisite-adds-a-task case, like
  OCR and captioning below.

BANSpEmo still needs BibTeX (see the missing-BibTeX table). Sizes and licenses are
verified at source, so they are not listed under the unverified tables.

## Datasets: mining from resource papers (2026-07-19)

The imported resource/benchmark papers were mined for the datasets they
introduce. Datasets went 31 → 43 (12 added), each with `license` and `size`
read from the dataset's **own repository or card** — never the paper's license
icon (that trap produced several false positives, e.g. Vashantor's page shows
CC BY 4.0, not the CC0 a search claimed; BanglaBook is CC BY-NC-SA 4.0 though
its paper page says "not stated").

**The remaining candidates from that pass are held** for two recurring reasons.
This is the same wall that already leaves a third of the older datasets unverified:

- **Unverifiable license.** Hosted on Kaggle / Mendeley / a bare arXiv with no
  repo LICENSE and no license statement in the paper. Adding one needs a real
  license, which none of these supply. Examples: BanglaQuAD, SentiGOLD,
  BanglaSarc, MONOVAB, BOIGENRE, BeliN, BnPC, BanglaBioMed, RegSpeech12.
- **Multimodal / out of the text-NLP scope.** Image+text or audio datasets, held
  the same way OCR and captioning papers were: BaitBuster-Bangla (YouTube
  metadata + thumbnails), Bangla-Bayanno (visual QA), BanglaAbuseMeme, CMBan,
  ChitroJera.

Promoting any held dataset means finding a real license at its source (or adding
a task, for the multimodal ones). Do not fill `license` with a guess to unblock.

## Papers: bulk import (2026-07-19)

The papers catalog was expanded from 27 to 405 in two passes with
`npm run discover` + `npm run promote`:

- **ACL Anthology → 260.** The entire anthology swept for Bangla/Bengali work.
  Title, authors, venue, year, and link come verbatim from the anthology's own
  BibTeX — nothing in those fields is guessed.
- **arXiv → 405.** 145 arXiv-only preprints added, deduped against the published
  set by link, normalized title, *and* system-name prefix (so e.g. the arXiv
  "BEnQA: … and Reasoning Benchmark" is recognised as the already-catalogued ACL
  "BEnQA: … Benchmark"). Their title/authors/year come from the arXiv API; venue
  is honestly `arXiv`. **143 arXiv hits were dropped** because their title is not
  about Bangla — the arXiv filter matches the abstract, so those are multilingual
  papers that merely mention Bengali.

`task` is heuristic in both passes (see below). Preprints carry a real risk the
published set does not: a title that drifts between preprint and camera-ready can
evade dedup. The three-way dedup catches the common cases, but a few arXiv
near-duplicates of published papers may remain — worth a look when reviewing.

**`task` is the exception and is heuristic.** The anthology does not record a
task, so `scripts/promote.ts` derives one from the title by keyword. This is the
highest-value review area: most assignments are right, but title-only
classification has a known error tail (a paper that merely *uses* code-mixed
text, say, versus one *about* code-switching). Re-filing a paper under a better
task is a welcome, low-risk contribution. `note` was intentionally left blank on
imported papers rather than auto-generated — a one-line summary is exactly the
kind of plausible invention the catalog forbids.

**What is currently held (2,692 candidates in `data/inbox/` on 2026-08-23):**

- **2,543 OpenAlex papers.** The title-wide journal sweep intentionally catches many
  non-NLP and non-computational records. Most have no task suggestion and require
  human topic, metadata, and scope review before promotion.
- **57 ACL and 35 arXiv papers.** These still require source verification, task review,
  and a preprint/publication duplicate check before entering the catalog.
- **57 Hugging Face datasets.** The `language:bn` filter is low-precision, and the list
  API does not establish a dataset's scope, size, or license. Curate each card and
  release individually; do not promote these wholesale.

Discovery merges new results into this queue and prunes records whose normalized title
or link is now present in the published catalog.

## Model catalog audit

The catalog has **20 unique model artifacts** with **26 task associations**. Models
are stored once in `data/models.yaml`; `tasks` records every relevant catalog task.
Six duplicate task-specific records were collapsed without changing their links or
task-page coverage. `stage` is present only when the model card establishes whether
an artifact is a base or fine-tuned model.

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

## Citation curation (2026-09-08)

Added 23 missing dataset citations and replaced the abbreviated SentNoB and
BanglaRQA citations with complete canonical exports. All exported fields, author
order, and punctuation are preserved. Only line-end whitespace and YAML indentation
changed. These are paper citations, not version-specific dataset DOI citations.
This pass does not validate unchanged names, descriptions, sizes, licenses, years,
links, or `verified` dates. The metadata questions below remain open.

Parsed YAML citation strings match all 25 downloaded exports after stripping
line-end whitespace and trimming the surrounding whitespace.
Validation and build pass with
63 datasets and 712 papers, unchanged from before this pass.

### Canonical source ledger

| Dataset id | Canonical BibTeX export | Citation scope or variant caveat |
| --- | --- | --- |
| `bdshs` | [ACL 2022.lrec-1.552](https://aclanthology.org/2022.lrec-1.552.bib) | BD-SHS paper; does not resolve the license question below. |
| `tbolid` | [ACL 2023.banglalp-1.1](https://aclanthology.org/2023.banglalp-1.1.bib) | Transliterated and code-mixed offensive language identification. |
| `offmix3l` | [ACL 2023.socialnlp-1.3](https://aclanthology.org/2023.socialnlp-1.3.bib) | Code-mixed offensive-language test set. |
| `banth` | [ACL 2025.findings-naacl.403](https://aclanthology.org/2025.findings-naacl.403.bib) | Multi-label transliterated Bangla hate speech. |
| `globalmmlu` | [arXiv 2412.03304](https://arxiv.org/bibtex/2412.03304) | Parent benchmark for `bn`, not Global-MMLU-Lite; revised export says 2025, initial submission was 2024. |
| `megaverse` | [ACL 2024.naacl-long.143](https://aclanthology.org/2024.naacl-long.143.bib) | Whole multilingual suite; does not establish Bengali coverage in every constituent dataset. |
| `bnmmlu` | [ACL 2026.findings-acl.593](https://aclanthology.org/2026.findings-acl.593.bib) | Published version preferred over the saved arXiv 2505.18951 export; catalog still describes the 2025 preprint. |
| `banglamath` | [ACL 2025.mathnlp-main.10](https://aclanthology.org/2025.mathnlp-main.10.bib) | Grade 6, 7, and 8 benchmark; canonical workshop title retained. |
| `somadhan` | [arXiv 2505.21354](https://arxiv.org/bibtex/2505.21354) | Paper experiments use an earlier 4,000-problem sample, not the later 8,792-problem v2 release. |
| `banglaparaphrase` | [ACL 2022.aacl-short.33](https://aclanthology.org/2022.aacl-short.33.bib) | BanglaParaphrase paper for the linked BUET release. |
| `samanantar` | [ACL 2022.tacl-1.9](https://aclanthology.org/2022.tacl-1.9.bib) | Parent 11-language parallel collection for the bn-en subset. |
| `banglatlit` | [ACL 2024.findings-emnlp.859](https://aclanthology.org/2024.findings-emnlp.859.bib) | Romanized Bangla back-transliteration benchmark. |
| `vashantor` | [arXiv 2311.11142](https://arxiv.org/bibtex/2311.11142) | Revised export says 2025; catalog says 2023 and linked Mendeley v2 was released in 2024. |
| `wikiann` | [ACL P19-1015](https://aclanthology.org/P19-1015.bib) | Rahimi et al. 2019 balanced splits used by the linked HF artifact, not the original 2017 construction paper. |
| `ancholikner` | [arXiv 2502.11198](https://arxiv.org/bibtex/2502.11198) | Canonical arXiv record retained, including its full HTTPS PLOS DOI; not a citation for Mendeley v4. |
| `banglarqa` | [ACL 2022.findings-emnlp.186](https://aclanthology.org/2022.findings-emnlp.186.bib) | Replaces shortened title, byline, and venue with the complete export. |
| `tydiqa` | [ACL 2020.tacl-1.30](https://aclanthology.org/2020.tacl-1.30.bib) | Parent dataset paper for Bengali primary tasks v1.0; does not substitute GoldP. |
| `sentnob` | [ACL 2021.findings-emnlp.278](https://aclanthology.org/2021.findings-emnlp.278.bib) | Replaces abbreviated citation, including the canonical citation key. |
| `banglabook` | [ACL 2023.findings-acl.80](https://aclanthology.org/2023.findings-acl.80.bib) | Book-review sentiment corpus. |
| `sentmix3l` | [ACL 2023.sealp-1.6](https://aclanthology.org/2023.sealp-1.6.bib) | Code-mixed sentiment test set, distinct from OffMix-3L and EmoMix-3L. |
| `emomix3l` | [ACL 2024.wildre-1.2](https://aclanthology.org/2024.wildre-1.2.bib) | Multi-label emotion test set; ACL spelling and byline retained. |
| `bnsentmix` | [ACL 2025.loreslm-1.4](https://aclanthology.org/2025.loreslm-1.4.bib) | Publication year 2025 differs from release year 2024; ACL's final two author positions differ from the PDF, and the export order is retained. |
| `subesco` | [PLOS ONE 0250173](https://journals.plos.org/plosone/article/citation/bibtex?id=10.1371/journal.pone.0250173) | Corpus paper linked to Zenodo 4526477; publisher abstract and all other fields retained. |
| `banfakenews` | [ACL 2020.lrec-1.349](https://aclanthology.org/2020.lrec-1.349.bib) | Original BanFakeNews, not BanFakeNews-2.0. |
| `potrika` | [arXiv 2210.09389](https://arxiv.org/bibtex/2210.09389) | Paper covers raw and balanced corpora; catalog's rounded 665k refers to the raw corpus. |

### Metadata follow-ups

These discrepancies surfaced during citation matching. Catalog fields remain
unchanged pending a separate metadata and release review.

- `bnmmlu`: the [published abstract](https://aclanthology.org/2026.findings-acl.593/) and [repository](https://github.com/samanjoy2/bnmmlu) say 41 domains; both the dataset description and `bnmmlu-p` note say 23. The paper record also retains its 2025 arXiv venue, year, and link. Review the version scope before updating these fields.
- `vashantor`: the [paper](https://arxiv.org/abs/2311.11142) and [Mendeley v2](https://data.mendeley.com/datasets/bj5jgk878b/2) describe Bangla, Banglish, and English forms. The 32,500 total is sentences, not distinct parallel pairs. Resolve the 2023 catalog year, January 2024 v2 release, and 2025 revised citation separately.
- `somadhan`: [paper v2](https://arxiv.org/html/2505.21354v2) section 4.3 describes 4,000 annotated samples and a planned v2. [Mendeley v2](https://data.mendeley.com/datasets/34bs5cxk9j/2), released August 5, 2025, describes 8,792 problems. Do not use the paper's experimental sample to validate the later release size.
- `bnsentmix`: the [paper](https://aclanthology.org/2025.loreslm-1.4.pdf) says CC BY 4.0, the [repository](https://github.com/Nishita2000/BnSentMix) has Apache 2.0, and the [HF card](https://huggingface.co/datasets/aplycaebous/BnSentMix) and catalog say MIT. The card reports both 20,000 samples and 21,873 unique sentences; its viewer reports 20,015 rows. License and count scope remain unresolved.
- `ancholikner`: the [arXiv record](https://arxiv.org/abs/2502.11198) links a February 2026 [PLOS publication](https://doi.org/10.1371/journal.pone.0342786), while [Mendeley v4](https://data.mendeley.com/datasets/gbkszkt8z3/4) was released April 8, 2026. The catalog retains 2025; the paper citation does not establish v4 metadata.
- `potrika`: the [paper](https://arxiv.org/abs/2210.09389) and [Mendeley v2](https://data.mendeley.com/datasets/v362rp78dc/2) distinguish 664,880 raw articles from 320,000 balanced articles. Catalog `sizeN: 665000` is rounded. Mendeley v2 is dated 2021, while the paper and catalog say 2022.

No usable canonical export was saved for `banspemo`; the saved response is HTML.
For `kothon` and `banglameder`, publisher HTTP 403 and browser fetch `bot_blocked`
responses prevented export retrieval in the evidence-gathering pass. No citations were
reconstructed. Retry the [Kothon export](https://www.sciencedirect.com/sdfe/arp/cite?pii=S2352340926003422&format=text%2Fx-bibtex&withabstract=false)
and [Bangla-MedER export](https://www.sciencedirect.com/sdfe/arp/cite?pii=S2352340926002581&format=text%2Fx-bibtex&withabstract=false).
The [Bangla-MedER dataset article](https://pmc.ncbi.nlm.nih.gov/articles/PMC13054271/)
cites dataset v1, while the catalog links v2 with an English translation; it is
not the separate Multi-BERT ensemble research article.

### Paper task corrections

Re-read the primary abstracts before moving these existing records. Only `task`
and the containing file changed; ids and all other fields are preserved. Checks
found no contributor or leaderboard references and no duplicate ids, normalized
titles, or normalized links for these records.

| Paper id | Move | Primary abstract evidence |
| --- | --- | --- |
| `al-sefat-2025-bengalifig` | `sentiment` to `llm` | [ACL](https://aclanthology.org/2025.mmloso-1.6/) describes 435 riddles and evaluation of eight LLMs for figurative and culturally grounded reasoning. |
| `arxiv-2304-02739` | `llm` to `textcls` | [arXiv](https://arxiv.org/abs/2304.02739) classifies fake versus real Bengali reviews using semi-supervised GANs and pretrained language models. |
| `arxiv-2308-01987` | `llm` to `textcls` | [arXiv](https://arxiv.org/abs/2308.01987) introduces BFRD and detects review authenticity using transformer ensembles. |

## Datasets missing BibTeX

30 datasets still lack BibTeX. The copy button is hidden for these. Add a `bibtex:`
field copied from the ACL Anthology, arXiv, or publisher export. Do not hand-write one.

| Task | Dataset | id |
| --- | --- | --- |
| `hate` | Bengali Hate Speech | `bhs` |
| `hate` | ALERT | `alert` |
| `hate` | Bangla-ToCo | `banglatoco` |
| `mt` | FLORES-200 (bn) | `flores` |
| `mt` | BanglaRegionalTextCorpus | `banglaregionaltextcorpus` |
| `mt` | Kothon | `kothon` |
| `ner` | MultiCoNER (bn) | `multiconer` |
| `ner` | B-NER | `bner` |
| `ner` | Bangla-MedER | `banglameder` |
| `pos` | UD Bengali-BRU Treebank | `udbru` |
| `pos` | SNLTR POS Corpus | `snltr` |
| `qa` | SQuAD_bn | `squadbn` |
| `sentiment` | BEmoC | `bemoc` |
| `sentiment` | ABSA Cricket & Restaurant | `absa` |
| `sentiment` | Motamot | `motamot` |
| `sentiment` | BABSA | `babsa` |
| `sentiment` | BanglaSarc3 | `banglasarc3` |
| `ser` | BANSpEmo | `banspemo` |
| `ser` | BanglaSER | `banglaser` |
| `ser` | KBES (KUET Bangla Emotional Speech) | `kbes` |
| `speech` | OpenSLR SLR53 (Large Bengali ASR) | `openslr53` |
| `speech` | Common Voice (bn) | `commonvoice` |
| `speech` | OOD-Speech | `oodspeech` |
| `speech` | Lipi-Ghor (bn-882-SSTT) | `lipighor` |
| `speech` | Bengali-Loop (ASR corpus) | `bengali-loop-asr` |
| `summ` | BANSData | `bansdata` |
| `summ` | BanglaCHQ-Summ | `banglachqsumm` |
| `textcls` | BARD | `bard` |
| `textcls` | BTTC | `bttc` |
| `textcls` | BanFakeNews-2.0 | `banfakenews2` |

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
| `bnmmlu` | CC BY-SA 4.0 | LICENSE file text says CC BY-SA 4.0; GitHub reports NOASSERTION — ours is probably right |
| `benqa` | CC BY-NC-SA 4.0 | repo declares no LICENSE |
| `banglanmt` | Research only | repo declares no LICENSE |
| `banglarqa` | CC BY-NC 4.0 | repo declares no LICENSE |
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

### Still unverified

No source consulted states a figure, so these remain as inherited from the prototype:

| id | field(s) | why |
| --- | --- | --- |
| `absa` | 5,038 comments | not stated in README |
| `tbolid` | 5,000 comments | README not readable via fetch |
| `breaso` | 13,497 questions | HF viewer fails to parse the files; card states no count |
| `bner`, `bansdata` | sizes | hosted on Kaggle — not machine-checkable |
| `samanantar`, `snltr`, `openslr53`, `commonvoice`, `oodspeech`, `potrika`, `multiconer` | sizes | hosted off-platform — not machine-checkable |

### Unit inconsistency in `sizeN`

`sizeN` sorts within a task, but the schema does not record its unit. Every change
needs source-by-source review because several tasks mix displayed units. One known
mismatch is `megaverse`: its value is `22` datasets in the suite, while the other
`llm` entries count questions, question-option pairs, or problems. Its position in
a size sort is not comparable to the other entries.
