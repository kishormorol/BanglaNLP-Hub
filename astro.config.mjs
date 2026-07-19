// @ts-check
import { defineConfig } from 'astro/config';

// Deployed to GitHub Pages at https://kishormorol.github.io/BanglaNLP-Hub
export default defineConfig({
  site: 'https://kishormorol.github.io',
  base: '/BanglaNLP-Hub',
  trailingSlash: 'ignore',
  build: {
    // Emit /tasks/sentiment/index.html so hash-based tab links stay shareable.
    format: 'directory',
  },
});
