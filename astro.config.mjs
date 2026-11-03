import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ladeira.pages.dev',
  output: 'static',
  // One page with one stylesheet: inlining it saves the render-blocking request in front of the hero.
  build: { inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
});
