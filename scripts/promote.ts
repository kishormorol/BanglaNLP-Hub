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

const patterns = {
  whitespace: /\s+/g,
  bracedAccent: /\{\\[`'"^~=.]\{?([A-Za-z])\}?\}/g,
  accent: /\\[`'"^~=.]\{?([A-Za-z])\}?/g,
  latexCommand: /\{\\([a-z])\s*([A-Za-z])\}/g,
  latexResidue: /[{}\\]/g,
  braces: /[{}]/g,
  findings: /^Findings of the Association for Computational Linguistics:?\s*(ACL|EMNLP|NAACL|EACL|IJCNLP)?/i,
  blp: /Workshop on Bangla Language Processing/i,
  blpEdition: /\(BLP-(\d{4})\)/,
  parentheses: /\([^)]+\)/g,
  trailingYear: /[\s-]*\d{4}\s*$/,
  acronym: /^[A-Za-z][A-Za-z-]{1,14}$/,
  capitals: /[A-Z][A-Za-z-]*[A-Z]/,
  venueKey: /^\d{4}\.([a-z]+)/i,
  proceedings: /^Proceedings of (the )?/i,
  trailingParentheses: /\s*\([^)]*\)\s*$/,
  ordinal: /^\d+(st|nd|rd|th)\s+/i,
  hostClause: /\s+within the .*$/i,
  colonSubtitle: /:\s.*$/,
  dashSubtitle: /\s*---\s.*$/,
  venueSubtitle: /,\s*(Varieties and Dialects|Sentiment).*$/i,
  figuresOfSpeech: /figures? of speech/,
  genreClassification: /genre classification|content classification/,
  speechEmotion: /speech emotion|emotional speech|emotion.*\b(from|in)\b.*(speech|audio|voice)|acoustic.*emotion|\bspeech\b.*\bser\b/,
  speaker: /speaker (identif|recogni|verif|diariz)|diariz/,
  translationWsd: /machine translation.*word sense disambiguation/,
  opticalRecognition: /optical character recognition/g,
  ocr: /\bocr\b/,
  licensePlate: /licen[cs]e plate/,
  characterUnits: /\b(characters?|digits?)\b/,
  textUnits: /\b(words?|lines?|documents?|scenes?|texts?)\b/,
  blp2023Task1: /blp-2023\s*task\s*1/,
  blp2023Task2: /blp-2023\s*task\s*2/,
  blp2025Task1: /blp-2025\s*task\s*1/,
  blp2025Task2: /blp-2025\s*task\s*2/,
  bibEntry: /\n@/,
  bibKey: /^[a-z]+\{([^,]+),/i,
  trailingSlashes: /\/+$/,
  titleSeparators: /[^a-z0-9]+/g,
  singleWhitespace: /\s/,
  arxivId: /(\d{4}\.\d{4,5})/,
  spaces: / /g,
  idSeparators: /[^a-z0-9-_]/g,
  anthologyId: /(\d{4}\.[a-z-]+\.\d+)/i,
  dots: /\./g,
};

const venueRules: [RegExp, string][] = [
  [/Annual Meeting of the Association for Computational Linguistics/i, 'ACL'],
  [/Conference on Empirical Methods in Natural Language Processing/i, 'EMNLP'],
  // NAACL renamed its 2025 edition "Nations of the Americas Chapter".
  [/(North American|Nations of the Americas) Chapter of the Association for Computational Linguistics/i, 'NAACL'],
  [/European Chapter of the Association for Computational Linguistics/i, 'EACL'],
  [/LREC-COLING/i, 'LREC-COLING'],
  [/International Conference on Computational Linguistics|^COLING|Coling/i, 'COLING'],
  [/Language Resources and Evaluation Conference|International Conference on Language Resources and Evaluation/i, 'LREC'],
  [/International Joint Conference on Natural Language Processing/i, 'IJCNLP'],
  [/International Conference on Natural Language Processing|\bICON\b/i, 'ICON'],
  [/Workshop on Semantic Evaluation|SemEval/i, 'SemEval'],
  [/Joint Conference on Lexical and Computational Semantics|\*SEM/i, '*SEM'],
  [/^Computational Linguistics$/i, 'Computational Linguistics'],
  [/Transactions of the Association for Computational Linguistics/i, 'TACL'],
  [/Machine Translation Summit|MT Summit/i, 'MT Summit'],
  [/European Association for Machine Translation/i, 'EAMT'],
  [/Conference on Machine Translation|Workshop on (Statistical )?Machine Translation|\bWMT\b/i, 'WMT'],
  [/Workshop on Spoken Language Translation|\bIWSLT\b/i, 'IWSLT'],
  [/Pacific Asia Conference|PACLIC/i, 'PACLIC'],
  [/Recent Advances in Natural Language Processing|RANLP/i, 'RANLP'],
  [/ROCLING/i, 'ROCLING'],
  [/Conference on Language, Data and Knowledge/i, 'LDK'],
  [/Language Models for Low-Resource Languages|LoResLM/i, 'LoResLM'],
  [/Global Wordnet/i, 'GWC'],
  [/Linguistic Annotation Workshop|\bLAW\b/i, 'LAW'],
  [/Workshop on Noisy User-generated Text|\bW-NUT\b|WNUT/i, 'W-NUT'],
  [/Workshop on Asian Translation/i, 'WAT'],
  [/South and Southeast Asian Natural Language|WSSANLP/i, 'WSSANLP'],
  [/Workshop on Asian Language Resou?rces|\bALR\b/i, 'ALR'],
  [/Gender Bias in Natural Language Processing|GeBNLP/i, 'GeBNLP'],
  [/Australasian Language Technology|\bALTA\b/i, 'ALTA'],
  [/Conference on Language Modeling|\bCOLM\b/i, 'COLM'],
];

const specific: [RegExp, string][] = [
  [/speech translation|speech-to-(speech|text) translation|spoken language translation/, 'st'],
  [/visual question answer|\bvqa\b/, 'vqa'],
  [/image caption|caption generation/, 'caption'],
  [/dialogue|conversational system|chatbot/, 'dialogue'],
  [/grammar error (detection|correction)|grammatical error (detection|correction|explanation)|spelling correction|spell checker/, 'gec'],
  [/coreference resolution|anaphora resolution/, 'coref'],
  [/natural language inference|\bnli\b/, 'nli'],
  [/word sense disambiguation/, 'wsd'],
  [/punctuation restoration|punctuation prediction/, 'punct'],
  [/style transfer/, 'style'],
  [/stance detection/, 'stance'],
  [/readability|lexical complexity/, 'readab'],
  [/\bocr\b(?!['’`]d)|optical character recognition|scene text recognition/, 'ocr'],
  [/entity linking/, 'el'],
];

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

const fieldPatterns = {
  title: [/\n\s*title\s*=\s*"([\s\S]*?)"\s*,?\n/i, /\n\s*title\s*=\s*\{([\s\S]*?)\}\s*,?\n/i],
  url: [/\n\s*url\s*=\s*"([\s\S]*?)"\s*,?\n/i, /\n\s*url\s*=\s*\{([\s\S]*?)\}\s*,?\n/i],
  year: [/\n\s*year\s*=\s*"([\s\S]*?)"\s*,?\n/i, /\n\s*year\s*=\s*\{([\s\S]*?)\}\s*,?\n/i],
  author: [/\n\s*author\s*=\s*"([\s\S]*?)"\s*,?\n/i, /\n\s*author\s*=\s*\{([\s\S]*?)\}\s*,?\n/i],
  booktitle: [/\n\s*booktitle\s*=\s*"([\s\S]*?)"\s*,?\n/i, /\n\s*booktitle\s*=\s*\{([\s\S]*?)\}\s*,?\n/i],
  journal: [/\n\s*journal\s*=\s*"([\s\S]*?)"\s*,?\n/i, /\n\s*journal\s*=\s*\{([\s\S]*?)\}\s*,?\n/i],
};

/**
 * BibTeX values are quote-delimited in most anthology records but brace-delimited
 * when they contain LaTeX escapes (`author = {Uzuner, {\"O}zlem}`). Missing the
 * brace form silently drops those records, so both are matched here.
 */
const field = (src: string, name: keyof typeof fieldPatterns) => {
  const quoted = src.match(fieldPatterns[name][0]);
  if (quoted) return quoted[1].replace(patterns.whitespace, ' ').trim();
  const braced = src.match(fieldPatterns[name][1]);
  return braced ? braced[1].replace(patterns.whitespace, ' ').trim() : undefined;
};

/** Strip the LaTeX accent forms the anthology uses: {\"O}zlem -> Ozlem. */
const delatex = (s: string) =>
  s
    .replace(patterns.bracedAccent, '$1')
    .replace(patterns.accent, '$1')
    .replace(patterns.latexCommand, '$2')
    .replace(patterns.latexResidue, '')
    .trim();

/** ACL brace-protects capitals: "{B}engali" -> "Bengali". */
const debrace = (s: string) => s.replace(patterns.braces, '');

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
  const findings = patterns.findings.exec(b);
  if (findings) {
    const host = findings[1]?.toUpperCase();
    if (host) return `Findings ${host}`;
    return 'Findings ACL';
  }
  // BLP moves between host conferences — 2023 at EMNLP, 2025 at IJCNLP-AACL —
  // so the host cannot be inferred from the booktitle wording alone. Claiming
  // the wrong one is a metadata error no link check can catch, so only label a
  // host that has been verified against the volume; later editions fall back to
  // a bare `BLP` until someone checks.
  if (patterns.blp.test(b)) {
    const host = { '2023': 'EMNLP', '2025': 'IJCNLP-AACL' }[patterns.blpEdition.exec(b)?.[1] ?? ''];
    return host ? `BLP @ ${host}` : 'BLP';
  }
  const venue = venueRules.find(([pattern]) => pattern.test(b))?.[1];
  if (venue) return venue;

  /**
   * An acronym in parentheses, brace-protected or not, with an optional trailing
   * year: "({CH}i{PSAL}2026)" -> CHiPSAL, "({WSSANLP}2016)" -> WSSANLP,
   * "(ConTeNTS)" -> ConTeNTS.
   *
   * Only parentheses mark an acronym. The anthology also brace-protects ordinary
   * words for capitalisation ("Dialects in {NLP}", "{B}engali"), and an earlier
   * rule that matched any brace-protected capitals produced venues like `NLP`
   * and `PSAL` — the latter a fragment of `{CH}i{PSAL}`. Requiring parentheses
   * and at least two capitals keeps real acronyms and rejects protected words.
   */
  for (const group of bookRaw.match(patterns.parentheses) ?? []) {
    const inner = debrace(group.slice(1, -1))
      .replace(patterns.trailingYear, '')
      .trim();
    if (patterns.acronym.test(inner) && patterns.capitals.test(inner)) return inner;
  }

  // The anthology key's venue segment, when the key is the modern form
  // ("2023.blp-1.4" -> "BLP").
  const seg = key.match(patterns.venueKey);
  if (seg && seg[1].length <= 10) return seg[1].toUpperCase();

  // Last resort: a cleaned full name. Never truncate at punctuation — that turns
  // "Conference on Language, Data and Knowledge" into the misleading "Conference on
  // Language". Strip only the ordinal/proceedings boilerplate and any trailing
  // parenthetical or LaTeX residue; keep the rest intact even if long.
  const short = delatex(b)
    .replace(patterns.proceedings, '')
    .replace(patterns.trailingParentheses, '')
    .replace(patterns.ordinal, '')
    // Drop a "within the …" host-conference clause and any colon subtitle: the
    // part before them is the venue's own name.
    .replace(patterns.hostClause, '')
    .replace(patterns.colonSubtitle, '')
    // The anthology uses a LaTeX em dash for a subtitle too: "Dialects in NLP
    // --- A Resource Perspective". Same treatment as the colon above.
    .replace(patterns.dashSubtitle, '')
    .replace(patterns.venueSubtitle, '')
    .replace(patterns.whitespace, ' ')
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
  if (patterns.figuresOfSpeech.test(t)) return 'sentiment';
  if (patterns.genreClassification.test(t)) return 'textcls';

  // Emotion *from the acoustic signal* is SER, not text sentiment — but the
  // 'emotion' keyword hits the sentiment rule first, so guard it here. Kept
  // tight: bare "emotion" still routes text papers to sentiment, and expressive
  // "emotion classification for text-to-speech" stays under speech.
  if (patterns.speechEmotion.test(t)) return 'ser';
  //   Speaker identification / verification / diarization is its own task.
  //   "speaker adaptation" (an ASR technique) deliberately does not match.
  if (patterns.speaker.test(t)) return 'speaker';
  if (patterns.translationWsd.test(t)) return 'mt';
  const ocrSubject = t.replace(patterns.opticalRecognition, 'ocr');
  if (patterns.ocr.test(ocrSubject) &&
    (patterns.licensePlate.test(ocrSubject) || (patterns.characterUnits.test(ocrSubject) && !patterns.textUnits.test(ocrSubject)))) return undefined;

  // Narrow task phrases must win over broad keyword rules below (e.g. grammar
  // error correction vs POS, and anaphora resolution vs honorific/LLM).

  const specificTask = specific.find(([re]) => re.test(t))?.[1];
  if (specificTask) return specificTask;

  // Shared tasks, by their published subject.
  if (patterns.blp2023Task1.test(t)) return 'hate';       // Violence Inciting Text Detection
  if (patterns.blp2023Task2.test(t)) return 'sentiment';  // Sentiment Analysis
  if (patterns.blp2025Task1.test(t)) return 'hate';       // Bangla Hate Speech Identification
  if (patterns.blp2025Task2.test(t)) return 'llm';        // Code Generation in Bangla

  return rules.find(([re]) => re.test(t))?.[1];
}

// ------------------------------------------------------------------------ load
console.log(`Reading ${BIB} …`);
const bib = readFileSync(BIB, 'utf8');
const byUrl = new Map<string, Rec>();
for (const raw of bib.split(patterns.bibEntry)) {
  const url = field(raw, 'url');
  if (!url) continue;
  const titleRaw = field(raw, 'title');
  if (!titleRaw) continue;
  const key = raw.match(patterns.bibKey)?.[1] ?? '';
  const year = Number(field(raw, 'year'));
  if (!year) continue;
  byUrl.set(url.replace(patterns.trailingSlashes, ''), {
    key,
    title: debrace(titleRaw),
    authors: authorLabel(field(raw, 'author')) ?? '',
    venue: normalizeVenue(field(raw, 'booktitle') ?? field(raw, 'journal'), key) ?? '',
    year,
    link: url,
  });
}
console.log(`  indexed ${byUrl.size} anthology records`);

const inboxRaw = readFileSync(INBOX, 'utf8');
/**
 * discover.ts heads the inbox with a comment block stating that nothing in the
 * file is catalogued, that every entry is unverified, and that it must not be
 * bulk-imported. Rewriting the file used to drop it, quietly turning a warned
 * file into an unmarked one. Preserve it verbatim.
 */
const inboxHeader = /^(#[^\n]*\n)+/.exec(inboxRaw)?.[0] ?? '';
const candidates = parse(inboxRaw) as any[];
console.log(`  ${candidates.length} candidates in the inbox\n`);

// -------------------------------------------------------------- existing state
const paperDir = resolve(root, 'data/papers');
const tasks: string[] = (parse(readFileSync(resolve(root, 'data/tasks.yaml'), 'utf8')) as any[]).map(
  (t) => t.id,
);
const existing = new Map<string, any[]>();
const knownIds = new Set<string>();
const knownLinks = new Set<string>();
const knownTitles = new Set<string>();
const knownNames = new Set<string>();
const normTitle = (s: string) => String(s ?? '').toLowerCase().replace(patterns.titleSeparators, ' ').trim();

/**
 * A distinctive system name from a "BEnQA: …" style title: the single token
 * before the first colon, when it has no spaces and is ≥3 chars. Used to catch
 * the same named paper across an arXiv preprint and its published version even
 * when the subtitle differs ("BEnQA: A QA Benchmark" vs "BEnQA: A QA and
 * Reasoning Benchmark"). Generic multi-word prefixes ("Bangla Sentiment
 * Analysis: …") are deliberately excluded — they are not unique.
 */
const systemName = (title: string): string | undefined => {
  const head = String(title ?? '').split(':')[0].trim();
  if (!head || patterns.singleWhitespace.test(head) || head.length < 3) return undefined;
  return head.toLowerCase();
};

for (const task of tasks) {
  const f = resolve(paperDir, `${task}.yaml`);
  const list = existsSync(f) ? ((parse(readFileSync(f, 'utf8')) as any[]) ?? []) : [];
  existing.set(task, list);
  for (const p of list) {
    knownIds.add(p.id);
    knownLinks.add(String(p.link).replace(patterns.trailingSlashes, ''));
    knownTitles.add(normTitle(p.title));
    const n = systemName(p.title);
    if (n) knownNames.add(n);
  }
}

/** arXiv is filtered by abstract keyword, so many hits merely mention Bengali as
 * one of many languages. Only promote preprints whose TITLE is about Bangla. */
const BANGLA_TITLE = /\b(bangla|bengali|banglish|bengla)/i;

// ---------------------------------------------------------------------- promote
const added: Record<string, number> = {};
const leftover: any[] = [];
const reasons: Record<string, number> = {};
const note = (r: string) => (reasons[r] = (reasons[r] ?? 0) + 1);

for (const c of candidates) {
  // --- arXiv preprints: fields already come authoritatively from the arXiv API
  // (title/authors/year), venue is honestly "arXiv". Title-dedup against the
  // catalog so a preprint whose published version we already hold is skipped. ---
  if (c.kind === 'paper' && c.source === 'arxiv') {
    const title = debrace(String(c.title ?? '')).replace(patterns.whitespace, ' ').trim();
    if (!title || !BANGLA_TITLE.test(title)) {
      leftover.push(c);
      note('arxiv: title not about Bangla — likely tangential multilingual');
      continue;
    }
    const link = String(c.link ?? '').replace(patterns.trailingSlashes, '');
    const name = systemName(title);
    if (knownLinks.has(link) || knownTitles.has(normTitle(title)) || (name && knownNames.has(name))) {
      note('arxiv: already catalogued (link, title, or system name)');
      continue;
    }
    const task = classify(title);
    if (!task) {
      leftover.push(c);
      note('title does not indicate a task — needs manual triage');
      continue;
    }
    if (!c.authors || !c.year) {
      leftover.push(c);
      note('arxiv candidate missing author or year');
      continue;
    }
    // arXiv ids contain a dot (2308.13545); the id schema allows only [a-z0-9-_].
    const arxivId = link.match(patterns.arxivId)?.[1]?.replace('.', '-');
    let id = arxivId ? `arxiv-${arxivId}` : `arxiv-${normTitle(title).replace(patterns.spaces, '-').slice(0, 40)}`;
    if (knownIds.has(id)) {
      leftover.push(c);
      note('id collision');
      continue;
    }
    knownIds.add(id);
    knownLinks.add(link);
    knownTitles.add(normTitle(title));
    if (name) knownNames.add(name);
    existing.get(task)!.push({
      id,
      title,
      authors: c.authors,
      venue: 'arXiv',
      year: c.year,
      link,
      task,
    });
    added[task] = (added[task] ?? 0) + 1;
    continue;
  }

  if (c.kind !== 'paper' || c.source !== 'acl') {
    leftover.push(c);
    note('not an ACL or arXiv paper');
    continue;
  }
  const rec = byUrl.get(String(c.link).replace(patterns.trailingSlashes, ''));
  if (!rec) {
    leftover.push(c);
    note('no anthology record for its link');
    continue;
  }
  if (knownLinks.has(rec.link.replace(patterns.trailingSlashes, '')) || knownTitles.has(normTitle(rec.title))) {
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
  let id = rec.key.toLowerCase().replace(patterns.idSeparators, '-');
  if (!id || knownIds.has(id)) {
    const suffix = rec.link.match(patterns.anthologyId)?.[1]?.replace(patterns.dots, '-');
    id = suffix ? `${id}-${suffix}` : `${id}-${rec.year}`;
  }
  if (knownIds.has(id)) {
    leftover.push(c);
    note('id collision');
    continue;
  }
  knownIds.add(id);
  knownLinks.add(rec.link.replace(patterns.trailingSlashes, ''));
  knownTitles.add(normTitle(rec.title));
  const aclName = systemName(rec.title);
  if (aclName) knownNames.add(aclName);

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
writeFileSync(INBOX, `${inboxHeader}${inboxHeader ? '\n' : ''}${stringify(leftover, { lineWidth: 0 })}`);
console.log('\nWritten. Run `npm run validate` before committing.');
