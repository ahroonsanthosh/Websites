export function Marquee() {
  const items = ["Fine Handmade Chocolate","·","Specialty Coffee","·","Artisan Pastries","·","Cork City","·"];
  const track = [...items, ...items, ...items];

  return (
    <div className="overflow-hidden bg-[var(--amber)] py-3" aria-hidden>
      <div className="flex gap-8 md:gap-12 w-max whitespace-nowrap"
        style={{ animation: "marquee 26s linear infinite" }}>
        {track.map((t, i) => (
          <span key={i} className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase font-medium text-[var(--dark)]">
            {t}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
        @media (prefers-reduced-motion: reduce) { div { animation: none !important; } }
      `}</style>
    </div>
  );
}
