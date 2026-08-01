"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const vp = { once: true, amount: 0.15 };

const topics = ["Whole cake order", "Corporate gifting", "General enquiry", "Feedback"];

export function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setTimeout(() => setSent(false), 6000);
    }, 1200);
  }

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: vp,
    transition: { duration: 0.7, delay, ease: "easeOut" as const },
  });

  return (
    <section id="contact" className="section-pad bg-[var(--dark-2)] w-full">
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Section header — centered */}
        <motion.div {...fadeUp(0)} className="text-center mb-16 md:mb-20">
          <p className="text-[11px] tracking-[0.28em] uppercase text-[var(--amber)] font-medium mb-3">Find Us</p>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl lg:text-6xl leading-tight text-[var(--cream)]">
            Visit <em className="text-[var(--amber-lt)] font-normal" style={{ fontStyle: "italic" }}>Cocoa</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Info column */}
          <motion.div {...fadeUp(0.1)} className="flex flex-col gap-8">

            {[
              {
                label: "Address",
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                ),
                content: (
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    className="text-[var(--grey-lt)] text-[17px] leading-relaxed">
                    8 Winthrop Street<br />Cork City Centre, T12 EH1Y
                  </p>
                ),
              },
              {
                label: "Phone",
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                ),
                content: (
                  <a href="tel:0871029894"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    className="text-[var(--grey-lt)] text-[17px] hover:text-[var(--cream)] transition-colors">
                    087 102 9894
                  </a>
                ),
              },
              {
                label: "Opening Hours",
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ),
                content: (
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-1 text-[17px]">
                    <span className="text-[var(--grey-lt)]">Mon – Sat</span>
                    <span className="text-[var(--cream-2)]">10am – 5pm</span>
                    <span className="text-[var(--grey-lt)]">Sunday</span>
                    <span className="text-[var(--cream-2)]">Closed</span>
                  </div>
                ),
              },
              {
                label: "Follow Us",
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                ),
                content: (
                  <div className="flex gap-5">
                    <a href="https://www.instagram.com/cocoacafecork/" target="_blank" rel="noopener"
                      className="text-[var(--grey-lt)] text-[15px] tracking-wide hover:text-[var(--amber)] transition-colors font-['Inter']">
                      Instagram
                    </a>
                    <a href="https://www.facebook.com/COCOACAFEIE/" target="_blank" rel="noopener"
                      className="text-[var(--grey-lt)] text-[15px] tracking-wide hover:text-[var(--amber)] transition-colors font-['Inter']">
                      Facebook
                    </a>
                  </div>
                ),
              },
            ].map(({ label, icon, content }) => (
              <div key={label} className="flex gap-5 items-start">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ border: "1px solid rgba(200,134,10,0.3)", color: "var(--amber)" }}>
                  {icon}
                </div>
                <div>
                  <p className="text-[9px] font-['Inter'] tracking-[0.22em] uppercase text-[var(--amber)] mb-1.5 font-medium">
                    {label}
                  </p>
                  {content}
                </div>
              </div>
            ))}

            <a href="https://maps.google.com/?q=8+Winthrop+Street+Cork"
              target="_blank" rel="noopener"
              className="inline-flex items-center gap-3 mt-2 px-7 py-3.5 text-[var(--cream)] text-[11px] font-['Inter'] font-medium tracking-[0.16em] uppercase hover:bg-[rgba(200,134,10,0.08)] hover:-translate-y-0.5 transition-all duration-300"
              style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              Get Directions
            </a>
          </motion.div>

          {/* Form */}
          <motion.div {...fadeUp(0.2)}>
            <div style={{ borderTop: "1px solid rgba(200,134,10,0.4)", paddingTop: "2rem" }}
              className="mb-8">
              <p className="text-[10px] font-['Inter'] tracking-[0.24em] uppercase text-[var(--amber)] mb-2">
                Get in Touch
              </p>
              <h3 className="font-['Playfair_Display'] text-2xl md:text-3xl font-normal text-[var(--cream)]">
                Send Us a Message
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { id: "name",  label: "Your Name",   type: "text",  placeholder: "Jane Smith"         },
                  { id: "email", label: "Email Address",type: "email", placeholder: "jane@example.com"   },
                ].map(f => (
                  <div key={f.id} className="flex flex-col gap-2">
                    <label htmlFor={f.id}
                      className="text-[9px] font-['Inter'] tracking-[0.22em] uppercase text-[var(--grey)] font-medium">
                      {f.label}
                    </label>
                    <input id={f.id} name={f.id} type={f.type} placeholder={f.placeholder} required
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "none",
                        borderBottom: "1px solid rgba(255,255,255,0.15)",
                        color: "var(--cream)",
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: "17px",
                        padding: "10px 0",
                        outline: "none",
                        width: "100%",
                        transition: "border-color 0.25s",
                      }}
                      className="placeholder:text-[var(--grey)] focus:border-b-[var(--amber)]"
                      onFocus={e => (e.target.style.borderBottomColor = "var(--amber)")}
                      onBlur={e => (e.target.style.borderBottomColor = "rgba(255,255,255,0.15)")}
                    />
                  </div>
                ))}
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-2">
                <label htmlFor="subject"
                  className="text-[9px] font-['Inter'] tracking-[0.22em] uppercase text-[var(--grey)] font-medium">
                  Subject
                </label>
                <select id="subject" name="subject"
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.15)",
                    color: "var(--cream)",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "17px",
                    padding: "10px 0",
                    outline: "none",
                    width: "100%",
                    appearance: "none",
                    cursor: "pointer",
                  }}>
                  <option value="" style={{ background: "#1e1b17" }}>Select a topic…</option>
                  {topics.map(o => (
                    <option key={o} style={{ background: "#1e1b17" }}>{o}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label htmlFor="message"
                  className="text-[9px] font-['Inter'] tracking-[0.22em] uppercase text-[var(--grey)] font-medium">
                  Message
                </label>
                <textarea id="message" name="message" rows={5} placeholder="How can we help?" required
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "var(--cream)",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "17px",
                    padding: "14px 16px",
                    outline: "none",
                    width: "100%",
                    resize: "vertical",
                    transition: "border-color 0.25s",
                    lineHeight: "1.7",
                  }}
                  className="placeholder:text-[var(--grey)]"
                  onFocus={e => (e.target.style.borderColor = "var(--amber)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="group relative w-full py-4 text-[var(--dark)] text-[11px] font-['Inter'] font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(200,134,10,0.4)] disabled:opacity-50 mt-2 overflow-hidden"
                style={{ background: "var(--amber)" }}>
                <span className="relative z-10">
                  {loading ? "Sending…" : "Send Message"}
                </span>
                <span aria-hidden="true"
                  className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  style={{ background: "var(--amber-lt)" }} />
              </button>

              <AnimatePresence>
                {sent && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-center py-4 text-[15px]"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontStyle: "italic",
                      color: "var(--amber-lt)",
                      border: "1px solid rgba(200,134,10,0.25)",
                    }}>
                    Thank you — we&apos;ll be in touch soon.
                  </motion.div>
                )}
              </AnimatePresence>

            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
