"use client";

import { useState } from "react";
import Image from "next/image";

interface HansumImageProps {
  src?: string;
  alt: string;
  /** Tailwind gradient classes used for the branded placeholder fallback. */
  gradient?: string;
  /** Emoji shown on the placeholder when no real image is available. */
  emoji?: string;
  /** Caption shown on the placeholder. */
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Central, swappable image component for the whole site.
 *
 * - If `src` points at a real uploaded asset (and it loads), it renders an
 *   optimised next/image.
 * - Otherwise it renders an on-brand gradient + emoji placeholder so the layout
 *   never breaks and content can be dropped in later via the CMS.
 */
export default function HansumImage({
  src,
  alt,
  gradient = "from-orange-900/80 to-red-900/80",
  emoji = "🍗",
  label,
  className = "",
  sizes = "(max-width: 768px) 50vw, 33vw",
  priority = false,
}: HansumImageProps) {
  const [failed, setFailed] = useState(false);

  const hasRealImage = Boolean(src) && !failed;

  if (hasRealImage) {
    return (
      <Image
        src={src as string}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onError={() => setFailed(true)}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${gradient} ${className}`}
    >
      <span className="text-6xl mb-3" aria-hidden="true">
        {emoji}
      </span>
      {label && (
        <span className="font-sans text-white/70 text-sm tracking-wide">{label}</span>
      )}
    </div>
  );
}
