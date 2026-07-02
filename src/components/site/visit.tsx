import { Clock, MapPin, Phone } from 'lucide-react';
import { Reveal, SectionHeading } from './reveal';

const hours = [
  { day: 'Monday', time: '10am – 4pm' },
  { day: 'Tuesday', time: '10am – 4pm' },
  { day: 'Wednesday', time: '10am – 4pm' },
  { day: 'Thursday', time: '10am – 4pm' },
  { day: 'Friday', time: '10am – 4pm' },
  { day: 'Saturday', time: '10am – 4pm' },
  { day: 'Sunday', time: 'Closed' },
];

export function Visit() {
  return (
    <section id="visit" className="scroll-mt-8 bg-cream-100 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading kicker="find us down the lane" title="Visit Madden's" />

        <div className="grid gap-8 md:grid-cols-2">
          <Reveal>
            <div className="h-full space-y-8 rounded-2xl bg-background p-8 shadow-lg shadow-espresso-900/5 md:p-10">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-brand/15 text-amber-brand">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-espresso-900">Where</h3>
                  <p className="mt-1 leading-relaxed text-espresso-700/80">
                    11–12 Milk Market Lane,
                    <br />
                    Tralee, Co. Kerry, V92 XYD3
                  </p>
                  <a
                    href="https://maps.google.com/?q=Maddens,+11-12+Milk+Market+Ln,+Tralee,+Co.+Kerry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-medium text-rust-600 underline decoration-2 underline-offset-4 transition-colors hover:text-espresso-900"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-brand/15 text-amber-brand">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-espresso-900">Say hello</h3>
                  <a
                    href="tel:+353858570644"
                    className="mt-1 inline-block leading-relaxed text-espresso-700/80 transition-colors hover:text-rust-600"
                  >
                    085 857 0644
                  </a>
                  <p className="mt-1 text-sm text-espresso-700/60">
                    Ring ahead for group bookings or takeaway orders.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="h-full rounded-2xl bg-background p-8 shadow-lg shadow-espresso-900/5 md:p-10">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-brand/15 text-amber-brand">
                  <Clock className="h-5 w-5" />
                </span>
                <h3 className="font-serif text-xl font-semibold text-espresso-900">Opening hours</h3>
              </div>
              <ul className="mt-6 divide-y divide-espresso-700/10">
                {hours.map((h) => (
                  <li key={h.day} className="flex items-center justify-between py-2.5">
                    <span className="text-espresso-700/90">{h.day}</span>
                    <span
                      className={
                        h.time === 'Closed'
                          ? 'font-medium text-espresso-700/50'
                          : 'font-medium text-espresso-900'
                      }
                    >
                      {h.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
