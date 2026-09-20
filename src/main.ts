import '@/styles/main.css';

import { App } from '@/core/App';
import { showFatal } from '@/core/fatal';
import { detectWebGLSupport } from '@/core/webgl-support';

/**
 * Startup.
 *
 * Three steps, in this order, because each one can fail in a way the next
 * cannot recover from:
 *
 * 1. The canvas must exist.
 * 2. The browser must provide WebGL 2, which is what Three.js 0.180 requires.
 * 3. The renderer must actually construct, which a driver can refuse even when
 *    step 2 passed, since the probe asks for a bare context and the renderer
 *    asks for one with attributes.
 *
 * Any of them failing ends in the same place: the page shows its content and
 * says plainly that the experience cannot run here. Nothing is retried; a
 * refused context does not become available by asking again.
 */
function boot(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('#webgl');

  if (!canvas) {
    showFatal('startup-failed', new Error('Missing #webgl canvas element.'));
    return;
  }

  const support = detectWebGLSupport();
  if (!support.supported) {
    showFatal('webgl-unsupported', `${support.reason}: ${support.detail}`);
    return;
  }

  let app: App;
  try {
    app = new App({ canvas });
  } catch (error) {
    // Three.js logs its own message before rethrowing, which is unavoidable.
    // Ours carries the detail, in development only.
    showFatal('renderer-failed', error);
    return;
  }

  app.start();

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      app.dispose();
    });
  }
}

boot();
