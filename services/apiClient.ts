import { getAccessToken } from "@/services/tokenStore";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000/volta/api";

const DEFAULT_HEADERS: HeadersInit = {
  "Content-Type": "application/json",
};

export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function buildUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const trimmedBase = API_BASE_URL.replace(/\/+$/, "");
  const trimmedPath = path.startsWith("/") ? path : `/${path}`;
  return `${trimmedBase}${trimmedPath}`;
}

type ApiEnvelope = {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
};

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = buildUrl(path);
  const accessToken = getAccessToken();
  const authHeader =
    accessToken && !("Authorization" in (init.headers ?? {}))
      ? { Authorization: `Bearer ${accessToken}` }
      : {};

  const headers = {
    ...DEFAULT_HEADERS,
    ...(init.headers ?? {}),
    ...authHeader,
  };

  const response = await fetch(url, {
    ...init,
    headers,
  });

  const contentType = response.headers.get("content-type") ?? "";
  let payload: unknown = null;

  if (contentType.includes("application/json")) {
    payload = await response.json();
  } else {
    payload = await response.text();
  }

  const envelope = payload as ApiEnvelope;
  const hasMessage =
    typeof envelope === "object" &&
    envelope !== null &&
    "message" in envelope &&
    typeof envelope.message === "string";

  const message = hasMessage
    ? String(envelope.message)
    : response.statusText || "Request failed";

  if (!response.ok) {
    throw new ApiError(message, response.status, payload);
  }

  if (typeof envelope?.success === "boolean" && envelope.success === false) {
    throw new ApiError(message || "Request failed", response.status, payload);
  }

  return payload as T;
}
