import { Star } from 'lucide-react';
import { SectionHeading } from './reveal';

const reviews = [
  {
    quote:
      'The best flat white in Tralee, no contest. The lane location makes it feel like a hidden gem, but the welcome is anything but hidden.',
    name: 'Aoife',
    detail: 'Local regular',
  },
  {
    quote:
      'Stopped in on our way to Dingle and ended up staying two hours. The Full Madden is worth the trip to Kerry on its own.',
    name: 'Mark & Susan',
    detail: 'Visiting from Dublin',
  },
  {
    quote:
      'Gorgeous little spot down Milk Market Lane. Friendly staff, proper scones with jam and cream, and coffee that would put city cafes to shame.',
    name: 'Claire',
    detail: 'Tripadvisor review',
  },
  {
    quote:
      'The snug at the back is my office two mornings a week now. Great coffee, warm room, zero notions.',
    name: 'Dara',
    detail: 'Remote worker',
  },
  {
    quote:
      'Called in for a takeaway cup and left with a cinnamon bun, a bag of beans and a new favourite spot in Tralee.',
    name: 'Niamh',
    detail: 'Google review',
  },
];

function ReviewCard({ review }: { review: (typeof reviews)[number] }) {
  return (
    <blockquote className="flex w-80 shrink-0 flex-col rounded-2xl bg-espresso-800 p-8 shadow-lg shadow-black/20 md:w-96">
      <div className="flex gap-1 text-amber-brand" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, s) => (
          <Star key={s} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="mt-5 flex-1 leading-relaxed text-cream-100/90">“{review.quote}”</p>
      <footer className="mt-6">
        <p className="font-serif text-lg font-semibold text-cream-50">{review.name}</p>
        <p className="text-sm text-cream-100/60">{review.detail}</p>
      </footer>
    </blockquote>
  );
}

export function Testimonials() {
  return (
    <section id="reviews" className="scroll-mt-8 overflow-hidden bg-espresso-900 py-24 text-cream-50 md:py-32">
      <div className="px-6">
        <SectionHeading kicker="kind words" title="What People Say" className="[&_h2]:text-cream-50" />
      </div>

      {/* Track is duplicated so the -50% translate loops seamlessly; hover pauses it */}
      <div className="relative">
        <div className="reviews-track flex w-max gap-6 pr-6">
          {[...reviews, ...reviews].map((review, i) => (
            <ReviewCard key={`${review.name}-${i}`} review={review} />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-espresso-900 to-transparent md:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-espresso-900 to-transparent md:w-32" />
      </div>
    </section>
  );
}
