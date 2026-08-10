"use client";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import Footer from "@/components/landing/Footer";
import { useAppTheme } from "@/lib/hooks/useAppTheme";

export default function Home() {
  const { theme, toggleTheme } = useAppTheme();

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