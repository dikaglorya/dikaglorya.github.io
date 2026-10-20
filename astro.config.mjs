import { defineConfig } from 'astro/config';

// The repo is a GitHub Pages user site (dikaglorya.github.io), so the base path is "/".
// The public site is served from https://obitoglory.tech.
export default defineConfig({
  site: 'https://obitoglory.tech',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  compressHTML: true,
  server: {
    host: '127.0.0.1',
  },
  preview: {
    host: '127.0.0.1',
  },
});
