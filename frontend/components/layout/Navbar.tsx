"use client";

import Link from "next/link";
import { Menu, User, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

interface NavbarProps {
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export default function Navbar({ theme = 'dark', onToggleTheme }: NavbarProps) {
  const isDark = theme === 'dark';

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed left-0 right-0 top-0 z-50 flex justify-center px-6 py-6"
    >
      <div className={`flex w-full max-w-7xl items-center justify-between rounded-full border px-6 py-3 backdrop-blur-xl transition-all duration-300 ${
        isDark 
          ? "border-white/10 bg-white/5" 
          : "border-slate-200 bg-white/80 shadow-sm"
      }`}>

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className={`text-sm font-semibold transition ${
              isDark ? "text-gray-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Home
          </Link>

          <Link
            href="/features"
            className={`text-sm font-semibold transition ${
              isDark ? "text-gray-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Features
          </Link>

          <Link
            href="/research"
            className={`text-sm font-semibold transition ${
              isDark ? "text-gray-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Research
          </Link>

          <Link
            href="/docs"
            className={`text-sm font-semibold transition ${
              isDark ? "text-gray-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Docs
          </Link>
        </div>

        {/* Right Side */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-full border transition-all ${
                isDark 
                  ? 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white' 
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-sm'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}

          <Link
            href="/login"
            className={`rounded-full px-5 py-2 text-sm font-bold transition hover:scale-105 ${
              isDark 
                ? "bg-white text-black" 
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            Login
          </Link>

          <button className={`rounded-full border p-2 transition ${
            isDark 
              ? "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white" 
              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}>
            <User size={16} />
          </button>
        </div>

        {/* Mobile Menu & Theme Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-full border transition ${
                isDark 
                  ? 'border-white/10 bg-white/5 text-gray-300' 
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}

          <button className={isDark ? "text-white" : "text-slate-800"}>
            <Menu size={24} />
          </button>
        </div>

      </div>
    </motion.nav>
  );
}