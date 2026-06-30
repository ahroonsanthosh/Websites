import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  innerClassName?: string;
  wide?: boolean;
}

// Uses inline styles for padding/max-width — Tailwind v4 doesn't reliably
// compile responsive classes generated inside cn() at build time.
export function Section({ children, className, id, innerClassName, wide }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("", className)}
      style={{ paddingTop: "clamp(5rem, 10vw, 9rem)", paddingBottom: "clamp(5rem, 10vw, 9rem)" }}
    >
      <div
        className={cn("mx-auto w-full", innerClassName)}
        style={{
          maxWidth: wide ? "1200px" : "860px",
          paddingLeft: "clamp(1.5rem, 6vw, 5rem)",
          paddingRight: "clamp(1.5rem, 6vw, 5rem)",
        }}
      >
        {children}
      </div>
    </section>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-amber-500/60 text-[11px] uppercase tracking-[0.45em] font-light mb-5">
      {children}
    </span>
  );
}

export function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-serif text-5xl md:text-6xl text-amber-50 leading-[1.05] tracking-tight",
        className
      )}
    >
      {children}
    </h2>
  );
}
