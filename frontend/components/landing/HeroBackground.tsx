"use client";

import { motion } from "framer-motion";

interface HeroBackgroundProps {
  theme?: 'light' | 'dark';
}

export default function HeroBackground({ theme = 'dark' }: HeroBackgroundProps) {
  const isDark = theme === 'dark';

  return (
    <>
      {/* Main Glow */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: isDark ? [0.45, 0.7, 0.45] : [0.35, 0.5, 0.35],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute left-1/2 top-56 h-[900px] w-[900px] -translate-x-1/2 rounded-full blur-[220px] ${
          isDark ? "bg-white/20" : "bg-cyan-500/15"
        }`}
      />

      {/* Left Glow */}
      <div className={`absolute left-0 top-0 h-[350px] w-[350px] rounded-full blur-[160px] ${
        isDark ? "bg-cyan-500/10" : "bg-cyan-500/15"
      }`} />

      {/* Right Glow */}
      <div className={`absolute right-0 top-24 h-[300px] w-[300px] rounded-full blur-[160px] ${
        isDark ? "bg-white/10" : "bg-slate-300/40"
      }`} />

      {/* Grid */}
      <div className={`absolute inset-0 bg-[size:65px_65px] ${
        isDark 
          ? "bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]" 
          : "bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)]"
      }`} />

      {/* Noise */}
      <div className={`absolute inset-0 opacity-[0.03] bg-[size:24px_24px] ${
        isDark 
          ? "bg-[radial-gradient(circle,#fff_1px,transparent_1px)]" 
          : "bg-[radial-gradient(circle,#000_1px,transparent_1px)]"
      }`} />
    </>
  );
}