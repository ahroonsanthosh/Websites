"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const R = "https://raw.githubusercontent.com/ahroonsanthosh/Brightside/main";

const PHOTOS = [
  {
    src: R + "/Screenshot%202026-06-26%20111123.png",
    alt: "Inside Bright Side café",
    span: "col-span-2 row-span-2",
  },
  {
    src: R + "/Screenshot%202026-06-26%20111138.png",
    alt: "Bright Side drinks and detail",
    span: "col-span-1 row-span-1",
  },
  {
    src: R + "/Screenshot%202026-06-26%20111147.png",
    alt: "Bright Side café counter",
    span: "col-span-1 row-span-1",
  },
  {
    src: R + "/Screenshot%202026-06-26%20111156.png",
    alt: "Bright Side café atmosphere",
    span: "col-span-1 row-span-2",
  },
  {
    src: R + "/Screenshot%202026-06-26%20111049.png",
    alt: "Specialty latte with latte art",
    span: "col-span-1 row-span-1",
  },
  {
    src: R + "/Screenshot%202026-06-26%20111113.png",
    alt: "Fresh food at Bright Side",
    span: "col-span-1 row-span-1",
  },
];

export function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gallery-heading",
        { autoAlpha: 0, y: 36 },
        {
          autoAlpha: 1, y: 0, ease: "expo.out", duration: 1.1,
          scrollTrigger: { trigger: ".gallery-heading", start: "top 82%", toggleActions: "play none none none" },
        }
      );
      gsap.fromTo(
        ".gallery-item",
        { autoAlpha: 0, scale: 0.96, y: 28 },
        {
          autoAlpha: 1, scale: 1, y: 0, ease: "power3.out", duration: 0.9, stagger: 0.10,
          scrollTrigger: { trigger: ".gallery-grid", start: "top 76%", toggleActions: "play none none none" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative bg-[#F0EBE1] py-28 md:py-36 px-6"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3D5A3C]/15 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="gallery-heading text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#3D5A3C]/70 font-semibold mb-4">
            The Space
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-[#2C2C2A] tracking-tight leading-none">
            A corner worth finding.
          </h2>
          <p className="mt-5 text-[#5C5C56] text-lg font-light max-w-md mx-auto">
            Tucked into Washington Street — small, calm, and made for mornings that deserve more than rushed.
          </p>
        </div>

        <div className="gallery-grid grid grid-cols-3 grid-rows-3 gap-3 md:gap-4 h-[520px] md:h-[680px]">
          {PHOTOS.map((photo) => (
            <div
              key={photo.alt}
              className={`gallery-item ${photo.span} rounded-2xl overflow-hidden group`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="https://www.instagram.com/brightsidecork/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#3D5A3C] text-sm font-semibold tracking-wide hover:opacity-70 transition-opacity duration-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            More on Instagram · @brightsidecork
          </a>
        </div>
      </div>
    </section>
  );
}
