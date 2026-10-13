/**
 * The failure state.
 *
 * One reusable mechanism for "the experience cannot run here", so that every
 * future renderer or startup failure has somewhere to go rather than ending as
 * an uncaught exception over a black page.
 *
 * What it does is deliberately small: reveal the page's real content, show a
 * short plain-language notice, and hide the canvas. The markup already exists
 * in `index.html`; this only changes its state. No design work is done here,
 * because the site has none yet.
 */

export type FatalReason =
  /** The browser cannot provide the WebGL version the application needs. */
  | 'webgl-unsupported'
  /** WebGL exists but the renderer could not be created on this device. */
  | 'renderer-failed'
  /** Anything else that prevented startup. */
  | 'startup-failed';

/**
 * User-facing copy. No jargon, no version numbers, no stack traces, and no
 * apology: it says what happened and what is still available.
 */
const MESSAGES: Record<FatalReason, string> = {
  'webgl-unsupported':
    'This page uses 3D graphics that your browser cannot display. Everything else is below.',
  'renderer-failed':
    'The 3D graphics could not start on this device. Everything else is below.',
  'startup-failed': 'This page could not start properly. Everything else is below.',
};

/** Shown once. A second failure does not replace the first explanation. */
let shown = false;

/**
 * Enter the failure state.
 *
 * Safe to call more than once and safe to call before the DOM is ready, in
 * which case it does what it can and leaves the rest alone.
 *
 * @param reason Which failure this is, selecting the message.
 * @param detail The underlying error. Logged in development only; it never
 *               reaches the page.
 */
export function showFatal(reason: FatalReason, detail?: unknown): void {
  if (import.meta.env.DEV && detail !== undefined) {
    // Development only: the technical cause, with whatever stack it carries.
    console.error(`[heloria] ${reason}`, detail);
  }

  if (shown) return;
  shown = true;

  const canvas = document.querySelector<HTMLCanvasElement>('#webgl');
  const content = document.querySelector<HTMLElement>('#main');
  const notice = document.querySelector<HTMLElement>('#fatal');
  const message = document.querySelector<HTMLElement>('#fatal-message');

  // The canvas is going to stay blank, so take it out of the layout entirely
  // rather than leave an empty black surface over the content.
  if (canvas) canvas.hidden = true;

  // The page's content is normally present for assistive technology only,
  // because the experience carries it visually. With no experience, it becomes
  // the page.
  content?.classList.remove('is-offscreen');

  if (message) message.textContent = MESSAGES[reason];
  if (notice) notice.hidden = false;
}
