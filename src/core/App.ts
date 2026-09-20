import gsap from 'gsap';
import {
  ACESFilmicToneMapping,
  Color,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';

import { UpdateRegistry } from '@/core/UpdateRegistry';
import { Viewport, type ViewportSize } from '@/core/Viewport';

/**
 * Upper bound on a single frame's delta, in seconds.
 *
 * A backgrounded tab stops receiving frames, and GSAP's own lag smoothing only
 * limits the gap to its threshold, so a resumed tab can still deliver a delta
 * of several hundred milliseconds. Integrating one step that large is not an
 * approximation of the motion that was missed, it is a jump. Anything longer
 * than this is treated as a stall and charged as a single 100ms step.
 */
export const MAX_DELTA_SECONDS = 0.1;

export interface AppOptions {
  canvas: HTMLCanvasElement;
  /** Upper bound on the drawing-buffer pixel ratio. */
  maxPixelRatio?: number;
  /** Renderer clear colour. Must match the CSS body background. */
  clearColor?: number;
}

/**
 * Application shell: owns the renderer, scene, camera, frame loop and
 * lifecycle. The scene is intentionally empty; this is the foundation only.
 *
 * The frame is: compute timing, run the registered systems in order, render.
 * Rendering is a separate step rather than a registered system, so that the
 * draw is always last and always explicit. Nothing that belongs to a scene, a
 * stage or the progression value belongs in this class; they register instead.
 */
export class App {
  readonly canvas: HTMLCanvasElement;
  readonly renderer: WebGLRenderer;
  readonly scene: Scene;
  readonly camera: PerspectiveCamera;
  readonly viewport: Viewport;

  /** The one ordered per-frame update list. */
  readonly updates = new UpdateRegistry();

  private readonly unsubscribeViewport: () => void;
  private running = false;
  private disposed = false;

  private elapsedSeconds = 0;
  private deltaSeconds = 0;
  private frameCount = 0;

  constructor({ canvas, maxPixelRatio = 2, clearColor = 0x05070a }: AppOptions) {
    this.canvas = canvas;

    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.setClearColor(new Color(clearColor), 1);

    this.scene = new Scene();

    this.camera = new PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 0, 5);

    this.viewport = new Viewport(canvas, maxPixelRatio);
    this.unsubscribeViewport = this.viewport.onChange(this.applySize);
    this.applySize(this.viewport.size);

    canvas.addEventListener('webglcontextlost', this.handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', this.handleContextRestored, false);
    document.addEventListener('visibilitychange', this.handleVisibilityChange, false);
  }

  /** Seconds since the app started, as the sum of the clamped deltas. */
  get elapsed(): number {
    return this.elapsedSeconds;
  }

  /** The most recent clamped delta, in seconds. */
  get delta(): number {
    return this.deltaSeconds;
  }

  /** Frames this app has actually run. Not the ticker's global frame number. */
  get frame(): number {
    return this.frameCount;
  }

  start(): void {
    if (this.running || this.disposed) return;
    this.running = true;
    // GSAP's ticker is the single clock for the whole app, so future motion
    // and the render loop never drift apart across two rAF callbacks.
    gsap.ticker.add(this.tick);
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    gsap.ticker.remove(this.tick);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;

    this.stop();

    this.canvas.removeEventListener('webglcontextlost', this.handleContextLost, false);
    this.canvas.removeEventListener('webglcontextrestored', this.handleContextRestored, false);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange, false);

    this.unsubscribeViewport();
    this.viewport.dispose();

    this.updates.clear();

    this.renderer.dispose();
  }

  private readonly applySize = ({ width, height, pixelRatio }: ViewportSize): void => {
    this.renderer.setPixelRatio(pixelRatio);
    // updateStyle = false: CSS already sizes the canvas to the viewport.
    this.renderer.setSize(width, height, false);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };

  /**
   * The frame.
   *
   * GSAP's ticker supplies `(time, deltaMs, frame)`. Its `time` is seconds
   * since the ticker woke and its delta is milliseconds, so the conversion and
   * the clamp happen here, once, and every system downstream is handed seconds
   * that are already safe to integrate.
   *
   * Elapsed is accumulated from the clamped deltas rather than taken from the
   * ticker, so that `elapsed` is always exactly the sum of the deltas the
   * systems were given. A simulation that integrates deltas and a value that
   * skipped a stall would otherwise disagree.
   */
  private readonly tick: gsap.TickerCallback = (_time, deltaMs): void => {
    const delta = deltaMs * 0.001;
    this.deltaSeconds = delta < MAX_DELTA_SECONDS ? delta : MAX_DELTA_SECONDS;
    this.elapsedSeconds += this.deltaSeconds;
    this.frameCount++;

    this.updates.update(this.deltaSeconds, this.elapsedSeconds);
    this.render();
  };

  /** The draw. Kept separate from orchestration so it stays the last step. */
  private render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  private readonly handleContextLost = (event: Event): void => {
    // Preventing the default lets the browser restore the context for us.
    event.preventDefault();
    this.stop();
  };

  private readonly handleContextRestored = (): void => {
    this.applySize(this.viewport.size);
    this.start();
  };

  /** Never burn GPU time on a hidden tab. */
  private readonly handleVisibilityChange = (): void => {
    if (this.disposed) return;
    if (document.hidden) {
      this.stop();
    } else {
      this.start();
    }
  };
}
