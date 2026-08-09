"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import Footer from "@/components/landing/Footer";

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Load theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as 'light' | 'dark';
    if (savedTheme) {
      setTimeout(() => {
        setTheme(savedTheme);
      }, 0);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <main className="pt-28">
        <Hero theme={theme} />
        <Footer theme={theme} />
      </main>
    </div>
  );
}