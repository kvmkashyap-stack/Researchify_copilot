"use client";

import Link from "next/link";
import { ArrowRight, Mail, Lock, ShieldCheck, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          prompt: () => void;
          renderButton: (el: HTMLElement, config: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export default function RegisterPage() {
  const router = useRouter();
  
  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  // Flow State
  const [step, setStep] = useState<1 | 2>(1); // 1 = Creds, 2 = OTP
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [googleInitialized, setGoogleInitialized] = useState(false);

  // Google Sign-In callback
  const handleGoogleResponse = useCallback(async (response: { credential: string }) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
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
        setSuccessMsg("Google sign-in successful! Redirecting...");
        localStorage.setItem("access_token", data.access_token);
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        setErrorMsg(data.detail || "Google sign-in failed");
      }
    } catch {
      setErrorMsg("Google sign-in network failure. Check backend connection.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const isClientIdValid = (id?: string) => {
    if (!id) return false;
    const clean = id.trim();
    return clean !== "" && clean !== "undefined";
  };

  const initGoogle = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (isClientIdValid(clientId) && window.google) {
      window.google.accounts.id.initialize({
        client_id: clientId!.trim(),
        callback: handleGoogleResponse,
        use_fedcm_for_prompt: false,
      });
      setTimeout(() => {
        setGoogleInitialized(true);
      }, 0);
    }
  }, [handleGoogleResponse]);

  // Try to initialize on mount
  useEffect(() => {
    initGoogle();
  }, [initGoogle]);

  // Render Google button once initialized
  useEffect(() => {
    if (googleInitialized && window.google && step === 1) {
      const btnEl = document.getElementById("google-signup-btn");
      if (btnEl) {
        window.google.accounts.id.renderButton(btnEl, {
          theme: "filled_black",
          size: "large",
          width: "382",
          shape: "pill",
          text: "signup_with",
        });
      }
    }
  }, [googleInitialized, step]);

  const handleMockGoogleClick = () => {
    alert("Please configure NEXT_PUBLIC_GOOGLE_CLIENT_ID in your .env.local file to enable Google authentication.");
  };

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
    <>
      <Script 
        src="https://accounts.google.com/gsi/client" 
        strategy="afterInteractive" 
        onLoad={initGoogle}
      />

      {/* Top Left Logo */}
      <Link href="/" className="absolute left-8 top-8 z-50">
        <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
      </Link>

      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-6">
      
        {/* Background Glow */}
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[180px]" />

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:65px_65px]" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl"
        >
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Create Account
            </h1>
            <p className="mt-3 text-gray-400 text-sm">
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
                <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase tracking-wider">
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
                    className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-5 py-4 text-white outline-none transition focus:border-cyan-400/50 placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter secure password"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-5 py-4 text-white outline-none transition focus:border-cyan-400/50 placeholder:text-gray-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 font-semibold text-black transition hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
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
                <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase tracking-wider text-center">
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
                    className="w-full rounded-2xl border border-cyan-400/30 bg-[#070707] pl-12 pr-5 py-4 text-center text-xl font-bold tracking-[8px] text-white outline-none transition focus:border-cyan-400 placeholder:text-gray-800"
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
                  className="flex-[2] rounded-2xl border border-white/10 bg-white/5 py-4 font-semibold text-white transition hover:bg-white/10 text-center"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[3] flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 py-4 font-semibold text-black transition hover:scale-[1.02] disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : "Verify & Sign Up"}
                </button>
              </div>
            </form>
          )}

          {/* Google Sign-In Divider */}
          {step === 1 && (
            <>
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10"></div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">or</span>
                <div className="h-px flex-1 bg-white/10"></div>
              </div>

              {/* Google Sign-In Button Container */}
              {googleInitialized ? (
                <div className="flex justify-center w-full min-h-[44px]">
                  <div id="google-signup-btn" className="w-full"></div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleMockGoogleClick}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-4 font-semibold text-white transition hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                  Sign up with Google
                </button>
              )}
            </>
          )}

          <p className="mt-8 text-center text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-cyan-400 hover:underline">
              Login
            </Link>
          </p>
        </motion.div>
      </main>
    </>
  );
}
