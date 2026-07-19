/**
 * Discovery / ingestion stub.
 *
 *   npm run discover                 sweep all sources
 *   npm run discover -- --source acl only one of: acl | arxiv | hf
 *   npm run discover -- --limit 50   cap per-source candidates
 *
 * Sweeps ACL Anthology, arXiv, and the Hugging Face Hub for Bangla/Bengali NLP
 * resources, diffs them against what is already catalogued, and writes anything
 * new to data/inbox/candidates.yaml for human review.
 *
 * IT MUST NEVER WRITE INTO THE LIVE DATA FILES. Everything it emits is a
 * *candidate*: unverified, with a guessed task, and often with no license or size
 * information. Promoting a candidate means opening its link, confirming the
 * metadata against the source, filling in the missing fields, and moving it into
 * data/<kind>/<task>.yaml by hand — see CONTRIBUTING.md.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { gunzipSync } from 'node:zlib';
import { parse, stringify } from 'yaml';

const root = process.cwd();
const dataDir = resolve(root, 'data');
const inboxDir = resolve(dataDir, 'inbox');
const OUT = resolve(inboxDir, 'candidates.yaml');

// Hard guard: this script may only ever write inside data/inbox/.
if (!OUT.startsWith(inboxDir)) throw new Error('refusing to write outside data/inbox/');

const args = process.argv.slice(2);
const argOf = (f: string) => {
  const i = args.indexOf(f);
  return i >= 0 ? args[i + 1] : undefined;
};
const onlySource = argOf('--source');
const LIMIT = Number(argOf('--limit') ?? 60);
const UA = 'BanglaNLP-Hub-discover/1.0 (+https://github.com/kishormorol/BanglaNLP-Hub)';

const TERMS = /\b(bangla|bengali|banglish|bn-|bangladesh)/i;

type Candidate = {
  source: 'acl' | 'arxiv' | 'huggingface';
  kind: 'paper' | 'dataset' | 'model';
  title: string;
  link: string;
  year?: number;
  authors?: string;
  venue?: string;
  suggestedTask?: string;
  note?: string;
};

// ---------------------------------------------------------------- existing set
const norm = (s: string) =>
  String(s ?? '').toLowerCase().replace(/[{}]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const normUrl = (u: string) =>
  String(u ?? '').toLowerCase().replace(/^https?:\/\/(www\.)?/, '').replace(/\/+$/, '');

function listYaml(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return e.name === 'inbox' ? [] : listYaml(p);
    return e.name.endsWith('.yaml') ? [p] : [];
  });
}

const knownLinks = new Set<string>();
const knownTitles = new Set<string>();
for (const f of listYaml(dataDir)) {
  const doc = parse(readFileSync(f, 'utf8'));
  if (!Array.isArray(doc)) continue;
  for (const e of doc) {
    if (e?.link) knownLinks.add(normUrl(e.link));
    if (e?.title) knownTitles.add(norm(e.title));
    if (e?.name) knownTitles.add(norm(e.name));
  }
}
console.log(`Catalogued already: ${knownLinks.size} links, ${knownTitles.size} titles\n`);

const isNew = (c: Candidate) =>
  !knownLinks.has(normUrl(c.link)) && !knownTitles.has(norm(c.title));

/** Cheap keyword → task guess. Always a suggestion for a human to confirm. */
function guessTask(text: string): string | undefined {
  const t = text.toLowerCase();
  const rules: [RegExp, string][] = [
    [/sentiment|emotion|polarity/, 'sentiment'],
    [/named entity|\bner\b/, 'ner'],
    [/translat|parallel corpus|\bmt\b|paraphrase/, 'mt'],
    [/question answer|\bqa\b|reading comprehension/, 'qa'],
    [/summari/, 'summ'],
    [/hate|offensive|abusive|toxic/, 'hate'],
    [/speech|asr|tts|phonem|audio|voice/, 'speech'],
    [/fake news|news classif|document classif|text classif|topic/, 'textcls'],
    [/part.of.speech|\bpos tag|treebank|dependenc|morpholog/, 'pos'],
    [/\bllm\b|large language model|benchmark|instruction|gpt|reasoning/, 'llm'],
  ];
  return rules.find(([re]) => re.test(t))?.[1];
}

// ------------------------------------------------------------------------ ACL
async function fromAcl(): Promise<Candidate[]> {
  console.log('ACL Anthology: downloading anthology.bib.gz (~12 MB)…');
  const res = await fetch('https://aclanthology.org/anthology.bib.gz', { headers: { 'User-Agent': UA } });
  if (!res.ok) {
    console.error(`  ACL fetch failed: ${res.status}`);
    return [];
  }
  const bib = gunzipSync(Buffer.from(await res.arrayBuffer())).toString('utf8');
  const entries = bib.split(/\n@/).slice(1);
  console.log(`  parsed ${entries.length} anthology entries`);

  const field = (src: string, name: string) => {
    const m = src.match(new RegExp(`\\n\\s*${name}\\s*=\\s*"([\\s\\S]*?)"\\s*,?\\n`, 'i'));
    return m ? m[1].replace(/\s+/g, ' ').trim() : undefined;
  };

  const out: Candidate[] = [];
  for (const raw of entries) {
    const rawTitle = field(raw, 'title');
    if (!rawTitle) continue;
    // ACL brace-protects capitals ("{B}engali"), so braces must be stripped
    // BEFORE keyword matching or nothing ever matches.
    const title = rawTitle.replace(/[{}]/g, '');
    if (!TERMS.test(title)) continue;
    const url = field(raw, 'url');
    if (!url) continue;
    // Skip whole-proceedings records; we want individual papers.
    if (raw.startsWith('proceedings')) continue;
    out.push({
      source: 'acl',
      kind: 'paper',
      title,
      link: url,
      year: Number(field(raw, 'year')) || undefined,
      authors: field(raw, 'author')?.split(' and ')[0]?.split(',')[0] + ' et al.',
      venue: field(raw, 'booktitle') ?? field(raw, 'journal'),
      suggestedTask: guessTask(title),
    });
  }
  return out;
}

// ---------------------------------------------------------------------- arXiv
async function fromArxiv(): Promise<Candidate[]> {
  // arXiv rate-limits aggressively; one paged request with a pause between pages.
  const q = '(abs:bengali OR abs:bangla OR ti:bengali OR ti:bangla) AND cat:cs.CL';
  const out: Candidate[] = [];
  for (let start = 0; start < LIMIT; start += 100) {
    const url =
      `http://export.arxiv.org/api/query?search_query=${encodeURIComponent(q)}` +
      `&start=${start}&max_results=${Math.min(100, LIMIT - start)}` +
      `&sortBy=submittedDate&sortOrder=descending`;
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) {
      console.error(`  arXiv fetch failed: ${res.status}${res.status === 429 ? ' (rate limited — retry later)' : ''}`);
      break;
    }
    const xml = await res.text();
    const entries = xml.split('<entry>').slice(1);
    if (!entries.length) break;
    for (const e of entries) {
      const pick = (t: string) => e.match(new RegExp(`<${t}>([\\s\\S]*?)</${t}>`))?.[1]?.replace(/\s+/g, ' ').trim();
      const title = pick('title');
      const id = pick('id');
      if (!title || !id) continue;
      const authors = [...e.matchAll(/<name>([^<]+)<\/name>/g)].map((m) => m[1]);
      out.push({
        source: 'arxiv',
        kind: 'paper',
        title,
        link: id.replace(/v\d+$/, ''),
        year: Number(pick('published')?.slice(0, 4)) || undefined,
        authors: authors.length ? `${authors[0].split(' ').pop()} et al.` : undefined,
        venue: 'arXiv',
        suggestedTask: guessTask(`${title} ${pick('summary') ?? ''}`),
      });
    }
    await new Promise((r) => setTimeout(r, 3500));
  }
  return out;
}

// --------------------------------------------------------------- Hugging Face
async function fromHuggingFace(): Promise<Candidate[]> {
  const out: Candidate[] = [];
  for (const kind of ['datasets', 'models'] as const) {
    const url =
      `https://huggingface.co/api/${kind}?filter=language:bn&sort=downloads&direction=-1&limit=${LIMIT}&full=false`;
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) {
      console.error(`  HF ${kind} fetch failed: ${res.status}`);
      continue;
    }
    const rows = (await res.json()) as { id: string; downloads?: number; pipeline_tag?: string }[];
    for (const r of rows) {
      out.push({
        source: 'huggingface',
        kind: kind === 'datasets' ? 'dataset' : 'model',
        title: r.id,
        link: `https://huggingface.co/${kind === 'datasets' ? 'datasets/' : ''}${r.id}`,
        suggestedTask: guessTask(`${r.id} ${r.pipeline_tag ?? ''}`),
        note: r.downloads != null ? `${r.downloads} downloads at discovery time` : undefined,
      });
    }
  }
  return out;
}

// ----------------------------------------------------------------------- main
const sources: Record<string, () => Promise<Candidate[]>> = {
  acl: fromAcl,
  arxiv: fromArxiv,
  hf: fromHuggingFace,
};

const found: Candidate[] = [];
for (const [name, fn] of Object.entries(sources)) {
  if (onlySource && onlySource !== name) continue;
  try {
    const rows = await fn();
    const fresh = rows.filter(isNew);
    // De-duplicate within this run too.
    for (const c of fresh) {
      if (!found.some((f) => normUrl(f.link) === normUrl(c.link) || norm(f.title) === norm(c.title)))
        found.push(c);
    }
    console.log(`${name}: ${rows.length} matched, ${fresh.length} not already catalogued`);
  } catch (err) {
    console.error(`${name}: ${(err as Error).message}`);
  }
}

found.sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title));

mkdirSync(inboxDir, { recursive: true });
const header = `# Discovery candidates — NOT part of the catalog.
#
# Generated by \`npm run discover\` on ${new Date().toISOString().slice(0, 10)}.
# Every entry here is UNVERIFIED: the task is a keyword guess, and size, license
# and metadata are absent. Nothing in this file is rendered by the site.
#
# To promote one: open its link, confirm the metadata against the source, fill in
# the required fields, and move it into data/<kind>/<task>.yaml by hand.
# See CONTRIBUTING.md. Do not bulk-import this file.
`;
writeFileSync(OUT, `${header}\n${stringify(found, { lineWidth: 0 })}`, 'utf8');

const by = (k: string) => found.filter((c) => c.source === k).length;
console.log(`\n${found.length} candidates → data/inbox/candidates.yaml`);
console.log(`  acl ${by('acl')} · arxiv ${by('arxiv')} · huggingface ${by('huggingface')}`);
console.log(`  ${found.filter((c) => !c.suggestedTask).length} with no task guess (need manual triage)`);
