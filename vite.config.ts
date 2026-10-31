import { defineConfig } from 'vite';

// GitHub Pages serves the site from /<repo-name>/, so asset paths need this prefix.
export default defineConfig({
  base: '/daily-knowledge/',
});
