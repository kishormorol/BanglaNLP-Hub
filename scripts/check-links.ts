/**
 * Link checker for every `link:` URL in /data.
 *
 * Modes:
 *   npm run check-links                  check every link in /data
 *   npm run check-links -- --changed REF only links added/changed vs REF
 *   npm run check-links -- --report FILE also write a markdown report
 *
 * Never mutates /data. Dead links are reported for a human to triage —
 * entries are never auto-removed (see CONTRIBUTING.md).
 */
import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, join } from 'node:path';
import { parse } from 'yaml';

const root = resolve(process.cwd());
const dataDir = resolve(root, 'data');

const args = process.argv.slice(2);
const argOf = (flag: string) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const changedRef = argOf('--changed');
const reportPath = argOf('--report');
const CONCURRENCY = 8;
const TIMEOUT_MS = 20_000;

type Link = { url: string; where: string; name: string };

function yamlFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return yamlFiles(p);
    return e.name.endsWith('.yaml') ? [p] : [];
  });
}

/** Collect every link with the file and entry it belongs to. */
function collect(): Link[] {
  const out: Link[] = [];
  for (const file of yamlFiles(dataDir)) {
    const rel = file.slice(root.length + 1);
    const doc = parse(readFileSync(file, 'utf8'));
    const entries = Array.isArray(doc) ? doc : [];
    for (const e of entries) {
      if (e && typeof e.link === 'string') {
        out.push({ url: e.link, where: rel, name: e.name ?? e.id ?? e.title ?? '?' });
      }
    }
  }
  return out;
}

/** URLs added or modified in the diff against `ref`, restricted to /data. */
function changedUrls(ref: string): Set<string> {
  const urls = new Set<string>();
  try {
    const diff = execFileSync('git', ['diff', '--unified=0', `${ref}...HEAD`, '--', 'data/'], {
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
    });
    for (const line of diff.split('\n')) {
      if (!line.startsWith('+') || line.startsWith('+++')) continue;
      const m = line.match(/link:\s*(\S+)/);
      if (m) urls.add(m[1].replace(/^['"]|['"]$/g, ''));
    }
  } catch (err) {
    console.error(`could not diff against ${ref}: ${(err as Error).message}`);
    process.exit(1);
  }
  return urls;
}

/**
 * 401/403/429 mean "a bot was refused", not "the resource is gone". Publishers
 * like MDPI and Cloudflare-fronted hosts do this to any non-browser agent.
 * Reporting them as dead trains maintainers to ignore the nightly issue, so
 * they are surfaced separately and never fail the run.
 */
const BLOCKED_STATUSES = new Set(['401', '403', '429']);

async function probe(url: string): Promise<{ ok: boolean; status: string }> {
  // HEAD first; many hosts (GitHub raw, Kaggle, some publishers) reject it,
  // so fall back to a ranged GET before calling a link dead.
  for (const method of ['HEAD', 'GET'] as const) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method,
        redirect: 'follow',
        signal: ctrl.signal,
        headers: {
          // Some sites 403 an unknown agent; identify honestly.
          'User-Agent': 'BanglaNLP-Hub-link-check/1.0 (+https://github.com/kishormorol/BanglaNLP-Hub)',
          ...(method === 'GET' ? { Range: 'bytes=0-2048' } : {}),
        },
      });
      clearTimeout(timer);
      if (res.ok || res.status === 206) return { ok: true, status: String(res.status) };
      if (method === 'GET') return { ok: false, status: String(res.status) };
    } catch (err) {
      clearTimeout(timer);
      if (method === 'GET') {
        return { ok: false, status: (err as Error).name === 'AbortError' ? 'timeout' : 'network error' };
      }
    }
  }
  return { ok: false, status: 'unknown' };
}

const all = collect();
const filter = changedRef ? changedUrls(changedRef) : null;
const links = filter ? all.filter((l) => filter.has(l.url)) : all;

// Same URL can appear on several entries; probe each distinct URL once.
const distinct = [...new Set(links.map((l) => l.url))];

if (!distinct.length) {
  console.log(changedRef ? 'No data links added or changed in this PR.' : 'No links found in /data.');
  process.exit(0);
}

console.log(`Checking ${distinct.length} link(s)${changedRef ? ` changed vs ${changedRef}` : ''}…\n`);

type Finding = { url: string; status: string; entries: Link[] };
const failures: Finding[] = [];
const blocked: Finding[] = [];
let done = 0;

async function worker(queue: string[]) {
  for (;;) {
    const url = queue.shift();
    if (!url) return;
    const { ok, status } = await probe(url);
    done++;
    if (ok) continue;
    const finding = { url, status, entries: links.filter((l) => l.url === url) };
    if (BLOCKED_STATUSES.has(status)) {
      blocked.push(finding);
      console.log(`  ⚠ ${status.padEnd(14)} ${url} (bot-blocked, not treated as dead)`);
    } else {
      failures.push(finding);
      console.log(`  ✗ ${status.padEnd(14)} ${url}`);
    }
  }
}

const queue = [...distinct];
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, () => worker(queue)));

console.log(
  `\n${done - failures.length - blocked.length}/${done} reachable` +
    (blocked.length ? `, ${blocked.length} bot-blocked` : '') +
    (failures.length ? `, ${failures.length} dead.` : '.'),
);

if (reportPath) {
  const blockedSection = blocked.length
    ? [
        '',
        '<details><summary>' +
          `${blocked.length} link(s) refused an automated request (401/403/429)</summary>`,
        '',
        'These are almost certainly reachable in a browser — publishers and CDNs block',
        'non-browser agents. Listed for awareness only; no action is usually needed.',
        '',
        '| Status | Entry | URL |',
        '| --- | --- | --- |',
        ...blocked.flatMap((f) => f.entries.map((e) => `| \`${f.status}\` | ${e.name} | ${f.url} |`)),
        '',
        '</details>',
      ]
    : [];

  const lines = failures.length
    ? [
        `${failures.length} dead link(s) found in \`/data\` on ${new Date().toISOString().slice(0, 10)}.`,
        '',
        'These entries are **not** removed automatically. Please verify each one and either',
        'update the `link:` field or open a PR removing the entry with a note.',
        '',
        '| Status | Entry | File | URL |',
        '| --- | --- | --- | --- |',
        ...failures.flatMap((f) =>
          f.entries.map((e) => `| \`${f.status}\` | ${e.name} | \`${e.where}\` | ${f.url} |`),
        ),
        ...blockedSection,
      ]
    : ['All links in `/data` are reachable. ✅', ...blockedSection];
  writeFileSync(reportPath, lines.join('\n'), 'utf8');
}

// Bot-blocked links never fail the run.
process.exit(failures.length ? 1 : 0);
