
import { motion } from "framer-motion";
import React from 'react';

/**
 * StatCard Component
 *
 * A reusable card container for statistics and charts.
 * Features a "reveal on scroll" animation triggered when the component enters the viewport.
 *
 * Props:
 * @param title - The header title for the card.
 * @param children - The content (charts, text, metrics) to display inside.
 */
export function StatCard({ title, children }: { title: string; children: React.ReactNode }) {
  // Accessibility check for reduced motion
  const shouldReduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.section
      // Initial state: invisible and slightly shifted down
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
      // Animate to: visible and neutral position when in viewport
      whileInView={{ opacity: 1, y: 0 }}
      // Configuration: trigger once when 20% of the element is visible
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "var(--card)",
        borderRadius: "var(--radius)",
        padding: "var(--space-3)",
        border: "1px solid var(--divider)",
        marginBottom: "16px"
      }}
    >
      <header style={{ marginBottom: "var(--space-2)", fontWeight: 600 }}>{title}</header>
      {children}
    </motion.section>
  );
}
