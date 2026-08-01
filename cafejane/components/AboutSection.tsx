"use client"
import { motion } from "framer-motion"

const images = [
  "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHgs-QKf_C20dNSo4p_-chiLoIDzicBRH05AUadc4yU__KvlweZZ2KmfIttrOS0DXvMWe4f8lGzd2p6Q_BqoUE1mxKetdm7lnila7IZdsA2AJfvvoA-pcOEMn7jCqocba1PEIweZi5cUz5S=s1360-w1360-h1020-rw",
  "https://lh3.googleusercontent.com/gps-cs-s/APNQkAH6-GIshzw81USbQmQ4cpnkugbo3PbHtAZ6dBlO98dg4Rv7ND-0Xf_a-mR_41aveOfl91TooRy_usLchQJV1_YA5UqaZsZiATlYLD-z4vxOVK5pLBTKF3BZhZKwWyouXPdIjRWe=s1360-w1360-h1020-rw",
]

const headline = "A neighbourhood café where every detail matters."

export default function AboutSection() {
  return (
    <section id="about" className="bg-[#F5F0E8] py-20 md:py-36 px-6 md:px-16 lg:px-32">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">

        {/* Text */}
        <div>
          <motion.p
            className="text-[#C8A882] text-[10px] tracking-[0.45em] uppercase mb-7 font-light"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Our Story
          </motion.p>

          <motion.h2
            className="text-[#2C1810] font-light leading-tight mb-8 text-balance"
            style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.9rem, 3.5vw, 3.2rem)', letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {headline}
          </motion.h2>

          <motion.div
            className="space-y-4 text-[#6B3F2A]/75 font-light leading-relaxed text-sm md:text-[0.925rem]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p>
              Nestled on Shandon Street in Cork, Café Jane is built on the belief
              that a great cup of coffee and a carefully prepared plate of food
              can make anyone's day a little better.
            </p>
            <p>
              We source seasonally, bake daily, and pour with intention. Whether
              you're stopping in before work or settling in for the afternoon,
              you'll always find a warm welcome and something worth lingering over.
            </p>
          </motion.div>

          <motion.div
            className="mt-10 flex items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="h-px flex-1 bg-[#C8A882]/30" />
            <span className="text-[#C8A882]/70 text-[10px] tracking-[0.35em] uppercase font-light">
              116 Shandon St
            </span>
          </motion.div>
        </div>

        {/* Images */}
        <div className="relative h-[340px] sm:h-[440px] md:h-[520px]">
          <motion.div
            className="absolute top-0 right-0 w-[72%] h-[72%] overflow-hidden rounded-[2px]"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={images[0]} alt="Café Jane" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#2C1810]/[0.08]" />
          </motion.div>

          <motion.div
            className="absolute bottom-0 left-0 w-[60%] h-[60%] overflow-hidden rounded-[2px] border-4 border-[#F5F0E8]"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={images[1]} alt="Coffee at Café Jane" className="w-full h-full object-cover" />
          </motion.div>

          <motion.div
            className="absolute z-10"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-[#2C1810] text-white text-[10px] tracking-[0.35em] uppercase px-5 py-3 font-light whitespace-nowrap">
              Cork City
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
