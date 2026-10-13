"use client";

import { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "ghost" | "dark";
  strength?: number;
}

export default function MagneticButton({
  children,
  className,
  onClick,
  href,
  variant = "primary",
  strength = 0.4,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useSpring(0, { stiffness: 200, damping: 15 });
  const y = useSpring(0, { stiffness: 200, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const variantClasses = {
    primary: "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/25",
    ghost: "border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-cream",
    dark: "bg-[#1A1A1A] text-white hover:bg-[#2A2A2A]",
  };

  const baseClasses = cn(
    "relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-sans font-semibold text-sm tracking-wide transition-colors duration-200 cursor-none select-none",
    variantClasses[variant],
    className
  );

  const content = (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{ scale: isHovered ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {href ? (
        <a href={href} className={baseClasses}>
          {children}
        </a>
      ) : (
        <button onClick={onClick} className={baseClasses}>
          {children}
        </button>
      )}
    </motion.div>
  );

  return content;
}
