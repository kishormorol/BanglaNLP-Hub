# BanglaNLP Hub — working notes

Static Astro + TypeScript catalog of Bangla NLP resources. Deploys to GitHub Pages
at base `/BanglaNLP-Hub`. See README.md for the project overview.

(`CLAUDE.md` is a symlink to this file.)

## Data honesty — the rule that matters most

This catalog's only value is that its contents are true. **Never write a value you
cannot source.**

- No invented scores, citation counts, star counts, or BibTeX. If a field is
  unknown, omit it — the UI already hides the affected element.
- All 10 leaderboards intentionally have `rows: []`. Do not populate them with
  plausible numbers. Rows require a citation to the paper the score came from.
- Do not "fix" a broken entry by guessing a replacement URL. Verify it first.

### This data has a fabrication history

The catalog was migrated from a Claude Design prototype (`design-reference/data.js`)
headed "Real resources where known". A meaningful fraction was not real. Removed so far:

| Entry | Problem |
| --- | --- |
| `sagorsarker/bangla-bert-sentiment` | model does not exist; owner publishes 17 models, none for sentiment |
| `bsti` | duplicate of `banglanlg` under an invented title |
| `udbru-p` | no such paper; the UD treebank README has a placeholder `(citation)` |
| leaderboard scores | all illustrative |
| tool star counts | all illustrative |

Also corrected: two papers whose ACL links resolved fine but pointed at *entirely
different papers*, and several truncated or invented titles and venues.

**Implication:** a link returning 200 proves nothing about whether the metadata is
right. When touching an entry, verify it against the authoritative source — ACL
Anthology `.bib`, the arXiv API, or the Hugging Face API.

**Dataset fields are still unaudited.** `size`, `sizeN`, `license`, and `year` have
never been checked. `udbru` is already suspect (claims UD v2.13/2023; the treebank
landed in v2.9/2021).

## The design specs are NOT in this repo

`design-reference/` contains only `data.js`. The authoritative view specs are nine
`.dc.html` files in a Claude Design project:

- projectId `b7cfcb1b-9dd2-4bb9-b0b9-01b270c21f61` ("BanglaNLP Hub Design")
- read them with the `DesignSync` tool (`method: "get_file"`)

Verify with `ls design-reference/` before planning — do not assume a spec is on disk
because a task description says so. `DesignSync` is a main-conversation tool and is
**not available to subagents**, so spec fetching cannot be delegated; only porting can.

## Conventions

- **No client framework.** Vanilla JS islands only, and only where interaction
  requires them: catalog search, theme toggle, task tabs, table sort, BibTeX copy.
- **Design tokens** live in `src/styles/global.css`, transcribed verbatim from the
  prototype. Do not hand-tune them.
- **Bangla text** uses `class="bn"` (Noto Serif Bengali, `line-height: 1.6`). Every
  Bangla string needs it.
- **Internal links** must be prefixed with `import.meta.env.BASE_URL`, or they break
  under the project Pages path.
- **Pages render only from `/data`** via `src/lib/data.ts`. Never hardcode a count or
  an entry. Empty states are correct output, not gaps to fill.
- **Search** is one shared island (`Search.astro`) used by both the nav and the Home
  hero, backed by a build-time `search-index.json`.
- Tabs deep-link by hash: `/tasks/sentiment#leaderboard`.

## Commands

```
npm run dev          dev server on localhost:4321
npm run build        build to ./dist/
npm run validate     validate /data against the Zod schemas
npm run check-links  probe every link: URL in /data
```

`npm run validate` must pass before committing; CI runs it on every PR and it gates
deployment. It fails on malformed fields, bad URLs, `verified` dates older than 12
months, duplicate ids, and leaderboards referencing an unknown dataset id.

`check-links` treats 401/403/429 as bot-blocked rather than dead — publishers like
MDPI refuse non-browser agents.

## Verifying changes

Build output alone is not verification. For view changes, drive the real pages
(Playwright against `npm run preview`) and check both light and dark themes. Past
regressions found this way: a missing favicon 404ing outside the base path, and a
link check whose regex matched `href="` inside bundled JS.

## Astro reference

Docs: https://docs.astro.build — routing, components, and styling guides are the
relevant ones. Dev server supports background mode: `astro dev --background`, managed
with `astro dev stop | status | logs`.

## Not built yet

Datasets, Papers, Tools, Contribute, and About views (these routes serve placeholder
pages), `CONTRIBUTING.md` plus issue/PR templates, and `scripts/discover.ts`.
