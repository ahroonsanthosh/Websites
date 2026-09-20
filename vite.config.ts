import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [
    // GLSL shader support: import .glsl/.vert/.frag/.vs/.fs as strings,
    // with #include resolution so shader chunks can be shared.
    glsl({
      include: ['**/*.glsl', '**/*.vert', '**/*.frag', '**/*.vs', '**/*.fs'],
      minify: false,
      watch: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  build: {
    target: 'es2022',
    sourcemap: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        // Temporary: the dev harness for the hand/flower asset. Remove with it.
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        devHandFlower: fileURLToPath(new URL('./dev/hand-flower.html', import.meta.url)),
      },
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
        },
      },
    },
  },
});
