"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  MeshDistortMaterial,
  MeshTransmissionMaterial,
  Float,
  Environment,
  useTexture,
  Sparkles,
  Trail,
  MeshWobbleMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";

/* ─────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────── */
interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  featured: boolean;
  available: boolean;
  badge: string;
}

interface MenuContent {
  categories: string[];
  items: MenuItem[];
}

/* ─────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────── */
const SCROLL_HEIGHT = 400; // vh per section

// Warm firelight palette
const FIRE_ORANGE = new THREE.Color(0xf97316);
const FIRE_RED    = new THREE.Color(0xdc2626);
const FIRE_AMBER  = new THREE.Color(0xfbbf24);
const FIRE_DEEP   = new THREE.Color(0x7c2d12);

/* ─────────────────────────────────────────────────────────────────
   SHADER — golden-brown skin PBR approximation with SSS fringe
───────────────────────────────────────────────────────────────── */
const chickenVertShader = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uDistort;

  // Layered simplex-like noise for organic surface bump
  float hash(vec3 p) {
    p = fract(p * vec3(0.1031, 0.103, 0.0973));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
  }
  float noise(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),
                   mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
               mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                   mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec3 pos = position;

    // Organic surface displacement — simulates skin texture & fat bumps
    float n = noise(pos * 3.0 + uTime * 0.08);
    float n2 = noise(pos * 7.0 - uTime * 0.05);
    pos += normal * (n * 0.04 + n2 * 0.015) * uDistort;

    // Heat shimmer — high-frequency micro-vibration near top
    float shimmer = noise(pos * 12.0 + uTime * 2.1) * 0.006;
    pos.y += shimmer * smoothstep(0.2, 1.0, (pos.y + 1.0) * 0.5);

    vec4 worldPos4 = modelMatrix * vec4(pos, 1.0);
    vWorldPos = worldPos4.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos4;
  }
`;

const chickenFragShader = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uFirePos1;
  uniform vec3 uFirePos2;
  uniform float uFireIntensity;
  uniform float uCaramel;     // 0→1 progression of browning
  uniform float uRotisserie;  // rotation progress

  // --- colour palette ---
  // Raw pale chicken → golden → deep mahogany caramelisation
  vec3 rawColour    = vec3(0.95, 0.82, 0.65);
  vec3 goldenColour = vec3(0.85, 0.52, 0.15);
  vec3 caramelColour= vec3(0.55, 0.22, 0.06);
  vec3 charColour   = vec3(0.18, 0.08, 0.03);

  float hash(vec3 p) {
    p = fract(p * vec3(0.1031, 0.103, 0.0973));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
  }
  float noise(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),
                   mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
               mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                   mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
  }

  void main() {
    // Base caramelisation noise — mottled patches like real roasting
    float browning = noise(vWorldPos * 4.0) * 0.6 + noise(vWorldPos * 9.0) * 0.4;
    float caramelMask = clamp(uCaramel + browning * 0.3 - 0.15, 0.0, 1.0);

    vec3 skinColour = mix(rawColour, goldenColour, smoothstep(0.0, 0.5, caramelMask));
    skinColour      = mix(skinColour, caramelColour, smoothstep(0.4, 0.8, caramelMask));
    skinColour      = mix(skinColour, charColour,    smoothstep(0.75, 1.0, caramelMask));

    // Grill marks — thin dark bands
    float grillAngle = vWorldPos.y * 8.0 + vWorldPos.x * 2.0;
    float grillMark  = smoothstep(0.42, 0.45, abs(fract(grillAngle) - 0.5));
    skinColour *= mix(1.0, 0.45, grillMark * clamp(uCaramel * 2.0, 0.0, 1.0));

    // --- Lighting ---
    vec3 N = normalize(vNormal);

    // Firelight 1 (primary — below-left)
    vec3 L1   = normalize(uFirePos1 - vWorldPos);
    float d1  = length(uFirePos1 - vWorldPos);
    float diff1 = max(dot(N, L1), 0.0) * (1.0 / (1.0 + d1 * 0.25));
    // Firelight flicker
    float flicker = 0.82 + 0.18 * sin(uTime * 7.3) * sin(uTime * 3.1 + 0.9);
    vec3 fireLight1 = vec3(1.0, 0.42, 0.08) * diff1 * uFireIntensity * flicker * 2.8;

    // Firelight 2 (secondary — right-side fill)
    vec3 L2   = normalize(uFirePos2 - vWorldPos);
    float d2  = length(uFirePos2 - vWorldPos);
    float diff2 = max(dot(N, L2), 0.0) * (1.0 / (1.0 + d2 * 0.4));
    vec3 fireLight2 = vec3(1.0, 0.3, 0.05) * diff2 * uFireIntensity * flicker * 1.4;

    // Ambient — dark warm cave feeling
    vec3 ambientLight = vec3(0.06, 0.03, 0.01) * 3.5;

    // SSS fringe — backlit glow through thin edges (silhouette)
    float sss   = pow(max(0.0, 1.0 - abs(dot(N, vec3(0.0, 0.0, 1.0)))), 2.5);
    vec3 sssCol = vec3(0.9, 0.4, 0.1) * sss * uFireIntensity * 0.7;

    // Specular highlight — moisture sheen on skin
    vec3 V    = normalize(vec3(0.0, 0.0, 3.0) - vWorldPos);
    vec3 H    = normalize(L1 + V);
    float spec = pow(max(dot(N, H), 0.0), 48.0) * 0.6 * flicker;
    vec3 specCol = vec3(1.0, 0.9, 0.7) * spec;

    // Fat drip gloss patches
    float gloss = noise(vWorldPos * 6.0 + vec3(0.0, uTime * 0.04, 0.0));
    gloss = smoothstep(0.6, 0.85, gloss) * 0.4;
    specCol += vec3(1.0, 0.75, 0.4) * gloss * flicker;

    vec3 finalColour = skinColour * (ambientLight + fireLight1 + fireLight2) + sssCol + specCol;

    // Tone-map (filmic)
    finalColour = finalColour / (finalColour + 0.8);
    finalColour = pow(finalColour, vec3(0.4545)); // gamma

    gl_FragColor = vec4(finalColour, 1.0);
  }
`;

/* ─────────────────────────────────────────────────────────────────
   STEAM PARTICLE SHADER
───────────────────────────────────────────────────────────────── */
const steamVertShader = /* glsl */`
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  attribute vec3  aOffset;
  uniform float uTime;
  uniform float uIntensity;
  varying float vAlpha;

  float hash(float p) { return fract(sin(p * 127.1) * 43758.5); }

  void main() {
    float t = mod(uTime * aSpeed + aPhase, 1.0);
    float ease = t * t * (3.0 - 2.0 * t); // smoothstep upward

    // Curl upward with drift
    vec3 pos = aOffset;
    pos.y += t * 3.8;

    // Turbulence drift — each particle curves differently
    float drift = sin(uTime * 0.7 + aPhase * 6.28) * 0.35;
    float drift2 = cos(uTime * 0.5 + aPhase * 3.14 + 1.2) * 0.2;
    pos.x += drift * t;
    pos.z += drift2 * t;

    // Expand outward as it rises
    pos.xz += aOffset.xz * t * 1.2;

    vAlpha = uIntensity * (1.0 - ease) * smoothstep(0.0, 0.08, t) * 0.55;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (aSize * (1.0 + t * 3.0)) * (250.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const steamFragShader = /* glsl */`
  varying float vAlpha;
  void main() {
    // Soft disc
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    float disc = 1.0 - smoothstep(0.3, 0.5, r);
    if (disc < 0.01) discard;
    gl_FragColor = vec4(1.0, 0.95, 0.88, disc * vAlpha);
  }
`;

/* ─────────────────────────────────────────────────────────────────
   EMBER PARTICLE SHADER — rising sparks from fire below
───────────────────────────────────────────────────────────────── */
const emberVertShader = /* glsl */`
  attribute float aPhase;
  attribute float aSpeed;
  attribute vec2  aSpread;
  uniform float uTime;
  uniform float uIntensity;
  varying float vAlpha;
  varying vec3  vColour;

  void main() {
    float t = mod(uTime * aSpeed + aPhase, 1.0);

    vec3 pos = vec3(aSpread.x, -2.0 + t * 5.5, aSpread.y);
    // Spiral upward
    float angle = t * 6.28 * 1.5 + aPhase * 6.28;
    pos.x += sin(angle) * 0.15 * t;
    pos.z += cos(angle) * 0.1 * t;

    vAlpha = uIntensity * (1.0 - t) * smoothstep(0.0, 0.05, t) * 0.9;

    // Colour: bright amber → red → dark
    vec3 bright = vec3(1.0, 0.75, 0.1);
    vec3 dim    = vec3(0.6, 0.1, 0.02);
    vColour = mix(bright, dim, t * t);

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (3.5 * (1.0 - t * 0.7)) * (180.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const emberFragShader = /* glsl */`
  varying float vAlpha;
  varying vec3  vColour;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv) * 2.0;
    float disc = 1.0 - smoothstep(0.6, 1.0, r);
    if (disc < 0.01) discard;
    gl_FragColor = vec4(vColour, disc * vAlpha);
  }
`;

/* ─────────────────────────────────────────────────────────────────
   PROCEDURAL CHICKEN MESH
   Body: lathe profile | Legs: cylinders | Drumstick ends: spheres
───────────────────────────────────────────────────────────────── */
function ChickenMesh({
  scrollProgress,
  caramel,
  fireIntensity,
}: {
  scrollProgress: number;
  caramel: number;
  fireIntensity: number;
}) {
  const meshRef   = useRef<THREE.Group>(null!);
  const bodyRef   = useRef<THREE.Mesh>(null!);
  const matRef    = useRef<THREE.ShaderMaterial>(null!);
  const { clock } = useThree();

  // Build body shape via lathe — a plump ovoid rotisserie chicken silhouette
  const bodyGeometry = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const segments = 40;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      // Parametric profile: wider in middle, tapered top & bottom
      const y = (t - 0.5) * 2.2;
      // Profile function: breast peak at t≈0.6, narrowing to neck & cavity
      let r = Math.sin(t * Math.PI);
      // Breast bulge
      r += 0.28 * Math.exp(-Math.pow((t - 0.62) * 3.5, 2));
      // Cavity indent (bottom)
      r -= 0.12 * Math.exp(-Math.pow((t - 0.12) * 5.0, 2));
      // Neck narrowing
      r -= 0.15 * Math.exp(-Math.pow((t - 0.88) * 4.5, 2));
      r = Math.max(r * 0.72, 0.01);
      pts.push(new THREE.Vector2(r, y));
    }
    return new THREE.LatheGeometry(pts, 64);
  }, []);

  // Drumstick geometry — tapered cylinder + knob sphere
  const drumGeometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.08, 0.14, 0.65, 16);
    return geo;
  }, []);
  const knobGeometry = useMemo(() => new THREE.SphereGeometry(0.14, 16, 12), []);
  const wingGeometry = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const r = Math.sin(t * Math.PI) * 0.18;
      pts.push(new THREE.Vector2(r, (t - 0.5) * 0.7));
    }
    return new THREE.LatheGeometry(pts, 12);
  }, []);

  const shaderMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: chickenVertShader,
        fragmentShader: chickenFragShader,
        uniforms: {
          uTime:          { value: 0 },
          uDistort:       { value: 1.0 },
          uFirePos1:      { value: new THREE.Vector3(-2, -1.5, 1.5) },
          uFirePos2:      { value: new THREE.Vector3(2.5, -0.5, 0.8) },
          uFireIntensity: { value: fireIntensity },
          uCaramel:       { value: caramel },
          uRotisserie:    { value: 0 },
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame(() => {
    const t = clock.getElapsedTime();
    shaderMat.uniforms.uTime.value = t;
    shaderMat.uniforms.uFireIntensity.value = fireIntensity;
    shaderMat.uniforms.uCaramel.value = caramel;

    if (meshRef.current) {
      // Natural rotisserie rotation — slow, slightly wobbly
      meshRef.current.rotation.y = t * 0.22 + scrollProgress * Math.PI * 0.5;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.04;
      meshRef.current.rotation.z = Math.sin(t * 0.21) * 0.025;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Body */}
      <mesh ref={bodyRef} geometry={bodyGeometry} material={shaderMat} castShadow receiveShadow />

      {/* Left drumstick */}
      <group position={[-0.38, -0.65, 0.2]} rotation={[0.6, 0, -0.3]}>
        <mesh geometry={drumGeometry} material={shaderMat} castShadow />
        <mesh geometry={knobGeometry} position={[0, -0.38, 0]} material={shaderMat} castShadow />
      </group>

      {/* Right drumstick */}
      <group position={[0.38, -0.65, 0.2]} rotation={[0.6, 0, 0.3]}>
        <mesh geometry={drumGeometry} material={shaderMat} castShadow />
        <mesh geometry={knobGeometry} position={[0, -0.38, 0]} material={shaderMat} castShadow />
      </group>

      {/* Left wing stub */}
      <group position={[-0.68, 0.1, 0]} rotation={[0.2, 0, 0.7]}>
        <mesh geometry={wingGeometry} material={shaderMat} castShadow />
      </group>

      {/* Right wing stub */}
      <group position={[0.68, 0.1, 0]} rotation={[0.2, 0, -0.7]}>
        <mesh geometry={wingGeometry} material={shaderMat} castShadow />
      </group>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────────
   STEAM SYSTEM
───────────────────────────────────────────────────────────────── */
function Steam({ intensity }: { intensity: number }) {
  const COUNT = 180;
  const ref = useRef<THREE.Points>(null!);
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const { clock } = useThree();

  const { positions, phases, speeds, sizes, offsets } = useMemo(() => {
    const phases  = new Float32Array(COUNT);
    const speeds  = new Float32Array(COUNT);
    const sizes   = new Float32Array(COUNT);
    const offsets = new Float32Array(COUNT * 3);
    const positions = new Float32Array(COUNT * 3); // all zero — shader drives them
    for (let i = 0; i < COUNT; i++) {
      phases[i]  = Math.random();
      speeds[i]  = 0.12 + Math.random() * 0.18;
      sizes[i]   = 8 + Math.random() * 18;
      const angle = Math.random() * Math.PI * 2;
      const r     = Math.random() * 0.35;
      offsets[i * 3]     = Math.cos(angle) * r;
      offsets[i * 3 + 1] = 0;
      offsets[i * 3 + 2] = Math.sin(angle) * r;
    }
    return { positions, phases, speeds, sizes, offsets };
  }, []);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: steamVertShader,
        fragmentShader: steamFragShader,
        uniforms: { uTime: { value: 0 }, uIntensity: { value: intensity } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame(() => {
    mat.uniforms.uTime.value = clock.getElapsedTime();
    mat.uniforms.uIntensity.value = intensity;
  });

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aPhase",   new THREE.BufferAttribute(phases, 1));
    g.setAttribute("aSpeed",   new THREE.BufferAttribute(speeds, 1));
    g.setAttribute("aSize",    new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("aOffset",  new THREE.BufferAttribute(offsets, 3));
    return g;
  }, [positions, phases, speeds, sizes, offsets]);

  return (
    <points ref={ref} geometry={geo} material={mat} position={[0, 0.8, 0]} />
  );
}

/* ─────────────────────────────────────────────────────────────────
   EMBER SPARKS
───────────────────────────────────────────────────────────────── */
function Embers({ intensity }: { intensity: number }) {
  const COUNT = 80;
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const { clock } = useThree();

  const { phases, speeds, spreads, positions } = useMemo(() => {
    const phases = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);
    const spreads = new Float32Array(COUNT * 2);
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      phases[i] = Math.random();
      speeds[i] = 0.25 + Math.random() * 0.35;
      spreads[i * 2]     = (Math.random() - 0.5) * 2.0;
      spreads[i * 2 + 1] = (Math.random() - 0.5) * 0.8;
    }
    return { phases, speeds, spreads, positions };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aPhase",  new THREE.BufferAttribute(phases, 1));
    g.setAttribute("aSpeed",  new THREE.BufferAttribute(speeds, 1));
    g.setAttribute("aSpread", new THREE.BufferAttribute(spreads, 2));
    return g;
  }, [positions, phases, speeds, spreads]);

  const shaderMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: emberVertShader,
        fragmentShader: emberFragShader,
        uniforms: { uTime: { value: 0 }, uIntensity: { value: intensity } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame(() => {
    shaderMat.uniforms.uTime.value = clock.getElapsedTime();
    shaderMat.uniforms.uIntensity.value = intensity;
  });

  return <points geometry={geo} material={shaderMat} />;
}

/* ─────────────────────────────────────────────────────────────────
   INGREDIENT ORBS — floating 3D elements that assemble into dishes
   Each has unique geometry + material, orbits in 3D, and responds
   to the assembly progress value.
───────────────────────────────────────────────────────────────── */
interface IngredientConfig {
  id: string;
  label: string;
  colour: string;
  emissive: string;
  geometry: "sphere" | "torus" | "octahedron" | "cone" | "capsule" | "tetra";
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  orbitTilt: number;
  scale: number;
  // Where it snaps to when assembled (relative to origin)
  assembledPos: [number, number, number];
}

function buildIngredients(): IngredientConfig[] {
  return [
    { id: "chicken", label: "Chicken",    colour: "#c2641b", emissive: "#7c2d0a", geometry: "sphere",      orbitRadius: 1.8, orbitSpeed: 0.38, orbitPhase: 0.0,  orbitTilt: 0.2,  scale: 0.38, assembledPos: [0, 0.6, 0] },
    { id: "bread",   label: "Ciabatta",   colour: "#c8a060", emissive: "#6b4a10", geometry: "octahedron",  orbitRadius: 2.2, orbitSpeed: 0.28, orbitPhase: 0.9,  orbitTilt: 0.5,  scale: 0.28, assembledPos: [-0.5, -0.3, 0.3] },
    { id: "chilli",  label: "Piri Piri",  colour: "#dc2626", emissive: "#7f1d1d", geometry: "cone",        orbitRadius: 1.5, orbitSpeed: 0.55, orbitPhase: 2.1,  orbitTilt: 0.8,  scale: 0.22, assembledPos: [0.6, 0.1, 0.4] },
    { id: "cheese",  label: "Cheese",     colour: "#fbbf24", emissive: "#92400e", geometry: "octahedron",  orbitRadius: 2.5, orbitSpeed: 0.32, orbitPhase: 3.5,  orbitTilt: -0.4, scale: 0.24, assembledPos: [-0.3, 0.3, 0.5] },
    { id: "herb",    label: "Herbs",      colour: "#16a34a", emissive: "#14532d", geometry: "torus",       orbitRadius: 1.9, orbitSpeed: 0.44, orbitPhase: 1.4,  orbitTilt: 1.1,  scale: 0.18, assembledPos: [0.4, 0.5, -0.3] },
    { id: "wedge",   label: "Wedges",     colour: "#d97706", emissive: "#78350f", geometry: "octahedron",  orbitRadius: 2.8, orbitSpeed: 0.22, orbitPhase: 4.7,  orbitTilt: -0.7, scale: 0.30, assembledPos: [-0.6, -0.5, -0.2] },
    { id: "onion",   label: "Pickled Onion", colour: "#a855f7", emissive: "#581c87", geometry: "torus",    orbitRadius: 2.0, orbitSpeed: 0.41, orbitPhase: 5.8,  orbitTilt: 0.3,  scale: 0.16, assembledPos: [0.2, -0.6, 0.5] },
    { id: "tomato",  label: "Tomato",     colour: "#ef4444", emissive: "#7f1d1d", geometry: "sphere",      orbitRadius: 2.3, orbitSpeed: 0.36, orbitPhase: 0.6,  orbitTilt: -0.9, scale: 0.20, assembledPos: [-0.4, 0.0, -0.5] },
    { id: "salad",   label: "Baby Gem",   colour: "#22c55e", emissive: "#14532d", geometry: "tetra",       orbitRadius: 1.7, orbitSpeed: 0.48, orbitPhase: 2.8,  orbitTilt: 0.6,  scale: 0.22, assembledPos: [0.5, -0.2, -0.4] },
  ];
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function IngredientOrb({
  config,
  assembleProgress,
  scatterProgress,
  time,
}: {
  config: IngredientConfig;
  assembleProgress: number;
  scatterProgress: number;
  time: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  const geo = useMemo(() => {
    switch (config.geometry) {
      case "sphere":      return new THREE.SphereGeometry(1, 32, 24);
      case "torus":       return new THREE.TorusGeometry(1, 0.35, 16, 48);
      case "octahedron":  return new THREE.OctahedronGeometry(1, 0);
      case "cone":        return new THREE.ConeGeometry(0.7, 1.8, 12);
      case "capsule":     return new THREE.CapsuleGeometry(0.5, 1, 8, 16);
      case "tetra":       return new THREE.TetrahedronGeometry(1, 0);
      default:            return new THREE.SphereGeometry(1, 16, 12);
    }
  }, [config.geometry]);

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(config.colour),
        emissive: new THREE.Color(config.emissive),
        emissiveIntensity: 0.4,
        roughness: 0.35,
        metalness: 0.15,
      }),
    [config.colour, config.emissive]
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();

    // Orbit position
    const angle = t * config.orbitSpeed + config.orbitPhase;
    const orbitX = Math.cos(angle) * config.orbitRadius;
    const orbitY = Math.sin(angle * 0.7 + config.orbitTilt) * config.orbitRadius * 0.4;
    const orbitZ = Math.sin(angle) * config.orbitRadius * 0.6;

    // Assembly target
    const [ax, ay, az] = config.assembledPos;

    // Scatter target — explode outward
    const scatterX = orbitX * 3.5;
    const scatterY = orbitY * 3.5 + 2;
    const scatterZ = orbitZ * 3.5;

    // Smooth blend between orbit → assemble → scatter
    const eased = assembleProgress * assembleProgress * (3 - 2 * assembleProgress);
    const scatterEased = scatterProgress * scatterProgress * (3 - 2 * scatterProgress);

    const px = lerp(lerp(orbitX, ax, eased), scatterX, scatterEased);
    const py = lerp(lerp(orbitY, ay, eased), scatterY, scatterEased);
    const pz = lerp(lerp(orbitZ, az, eased), scatterZ, scatterEased);

    ref.current.position.set(px, py, pz);
    ref.current.rotation.x = t * 0.6 + config.orbitPhase;
    ref.current.rotation.y = t * 0.45;
    ref.current.rotation.z = t * 0.3;

    // Scale pulse
    const pulse = 1 + Math.sin(t * 1.8 + config.orbitPhase) * 0.05;
    ref.current.scale.setScalar(config.scale * pulse);
  });

  return <mesh ref={ref} geometry={geo} material={mat} castShadow />;
}

/* ─────────────────────────────────────────────────────────────────
   FLOOR — warm ember-lit reflective plane
───────────────────────────────────────────────────────────────── */
function Floor() {
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x1a0a02),
        roughness: 0.08,
        metalness: 0.7,
        envMapIntensity: 0.5,
      }),
    []
  );

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[20, 20, 1, 1]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FIRE LIGHT RIGS — animated point lights simulating open fire
───────────────────────────────────────────────────────────────── */
function FireLights({ intensity }: { intensity: number }) {
  const l1 = useRef<THREE.PointLight>(null!);
  const l2 = useRef<THREE.PointLight>(null!);
  const l3 = useRef<THREE.PointLight>(null!);
  const { clock } = useThree();

  useFrame(() => {
    const t = clock.getElapsedTime();
    const f1 = 0.78 + 0.22 * Math.sin(t * 7.1) * Math.sin(t * 3.3 + 1.1);
    const f2 = 0.82 + 0.18 * Math.sin(t * 5.7 + 0.8) * Math.sin(t * 2.9);
    const f3 = 0.70 + 0.30 * Math.sin(t * 11.3 + 2.1) * Math.sin(t * 4.1);

    if (l1.current) l1.current.intensity = intensity * f1 * 12;
    if (l2.current) l2.current.intensity = intensity * f2 * 7;
    if (l3.current) l3.current.intensity = intensity * f3 * 5;

    // Subtle position sway — fire moves
    if (l1.current) {
      l1.current.position.x = -2 + Math.sin(t * 2.1) * 0.3;
      l1.current.position.y = -1.5 + Math.sin(t * 3.7) * 0.2;
    }
  });

  return (
    <>
      {/* Primary fire — below-left, warm orange */}
      <pointLight
        ref={l1}
        position={[-2, -1.5, 1.5]}
        color={0xf97316}
        distance={12}
        decay={2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
      />
      {/* Secondary fill — right, slightly redder */}
      <pointLight
        ref={l2}
        position={[2.5, -0.5, 0.8]}
        color={0xdc2626}
        distance={9}
        decay={2}
      />
      {/* Rim light — behind, amber gold */}
      <pointLight
        ref={l3}
        position={[0, 2.5, -3]}
        color={0xfbbf24}
        distance={8}
        decay={2}
      />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   CAMERA CHOREOGRAPHY — driven by scroll progress
───────────────────────────────────────────────────────────────── */
interface CameraState {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
}

function getCameraState(progress: number): CameraState {
  // 0.00–0.10 : darkness open — camera far, looking at glowing coals
  // 0.10–0.25 : chicken emerges from shadow — camera drifts closer
  // 0.25–0.40 : close-up push — caramelisation detail
  // 0.40–0.55 : pullback — ingredients separate, orbit begins
  // 0.55–0.75 : camera drifts through ingredient cloud
  // 0.75–0.90 : orbit around assembling dish
  // 0.90–1.00 : final pull-back — all dishes arranged

  const p = progress;

  if (p < 0.10) {
    const t = p / 0.10;
    return {
      position: [0, 0.5, 9 - t * 2],
      lookAt:   [0, -0.5, 0],
      fov:      55 - t * 5,
    };
  }
  if (p < 0.25) {
    const t = (p - 0.10) / 0.15;
    const ease = t * t * (3 - 2 * t);
    return {
      position: [0 - ease * 0.4, 0.5 - ease * 0.2, 7 - ease * 3.5],
      lookAt:   [0, 0, 0],
      fov:      50 - ease * 8,
    };
  }
  if (p < 0.40) {
    const t = (p - 0.25) / 0.15;
    const ease = t * t * (3 - 2 * t);
    return {
      position: [-0.4, 0.3 + ease * 0.3, 3.5 - ease * 1.2],
      lookAt:   [0, 0.2, 0],
      fov:      42 + ease * 6,
    };
  }
  if (p < 0.55) {
    const t = (p - 0.40) / 0.15;
    const ease = t * t * (3 - 2 * t);
    return {
      position: [-0.4 + ease * 0.8, 0.6 - ease * 0.2, 2.3 + ease * 2.5],
      lookAt:   [0, 0.4, 0],
      fov:      48 + ease * 12,
    };
  }
  if (p < 0.75) {
    const t = (p - 0.55) / 0.20;
    const ease = t * t * (3 - 2 * t);
    // Orbit arc — camera moves laterally through the ingredient cloud
    const angle = ease * Math.PI * 0.7;
    const r = 4.8 - ease * 1.2;
    return {
      position: [Math.sin(angle) * r, 0.4 + ease * 0.3, Math.cos(angle) * r],
      lookAt:   [0, 0, 0],
      fov:      60 - ease * 10,
    };
  }
  if (p < 0.90) {
    const t = (p - 0.75) / 0.15;
    const ease = t * t * (3 - 2 * t);
    const angle = Math.PI * 0.7 + ease * Math.PI * 0.4;
    const r = 3.6 - ease * 0.8;
    return {
      position: [Math.sin(angle) * r, 0.7, Math.cos(angle) * r],
      lookAt:   [0, 0.1, 0],
      fov:      50 + ease * 10,
    };
  }
  // 0.90 → 1.00 — grand finale pull-back
  const t = (p - 0.90) / 0.10;
  const ease = t * t * (3 - 2 * t);
  return {
    position: [0 + ease * 0.5, 1 + ease * 0.5, 2.8 + ease * 3.5],
    lookAt:   [0, 0, 0],
    fov:      60 + ease * 10,
  };
}

function CinematicCamera({ progress }: { progress: number }) {
  const { camera, clock } = useThree();
  const posRef = useRef(new THREE.Vector3(0, 0.5, 9));
  const lookRef = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const state = getCameraState(progress);
    const t = clock.getElapsedTime();

    // Smooth camera lag — feel of physical camera on a dolly
    const LERP = 0.045;
    posRef.current.lerp(new THREE.Vector3(...state.position), LERP);
    lookRef.current.lerp(new THREE.Vector3(...state.lookAt), LERP);

    // Micro hand-held breathe — tiny organic sway
    const breathe = 0.008;
    camera.position.set(
      posRef.current.x + Math.sin(t * 0.41) * breathe,
      posRef.current.y + Math.sin(t * 0.33) * breathe,
      posRef.current.z
    );
    camera.lookAt(lookRef.current);

    if ((camera as THREE.PerspectiveCamera).fov !== undefined) {
      const pCam = camera as THREE.PerspectiveCamera;
      pCam.fov = lerp(pCam.fov, state.fov, 0.04);
      pCam.updateProjectionMatrix();
    }
  });

  return null;
}

/* ─────────────────────────────────────────────────────────────────
   SCENE — top-level R3F component
───────────────────────────────────────────────────────────────── */
function Scene({
  scrollProgress,
  activeItemIndex,
}: {
  scrollProgress: number;
  activeItemIndex: number;
}) {
  const ingredients = useMemo(() => buildIngredients(), []);

  // Derive scene state from scroll
  const caramel       = Math.min(1, scrollProgress * 3);
  const fireIntensity = 0.3 + scrollProgress * 0.7;
  const steamIntensity = 0.2 + Math.min(1, scrollProgress * 2.5) * 0.8;

  // Assembly: ingredients pull in at progress 0.55–0.70
  const assembleProgress = Math.max(0, Math.min(1, (scrollProgress - 0.55) / 0.15));
  // Scatter: ingredients disperse at 0.70–0.78
  const scatterProgress  = Math.max(0, Math.min(1, (scrollProgress - 0.70) / 0.08));
  // Chicken visibility: present 0.0–0.45, exits 0.45–0.55
  const chickenOpacity   = 1 - Math.max(0, Math.min(1, (scrollProgress - 0.40) / 0.12));

  const { clock } = useThree();

  return (
    <>
      <CinematicCamera progress={scrollProgress} />

      {/* Deep dark fog atmosphere */}
      <fog attach="fog" args={[0x0d0602, 8, 22]} />
      <color attach="background" args={[0x0d0602]} />

      {/* Firelight rigs */}
      <FireLights intensity={fireIntensity} />

      {/* Floor */}
      <Floor />

      {/* Steam */}
      <Steam intensity={steamIntensity} />

      {/* Embers */}
      <Embers intensity={fireIntensity * 0.85} />

      {/* Sparkles — ambient firefly motes in the air */}
      <Sparkles
        count={60}
        scale={[6, 4, 4]}
        size={2}
        speed={0.3}
        opacity={0.4}
        color={0xf97316}
        position={[0, 0, 0]}
      />

      {/* The chicken — fades out as ingredients scatter */}
      <group visible={chickenOpacity > 0.01}>
        <ChickenMesh
          scrollProgress={scrollProgress}
          caramel={caramel}
          fireIntensity={fireIntensity}
        />
      </group>

      {/* Ingredients */}
      {ingredients.map((ing) => (
        <IngredientOrb
          key={ing.id}
          config={ing}
          assembleProgress={assembleProgress}
          scatterProgress={scatterProgress}
          time={clock.getElapsedTime()}
        />
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   OVERLAY — HTML overlaid on the canvas, driven by scroll
───────────────────────────────────────────────────────────────── */
const MENU_PHASES = [
  { range: [0.00, 0.12], type: "intro" as const },
  { range: [0.12, 0.30], type: "chicken-reveal" as const },
  { range: [0.30, 0.48], type: "closeup" as const },
  { range: [0.48, 0.62], type: "scatter" as const },
  { range: [0.62, 0.78], type: "orbit" as const },
  { range: [0.78, 1.00], type: "menu-reveal" as const },
];

function getPhase(progress: number) {
  for (const phase of MENU_PHASES) {
    if (progress >= phase.range[0] && progress <= phase.range[1]) {
      return phase.type;
    }
  }
  return "menu-reveal";
}

// Which menu items to surface in the assembly sequence (featured)
const FEATURED_ITEM_INDICES = [0, 1, 4, 2, 5, 6]; // Ciabatta, Wrap, Salad, Whole Chicken, Wings, Wedges

function getActiveItemIndex(progress: number): number {
  if (progress < 0.62) return -1;
  const t = (progress - 0.62) / 0.38;
  return Math.min(FEATURED_ITEM_INDICES.length - 1, Math.floor(t * FEATURED_ITEM_INDICES.length));
}

function OverlayContent({
  scrollProgress,
  items,
}: {
  scrollProgress: number;
  items: MenuItem[];
}) {
  const phase = getPhase(scrollProgress);
  const activeItemSeqIdx = getActiveItemIndex(scrollProgress);
  const activeItemIdx    = activeItemSeqIdx >= 0 ? FEATURED_ITEM_INDICES[activeItemSeqIdx] : -1;
  const activeItem       = activeItemIdx >= 0 ? items[activeItemIdx] : null;

  // Within-item progress for current item
  const itemDuration = 0.38 / FEATURED_ITEM_INDICES.length;
  const itemStart    = 0.62 + activeItemSeqIdx * itemDuration;
  const itemProgress = activeItemSeqIdx >= 0
    ? Math.max(0, Math.min(1, (scrollProgress - itemStart) / itemDuration))
    : 0;

  // Fadeout as item exits
  const itemFade = itemProgress < 0.75 ? 1 : 1 - ((itemProgress - 0.75) / 0.25);

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col">

      {/* TOP — section label */}
      <div className="px-8 pt-10 md:px-16 md:pt-14">
        <motion.div
          key="label"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-px bg-orange-500" />
          <span className="text-orange-500 text-[11px] font-sans tracking-[0.35em] uppercase font-medium">
            What We Serve
          </span>
        </motion.div>
      </div>

      {/* CENTER — phase-specific content */}
      <div className="flex-1 flex items-center justify-center px-8 md:px-16">
        <AnimatePresence mode="wait">

          {/* INTRO */}
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1.2 }}
              className="text-center max-w-xl"
            >
              <h2 className="font-display text-[clamp(3rem,8vw,7rem)] font-black text-white leading-none mb-4">
                The Menu.
              </h2>
              <p className="font-sans text-white/30 text-sm tracking-[0.3em] uppercase">
                Scroll to explore
              </p>
            </motion.div>
          )}

          {/* CHICKEN REVEAL */}
          {phase === "chicken-reveal" && (
            <motion.div
              key="chicken-reveal"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <div className="overflow-hidden mb-4">
                <motion.h2
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-[clamp(2rem,6vw,5.5rem)] font-black text-white leading-none"
                >
                  Slow-roasted.
                </motion.h2>
              </div>
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
                  className="font-display text-[clamp(2rem,6vw,5.5rem)] font-black italic text-orange-500 leading-none"
                >
                  Every day.
                </motion.h2>
              </div>
            </motion.div>
          )}

          {/* CLOSE UP */}
          {phase === "closeup" && (
            <motion.div
              key="closeup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute bottom-24 left-8 md:left-16 max-w-xs"
            >
              <p className="font-sans text-white/50 text-sm leading-relaxed">
                Seasoned with patience. Cooked over open heat until every surface caramelises to a deep mahogany crust. Cork's finest.
              </p>
            </motion.div>
          )}

          {/* SCATTER */}
          {phase === "scatter" && (
            <motion.div
              key="scatter"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <p className="font-sans text-white/40 text-xs tracking-[0.4em] uppercase mb-3">
                Every ingredient handpicked
              </p>
              <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] font-black text-white leading-none">
                Built to order.
              </h2>
            </motion.div>
          )}

          {/* ORBIT */}
          {phase === "orbit" && (
            <motion.div
              key="orbit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute bottom-24 right-8 md:right-16 text-right max-w-xs"
            >
              <p className="font-sans text-white/35 text-xs tracking-[0.3em] uppercase">
                Premium ingredients · Fresh daily
              </p>
            </motion.div>
          )}

          {/* MENU ITEM REVEALS */}
          {phase === "menu-reveal" && activeItem && (
            <motion.div
              key={`item-${activeItemIdx}`}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: itemFade, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 1.04 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-8 md:right-14 top-1/2 -translate-y-1/2 max-w-sm text-right"
            >
              {activeItem.badge && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-400 text-[10px] font-sans tracking-widest uppercase mb-4"
                >
                  <span className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
                  {activeItem.badge}
                </motion.div>
              )}

              <div className="overflow-hidden mb-3">
                <motion.h3
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                  className="font-display text-[clamp(2.2rem,5vw,4.5rem)] font-black text-white leading-none"
                >
                  {activeItem.name}
                </motion.h3>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="font-sans text-white/50 text-sm leading-relaxed mb-5"
              >
                {activeItem.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="flex items-baseline gap-3 justify-end"
              >
                <span className="font-condensed text-[3rem] text-orange-400 leading-none tracking-wide">
                  {activeItem.price}
                </span>
                <span className="font-sans text-white/25 text-xs uppercase tracking-widest">
                  {activeItem.category}
                </span>
              </motion.div>

              {/* Item progress bar */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: itemProgress }}
                transition={{ duration: 0 }}
                className="mt-5 h-px bg-gradient-to-l from-orange-500 to-transparent origin-right"
                style={{ transformOrigin: "right" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM — scroll indicator or all-menu list */}
      <div className="px-8 pb-10 md:px-16 md:pb-12 flex items-end justify-between">

        {/* Left — item counter during menu reveal */}
        <AnimatePresence>
          {phase === "menu-reveal" && activeItemSeqIdx >= 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <span className="font-condensed text-5xl text-white/10 leading-none">
                {String(activeItemSeqIdx + 1).padStart(2, "0")}
              </span>
              <div className="flex gap-1">
                {FEATURED_ITEM_INDICES.map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-px bg-white/20 rounded-full"
                    animate={{ width: i === activeItemSeqIdx ? 32 : 8, backgroundColor: i === activeItemSeqIdx ? "#f97316" : "rgba(255,255,255,0.2)" }}
                    transition={{ duration: 0.4 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right — scroll hint until menu-reveal */}
        <AnimatePresence>
          {phase !== "menu-reveal" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="ml-auto flex flex-col items-end gap-1.5"
            >
              <span className="font-sans text-white/20 text-[10px] tracking-[0.35em] uppercase">Scroll</span>
              <motion.div
                className="w-px h-8 bg-gradient-to-b from-white/25 to-transparent"
                animate={{ scaleY: [1, 0.4, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "top" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   REDUCED MOTION FALLBACK
───────────────────────────────────────────────────────────────── */
function ReducedMotionMenu({ items }: { items: MenuItem[] }) {
  return (
    <section className="relative py-32 bg-[#1A1A1A] overflow-hidden" id="menu">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-orange-500" />
            <span className="text-orange-500 text-xs font-sans tracking-[0.3em] uppercase font-medium">What We Serve</span>
          </div>
          <h2 className="font-display text-[clamp(3rem,7vw,6rem)] font-black text-white leading-none">The Menu.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="glass-dark rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                {item.badge && (
                  <span className="text-[10px] font-sans font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    {item.badge}
                  </span>
                )}
              </div>
              <h3 className="font-display font-bold text-white text-xl mb-2">{item.name}</h3>
              <p className="font-sans text-white/50 text-sm leading-relaxed mb-5">{item.description}</p>
              <span className="font-condensed text-2xl text-orange-400 tracking-wide">{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────────── */
export default function CinematicMenuSection({ content }: { content: MenuContent }) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null!);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Smooth the raw scroll value — feels like a real camera on a dolly
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 30, mass: 0.8 });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return smooth.on("change", (v) => setProgress(v));
  }, [smooth]);

  const activeItemIndex = getActiveItemIndex(progress);

  if (reduce) return <ReducedMotionMenu items={content.items} />;

  return (
    <section
      ref={sectionRef}
      id="menu"
      className="relative"
      style={{ height: `${SCROLL_HEIGHT}vh` }}
      aria-label="Hansum menu — cinematic experience"
    >
      {/* Pinned fullscreen canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {mounted && (
          <Canvas
            className="absolute inset-0"
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: "high-performance",
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.1,
            }}
            shadows={{ type: THREE.PCFSoftShadowMap }}
            camera={{ position: [0, 0.5, 9], fov: 55, near: 0.1, far: 60 }}
            dpr={[1, Math.min(window.devicePixelRatio, 2)]}
          >
            <Suspense fallback={null}>
              <Scene scrollProgress={progress} activeItemIndex={activeItemIndex} />
            </Suspense>
          </Canvas>
        )}

        {/* HTML overlay */}
        <OverlayContent scrollProgress={progress} items={content.items} />
      </div>
    </section>
  );
}
