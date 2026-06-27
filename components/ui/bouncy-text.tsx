"use client";

import { motion } from "framer-motion";

const letterVariants = {
  rest: { y: 0, scale: 1 },
  hover: (i: number) => ({
    y: [0, -14, 4, -6, 2, 0],
    scale: [1, 1.25, 0.9, 1.1, 0.97, 1],
    transition: {
      delay: i * 0.04,
      duration: 0.6,
      type: "spring" as const,
      stiffness: 600,
      damping: 10,
    },
  }),
};

const wordVariants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.08,
    y: -3,
    transition: { type: "spring" as const, stiffness: 400, damping: 14 },
  },
};

interface BouncyTextProps {
  text: string;
  className?: string;
  letterClassName?: string;
}

export function BouncyText({ text, className, letterClassName }: BouncyTextProps) {
  return (
    <motion.span
      className={`inline-flex flex-wrap ${className ?? ""}`}
      initial="rest"
      whileHover="hover"
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={letterVariants}
          custom={i}
          className={`inline-block ${letterClassName ?? ""}`}
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export function BouncyWords({ text, className, wordClassName }: { text: string; className?: string; wordClassName?: string }) {
  return (
    <span className={`inline-flex flex-wrap gap-x-[0.25em] ${className ?? ""}`}>
      {text.split(" ").map((word, wi) => (
        <motion.span
          key={wi}
          className={`inline-flex cursor-default ${wordClassName ?? ""}`}
          initial="rest"
          whileHover="hover"
          variants={wordVariants}
        >
          {word.split("").map((char, ci) => (
            <motion.span
              key={ci}
              className="inline-block"
              variants={letterVariants}
              custom={ci}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      ))}
    </span>
  );
}
