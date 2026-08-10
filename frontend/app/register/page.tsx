"use client";

import Link from "next/link";
import { ArrowRight, Mail, Lock, ShieldCheck, RefreshCw, Eye, EyeOff, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppTheme } from "@/lib/hooks/useAppTheme";

export default function RegisterPage() {
  const router = useRouter();
  
  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  
  // Flow State
  const [step, setStep] = useState<1 | 2>(1); // 1 = Creds, 2 = OTP
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { theme, toggleTheme } = useAppTheme();
  const isDark = theme === "dark";

  // Request OTP from backend
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth/register-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data: { detail?: string; message?: string } = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { detail: text || `HTTP Error ${res.status}` };
      }

      if (res.ok) {
        setStep(2);
        setSuccessMsg("Verification code sent! Please check your email inbox (and spam folder).");
      } else {
        setErrorMsg(data.detail || "Failed to send verification code. Please check details and try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An error occurred during registration. Please verify backend connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and complete registration
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
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
        setSuccessMsg("Registration successful! Logging you in...");
        localStorage.setItem("access_token", data.access_token);
        
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        setErrorMsg(data.detail || "Invalid code or verification failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An error occurred during verification. Please try again.");
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
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[180px]" />

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
            <h1 className="text-4xl font-bold tracking-tight">
              Create Account
            </h1>
            <p className={`mt-3 text-sm ${isDark ? "text-gray-400" : "text-slate-500"}`}>
              {step === 1 ? "Sign up to begin your AI research journey" : "Verify your email address to continue"}
            </p>
          </div>

          {/* Feedback Messages */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3"
              >
                {errorMsg}
              </motion.div>
            )}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl p-3"
              >
                {successMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {step === 1 ? (
            /* Step 1: Credentials Form */
            <form className="space-y-5" onSubmit={handleSendOtp}>
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
                    placeholder="Enter secure password"
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
                  <>
                    Send Verification Code
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Step 2: OTP Verification Form */
            <form className="space-y-5" onSubmit={handleVerifyOtp}>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-center">
                  6-Digit Verification Code
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className={`w-full rounded-2xl border pl-12 pr-5 py-4 text-center text-xl font-bold tracking-[8px] outline-none transition placeholder:text-gray-800 ${
                      isDark 
                        ? "border-cyan-400/30 bg-[#070707] text-white focus:border-cyan-400" 
                        : "border-cyan-600/30 bg-slate-50 text-slate-900 focus:border-cyan-600"
                    }`}
                  />
                </div>
                <p className="mt-2 text-[10px] text-gray-500 text-center">
                  For local test environments, the OTP is printed directly in the backend terminal logs.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`flex-[2] rounded-2xl border py-4 font-semibold transition text-center ${
                    isDark 
                      ? "border-white/10 bg-white/5 text-white hover:bg-white/10" 
                      : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-[3] flex items-center justify-center gap-2 rounded-2xl py-4 font-semibold transition hover:scale-[1.02] disabled:opacity-50 ${
                    isDark 
                      ? "bg-cyan-400 text-black" 
                      : "bg-cyan-600 text-white hover:bg-cyan-700"
                  }`}
                >
                  {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : "Verify & Sign Up"}
                </button>
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSendOtp({ preventDefault: () => {} } as React.FormEvent)}
                className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition mt-3 text-center w-full"
              >
                {"Didn't receive the code? Resend"}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-cyan-400 hover:underline">
              Login
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
