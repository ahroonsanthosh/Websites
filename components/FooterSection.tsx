"use client"
import { motion } from "framer-motion"
import { MapPin, Phone, Share2, Heart } from "lucide-react"

export default function FooterSection() {
  return (
    <footer className="bg-[#1A0F0A] pt-20 pb-10 px-6 md:px-16 lg:px-32">
      <div className="max-w-7xl mx-auto">
        {/* CTA */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="text-white font-light leading-none mb-8"
            style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '-0.02em' }}
          >
            Come in for<br /><em className="italic text-[#C8A882]">a coffee.</em>
          </h2>
          <p className="text-white/40 text-sm font-light tracking-wider mb-10">
            116 Shandon Street · Gurranabraher · Cork
          </p>
          <a
            href="tel:0212410668"
            className="inline-flex items-center gap-3 text-[#C8A882] hover:text-white transition-colors duration-300 text-sm tracking-wider"
          >
            <Phone className="w-4 h-4" />
            (021) 241 0668
          </a>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-10" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <span
            className="text-white/30 font-light"
            style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', letterSpacing: '-0.01em' }}
          >
            Café Jane
          </span>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-white/30 hover:text-[#C8A882] transition-colors duration-300"
              aria-label="Follow us"
            >
              <Share2 className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="text-white/30 hover:text-[#C8A882] transition-colors duration-300"
              aria-label="We love Cork"
            >
              <Heart className="w-4 h-4" />
            </a>
            <a
              href="https://maps.google.com/?q=116+Shandon+Street+Cork"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-[#C8A882] transition-colors duration-300"
              aria-label="Get directions"
            >
              <MapPin className="w-4 h-4" />
            </a>
          </div>

          <p className="text-white/20 text-xs tracking-widest">
            © 2024 Café Jane · Cork
          </p>
        </div>
      </div>
    </footer>
  )
}
