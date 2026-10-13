/**
 * The project's glTF loader configuration.
 *
 * One place where a `GLTFLoader` is built, so every consumer decodes the same
 * way and nobody has to remember to attach the Draco decoder.
 *
 * The decoder is **self-hosted**, served from `/vendor/draco/`, copied verbatim
 * out of the installed Three.js package (see `public/vendor/draco/PROVENANCE.md`).
 * It is never fetched from a CDN. The reason is not preference: a third-party
 * origin becoming slow takes every compressed asset down with it, even when the
 * assets themselves are local, and at that point the site has no geometry.
 *
 * Taking the decoder from the installed package also guarantees it matches the
 * `DRACOLoader` driving it. A decoder and a loader from different versions is
 * the kind of mismatch that fails on some assets and not others.
 */

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/** Where the vendored decoder is served from. Trailing slash is required. */
export const DRACO_DECODER_PATH = '/vendor/draco/';

export interface GLTFLoaderOptions {
  /**
   * Start fetching the decoder immediately rather than waiting for the first
   * compressed mesh. Default true.
   *
   * Without this the decoder request only begins once the glTF has arrived and
   * parsing reaches a Draco primitive, so 251 KB of decoder is fetched *after*
   * the asset instead of alongside it. Preloading overlaps the two.
   */
  preloadDecoder?: boolean;
}

/**
 * A `DRACOLoader` owns a pool of Web Workers, so it is created once and shared
 * rather than per load.
 */
let sharedDecoder: DRACOLoader | null = null;

function decoder(preload: boolean): DRACOLoader {
  if (sharedDecoder === null) {
    sharedDecoder = new DRACOLoader();
    sharedDecoder.setDecoderPath(DRACO_DECODER_PATH);
    if (preload) sharedDecoder.preload();
  }
  return sharedDecoder;
}

/** A `GLTFLoader` that can decode this project's compressed assets. */
export function createGLTFLoader(options: GLTFLoaderOptions = {}): GLTFLoader {
  const loader = new GLTFLoader();
  loader.setDRACOLoader(decoder(options.preloadDecoder ?? true));
  return loader;
}

/**
 * Terminate the decoder's workers and drop the shared instance.
 *
 * Geometry already decoded is unaffected; this releases the decoding machinery,
 * not the meshes. Scene resources are the disposal walker's job.
 */
export function disposeGLTFDecoder(): void {
  sharedDecoder?.dispose();
  sharedDecoder = null;
}
