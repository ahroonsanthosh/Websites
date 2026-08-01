"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const images = [
  {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAE9_dA0v4MI9eax-wq8iGyJ_6x3QUz-EzYG86B5aDG4cWKuJRAffWak6Qt1598l4MNKLDhrhlZmt2tl5FTe_iTAoaFeh0jH0o7ti_KwGxV9c1hta88yeCjCHCSjpwtq5iV9sVYKT0WHD0Jn=s1360-w1360-h1020-rw",
    alt: "Café dish",
    span: "col-span-1 row-span-2",
  },
  {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFRJB3zdeWodYcmV4VDeydDX5yocbJoRS3BsVCkUAAv3M5fcFWW1ycIM0Q_10Gc2fdjLjo0jfiAyv6CQFQmrT5ON3MbHzaadtGZDBiHKpwxBmmxWg0ZfJjTKPHWvZGQijvpPDFckMbOAi8=s1360-w1360-h1020-rw",
    alt: "Coffee",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEYecdd_dx1_7lhQwiM_l-Yzro-AfRS_Q0yVx2Sn8zuLKEVVFrADc1wKsRuAV89Afkga0u4flGNOIB8B0-AXH8LS5pGTRjZsBFySTFFMBE_s4qQ3Pkdvm8g8H4kesaNYqZfR2jY=s1360-w1360-h1020-rw",
    alt: "Interior",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFIQTOeyxHphbfRRXUqTVYtBD8_I5EuaTl0-yGUXKZxOG5hTLHbW5Ko5nsob0qcY4dHWuvA3P5ZIJAfwisfRPqmMquDIO1IYGmpa6wBYJdxN6rGhwzmOxqE_c6hE_xjF8q8NNvI=s1360-w1360-h1020-rw",
    alt: "Food detail",
    span: "col-span-2 row-span-1",
  },
];

export default function Gallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section id="gallery" className="py-24 md:py-32 bg-[#ede8e0]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <span className="text-[#c8864a] text-xs tracking-[0.3em] uppercase">A glimpse inside</span>
          <h2 className="font-display text-5xl md:text-6xl text-[#1a1510] mt-3 leading-tight">
            Gallery
          </h2>
          <div className="h-px w-16 bg-[#c8864a] mt-6" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[240px] md:auto-rows-[280px]">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`img-zoom rounded-2xl overflow-hidden ${img.span} ${i === 3 ? "hidden md:block" : ""}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          ))}

          {/* Extra images to fill grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="img-zoom rounded-2xl overflow-hidden col-span-1 row-span-1 hidden md:block"
          >
            <img
              src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAGXdtYnnmqAnNaMb9TJytN2Wbfk0JFTFxau8RCe3qJgb8tNHTPf3nY038EO9MrykANbLLh_MxSm0t_Hxx0uGtPopDiKGPWEuZsosrMg3z8JcAQT3iJ6q2kjL2kLMbhXKDS1YSlVrEjwwYQd=s1360-w1360-h1020-rw"
              alt="Café detail"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="img-zoom rounded-2xl overflow-hidden col-span-1 row-span-1"
          >
            <img
              src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAForw_g40uWIg-fVN2qAeYZmYkNMtc6QIEUf3YjMTnIpsVDZhPQqDCfcKW47GmCkMhYGsSVTmrJNszSzR9X4StXqrFRA5lz8TsabdPnL-N8ahOIHb456MArszeATllvwe6T7otX=s1360-w1360-h1020-rw"
              alt="Dish close-up"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
