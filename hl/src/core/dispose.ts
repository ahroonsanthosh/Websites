/**
 * Disposal walker.
 *
 * Three.js frees CPU-side objects by garbage collection, but the GPU-side
 * resources behind a geometry, a material's textures or a render target are
 * only released when `dispose()` is called on them. A stage that is left
 * behind therefore keeps its buffers and textures resident for the lifetime of
 * the page. This module is what makes a `teardown` correct.
 *
 * Two rules shape the whole file.
 *
 * **Identity, not names.** The same geometry, material, texture or skeleton is
 * routinely shared by several objects: the exported hand and flower alone has
 * four skinned meshes sharing one skeleton. Every entry point takes a `seen`
 * set keyed on the object itself, so each resource is disposed at most once per
 * operation.
 *
 * **Ownership stays with the caller.** The walker disposes resources. It does
 * not remove objects from their parents, does not touch the renderer, and does
 * not dispose a scene's `background` or `environment`, which are typically
 * app-owned and shared across stages. Removing the root and releasing
 * app-level resources remain the caller's job.
 *
 * Everything here is checked against the installed Three.js (0.180.0) rather
 * than assumed: the texture property list is enumerated from its material
 * sources, `Skeleton.dispose()` exists and frees the bone texture, `Sprite`
 * shares one module-level geometry between every sprite, and `BatchedMesh`
 * disposes its own geometry.
 */

import type {
  BufferGeometry,
  Material,
  Object3D,
  Skeleton,
  Texture,
  WebGLRenderTarget,
} from 'three';

/** Counts of what a disposal operation actually released. */
export interface DisposalStats {
  objects: number;
  geometries: number;
  materials: number;
  textures: number;
  skeletons: number;
  renderTargets: number;
}

export interface DisposeObjectOptions {
  /**
   * Dispose skeletons found on skinned meshes in the subtree. Default true.
   * Set false when a skeleton outlives the meshes bound to it.
   */
  skeletons?: boolean;
  /**
   * Identity set shared across calls, so several roots can be torn down as one
   * operation without disposing a shared resource twice. One is created per
   * call when omitted.
   */
  seen?: Set<object>;
}

/**
 * Every texture-bearing property on the built-in materials of Three.js 0.180,
 * enumerated from `node_modules/three/src/materials/*.js` rather than recalled.
 *
 * An explicit list is the point: scanning a material for anything that happens
 * to look like a texture would eventually dispose something the material
 * merely borrows.
 */
const TEXTURE_PROPERTIES = [
  'alphaMap',
  'anisotropyMap',
  'aoMap',
  'bumpMap',
  'clearcoatMap',
  'clearcoatNormalMap',
  'clearcoatRoughnessMap',
  'displacementMap',
  'emissiveMap',
  'envMap',
  'gradientMap',
  'iridescenceMap',
  'iridescenceThicknessMap',
  'lightMap',
  'map',
  'matcap',
  'metalnessMap',
  'normalMap',
  'roughnessMap',
  'sheenColorMap',
  'sheenRoughnessMap',
  'specularColorMap',
  'specularIntensityMap',
  'specularMap',
  'thicknessMap',
  'transmissionMap',
] as const;

/** Minimal structural views, so nothing here depends on `instanceof`. */
interface TextureLike {
  isTexture?: boolean;
  dispose?: () => void;
}
interface RenderTargetLike {
  isRenderTarget?: boolean;
  dispose?: () => void;
  texture?: TextureLike | TextureLike[];
  textures?: TextureLike[];
}
interface MaterialLike {
  isMaterial?: boolean;
  dispose?: () => void;
  uniforms?: Record<string, { value?: unknown } | undefined>;
}
interface RenderableLike {
  isSprite?: boolean;
  isBatchedMesh?: boolean;
  isInstancedMesh?: boolean;
  isSkinnedMesh?: boolean;
  geometry?: BufferGeometry;
  material?: Material | Material[];
  skeleton?: Skeleton;
  dispose?: () => void;
}

function emptyStats(): DisposalStats {
  return {
    objects: 0,
    geometries: 0,
    materials: 0,
    textures: 0,
    skeletons: 0,
    renderTargets: 0,
  };
}

/** First sighting of `resource` in this operation. */
function claim(seen: Set<object>, resource: object | null | undefined): boolean {
  if (!resource) return false;
  if (seen.has(resource)) return false;
  seen.add(resource);
  return true;
}

/**
 * Dispose one texture.
 *
 * Safe on null, on an already-disposed texture and on repeated calls:
 * `Texture.dispose()` only dispatches an event, which the renderer treats as a
 * no-op once the GPU resource is gone.
 */
export function disposeTexture(
  texture: Texture | null | undefined,
  seen: Set<object> = new Set(),
): boolean {
  const candidate = texture as TextureLike | null | undefined;
  if (!candidate || !claim(seen, candidate)) return false;
  candidate.dispose?.();
  return true;
}

/** Dispose one geometry. */
export function disposeGeometry(
  geometry: BufferGeometry | null | undefined,
  seen: Set<object> = new Set(),
): boolean {
  if (!geometry || !claim(seen, geometry)) return false;
  geometry.dispose();
  return true;
}

/**
 * Dispose a material, or an array of materials, together with the textures
 * they own.
 *
 * `ShaderMaterial.uniforms` is walked as well, since a hand-written shader
 * keeps its textures there and nowhere else. Only values that identify
 * themselves as textures are touched.
 */
export function disposeMaterial(
  material: Material | Material[] | null | undefined,
  seen: Set<object> = new Set(),
  stats: DisposalStats = emptyStats(),
): DisposalStats {
  if (!material) return stats;

  if (Array.isArray(material)) {
    for (let i = 0; i < material.length; i++) {
      disposeMaterial(material[i], seen, stats);
    }
    return stats;
  }

  if (!claim(seen, material)) return stats;

  const candidate = material as unknown as MaterialLike & Record<string, unknown>;

  for (let i = 0; i < TEXTURE_PROPERTIES.length; i++) {
    const value = candidate[TEXTURE_PROPERTIES[i]!] as TextureLike | null | undefined;
    if (value?.isTexture && disposeTexture(value as Texture, seen)) {
      stats.textures++;
    }
  }

  const uniforms = candidate.uniforms;
  if (uniforms) {
    for (const key in uniforms) {
      const value = uniforms[key]?.value as TextureLike | null | undefined;
      if (value?.isTexture && disposeTexture(value as Texture, seen)) {
        stats.textures++;
      }
    }
  }

  candidate.dispose?.();
  stats.materials++;
  return stats;
}

/**
 * Dispose a render target and the textures it owns.
 *
 * Only for targets the caller allocated. The renderer's default framebuffer is
 * not a render target object and is never reachable from here.
 */
export function disposeRenderTarget(
  target: WebGLRenderTarget | null | undefined,
  seen: Set<object> = new Set(),
  stats: DisposalStats = emptyStats(),
): DisposalStats {
  const candidate = target as RenderTargetLike | null | undefined;
  if (!candidate || !claim(seen, candidate)) return stats;

  // A multiple-render-target holds an array; a plain one holds a single
  // texture. `RenderTarget.dispose()` only dispatches, so its textures are
  // released here explicitly.
  const textures = candidate.textures ??
    (Array.isArray(candidate.texture) ? candidate.texture : candidate.texture ? [candidate.texture] : []);
  for (let i = 0; i < textures.length; i++) {
    if (disposeTexture(textures[i] as Texture, seen)) stats.textures++;
  }

  candidate.dispose?.();
  stats.renderTargets++;
  return stats;
}

/** Dispose a skeleton's GPU resources. Shared skeletons are disposed once. */
export function disposeSkeleton(
  skeleton: Skeleton | null | undefined,
  seen: Set<object> = new Set(),
): boolean {
  if (!skeleton || !claim(seen, skeleton)) return false;
  // Present since r151; frees the bone texture and nothing else.
  skeleton.dispose?.();
  return true;
}

/**
 * Walk an object graph and dispose every GPU resource it owns.
 *
 * The hierarchy is left intact: children are not removed and the root is not
 * detached from its parent. Call this, then remove the root yourself.
 */
export function disposeObject(
  root: Object3D | null | undefined,
  options: DisposeObjectOptions = {},
): DisposalStats {
  const stats = emptyStats();
  if (!root) return stats;

  const seen = options.seen ?? new Set<object>();
  const withSkeletons = options.skeletons ?? true;

  root.traverse((object) => {
    stats.objects++;
    const candidate = object as unknown as RenderableLike;

    if (candidate.isBatchedMesh) {
      // Its own dispose() frees the geometry and the internal matrix, indirect
      // and colour textures, so the geometry is claimed here to stop the
      // generic path disposing it a second time.
      claim(seen, candidate.geometry);
      candidate.dispose?.();
      stats.geometries++;
    } else if (candidate.isInstancedMesh) {
      // Frees the morph texture; geometry and material are still ours.
      candidate.dispose?.();
    }

    if (withSkeletons && candidate.isSkinnedMesh && disposeSkeleton(candidate.skeleton, seen)) {
      stats.skeletons++;
    }

    // Every sprite in the application shares one module-level geometry that
    // Three.js creates on first use. Disposing it would break every other
    // sprite on the page, so sprites contribute their material only.
    if (!candidate.isSprite && disposeGeometry(candidate.geometry, seen)) {
      stats.geometries++;
    }

    disposeMaterial(candidate.material, seen, stats);
  });

  return stats;
}
