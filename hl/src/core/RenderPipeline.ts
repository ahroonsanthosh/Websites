/**
 * The render pipeline: scene, then contact ambient occlusion, then output.
 *
 * This exists for exactly one reason, and it should keep having to earn every
 * pass it grows. The reason is that the hand and the flower did not read as
 * touching. Measured on the skinned vertices in world space at five bloom
 * values, the two really are in contact: the sepals sit 0.28 mm off the palm
 * when the hand is closed and 1.96 mm off it when open, and at low bloom the
 * petal tips come within 0.15 mm of the fingers. None of that was visible,
 * because the scene is lit almost entirely by an environment map, and image
 * based lighting assumes every point can see the whole hemisphere. Two
 * surfaces a fraction of a millimetre apart were each being lit as if the
 * other were not there.
 *
 * Ambient occlusion is the term that was missing, so ambient occlusion is what
 * this adds. It is not a shadow and not a decal: it darkens where geometry
 * actually occludes geometry, which means it follows the skinned animation
 * with no pose-specific setup, and it disappears by itself when the petals
 * lift away from the fingers halfway through the bloom.
 *
 * ## Why GTAO and not a shadow map
 *
 * Both were implemented and measured over 35 frames, five bloom values across
 * seven camera angles, comparing each against the same frame rendered without
 * the effect. The measurement that decided it splits the hand's pixels by
 * geometry: those within 14 px of the flower's silhouette (the contact band)
 * and those more than 42 px from it (the far field). A technique that solves
 * the stated problem darkens the first and leaves the second alone.
 *
 *     technique            contact band   far field   worst angle, far field
 *     shadow map, PCFSoft       0.00981     0.00601                  0.03368
 *     SSAO                      0.00698    -0.00063                  0.01010
 *     GTAO, radius 8 mm         0.01151    -0.00181                  0.00492
 *
 * The shadow map darkens the far field by 61% of what it darkens the contact
 * band, and by 0.034 at its worst angle. That is not contact, it is a cast
 * shadow sweeping the whole hand: it says where the key light is, not where
 * the flower touches. Renders confirm it, as a soft dark blob thrown clear of
 * the flower onto open palm. It would also have meant designing the lighting
 * around the shadow, which is a different job.
 *
 * GTAO darkens the contact band more than either alternative while its far
 * field goes very slightly *brighter*, and that residue is not the AO: the
 * composer on its own, with no AO pass at all, measures -0.00206 there. SSAO
 * reaches 61% of GTAO's contact darkening and twice its worst-angle far-field
 * artefact.
 *
 * ## Radius
 *
 * 8 mm, in world units, against contacts of 0.15 to 2 mm and a palm hollow
 * 30 to 40 mm across. 12 mm measured within 3% of it and 20 mm slightly worse
 * on both axes. GTAO's own default is 0.25, which on an asset 104 x 137 x
 * 130 mm would occlude the entire hand against itself.
 *
 * ## The transparent clear
 *
 * A composer changes where tone mapping happens. Rendering straight to the
 * canvas, Three tone maps on the way out and the clear colour is never touched
 * by it. Rendering through a composer, the clear lands in a linear target and
 * `OutputPass` tone maps everything in it, which lifted the background from
 * (5, 7, 10) to (22, 30, 41): the whole frame changed for an effect that was
 * supposed to touch one contact region.
 *
 * So the scene pass clears to transparent black instead, and the page's own
 * background supplies the colour. Tone mapping zero gives zero, the background
 * comes out exactly as the CSS paints it, and the WebGL layer carries only the
 * scene. This requires the canvas context to have an alpha channel; `App`
 * creates it that way.
 */

import {
  Color,
  HalfFloatType,
  Vector2,
  WebGLRenderTarget,
  type Camera,
  type Scene,
  type WebGLRenderer,
} from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

/** Occlusion radius in world units. See the note above. */
export const DEFAULT_AO_RADIUS = 0.008;

export interface RenderPipelineOptions {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: Camera;
  /** Occlusion radius in world units. */
  aoRadius?: number;
  /** How much of the occlusion reaches the image, 0 to 1. */
  aoIntensity?: number;
  /**
   * Occlusion buffer size as a fraction of the drawing buffer.
   *
   * Left at 1. Half resolution saves 9.6 MB at 800x600 and costs 11% of the
   * contact darkening (0.01265 down to 0.01121), which is the one thing this
   * pass exists to produce. It does not add noise, it loses definition: the
   * high-frequency content inside the contact band falls with it, from 0.02613
   * to 0.01926.
   *
   * An earlier measurement found the two identical, at a 12 mm radius. They
   * are not identical at the 8 mm radius actually shipped, because a tighter
   * radius has finer detail to lose. Worth re-reading before anyone trusts the
   * earlier figure.
   */
  aoResolutionScale?: number;
  /**
   * Multisampling on the intermediate target. Rendering through a composer
   * bypasses the canvas's own MSAA, so without this the effect would arrive
   * together with aliased silhouettes and the comparison would be worthless.
   *
   * 2 rather than 4, because 4 costs 22 MB more at 800x600 and buys nothing
   * visible: at 2x magnification on the silhouette the two are
   * indistinguishable, while 0 stair-steps plainly. See `dispose` for the
   * memory this pass actually costs.
   */
  samples?: number;
}

/**
 * Owns the composer and every pass in it.
 *
 * `EffectComposer.dispose()` frees its two targets and its internal copy pass
 * and nothing else: the passes handed to `addPass` are not its business. Each
 * one is therefore disposed here by name.
 */
export class RenderPipeline {
  private readonly composer: EffectComposer;
  private readonly target: WebGLRenderTarget;
  private readonly renderPass: RenderPass;
  private readonly aoPass: GTAOPass;
  private readonly outputPass: OutputPass;
  private readonly aoScale: number;
  private disposed = false;

  constructor({
    renderer,
    scene,
    camera,
    aoRadius = DEFAULT_AO_RADIUS,
    aoIntensity = 1,
    aoResolutionScale = 1,
    samples = 2,
  }: RenderPipelineOptions) {
    this.aoScale = aoResolutionScale;

    const size = renderer.getDrawingBufferSize(new Vector2());

    this.target = new WebGLRenderTarget(Math.max(1, size.x), Math.max(1, size.y), {
      type: HalfFloatType,
      samples,
    });
    this.composer = new EffectComposer(renderer, this.target);

    this.renderPass = new RenderPass(scene, camera);
    // Transparent, so the page background is not dragged through tone mapping.
    this.renderPass.clearColor = new Color(0x000000);
    this.renderPass.clearAlpha = 0;
    this.composer.addPass(this.renderPass);

    this.aoPass = new GTAOPass(
      scene,
      camera,
      Math.max(1, size.x * this.aoScale),
      Math.max(1, size.y * this.aoScale),
    );
    this.aoPass.updateGtaoMaterial({
      radius: aoRadius,
      // Linear falloff with distance. The contacts here are all within a few
      // millimetres, so there is nothing for a curve to shape.
      distanceExponent: 1,
      // How far behind a surface a sample still counts as occluding. The
      // default is 1 world unit, which on a 0.14 m hand means the far side of
      // the palm occludes the near side.
      thickness: 0.01,
      scale: 1,
      samples: 16,
    });
    this.aoPass.blendIntensity = aoIntensity;
    this.composer.addPass(this.aoPass);

    this.outputPass = new OutputPass();
    this.composer.addPass(this.outputPass);
  }

  /** Draw one frame. */
  render(): void {
    if (this.disposed) return;
    this.composer.render();
  }

  /**
   * Resize every target.
   *
   * The occlusion pass is resized *after* the composer, never before:
   * `EffectComposer.setSize` walks its pass list and forces each one to the
   * full effective size, so a fractional occlusion buffer set first is silently
   * reset to full on the next resize.
   *
   */
  setSize(width: number, height: number, pixelRatio: number): void {
    if (this.disposed) return;
    this.composer.setPixelRatio(pixelRatio);
    this.composer.setSize(width, height);
    const w = Math.max(1, Math.round(width * pixelRatio * this.aoScale));
    const h = Math.max(1, Math.round(height * pixelRatio * this.aoScale));
    this.aoPass.setSize(w, h);
  }

  /**
   * Free every GPU resource this created.
   *
   * Verified rather than assumed. The check renders, disposes, and repeats the
   * whole cycle five times: geometry and texture counts return to their
   * pre-pipeline values and do not move across cycles or across resizes.
   *
   * What those resources cost, measured by instrumenting `texStorage2D`,
   * `texImage2D` and `renderbufferStorageMultisample` at 800x600:
   *
   *     samples  aoScale   added   of which MSAA   bytes per viewport pixel
   *           4      1.0   64.1 MB      43.9 MB                        140
   *           4      0.5   54.5 MB      43.9 MB                        119
   *           2      1.0   42.1 MB      22.0 MB                         92
   *           2      0.5   32.5 MB      22.0 MB                         71
   *           0      1.0   20.2 MB       0.0 MB                         44
   *
   * At the defaults that is 92 bytes per viewport pixel, so roughly 119 MB at
   * 1440x900. Most of it is multisampling, not the occlusion: the three
   * occlusion targets together are under 11 MB of it. This is the number to
   * bring to any decision about mobile, where it is the binding constraint,
   * and `samples` is the lever that moves it.
   */
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.aoPass.dispose();
    this.outputPass.dispose();
    // RenderPass allocates nothing that outlives it and has no dispose().
    this.composer.dispose();
    this.target.dispose();
  }
}
