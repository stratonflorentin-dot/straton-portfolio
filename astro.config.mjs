import { defineConfig } from 'astro/config';

export default defineConfig({
  // 👉 Change this to your own domain before deploying
  site: 'https://yoursite.com',
  compressHTML: true,
  build: { inlineStylesheets: 'auto' }
});
