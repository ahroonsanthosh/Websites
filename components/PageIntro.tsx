"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

export default function PageIntro() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1400)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] bg-[#1A0F0A] flex items-center justify-center"
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
        >
          <motion.div
            className="text-center px-6"
            exit={{ opacity: 0, y: -16, transition: { duration: 0.4 } }}
          >
            <motion.h1
              className="text-white font-light"
              style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', letterSpacing: '-0.02em' }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Café<em className="italic text-[#C8A882]"> Jane</em>
            </motion.h1>
            <motion.div
              className="h-px bg-[#C8A882]/30 mt-5 origin-center"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.p
              className="text-white/25 text-[10px] tracking-[0.45em] uppercase font-light mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Cork City
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
