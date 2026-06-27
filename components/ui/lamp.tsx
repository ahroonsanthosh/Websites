"use client";

import React from "react";
import { motion } from "framer-motion";

export const LampContainer = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-start overflow-hidden bg-[#1A0C05] w-full z-0 ${className}`}
    >
      {/* Lamp beam */}
      <div className="relative flex w-full items-center justify-center isolate z-0 pointer-events-none" style={{ height: "10rem" }}>

        {/* Left conic beam */}
        <motion.div
          initial={{ opacity: 0.3, width: "10rem" }}
          whileInView={{ opacity: 1, width: "28rem" }}
          transition={{ delay: 0.2, duration: 1, ease: "easeInOut" }}
          style={{
            backgroundImage: `conic-gradient(from 70deg at center top, #E8622A, transparent, transparent)`,
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible"
        >
          <div className="absolute w-full left-0 bg-[#1A0C05] h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-40 h-full left-0 bg-[#1A0C05] bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        {/* Right conic beam */}
        <motion.div
          initial={{ opacity: 0.3, width: "10rem" }}
          whileInView={{ opacity: 1, width: "28rem" }}
          transition={{ delay: 0.2, duration: 1, ease: "easeInOut" }}
          style={{
            backgroundImage: `conic-gradient(from 290deg at center top, transparent, transparent, #E8622A)`,
          }}
          className="absolute inset-auto left-1/2 h-56 overflow-visible"
        >
          <div className="absolute w-40 h-full right-0 bg-[#1A0C05] bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-full right-0 bg-[#1A0C05] h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        {/* Wide orange glow orb */}
        <div className="absolute inset-auto z-10 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-[#E8622A] opacity-20 blur-3xl" />
        {/* Tight orange glow */}
        <motion.div
          initial={{ width: "6rem" }}
          whileInView={{ width: "14rem" }}
          transition={{ delay: 0.2, duration: 1, ease: "easeInOut" }}
          className="absolute inset-auto z-30 h-36 -translate-y-16 rounded-full bg-[#F4A61D] opacity-60 blur-2xl"
        />
        {/* Horizontal light bar */}
        {/* Light bar glow halo */}
        <motion.div
          initial={{ width: "8rem", opacity: 0 }}
          whileInView={{ width: "26rem", opacity: 1 }}
          transition={{ delay: 0.2, duration: 1, ease: "easeInOut" }}
          className="absolute left-1/2 -translate-x-1/2 top-0 z-50 h-6 rounded-full bg-[#F4A61D] opacity-40 blur-md"
        />
        {/* Light bar core */}
        <motion.div
          initial={{ width: "8rem", opacity: 0 }}
          whileInView={{ width: "26rem", opacity: 1 }}
          transition={{ delay: 0.2, duration: 1, ease: "easeInOut" }}
          className="absolute left-1/2 -translate-x-1/2 top-0 z-50 h-1 bg-gradient-to-r from-transparent via-[#FFF0C0] to-transparent"
        />
        {/* Cover strip — hides beam artifacts above */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#1A0C05] z-40" />
      </div>

      {/* Content sits directly below beam */}
      <div className="relative z-50 w-full -mt-14">
        {children}
      </div>
    </div>
  );
};
