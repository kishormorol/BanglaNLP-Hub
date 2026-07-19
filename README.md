# BanglaNLP Hub

A community-maintained catalog of Bangla (Bengali) NLP resources — papers, datasets, models, tools, and benchmarks.

**Live:** https://kishormorol.github.io/BanglaNLP-Hub/

Static site built with Astro and TypeScript. No client-side framework: the only JavaScript shipped is a handful of small vanilla islands (catalog search, theme toggle, task tabs, table sorting, BibTeX copy).

## Catalog

Everything the site renders comes from YAML under [`/data`](./data). Nothing is hardcoded in the pages.

| | Count |
| --- | --- |
| Tasks | 10 |
| Datasets | 29 |
| Papers | 24 |
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

Known gaps are tracked in [`TODO-data.md`](./TODO-data.md): 24 datasets lack BibTeX and all 10 leaderboards await rows.

**Dataset fields are not yet verified.** `size`, `license`, and `year` on dataset entries came from the original prototype and have had no field-level checking. Treat them as unconfirmed.

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

Built:

- Home, Tasks, and per-task detail pages (`/tasks/[id]`) with deep-linkable tabs, sortable dataset tables, and BibTeX copy
- Data layer, schemas, and validator
- CI, GitHub Pages deployment, nightly link check

Not built yet:

- Datasets, Papers, Tools, Contribute, and About views — these routes currently serve placeholder pages
- `CONTRIBUTING.md`, issue and PR templates
- `scripts/discover.ts`, the arXiv / ACL / Hugging Face ingestion stub

## Contributing

Add or edit a YAML file under `/data` and open a pull request. CI runs `npm run validate` on every PR; it must pass before merge. Do not add a score, citation count, or BibTeX entry you cannot source.

## Design reference

The visual design originated as a Claude Design prototype. `design-reference/data.js` holds the original catalog data the YAML was migrated from; it is kept for provenance and is not used at build time.

## License

Site code is MIT. Catalog entries link to third-party resources that carry their own licenses — see each entry's `license` field.
