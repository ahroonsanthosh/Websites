"use client"
import { motion } from "framer-motion"
import { MapPin, Phone } from "lucide-react"

export default function FooterSection() {
  return (
    <footer className="bg-[#1A0F0A] pt-16 md:pt-24 pb-10 px-6 md:px-16 lg:px-32">
      <div className="max-w-7xl mx-auto">
        {/* CTA */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="text-white font-light leading-none mb-6"
            style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 8vw, 7rem)', letterSpacing: '-0.025em' }}
          >
            Come in for<br /><em className="italic text-[#C8A882]">a coffee.</em>
          </h2>
          <p className="text-white/35 text-xs md:text-sm font-light tracking-wider mb-8">
            116 Shandon Street · Gurranabraher · Cork
          </p>
          <a
            href="tel:0212410668"
            className="inline-flex items-center gap-3 text-[#C8A882] hover:text-white transition-colors duration-300 text-sm"
          >
            <Phone className="w-4 h-4 flex-shrink-0" />
            (021) 241 0668
          </a>
        </motion.div>

        <div className="h-px bg-white/[0.08] mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <span
            className="text-white/25 font-light"
            style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', letterSpacing: '-0.01em' }}
          >
            Café Jane
          </span>

          <a
            href="https://maps.google.com/?q=116+Shandon+Street+Cork"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/25 hover:text-[#C8A882] transition-colors duration-300 text-[11px] tracking-[0.2em] uppercase"
          >
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            Get directions
          </a>

          <p className="text-white/15 text-[10px] tracking-widest">
            © 2024 Café Jane · Cork
          </p>
        </div>
      </div>
    </footer>
  )
}
