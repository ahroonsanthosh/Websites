import { motion } from 'framer-motion';
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
];

export function Testimonials() {
  return (
    <section id="reviews" className="scroll-mt-8 bg-espresso-900 px-6 py-24 text-cream-50 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading kicker="kind words" title="What People Say" className="[&_h2]:text-cream-50" />

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review, i) => (
            <motion.blockquote
              key={review.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.12 * i, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col rounded-2xl bg-espresso-800 p-8 shadow-lg shadow-black/20"
            >
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
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
