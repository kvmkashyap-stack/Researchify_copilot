"use client";

import {
  Clock3,
  FileText,
  FolderOpen,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

const chats = [
  "Transformer Scaling Laws",
  "Satellite Image Analysis",
  "LLM Evaluation Metrics",
  "Quantum Error Correction",
];

const papers = [
  "Attention Is All You Need",
  "Llama 4 Technical Report",
  "Gemini 2.5 Research",
];

const collections = [
  "Machine Learning",
  "Computer Vision",
  "Space Research",
];

export default function RecentChats() {
  return (
    <div className="space-y-6">
      {/* Recent Chats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
      >
        <div className="mb-5 flex items-center gap-2">
          <Clock3 className="h-5 w-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">
            Recent Chats
          </h3>
        </div>

        <div className="space-y-3">
          {chats.map((chat) => (
            <button
              key={chat}
              className="group flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left transition hover:border-cyan-500/20 hover:bg-white/5"
            >
              <span className="text-sm text-gray-300">
                {chat}
              </span>

              <ChevronRight className="h-4 w-4 text-gray-500 transition group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Recent Papers */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
        <div className="mb-5 flex items-center gap-2">
          <FileText className="h-5 w-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">
            Recent Papers
          </h3>
        </div>

        <div className="space-y-3">
          {papers.map((paper) => (
            <button
              key={paper}
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left text-sm text-gray-300 transition hover:border-cyan-500/20 hover:bg-white/5"
            >
              {paper}
            </button>
          ))}
        </div>
      </div>

      {/* Collections */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
        <div className="mb-5 flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">
            Collections
          </h3>
        </div>

        <div className="flex flex-wrap gap-3">
          {collections.map((collection) => (
            <span
              key={collection}
              className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300"
            >
              {collection}
            </span>
          ))}
        </div>
      </div>

      {/* AI Suggestion */}
      <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          <h3 className="font-semibold text-white">
            AI Suggestion
          </h3>
        </div>

        <p className="text-sm leading-7 text-gray-300">
          Upload your latest research paper to generate an executive summary,
          identify key contributions, compare with related work, and create
          citation-ready notes.
        </p>

        <button className="mt-6 w-full rounded-2xl bg-cyan-400 py-3 font-medium text-black transition hover:scale-[1.02]">
          Start Research
        </button>
      </div>
    </div>
  );
}