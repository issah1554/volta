import { apiRequest } from "@/services/apiClient";
import { clearTokens, storeTokens } from "@/services/tokenStore";

export type AuthResponse = {
  status?: string;
  success?: boolean;
  message?: string;
  data?: {
    access_token?: string;
    refresh_token?: string;
    token_type?: string;
    [key: string]: unknown;
  };
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

export function logout() {
  return apiRequest<AuthResponse>("/auth/logout", {
    method: "POST",
  });
}

export function persistTokens(response: AuthResponse) {
  storeTokens(response.data);
}

export { clearTokens };
