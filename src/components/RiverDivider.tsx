export default function RiverDivider({
  from,
  to,
  flip = false,
}: {
  from: string;
  to: string;
  flip?: boolean;
}) {
  return (
    <div className="relative w-full overflow-hidden" style={{ background: from, height: "64px" }} aria-hidden="true">
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-full"
        style={{ transform: flip ? "scaleX(-1)" : undefined }}
      >
        <path
          d="M0,40 C220,90 380,-10 620,30 C860,70 1000,0 1220,35 C1340,55 1400,30 1440,40 L1440,80 L0,80 Z"
          fill={to}
        />
      </svg>
    </div>
  );
}
