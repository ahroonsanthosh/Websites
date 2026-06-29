'use client';
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import type { SiteContent } from '@/types/content';

function GalleryItem({ src, alt, index }: { src: string; alt: string; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  const delays = [0, 0.1, 0.2, 0.05, 0.15, 0.25, 0.08, 0.18, 0.28];
  const delay = delays[index % delays.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-xl group"
      style={{ aspectRatio: index % 3 === 1 ? '4/5' : '4/3' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        animate={{ scale: hovered ? 1.06 : 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        loading="lazy"
        onError={(e) => {
          const t = e.target as HTMLImageElement;
          t.onerror = null;
          t.src = `https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=70`;
        }}
      />

      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 bg-coffee-900/50 flex items-end p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.p
          className="text-cream-100 text-xs uppercase tracking-widest font-medium"
          initial={{ y: 10 }}
          animate={{ y: hovered ? 0 : 10 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          LOKA Coffee Shop
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export default function Gallery({ content }: { content: SiteContent }) {
  const { gallery } = content;
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true });

  const firstImage = gallery.images[0];
  const gridImages = gallery.images.slice(1);

  return (
    <section id="gallery" className="bg-cream-100 overflow-hidden">

      {/* ContainerScroll hero shot */}
      <ContainerScroll
        titleComponent={
          <div ref={headingRef}>
            <div className="overflow-hidden mb-3">
              <motion.p
                className="text-xs font-medium uppercase tracking-widest text-coffee-400"
                initial={{ y: '110%' }}
                animate={headingInView ? { y: '0%' } : {}}
                transition={{ duration: 0.6 }}
              >
                — Life at LOKA
              </motion.p>
            </div>
            <div className="overflow-hidden">
              <motion.h2
                className="font-display text-4xl md:text-6xl font-bold text-coffee-900 mb-4"
                initial={{ y: '110%' }}
                animate={headingInView ? { y: '0%' } : {}}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                Our Gallery
              </motion.h2>
            </div>
            <motion.p
              className="text-coffee-600/70 text-sm max-w-sm mx-auto"
              initial={{ opacity: 0 }}
              animate={headingInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              Every cup crafted, every moment savoured.
            </motion.p>
          </div>
        }
      >
        {firstImage && (
          <img
            src={firstImage.src}
            alt={firstImage.alt}
            className="w-full h-full object-cover rounded-xl"
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              t.onerror = null;
              t.src = 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1400&q=80';
            }}
          />
        )}
      </ContainerScroll>

      {/* Masonry-style grid */}
      <div className="px-6 md:px-12 pb-28">
        <div className="max-w-7xl mx-auto columns-2 md:columns-3 gap-4 space-y-4">
          {gridImages.map((img, i) => (
            <div key={i} className="break-inside-avoid">
              <GalleryItem src={img.src} alt={img.alt} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
