"use client";

import {
  ContainerScroll,
  ContainerSticky,
  ContainerAnimated,
  ContainerInset,
  HeroVideo,
} from "@/components/ui/animated-video-on-scroll";

export function VideoScroll() {
  return (
    <section className="bg-[#0a0604]">
      <ContainerScroll className="h-[280vh]">
        <ContainerSticky
          style={{
            background: "radial-gradient(50% 50% at 50% 30%, #3d1a00 0%, #1a0b00 50%, #0a0604 100%)",
          }}
          className="px-6 py-10 text-amber-50 flex flex-col items-center justify-center"
        >
          <ContainerAnimated className="space-y-4 text-center mb-8 max-w-lg mx-auto">
            <span className="text-amber-500/60 text-xs uppercase tracking-[0.4em] font-light">
              The vibe
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-amber-50 leading-tight">
              Come as you are.
              <br />
              <em className="text-amber-400 not-italic">Stay as long as you like.</em>
            </h2>
            <p className="text-stone-400 font-light text-base max-w-sm mx-auto">
              Good music, warm light, and a seat that actually feels like somewhere worth sitting.
            </p>
          </ContainerAnimated>

          <ContainerInset className="w-full max-w-3xl mx-auto h-[50vh] md:h-[60vh]">
            <HeroVideo
              src="https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4"
              className="w-full h-full object-cover rounded-2xl"
            />
          </ContainerInset>

          <ContainerAnimated
            transition={{ delay: 0.3 }}
            outputRange={[-80, 0]}
            inputRange={[0, 0.6]}
            className="mt-8 text-center"
          >
            <a
              href="#location"
              className="inline-block text-xs px-8 py-3 rounded-full border border-amber-700/60 text-amber-200 hover:bg-amber-700/20 transition-all duration-300 tracking-widest uppercase"
            >
              Get Here
            </a>
          </ContainerAnimated>
        </ContainerSticky>
      </ContainerScroll>
    </section>
  );
}
