import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroOverlay() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const lastSeen = localStorage.getItem('infamous_intro_seen');
    const now = new Date().getTime();
    
    // Check if seen before or if 24 hours have passed (24 * 60 * 60 * 1000 = 86400000 ms)
    if (!lastSeen || now - parseInt(lastSeen, 10) > 86400000) {
      setShowIntro(true);
      // Lock scroll
      document.body.style.overflow = 'hidden';
      localStorage.setItem('infamous_intro_seen', now.toString());
    }
  }, []);

  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => {
        setShowIntro(false);
        // Unlock scroll after animation + fade out duration
        setTimeout(() => {
          document.body.style.overflow = '';
        }, 800); // 800ms for overlay fade out
      }, 2000); // Intro plays for 2 seconds total

      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }} // Page reveal fade out duration
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center pointer-events-none"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              scale: [0.95, 1, 1, 1.02],
              filter: ['blur(20px)', 'blur(0px)', 'blur(0px)', 'blur(0px)']
            }}
            transition={{
              duration: 2,
              times: [0, 0.2, 0.75, 1], // 0.2 = 0.4s/2s, 0.75 = 1.5s/2s
              ease: ["easeOut", "linear", "easeInOut"]
            }}
            className="font-serif italic text-white font-normal tracking-[0.15em] text-[4rem] md:text-[6rem] lg:text-[8rem]"
          >
            INFAMOUS
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
