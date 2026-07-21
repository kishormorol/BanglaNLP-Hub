# BanglaNLP Hub

A community-maintained catalog of Bangla (Bengali) NLP resources — papers, datasets, models, tools, and benchmarks.

[![Live site](https://img.shields.io/badge/live-kishormorol.github.io%2FBanglaNLP--Hub-2563eb)](https://kishormorol.github.io/BanglaNLP-Hub/)
[![CI](https://github.com/kishormorol/BanglaNLP-Hub/actions/workflows/ci.yml/badge.svg)](https://github.com/kishormorol/BanglaNLP-Hub/actions/workflows/ci.yml)
[![Deploy](https://github.com/kishormorol/BanglaNLP-Hub/actions/workflows/deploy.yml/badge.svg)](https://github.com/kishormorol/BanglaNLP-Hub/actions/workflows/deploy.yml)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-22c55e)](./CONTRIBUTING.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-black)](#license)

**Live:** https://kishormorol.github.io/BanglaNLP-Hub/

> Keywords: Bangla NLP · Bengali NLP · Bangla datasets · Bengali datasets · Bangla language models · Bengali benchmarks · low-resource / Indic NLP resources.

Static site built with Astro and TypeScript. No client-side framework: the only JavaScript shipped is a handful of small vanilla islands (catalog search, theme toggle, task tabs, table sorting, BibTeX copy).

## Catalog

Everything the site renders comes from YAML under [`/data`](./data). Nothing is hardcoded in the pages.

| | Count |
| --- | --- |
| Tasks | 10 |
| Datasets | 43 |
| Papers | 445 |
| Models | 22 |
| Tools | 9 |

```
data/
  tasks.yaml              task ids, English + Bangla names, descriptions
  datasets/<task>.yaml    one file per task
  papers/<task>.yaml
  models/<task>.yaml
  leaderboards/<task>.yaml
  tools.yaml
  venues.yaml             venue -> badge tone
```

## Data honesty

The catalog is only useful if its contents are true, so the project holds a hard line:

- **No invented values.** Scores, citation counts, and BibTeX entries are never synthesised. A missing field is omitted and the UI hides the affected element.
- **Leaderboards ship empty.** Every benchmark carries a real dataset and metric but zero score rows, because no scores have been curated from their source papers yet. Each renders a "No leaderboard curated yet" empty state rather than a plausible-looking number.
- **Links are checked.** Every `link:` URL is verified nightly. Dead links are reported in a single tracking issue; entries are never removed automatically.
- **Entries get verified by hand.** Papers have been audited against ACL Anthology and arXiv. Several entries inherited from the original design prototype turned out to be fabricated — a duplicate under an invented title, a model that does not exist, a paper with no publication — and were removed.

Known gaps are tracked openly in [`TODO-data.md`](./TODO-data.md) rather than quietly papered over: 37 datasets lack BibTeX and all 10 leaderboards await rows.

**Dataset fields are verified at the source.** `license`, `size`, and `year` have each had an audit pass (July 2026), and the datasets added by mining resource papers had their `license` and `size` read from the dataset's own repository or card — never the paper's license icon, which describes the paper, not the data. Corrections and the entries still unconfirmed (because no reachable source states a figure) are listed in `TODO-data.md`, along with ~55 candidate datasets held back for unverifiable licenses or being out of the text-NLP scope. One field is recorded as *known wrong* with no known replacement — deliberately. A wrong value we can point at is more useful than a plausible one we invented.

## Commands

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server on `localhost:4321` |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Preview the production build |
| `npm run validate` | Validate `/data` against the Zod schemas |
| `npm run check-links` | Check every `link:` URL in `/data` |

`npm run validate` fails on missing or malformed fields, bad URLs, `verified` dates older than 12 months, duplicate ids, and leaderboards referencing an unknown dataset id. It runs in CI on every pull request and gates deployment.

## Status

The site is complete: Home, Tasks and per-task detail, Datasets, Papers, Tools, Contribute, and About, plus the data layer, schemas, validator, CI, GitHub Pages deployment, and a nightly link check.

**What is left is data, not code** — and that is exactly where help is most useful.

## Contributing

Contributions are genuinely welcome, and you do not need to know Astro or TypeScript to make one. Every entry on the site is a few lines of YAML under [`/data`](./data).

**The fastest way in:** open a [Submit a resource](https://github.com/kishormorol/BanglaNLP-Hub/issues/new?template=submit-resource.yml) issue with a link. That is enough — someone else can turn it into an entry.

**If you would rather open a PR directly**, [`CONTRIBUTING.md`](./CONTRIBUTING.md) has the field format for each entry type and a worked example. Edit or add one YAML file and open the PR; CI runs `npm run validate` and must pass before merge.

### Where help is most needed

These are concrete, self-contained, and each one is genuinely useful on its own — full detail in [`TODO-data.md`](./TODO-data.md):

- **Reviewing paper tasks.** Most of the 445 papers were bulk-imported (ACL Anthology + arXiv); their metadata is authoritative but each one's *task* was assigned by a title heuristic. Spotting a paper filed under the wrong task and moving it is a quick, high-value fix.
- **Leaderboard rows.** All 10 benchmarks ship empty. Each needs scores with a citation to the paper they came from. Even one populated benchmark is a real improvement.
- **BibTeX.** 37 datasets have no citation entry. Copy the published one from the ACL Anthology or the publisher page — please do not hand-write one.
- **Unverified dataset sizes.** About a dozen datasets are hosted where no count is published (Kaggle, openslr.org, nltr.org). If you know the paper, you can settle these.
- **One known-wrong value.** The `bhs` entry claims 30,000 documents and no source supports it. If you have the paper, this is a five-minute fix.
- **Missing resources.** New papers, datasets, models, and tools — especially anything published recently, and anything from researchers outside the usual venues.

### The one rule

**Never add a value you cannot source.** No invented scores, citation counts, or BibTeX. If a field is unknown, leave it out — the UI already hides the affected element, and an empty state is correct output rather than a gap to fill.

This is not pedantry. A meaningful fraction of the catalog's original prototype data turned out to be fabricated — a model that did not exist, a duplicate under an invented title, a paper with no publication — and all of it looked perfectly plausible. Everything here is checkable, which is the only reason it is worth using.

## Design reference

The visual design originated as a Claude Design prototype. `design-reference/data.js` holds the original catalog data the YAML was migrated from; it is kept for provenance and is not used at build time.

## License

Site code is MIT. Catalog entries link to third-party resources that carry their own licenses — see each entry's `license` field.
