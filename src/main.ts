import '@/styles/main.css';

import { App } from '@/core/App';

const canvas = document.querySelector<HTMLCanvasElement>('#webgl');

if (!canvas) {
  throw new Error('[heloria] Missing #webgl canvas element.');
}

const app = new App({ canvas });
app.start();

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    app.dispose();
  });
}
