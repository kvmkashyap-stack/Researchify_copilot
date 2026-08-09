"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

// Simple external store for auth state to avoid setState inside useEffect
let authState: boolean | null = null;
const listeners = new Set<() => void>();

function getSnapshot() {
  return authState;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function setAuthState(value: boolean | null) {
  authState = value;
  listeners.forEach((l) => l());
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useSyncExternalStore(subscribe, getSnapshot, () => null);

  // Check auth on mount (client only)
  if (typeof window !== "undefined" && isAuthenticated === null) {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setAuthState(false);
      router.replace("/login");
    } else {
      setAuthState(true);
    }
  }

  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-cyan-400">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-cyan-400"></div>
          <p className="text-sm font-medium tracking-widest text-cyan-400/80">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
