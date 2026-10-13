"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";

export default function AnnouncementBanner({ text }: { text: string }) {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-orange-500 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center justify-center gap-2">
              <InstagramIcon className="w-3.5 h-3.5 text-white/80 flex-shrink-0" />
              <p className="font-sans text-white text-xs font-medium tracking-wide text-center">
                {text}
              </p>
            </div>
            <button
              onClick={() => setVisible(false)}
              aria-label="Dismiss announcement"
              className="text-white/70 hover:text-white flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
