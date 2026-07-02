import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

// Fades content up as it scrolls into view; respects reduced-motion.
export function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// Headings rise out of a clipping mask — a typographic reveal rather
// than a generic fade — with the kicker settling in just after.
export function SectionHeading({
  kicker,
  title,
  className,
}: {
  kicker: string;
  title: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  // The observed element is the (always visible) wrapper — the masked
  // title span would report zero intersection while clipped.
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      className={cn('mb-14 text-center', className)}
    >
      <motion.p
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { duration: 0.6, delay: 0.35 } },
        }}
        className="font-serif text-lg italic tracking-wide text-rust-600"
      >
        ✦ {kicker} ✦
      </motion.p>
      <h2 className="mt-2 overflow-hidden font-serif text-4xl font-semibold text-espresso-900 md:text-5xl">
        <motion.span
          variants={{
            hidden: { y: reduceMotion ? 0 : '110%' },
            show: { y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
          }}
          className="block pb-1"
        >
          {title}
        </motion.span>
      </h2>
    </motion.div>
  );
}
