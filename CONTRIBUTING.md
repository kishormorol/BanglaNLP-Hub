# Contributing to BanglaNLP Hub

Every entry on the site is one YAML record under [`/data`](./data). There is no CMS
and no accounts — you edit a file and open a pull request. When it merges, the site
rebuilds and deploys automatically.

## The rule that matters most

**Never add a value you cannot source.**

This catalog was seeded from a design prototype, and several entries turned out to be
fabricated — a model that did not exist, a paper with no publication, links that
resolved fine but pointed at a completely different paper. All were removed. A catalog
that is 95% accurate is worse than useless, because nobody can tell which 5% to doubt.

Concretely:

- **No invented scores.** Every leaderboard row must cite the paper the number comes
  from. All leaderboards currently ship with `rows: []` and render a
  "No leaderboard curated yet" state. That is correct output, not a gap to fill with
  plausible numbers.
- **No invented BibTeX.** Copy it from the ACL Anthology or publisher page. If there
  is none, omit the field — the UI hides the copy button.
- **No invented metadata.** Titles, venues, and years must match the published record.
  A working link does not prove the metadata is right.
- **No guessed URLs.** Open the link and confirm it is the resource you think it is.

If you are unsure about a field, leave it out and say so in the PR. Missing is fine;
wrong is not.

## Quick start

```sh
git clone https://github.com/kishormorol/BanglaNLP-Hub.git
cd BanglaNLP-Hub
npm install
npm run validate     # must pass
npm run dev          # preview at localhost:4321
```

1. **Fork and branch.** One logical change per PR.
2. **Edit the YAML.** Files are grouped by task: `data/datasets/sentiment.yaml`,
   `data/papers/ner.yaml`, and so on. The filename must match the entry's `task`.
3. **Run `npm run validate`.** It fails on missing or malformed fields, bad URLs,
   duplicate ids, stale `verified` dates, and leaderboards pointing at a dataset id
   that does not exist.
4. **Open a PR.** CI runs validation, builds the site, and link-checks any URL your PR
   added or changed.

## Entry formats

Fields marked optional may be omitted entirely; do not include them as empty strings.

### Dataset — `data/datasets/<task>.yaml`

```yaml
- id: sentnob                      # unique, lowercase, [a-z0-9-_]
  name: SentNoB
  task: sentiment                  # must match the filename and a tasks.yaml id
  size: "15,728 comments"          # human-readable, as you would say it aloud
  sizeN: 15728                     # numeric, used for sorting — approximate is fine
  license: CC BY-NC-SA 4.0
  year: 2021
  source: SentNoB (Findings EMNLP 2021)
  link: https://github.com/KhondokerIslam/SentNoB
  verified: 2026-06-28             # date YOU opened the link and confirmed it
  desc: Sentiment on noisy user comments from news and social platforms.
  bibtex: |                        # optional — omit if none exists upstream
    @inproceedings{islam-etal-2021-sentnob,
      title = {SentNoB: A Dataset for Analysing Sentiment on Noisy {B}angla Texts},
      ...
    }
```

### Paper — `data/papers/<task>.yaml`

```yaml
- id: sentnob-p
  title: SentNoB: A Dataset for Analysing Sentiment on Noisy Bangla Texts
  authors: Islam et al.
  venue: Findings EMNLP            # must have a tone in data/venues.yaml
  year: 2021
  link: https://aclanthology.org/2021.findings-emnlp.278/
  task: sentiment
  note: Noisy user-generated content, 13 domains.   # optional
```

Use the **published** title and venue, not the arXiv preprint's, when both exist.
Prefer an ACL Anthology or DOI link over arXiv.

### Model — `data/models/<task>.yaml`

```yaml
- id: csebuetnlp-banglabert
  name: csebuetnlp/banglabert      # the Hugging Face repo id where applicable
  task: llm
  arch: ELECTRA
  params: 110M
  link: https://huggingface.co/csebuetnlp/banglabert
  verified: 2026-06-28
  note: SOTA Bangla encoder.       # optional
```

### Tool — `data/tools.yaml`

```yaml
- id: bnlp-toolkit
  name: bnlp-toolkit
  author: sagorsarker
  desc: Tokenization, embeddings, NER, POS for Bangla.
  lang: Python
  install: pip install bnlp_toolkit
  link: https://github.com/sagorbrur/bnlp
  verified: 2026-06-28
```

Do not add star counts or download counts. They go stale immediately and were removed
from this catalog for that reason.

### Leaderboard — `data/leaderboards/<task>.yaml`

```yaml
- dataset: sentnob                 # must be an existing dataset id in the same task
  label: SentNoB                   # display name; may add direction, e.g. "FLORES bn→en"
  metric: Micro-F1
  rows:
    - model: BanglaBERT (large)
      score: "0.742"
      paper: Bhattacharjee et al. 2022
      year: 2022
```

**Adding a row requires a citation.** `paper` must identify a real publication that
reports that exact number on that exact benchmark. Do not copy scores between papers
that used different splits or metrics.

## Verified dates

`verified` means *you personally opened the link and confirmed the resource is there*.
It is not the publication date. Validation rejects anything older than 12 months, and
a nightly job re-checks every link, reporting failures in a single tracking issue.

Dead links are never removed automatically — a human decides whether to relink or drop
the entry.

## Review

A maintainer reviews within about a week. CI must be green. Expect questions about
sourcing on any entry with a score, a license claim, or a size figure.

Not comfortable with Git? Open a
[Submit a resource](https://github.com/kishormorol/BanglaNLP-Hub/issues/new?template=submit-resource.yml)
issue instead and a maintainer will turn it into a PR, credited to you.
