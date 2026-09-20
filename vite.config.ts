import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [
    glsl({
      // Chunk imports are wanted from the first shader onwards, so #include
      // stays available without revisiting this config later.
      importKeywords: ['#include'],
      removeDuplicatedImports: true,
      // Shader source stays readable in dev; the production build strips it.
      minify: process.env.NODE_ENV === 'production',
    }),
  ],
  build: {
    target: 'es2022',
    sourcemap: true,
  },
  server: {
    host: true,
  },
});
