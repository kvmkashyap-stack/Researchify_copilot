"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Ask",
    description:
      "Enter any research topic or question you want to explore.",
  },
  {
    number: "02",
    title: "Analyze",
    description:
      "AI searches, understands and processes information intelligently.",
  },
  {
    number: "03",
    title: "Discover",
    description:
      "Receive concise insights, references and research guidance instantly.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">

        <div className="mb-20 text-center">

          <p className="text-sm uppercase tracking-[0.35em] text-gray-500">
            Workflow
          </p>

          <h2 className="mt-4 text-5xl font-bold text-white">
            How it <span className="text-gray-400">Works</span>
          </h2>

        </div>

        <div className="grid gap-8 md:grid-cols-3">

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
            >

              <span className="text-6xl font-black text-white/10">
                {step.number}
              </span>

              <h3 className="mt-8 text-2xl font-semibold text-white">
                {step.title}
              </h3>

              <p className="mt-5 leading-8 text-gray-400">
                {step.description}
              </p>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}