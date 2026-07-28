"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const R = "https://raw.githubusercontent.com/ahroonsanthosh/Brightside/main";

const HOURS = [
  { day: "Monday", time: "8 am – 3 pm" },
  { day: "Tuesday", time: "8 am – 3 pm" },
  { day: "Wednesday", time: "8 am – 3 pm" },
  { day: "Thursday", time: "8 am – 3 pm" },
  { day: "Friday", time: "8 am – 3 pm" },
  { day: "Saturday", time: "Closed" },
  { day: "Sunday", time: "Closed" },
];

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-block",
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1, y: 0, ease: "expo.out", duration: 1.1, stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: "top 76%", toggleActions: "play none none none" },
        }
      );
      gsap.fromTo(
        ".contact-photo",
        { autoAlpha: 0, scale: 1.04 },
        {
          autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.4,
          scrollTrigger: { trigger: ".contact-photo", start: "top 82%", toggleActions: "play none none none" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const today = new Date().toLocaleDateString("en-IE", { weekday: "long" });

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative bg-[#F7F3EC] py-28 md:py-36 px-6"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3D5A3C]/20 to-transparent" />

      <div className="max-w-5xl mx-auto">
        <div className="contact-block text-center mb-20">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#3D5A3C]/70 font-semibold mb-4">
            Visit Us
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-[#2C2C2A] tracking-tight leading-none">
            You know where to find us.
          </h2>
          <p className="mt-5 text-[#5C5C56] text-lg font-light max-w-sm mx-auto">
            Drop in any weekday. No reservations, no fuss — just good coffee and a warm welcome.
          </p>
        </div>

        {/* Photo strip above the details */}
        <div className="contact-photo mb-14 rounded-3xl overflow-hidden h-56 md:h-72 shadow-[0_8px_40px_rgba(61,90,60,0.10)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={R + "/Screenshot%202026-06-26%20111202.png"}
            alt="Inside Bright Side café on Washington Street"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div className="contact-block space-y-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#3D5A3C]/60 font-semibold mb-3">
                Address
              </p>
              <p className="text-[#2C2C2A] text-xl font-medium leading-relaxed">
                23a Washington Street West<br />
                Cork City Centre<br />
                T12 VKP0
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#3D5A3C]/60 font-semibold mb-3">
                Follow
              </p>
              <a
                href="https://www.instagram.com/brightsidecork/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#3D5A3C] text-base font-semibold hover:opacity-70 transition-opacity"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                @brightsidecork
              </a>
            </div>

            <div className="rounded-2xl overflow-hidden h-48 md:h-56 border border-[#3D5A3C]/10">
              <iframe
                title="Bright Side location map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2461.7!2d-8.4780!3d51.8979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4844900b3ea00001%3A0x9b9bb1a8c04dfe75!2s23a%20Washington%20St%20W%2C%20Cork!5e0!3m2!1sen!2sie!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "saturate(0.7) contrast(0.95)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="contact-block">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#3D5A3C]/60 font-semibold mb-6">
              Opening Hours
            </p>
            <div className="space-y-0">
              {HOURS.map((h, i) => {
                const isToday = h.day === today;
                const isClosed = h.time === "Closed";
                return (
                  <div
                    key={h.day}
                    className={`flex items-center justify-between py-4 ${
                      i < HOURS.length - 1 ? "border-b border-[#3D5A3C]/10" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3D5A3C] shadow-[0_0_6px_rgba(61,90,60,0.6)]" />
                      )}
                      <span
                        className={`text-base font-medium ${
                          isToday ? "text-[#3D5A3C]" : "text-[#2C2C2A]"
                        } ${!isToday ? "pl-[18px]" : ""}`}
                      >
                        {h.day}
                      </span>
                      {isToday && (
                        <span className="text-[10px] uppercase tracking-widest text-[#3D5A3C]/60 font-semibold">
                          Today
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium tabular-nums ${
                        isClosed ? "text-[#5C5C56]/40" : "text-[#3D5A3C]"
                      }`}
                    >
                      {h.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
