"use client"
import { useEffect, useRef, useState } from "react"
import { motion, useSpring } from "framer-motion"

export default function CursorFollower() {
  const [visible, setVisible] = useState(false)
  const [label, setLabel] = useState("")
  const mouseX = useSpring(0, { stiffness: 500, damping: 40 })
  const mouseY = useSpring(0, { stiffness: 500, damping: 40 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      setVisible(true)

      const el = e.target as HTMLElement
      const cursor = el.closest("[data-cursor]")
      setLabel(cursor?.getAttribute("data-cursor") ?? "")
    }
    const onLeave = () => setVisible(false)

    window.addEventListener("mousemove", onMove)
    document.addEventListener("mouseleave", onLeave)
    return () => {
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
    }
  }, [mouseX, mouseY])

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
      style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
      animate={{ opacity: visible ? 1 : 0, scale: label ? 1.5 : 1 }}
      transition={{ opacity: { duration: 0.2 }, scale: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
    >
      <div className={`rounded-full bg-white transition-all duration-300 ${label ? 'w-16 h-16' : 'w-3 h-3'} flex items-center justify-center`}>
        {label && (
          <span className="text-[#1A0F0A] text-[9px] tracking-widest uppercase font-medium mix-blend-normal">
            {label}
          </span>
        )}
      </div>
    </motion.div>
  )
}
