"use client";

import { motion } from "framer-motion";
import {
  Upload,
  FileSearch,
  BrainCircuit,
  FileText,
  CheckCircle2,
} from "lucide-react";

const timeline = [
  {
    title: "Research Paper Uploaded",
    description:
      "Transformer_Scaling_Laws_2026.pdf uploaded successfully.",
    time: "2 min ago",
    icon: Upload,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    title: "AI Analysis Completed",
    description:
      "Generated executive summary, keywords and important findings.",
    time: "4 min ago",
    icon: BrainCircuit,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    title: "Related Papers Found",
    description:
      "12 relevant papers discovered from the knowledge base.",
    time: "6 min ago",
    icon: FileSearch,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Research Report Generated",
    description:
      "Citation-ready report exported successfully.",
    time: "8 min ago",
    icon: FileText,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
];

export default function ResearchTimeline() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Research Timeline
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Latest AI research activities.
          </p>
        </div>

        <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-300">
          Live
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-2 h-full w-px bg-gradient-to-b from-cyan-500/50 via-cyan-500/20 to-transparent" />

        <div className="space-y-8">
          {timeline.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.4,
                }}
                className="relative flex gap-5"
              >
                <div
                  className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${item.bg}`}
                >
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>

                <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-cyan-500/20 hover:bg-white/[0.04]">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">
                      {item.title}
                    </h3>

                    <span className="text-xs text-gray-500">
                      {item.time}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    {item.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Completed Successfully
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}