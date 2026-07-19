/**
 * One-off migration: design-reference/data.js -> /data YAML tree.
 *
 * Data-honesty rules enforced here (see CONTRIBUTING.md):
 *   - Leaderboard STRUCTURE is preserved but every `rows` array is emptied.
 *     The prototype's scores were illustrative and are not reproduced.
 *   - `stars` counts on tools are dropped (the data.js header marks them illustrative).
 *   - `bibtex` is emitted only where data.js actually had one; never synthesised.
 *   - Nothing is invented to fill a missing field.
 *
 * Re-running this OVERWRITES /data. It exists for provenance and re-derivation,
 * not for routine edits — after migration, edit the YAML directly.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stringify } from 'yaml';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = resolve(root, 'data');

const src = await import(resolve(root, 'design-reference/data.js'));
const { TASKS, DATASETS, PAPERS, MODELS, TOOLS, LEADERBOARDS, RECENT, VENUE_TONES } = src;

const write = (rel: string, obj: unknown) => {
  const path = resolve(dataDir, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, stringify(obj, { lineWidth: 0 }), 'utf8');
  return path;
};

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const byTask = <T extends { task: string }>(rows: T[]) => {
  const out = new Map<string, T[]>();
  for (const r of rows) {
    if (!out.has(r.task)) out.set(r.task, []);
    out.get(r.task)!.push(r);
  }
  return out;
};

// ---- tasks -----------------------------------------------------------------
write('tasks.yaml', TASKS);

// ---- datasets --------------------------------------------------------------
const missingBibtex: { id: string; name: string; task: string }[] = [];
for (const [task, rows] of byTask(DATASETS)) {
  const entries = rows.map((d: any) => {
    const e: Record<string, unknown> = {
      id: d.id,
      name: d.name,
      task: d.task,
      size: d.size,
      sizeN: d.sizeN,
      license: d.license,
      year: d.year,
      source: d.source,
      link: d.link,
      verified: d.verified,
      desc: d.desc,
    };
    // Omit entirely when absent — the UI hides the BibTeX button on falsy.
    if (d.bibtex) e.bibtex = d.bibtex;
    else missingBibtex.push({ id: d.id, name: d.name, task: d.task });
    return e;
  });
  write(`datasets/${task}.yaml`, entries);
}

// ---- papers ----------------------------------------------------------------
for (const [task, rows] of byTask(PAPERS)) {
  const entries = rows.map((p: any) => {
    const e: Record<string, unknown> = {
      id: p.id,
      title: p.title,
      authors: p.authors,
      venue: p.venue,
      year: p.year,
      link: p.link,
      task: p.task,
    };
    if (p.note) e.note = p.note; // '' in data.js means "no note"
    return e;
  });
  write(`papers/${task}.yaml`, entries);
}

// ---- models ----------------------------------------------------------------
// data.js models have no `id`; derive a stable one from the HF repo id / name.
const modelIds = new Set<string>();
for (const [task, rows] of byTask(MODELS)) {
  const entries = rows.map((m: any) => {
    let id = slug(m.name);
    while (modelIds.has(id)) id = `${id}-2`;
    modelIds.add(id);
    const e: Record<string, unknown> = {
      id,
      name: m.name,
      task: m.task,
      arch: m.arch,
      params: m.params,
      link: m.link,
      verified: m.verified,
    };
    if (m.note) e.note = m.note;
    return e;
  });
  write(`models/${task}.yaml`, entries);
}

// ---- leaderboards ----------------------------------------------------------
// Leaderboards in data.js referenced datasets by display name. The schema keys
// them by dataset *id* so the validator can enforce referential integrity;
// `label` preserves the prototype's display string (e.g. direction on FLORES).
const dsByName = new Map<string, string>(DATASETS.map((d: any) => [d.name, d.id]));

// Prototype labels that carry extra info (translation direction, split) and so do
// not string-match a dataset name. Hand-verified, one-to-one.
const DATASET_ALIASES: Record<string, string> = {
  'FLORES-200 bn→en': 'flores',
};

const resolveDataset = (label: string): string | null => {
  if (DATASET_ALIASES[label]) return DATASET_ALIASES[label];
  if (dsByName.has(label)) return dsByName.get(label)!;
  // Tolerate the prototype's decorated labels: "XL-Sum (bn)", "FLORES-200 bn→en".
  const base = label.replace(/\s*\(.*?\)\s*$/, '').trim();
  if (dsByName.has(base)) return dsByName.get(base)!;
  for (const [name, id] of dsByName) {
    if (label.startsWith(name) || name.startsWith(base)) return id;
  }
  return null;
};

const emptyLeaderboards: { task: string; dataset: string }[] = [];
const unresolved: string[] = [];
for (const task of TASKS.map((t: any) => t.id)) {
  const boards = (LEADERBOARDS as any)[task] ?? [];
  const entries = boards.map((b: any) => {
    const id = resolveDataset(b.dataset);
    if (!id) unresolved.push(`${task}: ${b.dataset}`);
    emptyLeaderboards.push({ task, dataset: b.dataset });
    return {
      dataset: id ?? b.dataset,
      label: b.dataset,
      metric: b.metric,
      // HONESTY RULE: prototype scores were illustrative. Structure kept, rows cleared.
      rows: [],
    };
  });
  write(`leaderboards/${task}.yaml`, entries);
}

// ---- tools -----------------------------------------------------------------
// `stars` intentionally dropped: data.js marks star counts as illustrative.
write(
  'tools.yaml',
  TOOLS.map((t: any) => ({
    id: slug(t.name),
    name: t.name,
    author: t.author,
    desc: t.desc,
    lang: t.lang,
    install: t.install,
    link: t.link,
    verified: t.verified,
  })),
);

// ---- venues ----------------------------------------------------------------
write('venues.yaml', VENUE_TONES);

// ---- recent ----------------------------------------------------------------
// Not in the requested tree, but the Home view renders it; kept so Home has a source.
write(
  'recent.yaml',
  RECENT.map((r: any) => ({ type: r.type, name: r.name, task: r.task, date: r.date })),
);

// ---- TODO-data.md ----------------------------------------------------------
const lines: string[] = [
  '# TODO: data gaps',
  '',
  'Generated by `npm run migrate`. These are *known* gaps, deliberately left empty',
  'rather than filled with invented values. Contributions welcome — see CONTRIBUTING.md.',
  '',
  '## Leaderboards with no curated rows',
  '',
  'Every leaderboard below has a real dataset and metric but **zero score rows**. The',
  'prototype shipped illustrative numbers; those were not migrated. Each of these renders',
  'the "No leaderboard curated yet — contribute via PR" empty state until rows are added',
  'with a citation to the paper the score comes from.',
  '',
  '| Task | Benchmark |',
  '| --- | --- |',
  ...emptyLeaderboards.map((e) => `| \`${e.task}\` | ${e.dataset} |`),
  '',
  '## Datasets missing BibTeX',
  '',
  'The BibTeX copy button is hidden for these entries. Add a `bibtex:` field with the',
  'entry from the ACL Anthology / publisher page — do not hand-write one.',
  '',
  '| Task | Dataset | id |',
  '| --- | --- | --- |',
  ...missingBibtex.map((d) => `| \`${d.task}\` | ${d.name} | \`${d.id}\` |`),
  '',
];
if (unresolved.length) {
  lines.push('## Leaderboards referencing an unknown dataset', '', ...unresolved.map((u) => `- ${u}`), '');
}
writeFileSync(resolve(root, 'TODO-data.md'), lines.join('\n'), 'utf8');

console.log(`tasks:        ${TASKS.length}`);
console.log(`datasets:     ${DATASETS.length}  (${missingBibtex.length} missing bibtex)`);
console.log(`papers:       ${PAPERS.length}`);
console.log(`models:       ${MODELS.length}`);
console.log(`tools:        ${TOOLS.length}  (stars dropped)`);
console.log(`leaderboards: ${emptyLeaderboards.length} benchmarks, all rows emptied`);
if (unresolved.length) console.log(`UNRESOLVED dataset refs: ${unresolved.join(', ')}`);
