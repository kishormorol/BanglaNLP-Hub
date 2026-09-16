/**
 * Export the catalog as the Hugging Face dataset kishormorol/bangla-nlp-catalog.
 *
 * Modes:
 *   npm run export:hf-dataset              write ./dist-hf-dataset/
 *   npm run export:hf-dataset -- --upload  also push it to the Hub
 *
 * The dataset is a snapshot of /data, and it was previously uploaded by hand —
 * which is how it came to sit at 712 papers and 13 tasks while the repo had 813
 * and 26. Exporting it from /data means the snapshot can only ever be stale, not
 * wrong, and re-publishing is a command rather than something to remember how
 * to do.
 *
 * Rows are the YAML entries as-is, validated against the same Zod schemas the
 * site and CI use, so a row that would fail `npm run validate` can never reach
 * the Hub. Field order is pinned per entity type: the JSONL is regenerated in
 * full every run, and a stable order keeps the diff to what actually changed.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { z } from 'zod';
import {
  DatasetSchema,
  ModelSchema,
  PaperSchema,
  TaskSchema,
  ToolSchema,
} from '../src/lib/schemas.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = resolve(root, 'data');
const outDir = resolve(root, 'dist-hf-dataset');

const REPO_ID = 'kishormorol/bangla-nlp-catalog';
const upload = process.argv.slice(2).includes('--upload');

const read = (path: string) => parse(readFileSync(path, 'utf8'));

/** Entries from every YAML file in a per-task directory, in filename order. */
function fromDir<T>(dir: string, schema: z.ZodType<T>): T[] {
  const files = readdirSync(resolve(dataDir, dir))
    .filter((f) => f.endsWith('.yaml'))
    .sort();
  return files.flatMap((file) => {
    const raw = read(resolve(dataDir, dir, file));
    if (!Array.isArray(raw)) throw new Error(`data/${dir}/${file}: expected a top-level list`);
    return raw.map((entry, i) => {
      const parsed = schema.safeParse(entry);
      if (!parsed.success) {
        throw new Error(`data/${dir}/${file} #${i + 1}: ${parsed.error.issues[0]?.message}`);
      }
      return parsed.data;
    });
  });
}

function fromFile<T>(file: string, schema: z.ZodType<T>): T[] {
  const raw = read(resolve(dataDir, file));
  if (!Array.isArray(raw)) throw new Error(`data/${file}: expected a top-level list`);
  return raw.map((entry, i) => {
    const parsed = schema.safeParse(entry);
    if (!parsed.success) {
      throw new Error(`data/${file} #${i + 1}: ${parsed.error.issues[0]?.message}`);
    }
    return parsed.data;
  });
}

/** Re-key an entry so the JSONL column order is stable across runs. */
function order<T extends object>(entry: T, keys: (keyof T)[]): Partial<T> {
  const out: Partial<T> = {};
  for (const key of keys) if (entry[key] !== undefined) out[key] = entry[key];
  for (const key of Object.keys(entry) as (keyof T)[]) {
    if (!(key in out) && entry[key] !== undefined) out[key] = entry[key];
  }
  return out;
}

const toJsonl = (rows: object[]) => rows.map((r) => JSON.stringify(r)).join('\n') + '\n';

/** The HF `size_categories` bucket the largest config falls in. */
function sizeCategory(max: number): string {
  if (max < 1_000) return 'n<1K';
  if (max < 10_000) return '1K<n<10K';
  if (max < 100_000) return '10K<n<100K';
  return '100K<n<1M';
}

const papers = fromDir('papers', PaperSchema).map((p) =>
  order(p, ['task', 'id', 'title', 'authors', 'venue', 'year', 'link']),
);
const datasets = fromDir('datasets', DatasetSchema).map((d) =>
  order(d, ['task', 'id', 'name', 'size', 'sizeN', 'license', 'year', 'source', 'link']),
);
const models = fromFile('models.yaml', ModelSchema).map((m) =>
  order(m, ['id', 'name', 'tasks', 'stage', 'arch', 'params', 'link']),
);
const tools = fromFile('tools.yaml', ToolSchema).map((t) =>
  order(t, ['id', 'name', 'author', 'desc', 'lang', 'install', 'link']),
);
const tasks = fromFile('tasks.yaml', TaskSchema);

const counts = {
  papers: papers.length,
  datasets: datasets.length,
  models: models.length,
  tools: tools.length,
  tasks: tasks.length,
};

// Every entry's task must be one the taxonomy knows, or a config would carry a
// label nothing in the catalog explains. validate.ts enforces this too; the
// export re-checks rather than trusting that it was run.
const known = new Set(tasks.map((t) => t.id));
const orphans = [...papers, ...datasets]
  .map((e) => (e as { task?: string; id?: string }))
  .filter((e) => e.task && !known.has(e.task));
if (orphans.length) {
  throw new Error(
    `${orphans.length} entr(ies) reference an unknown task, e.g. ${orphans[0]?.id} -> ${orphans[0]?.task}`,
  );
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, 'papers.jsonl'), toJsonl(papers));
writeFileSync(resolve(outDir, 'datasets.jsonl'), toJsonl(datasets));
writeFileSync(resolve(outDir, 'models.jsonl'), toJsonl(models));
writeFileSync(resolve(outDir, 'tools.jsonl'), toJsonl(tools));

const template = readFileSync(resolve(root, 'scripts/hf-dataset-card.md'), 'utf8');
const fills: Record<string, string | number> = {
  ...counts,
  sizeCategory: sizeCategory(Math.max(...Object.values(counts))),
};
const card = template.replace(/\{\{(\w+)\}\}/g, (whole, key: string) => {
  if (!(key in fills)) throw new Error(`hf-dataset-card.md asks for unknown value {{${key}}}`);
  return String(fills[key]);
});
writeFileSync(resolve(outDir, 'README.md'), card);

console.log(
  `exported ${Object.entries(counts)
    .map(([k, v]) => `${v} ${k}`)
    .join(', ')} to ./dist-hf-dataset/`,
);

if (!upload) {
  console.log('re-run with `-- --upload` to publish it');
} else {
  // Presence on PATH is not enough: `huggingface-cli` predates `upload`, and an
  // old one (Anaconda ships such a build) would fail after the whole export.
  const cli = ['hf', 'huggingface-cli'].find((bin) => {
    try {
      execFileSync(bin, ['upload', '--help'], { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  });
  if (!cli) {
    throw new Error(
      'no `hf` on PATH — install with `pip install huggingface_hub` and `hf auth login` ' +
        'with a write token, or upload ./dist-hf-dataset by hand',
    );
  }
  console.log(`uploading ./dist-hf-dataset to ${REPO_ID} with ${cli} ...`);
  execFileSync(
    cli,
    [
      'upload',
      REPO_ID,
      outDir,
      '.',
      '--repo-type=dataset',
      `--commit-message=Refresh the snapshot: ${counts.papers} papers across ${counts.tasks} tasks`,
    ],
    { stdio: 'inherit' },
  );
}
