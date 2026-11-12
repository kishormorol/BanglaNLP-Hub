// Network fixture only. The Rust E2E checks run the real ingestion commands.
import { appendFileSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const pause = globalThis.setTimeout;
const record = event => appendFileSync('events.log', `${event}\n`);
globalThis.setTimeout = (callback, milliseconds, ...args) => {
  if (milliseconds === 3500 || milliseconds === 300) {
    record(`delay ${milliseconds}`);
    return pause(callback, 0, ...args);
  }
  return pause(callback, milliseconds, ...args);
};
const work = (title, link) => ({ display_name: title, doi: link, publication_year: 2026 });
const entry = (title, id) => `<entry><title>${title}</title><id>${id}</id><published>2026-01-01</published><summary>Bangla NLP</summary><author><name>Fixture Author</name></author></entry>`;

globalThis.fetch = async input => {
  const url = new URL(input);
  const name = url.hostname === 'aclanthology.org' ? 'acl'
    : url.hostname === 'export.arxiv.org' ? 'arxiv'
    : url.hostname === 'api.openalex.org' ? 'openalex'
    : url.hostname === 'huggingface.co' ? url.pathname.slice(5) : 'unknown';
  record(`start ${name}`);
  await new Promise(resolve => pause(resolve, name === 'acl' ? 40 : name === 'datasets' ? 25 : 5));
  record(`finish ${name}`);
  if (process.env.FIXTURE_FAILURE === name) throw new Error(`fixture ${name} failure`);
  if (name === 'acl') return new Response(gzipSync(readFileSync('anthology.bib')));
  if (name === 'arxiv') return new Response('<feed>' +
    entry('Bangla Sentiment Alpha', 'https://arxiv.org/abs/2601.00001v2') +
    entry('Bangla Shadow Speech', 'https://source.test/shadow') + '</feed>');
  if (name === 'datasets' || name === 'models') {
    if (process.env.FIXTURE_FAILURE === 'hf-status' && name === 'datasets') return new Response('', { status: 503 });
    return Response.json([{ id: 'fixture/BanglaCorpus', downloads: 42 }]);
  }
  if (name === 'openalex') {
    if (process.env.FIXTURE_PAGES) {
      const first = url.searchParams.get('cursor') === '*';
      return Response.json({ results: [work(`Bangla Page ${first ? 'One' : 'Two'}`, `https://source.test/page-${first ? 'one' : 'two'}`)], meta: { next_cursor: first ? 'next' : null } });
    }
    return Response.json({ results: [
      work('Bangla DOI alias', 'http://dx.doi.org/MIXEDCASE/'),
      work('Bangla Upper', 'https://source.test/Case'),
      work('Bangla Lower', 'https://source.test/case'),
      work('Bangla query variant', 'https://known.test/Keep?x=2#part'),
      work('Queued B', 'https://source.test/queued-title'),
      work('Bangla malformed', 'not a url/'),
      work('Bangla malformed alias', 'NOT A URL'),
    ], meta: {} });
  }
  throw new Error(`Unmocked network request: ${input}`);
};
