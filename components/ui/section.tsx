import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  innerClassName?: string;
  wide?: boolean;
}

export function Section({ children, className, id, innerClassName, wide }: SectionProps) {
  return (
    <section id={id} className={cn("py-28 md:py-36", className)}>
      <div
        className={cn(
          "mx-auto w-full px-6 sm:px-10 md:px-16 xl:px-24",
          wide ? "max-w-7xl" : "max-w-5xl",
          innerClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-amber-500/60 text-[11px] uppercase tracking-[0.45em] font-light mb-4">
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
        "font-serif text-4xl md:text-5xl lg:text-6xl text-amber-50 leading-[1.05] tracking-tight",
        className
      )}
    >
      {children}
    </h2>
  );
}
