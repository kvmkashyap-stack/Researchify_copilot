"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChatRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-b-2 border-cyan-400"></div>
    </div>
  );
}