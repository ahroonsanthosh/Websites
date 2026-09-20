import gsap from 'gsap';
import {
  ACESFilmicToneMapping,
  Color,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';

import { Viewport, type ViewportSize } from '@/core/Viewport';

export interface AppOptions {
  canvas: HTMLCanvasElement;
  /** Upper bound on the drawing-buffer pixel ratio. */
  maxPixelRatio?: number;
  /** Renderer clear colour. Must match the CSS body background. */
  clearColor?: number;
}

/**
 * Application shell: owns the renderer, scene, camera, render loop and
 * lifecycle. The scene is intentionally empty — this is the foundation only.
 */
export class App {
  readonly canvas: HTMLCanvasElement;
  readonly renderer: WebGLRenderer;
  readonly scene: Scene;
  readonly camera: PerspectiveCamera;
  readonly viewport: Viewport;

  private readonly unsubscribeViewport: () => void;
  private running = false;
  private disposed = false;

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

    this.renderer.dispose();
  }

  private readonly applySize = ({ width, height, pixelRatio }: ViewportSize): void => {
    this.renderer.setPixelRatio(pixelRatio);
    // updateStyle = false: CSS already sizes the canvas to the viewport.
    this.renderer.setSize(width, height, false);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };

  private readonly tick = (): void => {
    this.renderer.render(this.scene, this.camera);
  };

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
