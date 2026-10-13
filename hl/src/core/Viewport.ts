export interface ViewportSize {
  /** CSS pixel width of the render surface. */
  width: number;
  /** CSS pixel height of the render surface. */
  height: number;
  /** Clamped device pixel ratio used for the drawing buffer. */
  pixelRatio: number;
}

export type ViewportListener = (size: ViewportSize) => void;

/**
 * Tracks the render surface size and device pixel ratio.
 *
 * Resize is driven by a ResizeObserver on the canvas (which also fires for
 * mobile URL-bar collapse and container changes) plus a matchMedia listener on
 * the current dpr, so the drawing buffer follows zoom and monitor changes.
 */
export class Viewport {
  private readonly canvas: HTMLCanvasElement;
  private readonly maxPixelRatio: number;
  private readonly listeners = new Set<ViewportListener>();
  private readonly resizeObserver: ResizeObserver;

  private dprMediaQuery: MediaQueryList | null = null;
  private current: ViewportSize;

  constructor(canvas: HTMLCanvasElement, maxPixelRatio = 2) {
    this.canvas = canvas;
    this.maxPixelRatio = maxPixelRatio;
    this.current = this.measure();

    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(this.canvas);

    this.watchPixelRatio();
  }

  get size(): ViewportSize {
    return this.current;
  }

  /** Subscribe to size changes. Returns an unsubscribe function. */
  onChange(listener: ViewportListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  dispose(): void {
    this.resizeObserver.disconnect();
    this.dprMediaQuery?.removeEventListener('change', this.handlePixelRatioChange);
    this.dprMediaQuery = null;
    this.listeners.clear();
  }

  private measure(): ViewportSize {
    const rect = this.canvas.getBoundingClientRect();
    return {
      width: Math.max(1, Math.round(rect.width)),
      height: Math.max(1, Math.round(rect.height)),
      pixelRatio: Math.min(window.devicePixelRatio || 1, this.maxPixelRatio),
    };
  }

  private readonly handleResize = (): void => {
    const next = this.measure();
    if (
      next.width === this.current.width &&
      next.height === this.current.height &&
      next.pixelRatio === this.current.pixelRatio
    ) {
      return;
    }

    this.current = next;
    for (const listener of this.listeners) {
      listener(next);
    }
  };

  /**
   * devicePixelRatio has no event of its own; a media query bound to the
   * current ratio fires exactly when it stops matching.
   */
  private watchPixelRatio(): void {
    this.dprMediaQuery?.removeEventListener('change', this.handlePixelRatioChange);
    const dpr = window.devicePixelRatio || 1;
    this.dprMediaQuery = window.matchMedia(`(resolution: ${dpr}dppx)`);
    this.dprMediaQuery.addEventListener('change', this.handlePixelRatioChange);
  }

  private readonly handlePixelRatioChange = (): void => {
    this.watchPixelRatio();
    this.handleResize();
  };
}
