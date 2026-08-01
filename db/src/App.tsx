import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { About } from "@/components/sections/about";
import { Menu } from "@/components/sections/menu";
import { Gallery } from "@/components/sections/gallery";
import { Visit } from "@/components/sections/visit";
import { Finale } from "@/components/sections/finale";
import { Footer } from "@/components/sections/footer";

export default function App() {
  return (
    <>
      <a
        href="#menu"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:bg-honey focus:px-4 focus:py-2 focus:text-espresso"
      >
        Skip to menu
      </a>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Menu />
        <Gallery />
        <Visit />
        <Finale />
      </main>
      <Footer />
    </>
  );
}
