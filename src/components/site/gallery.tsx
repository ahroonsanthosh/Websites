import { motion } from 'framer-motion';
import { SectionHeading } from './reveal';
import m1 from '@/assets/m1.webp';
import m2 from '@/assets/m2.webp';
import m4 from '@/assets/m4.webp';
import m5 from '@/assets/m5.webp';
import m8 from '@/assets/m8.webp';

const photos = [
  {
    src: m1,
    alt: 'Takeaway cup with latte art on the counter',
    caption: 'No place like home',
    tall: true,
  },
  {
    src: m4,
    alt: 'The front window with vintage lamps and moka pots',
    caption: 'The window seat',
    tall: false,
  },
  {
    src: m2,
    alt: 'Stone-walled seating with fairy lights and stools',
    caption: 'Cosy corners',
    tall: true,
  },
  {
    src: m5,
    alt: 'A keep-cup and treat outside on the lane',
    caption: 'To the lane',
    tall: false,
  },
  {
    src: m8,
    alt: 'The snug with lit shelves of curiosities',
    caption: 'The snug',
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
            <motion.figure
              key={photo.src}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
              className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className={`w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                  photo.tall ? 'aspect-[3/4]' : 'aspect-square'
                }`}
              />
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-espresso-900/80 to-transparent p-4 pt-10 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="font-script text-2xl text-cream-50">{photo.caption}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
