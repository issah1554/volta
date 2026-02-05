const ACCESS_TOKEN_KEY = "volta.access_token";
const REFRESH_TOKEN_KEY = "volta.refresh_token";
const TOKEN_TYPE_KEY = "volta.token_type";

export function storeTokens(data?: {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
}) {
  if (typeof window === "undefined" || !data) return;
  const { access_token: accessToken, refresh_token: refreshToken, token_type: tokenType } = data;

  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  if (tokenType) localStorage.setItem(TOKEN_TYPE_KEY, tokenType);
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_TYPE_KEY);
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}
