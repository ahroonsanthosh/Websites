import { motion } from 'framer-motion';
import { Coffee, Croissant, Heart } from 'lucide-react';
import { Reveal, SectionHeading } from './reveal';
import storefront from '@/assets/m6.webp';

const values = [
  {
    icon: Coffee,
    title: 'Serious about coffee',
    text: 'Speciality beans, roasted in Ireland and dialled in every morning before the first cup is poured.',
  },
  {
    icon: Croissant,
    title: 'Baked the slow way',
    text: 'Scones, sourdough and pastries made fresh daily — when they’re gone, they’re gone.',
  },
  {
    icon: Heart,
    title: 'A Kerry welcome',
    text: 'Tucked down Milk Market Lane, we’re a small crew who’ll know your order by your second visit.',
  },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-8 bg-background px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading kicker="our story" title="Traditional at heart, playful by nature" />

        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-full w-full rounded-t-[10rem] border-2 border-amber-brand/50" />
              <div className="relative overflow-hidden rounded-t-[10rem] shadow-xl shadow-espresso-900/10">
                <motion.img
                  src={storefront}
                  alt="The Madden's Coffee storefront on Milk Market Lane with a vintage red Ford parked outside"
                  loading="lazy"
                  initial={{ scale: 1.12 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full object-cover"
                />
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-espresso-700/90">
                Madden's sits on Milk Market Lane, one of Tralee’s oldest trading lanes — a place where
                Kerry has bought, sold and gossiped for generations. We kept the tradition and added
                good espresso.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-espresso-700/90">
                By day we pour flat whites, plate up brunch and send people off with a paper bag of
                still-warm pastries. It’s old-school hospitality with a bit of mischief — the kind of
                spot where the coffee is taken seriously and nothing else is.
              </p>
            </Reveal>

            <div className="mt-10 space-y-6">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.55, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-brand/15 text-rust-600">
                    <v.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-espresso-900">{v.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-espresso-700/80">{v.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
