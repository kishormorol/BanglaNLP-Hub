/**
 * Data validator. Run by `npm run validate`, and by CI on every PR.
 *
 * Fails the build on:
 *   1. missing / malformed required fields (per the Zod schemas)
 *   2. malformed URLs
 *   3. `verified` dates older than VERIFY_MAX_AGE_MONTHS
 *   4. duplicate ids within an entity type
 *   5. a leaderboard referencing a dataset id that does not exist
 *   6. an entry whose `task` is not a known task id
 *   7. a paper venue with no tone in venues.yaml
 *
 * Exits non-zero with a grouped, file-anchored report.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { z } from 'zod';
import {
  TaskSchema,
  DatasetSchema,
  PaperSchema,
  ModelSchema,
  ToolSchema,
  LeaderboardSchema,
  VenuesSchema,
  RecentSchema,
  ContributorSchema,
  VERIFY_MAX_AGE_MONTHS,
} from '../src/lib/schemas.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = resolve(root, 'data');

const errors: string[] = [];
const fail = (file: string, msg: string) => errors.push(`${file}: ${msg}`);

const rel = (p: string) => p.slice(root.length + 1);
const read = (p: string) => parse(readFileSync(p, 'utf8'));

/** Parse an array-of-entries YAML file against a schema. */
function loadList<T>(path: string, schema: z.ZodType<T>): T[] {
  const raw = read(path);
  const file = rel(path);
  if (!Array.isArray(raw)) {
    fail(file, 'expected a top-level YAML list');
    return [];
  }
  const out: T[] = [];
  raw.forEach((entry, i) => {
    const r = schema.safeParse(entry);
    if (r.success) {
      out.push(r.data);
    } else {
      const label = (entry && (entry.id ?? entry.name)) || `#${i}`;
      for (const issue of r.error.issues) {
        const at = issue.path.join('.') || '(root)';
        fail(file, `[${label}] ${at} ${issue.message}`);
      }
    }
  });
  return out;
}

function listDir(sub: string): string[] {
  const dir = resolve(dataDir, sub);
  if (!existsSync(dir)) {
    fail(`data/${sub}`, 'directory is missing');
    return [];
  }
  return readdirSync(dir)
    .filter((f) => f.endsWith('.yaml'))
    .map((f) => resolve(dir, f));
}

// ---- tasks (the referential backbone) --------------------------------------
const tasks = loadList(resolve(dataDir, 'tasks.yaml'), TaskSchema);
const taskIds = new Set(tasks.map((t) => t.id));

function checkDuplicates(kind: string, items: { id: string }[], where: Map<string, string>) {
  const seen = new Map<string, string>();
  for (const it of items) {
    const prev = seen.get(it.id);
    const file = where.get(it.id) ?? '?';
    if (prev) fail(file, `duplicate ${kind} id '${it.id}' (also in ${prev})`);
    else seen.set(it.id, file);
  }
}

const MAX_AGE_MS = VERIFY_MAX_AGE_MONTHS * 30.44 * 24 * 60 * 60 * 1000;
const now = Date.now();
function checkVerified(file: string, id: string, verified: string) {
  const age = now - Date.parse(verified);
  if (age > MAX_AGE_MS) {
    const months = Math.floor(age / (30.44 * 24 * 60 * 60 * 1000));
    fail(file, `[${id}] verified ${verified} is ${months} months old (max ${VERIFY_MAX_AGE_MONTHS}) — re-check the link and bump the date`);
  }
  if (Date.parse(verified) > now) fail(file, `[${id}] verified ${verified} is in the future`);
}

/** Load a per-task directory, checking the filename matches each entry's task. */
function loadTaskDir<T extends { id: string; task: string }>(
  sub: string,
  schema: z.ZodType<T>,
): { items: T[]; where: Map<string, string> } {
  const items: T[] = [];
  const where = new Map<string, string>();
  for (const path of listDir(sub)) {
    const file = rel(path);
    const expected = basename(path, '.yaml');
    if (!taskIds.has(expected)) fail(file, `filename '${expected}' is not a task id in tasks.yaml`);
    for (const entry of loadList(path, schema)) {
      if (entry.task !== expected) fail(file, `[${entry.id}] task '${entry.task}' does not match filename '${expected}'`);
      if (!taskIds.has(entry.task)) fail(file, `[${entry.id}] unknown task '${entry.task}'`);
      if (!where.has(entry.id)) where.set(entry.id, file);
      items.push(entry);
    }
  }
  return { items, where };
}

const datasets = loadTaskDir('datasets', DatasetSchema);
const papers = loadTaskDir('papers', PaperSchema);
const models = loadTaskDir('models', ModelSchema);

checkDuplicates('task', tasks, new Map(tasks.map((t) => [t.id, 'data/tasks.yaml'])));
checkDuplicates('dataset', datasets.items, datasets.where);
checkDuplicates('paper', papers.items, papers.where);
checkDuplicates('model', models.items, models.where);

for (const d of datasets.items) checkVerified(datasets.where.get(d.id)!, d.id, d.verified);
for (const m of models.items) checkVerified(models.where.get(m.id)!, m.id, m.verified);

// ---- tools -----------------------------------------------------------------
const toolsPath = resolve(dataDir, 'tools.yaml');
const tools = loadList(toolsPath, ToolSchema);
checkDuplicates('tool', tools, new Map(tools.map((t) => [t.id, 'data/tools.yaml'])));
for (const t of tools) checkVerified('data/tools.yaml', t.id, t.verified);

// ---- venues ----------------------------------------------------------------
const venuesRaw = read(resolve(dataDir, 'venues.yaml'));
const venuesParsed = VenuesSchema.safeParse(venuesRaw);
if (!venuesParsed.success) {
  for (const issue of venuesParsed.error.issues) {
    fail('data/venues.yaml', `${issue.path.join('.') || '(root)'} ${issue.message}`);
  }
}
const venues = venuesParsed.success ? venuesParsed.data : {};
for (const p of papers.items) {
  if (!(p.venue in venues)) {
    fail(papers.where.get(p.id)!, `[${p.id}] venue '${p.venue}' has no tone in data/venues.yaml`);
  }
}

// ---- leaderboards ----------------------------------------------------------
const datasetIds = new Set(datasets.items.map((d) => d.id));
for (const path of listDir('leaderboards')) {
  const file = rel(path);
  const expected = basename(path, '.yaml');
  if (!taskIds.has(expected)) fail(file, `filename '${expected}' is not a task id in tasks.yaml`);
  for (const board of loadList(path, LeaderboardSchema)) {
    if (!datasetIds.has(board.dataset)) {
      fail(file, `leaderboard '${board.label}' references unknown dataset id '${board.dataset}'`);
    } else {
      const ds = datasets.items.find((d) => d.id === board.dataset)!;
      if (ds.task !== expected) {
        fail(file, `leaderboard '${board.label}' references dataset '${ds.id}' which belongs to task '${ds.task}'`);
      }
    }
  }
}

// ---- recent ----------------------------------------------------------------
const recentPath = resolve(dataDir, 'recent.yaml');
if (existsSync(recentPath)) loadList(recentPath, RecentSchema);

// ---- contributors ----------------------------------------------------------
// A credit is only allowed for a resource actually in the catalog. For a paper
// or model, `title` and `task` must both match an existing entry; for a tool
// (which has no task), the name must match. No crediting a resource we do not
// carry.
const contributorsPath = resolve(dataDir, 'contributors.yaml');
if (existsSync(contributorsPath)) {
  const paperByTitle = new Map(papers.items.map((p) => [p.title, p]));
  const modelByName = new Map(models.items.map((m) => [m.name, m]));
  const toolByName = new Map(tools.map((t) => [t.name, t]));
  for (const c of loadList(contributorsPath, ContributorSchema)) {
    for (const e of c.entries) {
      if (e.kind === 'model') {
        const m = modelByName.get(e.title);
        if (!m) {
          fail('data/contributors.yaml', `[${c.github}] no catalog model named "${e.title}"`);
        } else if (m.task !== e.task) {
          fail(
            'data/contributors.yaml',
            `[${c.github}] "${e.title}" is task '${m.task}', not '${e.task}'`,
          );
        }
      } else if (e.kind === 'tool') {
        if (!toolByName.has(e.title)) {
          fail('data/contributors.yaml', `[${c.github}] no catalog tool named "${e.title}"`);
        }
      } else {
        const p = paperByTitle.get(e.title);
        if (!p) {
          fail('data/contributors.yaml', `[${c.github}] no catalog paper titled "${e.title}"`);
        } else if (p.task !== e.task) {
          fail(
            'data/contributors.yaml',
            `[${c.github}] "${e.title}" is task '${p.task}', not '${e.task}'`,
          );
        }
      }
    }
  }
}

// ---- report ----------------------------------------------------------------
if (errors.length) {
  const byFile = new Map<string, string[]>();
  for (const e of errors) {
    const idx = e.indexOf(': ');
    const f = e.slice(0, idx);
    if (!byFile.has(f)) byFile.set(f, []);
    byFile.get(f)!.push(e.slice(idx + 2));
  }
  console.error(`\n✗ data validation failed — ${errors.length} problem(s)\n`);
  for (const [file, msgs] of [...byFile].sort()) {
    console.error(`  ${file}`);
    for (const m of msgs) console.error(`    · ${m}`);
    console.error('');
  }
  process.exit(1);
}

const emptyBoards = listDir('leaderboards')
  .flatMap((p) => (read(p) as { rows: unknown[] }[]) ?? [])
  .filter((b) => b.rows.length === 0).length;

console.log('✓ data validation passed');
console.log(`  ${tasks.length} tasks · ${datasets.items.length} datasets · ${papers.items.length} papers · ${models.items.length} models · ${tools.length} tools`);
console.log(`  ${datasets.items.filter((d) => !d.bibtex).length} datasets without BibTeX, ${emptyBoards} leaderboards awaiting rows (see TODO-data.md)`);
