"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const fade = (i: number) => ({
  hidden: { opacity: 0, x: i < 0 ? -48 : 48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: "easeOut" as const } },
});

export function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); setTimeout(() => setSent(false), 5000); }, 1200);
  }

  return (
    <section id="contact" className="py-[clamp(80px,12vw,160px)] bg-[var(--dark-2)]">
      <div ref={ref} className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)] grid grid-cols-1 lg:grid-cols-2 gap-[clamp(48px,8vw,120px)]">

        {/* Info */}
        <motion.div variants={fade(-1)} initial="hidden" animate={inView ? "visible" : "hidden"}>
          <p className="text-[11px] tracking-[0.28em] uppercase text-[var(--amber)] font-medium mb-4">Find Us</p>
          <h2 className="font-['Playfair_Display'] text-[clamp(2.4rem,6vw,5rem)] leading-[1.1] text-[var(--cream)] mb-10">
            Visit<br /><em className="text-[var(--amber-lt)]">Cocoa</em>
          </h2>

          <div className="flex flex-col gap-8">
            {[
              {
                icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>,
                label: "Address",
                content: <p className="text-[var(--grey-lt)] text-[15px] leading-relaxed">8 Winthrop Street<br />Cork City Centre, T12 EH1Y</p>,
              },
              {
                icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>,
                label: "Phone",
                content: <a href="tel:0871029894" className="text-[var(--grey-lt)] text-[15px] hover:text-[var(--cream)] transition-colors">087 102 9894</a>,
              },
              {
                icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                label: "Opening Hours",
                content: (
                  <div className="grid grid-cols-[1fr_auto] gap-y-1 gap-x-8 text-[14px]">
                    {[
                      ["Monday – Saturday", "10am – 5pm"],
                      ["Sunday", "Closed"],
                    ].map(([d, h]) => (
                      <>
                        <span key={d} className="text-[var(--grey-lt)]">{d}</span>
                        <span key={h} className="text-[var(--cream-2)] text-right">{h}</span>
                      </>
                    ))}
                  </div>
                ),
              },
              {
                icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
                label: "Social",
                content: (
                  <div className="flex gap-5">
                    <a href="https://www.instagram.com/cocoacafecork/" target="_blank" rel="noopener" className="text-[var(--grey-lt)] text-[14px] hover:text-[var(--amber)] transition-colors">Instagram</a>
                    <a href="https://www.facebook.com/COCOACAFEIE/" target="_blank" rel="noopener" className="text-[var(--grey-lt)] text-[14px] hover:text-[var(--amber)] transition-colors">Facebook</a>
                  </div>
                ),
              },
            ].map(({ icon, label, content }) => (
              <div key={label} className="flex gap-5 items-start">
                <span className="text-[var(--amber)] mt-0.5 flex-shrink-0">{icon}</span>
                <div>
                  <strong className="block text-[10px] tracking-[0.2em] uppercase text-[var(--amber)] font-medium mb-1.5">{label}</strong>
                  {content}
                </div>
              </div>
            ))}
          </div>

          <a
            href="https://maps.google.com/?q=8+Winthrop+Street+Cork"
            target="_blank" rel="noopener"
            className="inline-flex items-center mt-10 px-9 py-3.5 border border-white/20 text-[var(--cream)] text-[11px] font-medium tracking-[0.14em] uppercase hover:border-[var(--amber)] hover:bg-[rgba(200,134,10,0.08)] transition-all duration-300 hover:-translate-y-0.5"
          >
            Get Directions
          </a>
        </motion.div>

        {/* Form */}
        <motion.div variants={fade(1)} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="bg-[var(--dark-3)] p-[clamp(32px,5vw,56px)]"
        >
          <h3 className="font-['Playfair_Display'] text-[1.8rem] font-normal text-[var(--cream)] mb-9">Send Us a Message</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {[
              { id: "name", label: "Name", type: "text", placeholder: "Your name" },
              { id: "email", label: "Email", type: "email", placeholder: "your@email.com" },
            ].map(f => (
              <div key={f.id} className="flex flex-col gap-2">
                <label htmlFor={f.id} className="text-[10px] tracking-[0.2em] uppercase text-[var(--grey)] font-medium">{f.label}</label>
                <input
                  id={f.id} name={f.id} type={f.type} placeholder={f.placeholder} required
                  className="bg-white/[0.05] border border-white/10 text-[var(--cream)] placeholder:text-[var(--grey)] text-[15px] font-light px-[18px] py-3.5 outline-none focus:border-[var(--amber)] focus:bg-[rgba(200,134,10,0.04)] transition-all"
                />
              </div>
            ))}
            <div className="flex flex-col gap-2">
              <label htmlFor="subject" className="text-[10px] tracking-[0.2em] uppercase text-[var(--grey)] font-medium">Subject</label>
              <select
                id="subject" name="subject"
                className="bg-white/[0.05] border border-white/10 text-[var(--cream)] text-[15px] font-light px-[18px] py-3.5 outline-none focus:border-[var(--amber)] transition-all appearance-none"
              >
                <option value="" className="bg-[var(--dark-3)]">Select a topic…</option>
                <option className="bg-[var(--dark-3)]">Whole cake order</option>
                <option className="bg-[var(--dark-3)]">Corporate gifting</option>
                <option className="bg-[var(--dark-3)]">General enquiry</option>
                <option className="bg-[var(--dark-3)]">Feedback</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-[10px] tracking-[0.2em] uppercase text-[var(--grey)] font-medium">Message</label>
              <textarea
                id="message" name="message" rows={5} placeholder="How can we help?" required
                className="bg-white/[0.05] border border-white/10 text-[var(--cream)] placeholder:text-[var(--grey)] text-[15px] font-light px-[18px] py-3.5 outline-none focus:border-[var(--amber)] focus:bg-[rgba(200,134,10,0.04)] transition-all resize-y"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-4 bg-[var(--amber)] text-[var(--dark)] text-[11px] font-semibold tracking-[0.18em] uppercase transition-all duration-300 hover:bg-[var(--amber-lt)] disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send Message"}
            </button>
            {sent && (
              <div className="text-center py-4 bg-[rgba(200,134,10,0.1)] border border-[rgba(200,134,10,0.3)] text-[var(--amber-lt)] text-[14px]">
                Thanks! We&apos;ll be in touch soon.
              </div>
            )}
          </form>
        </motion.div>

      </div>
    </section>
  );
}
