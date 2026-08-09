"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  FileSearch,
  Globe,
  Database,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Research",
    description:
      "Generate intelligent research responses powered by advanced AI models.",
  },
  {
    icon: Globe,
    title: "Web Search",
    description:
      "Search the web instantly and gather relevant research information.",
  },
  {
    icon: FileSearch,
    title: "Document Analysis",
    description:
      "Upload research papers and interact with their content effortlessly.",
  },
  {
    icon: Database,
    title: "Knowledge Base",
    description:
      "Organize conversations, references and research in one workspace.",
  },
  {
    icon: ShieldCheck,
    title: "Secure",
    description:
      "Authentication and protected research sessions built for reliability.",
  },
  {
    icon: Sparkles,
    title: "Fast Workflow",
    description:
      "Reduce hours of manual research into minutes with AI assistance.",
  },
];

export default function Features() {
  return (
    <section className="relative py-28 px-6">
      <div className="mx-auto max-w-7xl">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-gray-500">
            Features
          </p>

          <h2 className="text-5xl font-bold text-white">
            Everything you need for
            <span className="text-gray-400"> AI Research</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            A modern research workspace designed for students,
            researchers and professionals.
          </p>
        </motion.div>

        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-white/20 hover:bg-white/10"
              >
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 transition group-hover:bg-white group-hover:text-black">
                  <Icon size={28} />
                </div>

                <h3 className="mb-4 text-2xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="leading-8 text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}