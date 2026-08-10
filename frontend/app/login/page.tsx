"use client";

import Link from "next/link";
import { ArrowRight, Mail, Lock, RefreshCw, Eye, EyeOff, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppTheme } from "@/lib/hooks/useAppTheme";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  
  const { theme, toggleTheme } = useAppTheme();
  const isDark = theme === "dark";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data: { detail?: string; access_token?: string } = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { detail: text || `HTTP Error ${res.status}` };
      }

      if (res.ok && data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        router.push("/dashboard");
      } else {
        setErrorMsg(data.detail || "Login failed. Please verify credentials.");
      }
    } catch {
      setErrorMsg("Login network failure. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-[#050505] text-white" : "bg-[#f8fafc] text-slate-900"
    }`}>
      {/* Top Left Logo */}
      <Link href="/" className="absolute left-8 top-8 z-50">
        <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
      </Link>

      {/* Floating Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`absolute right-8 top-8 z-50 p-2.5 rounded-full border transition-all ${
          isDark 
            ? 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white' 
            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-sm'
        }`}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <main className="relative flex min-h-screen items-start justify-center overflow-hidden px-6 pt-[12vh] pb-12">

        {/* Background Glow */}
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[180px]" />

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:65px_65px]" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className={`relative z-10 w-full max-w-md rounded-3xl border p-8 backdrop-blur-2xl transition ${
            isDark 
              ? "border-white/10 bg-white/5" 
              : "border-slate-200 bg-white shadow-sm"
          }`}
        >
          <div className="mb-8 text-center">
            <h1 className={`text-4xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Welcome Back
            </h1>
            <p className={`mt-3 text-sm ${isDark ? "text-gray-400" : "text-slate-500"}`}>
              Sign in to continue your AI research journey
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="mb-4 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              {errorMsg}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>

            <div>
              <label className={`mb-2 block text-xs font-semibold uppercase tracking-wider ${isDark ? "text-gray-300" : "text-slate-600"}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="name@university.edu" 
                  className={`w-full rounded-2xl border pl-12 pr-5 py-4 outline-none transition placeholder:text-gray-600 ${
                    isDark 
                      ? "border-white/10 bg-white/5 text-white focus:border-cyan-400/50" 
                      : "border-slate-200 bg-slate-50 text-slate-900 focus:border-cyan-600/50"
                  }`} 
                />
              </div>
            </div>

            <div>
              <label className={`mb-2 block text-xs font-semibold uppercase tracking-wider ${isDark ? "text-gray-300" : "text-slate-600"}`}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter your password" 
                  className={`w-full rounded-2xl border pl-12 pr-12 py-4 outline-none transition placeholder:text-gray-600 ${
                    isDark 
                      ? "border-white/10 bg-white/5 text-white focus:border-cyan-400/50" 
                      : "border-slate-200 bg-slate-50 text-slate-900 focus:border-cyan-600/50"
                  }`} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-500 transition"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-semibold transition hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 ${
                isDark 
                  ? "bg-white text-black" 
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {loading ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <>Login <ArrowRight size={18} /></>
              )}
            </button>

          </form>

          <p className="mt-8 text-center text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-cyan-400 hover:underline"
            >
              Register
            </Link>
          </p>

        </motion.div>

      </main>
    </div>
  );
}