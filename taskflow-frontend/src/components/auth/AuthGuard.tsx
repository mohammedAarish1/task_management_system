"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isHydrated, router]);

  // Waiting for zustand to rehydrate from localStorage
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center">
        <div className="flex items-center gap-3 text-text-tertiary">
          <span className="w-5 h-5 border-2 border-text-tertiary/30 border-t-text-tertiary rounded-full animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
