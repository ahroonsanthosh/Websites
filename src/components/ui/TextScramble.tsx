"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function TextScramble({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const started = useRef(false);

  useEffect(() => {
    if (!isInView || started.current) return;
    started.current = true;

    const run = () => {
      let frame = 0;
      const totalFrames = 20;
      const id = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        setDisplay(
          text.split("").map((char, i) => {
            if (char === " " || char === "·") return char;
            if (i / text.length < progress) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join("")
        );
        if (frame >= totalFrames) clearInterval(id);
      }, 36);
    };

    if (delay > 0) {
      const t = setTimeout(run, delay);
      return () => clearTimeout(t);
    } else {
      run();
    }
  }, [isInView, text, delay]);

  return <span ref={ref} className={className} aria-label={text}>{display}</span>;
}
