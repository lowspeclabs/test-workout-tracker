
import { motion } from "framer-motion";
import React from 'react';

export function StatCard({ title, children }: { title: string; children: React.ReactNode }) {
  const shouldReduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.section
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
      whileInView={{ opacity: 1, y: 0 }}
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
