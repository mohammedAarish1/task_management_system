"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isHydrated: false,

      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),

      setAccessToken: (accessToken) =>
        set({ accessToken }),

      logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "taskflow-auth",
      // Only persist user, not the access token (security: token lives in memory)
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // If a user was persisted, treat them as authenticated.
          // The axios interceptor will refresh the access token on the first protected request.
          if (state.user) {
            state.isAuthenticated = true;
          }
          state.setHydrated();
        }
      },
    }
  )
);
