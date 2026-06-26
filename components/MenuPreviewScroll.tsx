"use client";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function MenuPreviewScroll() {
  return (
    <section className="bg-[var(--dark-2)] overflow-hidden">
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center gap-4">
            <p className="text-[11px] tracking-[0.28em] uppercase text-[var(--amber)] font-medium">
              Experience Cocoa
            </p>
            <h2
              className="text-[var(--cream)] leading-none"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <span className="block text-3xl md:text-5xl font-normal mb-2">
                Where every detail is
              </span>
              <span className="block text-[clamp(3rem,8vw,6rem)] font-bold italic text-[var(--amber-lt)]">
                crafted with care
              </span>
            </h2>
          </div>
        }
      >
        {/* Interior showcase image — swap with your own photo */}
        <img
          src="https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1400&q=80"
          alt="Cocoa cafe interior — fine chocolate experience"
          className="w-full h-full object-cover object-center rounded-2xl"
          draggable={false}
        />
      </ContainerScroll>
    </section>
  );
}
