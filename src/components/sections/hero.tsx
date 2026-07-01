"use client";

import {
  ContainerAnimated,
  ContainerInset,
  ContainerScroll,
  ContainerSticky,
  HeroButton,
  HeroVideo,
} from "@/components/ui/animated-video-on-scroll";
import { GALLERY, SITE } from "@/data/site";

export function Hero() {
  return (
    <section id="top" aria-label="Welcome to Dulce Bun House">
      <ContainerScroll className="h-[260vh]">
        <ContainerSticky
          style={{
            background:
              "radial-gradient(50% 45% at 50% 18%, #4a2c1a 0%, #34200f 30%, #221408 60%, #12090a 100%)",
          }}
          className="flex flex-col items-center justify-center px-6 py-24 text-cream"
        >
          <ContainerAnimated className="space-y-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-honey">
              Cork City · Est. on Oliver Plunkett St
            </p>
            <h1 className="font-display text-6xl font-semibold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
              Dulce
              <br />
              Bun&nbsp;House
            </h1>
            <p className="mx-auto max-w-[40ch] text-base text-cream/70 sm:text-lg">
              Handmade brioche buns, baked every morning. Proper coffee.
              Zero regrets.
            </p>
          </ContainerAnimated>

          <ContainerInset className="mt-4 max-h-[420px] w-auto py-6">
            <HeroVideo
              src="https://videos.pexels.com/video-files/8566672/8566672-uhd_2560_1440_30fps.mp4"
              poster={GALLERY[0].src}
              aria-label="Coffee and pastries at Dulce Bun House"
            />
          </ContainerInset>

          <ContainerAnimated
            transition={{ delay: 0.4 }}
            outputRange={[-120, 0]}
            inputRange={[0, 0.7]}
            className="mx-auto mt-4 w-fit"
          >
            <HeroButton
              onClick={() =>
                document
                  .getElementById("menu")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <span className="px-2 text-sm font-semibold uppercase tracking-widest text-cream">
                See the menu ↓
              </span>
            </HeroButton>
          </ContainerAnimated>

          <a
            href={SITE.mapsHref}
            target="_blank"
            rel="noreferrer"
            className="link-sweep mt-8 text-xs uppercase tracking-[0.25em] text-cream/50 hover:text-cream"
          >
            48 Oliver Plunkett St →
          </a>
        </ContainerSticky>
      </ContainerScroll>
    </section>
  );
}
