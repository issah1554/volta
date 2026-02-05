import { apiRequest } from "@/services/apiClient";
import { clearTokens, storeTokens } from "@/services/tokenStore";
import type { ApiResponse } from "@/types/apiResponse";

export type AuthTokens = {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  [key: string]: unknown;
};

export type AuthResponse = ApiResponse<AuthTokens>;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  password_confirm: string;
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
