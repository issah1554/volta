import { apiRequest } from "@/services/apiClient";

export type AuthResponse = {
  status?: string;
  message?: string;
  data?: unknown;
  [key: string]: unknown;
};

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export function login(payload: LoginRequest) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload: RegisterRequest) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
