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
    // No `rollupOptions.input`. The default is `<root>/index.html` and that is
    // the only thing that should ever be built.
    //
    // The development harness at `dev/hand-flower.html` used to be declared
    // here as a second entry, which is why it shipped: naming it made its whole
    // import graph, including GLTFLoader and RoomEnvironment, part of the
    // production build. Nothing in `src/` imports it, so removing the entry
    // removes it from the graph entirely rather than relying on dead-code
    // elimination to strip it afterwards.
    //
    // It remains fully available during development: `vite dev` serves any HTML
    // file under the project root, so `npm run dev` still has it at
    // http://localhost:5173/dev/hand-flower.html
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
        },
      },
    },
  },
});
