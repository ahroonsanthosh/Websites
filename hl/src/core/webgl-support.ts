/**
 * WebGL capability detection.
 *
 * The requirement is not a guess. Three.js 0.180's `WebGLRenderer` asks for
 * exactly one context name, `'webgl2'`, with no WebGL 1 fallback path
 * (`node_modules/three/src/renderers/WebGLRenderer.js`), so **WebGL 2 is the
 * minimum capability this application has**. Nothing currently in the scene
 * raises that bar further: the renderer is constructed with `antialias`,
 * `alpha: false`, `stencil: false`, `depth: true` and a `powerPreference`
 * hint, and no extension, float texture or compressed format is required yet.
 *
 * Detection happens before the application is constructed so that a browser
 * which cannot run it is told so, rather than shown a black page.
 *
 * A probe cannot be conclusive on its own: it asks for a bare context, while
 * the renderer asks for one with specific attributes, and a driver can refuse
 * the second after granting the first. Construction is therefore still
 * guarded by the caller. This check exists to catch the common case cheaply
 * and early.
 */

export type UnsupportedReason =
  /** The browser does not expose WebGL 2 at all. */
  | 'no-webgl2'
  /** WebGL 2 is exposed but a context could not be created. */
  | 'context-unavailable';

export type WebGLSupport =
  | { readonly supported: true }
  | { readonly supported: false; readonly reason: UnsupportedReason; readonly detail: string };

/**
 * Probe for WebGL 2 on a throwaway canvas.
 *
 * The probe context is released explicitly through `WEBGL_lose_context`.
 * Browsers cap the number of live WebGL contexts per page (commonly around
 * sixteen), and leaking one here would cost the application the context it is
 * about to ask for.
 */
export function detectWebGLSupport(): WebGLSupport {
  if (typeof WebGL2RenderingContext === 'undefined') {
    return {
      supported: false,
      reason: 'no-webgl2',
      detail: 'WebGL2RenderingContext is not defined in this browser.',
    };
  }

  let canvas: HTMLCanvasElement | null = null;
  let gl: WebGL2RenderingContext | null = null;

  try {
    canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    gl = canvas.getContext('webgl2');

    if (gl === null) {
      return {
        supported: false,
        reason: 'context-unavailable',
        detail: 'canvas.getContext("webgl2") returned null.',
      };
    }

    return { supported: true };
  } catch (error) {
    return {
      supported: false,
      reason: 'context-unavailable',
      detail: error instanceof Error ? error.message : String(error),
    };
  } finally {
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    canvas = null;
  }
}
