import {
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Timer,
  WebGLRenderer,
} from 'three';

export interface AppOptions {
  /** The canvas the experience renders into. */
  canvas: HTMLCanvasElement;
  /** Upper bound on device pixel ratio, to keep the fill rate sane on dense mobile displays. */
  maxPixelRatio?: number;
}

/**
 * Owns the render loop, the renderer and the viewport contract.
 *
 * This is deliberately empty of content: no scenes, materials, shaders or
 * motion live here yet. It exists so that everything built on top of it has a
 * single place that controls the canvas, the pixel ratio and the frame clock.
 */
export class App {
  readonly canvas: HTMLCanvasElement;
  readonly renderer: WebGLRenderer;
  readonly scene: Scene;
  readonly camera: PerspectiveCamera;

  private readonly timer = new Timer();
  private readonly maxPixelRatio: number;
  private readonly resizeObserver: ResizeObserver;
  private pixelRatioQuery: MediaQueryList | null = null;
  private frameHandle: number | null = null;
  private disposed = false;

  constructor({ canvas, maxPixelRatio = 2 }: AppOptions) {
    this.canvas = canvas;
    this.maxPixelRatio = maxPixelRatio;

    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.setClearColor(0x07080a, 1);

    this.scene = new Scene();
    this.camera = new PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 0, 5);

    // Connecting the timer to the document lets it use the Page Visibility
    // API, so a backgrounded tab does not resume with a multi-second delta.
    this.timer.connect(document);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);

    this.watchPixelRatio();
    this.resize();
  }

  start(): void {
    if (this.disposed || this.frameHandle !== null) return;
    this.timer.reset();
    this.frameHandle = requestAnimationFrame(this.tick);
  }

  stop(): void {
    if (this.frameHandle === null) return;
    cancelAnimationFrame(this.frameHandle);
    this.frameHandle = null;
  }

  /**
   * Matches the drawing buffer to the canvas' CSS box. Called by the
   * ResizeObserver, so it covers window resizes, orientation changes and the
   * mobile URL bar collapsing without a separate listener for each.
   */
  resize(): void {
    if (this.disposed) return;

    const width = this.canvas.clientWidth || 1;
    const height = this.canvas.clientHeight || 1;
    const pixelRatio = Math.min(window.devicePixelRatio, this.maxPixelRatio);

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(width, height, false);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;

    this.stop();
    this.resizeObserver.disconnect();
    this.pixelRatioQuery?.removeEventListener('change', this.onPixelRatioChange);
    this.pixelRatioQuery = null;
    this.timer.dispose();
    this.renderer.dispose();
  }

  private readonly tick = (timestamp: number): void => {
    this.frameHandle = requestAnimationFrame(this.tick);

    // Advance the timer every frame so delta and elapsed are correct the
    // moment there is something to animate.
    this.timer.update(timestamp);

    this.renderer.render(this.scene, this.camera);
  };

  /**
   * devicePixelRatio changes when a window moves between displays or the page
   * is zoomed; neither fires a resize on the canvas box, so it needs its own
   * listener to avoid rendering at a stale resolution.
   */
  private watchPixelRatio(): void {
    const query = window.matchMedia(
      `(resolution: ${window.devicePixelRatio}dppx)`,
    );
    query.addEventListener('change', this.onPixelRatioChange);
    this.pixelRatioQuery = query;
  }

  private readonly onPixelRatioChange = (): void => {
    this.pixelRatioQuery?.removeEventListener('change', this.onPixelRatioChange);
    this.watchPixelRatio();
    this.resize();
  };
}
