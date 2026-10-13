"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  opacity: number;
  fadeDelay: number;
  fadeStart: number;
  fadingOut: boolean;
  reset: (canvas: HTMLCanvasElement) => void;
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

function createParticle(canvas: HTMLCanvasElement): Particle {
  const p: Particle = {
    x: 0, y: 0, size: 0, speed: 0, drift: 0,
    opacity: 1, fadeDelay: 0, fadeStart: 0, fadingOut: false,
    reset(c) {
      this.x = Math.random() * c.width;
      this.y = c.height + 10;
      this.size = Math.random() * 1.5 + 0.4;
      this.speed = Math.random() * 0.6 + 0.3;
      this.drift = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.6 + 0.4;
      this.fadeDelay = Math.random() * 1200 + 400;
      this.fadeStart = Date.now() + this.fadeDelay;
      this.fadingOut = false;
    },
    update() {
      this.y -= this.speed;
      this.x += this.drift;
      if (this.y < -10) { this.reset(canvas); return; }
      if (!this.fadingOut && Date.now() > this.fadeStart) this.fadingOut = true;
      if (this.fadingOut) {
        this.opacity -= 0.006;
        if (this.opacity <= 0) this.reset(canvas);
      }
    },
    draw(ctx) {
      const r = 255;
      const g = Math.floor(60 + Math.random() * 100);
      const b = 0;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.shadowColor = `rgba(255,120,0,0.8)`;
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.size * 0.5, this.size * 1.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
  };
  p.reset(canvas);
  p.y = Math.random() * canvas.height;
  return p;
}

export function EmberParticles({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.offsetWidth : window.innerWidth;
      canvas.height = parent ? parent.offsetHeight : window.innerHeight;
      const count = Math.floor((canvas.width * canvas.height) / 5000);
      particles = Array.from({ length: count }, () => createParticle(canvas));
    };

    let particles: Particle[] = [];
    resize();

    let rafId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(ctx); });
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
