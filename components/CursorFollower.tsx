"use client"
import { useEffect, useRef, useState } from "react"
import { motion, useSpring } from "framer-motion"

export default function CursorFollower() {
  const [visible, setVisible] = useState(false)
  const [isTouch, setIsTouch] = useState(true)
  const mouseX = useSpring(0, { stiffness: 600, damping: 40 })
  const mouseY = useSpring(0, { stiffness: 600, damping: 40 })

  useEffect(() => {
    // Only show on true pointer devices
    const mq = window.matchMedia("(pointer: fine)")
    setIsTouch(!mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsTouch(!e.matches)
    mq.addEventListener("change", handler)

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      setVisible(true)
    }
    const onLeave = () => setVisible(false)

    window.addEventListener("mousemove", onMove)
    document.addEventListener("mouseleave", onLeave)
    return () => {
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
      mq.removeEventListener("change", handler)
    }
  }, [mouseX, mouseY])

  if (isTouch) return null

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
      style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ opacity: { duration: 0.15 } }}
    >
      <div className="w-2.5 h-2.5 rounded-full bg-white" />
    </motion.div>
  )
}
