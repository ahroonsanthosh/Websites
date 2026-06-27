"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import {
  motion,
  useScroll,
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
// 420vh — items start at 30% (126vh in), 6 items × ~49vh each
const SCROLL_HEIGHT = 420;

// Items shown one by one in the cinematic sequence
const FEATURED = [0, 1, 4, 2, 5, 6]; // Ciabatta, Wrap, Salad, Whole Chicken, Wings, Wedges

/* ─────────────────────────────────────────────────────────────────
   GLSL — caramelising chicken skin with SSS fringe
───────────────────────────────────────────────────────────────── */
const chickenVert = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  uniform float uTime;

  float hash(vec3 p){p=fract(p*vec3(.1031,.103,.0973));p+=dot(p,p.yzx+19.19);return fract((p.x+p.y)*p.z);}
  float noise(vec3 p){vec3 i=floor(p);vec3 f=fract(p);f=f*f*(3.-2.*f);
    return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
               mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}

  void main(){
    vNormal = normalize(normalMatrix * normal);
    vec3 pos = position;
    // Organic skin bump
    float n = noise(pos*3.+uTime*.08);
    float n2 = noise(pos*7.-uTime*.05);
    pos += normal*(n*.038+n2*.014);
    // Heat shimmer near top
    pos.y += noise(pos*14.+uTime*2.3)*.005*smoothstep(.2,1.,(pos.y+1.)*.5);
    vec4 wp = modelMatrix*vec4(pos,1.);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix*viewMatrix*wp;
  }
`;

const chickenFrag = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  uniform float uTime;
  uniform float uCaramel;
  uniform float uFire;

  float hash(vec3 p){p=fract(p*vec3(.1031,.103,.0973));p+=dot(p,p.yzx+19.19);return fract((p.x+p.y)*p.z);}
  float noise(vec3 p){vec3 i=floor(p);vec3 f=fract(p);f=f*f*(3.-2.*f);
    return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
               mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}

  void main(){
    // Mottled caramelisation
    float b = noise(vWorldPos*4.)*.6 + noise(vWorldPos*9.)*.4;
    float cm = clamp(uCaramel + b*.28 - .12, 0., 1.);
    vec3 col = mix(vec3(.95,.82,.65), vec3(.82,.48,.13), smoothstep(0.,.5,cm));
    col      = mix(col, vec3(.52,.2,.05),  smoothstep(.4,.82,cm));
    col      = mix(col, vec3(.16,.07,.02), smoothstep(.78,1.,cm));

    // Grill marks
    float grill = smoothstep(.42,.45,abs(fract((vWorldPos.y*8.+vWorldPos.x*2.))-.5));
    col *= mix(1., .42, grill*clamp(uCaramel*2.,0.,1.));

    vec3 N = normalize(vNormal);
    // Firelight — deep orange, never blows white
    float flicker = .84 + .16*sin(uTime*7.3)*sin(uTime*3.1+.9);
    vec3 L1 = normalize(vec3(-2.,-1.5,1.5) - vWorldPos);
    float d1 = max(dot(N,L1),0.) / (1.+length(vec3(-2.,-1.5,1.5)-vWorldPos)*.28);
    // Colour clamped to deep orange — green channel kept low so it can't blend to white
    vec3 fire = vec3(.98,.32,.04)*d1*uFire*flicker*1.1;

    vec3 L2 = normalize(vec3(2.,.5,.8) - vWorldPos);
    float d2 = max(dot(N,L2),0.) / (1.+length(vec3(2.,.5,.8)-vWorldPos)*.4);
    vec3 fill = vec3(.82,.22,.03)*d2*uFire*.55;

    // SSS edge glow — orange fringe only
    float sss = pow(max(0.,1.-abs(dot(N,vec3(0.,0.,1.)))),2.8);
    vec3 sssCol = vec3(.90,.30,.05)*sss*uFire*.28;

    // Specular — tinted orange-amber, not white
    vec3 V = normalize(vec3(0.,0.,3.)-vWorldPos);
    vec3 H = normalize(L1+V);
    float spec = pow(max(dot(N,H),0.),64.)*.28*flicker;
    float gloss = smoothstep(.62,.88,noise(vWorldPos*6.+vec3(0.,uTime*.04,0.)))*(.2*flicker);

    vec3 ambient = vec3(.048,.018,.004)*2.5;
    vec3 final = col*(ambient+fire+fill) + sssCol + vec3(.95,.55,.12)*(spec+gloss);

    // Filmic tone-map
    final = final/(final+.75);
    final = pow(final,vec3(.4545));
    gl_FragColor = vec4(final,1.);
  }
`;

/* ─────────────────────────────────────────────────────────────────
   STEAM SHADER
───────────────────────────────────────────────────────────────── */
const steamVert = /* glsl */`
  attribute float aPhase; attribute float aSpd; attribute float aSz; attribute vec3 aOff;
  uniform float uTime; uniform float uInt;
  varying float vA;
  void main(){
    float t = mod(uTime*aSpd+aPhase,1.);
    float e = t*t*(3.-2.*t);
    vec3 p = aOff;
    p.y += t*3.6;
    p.x += sin(uTime*.7+aPhase*6.28)*.32*t;
    p.z += cos(uTime*.5+aPhase*3.14+1.2)*.18*t;
    p.xz += aOff.xz*t*1.1;
    vA = uInt*(1.-e)*smoothstep(0.,.08,t)*.5;
    vec4 mv = modelViewMatrix*vec4(p,1.);
    gl_PointSize = (aSz*(1.+t*2.8))*(220./-mv.z);
    gl_Position = projectionMatrix*mv;
  }
`;
const steamFrag = /* glsl */`
  varying float vA;
  void main(){
    float r=length(gl_PointCoord-.5)*2.;
    float d=1.-smoothstep(.5,.85,r);
    if(d<.01)discard;
    gl_FragColor=vec4(1.,.93,.82,d*vA);
  }
`;

/* ─────────────────────────────────────────────────────────────────
   EMBER SHADER
───────────────────────────────────────────────────────────────── */
const emberVert = /* glsl */`
  attribute float aPhase; attribute float aSpd; attribute vec2 aSpr;
  uniform float uTime; uniform float uInt;
  varying float vA; varying vec3 vC;
  void main(){
    float t=mod(uTime*aSpd+aPhase,1.);
    vec3 p=vec3(aSpr.x,-2.+t*5.,aSpr.y);
    float ang=t*9.42+aPhase*6.28;
    p.x+=sin(ang)*.13*t; p.z+=cos(ang)*.09*t;
    vA=uInt*(1.-t)*smoothstep(0.,.05,t)*.9;
    vC=mix(vec3(1.,.72,.1),vec3(.55,.08,.02),t*t);
    vec4 mv=modelViewMatrix*vec4(p,1.);
    gl_PointSize=(3.2*(1.-t*.65))*(160./-mv.z);
    gl_Position=projectionMatrix*mv;
  }
`;
const emberFrag = /* glsl */`
  varying float vA; varying vec3 vC;
  void main(){
    float r=length(gl_PointCoord-.5)*2.;
    float d=1.-smoothstep(.55,.95,r);
    if(d<.01)discard;
    gl_FragColor=vec4(vC,d*vA);
  }
`;

/* ─────────────────────────────────────────────────────────────────
   PROCEDURAL CHICKEN
───────────────────────────────────────────────────────────────── */
function ChickenMesh({ progress, caramel, fire }: { progress: number; caramel: number; fire: number }) {
  const grp  = useRef<THREE.Group>(null!);
  const mat  = useRef<THREE.ShaderMaterial>(null!);
  const { clock } = useThree();

  const bodyGeo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 48; i++) {
      const t = i / 48;
      const y = (t - 0.5) * 2.2;
      let r = Math.sin(t * Math.PI);
      r += 0.30 * Math.exp(-Math.pow((t - 0.62) * 3.4, 2));
      r -= 0.12 * Math.exp(-Math.pow((t - 0.12) * 5.0, 2));
      r -= 0.16 * Math.exp(-Math.pow((t - 0.88) * 4.5, 2));
      pts.push(new THREE.Vector2(Math.max(r * 0.72, 0.01), y));
    }
    return new THREE.LatheGeometry(pts, 72);
  }, []);

  const drumGeo  = useMemo(() => new THREE.CylinderGeometry(0.075, 0.13, 0.62, 16), []);
  const knobGeo  = useMemo(() => new THREE.SphereGeometry(0.13, 16, 12), []);
  const wingGeo  = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      pts.push(new THREE.Vector2(Math.sin(t * Math.PI) * 0.17, (t - 0.5) * 0.68));
    }
    return new THREE.LatheGeometry(pts, 10);
  }, []);

  const shaderMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: chickenVert,
    fragmentShader: chickenFrag,
    uniforms: {
      uTime:    { value: 0 },
      uCaramel: { value: 0 },
      uFire:    { value: 1 },
    },
  }), []);

  useFrame(() => {
    const t = clock.getElapsedTime();
    shaderMat.uniforms.uTime.value    = t;
    shaderMat.uniforms.uCaramel.value = caramel;
    shaderMat.uniforms.uFire.value    = fire;
    if (grp.current) {
      grp.current.rotation.y = t * 0.24 + progress * Math.PI * 0.4;
      grp.current.rotation.x = Math.sin(t * 0.28) * 0.035;
    }
  });

  return (
    <group ref={grp}>
      <mesh geometry={bodyGeo} material={shaderMat} castShadow receiveShadow />
      <group position={[-0.37, -0.63, 0.18]} rotation={[0.58, 0, -0.28]}>
        <mesh geometry={drumGeo} material={shaderMat} castShadow />
        <mesh geometry={knobGeo} position={[0, -0.36, 0]} material={shaderMat} castShadow />
      </group>
      <group position={[0.37, -0.63, 0.18]} rotation={[0.58, 0, 0.28]}>
        <mesh geometry={drumGeo} material={shaderMat} castShadow />
        <mesh geometry={knobGeo} position={[0, -0.36, 0]} material={shaderMat} castShadow />
      </group>
      <group position={[-0.66, 0.1, 0]} rotation={[0.18, 0, 0.68]}>
        <mesh geometry={wingGeo} material={shaderMat} castShadow />
      </group>
      <group position={[0.66, 0.1, 0]} rotation={[0.18, 0, -0.68]}>
        <mesh geometry={wingGeo} material={shaderMat} castShadow />
      </group>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────────
   STEAM
───────────────────────────────────────────────────────────────── */
function Steam({ intensity }: { intensity: number }) {
  const COUNT = 160;
  const { clock } = useThree();
  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: steamVert, fragmentShader: steamFrag,
    uniforms: { uTime: { value: 0 }, uInt: { value: intensity } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const geo = useMemo(() => {
    const phases = new Float32Array(COUNT);
    const spds   = new Float32Array(COUNT);
    const szs    = new Float32Array(COUNT);
    const offs   = new Float32Array(COUNT * 3);
    const pos    = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      phases[i] = Math.random(); spds[i] = .11 + Math.random() * .17; szs[i] = 7 + Math.random() * 17;
      const a = Math.random() * Math.PI * 2, r = Math.random() * .32;
      offs[i*3] = Math.cos(a)*r; offs[i*3+2] = Math.sin(a)*r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    g.setAttribute("aSpd",   new THREE.BufferAttribute(spds, 1));
    g.setAttribute("aSz",    new THREE.BufferAttribute(szs, 1));
    g.setAttribute("aOff",   new THREE.BufferAttribute(offs, 3));
    return g;
  }, []);
  useFrame(() => { mat.uniforms.uTime.value = clock.getElapsedTime(); mat.uniforms.uInt.value = intensity; });
  return <points geometry={geo} material={mat} position={[0, 0.85, 0]} />;
}

/* ─────────────────────────────────────────────────────────────────
   EMBERS
───────────────────────────────────────────────────────────────── */
function Embers({ intensity }: { intensity: number }) {
  const COUNT = 70;
  const { clock } = useThree();
  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: emberVert, fragmentShader: emberFrag,
    uniforms: { uTime: { value: 0 }, uInt: { value: intensity } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const geo = useMemo(() => {
    const phases = new Float32Array(COUNT);
    const spds   = new Float32Array(COUNT);
    const sprs   = new Float32Array(COUNT * 2);
    const pos    = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      phases[i] = Math.random(); spds[i] = .22 + Math.random() * .32;
      sprs[i*2] = (Math.random()-.5)*1.8; sprs[i*2+1] = (Math.random()-.5)*.7;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    g.setAttribute("aSpd",   new THREE.BufferAttribute(spds, 1));
    g.setAttribute("aSpr",   new THREE.BufferAttribute(sprs, 2));
    return g;
  }, []);
  useFrame(() => { mat.uniforms.uTime.value = clock.getElapsedTime(); mat.uniforms.uInt.value = intensity; });
  return <points geometry={geo} material={mat} />;
}

/* ─────────────────────────────────────────────────────────────────
   INGREDIENT ORBS
───────────────────────────────────────────────────────────────── */
type GeoType = "sphere" | "torus" | "octahedron" | "cone" | "tetra";
interface OrbCfg {
  colour: string; emissive: string; geo: GeoType;
  r: number; spd: number; phase: number; tilt: number; sc: number;
  apos: [number, number, number];
}

const ORBS: OrbCfg[] = [
  { colour:"#c2641b",emissive:"#7c2d0a",geo:"sphere",     r:1.8,spd:.36,phase:0.0, tilt:.2,  sc:.36, apos:[0,.6,0]       },
  { colour:"#c8a060",emissive:"#6b4a10",geo:"octahedron", r:2.1,spd:.26,phase:.9,  tilt:.5,  sc:.26, apos:[-.5,-.3,.3]   },
  { colour:"#dc2626",emissive:"#7f1d1d",geo:"cone",       r:1.5,spd:.52,phase:2.1, tilt:.8,  sc:.21, apos:[.6,.1,.4]     },
  { colour:"#fbbf24",emissive:"#92400e",geo:"octahedron", r:2.4,spd:.30,phase:3.5, tilt:-.4, sc:.23, apos:[-.3,.3,.5]    },
  { colour:"#16a34a",emissive:"#14532d",geo:"torus",      r:1.9,spd:.42,phase:1.4, tilt:1.1, sc:.17, apos:[.4,.5,-.3]    },
  { colour:"#d97706",emissive:"#78350f",geo:"octahedron", r:2.7,spd:.20,phase:4.7, tilt:-.7, sc:.28, apos:[-.6,-.5,-.2]  },
  { colour:"#a855f7",emissive:"#581c87",geo:"torus",      r:2.0,spd:.39,phase:5.8, tilt:.3,  sc:.15, apos:[.2,-.6,.5]    },
  { colour:"#ef4444",emissive:"#7f1d1d",geo:"sphere",     r:2.2,spd:.34,phase:.6,  tilt:-.9, sc:.19, apos:[-.4,.0,-.5]   },
  { colour:"#22c55e",emissive:"#14532d",geo:"tetra",      r:1.7,spd:.46,phase:2.8, tilt:.6,  sc:.21, apos:[.5,-.2,-.4]   },
];

function easeInOut(t: number) { return t * t * (3 - 2 * t); }
function lerpN(a: number, b: number, t: number) { return a + (b - a) * t; }

function OrbMesh({ cfg, assemble, scatter }: { cfg: OrbCfg; assemble: number; scatter: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  const geo = useMemo(() => {
    switch (cfg.geo) {
      case "sphere":     return new THREE.SphereGeometry(1, 28, 20);
      case "torus":      return new THREE.TorusGeometry(1, .35, 14, 44);
      case "octahedron": return new THREE.OctahedronGeometry(1, 0);
      case "cone":       return new THREE.ConeGeometry(.7, 1.8, 12);
      case "tetra":      return new THREE.TetrahedronGeometry(1, 0);
    }
  }, [cfg.geo]);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(cfg.colour),
    emissive: new THREE.Color(cfg.emissive),
    emissiveIntensity: .38, roughness: .32, metalness: .12,
  }), [cfg.colour, cfg.emissive]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const ang = t * cfg.spd + cfg.phase;
    const ox = Math.cos(ang) * cfg.r;
    const oy = Math.sin(ang * .7 + cfg.tilt) * cfg.r * .38;
    const oz = Math.sin(ang) * cfg.r * .55;
    const [ax, ay, az] = cfg.apos;
    const ea  = easeInOut(assemble);
    const es  = easeInOut(scatter);
    const sx = ox * 3.2, sy = oy * 3.2 + 1.8, sz = oz * 3.2;
    ref.current.position.set(
      lerpN(lerpN(ox, ax, ea), sx, es),
      lerpN(lerpN(oy, ay, ea), sy, es),
      lerpN(lerpN(oz, az, ea), sz, es),
    );
    ref.current.rotation.x = t * .55 + cfg.phase;
    ref.current.rotation.y = t * .4;
    const pulse = 1 + Math.sin(t * 1.7 + cfg.phase) * .045;
    ref.current.scale.setScalar(cfg.sc * pulse);
  });

  return <mesh ref={ref} geometry={geo} material={mat} castShadow />;
}

/* ─────────────────────────────────────────────────────────────────
   FIRE LIGHTS — intensities capped to avoid blinding
───────────────────────────────────────────────────────────────── */
function FireLights({ intensity }: { intensity: number }) {
  const l1 = useRef<THREE.PointLight>(null!);
  const l2 = useRef<THREE.PointLight>(null!);
  const l3 = useRef<THREE.PointLight>(null!);
  const { clock } = useThree();
  useFrame(() => {
    const t = clock.getElapsedTime();
    const f1 = .80 + .20 * Math.sin(t * 7.1) * Math.sin(t * 3.3 + 1.1);
    const f2 = .84 + .16 * Math.sin(t * 5.7 + .8) * Math.sin(t * 2.9);
    const f3 = .72 + .28 * Math.sin(t * 11.3 + 2.1) * Math.sin(t * 4.1);
    // Max raw intensity ≈ 0.9 — orange glow only, never bleaches to white
    if (l1.current) { l1.current.intensity = intensity * f1 * 0.9; l1.current.position.x = -2 + Math.sin(t*2.1)*.25; }
    if (l2.current) l2.current.intensity = intensity * f2 * 0.5;
    if (l3.current) l3.current.intensity = intensity * f3 * 0.35;
  });
  return (
    <>
      {/* Deep orange — high saturation so even at bright flickers it stays orange */}
      <pointLight ref={l1} position={[-2,-1.5,1.5]} color={0xe85a00} distance={14} decay={2}
        castShadow shadow-mapSize={[512,512]} shadow-bias={-.001} />
      <pointLight ref={l2} position={[2.2,.3,.8]}   color={0xc43a00} distance={10} decay={2} />
      <pointLight ref={l3} position={[0,2.2,-2.8]}  color={0xd96800} distance={9}  decay={2} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   CAMERA — responsive lerp, 8-phase choreography
───────────────────────────────────────────────────────────────── */
function cam(p: number): { pos: [number,number,number]; look: [number,number,number]; fov: number } {
  const s = (a: number, b: number, t: number) => a + (b - a) * easeInOut(Math.max(0, Math.min(1, t)));
  if (p < .10) {
    const t = p / .10;
    return { pos:[0,.4,8.5-t*1.8], look:[0,-.3,0], fov:54-t*4 };
  }
  if (p < .22) {
    const t=(p-.10)/.12, e=easeInOut(t);
    return { pos:[s(0,-.3,e),s(.4,.3,e),s(6.7,3.0,e)], look:[0,0,0], fov:s(50,42,e) };
  }
  if (p < .30) {
    const t=(p-.22)/.08, e=easeInOut(t);
    return { pos:[s(-.3,.1,e),s(.3,.5,e),s(3.0,2.2,e)], look:[0,.15,0], fov:s(42,48,e) };
  }
  if (p < ITEM_START) {
    const t=(p-.30)/(ITEM_START-.30), e=easeInOut(t);
    return { pos:[s(.1,.5,e),s(.5,.2,e),s(2.2,4.2,e)], look:[0,.2,0], fov:s(48,60,e) };
  }
  // Items phase — slow orbit around scene (0.35–1.0)
  const t=(p-ITEM_START)/(1-ITEM_START), e=easeInOut(t);
  const angle = e * Math.PI * .6;
  const r = 4.0 - e * .7;
  return {
    pos:[Math.sin(angle)*r, .3+e*.2, Math.cos(angle)*r],
    look:[0,.05,0],
    fov:s(60,52,e),
  };
}

function CinematicCamera({ progress }: { progress: number }) {
  const { camera, clock } = useThree();
  const pos  = useRef(new THREE.Vector3(0,.4,8.5));
  const look = useRef(new THREE.Vector3(0,0,0));
  useFrame(() => {
    const state = cam(progress);
    const t     = clock.getElapsedTime();
    // Faster lerp (0.10) — responsive without snapping
    pos.current.lerp(new THREE.Vector3(...state.pos),  .10);
    look.current.lerp(new THREE.Vector3(...state.look), .10);
    camera.position.set(
      pos.current.x + Math.sin(t*.38) * .006,
      pos.current.y + Math.sin(t*.29) * .006,
      pos.current.z,
    );
    camera.lookAt(look.current);
    const pc = camera as THREE.PerspectiveCamera;
    pc.fov += (state.fov - pc.fov) * .06;
    pc.updateProjectionMatrix();
  });
  return null;
}

/* ─────────────────────────────────────────────────────────────────
   SCENE
───────────────────────────────────────────────────────────────── */
function Scene({ progress }: { progress: number }) {
  const caramel       = Math.min(1, progress * 3.5);
  const fire          = .35 + progress * .65;
  const steam         = .15 + Math.min(1, progress * 2.2) * .85;
  // Chicken fades out 0.22→0.32
  const chickenAlpha  = 1 - Math.max(0, Math.min(1, (progress - .22) / .12));
  // Ingredients visible from 0.28 onward
  const orbAlpha      = Math.max(0, Math.min(1, (progress - .28) / .10));
  const assemble      = Math.max(0, Math.min(1, (progress - .32) / .08));
  const scatter       = Math.max(0, Math.min(1, (progress - .40) / .06));

  const floorMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x180900), roughness: .06, metalness: .75, envMapIntensity: .4,
  }), []);

  return (
    <>
      <CinematicCamera progress={progress} />
      <fog attach="fog" args={[0x0c0501, 9, 24]} />
      <color attach="background" args={[0x0c0501]} />
      <FireLights intensity={fire} />
      {/* Floor — dark reflective surface */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-2,0]} receiveShadow>
        <planeGeometry args={[22,22]} />
        <primitive object={floorMat} attach="material" />
      </mesh>
      <Steam intensity={steam} />
      <Embers intensity={fire * .75} />
      <Sparkles count={50} scale={[5,3.5,4]} size={1.8} speed={.25} opacity={.35} color={0xf97316} />
      {chickenAlpha > .01 && (
        <group scale={[chickenAlpha, chickenAlpha, chickenAlpha]}>
          <ChickenMesh progress={progress} caramel={caramel} fire={fire} />
        </group>
      )}
      {orbAlpha > .01 && ORBS.map((cfg, i) => (
        <group key={i} scale={[orbAlpha, orbAlpha, orbAlpha]}>
          <OrbMesh cfg={cfg} assemble={assemble} scatter={scatter} />
        </group>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SCROLL PHASES & OVERLAY
   Items start at 35% (105vh into 300vh). Each item ≈ 32vh of scroll.
───────────────────────────────────────────────────────────────── */
type Phase = "intro" | "reveal" | "closeup" | "scatter" | "items";

// ITEM_START must match Scene's assemble/scatter thresholds below
const ITEM_START = 0.30;

function phase(p: number): Phase {
  if (p < .08) return "intro";
  if (p < .18) return "reveal";
  if (p < .24) return "closeup";
  if (p < ITEM_START) return "scatter";
  return "items";
}

function activeItem(p: number, items: MenuItem[]): { item: MenuItem; seqIdx: number; itemT: number } | null {
  if (p < ITEM_START) return null;
  const span    = 1 - ITEM_START;           // 0.65
  const perItem = span / FEATURED.length;   // ≈0.108 per item = 32vh
  const seqIdx  = Math.min(FEATURED.length - 1, Math.floor((p - ITEM_START) / perItem));
  const itemStart = ITEM_START + seqIdx * perItem;
  const itemT     = Math.max(0, Math.min(1, (p - itemStart) / perItem));
  return { item: items[FEATURED[seqIdx]], seqIdx, itemT };
}

function Overlay({ progress, items }: { progress: number; items: MenuItem[] }) {
  const ph = phase(progress);
  const ai = activeItem(progress, items);
  // Item fade: stays visible through 85% of its slot, then fades
  const itemOpacity = ai ? (ai.itemT < .82 ? 1 : 1 - (ai.itemT - .82) / .18) : 0;

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Section label — always visible */}
      <div className="absolute top-10 left-8 md:left-14 flex items-center gap-3">
        <div className="w-6 h-px bg-orange-500" />
        <span className="text-orange-500 text-[10px] font-sans tracking-[0.35em] uppercase font-medium">
          What We Serve
        </span>
      </div>

      {/* Centre stage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {ph === "intro" && (
            <motion.div key="intro" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,y:-20}}
              transition={{duration:.8}} className="text-center">
              <h2 className="font-display text-[clamp(3.5rem,9vw,8rem)] font-black text-white leading-none">
                The Menu.
              </h2>
              <motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.5,duration:.6}}
                className="font-sans text-white/30 text-xs tracking-[0.4em] uppercase mt-5">
                Scroll to begin
              </motion.p>
            </motion.div>
          )}

          {ph === "reveal" && (
            <motion.div key="reveal" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              transition={{duration:.75,ease:[.16,1,.3,1]}} className="text-center">
              <div className="overflow-hidden">
                <motion.h2 initial={{y:"105%"}} animate={{y:"0%"}}
                  transition={{duration:.85,ease:[.16,1,.3,1]}}
                  className="font-display text-[clamp(2.5rem,7vw,6.5rem)] font-black text-white leading-none">
                  Slow-roasted.
                </motion.h2>
              </div>
              <div className="overflow-hidden mt-1">
                <motion.h2 initial={{y:"105%"}} animate={{y:"0%"}}
                  transition={{duration:.85,ease:[.16,1,.3,1],delay:.1}}
                  className="font-display text-[clamp(2.5rem,7vw,6.5rem)] font-black italic text-orange-500 leading-none">
                  Every day.
                </motion.h2>
              </div>
            </motion.div>
          )}

          {ph === "closeup" && (
            <motion.div key="closeup" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              transition={{duration:.6}} className="absolute bottom-20 left-8 md:left-14 max-w-xs">
              <p className="font-sans text-white/45 text-sm leading-relaxed">
                Seasoned with patience. Cooked over open heat until every surface caramelises to a deep mahogany crust.
              </p>
            </motion.div>
          )}

          {ph === "scatter" && (
            <motion.div key="scatter" initial={{opacity:0,scale:.92}} animate={{opacity:1,scale:1}}
              exit={{opacity:0}} transition={{duration:.65,ease:[.16,1,.3,1]}} className="text-center">
              <p className="font-sans text-white/35 text-[10px] tracking-[0.4em] uppercase mb-3">Every ingredient handpicked</p>
              <h2 className="font-display text-[clamp(2.8rem,7vw,6rem)] font-black text-white leading-none">
                Built to order.
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── MENU ITEM PANEL — right side, always rendered during items phase ── */}
      {ph === "items" && ai && (
        <motion.div
          key={`item-${ai.seqIdx}`}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: itemOpacity, x: 0 }}
          transition={{ duration: .55, ease: [.16,1,.3,1] }}
          className="absolute right-0 top-0 h-full w-full md:w-1/2 flex flex-col justify-center px-8 md:px-14"
          style={{
            background: "linear-gradient(to left, rgba(12,5,1,0.92) 0%, rgba(12,5,1,0.7) 60%, transparent 100%)",
          }}
        >
          {/* Counter */}
          <div className="flex items-center gap-2 mb-8">
            <span className="font-condensed text-[3.5rem] text-white/08 leading-none">
              {String(ai.seqIdx + 1).padStart(2, "0")}
            </span>
            <div className="flex gap-1 items-center ml-2">
              {FEATURED.map((_, i) => (
                <motion.div key={i}
                  animate={{ width: i === ai.seqIdx ? 28 : 6, backgroundColor: i === ai.seqIdx ? "#f97316" : "rgba(255,255,255,0.15)" }}
                  transition={{ duration: .35 }}
                  className="h-px rounded-full"
                />
              ))}
            </div>
          </div>

          {/* Badge */}
          {ai.item.badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-500/35 bg-orange-500/08 text-orange-400 text-[10px] font-sans tracking-widest uppercase mb-4 w-fit">
              <span className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
              {ai.item.badge}
            </div>
          )}

          {/* Name */}
          <div className="overflow-hidden mb-3">
            <motion.h3
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: .7, ease: [.16,1,.3,1] }}
              className="font-display text-[clamp(2rem,4.5vw,4rem)] font-black text-white leading-none"
            >
              {ai.item.name}
            </motion.h3>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .25, duration: .6 }}
            className="font-sans text-white/50 text-sm leading-relaxed mb-6 max-w-xs"
          >
            {ai.item.description}
          </motion.p>

          {/* Price */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .35, duration: .5 }}
            className="flex items-baseline gap-3"
          >
            <span className="font-condensed text-[3.2rem] text-orange-400 leading-none tracking-wide">
              {ai.item.price}
            </span>
            <span className="font-sans text-white/22 text-[10px] uppercase tracking-widest">{ai.item.category}</span>
          </motion.div>

          {/* Progress line */}
          <div className="mt-6 h-px bg-white/8 rounded-full overflow-hidden w-full max-w-xs">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500"
              animate={{ scaleX: ai.itemT }}
              style={{ transformOrigin: "left" }}
              transition={{ duration: 0 }}
            />
          </div>
        </motion.div>
      )}

      {/* Scroll hint */}
      {ph !== "items" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-sans text-white/20 text-[9px] tracking-[0.35em] uppercase">Scroll</span>
          <motion.div className="w-px h-8 bg-gradient-to-b from-white/25 to-transparent"
            animate={{ scaleY:[1,.35,1], opacity:[.5,1,.5] }}
            transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }}
            style={{ transformOrigin:"top" }}
          />
        </motion.div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MENU CARD GRID — normal cream-background section after cinematic
───────────────────────────────────────────────────────────────── */
function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.07 }}
      className="group relative bg-white rounded-2xl p-6 border border-[#1A1A1A]/06 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <span className="font-sans text-xs text-[#1A1A1A]/30 uppercase tracking-widest">{item.category}</span>
        {item.badge && (
          <span className="text-[10px] font-sans font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-orange-500/12 text-orange-600 border border-orange-500/20">
            {item.badge}
          </span>
        )}
      </div>

      <h3 className="font-display font-bold text-[#1A1A1A] text-xl mb-2 group-hover:text-orange-600 transition-colors duration-200">
        {item.name}
      </h3>
      <p className="font-sans text-[#1A1A1A]/50 text-sm leading-relaxed mb-6">
        {item.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="font-condensed text-2xl text-orange-500 tracking-wide">{item.price}</span>
        {!item.available && (
          <span className="text-[10px] font-sans text-[#1A1A1A]/30 uppercase tracking-widest">Unavailable</span>
        )}
      </div>

      {/* Hover accent line */}
      <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}

function MenuCardGrid({ items }: { items: MenuItem[] }) {
  return (
    <section className="relative bg-[#FFF8F0] py-24 overflow-hidden">
      {/* Subtle top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-5"
          >
            <div className="w-8 h-px bg-orange-500" />
            <span className="text-orange-500 text-xs font-sans tracking-[0.3em] uppercase font-medium">Full Menu</span>
          </motion.div>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "105%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(2.8rem,6vw,5.5rem)] font-black text-[#1A1A1A] leading-none"
            >
              Everything we make.
            </motion.h2>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <MenuCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ROOT EXPORT
───────────────────────────────────────────────────────────────── */
export default function CinematicMenuSection({ content }: { content: MenuContent }) {
  const reduce  = useReducedMotion();
  const secRef  = useRef<HTMLElement>(null!);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  const { scrollYProgress } = useScroll({ target: secRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 180, damping: 34, mass: 0.38 });
  useEffect(() => smooth.on("change", setProgress), [smooth]);

  if (reduce) return (
    <>
      <MenuCardGrid items={content.items} />
    </>
  );

  return (
    <>
      {/* ── Cinematic fire section ── */}
      <section
        ref={secRef}
        id="menu"
        aria-label="Hansum menu — cinematic experience"
        style={{ height: `${SCROLL_HEIGHT}vh` }}
        className="relative"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {mounted && (
            <Canvas
              className="absolute inset-0"
              gl={{
                antialias: true,
                alpha: false,
                powerPreference: "high-performance",
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 0.72,
              }}
              shadows={{ type: THREE.PCFSoftShadowMap }}
              camera={{ position: [0, .4, 8.5], fov: 54, near: .1, far: 60 }}
              dpr={[1, typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1]}
            >
              <Suspense fallback={null}>
                <Scene progress={progress} />
              </Suspense>
            </Canvas>
          )}
          <Overlay progress={progress} items={content.items} />
        </div>
      </section>

      {/* ── Standard card grid — normal background ── */}
      <MenuCardGrid items={content.items} />
    </>
  );
}
