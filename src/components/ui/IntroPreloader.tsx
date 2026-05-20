"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroPreloader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if preloader has already run in the current session
    const hasPlayed = sessionStorage.getItem("maayaa_preloader_played");
    if (!hasPlayed) {
      setShow(true);
      document.body.style.overflow = "hidden";
    }
  }, []);

  const handleAnimationComplete = () => {
    sessionStorage.setItem("maayaa_preloader_played", "true");
    setShow(false);
    document.body.style.overflow = "unset";
  };

  return (
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
          }}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#0c0c0c]"
        >
          {/* Cinematic luxury brand presentation */}
          <div className="relative flex flex-col items-center text-center px-4">
            {/* Elegant, thin border frames around brand name */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
              }}
              className="mb-4 border-t border-b border-amber-300/30 py-3 px-12"
            >
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.3em] bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100 bg-clip-text text-transparent uppercase select-none">
                MaayaaUvuu
              </h1>
            </motion.div>

            {/* Sub-label describing the brand's core line */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.4, duration: 1.2, ease: "easeOut" },
              }}
              className="text-[10px] sm:text-xs font-sans tracking-[0.5em] text-amber-200/50 uppercase select-none font-medium"
            >
              Luxury Footwear & Leather
            </motion.p>
          </div>

          {/* Minimal gold progress track indicator at bottom */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-white/10 overflow-hidden">
            <motion.div
              initial={{ left: "-100%" }}
              animate={{
                left: "100%",
                transition: {
                  duration: 2.0,
                  ease: "easeInOut",
                  repeat: 0,
                },
              }}
              className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
              onAnimationComplete={handleAnimationComplete}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
