"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: 0.25 }}
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl transition-all duration-300 ${
        hover
          ? "hover:border-cyan-500/20 hover:shadow-[0_0_50px_rgba(34,211,238,0.08)]"
          : ""
      } ${className}`}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/5 blur-3xl" />

      {children}
    </motion.div>
  );
}