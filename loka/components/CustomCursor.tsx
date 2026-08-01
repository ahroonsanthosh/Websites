'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 300, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  const ringSpringConfig = { damping: 22, stiffness: 180, mass: 0.8 };
  const ringSX = useSpring(ringX, ringSpringConfig);
  const ringSY = useSpring(ringY, ringSpringConfig);

  const [isHovering, setIsHovering] = useState(false);
  const [isText, setIsText] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isLink = target.closest('a, button, [role="button"]');
      const isInput = target.closest('input, textarea');
      setIsHovering(!!isLink);
      setIsText(!!isInput);
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseleave', () => setIsVisible(false));

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', onEnter);
    };
  }, [cursorX, cursorY, ringX, ringY, isVisible]);

  return (
    <>
      {/* Dot */}
      <motion.div
        className="pointer-events-none fixed z-[9998] rounded-full bg-coffee-800 mix-blend-multiply"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          top: 0,
          left: 0,
          width: isHovering ? 0 : isText ? 2 : 8,
          height: isHovering ? 0 : isText ? 20 : 8,
          opacity: isVisible ? 1 : 0,
          transition: 'width 0.2s, height 0.2s, opacity 0.2s',
        }}
      />
      {/* Ring */}
      <motion.div
        className="pointer-events-none fixed z-[9997] rounded-full border border-coffee-500"
        style={{
          x: ringSX,
          y: ringSY,
          translateX: '-50%',
          translateY: '-50%',
          top: 0,
          left: 0,
          width: isHovering ? 44 : 30,
          height: isHovering ? 44 : 30,
          opacity: isVisible ? (isHovering ? 0.6 : 0.3) : 0,
          transition: 'width 0.25s cubic-bezier(0.16,1,0.3,1), height 0.25s cubic-bezier(0.16,1,0.3,1), opacity 0.2s',
        }}
      />
    </>
  );
}
