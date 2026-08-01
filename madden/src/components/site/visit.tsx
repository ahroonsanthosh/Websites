import { Clock, MapPin, Phone } from 'lucide-react';
import { Reveal, SectionHeading } from './reveal';

// Mon–Sat 10:00–16:00, Sunday closed
const hours = [
  { day: 'Monday', time: '10am – 4pm', open: true },
  { day: 'Tuesday', time: '10am – 4pm', open: true },
  { day: 'Wednesday', time: '10am – 4pm', open: true },
  { day: 'Thursday', time: '10am – 4pm', open: true },
  { day: 'Friday', time: '10am – 4pm', open: true },
  { day: 'Saturday', time: '10am – 4pm', open: true },
  { day: 'Sunday', time: 'Closed', open: false },
];

function useOpenState() {
  const now = new Date();
  // getDay(): 0 = Sunday … 6 = Saturday; hours[] starts at Monday
  const todayIndex = (now.getDay() + 6) % 7;
  const today = hours[todayIndex];
  const hour = now.getHours();
  const openNow = today.open && hour >= 10 && hour < 16;
  return { todayIndex, openNow };
}

export function Visit() {
  const { todayIndex, openNow } = useOpenState();

  return (
    <section id="visit" className="scroll-mt-8 bg-cream-100 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading kicker="find us down the lane" title="Visit Madden's" />

        <div className="grid gap-8 md:grid-cols-2">
          <Reveal>
            <div className="h-full space-y-8 rounded-2xl border border-espresso-700/10 bg-background p-8 md:p-10">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-brand/15 text-rust-600">
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
                    href="https://maps.google.com/?q=Madden's,+11-12+Milk+Market+Ln,+Tralee,+Co.+Kerry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-medium text-rust-600 underline decoration-2 underline-offset-4 transition-colors hover:text-espresso-900"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-brand/15 text-rust-600">
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
            <div className="h-full rounded-2xl border border-espresso-700/10 bg-background p-8 md:p-10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-brand/15 text-rust-600">
                    <Clock className="h-5 w-5" />
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-espresso-900">Opening hours</h3>
                </div>
                <span
                  className={
                    openNow
                      ? 'flex items-center gap-2 rounded-full bg-amber-brand/20 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-rust-700'
                      : 'flex items-center gap-2 rounded-full bg-espresso-700/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-espresso-700/70'
                  }
                >
                  <span
                    className={
                      openNow
                        ? 'h-1.5 w-1.5 animate-pulse rounded-full bg-rust-600'
                        : 'h-1.5 w-1.5 rounded-full bg-espresso-700/40'
                    }
                    aria-hidden="true"
                  />
                  {openNow ? 'Open now' : 'Closed'}
                </span>
              </div>
              <ul className="mt-6 divide-y divide-espresso-700/10">
                {hours.map((h, i) => {
                  const isToday = i === todayIndex;
                  return (
                    <li key={h.day} className="flex items-center justify-between py-2.5">
                      <span
                        className={
                          isToday ? 'flex items-center gap-2 font-semibold text-espresso-900' : 'text-espresso-700/90'
                        }
                      >
                        {isToday && <span className="h-1.5 w-1.5 rounded-full bg-rust-600" aria-hidden="true" />}
                        {h.day}
                        {isToday && <span className="sr-only">(today)</span>}
                      </span>
                      <span
                        className={
                          h.open
                            ? isToday
                              ? 'font-semibold text-espresso-900'
                              : 'font-medium text-espresso-900'
                            : 'font-medium text-espresso-700/50'
                        }
                      >
                        {h.time}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
