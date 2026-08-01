"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ShaderBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.0));
    container.appendChild(renderer.domElement);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(container.offsetWidth, container.offsetHeight) }
      },
      vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
      fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;
        #define NUM_OCTAVES 2
        float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
        float noise(vec2 p) {
          vec2 ip = floor(p); vec2 u = fract(p);
          u = u*u*(3.0-2.0*u);
          float res = mix(mix(rand(ip),rand(ip+vec2(1,0)),u.x),mix(rand(ip+vec2(0,1)),rand(ip+vec2(1,1)),u.x),u.y);
          return res*res;
        }
        float fbm(vec2 x) {
          float v=0.; float a=0.3; vec2 shift=vec2(100);
          mat2 rot=mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.5));
          for(int i=0;i<NUM_OCTAVES;i++){v+=a*noise(x);x=rot*x*2.+shift;a*=0.4;}
          return v;
        }
        void main() {
          vec2 p=((gl_FragCoord.xy)-iResolution.xy*0.5)/iResolution.y*mat2(6.,-4.,4.,6.);
          vec2 v; vec4 o=vec4(0.);
          float f=2.+fbm(p+vec2(iTime*5.,0.))*0.5;
          for(float i=0.;i<16.;i++){
            v=p+cos(i*i+(iTime+p.x*0.08)*0.025+i*vec2(13.,11.))*3.5;
            vec4 col=vec4(
              0.6+0.3*sin(i*0.2+iTime*0.4),
              0.35+0.2*cos(i*0.3+iTime*0.5),
              0.05+0.1*sin(i*0.4+iTime*0.3),
              1.
            );
            float thin=smoothstep(0.,1.,i/16.)*0.5;
            o+=col*exp(sin(i*i+iTime*0.8))/length(max(v,vec2(v.x*f*0.015,v.y*1.5)))*thin;
          }
          o=tanh(pow(o/100.,vec4(1.6)));
          gl_FragColor=vec4(o.rgb*1.2, 0.85);
        }
      `
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    let frameId: number;
    let running = true;

    const animate = () => {
      if (!running) return;
      material.uniforms.iTime.value += 0.01;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    const canvas = renderer.domElement;

    const onContextLost = (e: Event) => {
      e.preventDefault();
      running = false;
      cancelAnimationFrame(frameId);
    };

    const onContextRestored = () => {
      running = true;
      animate();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frameId);
      } else {
        running = true;
        animate();
      }
    };

    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);
    document.addEventListener('visibilitychange', onVisibilityChange);

    animate();

    const handleResize = () => {
      if (!container) return;
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      material.uniforms.iResolution.value.set(container.offsetWidth, container.offsetHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (container.contains(canvas)) container.removeChild(canvas);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);
  return <div ref={containerRef} className="absolute inset-0" />;
};
export default ShaderBackground;
