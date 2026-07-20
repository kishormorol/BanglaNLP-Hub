/**
 * Promote reviewed ACL Anthology candidates into data/papers/<task>.yaml.
 *
 *   npm run promote -- --dry            report only, write nothing
 *   npm run promote                      write entries + leave the rest in the inbox
 *   npm run promote -- --bib path.bib    reuse a downloaded anthology.bib (85 MB)
 *
 * Counterpart to discover.ts. Where discover.ts finds candidates, this fills in
 * their fields from the anthology's own BibTeX and files them by task.
 *
 * Every emitted field is copied from the anthology record — title, authors,
 * venue, year, and link. Nothing is synthesised. The one field the anthology
 * does not supply is `task`, which is derived from the title by the rules in
 * classify() below; any paper those rules cannot place is LEFT IN THE INBOX for
 * a human rather than being filed under a guess. `note` is never generated,
 * because a one-line characterisation of a paper is exactly the kind of
 * plausible-sounding invention this catalog forbids.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse, stringify } from 'yaml';

const root = process.cwd();
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const bibArg = args[args.indexOf('--bib') + 1];
const BIB = args.includes('--bib') ? bibArg : resolve(root, '.cache/anthology.bib');

const INBOX = resolve(root, 'data/inbox/candidates.yaml');

// ------------------------------------------------------------------- anthology
if (!existsSync(BIB)) {
  console.error(`anthology.bib not found at ${BIB}`);
  console.error('Download it first:');
  console.error('  mkdir -p .cache && curl -sL https://aclanthology.org/anthology.bib.gz | gunzip > .cache/anthology.bib');
  process.exit(1);
}

type Rec = {
  key: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  link: string;
};

/**
 * BibTeX values are quote-delimited in most anthology records but brace-delimited
 * when they contain LaTeX escapes (`author = {Uzuner, {\"O}zlem}`). Missing the
 * brace form silently drops those records, so both are matched here.
 */
const field = (src: string, name: string) => {
  const quoted = src.match(new RegExp(`\\n\\s*${name}\\s*=\\s*"([\\s\\S]*?)"\\s*,?\\n`, 'i'));
  if (quoted) return quoted[1].replace(/\s+/g, ' ').trim();
  const braced = src.match(new RegExp(`\\n\\s*${name}\\s*=\\s*\\{([\\s\\S]*?)\\}\\s*,?\\n`, 'i'));
  return braced ? braced[1].replace(/\s+/g, ' ').trim() : undefined;
};

/** Strip the LaTeX accent forms the anthology uses: {\"O}zlem -> Ozlem. */
const delatex = (s: string) =>
  s
    .replace(/\{\\[`'"^~=.]\{?([A-Za-z])\}?\}/g, '$1')
    .replace(/\\[`'"^~=.]\{?([A-Za-z])\}?/g, '$1')
    .replace(/\{\\([a-z])\s*([A-Za-z])\}/g, '$2')
    .replace(/[{}\\]/g, '')
    .trim();

/** ACL brace-protects capitals: "{B}engali" -> "Bengali". */
const debrace = (s: string) => s.replace(/[{}]/g, '');

/** "Sadhu, Jayanta and Khan, Ayan and ..." -> "Sadhu et al." */
function authorLabel(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const people = raw.split(' and ').map((p) => p.trim()).filter(Boolean);
  if (!people.length) return undefined;
  const surname = delatex(people[0].split(',')[0]);
  if (!surname) return undefined;
  return people.length > 1 ? `${surname} et al.` : surname;
}

/**
 * Booktitle -> short venue label. Explicit rules for the venues that carry a
 * colour in data/venues.yaml; everything else falls back to its own acronym
 * (which the anthology usually brace-protects) and renders gray.
 */
function normalizeVenue(bookRaw: string | undefined, key: string): string | undefined {
  if (!bookRaw) return undefined;
  const b = debrace(bookRaw);
  const findings = /^Findings of the Association for Computational Linguistics:?\s*(ACL|EMNLP|NAACL|EACL|IJCNLP)?/i.exec(b);
  if (findings) {
    const host = findings[1]?.toUpperCase();
    if (host) return `Findings ${host}`;
    if (/ACL/i.test(b)) return 'Findings ACL';
    return 'Findings ACL';
  }
  if (/Workshop on Bangla Language Processing/i.test(b)) return 'BLP @ EMNLP';
  if (/Annual Meeting of the Association for Computational Linguistics/i.test(b)) return 'ACL';
  if (/Conference on Empirical Methods in Natural Language Processing/i.test(b)) return 'EMNLP';
  // NAACL renamed its 2025 edition "Nations of the Americas Chapter".
  if (/(North American|Nations of the Americas) Chapter of the Association for Computational Linguistics/i.test(b)) return 'NAACL';
  if (/European Chapter of the Association for Computational Linguistics/i.test(b)) return 'EACL';
  if (/LREC-COLING/i.test(b)) return 'LREC-COLING';
  if (/International Conference on Computational Linguistics|^COLING|Coling/i.test(b)) return 'COLING';
  if (/Language Resources and Evaluation Conference|International Conference on Language Resources and Evaluation/i.test(b)) return 'LREC';
  if (/International Joint Conference on Natural Language Processing/i.test(b)) return 'IJCNLP';
  if (/International Conference on Natural Language Processing|\bICON\b/i.test(b)) return 'ICON';
  if (/Workshop on Semantic Evaluation|SemEval/i.test(b)) return 'SemEval';
  if (/Joint Conference on Lexical and Computational Semantics|\*SEM/i.test(b)) return '*SEM';
  if (/^Computational Linguistics$/i.test(b)) return 'Computational Linguistics';
  if (/Transactions of the Association for Computational Linguistics/i.test(b)) return 'TACL';
  if (/Machine Translation Summit|MT Summit/i.test(b)) return 'MT Summit';
  if (/European Association for Machine Translation/i.test(b)) return 'EAMT';
  if (/Conference on Machine Translation|Workshop on (Statistical )?Machine Translation|\bWMT\b/i.test(b)) return 'WMT';
  if (/Workshop on Spoken Language Translation|\bIWSLT\b/i.test(b)) return 'IWSLT';
  if (/Pacific Asia Conference|PACLIC/i.test(b)) return 'PACLIC';
  if (/Recent Advances in Natural Language Processing|RANLP/i.test(b)) return 'RANLP';
  if (/ROCLING/i.test(b)) return 'ROCLING';
  if (/Conference on Language, Data and Knowledge/i.test(b)) return 'LDK';
  if (/Language Models for Low-Resource Languages|LoResLM/i.test(b)) return 'LoResLM';
  if (/Global Wordnet/i.test(b)) return 'GWC';
  if (/Linguistic Annotation Workshop|\bLAW\b/i.test(b)) return 'LAW';
  if (/Workshop on Noisy User-generated Text|\bW-NUT\b|WNUT/i.test(b)) return 'W-NUT';
  if (/Workshop on Asian Translation/i.test(b)) return 'WAT';
  if (/South and Southeast Asian Natural Language|WSSANLP/i.test(b)) return 'WSSANLP';
  if (/Workshop on Asian Language Resou?rces|\bALR\b/i.test(b)) return 'ALR';
  if (/Gender Bias in Natural Language Processing|GeBNLP/i.test(b)) return 'GeBNLP';
  if (/Australasian Language Technology|\bALTA\b/i.test(b)) return 'ALTA';
  if (/Conference on Language Modeling|\bCOLM\b/i.test(b)) return 'COLM';

  // A brace-protected acronym in the original, e.g. "({WSSANLP}2016)".
  const acro = bookRaw.match(/\{([A-Z][A-Za-z][A-Za-z-]{1,14})\}/);
  if (acro) return acro[1].toUpperCase();

  // A parenthetical mixed-case acronym, e.g. "… Studies (ConTeNTS) Incorporating …".
  const paren = b.match(/\(([A-Za-z]*[A-Z][A-Za-z]*[A-Z][A-Za-z-]*)\)/);
  if (paren) return paren[1];

  // The anthology key's venue segment, when the key is the modern form
  // ("2023.blp-1.4" -> "BLP").
  const seg = key.match(/^\d{4}\.([a-z]+)/i);
  if (seg && seg[1].length <= 10) return seg[1].toUpperCase();

  // Last resort: a cleaned full name. Never truncate at punctuation — that turns
  // "Conference on Language, Data and Knowledge" into the misleading "Conference on
  // Language". Strip only the ordinal/proceedings boilerplate and any trailing
  // parenthetical or LaTeX residue; keep the rest intact even if long.
  const short = delatex(b)
    .replace(/^Proceedings of (the )?/i, '')
    .replace(/\s*\([^)]*\)\s*$/, '')
    .replace(/^\d+(st|nd|rd|th)\s+/i, '')
    // Drop a "within the …" host-conference clause and any colon subtitle: the
    // part before them is the venue's own name.
    .replace(/\s+within the .*$/i, '')
    .replace(/:\s.*$/, '')
    .replace(/,\s*(Varieties and Dialects|Sentiment).*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  return short.length > 2 ? short : undefined;
}

/**
 * Title -> task id. Ordered: the first rule that matches wins, so the more
 * specific patterns come first.
 *
 * The BLP shared-task rules are not guesses — each shared task states its own
 * subject in the system papers' titles ("BLP-2023 Task 1: ... Violence Inciting
 * Text", "Overview of BLP-2025 Task 1: Bangla Hate Speech Identification").
 */
function classify(title: string): string | undefined {
  const t = title.toLowerCase();

  // Disambiguate title-word collisions before the keyword rules run:
  //   "figures of speech"  is figurative language, not ASR/TTS
  //   "book summaries"     is source data for a classification task, not summ
  //   "genre classification" is text classification even next to "summaries"
  if (/figures? of speech/.test(t)) return 'sentiment';
  if (/genre classification|content classification/.test(t)) return 'textcls';

  // Shared tasks, by their published subject.
  if (/blp-2023\s*task\s*1/.test(t)) return 'hate';       // Violence Inciting Text Detection
  if (/blp-2023\s*task\s*2/.test(t)) return 'sentiment';  // Sentiment Analysis
  if (/blp-2025\s*task\s*1/.test(t)) return 'hate';       // Bangla Hate Speech Identification
  if (/blp-2025\s*task\s*2/.test(t)) return 'llm';        // Code Generation in Bangla

  const rules: [RegExp, string][] = [
    [/hate|offensive|abusive|toxic|violence.inciting|troll|cyberbull|aggress|profane|obscene|misogyn/, 'hate'],
    // Bias / stereotype / fairness papers evaluate language models rather than
    // classify sentiment, so they belong with the LLM benchmarks, not here.
    [/\bbias\b|stereotyp|political inclination|honorific|fairness/, 'llm'],
    [/sentiment|emotion|polarity|sarcas|irony|figurative|subjectivit|depression|mental health|suicid|well.being/, 'sentiment'],
    // Plural and hyphenated forms matter here: "Named Entities", "Named-Entity".
    [/named[- ]entit|\bner\b|entity recogni/, 'ner'],
    [/summar|headline generation/, 'summ'],
    [/question answer|\bqa\b|reading comprehension|causal|question classification/, 'qa'],
    // "code-switching/code-mixing" only routes to MT when it is the task being
    // studied (detection/identification/analysis), not when it merely describes
    // the input text — otherwise e.g. "Depression Detection in Code-Mixed Text"
    // lands here instead of with sentiment.
    [/translat|parallel corpus|paraphrase|transliterat|(code.(switch|mix)\w*)\s+(detection|identification|analysis)|\bsmt\b|\bnmt\b|cognate|cross.lingual retrieval|\bclir\b/, 'mt'],
    [/speech|\basr\b|\btts\b|phonem|audio|voice|spoken|acoustic|\bipa\b/, 'speech'],
    [
      /part.of.speech|\bpos\b|treebank|dependenc|morpholog|stemm|lemmat|parser|parsing|grammar|syntax|compound verb|complex predicate|noun phrase|anaphora|clause|reduplication|plurality|verb frame|verb inflection|polymorphemic|karta/,
      'pos',
    ],
    [
      /fake news|clickbait|manipulated|synthetic sentence|news classif|document classif|text classif|multi.label classification|content classification|meme.*classification|topic|genre|categoriz|spam|authorship|discourse mode/,
      'textcls',
    ],
    [/\bllm\b|large language model|benchmark|instruction|gpt|llama|\bt5\b|reasoning|prompt|generative|chatbot|code generation|retrieval.augmented/, 'llm'],
  ];
  return rules.find(([re]) => re.test(t))?.[1];
}

// ------------------------------------------------------------------------ load
console.log(`Reading ${BIB} …`);
const bib = readFileSync(BIB, 'utf8');
const byUrl = new Map<string, Rec>();
for (const raw of bib.split(/\n@/)) {
  const url = field(raw, 'url');
  if (!url) continue;
  const titleRaw = field(raw, 'title');
  if (!titleRaw) continue;
  const key = raw.match(/^[a-z]+\{([^,]+),/i)?.[1] ?? '';
  const year = Number(field(raw, 'year'));
  if (!year) continue;
  byUrl.set(url.replace(/\/+$/, ''), {
    key,
    title: debrace(titleRaw),
    authors: authorLabel(field(raw, 'author')) ?? '',
    venue: normalizeVenue(field(raw, 'booktitle') ?? field(raw, 'journal'), key) ?? '',
    year,
    link: url,
  });
}
console.log(`  indexed ${byUrl.size} anthology records`);

const candidates = parse(readFileSync(INBOX, 'utf8')) as any[];
console.log(`  ${candidates.length} candidates in the inbox\n`);

// -------------------------------------------------------------- existing state
const paperDir = resolve(root, 'data/papers');
const tasks: string[] = (parse(readFileSync(resolve(root, 'data/tasks.yaml'), 'utf8')) as any[]).map(
  (t) => t.id,
);
const existing = new Map<string, any[]>();
const knownIds = new Set<string>();
const knownLinks = new Set<string>();
for (const task of tasks) {
  const f = resolve(paperDir, `${task}.yaml`);
  const list = existsSync(f) ? ((parse(readFileSync(f, 'utf8')) as any[]) ?? []) : [];
  existing.set(task, list);
  for (const p of list) {
    knownIds.add(p.id);
    knownLinks.add(String(p.link).replace(/\/+$/, ''));
  }
}

// ---------------------------------------------------------------------- promote
const added: Record<string, number> = {};
const leftover: any[] = [];
const reasons: Record<string, number> = {};
const note = (r: string) => (reasons[r] = (reasons[r] ?? 0) + 1);

for (const c of candidates) {
  if (c.kind !== 'paper' || c.source !== 'acl') {
    leftover.push(c);
    note('not an ACL paper');
    continue;
  }
  const rec = byUrl.get(String(c.link).replace(/\/+$/, ''));
  if (!rec) {
    leftover.push(c);
    note('no anthology record for its link');
    continue;
  }
  if (knownLinks.has(rec.link.replace(/\/+$/, ''))) {
    note('already catalogued');
    continue;
  }
  const task = classify(rec.title);
  if (!task) {
    leftover.push(c);
    note('title does not indicate a task — needs manual triage');
    continue;
  }
  if (!rec.authors || !rec.venue) {
    leftover.push(c);
    note('anthology record missing author or venue');
    continue;
  }

  // Anthology bibkeys are unique, lowercase, and hyphenated — a natural id.
  let id = rec.key.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
  if (!id || knownIds.has(id)) {
    const suffix = rec.link.match(/(\d{4}\.[a-z-]+\.\d+)/i)?.[1]?.replace(/\./g, '-');
    id = suffix ? `${id}-${suffix}` : `${id}-${rec.year}`;
  }
  if (knownIds.has(id)) {
    leftover.push(c);
    note('id collision');
    continue;
  }
  knownIds.add(id);
  knownLinks.add(rec.link.replace(/\/+$/, ''));

  existing.get(task)!.push({
    id,
    title: rec.title,
    authors: rec.authors,
    venue: rec.venue,
    year: rec.year,
    link: rec.link,
    task,
  });
  added[task] = (added[task] ?? 0) + 1;
}

// ------------------------------------------------------------------------ write
const total = Object.values(added).reduce((a, b) => a + b, 0);
console.log(`Promoted ${total} papers:`);
for (const [t, n] of Object.entries(added).sort((a, b) => b[1] - a[1])) console.log(`  ${t.padEnd(10)} ${n}`);
console.log(`\nLeft in inbox: ${leftover.length}`);
for (const [r, n] of Object.entries(reasons).sort((a, b) => b[1] - a[1])) console.log(`  ${n.toString().padStart(4)}  ${r}`);

if (DRY) {
  console.log('\n--dry: nothing written.');
  process.exit(0);
}

for (const task of tasks) {
  const list = existing.get(task)!;
  if (!added[task]) continue;
  list.sort((a, b) => b.year - a.year || String(a.title).localeCompare(String(b.title)));
  writeFileSync(resolve(paperDir, `${task}.yaml`), stringify(list, { lineWidth: 0 }));
}
writeFileSync(INBOX, stringify(leftover, { lineWidth: 0 }));
console.log('\nWritten. Run `npm run validate` before committing.');
