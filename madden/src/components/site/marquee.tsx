const items = [
  'Flat Whites',
  'Fruit Scones',
  'Cinnamon Buns',
  'The Full Madden',
  'Milk Market Lane',
  'Batch Brew',
  'Guinness Brownies',
  'A Kerry Welcome',
];

// Continuously scrolling text band; the track is duplicated so the
// -50% translate loops seamlessly.
export function MarqueeBand() {
  const track = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-amber-brand/30 bg-espresso-900 py-4" aria-hidden="true">
      <div className="marquee-track flex w-max items-center">
        {track.map((item, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="px-6 font-serif text-lg italic tracking-wide text-cream-100/90 md:text-xl">
              {item}
            </span>
            <span className="text-amber-brand">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
