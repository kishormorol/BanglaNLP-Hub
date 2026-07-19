/**
 * Build-time data access. Reads /data YAML once per build, validates against the
 * Zod schemas, and exposes typed collections.
 *
 * Everything here runs at build time only — none of it is shipped to the client.
 * Pages must render from these collections; nothing may be hardcoded or invented.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { parse } from 'yaml';
import {
  TaskSchema,
  DatasetSchema,
  PaperSchema,
  ModelSchema,
  ToolSchema,
  LeaderboardSchema,
  VenuesSchema,
  type Task,
  type Dataset,
  type Paper,
  type Model,
  type Tool,
  type Leaderboard,
  type VenueToneName,
} from './schemas.ts';

const dataDir = resolve(process.cwd(), 'data');

const readYaml = (path: string) => parse(readFileSync(path, 'utf8'));

function loadList<T>(file: string, schema: { parse: (v: unknown) => T }): T[] {
  const raw = readYaml(resolve(dataDir, file));
  if (!Array.isArray(raw)) throw new Error(`${file}: expected a YAML list`);
  return raw.map((entry) => schema.parse(entry));
}

function loadTaskDir<T>(sub: string, schema: { parse: (v: unknown) => T }): T[] {
  const dir = resolve(dataDir, sub);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.yaml'))
    .sort()
    .flatMap((f) => {
      const raw = readYaml(resolve(dir, f));
      if (!Array.isArray(raw)) throw new Error(`${sub}/${f}: expected a YAML list`);
      return raw.map((entry) => schema.parse(entry));
    });
}

export const tasks: Task[] = loadList('tasks.yaml', TaskSchema);
export const datasets: Dataset[] = loadTaskDir('datasets', DatasetSchema);
export const papers: Paper[] = loadTaskDir('papers', PaperSchema);
export const models: Model[] = loadTaskDir('models', ModelSchema);
export const tools: Tool[] = loadList('tools.yaml', ToolSchema);
export const venues: Record<string, VenueToneName> = VenuesSchema.parse(
  readYaml(resolve(dataDir, 'venues.yaml')),
);

/** Leaderboards keyed by task id. Empty array = nothing curated yet. */
export const leaderboards: Record<string, Leaderboard[]> = Object.fromEntries(
  (existsSync(resolve(dataDir, 'leaderboards'))
    ? readdirSync(resolve(dataDir, 'leaderboards')).filter((f) => f.endsWith('.yaml'))
    : []
  ).map((f) => {
    const raw = readYaml(resolve(dataDir, 'leaderboards', f));
    const list = Array.isArray(raw) ? raw.map((e) => LeaderboardSchema.parse(e)) : [];
    return [basename(f, '.yaml'), list];
  }),
);

/** Headline counts — always derived, never written down. */
export const stats = {
  papers: papers.length,
  datasets: datasets.length,
  models: models.length,
  tools: tools.length,
};

export const byTask = {
  datasets: (id: string) => datasets.filter((d) => d.task === id),
  papers: (id: string) => papers.filter((p) => p.task === id),
  models: (id: string) => models.filter((m) => m.task === id),
  leaderboards: (id: string) => leaderboards[id] ?? [],
};

/** Venue badge tones, mirroring the prototype's `tone()` helper. */
export function venueTone(venue: string): { fg: string; bg: string } {
  const tone = venues[venue] ?? 'gray';
  const map: Record<VenueToneName, [string, string]> = {
    green: ['var(--green)', 'var(--greenSoft)'],
    red: ['var(--red)', 'var(--redSoft)'],
    blue: ['var(--blue)', 'var(--blueSoft)'],
    gold: ['var(--gold)', 'var(--goldSoft)'],
    gray: ['var(--gray)', 'var(--graySoft)'],
  };
  const [fg, bg] = map[tone];
  return { fg, bg };
}

/** Resource-type tones used by the Home "Recently added" feed. */
export const typeTone: Record<string, { fg: string; bg: string }> = {
  Dataset: { fg: 'var(--green)', bg: 'var(--greenSoft)' },
  Paper: { fg: 'var(--red)', bg: 'var(--redSoft)' },
  Model: { fg: 'var(--blue)', bg: 'var(--blueSoft)' },
  Tool: { fg: 'var(--gold)', bg: 'var(--goldSoft)' },
};

export type RecentEntry = {
  type: 'Dataset' | 'Model' | 'Tool';
  name: string;
  task: string;
  date: string;
  href: string;
};

const taskName = (id: string) => tasks.find((t) => t.id === id)?.name ?? id;

/**
 * "Recently added" is DERIVED from the catalog, not curated: the most recently
 * link-verified datasets, models, and tools.
 *
 * Papers are excluded on purpose — they carry only a publication `year`, no
 * `verified` date, so ranking them alongside dated entries would mean inventing
 * a precision the data does not have.
 */
export function recentlyAdded(limit = 6): RecentEntry[] {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const entries: RecentEntry[] = [
    ...datasets.map((d) => ({
      type: 'Dataset' as const,
      name: d.name,
      task: taskName(d.task),
      date: d.verified,
      href: `${base}/tasks/${d.task}#datasets`,
    })),
    ...models.map((m) => ({
      type: 'Model' as const,
      name: m.name,
      task: taskName(m.task),
      date: m.verified,
      href: `${base}/tasks/${m.task}#models`,
    })),
    ...tools.map((t) => ({
      type: 'Tool' as const,
      name: t.name,
      task: 'Tooling',
      date: t.verified,
      href: `${base}/tools`,
    })),
  ];
  return entries
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, limit);
}

export type SearchEntry = { type: string; name: string; meta: string; href: string };

/**
 * Search index, built here and emitted as a static JSON blob by
 * src/pages/search-index.json.ts. Mirrors the prototype's searchIndex().
 */
export function searchIndex(): SearchEntry[] {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return [
    ...tasks.map((t) => ({ type: 'Task', name: t.name, meta: t.bn, href: `${base}/tasks/${t.id}` })),
    ...datasets.map((d) => ({
      type: 'Dataset',
      name: d.name,
      meta: d.size,
      href: `${base}/tasks/${d.task}#datasets`,
    })),
    ...papers.map((p) => ({
      type: 'Paper',
      name: p.title,
      meta: `${p.venue} ${p.year}`,
      href: `${base}/tasks/${p.task}#papers`,
    })),
    ...models.map((m) => ({
      type: 'Model',
      name: m.name,
      meta: `${m.arch} · ${m.params}`,
      href: m.link,
    })),
    ...tools.map((t) => ({ type: 'Tool', name: t.name, meta: t.desc.slice(0, 50), href: `${base}/tools` })),
  ];
}
