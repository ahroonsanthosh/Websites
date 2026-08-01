import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ahroonsanthosh.github.io',
  base: '/somedosev2/',
  output: 'static',
  compressHTML: true,
  image: {
    domains: [],
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
