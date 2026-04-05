import api from "@/lib/api";
import { User, LoginFormData, RegisterFormData } from "@/types";

interface AuthResponse {
  user: User;
  accessToken: string;
}

export async function registerUser(data: RegisterFormData): Promise<AuthResponse> {
  const res = await api.post("/auth/register", data);
  return res.data.data;
}

export async function loginUser(data: LoginFormData): Promise<AuthResponse> {
  const res = await api.post("/auth/login", data);
  return res.data.data;
}

export async function logoutUser(): Promise<void> {
  await api.post("/auth/logout");
}

export async function refreshAccessToken(): Promise<string> {
  const res = await api.post("/auth/refresh");
  return res.data.data.accessToken;
}

export async function getCurrentUser(): Promise<User> {
  const res = await api.get("/auth/me");
  return res.data.data.user;
}
