/**
 * Build the Hugging Face Space mirror (kishormorol/BanglaNLP-Hub).
 *
 * Modes:
 *   npm run build:hf-space              build, rewrite and verify into ./dist-hf
 *   npm run build:hf-space -- --upload  also push ./dist-hf to the Space
 *
 * A static Space serves exact file paths from the domain root and has no
 * directory indexes, so the Pages build cannot be copied across as-is. Three
 * things have to change, and all three are done here rather than in the source
 * so the Pages build stays the plain, canonical one:
 *
 *   1. Routes. HF_SPACE=1 makes Astro emit `tasks/ner.html` instead of
 *      `tasks/ner/index.html` (see astro.config.mjs), but the links themselves
 *      are hand-built from `${base}/...` in a dozen components, so every
 *      root-relative page link in the HTML — and every `href` in the
 *      build-time search index behind the nav search box — is rewritten to the
 *      file that actually exists.
 *   2. Canonical URLs. The mirror must not compete with Pages in search
 *      results, so canonical/og:url/og:image point back at the Pages site.
 *   3. The Space card (README.md), with counts derived from /data.
 *
 * The rewrite is a post-build pass over emitted files rather than a helper in
 * the source because it cannot then miss a call site. Nothing is uploaded
 * until every internal link resolves to a file in the build — see verify().
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'dist-hf');
const dataDir = resolve(root, 'data');

const REPO_ID = 'kishormorol/BanglaNLP-Hub';
const PAGES_ORIGIN = 'https://kishormorol.github.io';
const PAGES_BASE = '/BanglaNLP-Hub';

const upload = process.argv.slice(2).includes('--upload');

/** Every file under `dir`, as paths relative to it, with forward slashes. */
function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(relative(outDir, full).split('\\').join('/'));
  }
  return out;
}

/**
 * `/tasks/ner#datasets` -> `/tasks/ner.html#datasets`.
 * Anything already carrying an extension (`.css`, `.html`, `.png`) is left be,
 * and so is the bare root, which the Space resolves to index.html itself.
 */
function asFilePath(link: string): string {
  const [path, ...rest] = link.split(/(?=[#?])/);
  const tail = rest.join('');
  if (path === '/' || /\.[a-z0-9]+$/i.test(path)) return link;
  return `${path}.html${tail}`;
}

/** The Pages URL a mirrored file corresponds to: tasks/ner.html -> /tasks/ner/ */
function pagesUrl(file: string): string {
  const route = file.replace(/index\.html$/, '').replace(/\.html$/, '/');
  return `${PAGES_ORIGIN}${PAGES_BASE}/${route}`;
}

function build(): void {
  console.log('building with HF_SPACE=1 ...');
  execFileSync('npx', ['astro', 'build'], {
    stdio: 'inherit',
    env: { ...process.env, HF_SPACE: '1' },
  });
}

function rewriteHtml(files: string[]): number {
  let links = 0;
  let heads = 0;
  for (const file of files.filter((f) => f.endsWith('.html'))) {
    const full = join(outDir, file);
    let html = readFileSync(full, 'utf8');

    html = html.replace(/(href|src)="(\/[^"]*)"/g, (whole, attr: string, link: string) => {
      const fixed = asFilePath(link);
      if (fixed !== link) links++;
      return `${attr}="${fixed}"`;
    });

    // Point the mirror's own metadata at the canonical Pages site. og:image
    // must stay absolute or crawlers drop the card entirely.
    const canonical = pagesUrl(file);
    const before = html;
    html = html
      .replace(/(<link rel="canonical" href=")[^"]*"/, `$1${canonical}"`)
      .replace(/(<meta property="og:url" content=")[^"]*"/, `$1${canonical}"`)
      .replace(
        /(<meta (?:property="og:image"|name="twitter:image") content=")[^"]*"/g,
        `$1${PAGES_ORIGIN}${PAGES_BASE}/og.png"`,
      );
    if (html !== before) heads++;

    writeFileSync(full, html);
  }
  console.log(`rewrote ${links} links across HTML, and the head of ${heads} pages`);
  return links;
}

function rewriteSearchIndex(): number {
  const full = join(outDir, 'search-index.json');
  if (!existsSync(full)) throw new Error('search-index.json missing from the build');
  const entries = JSON.parse(readFileSync(full, 'utf8')) as { href?: string }[];
  let n = 0;
  for (const entry of entries) {
    if (typeof entry.href === 'string' && entry.href.startsWith('/')) {
      const fixed = asFilePath(entry.href);
      if (fixed !== entry.href) n++;
      entry.href = fixed;
    }
  }
  writeFileSync(full, JSON.stringify(entries));
  console.log(`rewrote ${n} of ${entries.length} search-index.json hrefs`);
  return n;
}

/** Counts derived from /data, never written down — mirrors src/lib/data.ts. */
function counts(): Record<string, number> {
  const inDir = (dir: string) =>
    readdirSync(resolve(dataDir, dir))
      .filter((f) => f.endsWith('.yaml'))
      .reduce((n, f) => {
        const list = parse(readFileSync(resolve(dataDir, dir, f), 'utf8'));
        return n + (Array.isArray(list) ? list.length : 0);
      }, 0);
  const inFile = (file: string) => {
    const list = parse(readFileSync(resolve(dataDir, file), 'utf8'));
    return Array.isArray(list) ? list.length : 0;
  };
  return {
    papers: inDir('papers'),
    datasets: inDir('datasets'),
    models: inFile('models.yaml'),
    tools: inFile('tools.yaml'),
    tasks: inFile('tasks.yaml'),
  };
}

function writeCard(): void {
  const template = readFileSync(resolve(root, 'scripts/hf-space-card.md'), 'utf8');
  const stats = counts();
  const card = template.replace(/\{\{(\w+)\}\}/g, (whole, key: string) => {
    if (!(key in stats)) throw new Error(`hf-space-card.md asks for unknown count {{${key}}}`);
    return String(stats[key]);
  });
  writeFileSync(join(outDir, 'README.md'), card);
  console.log(`wrote the Space card: ${Object.entries(stats).map(([k, v]) => `${v} ${k}`).join(', ')}`);
}

/**
 * Refuse to publish a mirror that links to files it does not contain. This is
 * what makes the blunt regex rewrite above safe to trust.
 */
function verify(files: string[]): void {
  const present = new Set(files);
  const dead = new Map<string, string[]>();
  const note = (target: string, source: string) => {
    if (present.has(target)) return;
    dead.set(target, [...(dead.get(target) ?? []), source]);
  };

  for (const file of files.filter((f) => f.endsWith('.html'))) {
    const html = readFileSync(join(outDir, file), 'utf8');
    for (const [, , link] of html.matchAll(/(href|src)="(\/[^"]*)"/g)) {
      const path = link.split(/[#?]/)[0].replace(/^\//, '');
      note(path === '' ? 'index.html' : path, file);
    }
  }
  const entries = JSON.parse(readFileSync(join(outDir, 'search-index.json'), 'utf8')) as {
    href?: string;
  }[];
  for (const entry of entries) {
    if (typeof entry.href === 'string' && entry.href.startsWith('/')) {
      note(entry.href.split(/[#?]/)[0].replace(/^\//, ''), 'search-index.json');
    }
  }

  if (dead.size) {
    for (const [target, sources] of dead) {
      console.error(`  /${target} — linked from ${[...new Set(sources)].slice(0, 3).join(', ')}`);
    }
    throw new Error(`${dead.size} internal link(s) point at files the mirror does not contain`);
  }
  console.log(`verified: every internal link across ${files.length} files resolves`);
}

function push(): void {
  // Presence on PATH is not enough: `huggingface-cli` predates `upload`, and an
  // old one (Anaconda ships such a build) would fail after the whole rebuild.
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
        'with a write token, or upload ./dist-hf by hand',
    );
  }
  console.log(`uploading ./dist-hf to ${REPO_ID} with ${cli} ...`);
  execFileSync(
    cli,
    [
      'upload',
      REPO_ID,
      outDir,
      '.',
      '--repo-type=space',
      '--commit-message=Rebuild the Space mirror from the current catalog',
    ],
    { stdio: 'inherit' },
  );
}

build();
const files = walk(outDir);
rewriteHtml(files);
rewriteSearchIndex();
writeCard();
verify(walk(outDir));
if (upload) push();
else console.log('built ./dist-hf — re-run with `-- --upload` to publish it');
