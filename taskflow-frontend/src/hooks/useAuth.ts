"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth.store";
import { loginUser, registerUser, logoutUser } from "@/lib/auth.api";
import { LoginFormData, RegisterFormData } from "@/types";
import { getErrorMessage } from "@/lib/utils";

export function useAuth() {
  const router = useRouter();
  const { user, accessToken, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore();

  const login = useCallback(
    async (data: LoginFormData) => {
      const result = await loginUser(data);
      setAuth(result.user, result.accessToken);
      return result;
    },
    [setAuth]
  );

  const register = useCallback(
    async (data: RegisterFormData) => {
      const result = await registerUser(data);
      setAuth(result.user, result.accessToken);
      return result;
    },
    [setAuth]
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Logout locally even if server call fails
    } finally {
      storeLogout();
      router.push("/auth/login");
    }
  }, [storeLogout, router]);

  return { user, accessToken, isAuthenticated, login, register, logout };
}
