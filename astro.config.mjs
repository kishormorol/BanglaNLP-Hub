// @ts-check
import { defineConfig } from 'astro/config';

// The Hugging Face Space (kishormorol/BanglaNLP-Hub) mirrors this site from a
// domain root, and static Spaces serve exact file paths only — they have no
// directory indexes, so /tasks/ner/ 404s there. `npm run build:hf-space` sets
// HF_SPACE=1 to emit root-relative assets and tasks/ner.html; the rest of the
// mirror's fixes live in scripts/build-hf-space.ts.
const hfSpace = process.env.HF_SPACE === '1';

// Deployed to GitHub Pages at https://kishormorol.github.io/BanglaNLP-Hub
export default defineConfig({
  site: 'https://kishormorol.github.io',
  base: hfSpace ? '/' : '/BanglaNLP-Hub',
  trailingSlash: 'ignore',
  outDir: hfSpace ? './dist-hf' : './dist',
  build: {
    // Emit /tasks/sentiment/index.html so hash-based tab links stay shareable.
    format: hfSpace ? 'file' : 'directory',
  },
});
