"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import HeroBackground from "./HeroBackground";

interface HeroProps {
  theme?: 'light' | 'dark';
}

export default function Hero({ theme = 'dark' }: HeroProps) {
  const isDark = theme === 'dark';

  return (
    <section className={`relative overflow-hidden transition-colors duration-300 ${
      isDark ? "bg-[#050505]" : "bg-[#f8fafc]"
    }`}>

      <HeroBackground theme={theme} />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-112px)] max-w-7xl items-center justify-center px-6">

        <motion.div
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >

          <div className={`mb-8 inline-flex rounded-full border px-5 py-2 text-sm backdrop-blur-xl transition-all duration-300 ${
            isDark 
              ? "border-white/10 bg-white/5 text-gray-300" 
              : "border-slate-200 bg-slate-100 text-slate-700"
          }`}>
            Next Generation AI Research Platform
          </div>

          <h1 className={`text-6xl font-black leading-none md:text-8xl transition-colors duration-300 ${
            isDark ? "text-white" : "text-slate-900"
          }`}>
            AI Research
            <span className={`block bg-clip-text text-transparent bg-gradient-to-r transition-all duration-300 ${
              isDark 
                ? "from-gray-300 to-white" 
                : "from-slate-700 to-slate-900"
            }`}>
              Copilot
            </span>
          </h1>

          <p className={`mx-auto mt-10 max-w-3xl text-lg leading-9 transition-colors duration-300 ${
            isDark ? "text-gray-400" : "text-slate-500"
          }`}>
            Search papers, organize knowledge, upload documents,
            discover insights and accelerate your research using AI.
          </p>

          <div className="mt-12 flex justify-center">
            <Link
              href="/login"
              className={`rounded-full px-8 py-4 font-semibold transition duration-300 hover:scale-105 ${
                isDark 
                  ? "bg-white text-black" 
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              <span className="flex items-center gap-2">
                Start Research
                <ArrowRight size={18} />
              </span>
            </Link>
          </div>

        </motion.div>

      </div>

    </section>
  );
}