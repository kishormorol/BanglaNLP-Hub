import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { resolve } from 'node:path';

const dataDir = resolve(process.cwd(), 'data');
const issueUrl = 'https://doi.org/10.55454/rcsas.3.03.2023.001';

test('link checker does not fetch issue 81 inbox candidate', () => {
  const inbox = readFileSync(resolve(dataDir, 'inbox/candidates.yaml'), 'utf8');
  assert.equal(inbox.includes(issueUrl), true);

  const mockFetch = `
    globalThis.fetch = async (input) => {
      const url = String(input);
      if (url === ${JSON.stringify(issueUrl)}) throw new Error('inbox candidate fetched');
      return new Response('', { status: 200 });
    };
  `;
  const output = execFileSync(
    process.execPath,
    [
      '--import',
      'tsx',
      '--import',
      `data:text/javascript,${encodeURIComponent(mockFetch)}`,
      resolve(process.cwd(), 'scripts/check-links.ts'),
    ],
    { cwd: process.cwd(), encoding: 'utf8' },
  );

  assert.match(output, /Checking \d+ link\(s\)/);
  assert.match(output, /\d+\/\d+ reachable/);
  assert.equal(output.includes(issueUrl), false);
});
