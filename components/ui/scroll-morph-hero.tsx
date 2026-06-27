"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";

export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
  src: string;
  index: number;
  total: number;
  phase: AnimationPhase;
  target: { x: number; y: number; rotation: number; scale: number; opacity: number };
}

const IMG_WIDTH = 60;
const IMG_HEIGHT = 85;

function FlipCard({ src, index, target }: FlipCardProps) {
  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{ type: "spring", stiffness: 40, damping: 15 }}
      style={{
        position: "absolute",
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className="cursor-pointer group"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180 }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-[#2a1505]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={src}
            alt={`food-${index}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#E8622A]/10 transition-colors group-hover:bg-transparent" />
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-[#1A0C05] flex flex-col items-center justify-center p-3 border border-[#E8622A]/30"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-[7px] font-accent font-semibold text-[#E8622A] uppercase tracking-widest">
            Uncle&apos;s
          </span>
          <span className="text-[9px] font-medium text-[#FDF6EB] mt-1">Cork</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

const TOTAL_IMAGES = 20;
const MAX_SCROLL = 3000;

const IMAGES = [
  "https://images.unsplash.com/photo-1598515213692-0a0d4e423456?w=300&q=80",
  "https://images.unsplash.com/photo-1562802378-063ec186a863?w=300&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&q=80",
  "https://images.unsplash.com/photo-1544025162-d76538b2a681?w=300&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&q=80",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&q=80",
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=300&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=80",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=300&q=80",
  "https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=300&q=80",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80",
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&q=80",
  "https://images.unsplash.com/photo-1432139509613-5c4255815697?w=300&q=80",
  "https://images.unsplash.com/photo-1528712306091-ed0763094c98?w=300&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&q=80",
  "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=300&q=80",
];

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

interface Props {
  onScrollPast?: () => void;
}

export default function ScrollMorphHero({ onScrollPast }: Props) {
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [showCTA, setShowCTA] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    setContainerSize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    });
    return () => observer.disconnect();
  }, []);

  const virtualScroll = useMotionValue(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const newScroll = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
      scrollRef.current = newScroll;
      virtualScroll.set(newScroll);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;
      const newScroll = Math.min(Math.max(scrollRef.current + deltaY, 0), MAX_SCROLL);
      scrollRef.current = newScroll;
      virtualScroll.set(newScroll);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [virtualScroll]);

  const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });
  const scrollRotate = useTransform(virtualScroll, [600, 3000], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normalizedX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseX.set(normalizedX * 80);
    };
    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX]);

  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase("line"), 500);
    const t2 = setTimeout(() => setIntroPhase("circle"), 2500);
    const t3 = setTimeout(() => setShowCTA(true), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const scatterPositions = useMemo(() => IMAGES.map(() => ({
    x: (Math.random() - 0.5) * 1500,
    y: (Math.random() - 0.5) * 1000,
    rotation: (Math.random() - 0.5) * 180,
    scale: 0.6,
    opacity: 0,
  })), []);

  const [morphValue, setMorphValue] = useState(0);
  const [rotateValue, setRotateValue] = useState(0);
  const [parallaxValue, setParallaxValue] = useState(0);

  useEffect(() => {
    const u1 = smoothMorph.on("change", setMorphValue);
    const u2 = smoothScrollRotate.on("change", setRotateValue);
    const u3 = smoothMouseX.on("change", setParallaxValue);
    return () => { u1(); u2(); u3(); };
  }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

  const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
  const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#1A0C05] overflow-hidden"
    >
      <div className="flex h-full w-full flex-col items-center justify-center">

        {/* Intro brand text — fades out as morph starts */}
        <div className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2 px-6">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={
              introPhase === "circle" && morphValue < 0.5
                ? { opacity: 0.6 - morphValue, y: 0 }
                : { opacity: 0 }
            }
            transition={{ duration: 0.8 }}
            className="text-[10px] font-accent tracking-[0.35em] uppercase text-[#E8622A] mb-4"
          >
            The English Market · Cork City
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={
              introPhase === "circle" && morphValue < 0.5
                ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" }
                : { opacity: 0, filter: "blur(8px)" }
            }
            transition={{ duration: 1 }}
            className="font-display text-[2rem] sm:text-4xl md:text-6xl font-bold italic text-[#FDF6EB] leading-tight"
          >
            Uncle&apos;s Deli
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={
              introPhase === "circle" && morphValue < 0.4
                ? { opacity: 0.4 - morphValue }
                : { opacity: 0 }
            }
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-5 text-[10px] font-accent tracking-[0.3em] uppercase text-[#FDF6EB]/50"
          >
            Scroll to explore
          </motion.p>
        </div>

        {/* Arc content — fades in after morph */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute top-[8%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
        >
          <p className="text-[10px] font-accent tracking-[0.3em] uppercase text-[#E8622A] mb-3">
            Rotisserie · Deli · Cork
          </p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold italic text-[#FDF6EB] tracking-tight mb-4 leading-tight">
            Fire-Roasted.<br />
            <span className="text-[#E8622A]">For Real.</span>
          </h2>
          <p className="text-sm text-[#FDF6EB]/60 max-w-md leading-relaxed font-light">
            Hand-seasoned, slow-roasted rotisserie chicken.<br className="hidden md:block" />
            Find us in the heart of The English Market.
          </p>
        </motion.div>

        {/* Scroll down CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={showCTA ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6 }}
          onClick={onScrollPast}
          className="absolute bottom-6 z-20 flex flex-col items-center gap-1 cursor-pointer pointer-events-auto group p-3 min-h-[56px] min-w-[56px] justify-center"
        >
          <span className="text-[9px] font-accent tracking-[0.3em] uppercase text-[#E8622A]">
            Explore
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="w-4 h-4 border-b-2 border-r-2 border-[#E8622A] rotate-45 group-hover:border-[#F4A61D] transition-colors mt-1"
          />
        </motion.button>

        {/* Cards */}
        <div className="relative flex items-center justify-center w-full h-full">
          {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
            let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

            if (introPhase === "scatter") {
              target = scatterPositions[i];
            } else if (introPhase === "line") {
              const lineSpacing = 70;
              const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
              target = {
                x: i * lineSpacing - lineTotalWidth / 2,
                y: 0,
                rotation: 0,
                scale: 1,
                opacity: 1,
              };
            } else {
              const isMobile = containerSize.width < 768;
              const minDimension = Math.min(containerSize.width, containerSize.height);
              const circleRadius = Math.min(minDimension * 0.35, 350);

              const circleAngle = (i / TOTAL_IMAGES) * 360;
              const circleRad = (circleAngle * Math.PI) / 180;
              const circlePos = {
                x: Math.cos(circleRad) * circleRadius,
                y: Math.sin(circleRad) * circleRadius,
                rotation: circleAngle + 90,
              };

              const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
              const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);
              const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25);
              const arcCenterY = arcApexY + arcRadius;
              const spreadAngle = isMobile ? 100 : 130;
              const startAngle = -90 - spreadAngle / 2;
              const step = spreadAngle / (TOTAL_IMAGES - 1);

              const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
              const maxRotation = spreadAngle * 0.8;
              const boundedRotation = -scrollProgress * maxRotation;
              const currentArcAngle = startAngle + i * step + boundedRotation;
              const arcRad = (currentArcAngle * Math.PI) / 180;

              const arcPos = {
                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                rotation: currentArcAngle + 90,
                scale: isMobile ? 1.4 : 1.8,
              };

              target = {
                x: lerp(circlePos.x, arcPos.x, morphValue),
                y: lerp(circlePos.y, arcPos.y, morphValue),
                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                scale: lerp(1, arcPos.scale, morphValue),
                opacity: 1,
              };
            }

            return (
              <FlipCard
                key={i}
                src={src}
                index={i}
                total={TOTAL_IMAGES}
                phase={introPhase}
                target={target}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
