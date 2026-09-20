import { App } from './core/App';
import './styles/main.css';

const canvas = document.querySelector<HTMLCanvasElement>('#stage');

if (!canvas) {
  throw new Error('Missing #stage canvas element.');
}

const app = new App({ canvas });
app.start();

// Release the WebGL context on hot reload so repeated edits do not exhaust the
// browser's context limit during development.
if (import.meta.hot) {
  import.meta.hot.dispose(() => app.dispose());
}
