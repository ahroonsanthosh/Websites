"use client";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientText({ children, className = "" }: GradientTextProps) {
  return (
    <>
      <style>{`
        @keyframes gradient-flow {
          0%   { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        .gradient-text-anim {
          background-image: linear-gradient(90deg, #E8622A, #F4A61D, #FDF6EB, #F4A61D, #E8622A);
          background-size: 300% 100%;
          animation: gradient-flow 5s linear infinite;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
      `}</style>
      <span className={`inline-block gradient-text-anim ${className}`}>
        {children}
      </span>
    </>
  );
}
