
import { motion } from "framer-motion";
import React from 'react';

/**
 * MotionPage Component
 *
 * A wrapper component that applies a standard entry/exit animation to entire pages.
 * It implements a subtle fade-in and slide-up effect, consistent with the "minimal newspaper" aesthetic.
 *
 * Accessibility:
 * - Respects the user's `prefers-reduced-motion` setting by disabling the slide effect and setting duration to 0.
 */
export function MotionPage({ children }: { children: React.ReactNode }) {
  // Check for reduced motion preference to ensure accessibility compliance
  const shouldReduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Define transition physics: A gentle cubic-bezier curve for a "editorial" feel, or instant for reduced motion.
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
