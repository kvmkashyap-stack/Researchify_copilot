"use client";

import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { MessageSquare, FolderOpen, Brain, Search, Sparkles, BookOpen } from "lucide-react";

export default function FeaturesPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const allFeatures = [
    {
      icon: MessageSquare,
      title: "Agentic Research Chat",
      description: "Engage in targeted scientific dialogues. Ask complex questions, and the copilot dynamically gathers information to formulate structured, publication-ready answers.",
    },
    {
      icon: FolderOpen,
      title: "Interactive Document Workspace",
      description: "Upload your research corpus, including PDFs, DOCX, and text papers. Organize folders, tag documents, and keep your references structured in one unified interface.",
    },
    {
      icon: Brain,
      title: "Automated Literature Summarization",
      description: "Instantly draft comprehensive literature reviews and summaries of complex publications. Extract key methodologies, hypotheses, datasets, and conclusions in seconds.",
    },
    {
      icon: Search,
      title: "Smart Citation Retrieval",
      description: "Every response is grounded in real references. Easily locate primary sources and check verification status to eliminate model hallucinations and ensure academic rigor.",
    },
    {
      icon: BookOpen,
      title: "Multi-Source Context Synthesis",
      description: "Read across multiple papers at once. Discover hidden correlations, contrast different findings, and draw holistic conclusions across separate research files.",
    },
    {
      icon: Sparkles,
      title: "Fast-Track Scientific Discovery",
      description: "Minimize time spent searching and browsing databases manually. Reduce hours of screening literature into minutes of productive synthesis and analysis.",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden bg-[#050505] pt-32 px-6">
        
        {/* Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs uppercase tracking-[0.25em] text-cyan-400 font-bold bg-cyan-500/10 px-4 py-1.5 rounded-full">
              Capabilities
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-white mt-6">
              Features
            </h1>
            <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to gather, synthesize, and organize academic and scientific intelligence in one modern interface.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {allFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:-translate-y-2 hover:border-cyan-400/30 hover:bg-cyan-500/[0.02]"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-400 group-hover:text-black transition">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{f.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
