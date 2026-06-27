"use client";

import { motion } from "framer-motion";

const letterVariants = {
  rest: { y: 0, color: "inherit" },
  hover: (i: number) => ({
    y: [0, -7, 0],
    transition: {
      delay: i * 0.035,
      duration: 0.45,
      type: "spring",
      stiffness: 500,
      damping: 12,
    },
  }),
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
          className={`inline-flex ${wordClassName ?? ""}`}
          initial="rest"
          whileHover="hover"
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
