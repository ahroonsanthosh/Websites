'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Phone, Clock } from 'lucide-react';
import type { SiteContent } from '@/types/content';

function getTodayName() {
  return new Date().toLocaleDateString('en-IE', { weekday: 'long' });
}

export default function Hours({ content }: { content: SiteContent }) {
  const { hours, site } = content;
  const today = getTodayName();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  return (
    <section id="hours" className="bg-coffee-900 text-cream-100 py-28 md:py-36 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">

        {/* Hours */}
        <div ref={ref}>
          <div className="overflow-hidden mb-12">
            <motion.div
              initial={{ y: '110%' }}
              animate={inView ? { y: '0%' } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-xs font-medium uppercase tracking-widest text-coffee-300 mb-3">
                — Opening Hours
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-cream-100">
                When to <span className="italic font-light">find us</span>
              </h2>
            </motion.div>
          </div>

          <div className="space-y-0">
            {hours.days.map((entry, i) => {
              const isToday = entry.day === today;
              return (
                <motion.div
                  key={entry.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex justify-between items-center py-4 border-b ${
                    isToday
                      ? 'border-coffee-400/40'
                      : 'border-coffee-700/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isToday && (
                      <span className="h-1.5 w-1.5 rounded-full bg-coffee-300 animate-pulse" />
                    )}
                    <span className={`text-sm font-medium ${isToday ? 'text-coffee-200' : 'text-cream-300/60'}`}>
                      {entry.day}
                    </span>
                    {isToday && (
                      <span className="text-xs text-coffee-300 bg-coffee-700/50 px-2 py-0.5 rounded-full">Today</span>
                    )}
                  </div>
                  <span className={`text-sm font-light ${entry.closed ? 'text-cream-500/40' : isToday ? 'text-cream-100' : 'text-cream-200/70'}`}>
                    {entry.hours}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Find Us */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs font-medium uppercase tracking-widest text-coffee-300 mb-12">
              — Find Us
            </p>

            <div className="space-y-8">
              <a
                href={`https://maps.google.com/?q=35+Lower+Castle+St+Tralee+Kerry`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 hover:text-coffee-200 transition-colors"
              >
                <div className="mt-0.5 p-2.5 rounded-xl bg-coffee-700/50 group-hover:bg-coffee-600/50 transition-colors">
                  <MapPin className="h-4 w-4 text-coffee-300" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-coffee-400 mb-1">Address</p>
                  <p className="text-cream-200 text-sm leading-relaxed">{site.address}</p>
                </div>
              </a>

              <a
                href={`tel:${site.phone.replace(/\s/g, '')}`}
                className="group flex items-start gap-4 hover:text-coffee-200 transition-colors"
              >
                <div className="mt-0.5 p-2.5 rounded-xl bg-coffee-700/50 group-hover:bg-coffee-600/50 transition-colors">
                  <Phone className="h-4 w-4 text-coffee-300" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-coffee-400 mb-1">Phone</p>
                  <p className="text-cream-200 text-sm">{site.phone}</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="mt-0.5 p-2.5 rounded-xl bg-coffee-700/50">
                  <Clock className="h-4 w-4 text-coffee-300" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-coffee-400 mb-1">Kitchen Hours</p>
                  <p className="text-cream-200 text-sm">Breakfast & Lunch · Until 3pm</p>
                </div>
              </div>
            </div>

            {/* Map embed placeholder */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
              className="mt-10 overflow-hidden rounded-2xl border border-coffee-700/50"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2432.4!2d-9.7013!3d52.2693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x485b54e7b3c92a4f%3A0x1!2s35+Lower+Castle+St%2C+Tralee%2C+Co.+Kerry!5e0!3m2!1sen!2sie!4v1"
                width="100%"
                height="200"
                style={{ border: 0, filter: 'grayscale(0.8) contrast(1.1)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="LOKA Coffee Shop location"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
