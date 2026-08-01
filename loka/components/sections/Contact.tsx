'use client';
import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, Send } from 'lucide-react';
import type { SiteContent } from '@/types/content';

function FloatField({
  id,
  label,
  type = 'text',
  required,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="float-label-wrap relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        placeholder=" "
        className={`w-full border-b bg-transparent px-0 pb-3 pt-6 text-sm text-coffee-900 outline-none transition-colors placeholder-transparent ${
          focused ? 'border-coffee-500' : 'border-coffee-200'
        }`}
      />
      <label
        htmlFor={id}
        className={`absolute left-0 text-coffee-500 pointer-events-none transition-all duration-200 ${
          focused || hasValue
            ? 'top-0.5 text-[10px] uppercase tracking-widest text-coffee-400'
            : 'top-5 text-sm'
        }`}
      >
        {label}
      </label>
    </div>
  );
}

function FloatTextarea({
  id,
  label,
  required,
  value,
  onChange,
}: {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="float-label-wrap relative">
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        placeholder=" "
        rows={4}
        className={`w-full resize-none border-b bg-transparent px-0 pb-3 pt-6 text-sm text-coffee-900 outline-none transition-colors placeholder-transparent ${
          focused ? 'border-coffee-500' : 'border-coffee-200'
        }`}
      />
      <label
        htmlFor={id}
        className={`absolute left-0 text-coffee-500 pointer-events-none transition-all duration-200 ${
          focused || hasValue
            ? 'top-0.5 text-[10px] uppercase tracking-widest text-coffee-400'
            : 'top-5 text-sm'
        }`}
      >
        {label}
      </label>
    </div>
  );
}

export default function Contact({ content }: { content: SiteContent }) {
  const { site } = content;
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5%' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <section id="contact" className="bg-cream-200/50 py-28 md:py-36 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">

        {/* Left copy */}
        <div ref={ref}>
          <div className="overflow-hidden mb-4">
            <motion.p
              className="text-xs font-medium uppercase tracking-widest text-coffee-400"
              initial={{ y: '110%' }}
              animate={inView ? { y: '0%' } : {}}
              transition={{ duration: 0.6 }}
            >
              — Get in Touch
            </motion.p>
          </div>
          <div className="overflow-hidden mb-8">
            <motion.h2
              className="font-display text-4xl md:text-5xl font-bold text-coffee-900 leading-tight"
              initial={{ y: '110%' }}
              animate={inView ? { y: '0%' } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Reserve a<br />
              <span className="italic font-light">table with us</span>
            </motion.h2>
          </div>

          <motion.p
            className="text-coffee-600/70 text-base leading-relaxed mb-10 max-w-sm"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Whether it&apos;s a special occasion, a team breakfast, or just need to guarantee your spot — drop us a note and we&apos;ll get back to you.
          </motion.p>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <a href={`tel:${site.phone}`} className="flex items-center gap-3 text-coffee-600 hover:text-coffee-900 transition-colors group">
              <span className="text-sm">{site.phone}</span>
              <span className="h-px w-0 bg-coffee-400 transition-all duration-300 group-hover:w-8" />
            </a>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-coffee-600 hover:text-coffee-900 transition-colors group">
              <span className="text-sm">@loka_coffee_shop</span>
              <span className="h-px w-0 bg-coffee-400 transition-all duration-300 group-hover:w-8" />
            </a>
          </motion.div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {submitted ? (
            <motion.div
              className="flex flex-col items-center justify-center h-full min-h-[320px] text-center gap-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-4 rounded-full bg-coffee-100">
                <CheckCircle2 className="h-8 w-8 text-coffee-500" />
              </div>
              <h3 className="font-display text-2xl font-bold text-coffee-900">Message Sent!</h3>
              <p className="text-coffee-600/70 text-sm max-w-xs">
                Thanks for reaching out. We&apos;ll be in touch shortly — usually within 24 hours.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FloatField id="name" label="Your Name" required value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
                <FloatField id="email" label="Email Address" type="email" required value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
              </div>
              <FloatField id="phone" label="Phone (optional)" type="tel" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
              <FloatTextarea id="message" label="Your Message" required value={form.message} onChange={(v) => setForm((f) => ({ ...f, message: v }))} />

              <button
                type="submit"
                disabled={submitting}
                className="group relative overflow-hidden rounded-full bg-coffee-800 px-8 py-4 text-xs font-medium uppercase tracking-widest text-cream-100 transition-colors hover:bg-coffee-700 disabled:opacity-60 flex items-center gap-3"
              >
                {submitting ? (
                  <>
                    <span className="h-3 w-3 rounded-full border border-cream-300/50 border-t-cream-100 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
