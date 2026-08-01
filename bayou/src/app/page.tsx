import { readFileSync } from "fs";
import path from "path";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Statement from "@/components/Statement";
import Features from "@/components/Features";
import Menu from "@/components/Menu";
import Gallery from "@/components/Gallery";
import Marquee from "@/components/Marquee";
import Hours from "@/components/Hours";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";

async function getContent() {
  try {
    const filePath = path.join(process.cwd(), "public/data/content.json");
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

export default async function Home() {
  const data = await getContent();

  if (!data) {
    return <div className="p-12 font-sans">Failed to load content. Check public/data/content.json</div>;
  }

  return (
    <>
      <Cursor />
      <Navbar />
      <main id="main-content">
        <Hero data={data.hero} />
        <About data={data} />
        <Statement />
        <Features />
        <Menu data={data} />
        <Gallery data={data} />
        <Marquee />
        <Hours data={data} />
      </main>
      <Footer data={data} />
    </>
  );
}
