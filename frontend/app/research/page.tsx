"use client";

import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Award, ShieldAlert, Zap, Layers } from "lucide-react";
import { useAppTheme } from "@/lib/hooks/useAppTheme";

export default function ResearchPage() {
  const { theme, toggleTheme } = useAppTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const steps = [
    {
      icon: Award,
      title: "Eliminating Hallucinations",
      description: "Traditional AI often fabricates facts and data. AI Research Copilot connects directly to verified literature sources and live web search indexes, ensuring every argument has a clear and trackable source.",
    },
    {
      icon: ShieldAlert,
      title: "Solving Information Overload",
      description: "With millions of scientific publications released annually, staying updated is impossible. Our system digests, groups, and cross-references multiple documents instantly, giving you a synthesized review in seconds.",
    },
    {
      icon: Layers,
      title: "Cross-Correlating Insights",
      description: "Find hidden relationships between independent publications. Easily compare findings, map methodologies, and find logical discrepancies between separate papers and studies.",
    },
    {
      icon: Zap,
      title: "Accelerating Academic Drafting",
      description: "Convert findings directly into beautifully formatted academic markdown. Speed up the process of drafting literature sections, bibliographies, summaries, and grant proposals.",
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-[#050505] text-white" : "bg-[#f8fafc] text-slate-900"
    }`}>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main className="relative min-h-screen pt-32 px-6 overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-20 left-1/3 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="text-xs uppercase tracking-[0.25em] text-cyan-400 font-bold bg-cyan-500/10 px-4 py-1.5 rounded-full">
              Value Proposition
            </span>
            <h1 className={`text-4xl sm:text-6xl font-black mt-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              Why Use AI Research Copilot?
            </h1>
            <p className={`mt-4 text-lg max-w-2xl mx-auto ${isDark ? "text-gray-400" : "text-slate-600"}`}>
              How the platform solves critical academic bottlenecks and empowers researchers to build trusted research faster.
            </p>
          </motion.div>

          <div className="space-y-12 max-w-4xl mx-auto">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.15, duration: 0.6 }}
                  className={`flex flex-col sm:flex-row items-start gap-6 border p-8 rounded-3xl backdrop-blur-xl transition ${
                    isDark 
                      ? "border-white/5 bg-white/[0.02]" 
                      : "border-slate-200 bg-white shadow-sm"
                  }`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-800"}`}>{s.title}</h3>
                    <p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-slate-600"}`}>{s.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer theme={theme} />
    </div>
  );
}
