# BanglaNLP Hub

A community-maintained catalog of Bangla (Bengali) NLP resources — papers, datasets, models, tools, and benchmarks.

[![Live site](https://img.shields.io/badge/live-kishormorol.github.io%2FBanglaNLP--Hub-2563eb)](https://kishormorol.github.io/BanglaNLP-Hub/)
[![CI](https://github.com/kishormorol/BanglaNLP-Hub/actions/workflows/ci.yml/badge.svg)](https://github.com/kishormorol/BanglaNLP-Hub/actions/workflows/ci.yml)
[![Deploy](https://github.com/kishormorol/BanglaNLP-Hub/actions/workflows/deploy.yml/badge.svg)](https://github.com/kishormorol/BanglaNLP-Hub/actions/workflows/deploy.yml)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-22c55e)](./CONTRIBUTING.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-black)](#license)

[![Tasks](https://img.shields.io/badge/tasks-13-64748b)](./data/tasks.yaml)
[![Datasets](https://img.shields.io/badge/datasets-63-7c3aed)](./data/datasets)
[![Papers](https://img.shields.io/badge/papers-712-2563eb)](./data/papers)
[![Models](https://img.shields.io/badge/models-20-0891b2)](./data/models.yaml)
[![Tools](https://img.shields.io/badge/tools-9-db2777)](./data/tools.yaml)

**Live:** https://kishormorol.github.io/BanglaNLP-Hub/

> Keywords: Bangla NLP · Bengali NLP · Bangla datasets · Bengali datasets · Bangla language models · Bengali benchmarks · low-resource / Indic NLP resources.

Static site built with Astro and TypeScript. No client-side framework: the only JavaScript shipped is a handful of small vanilla islands (catalog search, theme toggle, mobile nav menu, task tabs, table sorting, BibTeX copy).

## Catalog

Everything the site renders comes from YAML under [`/data`](./data). Nothing is hardcoded in the pages.

The catalog currently holds **712 papers**, **63 datasets**, **20 models**, and **9 tools** across **13 tasks** — the paper count roughly tripled in July 2026 through hand-verified sweeps of the ACL Anthology, arXiv, and OpenAlex journal articles (see [`TODO-data.md`](./TODO-data.md)).

| | Count |
| --- | --- |
| Tasks | 13 |
| Datasets | 63 |
| Papers | 712 |
| Models | 20 |
| Tools | 9 |

```
data/
  tasks.yaml              task ids, English + Bangla names, descriptions
  datasets/<task>.yaml    one file per task
  papers/<task>.yaml
  models.yaml              one record per model artifact, with one or more tasks
  leaderboards/<task>.yaml
  tools.yaml
  contributors.yaml         resource submitters and their catalog entries
  home-contributors.yaml    community and code credits shown on Home
  venues.yaml             venue -> badge tone
```

### Shareable filters

Copy the address bar URL to share a filtered catalog view. Datasets accepts `q`,
`task`, `license`, and `year`; Papers accepts `q`, `task`, `venue`, and `year`.
For example: `/BanglaNLP-Hub/datasets?task=sentiment&license=open` or
`/BanglaNLP-Hub/papers?q=BanglaBERT&venue=ACL`.
Select values must match an option's value. Dataset license values are `open`,
`nc`, `research`, and `other` (Other / restricted). Unknown select values are
ignored; repeated parameters use the first value. Empty filters are removed from
the URL. Filter text is limited to 1,000 characters, including when read from a URL,
to keep shared addresses bounded.

License filters group the catalog's license text; they do not verify or certify a
dataset's license. Non-commercial and research labels take precedence. `open`
matches only MIT, Apache 2.0, CC0, ODC-BY, CC BY 4.0, and CC BY-SA 4.0.
All other text, including ND, Mixed, GPL/AGPL, and unknown labels, falls under `other`.
Unresolved license fields remain documented in [`TODO-data.md`](./TODO-data.md).

Typing replaces the current history entry. Select changes and **Clear filters**
add an entry when the URL changes, so Back and Forward restore those views.
Other query parameters and resource hashes are kept. Initial loads, copied URLs,
reloads, and Back/Forward preserve explicit filters even when a retained resource
hash points to a hidden item. Hidden targets are not revealed or focused on load;
visible hash targets still open normally. Only explicit hash navigation after
load, including selecting the same hash again through search, can clear conflicting
filters to reveal a target. Without JavaScript, both pages show their full lists.

## Data honesty

The catalog is only useful if its contents are true, so the project holds a hard line:

- **No invented values.** Scores, citation counts, and BibTeX entries are never synthesised. A missing field is omitted and the UI hides the affected element.
- **Leaderboards stay empty until sourced.** Each benchmark carries a real dataset and metric, and a score row appears only with a citation to the paper it came from. Just one benchmark (B-REASO, from Hosain & Morol 2025) is populated so far; the rest render a "No leaderboard curated yet" empty state rather than a plausible-looking number.
- **Links are checked.** Every published `link:` URL is verified nightly. Unverified `data/inbox/` candidates are excluded. Dead links are reported in a single tracking issue; entries are never removed automatically.
- **Entries get verified by hand.** Papers have been audited against the ACL Anthology, arXiv, and OpenAlex (title, authors, and abstract), and their task assignments are being spot-checked and corrected. Several entries inherited from the original design prototype turned out to be fabricated — a duplicate under an invented title, a model that does not exist, a paper with no publication — and were removed.

Known gaps are tracked in [`TODO-data.md`](./TODO-data.md): 2 datasets lack BibTeX and nine of the eleven leaderboards await rows.

Canonical BibTeX may come from ACL Anthology, arXiv, a publisher export, or an
official Crossref or DataCite export of registered metadata. Both
[Crossref](https://www.crossref.org/documentation/retrieve-metadata/content-negotiation/)
and [DataCite](https://support.datacite.org/docs/datacite-content-resolver) support
DOI content negotiation with `Accept: application/x-bibtex`. These registry
exports are canonical sources, not handcrafted citations. Preserve every exported
field and document the paper or release association in `TODO-data.md`; a citation
does not verify the dataset's other metadata.

**Dataset fields are verified at the source.** `license`, `size`, and `year` have each had an audit pass (July 2026), and the datasets added by mining resource papers had their `license` and `size` read from the dataset's own repository or card — never the paper's license icon, which describes the paper, not the data. Corrections and the entries still unconfirmed (because no reachable source states a figure) are listed in `TODO-data.md`. Candidate datasets with unverifiable licenses or outside the current scope are held back rather than published. A September 2026 audit replaced BHS's unsupported 30,000 count with 3,418 labelled statements in v1.0 and checked SentNoB, FLORES-200, TyDi QA, and WikiANN against pinned releases. The evidence and remaining license disputes are recorded in `TODO-data.md`.

## Commands

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server on `localhost:4321` |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Preview the production build |
| `npm run validate` | Validate `/data` against the Zod schemas |
| `npm run check-links` | Check every published `link:` URL in `/data` |

`npm run validate` fails on missing or malformed fields, bad URLs, `verified` dates older than 12 months, duplicate ids or links, and leaderboards referencing an unknown dataset or paper id. It runs in CI on every pull request and gates deployment.

## Status

The site is complete: Home, Tasks and per-task detail, Datasets, Papers, Tools, Contribute, and About, plus the data layer, schemas, validator, CI, GitHub Pages deployment, and a nightly link check.

**What is left is data, not code** — and that is exactly where help is most useful.

## Contributing

Contributions are genuinely welcome, and you do not need to know Astro or TypeScript to make one. Every entry on the site is a few lines of YAML under [`/data`](./data).

**The fastest way in:** open a [Submit a resource](https://github.com/kishormorol/BanglaNLP-Hub/issues/new?template=submit-resource.yml) issue with a link. That is enough — someone else can turn it into an entry.

**If you would rather open a PR directly**, [`CONTRIBUTING.md`](./CONTRIBUTING.md) has the field format for each entry type and a worked example. Edit or add one YAML file and open the PR; CI runs `npm run validate` and must pass before merge.

Everyone who has contributed a resource is credited in [`CONTRIBUTORS.md`](./CONTRIBUTORS.md).

### Where help is most needed

These are concrete, self-contained, and each one is genuinely useful on its own — full detail in [`TODO-data.md`](./TODO-data.md):

- **Reviewing paper tasks.** Most of the 712 papers were bulk-imported (ACL Anthology, arXiv, and hand-verified OpenAlex journal articles); their metadata is authoritative but each one's *task* was assigned by a title heuristic. Spotting a paper filed under the wrong task and moving it is a quick, high-value fix.
- **Leaderboard rows.** Nine of the eleven benchmarks ship empty. Each needs scores with a citation to the paper they came from. Keep the dataset version, test split, and evaluation conditions explicit.
* **BibTeX.** 2 datasets have no citation entry, `udbru` and `snltr`. Establish the resource association before copying a canonical export under the policy above. Do not invent a citation.
- **Unverified dataset sizes.** About a dozen datasets are hosted where no count is published (Kaggle, openslr.org, nltr.org). If you know the paper, you can settle these.
- **Missing resources.** New papers, datasets, models, and tools — especially anything published recently, and anything from researchers outside the usual venues.

### The one rule

**Never add a value you cannot source.** No invented scores, citation counts, or BibTeX. If a field is unknown, leave it out — the UI already hides the affected element, and an empty state is correct output rather than a gap to fill.

This is not pedantry. A meaningful fraction of the catalog's original prototype data turned out to be fabricated — a model that did not exist, a duplicate under an invented title, a paper with no publication — and all of it looked perfectly plausible. Everything here is checkable, which is the only reason it is worth using.

## Design reference

The visual design originated as a Claude Design prototype. `design-reference/data.js` holds the original catalog data the YAML was migrated from; it is kept for provenance and is not used at build time.

## License

Site code is MIT. Catalog entries link to third-party resources that carry their own licenses — see each entry's `license` field.
