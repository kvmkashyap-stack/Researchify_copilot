"use client";

import Link from "next/link";
import { ArrowRight, Mail, Lock, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [googleInitialized, setGoogleInitialized] = useState(false);
  const router = useRouter();

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
        localStorage.setItem("access_token", data.access_token);
        router.push("/dashboard");
      } else {
        setErrorMsg(data.detail || "Google login failed");
      }
    } catch {
      setErrorMsg("Google login network failure. Check backend connection.");
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

  // Try to initialize on mount (if script is already loaded)
  useEffect(() => {
    initGoogle();
  }, [initGoogle]);

  // Render the official Google button once initialized
  useEffect(() => {
    if (googleInitialized && window.google) {
      const btnEl = document.getElementById("google-signin-btn");
      if (btnEl) {
        window.google.accounts.id.renderButton(btnEl, {
          theme: "filled_black",
          size: "large",
          width: "382",
          shape: "pill",
          text: "signin_with",
        });
      }
    }
  }, [googleInitialized]);

  const handleMockGoogleClick = () => {
    alert("Please configure NEXT_PUBLIC_GOOGLE_CLIENT_ID in your .env.local file to enable Google authentication.");
  };

  const handleLogin = async () => {
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
        setErrorMsg(data.detail || "Login failed");
      }
    } catch {
      setErrorMsg("Login network failure. Check backend connection.");
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

      <main className="relative flex min-h-screen items-start justify-center overflow-hidden bg-[#050505] px-6 pt-[12vh] pb-12">

        {/* Background Glow */}
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[180px]" />

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:65px_65px]" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl"
        >
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white">
              Welcome Back
            </h1>

            <p className="mt-3 text-gray-400 text-sm">
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
              <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@university.edu" className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-5 py-4 text-white outline-none transition focus:border-cyan-400/50 placeholder:text-gray-600" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-5 py-4 text-white outline-none transition focus:border-cyan-400/50 placeholder:text-gray-600" />
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
                <>Login <ArrowRight size={18} /></>
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">or</span>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>

          {/* Google Sign-In Button Container */}
          {googleInitialized ? (
            <div className="flex justify-center w-full min-h-[44px]">
              <div id="google-signin-btn" className="w-full"></div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleMockGoogleClick}
              className="flex w-full h-[44px] items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 font-semibold text-white transition hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
              Sign in with Google
            </button>
          )}

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
    </>
  );
}