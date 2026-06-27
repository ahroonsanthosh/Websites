"use client";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientText({ children, className = "" }: GradientTextProps) {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: "linear-gradient(90deg, #E8622A, #F4A61D, #FDF6EB, #F4A61D, #E8622A)",
        backgroundSize: "300% 100%",
        animation: "gradient-flow 5s linear infinite",
      }}
    >
      {children}
      <style jsx>{`
        @keyframes gradient-flow {
          0%   { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>
    </span>
  );
}
