import { motion } from 'framer-motion';
import { SectionHeading } from './reveal';

const photos = [
  {
    src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    alt: 'Barista pouring a fresh espresso',
    tall: true,
  },
  {
    src: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    alt: 'Fresh croissants from the bakery',
    tall: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    alt: 'Coffee cup on a rustic wooden table',
    tall: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=800&q=80',
    alt: 'Latte art being poured',
    tall: true,
  },
  {
    src: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80',
    alt: 'Brunch plate with eggs and toast',
    tall: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    alt: 'Cosy cafe corner with warm lighting',
    tall: true,
  },
];

export function Gallery() {
  return (
    <section id="gallery" className="scroll-mt-8 bg-background px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading kicker="a peek inside" title="Life on the Lane" />

        <div className="columns-2 gap-4 md:columns-3">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.src}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
              className="mb-4 break-inside-avoid overflow-hidden rounded-2xl"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className={`w-full object-cover transition-transform duration-700 ease-out hover:scale-105 ${
                  photo.tall ? 'aspect-[3/4]' : 'aspect-square'
                }`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
