
import { motion } from "framer-motion";
import React from 'react';

export function MotionPage({ children }: { children: React.ReactNode }) {
  // Check for reduced motion preference
  const shouldReduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.22, ease: [0.22, 1, 0.36, 1] };

  return (
    <motion.main
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
      transition={transition}
      style={{ minHeight: "100vh" }}
    >
      {children}
    </motion.main>
  );
}
