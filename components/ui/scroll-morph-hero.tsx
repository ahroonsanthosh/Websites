"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import content from "@/lib/content";

export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
  src: string;
  index: number;
  total: number;
  phase: AnimationPhase;
  target: { x: number; y: number; rotation: number; scale: number; opacity: number };
  isMobileDevice: boolean;
}

const IMG_WIDTH = 60;
const IMG_HEIGHT = 85;

function FlipCard({ src, index, target, isMobileDevice }: FlipCardProps) {
  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{
        type: "spring",
        stiffness: isMobileDevice ? 60 : 40,
        damping: isMobileDevice ? 18 : 15,
      }}
      style={{
        position: "absolute",
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className="cursor-pointer group"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={isMobileDevice ? {} : { rotateY: 180 }}
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
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[#E8622A]/10" />
        </div>
        {/* Back — desktop only */}
        {!isMobileDevice && (
          <div
            className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-[#1A0C05] flex flex-col items-center justify-center p-3 border border-[#E8622A]/30"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <span className="text-[7px] font-accent font-semibold text-[#E8622A] uppercase tracking-widest">Uncle&apos;s</span>
            <span className="text-[9px] font-medium text-[#FDF6EB] mt-1">Cork</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const LOCAL_IMAGES = [
  `${BASE}/images/deli-4.png`,
  `${BASE}/images/deli-1.png`,
  `${BASE}/images/deli-3.png`,
  `${BASE}/images/deli-2.png`,
];

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

interface Props {
  onScrollPast?: () => void;
}

const { hero } = content;

export default function ScrollMorphHero({ onScrollPast }: Props) {
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const hasScrolledPast = useRef(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Detect mobile once on mount
  useEffect(() => {
    setIsMobileDevice(window.innerWidth < 768);
  }, []);

  const TOTAL_IMAGES = isMobileDevice ? 10 : 20;
  const MAX_SCROLL = isMobileDevice ? 800 : 2000;
  const IMAGES = useMemo(
    () => Array.from({ length: TOTAL_IMAGES }, (_, i) => LOCAL_IMAGES[i % LOCAL_IMAGES.length]),
    [TOTAL_IMAGES]
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    observer.observe(containerRef.current);
    setContainerSize({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight });
    return () => observer.disconnect();
  }, []);

  const virtualScroll = useMotionValue(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (hasScrolledPast.current) {
        if (window.scrollY === 0 && e.deltaY < 0) {
          e.preventDefault();
          hasScrolledPast.current = false;
          const newScroll = Math.max(MAX_SCROLL + e.deltaY, 0);
          scrollRef.current = newScroll;
          virtualScroll.set(newScroll);
        }
        return;
      }
      e.preventDefault();
      const newScroll = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
      scrollRef.current = newScroll;
      virtualScroll.set(newScroll);
      if (newScroll >= MAX_SCROLL) {
        hasScrolledPast.current = true;
        setTimeout(() => onScrollPast?.(), 400);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = (touchStartY - e.touches[0].clientY) * (isMobileDevice ? 1.6 : 1);
      touchStartY = e.touches[0].clientY;

      if (hasScrolledPast.current) {
        if (window.scrollY === 0 && deltaY < 0) {
          e.preventDefault();
          hasScrolledPast.current = false;
          const newScroll = Math.max(MAX_SCROLL + deltaY, 0);
          scrollRef.current = newScroll;
          virtualScroll.set(newScroll);
        }
        return;
      }
      e.preventDefault();
      const newScroll = Math.min(Math.max(scrollRef.current + deltaY, 0), MAX_SCROLL);
      scrollRef.current = newScroll;
      virtualScroll.set(newScroll);
      if (newScroll >= MAX_SCROLL) {
        hasScrolledPast.current = true;
        setTimeout(() => onScrollPast?.(), 400);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [virtualScroll, onScrollPast, isMobileDevice, MAX_SCROLL]);

  const morphEnd = isMobileDevice ? 300 : 600;
  const morphProgress = useTransform(virtualScroll, [0, morphEnd], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: isMobileDevice ? 60 : 40, damping: 20 });
  const scrollRotate = useTransform(virtualScroll, [morphEnd, MAX_SCROLL], [0, 220]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: isMobileDevice ? 60 : 40, damping: 20 });

  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    if (isMobileDevice) return;
    const container = containerRef.current;
    if (!container) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX.set(((e.clientX - rect.left) / rect.width * 2 - 1) * 80);
    };
    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, isMobileDevice]);

  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase("line"), 400);
    const t2 = setTimeout(() => setIntroPhase("circle"), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const scatterPositions = useMemo(() => IMAGES.map(() => ({
    x: (Math.random() - 0.5) * (isMobileDevice ? 600 : 1500),
    y: (Math.random() - 0.5) * (isMobileDevice ? 500 : 1000),
    rotation: (Math.random() - 0.5) * 180,
    scale: 0.6,
    opacity: 0,
  })), [IMAGES, isMobileDevice]);

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

  const scrollProgress = Math.min(scrollRef.current / MAX_SCROLL, 1);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#1A0C05] overflow-hidden"
      style={{ touchAction: "none" }}
    >
      <div className="flex h-full w-full flex-col items-center justify-center">

        {/* Intro brand text */}
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
            {hero.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={
              introPhase === "circle" && morphValue < 0.5
                ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" }
                : { opacity: 0, filter: "blur(8px)" }
            }
            transition={{ duration: 1 }}
            className="font-display text-[2.2rem] sm:text-4xl md:text-6xl font-bold italic text-[#FDF6EB] leading-tight"
          >
            {hero.heading}
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
            {hero.subheading}
          </motion.p>
        </div>

        {/* Arc content */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute top-[8%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
        >
          <p className="text-[10px] font-accent tracking-[0.3em] uppercase text-[#E8622A] mb-3">
            {hero.arcEyebrow}
          </p>
          <h2 className="font-display text-xl sm:text-3xl md:text-5xl font-bold italic text-[#FDF6EB] tracking-tight mb-3 leading-tight">
            {hero.arcHeading}<br />
            <span className="text-[#E8622A]">{hero.arcHeadingAccent}</span>
          </h2>
          <p className="hidden sm:block text-sm text-[#FDF6EB]/60 max-w-md leading-relaxed font-light">
            {hero.arcBody}
          </p>
        </motion.div>

        {/* Scroll progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={introPhase === "circle" ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-[9px] font-accent tracking-[0.3em] uppercase text-[#E8622A]/60">
            Scroll to explore
          </span>
          <div className="w-20 h-0.5 bg-[#FDF6EB]/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#E8622A] rounded-full origin-left"
              style={{ scaleX: scrollProgress }}
            />
          </div>
        </motion.div>

        {/* Cards */}
        <div className="relative flex items-center justify-center w-full h-full">
          {IMAGES.map((src, i) => {
            let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

            if (introPhase === "scatter") {
              target = scatterPositions[i];
            } else if (introPhase === "line") {
              const lineSpacing = isMobileDevice ? 50 : 70;
              target = {
                x: i * lineSpacing - (TOTAL_IMAGES * lineSpacing) / 2,
                y: 0, rotation: 0, scale: 1, opacity: 1,
              };
            } else {
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
              const arcRadius = baseRadius * (isMobileDevice ? 1.4 : 1.1);
              const arcApexY = containerSize.height * (isMobileDevice ? 0.35 : 0.25);
              const arcCenterY = arcApexY + arcRadius;
              const spreadAngle = isMobileDevice ? 100 : 130;
              const startAngle = -90 - spreadAngle / 2;
              const step = spreadAngle / (TOTAL_IMAGES - 1);
              const sp = Math.min(Math.max(rotateValue / 220, 0), 1);
              const boundedRotation = -sp * spreadAngle * 0.8;
              const currentArcAngle = startAngle + i * step + boundedRotation;
              const arcRad = (currentArcAngle * Math.PI) / 180;
              const arcPos = {
                x: Math.cos(arcRad) * arcRadius + (isMobileDevice ? 0 : parallaxValue),
                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                rotation: currentArcAngle + 90,
                scale: isMobileDevice ? 1.4 : 1.8,
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
                isMobileDevice={isMobileDevice}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
