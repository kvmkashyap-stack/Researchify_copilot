"use client";

import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { FileUp, FileText, CheckCircle2 } from "lucide-react";

export default function DocsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const sections = [
    {
      icon: FileUp,
      title: "Supported Documents",
      content: [
        "Scientific Publications: Upload PDF preprints, research papers, and journals.",
        "Datasets & CSVs: Process experimental spreadsheets, tabular data, and data summaries.",
        "Reports & Notes: Chat with DOCX manuscripts, textbooks, and plain text notes.",
        "Images & Charts: Process charts and research graphics within PDF files directly.",
      ],
    },
    {
      icon: FileText,
      title: "What the Copilot Does",
      content: [
        "Answers Complex Queries: Synthesizes multi-document search across all files uploaded.",
        "Web Retrieval Augmentation: Mixes internal papers with DuckDuckGo searches for live context.",
        "Literature Summary: Auto-extracts study parameters, methodologies, and limitations.",
        "Citation Indexing: Formats clear bibliography and source cards for every generated claim.",
      ],
    },
    {
      icon: CheckCircle2,
      title: "User Workflows & Projects",
      content: [
        "Create Projects: Group documents by topic or separate files by scientific discipline.",
        "Upload Files: Directly drag and drop scientific literature into the dedicated Document Hub.",
        "Start Chat: Ask questions, compare studies, and explore literature interactively.",
        "Export Results: Copy formatted markdown summaries directly into your workspace notes.",
      ],
    },
  ];

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen bg-[#050505] pt-32 px-6 overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-20 right-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs uppercase tracking-[0.25em] text-cyan-400 font-bold bg-cyan-500/10 px-4 py-1.5 rounded-full">
              User Documentation
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-white mt-6">
              Platform & Document Guide
            </h1>
            <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
              Learn how to utilize document queries, project organization, and hybrid research searches.
            </p>
          </motion.div>

          <div className="grid gap-12 lg:grid-cols-3">
            {sections.map((s, idx) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15, duration: 0.6 }}
                  className="border border-white/5 bg-white/[0.02] p-8 rounded-3xl backdrop-blur-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 mb-6">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{s.title}</h3>
                  <ul className="space-y-4">
                    {s.content.map((item, i) => (
                      <li key={i} className="text-sm text-gray-400 leading-relaxed flex items-start gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
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
