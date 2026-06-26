"use client";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function MenuPreviewScroll() {
  return (
    /* overflow-hidden was clipping the scaled card — removed */
    <section className="bg-[var(--dark-2)] hidden md:block">
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center gap-3 px-4">
            <p className="text-[10px] tracking-[0.28em] uppercase text-[var(--amber)] font-medium">
              Experience Cocoa
            </p>
            <h2 className="text-[var(--cream)] leading-tight text-center"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              <span className="block text-2xl md:text-4xl font-normal mb-1">
                Where every detail is
              </span>
              <span className="block text-5xl md:text-7xl font-bold italic text-[var(--amber-lt)]">
                crafted with care
              </span>
            </h2>
          </div>
        }
      >
        <img
          src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1400&q=85"
          alt="Cocoa cafe — warm Edison lights, marble tables, teal walls"
          className="w-full h-full object-cover object-center rounded-2xl"
          draggable={false}
        />
      </ContainerScroll>
    </section>
  );
}
