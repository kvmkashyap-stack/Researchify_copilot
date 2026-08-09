"use client";

import { motion } from "framer-motion";
import {
  FileText,
  MessageSquare,
  Upload,
  BarChart3,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Papers Analyzed",
    value: "1,284",
    change: "+18%",
    icon: FileText,
  },
  {
    title: "AI Conversations",
    value: "642",
    change: "+11%",
    icon: MessageSquare,
  },
  {
    title: "Documents Uploaded",
    value: "328",
    change: "+24%",
    icon: Upload,
  },
  {
    title: "Research Reports",
    value: "94",
    change: "+9%",
    icon: BarChart3,
  },
];

export default function StatsCards() {
  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.08,
              duration: 0.35,
            }}
            whileHover={{
              y: -4,
            }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl transition-all duration-300 hover:border-cyan-500/20"
          >
            <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
              <div className="absolute -top-16 right-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
            </div>

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  {item.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-white">
                  {item.value}
                </h2>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {item.change}
                </div>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">
                <Icon className="h-7 w-7 text-cyan-400" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}