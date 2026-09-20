/**
 * TEMPORARY development harness. Not part of the site.
 *
 * Its only job is to prove that the exported GLB loads through Three.js, that
 * both rigs arrive intact, and that the hand/flower state can be scrubbed
 * continuously from a single normalised value.
 *
 * Delete this once the real opening interaction exists.
 */

import {
  ACESFilmicToneMapping,
  AnimationMixer,
  Box3,
  Color,
  DirectionalLight,
  Group,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
  type AnimationAction,
  type AnimationClip,
  type Object3D,
} from 'three';
import { createGLTFLoader } from '@/core/gltf';
import { mark, Milestone, timeline } from '@/core/timing';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { PMREMGenerator } from 'three';

const canvas = document.querySelector<HTMLCanvasElement>('#webgl');
const slider = document.querySelector<HTMLInputElement>('#bloom');
const readout = document.querySelector<HTMLElement>('#readout');
if (!canvas || !slider || !readout) throw new Error('[dev] missing elements');

const renderer = new WebGLRenderer({ canvas, antialias: true });
renderer.outputColorSpace = SRGBColorSpace;
renderer.toneMapping = ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.setClearColor(new Color(0x05070a), 1);

const scene = new Scene();
const camera = new PerspectiveCamera(38, 1, 0.01, 50);

const pmrem = new PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const key = new DirectionalLight(0xfff4ea, 2.6);
key.position.set(-0.6, 0.8, 0.9);
scene.add(key);
const rim = new DirectionalLight(0xdfe8ff, 1.4);
rim.position.set(0.5, 0.4, -1.0);
scene.add(rim);

interface Result {
  clip: AnimationClip | null;
  mixer: AnimationMixer | null;
  action: AnimationAction | null;
  anchor: Object3D | null;
  root: Group | null;
  duration: number;
}

const result: Result = {
  clip: null, mixer: null, action: null, anchor: null, root: null, duration: 0,
};

function resize(): void {
  const w = canvas!.clientWidth || window.innerWidth;
  const h = canvas!.clientHeight || window.innerHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

function setProgress(p: number): void {
  const clamped = Math.min(1, Math.max(0, p));
  if (result.mixer && result.action && result.duration > 0) {
    // Scrubbing, not playback. `mixer.setTime()` resets every action's time to
    // zero first, which a paused action then never advances from, so the pose
    // is set directly and the mixer asked to apply it with no time step.
    result.action.time = clamped * result.duration;
    result.mixer.update(0);
  }
  readout!.textContent = `bloomProgress ${clamped.toFixed(3)}`;
}

mark(Milestone.AssetLoadStart);
// The Draco-compressed build of the same asset: byte for byte the same
// meshes, skins, materials, nodes and 150-track 6.25s clip, at 1.44 MB
// instead of 3.52 MB. The decoder is self-hosted; see src/core/gltf.ts.
createGLTFLoader().load('/models/heloria-hand-flower.draco.glb', (gltf) => {
  // Transfer, parse and decode are all behind us by the time this fires.
  mark(Milestone.AssetLoadEnd);
  const root = gltf.scene;
  scene.add(root);

  const mixer = new AnimationMixer(root);
  const clip = gltf.animations[0] ?? null;
  if (clip) {
    const action = mixer.clipAction(clip);
    action.play();
    action.paused = true;
    action.clampWhenFinished = true;
    result.action = action;
    result.duration = clip.duration;
  }

  result.root = root;
  result.mixer = mixer;
  result.clip = clip;
  result.anchor = root.getObjectByName('HeloriaFlowerAnchor') ?? null;

  // Frame the hand.
  setProgress(0);
  root.updateMatrixWorld(true);
  const box = new Box3().setFromObject(root);
  const size = box.getSize(new Vector3());
  const centre = box.getCenter(new Vector3());
  const dist = size.y / (2 * Math.tan((camera.fov * Math.PI) / 360)) * 1.45;
  camera.position.set(centre.x + dist * 0.18, centre.y + dist * 0.12, centre.z + dist);
  camera.lookAt(centre);

  const skinned: string[] = [];
  root.traverse((o) => {
    if ((o as { isSkinnedMesh?: boolean }).isSkinnedMesh) skinned.push(o.name);
  });

  // Reported for the headless check, not for humans.
  (window as unknown as Record<string, unknown>).__handFlower = {
    loaded: true,
    animations: gltf.animations.map((a) => ({ name: a.name, duration: a.duration, tracks: a.tracks.length })),
    skinnedMeshes: skinned,
    anchorFound: Boolean(result.anchor),
    bounds: { size: size.toArray(), centre: centre.toArray() },
    materials: Array.from(new Set<string>((() => {
      const names: string[] = [];
      root.traverse((o) => {
        const m = (o as { material?: { name?: string } | Array<{ name?: string }> }).material;
        if (Array.isArray(m)) m.forEach((x) => x?.name && names.push(x.name));
        else if (m?.name) names.push(m.name);
      });
      return names;
    })())),
    timeline: () => timeline(),
    setProgress: (p: number) => setProgress(p),
    sampleAnchor: (p: number) => {
      setProgress(p);
      result.root?.updateMatrixWorld(true);
      const v = new Vector3();
      result.anchor?.getWorldPosition(v);
      return v.toArray();
    },
  };
  setProgress(0);
  mark(Milestone.SceneReady);
});

slider.addEventListener('input', () => setProgress(Number(slider.value) / 1000));

let firstFrameMarked = false;
renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
  if (!firstFrameMarked) {
    firstFrameMarked = true;
    mark(Milestone.FirstFrame);
  }
});
