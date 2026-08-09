"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MessageSquarePlus,
  FileUp,
  Search,
  FileText,
  ArrowRight,
} from "lucide-react";

const actions = [
  {
    title: "New Chat",
    description: "Start a fresh AI research conversation.",
    href: "/dashboard/chat",
    icon: MessageSquarePlus,
  },
  {
    title: "Upload PDF",
    description: "Analyze research papers instantly.",
    href: "/dashboard/documents",
    icon: FileUp,
  },
  {
    title: "Search Papers",
    description: "Discover scientific publications.",
    href: "/dashboard/knowledge",
    icon: Search,
  },
  {
    title: "Generate Report",
    description: "Create AI-powered summaries.",
    href: "/dashboard/projects",
    icon: FileText,
  },
];

export default function QuickActions() {
  return (
    <section className="mt-8">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Launch your research workflow in one click.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.08,
              }}
              whileHover={{
                y: -5,
              }}
            >
              <Link
                href={action.href}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/20"
              >
                <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-cyan-500/5 blur-3xl opacity-0 transition duration-300 group-hover:opacity-100" />

                <div className="relative">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">
                    <Icon className="h-7 w-7 text-cyan-400" />
                  </div>

                  <h3 className="text-lg font-semibold text-white">
                    {action.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    {action.description}
                  </p>
                </div>

                <div className="relative mt-8 flex items-center gap-2 text-sm font-medium text-cyan-300">
                  Open
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}