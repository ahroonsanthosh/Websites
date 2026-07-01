const WORDS = [
  "fresh out of the oven",
  "oat milk always",
  "cinnamon everything",
  "made in Cork",
  "buns before anything",
  "iced lattes all year",
];

export function Marquee() {
  return (
    <div
      className="relative -rotate-1 overflow-hidden border-y-2 border-cocoa bg-honey py-3 text-cocoa"
      aria-hidden
    >
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap font-display text-lg font-semibold italic">
        {[...WORDS, ...WORDS].map((w, i) => (
          <span key={i} className="flex items-center gap-8">
            {w} <span className="text-berry">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}
