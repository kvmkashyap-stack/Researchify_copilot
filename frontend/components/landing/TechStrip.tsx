"use client";

import { motion } from "framer-motion";

const tech = [
  "FastAPI",
  "Groq AI",
  "Supabase",
  "RAG",
  "DuckDuckGo",
  "JWT Auth",
];

export default function TechStrip() {
  return (
    <section className="relative py-12">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-10 rounded-3xl border border-white/10 bg-white/5 px-8 py-8 backdrop-blur-xl">

        {tech.map((item, index) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            viewport={{ once: true }}
            className="text-lg font-medium text-gray-300 transition hover:text-white"
          >
            {item}
          </motion.div>
        ))}

      </div>
    </section>
  );
}