"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function WelcomeBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-white/5 p-8 backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.18),transparent_45%)]" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            <Sparkles className="h-4 w-4" />
            AI Research Copilot
          </div>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Welcome back.
          </h1>
          <p className="mt-3 max-w-2xl text-gray-400">
            Continue your research, upload papers, chat with AI, and organize
            knowledge from one workspace.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-6 py-3 font-medium text-black transition hover:bg-cyan-400">
          New Research
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </motion.section>
  );
}
